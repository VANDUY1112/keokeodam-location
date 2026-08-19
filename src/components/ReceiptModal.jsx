import React from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Speaker, 
  QrCode, 
  Phone, 
  MapPin, 
  Clock,
  DollarSign
} from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, rentalRecord, homeLocation }) {
  if (!isOpen || !rentalRecord) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none print:p-0 print:bg-white">
      <div className="bg-surface-container border border-primary/40 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Top Actions (Hidden on print) */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-primary">Phiếu Thu & Hóa Đơn Cho Thuê Loa</span>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="bg-white text-gray-900 rounded-xl p-5 shadow-lg space-y-4 border border-gray-200 font-sans">
          
          {/* Brand Header */}
          <div className="text-center pb-3 border-b-2 border-dashed border-gray-300">
            <div className="text-[20px] font-black tracking-wider uppercase text-emerald-700">
              KEOKEODAM PRO
            </div>
            <div className="text-[12px] text-gray-600 font-medium">Dịch Vụ Cho Thuê Loa Kẹo Kéo Theo Tiếng</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Hotline: 0368 115 592</div>
            <div className="text-[10px] text-gray-400">Đ/C: Đường Hùng Vương, P. 7, TP. Tuy Hòa, Phú Yên</div>
          </div>

          {/* Receipt Title */}
          <div className="text-center">
            <div className="text-[15px] font-bold uppercase text-gray-800">PHIẾU TÍNH TIỀN CHO THUÊ</div>
            <div className="text-[11px] text-gray-500 font-mono">Mã ca: #{rentalRecord.id || 'HD-' + Date.now().toString().slice(-6)}</div>
          </div>

          {/* Customer & Speaker Details */}
          <div className="text-[12px] space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-500">Khách thuê:</span>
              <strong className="text-gray-900">{rentalRecord.customerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Số điện thoại:</span>
              <span className="font-mono text-gray-800">{rentalRecord.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Địa chỉ giao:</span>
              <span className="text-gray-800 text-right max-w-[200px]">{rentalRecord.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Loa bàn giao:</span>
              <span className="font-bold text-emerald-800">{rentalRecord.speakerName} ({rentalRecord.speakerId})</span>
            </div>
          </div>

          {/* Billing Calculation Table */}
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Thời gian thuê:</span>
              <span className="font-bold text-gray-900">{rentalRecord.rentHours} tiếng</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Đơn giá / giờ:</span>
              <span className="font-mono text-gray-900">{rentalRecord.hourlyRate.toLocaleString('vi-VN')} đ/h</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600">Tiền giờ hát:</span>
              <span className="font-mono text-gray-900">{(Math.round(rentalRecord.rentHours * rentalRecord.hourlyRate)).toLocaleString('vi-VN')} đ</span>
            </div>
            {rentalRecord.shippingFee > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">Phí ship ({rentalRecord.distanceKm} km):</span>
                <span className="font-mono text-gray-900">{rentalRecord.shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="bg-emerald-50 border-2 border-emerald-600 p-3 rounded-lg flex items-center justify-between">
            <span className="text-[13px] font-bold text-emerald-950 uppercase">TỔNG CỘNG THANH TOÁN:</span>
            <span className="text-[20px] font-black text-emerald-700 font-mono">
              {rentalRecord.totalAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* VietQR Transfer Guide */}
          <div className="text-center pt-2 border-t border-dashed border-gray-300">
            <div className="text-[11px] font-bold text-gray-700 mb-1 flex items-center justify-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quét Mã QR Chuyển Khoản Nhanh (VietQR / MoMo)</span>
            </div>
            {/* Simulated VietQR Box */}
            <div className="w-36 h-36 bg-gray-100 border-2 border-gray-800 rounded-xl mx-auto flex flex-col items-center justify-center p-2 shadow-inner">
              <div className="w-28 h-28 bg-gray-900 text-white font-mono text-[10px] flex items-center justify-center text-center p-2 rounded-lg leading-tight">
                [MÃ QR VIETQR MBBANK 0908123456]
              </div>
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-1">
              MB Bank • STK: 0908123456 • ĐÀM VĂN DUY
            </div>
            <div className="text-[10px] text-gray-400 mt-1 italic">
              Cảm ơn quý khách đã ủng hộ dịch vụ cho thuê loa kẹo kéo gia đình!
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-[13px]"
          >
            Đóng
          </button>
          
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-surface-dim font-bold text-[13px] flex items-center gap-2 shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>In Phiếu Thu / Lưu PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
