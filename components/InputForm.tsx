import React, { useState } from 'react';
import { TaxFormData } from '../types';
import { predictAgencyInfo } from '../services/geminiService';
import { formatCurrency, numberToVietnameseText } from '../utils/moneyUtils';
import { Loader2, Wand2 } from 'lucide-react';

interface InputFormProps {
  data: TaxFormData;
  onChange: (data: TaxFormData) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ data, onChange }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [addressError, setAddressError] = useState("");

  const handleChange = (field: keyof TaxFormData, value: string) => {
    let updatedData = { ...data, [field]: value };

    // Auto-format currency fields and update text total
    if (field === 'amountVND') {
      const formatted = formatCurrency(value);
      updatedData.amountVND = formatted;
      updatedData.amountForeign = formatted; // Sync foreign amount as per prompt default behavior logic
      updatedData.totalAmountText = numberToVietnameseText(formatted);
    }
    
    onChange(updatedData);
  };

  const handleAnalyzeAddress = async () => {
    if (!data.address || data.address.length < 5) {
      setAddressError("Vui lòng nhập địa chỉ đầy đủ (bao gồm Phường/Xã, Quận/Huyện, Tỉnh/TP) trước khi phân tích.");
      return;
    }
    setAddressError("");
    setIsAnalyzing(true);
    try {
      const prediction = await predictAgencyInfo(data.address);
      onChange({
        ...data,
        collectingAgency: prediction.collectingAgency,
        treasuryAccount: prediction.treasuryAccount,
        agencyCode: prediction.agencyCode
      });
    } catch (error) {
      setAddressError("Lỗi khi kết nối AI. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Thông tin nộp thuế</h2>
      
      {/* Required Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Người nộp thuế <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={data.taxPayerName}
            onChange={(e) => handleChange('taxPayerName', e.target.value)}
            placeholder="Ví dụ: Công ty TNHH ABC..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mã số thuế <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={data.taxID}
            onChange={(e) => handleChange('taxID', e.target.value)}
            placeholder="0101234567..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Địa chỉ <span className="text-red-500">*</span></label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP..."
            />
            <button
              onClick={handleAnalyzeAddress}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 min-w-[140px] justify-center"
            >
              {isAnalyzing ? <Loader2 className="animate-spin h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
              {isAnalyzing ? "Đang xử lý..." : "Tự động điền"}
            </button>
          </div>
          {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
          <p className="text-xs text-gray-500 mt-1">Ứng dụng sẽ dựa vào địa chỉ để tìm Cơ quan thu và KBNN tương ứng.</p>
        </div>
      </div>

      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
          <label className="block text-sm font-medium text-gray-700">Cơ quan quản lý thu (Tự động theo địa chỉ)</label>
          <input
            type="text"
            className="mt-1 block w-full bg-gray-50 rounded-md border-gray-300 border p-2 text-gray-700 font-semibold"
            value={data.collectingAgency}
            onChange={(e) => handleChange('collectingAgency', e.target.value)}
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Mã cơ quan thu (Tự động)</label>
           <input
             type="text"
             className="mt-1 block w-full bg-gray-50 rounded-md border-gray-300 border p-2 text-gray-700"
             value={data.agencyCode}
             onChange={(e) => handleChange('agencyCode', e.target.value)}
           />
         </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Vào tài khoản của KBNN (Tự động)</label>
          <input
            type="text"
            className="mt-1 block w-full bg-gray-50 rounded-md border-gray-300 border p-2 text-gray-700"
            value={data.treasuryAccount}
            onChange={(e) => handleChange('treasuryAccount', e.target.value)}
          />
        </div>
      </div>

      {/* Payment Details */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-semibold text-gray-700">Chi tiết khoản nộp (Mặc định)</h3>
        
        {/* New optional fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700">Số tờ khai/Quyết định (ID)</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 border p-2"
              value={data.documentID}
              onChange={(e) => handleChange('documentID', e.target.value)}
              placeholder="..."
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Kỳ thuế/Ngày quyết định</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 border p-2"
              value={data.taxPeriod}
              onChange={(e) => handleChange('taxPeriod', e.target.value)}
              placeholder="MM/YYYY"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nội dung các khoản nộp NSNN</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 border p-2"
            value={data.paymentContent}
            onChange={(e) => handleChange('paymentContent', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Số tiền (VND)</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 font-mono font-bold text-right"
              value={data.amountVND}
              onChange={(e) => handleChange('amountVND', e.target.value)}
            />
          </div>
           <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Mã chương</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-center"
              value={data.chapterCode}
              onChange={(e) => handleChange('chapterCode', e.target.value)}
            />
          </div>
           <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Mã tiểu mục</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-center"
              value={data.subItemCode}
              onChange={(e) => handleChange('subItemCode', e.target.value)}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Mã ĐBHC</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-center"
              value={data.dbhcCode}
              onChange={(e) => handleChange('dbhcCode', e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded text-blue-800 text-sm italic border border-blue-100">
           Số tiền bằng chữ: {data.totalAmountText}
        </div>
      </div>
    </div>
  );
};