import { GoogleGenAI, Type } from "@google/genai";
import { AgencyPrediction } from "../types";
import { getAgencyData } from "../data/agencyData";
import { findTreasuryFromDB } from "../utils/treasuryUtils";

export const predictAgencyInfo = async (address: string): Promise<AgencyPrediction> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    throw new Error("API Key is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Get relevant data subset based on province/city in address for Tax Agency
  const relevantData = getAgencyData(address);

  // 2. Constructed Prompt
  // We ask Gemini to do TWO things:
  // A. Find the Tax Collecting Agency (as before).
  // B. CLEAN the address into District and Province so we can query our internal DB.
  const prompt = `
    Input Address: "${address}".

    Task 1: Identify "collectingAgency" (Tên cơ quan quản lý thu):
       - Look at the address (Ward, District, Province/City).
       - Find the best matching Tax Agency from the "Tax Reference Data" below.
       - Logic: If address is in a Ward/Commune listed in the data, prefer that. Otherwise, choose the District Tax Department (Chi cục Thuế) or Province Tax Department (Cục Thuế).
    
    Task 2: Extract "agencyCode" (Mã cơ quan thu) corresponding to the chosen agency.

    Task 3: Extract "district" and "province" from the input address.
       - Return normalized Vietnamese names (e.g., "Quận 1", "Thành phố Thủ Đức", "Hà Nội").

    Tax Reference Data (CSV Subset):
    \`\`\`csv
    ${relevantData}
    \`\`\`

    Return JSON object with keys: collectingAgency, agencyCode, district, province.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            collectingAgency: { type: Type.STRING },
            agencyCode: { type: Type.STRING },
            district: { type: Type.STRING },
            province: { type: Type.STRING },
          },
          required: ["collectingAgency", "agencyCode", "district", "province"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    
    // 3. Post-process: Look up Treasury in local DB using extracted location
    const dbTreasury = findTreasuryFromDB(parsed.district || "", parsed.province || "");
    
    // Fallback logic if DB lookup fails (use AI's inferred capability or generic region logic if needed, 
    // but here we stick to the extracted components to ensure high fidelity to the user's CSV).
    const treasuryAccount = dbTreasury 
      ? dbTreasury 
      : `Kho bạc Nhà nước ${parsed.province}`; // Fallback to generic province treasury

    return {
      collectingAgency: parsed.collectingAgency,
      treasuryAccount: treasuryAccount,
      agencyCode: parsed.agencyCode,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      collectingAgency: "Không tìm thấy thông tin",
      treasuryAccount: "Không tìm thấy thông tin",
      agencyCode: "",
    };
  }
};