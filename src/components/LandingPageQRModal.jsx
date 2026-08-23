import React, { useState } from 'react';

export default function LandingPageQRModal({
  isOpen,
  onClose,
  setToast = null
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  // Compute the landing page target URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://locahome.vn';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const targetUrl = `${origin}${pathname}?page=landing`;

  // QR Code image URL via high-performance high-res QR API with ECC level H (high error tolerance for center logo)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&margin=15&ecc=H&data=${encodeURIComponent(targetUrl)}`;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 220);
  };

  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR-Locahome-LandingPage.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      if (setToast) {
        setToast({
          title: '⬇️ Tải thành công!',
          desc: 'Ảnh mã QR chất lượng cao đã được tải về máy.',
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isClosing
          ? 'bg-black/0 backdrop-blur-none opacity-0'
          : 'bg-black/60 backdrop-blur-md opacity-100'
      }`}
      style={{ animation: !isClosing ? 'modalFadeIn 0.2s ease-out forwards' : undefined }}
    >
      <style>{`
        @keyframes springPopIn {
          0% { transform: scale(0.86) translateY(24px); opacity: 0; }
          60% { transform: scale(1.02) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes modalFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes laserScanLine {
          0% { top: 4%; opacity: 0.3; }
          50% { top: 92%; opacity: 0.9; }
          100% { top: 4%; opacity: 0.3; }
        }
        @keyframes mascotHeartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-[2.5rem] max-w-md w-full p-6 sm:p-7 border-2 border-white/80 shadow-[0_25px_60px_rgba(134,77,97,0.22)] relative overflow-hidden flex flex-col transition-all duration-200 ${
          isClosing ? 'scale-90 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'
        }`}
        style={{
          animation: !isClosing ? 'springPopIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards' : undefined
        }}
      >
        {/* Top Decorative Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">qr_code_2</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Mã QR</h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* DIRECT QR DISPLAY WITH ANIMATIONS */}
        <div className="flex flex-col items-center text-center">
          {/* QR Card Container */}
          <div className="bg-gradient-to-b from-rose-50/80 via-pink-50/40 to-purple-50/30 p-5 sm:p-6 rounded-3xl border-2 border-rose-100/90 shadow-inner flex flex-col items-center relative group w-full">
            <div className="relative bg-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-slate-100 overflow-hidden">
              {/* Laser Scanning Line Animation */}
              <div
                className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_10px_rgba(244,63,94,0.9)] pointer-events-none rounded-full z-10"
                style={{ animation: 'laserScanLine 2.8s ease-in-out infinite' }}
              ></div>

              <img
                src={qrCodeUrl}
                alt="QR Code Landing Page"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl select-none"
              />

              {/* Center Cute Badge with Heartbeat Animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div
                  className="w-14 h-14 bg-white rounded-2xl shadow-lg border-2 border-[#864d61] flex items-center justify-center p-1.5"
                  style={{ animation: 'mascotHeartbeat 2.2s ease-in-out infinite' }}
                >
                  <img src="/anh3.png" alt="Locahome" className="w-full h-full object-contain drop-shadow-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleDownloadQR}
            disabled={isDownloading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>{isDownloading ? 'Đang tải...' : 'Tải Ảnh QR'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintStandee}
            className="px-4 py-2.5 rounded-xl bg-[#864d61] hover:bg-[#723f51] text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>In Standee</span>
          </button>
        </div>

      </div>
    </div>
  );
}

