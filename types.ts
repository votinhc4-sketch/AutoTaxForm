export interface TaxFormData {
  // Required User Inputs
  taxPayerName: string;
  taxID: string;
  address: string;

  // AI Derived / Auto-filled
  collectingAgency: string; // Cơ quan quản lý thu
  treasuryAccount: string; // Vào tài khoản của KBNN
  agencyCode: string; // Mã cơ quan thu (New)
  
  // Defaults (Editable)
  paymentContent: string; // Nội dung các khoản nộp
  amountForeign: string; // Số nguyên tệ
  amountVND: string; // Số tiền VND
  chapterCode: string; // Mã chương
  subItemCode: string; // Mã tiểu mục

  // New fields requested
  documentID: string; // Số tờ khai/Số quyết định...
  taxPeriod: string; // Kỳ thuế...
  dbhcCode: string; // Mã ĐBHC

  // Checkbox states
  isCash: boolean; // Tiền mặt
  isTransfer: boolean; // Chuyển khoản
  isVND: boolean; // Loại tiền: VND
  isUSD: boolean; // USD
  isNSNN: boolean; // TK thu NSNN
  isTamThu: boolean; // TK tạm thu
  isThuHoi: boolean; // TK thu hồi hoàn thuế GTGT

  // Calculated
  totalAmountText: string;
}

export interface AgencyPrediction {
  collectingAgency: string;
  treasuryAccount: string;
  agencyCode: string;
}

export interface AddressComponents {
  ward: string;
  province: string;
  treasuryAccount: string;
}

export interface TaxAgency {
  code: string;
  name: string;
}