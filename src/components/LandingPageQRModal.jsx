import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function LandingPageQRModal({
  isOpen,
  onClose,
  setToast = null
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Target Vercel domain URL for production scanning
  const targetUrl = 'https://keokeodam-location.vercel.app/?page=landing';

  // Crisp, high-contrast QR code generated from api.qrserver.com
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=8&ecc=M&color=1e293b&bgcolor=ffffff&data=${encodeURIComponent(targetUrl)}`;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (setToast) {
        setToast({
          title: 'Đã sao chép link!',
          desc: 'Link Vercel đã được sao chép vào bộ nhớ tạm.',
          type: 'success'
        });
      }
    } catch (err) {
      console.warn('Copy failed:', err);
    }
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
      a.download = `QR-KeoKeoDam-Vercel.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      if (setToast) {
        setToast({
          title: 'Tải thành công!',
          desc: 'Hình ảnh mã QR Vercel đã được tải về máy.',
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

  return createPortal(
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs transition-all ${isClosing ? 'animate-backdrop-close pointer-events-none' : 'animate-in fade-in duration-200'
        }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 border border-slate-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all flex flex-col items-center text-center ${isClosing ? 'animate-modal-close' : 'animate-modal-pop'
          }`}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base sm:text-lg leading-tight">Mã QR</h3>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col items-center justify-center w-full shadow-inner">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
            <img
              src={qrCodeUrl}
              alt="Mã QR Kẹo Kéo Dặm Vercel"
              className="w-48 h-48 sm:w-52 sm:h-52 object-contain select-none block"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border border-slate-200"
          >
            <span className="material-symbols-outlined text-[17px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Đã chép' : 'Sao chép link'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQR}
            disabled={isDownloading}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>{isDownloading ? 'Đang tải...' : 'Tải Ảnh QR'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
