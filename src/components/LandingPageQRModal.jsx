import React, { useState } from 'react';

export default function LandingPageQRModal({
  isOpen,
  onClose,
  setToast = null
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  // Target Vercel domain URL
  const targetUrl = 'https://keokeodam-location.vercel.app/?page=landing';

  // Clean, sharp, high-contrast QR code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=8&ecc=M&color=33-16-43&bgcolor=ffffff&data=${encodeURIComponent(targetUrl)}`;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  // Download crisp PNG QR image
  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR-KeoKeoDam.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      if (setToast) {
        setToast({
          title: 'Tải thành công!',
          desc: 'Hình ảnh mã QR đã được tải về máy.',
          type: 'success'
        });
      }
    } catch (err) {
      window.open(qrCodeUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintStandee = () => {
    window.print();
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-250 ease-out ${
        isClosing
          ? 'opacity-0 bg-black/0 backdrop-blur-none'
          : 'opacity-100 bg-black/25 backdrop-blur-[2px]'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl sm:rounded-3xl max-w-sm w-full p-6 sm:p-7 border-2 border-[#ffd9e3] shadow-[0_20px_50px_rgba(134,77,97,0.20)] relative overflow-hidden transition-all duration-250 ease-out transform ${
          isClosing ? 'scale-95 translate-y-4 opacity-0' : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#ffd9e3] text-[#864d61] flex items-center justify-center border border-[#fab3ca] shadow-xs shrink-0">
              <span className="material-symbols-outlined text-2xl">qr_code_2</span>
            </div>
            <h3 className="font-headline text-xl text-[#864d61]">Mã QR Landing Page</h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* QR Code Container (Clean, Minimal, Non-AI) */}
        <div className="bg-[#fdf7ff] rounded-2xl p-4 border border-[#ffd9e3] flex flex-col items-center justify-center">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center">
            <img
              src={qrCodeUrl}
              alt="Mã QR Kẹo Kéo Dặm"
              className="w-52 h-52 sm:w-56 sm:h-56 object-contain select-none block"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadQR}
            disabled={isDownloading}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>{isDownloading ? 'Đang tải...' : 'Tải Ảnh QR'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintStandee}
            className="flex-1 py-2.5 rounded-xl bg-[#864d61] hover:bg-[#723f51] text-white font-headline text-xs sm:text-sm clay-button-pink transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>In Standee</span>
          </button>
        </div>
      </div>
    </div>
  );
}
