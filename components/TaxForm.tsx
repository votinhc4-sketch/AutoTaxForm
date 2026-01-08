import React from 'react';
import { TaxFormData } from '../types';

interface TaxFormProps {
  data: TaxFormData;
  onChange: (data: TaxFormData) => void;
}

export const TaxForm: React.FC<TaxFormProps> = ({ data, onChange }) => {
  // Grid definition: 
  // 1. STT (30px)
  // 2. ID (100px)
  // 3. Period (80px)
  // 4. Content (1fr - Flexible)
  // 5. Foreign (80px)
  // 6. VND (90px)
  // --- Split Line ---
  // 7. Chapter (60px)
  // 8. SubItem (60px)
  // 9. DBHC (60px)
  const gridLayout = "30px 100px 80px 1fr 80px 90px 60px 60px 60px";

  const toggle = (field: keyof TaxFormData) => {
    onChange({ ...data, [field]: !data[field] });
  };

  return (
    <div id="tax-form-print-area" className="bg-white p-8 shadow-lg w-full max-w-[950px] mx-auto print-font text-xs sm:text-sm border border-gray-300 leading-relaxed text-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-[15%] text-center text-[10px] sm:text-xs italic border border-transparent">
          {/* Optional placeholder space */}
        </div>
        <div className="w-[70%] text-center">
          <h1 className="font-bold text-base sm:text-lg uppercase whitespace-nowrap">Giấy nộp tiền vào ngân sách nhà nước</h1>
          <div className="flex justify-center gap-4 text-[11px] sm:text-xs">
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={data.isCash} 
                    onChange={() => toggle('isCash')} 
                /> 
                Tiền mặt
            </label>
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={data.isTransfer} 
                    onChange={() => toggle('isTransfer')} 
                /> 
                Chuyển khoản
            </label>
          </div>
          <div className="flex justify-center gap-4 text-[11px] sm:text-xs mt-1">
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={data.isVND} 
                    onChange={() => toggle('isVND')} 
                /> 
                Loại tiền: VND
            </label>
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={data.isUSD} 
                    onChange={() => toggle('isUSD')} 
                /> 
                USD
            </label>
            <span>Khác: .............</span>
          </div>
        </div>
        <div className="w-[15%] text-right text-[10px] sm:text-xs">
          <p className="font-bold">Mẫu số 02</p>
          <p>Ký hiệu: C1-02/NS</p>
          <p>Mã hiệu: .....................</p>
          <p>Số: ............................</p>
        </div>
      </div>

      <div className="text-right mb-2 italic text-[11px]">Số tham chiếu: .......................................</div>

      {/* Main Info */}
      <div className="space-y-1">
        <div className="flex flex-wrap">
          <span className="w-28 flex-shrink-0">Người nộp thuế:</span>
          <span className="font-bold uppercase flex-grow border-b border-dotted border-gray-400">{data.taxPayerName}</span>
          <span className="ml-2">Mã số thuế:</span>
          <span className="font-bold border-b border-dotted border-gray-400 w-32 text-center">{data.taxID}</span>
        </div>
        
        <div className="flex">
          <span className="w-16 flex-shrink-0">Địa chỉ:</span>
          <span className="flex-grow border-b border-dotted border-gray-400">{data.address}</span>
        </div>
        
        <div className="flex justify-between text-transparent select-none border-b border-dotted border-gray-400 pb-1 h-5">
           Placeholder
        </div>

        <div className="flex">
            <span className="w-32 flex-shrink-0">Người nộp thay:</span>
            <span className="flex-grow border-b border-dotted border-gray-400">.......................................................................................</span>
        </div>

        <div className="flex">
            <span className="w-16 flex-shrink-0">Địa chỉ:</span>
            <span className="flex-grow border-b border-dotted border-gray-400">.......................................................................................</span>
        </div>

        <div className="flex flex-wrap items-end">
          <span className="mr-1">Đề nghị NH/KBNN:</span>
          <span className="border-b border-dotted border-gray-400 flex-grow text-center">....................................</span>
          <span className="mx-1">trích TK số:</span>
          <span className="border-b border-dotted border-gray-400 flex-grow text-center">....................................</span>
          <span className="ml-1">hoặc thu tiền mặt để nộp NSNN theo:</span>
        </div>

         <div className="flex gap-4 pl-4 text-[11px] sm:text-xs my-1">
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={data.isNSNN} 
                    onChange={() => toggle('isNSNN')} 
                /> 
                TK thu NSNN
            </label>
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={data.isTamThu} 
                    onChange={() => toggle('isTamThu')} 
                /> 
                TK tạm thu
            </label>
            <label className="flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="mr-1" 
                    checked={data.isThuHoi} 
                    onChange={() => toggle('isThuHoi')} 
                /> 
                TK thu hồi hoàn thuế GTGT
            </label>
          </div>

        <div className="flex">
          <span className="w-48 flex-shrink-0">vào tài khoản của KBNN:</span>
          <span className="font-bold flex-grow border-b border-dotted border-gray-400">{data.treasuryAccount}</span>
        </div>
        
        <div className="flex">
          <span className="w-36 flex-shrink-0">Mở tại NH ủy nhiệm thu:</span>
          <span className="flex-grow border-b border-dotted border-gray-400">.......................................................................................</span>
        </div>

        <div className="flex flex-col mt-2">
            <span>Nộp theo văn bản của cơ quan có thẩm quyền: Kiểm toán nhà nước □ Thanh tra tài chính □ Thanh tra Chính phủ □ Cơ quan có thẩm quyền khác □</span>
        </div>

        <div className="flex mt-1">
          <span className="w-48 flex-shrink-0">Tên cơ quan quản lý thu:</span>
          <span className="font-bold flex-grow border-b border-dotted border-gray-400">{data.collectingAgency}</span>
        </div>
      </div>

      {/* Custom Grid Table */}
      <div className="mt-4 border-l border-t border-black text-center text-[10px]">
        {/* Row 1: Group Headers */}
        <div className="grid border-b border-black font-bold" style={{ gridTemplateColumns: gridLayout }}>
             <div className="border-r border-black p-1 flex items-center justify-center uppercase" style={{ gridColumn: "span 6" }}>
                Phần dành cho người nộp thuế ghi
             </div>
             <div className="border-r border-black p-1 flex items-center justify-center" style={{ gridColumn: "span 3" }}>
                Phần dành cho NH ủy nhiệm thu/NH phối hợp thu/KBNN ghi
             </div>
        </div>

        {/* Row 2: Column Headers */}
        <div className="grid border-b border-black font-bold bg-gray-50" style={{ gridTemplateColumns: gridLayout }}>
            <div className="border-r border-black p-1 flex items-center justify-center">STT</div>
            <div className="border-r border-black p-1 flex items-center justify-center">Số tờ khai/ Số quyết định/ Số thông báo/ Mã định danh hồ sơ (ID)</div>
            <div className="border-r border-black p-1 flex items-center justify-center">Kỳ thuế/ Ngày quyết định/ Ngày thông báo</div>
            <div className="border-r border-black p-1 flex items-center justify-center">Nội dung các khoản nộp NSNN</div>
            <div className="border-r border-black p-1 flex items-center justify-center">Số nguyên tệ</div>
            <div className="border-r border-black p-1 flex items-center justify-center">Số tiền VND</div>
            <div className="border-r border-black p-1 flex items-center justify-center">Mã chương</div>
            <div className="border-r border-black p-1 flex items-center justify-center">Mã tiểu mục</div>
            <div className="border-r border-black p-1 flex items-center justify-center">Mã ĐBHC</div>
        </div>

        {/* Row 3: Data */}
        <div className="grid border-b border-black min-h-[50px]" style={{ gridTemplateColumns: gridLayout }}>
            <div className="border-r border-black p-1 flex items-center justify-center">1</div>
            <div className="border-r border-black p-1 flex items-center justify-center break-words">{data.documentID}</div>
            <div className="border-r border-black p-1 flex items-center justify-center break-words">{data.taxPeriod}</div>
            <div className="border-r border-black p-1 text-left break-words">{data.paymentContent}</div>
            <div className="border-r border-black p-1 flex items-center justify-end">{data.amountForeign}</div>
            <div className="border-r border-black p-1 flex items-center justify-end">{data.amountVND}</div>
            <div className="border-r border-black p-1 flex items-center justify-center">{data.chapterCode}</div>
            <div className="border-r border-black p-1 flex items-center justify-center">{data.subItemCode}</div>
            <div className="border-r border-black p-1 flex items-center justify-center">{data.dbhcCode}</div>
        </div>
        
        {/* Row 4: Empty Filler */}
         <div className="grid border-b border-black min-h-[30px]" style={{ gridTemplateColumns: gridLayout }}>
            <div className="border-r border-black"></div>
            <div className="border-r border-black"></div>
            <div className="border-r border-black"></div>
            <div className="border-r border-black"></div>
            <div className="border-r border-black"></div>
            <div className="border-r border-black"></div>
            <div className="border-r border-black"></div>
            <div className="border-r border-black"></div>
            <div className="border-r border-black"></div>
        </div>

        {/* Row 5: Totals */}
        <div className="grid font-bold" style={{ gridTemplateColumns: gridLayout }}>
           <div className="border-r border-black p-1 text-center" style={{ gridColumn: "span 4" }}>Tổng cộng</div>
           <div className="border-r border-black p-1 text-right">{data.amountForeign}</div>
           <div className="border-r border-black p-1 text-right">{data.amountVND}</div>
           <div className="border-r border-black"></div>
           <div className="border-r border-black"></div>
           <div className="border-r border-black"></div>
        </div>
         {/* Bottom border fix for last col */}
         <div className="border-t border-black"></div> 
      </div>

      <div className="mt-2 mb-4">
        <span className="">Tổng số tiền ghi bằng chữ: </span>
        <span className="italic font-bold">{data.totalAmountText}</span>
      </div>

      {/* Footer Box */}
      <div className="border border-black p-2 mb-4">
        <h3 className="font-bold underline mb-1">PHẦN DÀNH CHO KBNN GHI KHI HẠCH TOÁN:</h3>
        <div className="flex gap-4">
          <div className="flex-1">Mã CQ thu: <span className="font-bold">{data.agencyCode || "..........................................."}</span></div>
          <div className="flex-1">
            <p>Nợ TK: ...........................................</p>
            <p>Có TK: ...........................................</p>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-6 mb-12">
        <div className="text-center">
            <p className="font-bold uppercase">Người nộp tiền</p>
            <p className="italic text-[11px] mb-8">Ngày... tháng... năm...</p>
            <div className="flex justify-around">
               <div>
                 <p className="font-bold">Người nộp tiền</p>
               </div>
               <div>
                  <p className="font-bold">Kế toán trưởng</p>
               </div>
               <div>
                  <p className="font-bold">Thủ trưởng đơn vị</p>
               </div>
            </div>
        </div>
        <div className="text-center">
             <p className="font-bold uppercase">Ngân hàng/Kho bạc nhà nước</p>
             <p className="italic text-[11px] mb-8">Ngày................tháng........năm......</p>
              <div className="flex justify-around">
               <div>
                 <p className="font-bold">Thủ quỹ</p>
               </div>
               <div>
                  <p className="font-bold">Kế toán</p>
               </div>
               <div>
                  <p className="font-bold">Kế toán trưởng</p>
               </div>
            </div>
            <p className="italic text-[10px] mt-8">(ghi chức danh, ký, họ tên và đóng dấu)</p>
        </div>
      </div>
    </div>
  );
};