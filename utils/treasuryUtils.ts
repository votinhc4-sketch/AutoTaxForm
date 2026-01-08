import { rawTreasuryCSV } from '../data/rawTreasuryCSV';

// Data Structure: RegionRoman -> { DistrictNormalized: PGD_Name }
let regionDataMap: Record<string, Record<string, string>> | null = null;

const normalize = (str: string) => {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\b(quan|huyen|thanh pho|thi xa|tinh|phuong|xa|dac khu)\b/g, "") // remove administrative prefixes
    .replace(/[^a-z0-9\s]/g, "") // remove special chars
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
};

const PROVINCE_TO_REGION: Record<string, string> = {
    "ha noi": "I",
    "ho chi minh": "II",
    "hai phong": "III", "quang ninh": "III",
    "hung yen": "IV", "ha nam": "IV", "nam dinh": "IV", "ninh binh": "IV",
    "bac ninh": "V", "hai duong": "V", "thai binh": "V",
    "bac giang": "VI", "lang son": "VI", "bac kan": "VI", "cao bang": "VI",
    "thai nguyen": "VII", "tuyen quang": "VII", "ha giang": "VII",
    "vinh phuc": "VIII", "phu tho": "VIII", "yen bai": "VIII", "lao cai": "VIII",
    "hoa binh": "IX", "son la": "IX", "dien bien": "IX", "lai chau": "IX",
    "thanh hoa": "X", "nghe an": "X",
    "ha tinh": "XI", "quang binh": "XI", "quang tri": "XI",
    "hue": "XII", "thua thien hue": "XII", "da nang": "XII", "quang nam": "XII", "quang ngai": "XII",
    "binh dinh": "XIII", "phu yen": "XIII", "khanh hoa": "XIII", "lam dong": "XIII",
    "gia lai": "XIV", "kon tum": "XIV", "dak lak": "XIV", "dak nong": "XIV",
    "ninh thuan": "XV", "binh thuan": "XV", "dong nai": "XV", "ba ria vung tau": "XV", "ba ria - vung tau": "XV",
    "binh duong": "XVI", "binh phuoc": "XVI", "tay ninh": "XVI",
    "long an": "XVII", "tien giang": "XVII", "vinh long": "XVII",
    "tra vinh": "XVIII", "ben tre": "XVIII", "soc trang": "XVIII",
    "an giang": "XIX", "dong thap": "XIX", "can tho": "XIX", "hau giang": "XIX",
    "kien giang": "XX", "ca mau": "XX", "bac lieu": "XX"
};

const toRoman = (num: number) => {
    const romans = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
    return romans[num] || "";
}

const parseCSV = () => {
  if (regionDataMap) return;
  regionDataMap = {};

  const lines = rawTreasuryCSV.split('\n');
  let currentRegionRoman = "";
  let currentTransactionOffice = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Custom split to handle quoted fields containing commas (though not expected in this specific file, it's safer)
    // Since the file format is consistent: "STT","PGD","DiaBan","TruSo"
    // We can just strip quotes and split by ","
    // However, regex is safer for generic CSV lines.
    const parts: string[] = [];
    let currentPart = '';
    let inQuote = false;
    for (let char of line) {
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            parts.push(currentPart);
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    parts.push(currentPart);

    if (parts.length < 3) continue;
    const cleanParts = parts.map(p => p.trim());

    const col0 = cleanParts[0]; // STT or Region Header
    const col1 = cleanParts[1]; // PGD
    const col2 = cleanParts[2]; // Dia Ban

    // 1. Detect Region Header (e.g., "KHU VỰC 1 - HÀ NỘI")
    if (col0.toUpperCase().startsWith("KHU VỰC")) {
         const match = col0.match(/KHU VỰC\s+(\d+)/i);
         if (match) {
             currentRegionRoman = toRoman(parseInt(match[1]));
             if (!regionDataMap[currentRegionRoman]) {
                 regionDataMap[currentRegionRoman] = {};
             }
         }
         currentTransactionOffice = ""; // Reset PGD when region changes
         continue;
    }

    // 2. Track Transaction Office (PGD)
    // If column 1 has text (e.g. "Phòng Giao dịch số 1"), update current.
    // If empty, it inherits from the previous row (merged cell logic).
    if (col1) {
        currentTransactionOffice = col1;
    }

    // 3. Map District to Current PGD + Region
    // Only map if we have a valid district name and we are inside a region block
    const districtName = col2;
    if (districtName && currentRegionRoman && currentTransactionOffice) {
        // Skip rows that are purely headers for provinces inside a region (e.g., "Hải phòng", "Quảng Ninh")
        // UNLESS they have a specific PGD assigned on that same row (e.g. Row 32: "Tỉnh Quảng Ninh" -> PGD số 5).
        // Heuristic: If col1 was empty, and col2 is a province name, it might be a sub-header.
        // But our logic inherits `currentTransactionOffice`.
        // To avoid mapping "Hải phòng" to the previous PGD of the previous block, we check logic.
        // However, in the CSV, "Hải phòng" row (Row 28 prev) is "","","Hải phòng","".
        // col1 is empty. If we carried over PGD from row 27 (HCM), that's bad.
        // FIX: The CSV puts Region Headers between regions, which resets `currentTransactionOffice`.
        // So `currentTransactionOffice` would be "" when hitting "Hải phòng" header.
        // So we are safe.
        
        const key = normalize(districtName);
        if (key) {
            regionDataMap[currentRegionRoman][key] = currentTransactionOffice;
        }
    }
  }
};

export const findTreasuryFromDB = (district: string, province: string): string | null => {
    if (!regionDataMap) parseCSV();

    const normProv = normalize(province);
    const regionRoman = PROVINCE_TO_REGION[normProv];

    if (!regionRoman) {
        // Fallback: If province name isn't standard, try searching regionDataMap values?
        // No, too expensive. Return null to let AI defaults or generic handle it.
        return null; 
    }

    const regionMap = regionDataMap![regionRoman];
    if (!regionMap) return `Kho bạc Nhà nước khu vực ${regionRoman}`; // Fallback

    const normDist = normalize(district);
    
    // 1. Exact Match
    if (regionMap[normDist]) {
        return `${regionMap[normDist]} - Kho bạc Nhà nước khu vực ${regionRoman}`;
    }

    // 2. Partial Match (e.g. "Thu Duc" matching "Thanh pho Thu Duc")
    for (const key in regionMap) {
        if (normDist.includes(key) || key.includes(normDist)) {
             return `${regionMap[key]} - Kho bạc Nhà nước khu vực ${regionRoman}`;
        }
    }

    // 3. Region Default
    // If we identified the region (e.g. Hanoi -> I), but district not found (e.g. typo),
    // return the Regional Treasury Name itself as a safe fallback? 
    // Or maybe "Sở Giao dịch - ..." for major cities? 
    // Stick to generic Region name for safety.
    return `Kho bạc Nhà nước khu vực ${regionRoman}`;
};
