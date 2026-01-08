import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { TaxForm } from './components/TaxForm';
import { TaxFormData } from './types';
import { numberToVietnameseText } from './utils/moneyUtils';
import { Printer, Download } from 'lucide-react';

// Declare html2pdf as a global variable loaded from the script tag in index.html
declare var html2pdf: any;

const INITIAL_DATA: TaxFormData = {
  taxPayerName: "",
  taxID: "",
  address: "",
  collectingAgency: "...",
  treasuryAccount: "...",
  agencyCode: "",
  paymentContent: "Lệ phí môn bài",
  amountForeign: "50.000",
  amountVND: "50.000",
  chapterCode: "757",
  subItemCode: "2863",
  documentID: "",
  taxPeriod: "",
  dbhcCode: "",
  isCash: false,
  isTransfer: false,
  isVND: false,
  isUSD: false,
  isNSNN: false,
  isTamThu: false,
  isThuHoi: false,
  totalAmountText: numberToVietnameseText("50000")
};

export default function App() {
  const [formData, setFormData] = useState<TaxFormData>(INITIAL_DATA);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('tax-form-print-area');
    
    // Check if library is loaded
    if (typeof html2pdf === 'undefined') {
        console.error("html2pdf library not loaded");
        alert("Lỗi: Thư viện tạo PDF chưa tải xong. Vui lòng tải lại trang.");
        setIsGeneratingPdf(false);
        return;
    }

    const opt = {
      margin: 5,
      filename: 'giay-nop-tien-C1-02-NS.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        setIsGeneratingPdf(false);
    }).catch((err: any) => {
        console.error("PDF Generation Error", err);
        alert("Có lỗi khi tạo PDF. Vui lòng thử lại.");
        setIsGeneratingPdf(false);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 text-white p-4 shadow-md print:hidden">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center font-bold text-lg">C1</div>
             <h1 className="text-xl font-bold">Auto Tax Form</h1>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              <span>{isGeneratingPdf ? 'Đang tạo...' : 'Tải PDF (A4)'}</span>
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
            >
              <Printer size={18} />
              <span>In Biểu mẫu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Inputs (Hidden on Print) */}
        <div className="w-full lg:w-1/3 print:hidden">
          <InputForm data={formData} onChange={setFormData} />
          
          <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
            <h4 className="font-bold mb-2">Hướng dẫn:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nhập <strong>Tên</strong>, <strong>Mã số thuế</strong> và <strong>Địa chỉ</strong>.</li>
              <li>Nhấn <strong>"Tự động điền"</strong> để AI xác định Cơ quan thu & KBNN dựa trên địa chỉ (Phường/Xã, Quận/Huyện).</li>
              <li>Kiểm tra các mục mặc định (Lệ phí môn bài, số tiền, chương, tiểu mục) và sửa nếu cần.</li>
              <li>Các ô tích chọn (Tiền mặt, Chuyển khoản, Loại tiền...) trên biểu mẫu có thể tích trực tiếp.</li>
              <li>Nhấn <strong>Tải PDF</strong> để lưu file hoặc <strong>In biểu mẫu</strong> để in ra giấy.</li>
            </ul>
          </div>
        </div>

        {/* Right Panel: Preview (Takes full width on Print) */}
        <div className="w-full lg:w-2/3 overflow-x-auto lg:overflow-visible flex justify-center bg-gray-200 lg:bg-transparent p-4 lg:p-0 rounded-lg lg:rounded-none">
          <div className="print:w-full print:absolute print:top-0 print:left-0 print:m-0">
             <TaxForm data={formData} onChange={setFormData} />
          </div>
        </div>
      </main>

       {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm print:hidden">
        <p>&copy; {new Date().getFullYear()} Auto Tax Form App. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}