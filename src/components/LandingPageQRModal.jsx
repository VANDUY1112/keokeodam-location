import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function LandingPageQRModal({
  isOpen,
  onClose,
  setToast = null
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen) return null;

  // Target Vercel domain URL for production scanning
  const targetUrl = 'https://keokeodam-location.vercel.app/?page=landing';

  // Crisp, high-contrast QR code generated with landing-page burgundy color
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=900x900&margin=8&ecc=H&color=7b3f52&bgcolor=ffffff&data=${encodeURIComponent(targetUrl)}`;

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

  // High-Resolution Standee/Photo Canvas Generator (1200 x 1400 px @ 300DPI equivalent)
  const handleDownloadStandee = async () => {
    try {
      setIsDownloading(true);

      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 1400;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 1. Cute Pastel Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#fff0f5');
      bgGrad.addColorStop(0.5, '#fdf7ff');
      bgGrad.addColorStop(1, '#ffe4ec');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Decorative outer border with rounded corners
      const outerMargin = 40;
      const cornerRadius = 60;
      ctx.save();
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#fab3ca';
      ctx.beginPath();
      ctx.roundRect(outerMargin, outerMargin, width - outerMargin * 2, height - outerMargin * 2, cornerRadius);
      ctx.stroke();
      ctx.restore();

      // Soft decorative inner container
      const innerMargin = 70;
      ctx.save();
      const innerGrad = ctx.createLinearGradient(0, innerMargin, 0, height - innerMargin);
      innerGrad.addColorStop(0, '#ffffff');
      innerGrad.addColorStop(1, '#fff6f9');
      ctx.fillStyle = innerGrad;
      ctx.shadowColor = 'rgba(134, 77, 97, 0.1)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 12;
      ctx.beginPath();
      ctx.roundRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2, 48);
      ctx.fill();
      ctx.restore();

      // 2. Load and Draw Crisp QR Code inside white framed box
      const loadImg = (src) => new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

      const qrBoxSize = 880;
      const qrBoxX = width / 2 - qrBoxSize / 2;
      const qrBoxY = height / 2 - qrBoxSize / 2;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 44);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(134, 77, 97, 0.16)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 15;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#ffd9e3';
      ctx.stroke();
      ctx.restore();

      // Draw QR Image
      const qrImg = await loadImg(qrCodeUrl);
      if (qrImg) {
        const qrInnerPadding = 45;
        ctx.drawImage(
          qrImg,
          qrBoxX + qrInnerPadding,
          qrBoxY + qrInnerPadding,
          qrBoxSize - qrInnerPadding * 2,
          qrBoxSize - qrInnerPadding * 2
        );
      }

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `Anh-QR-Cute-KeoKeoDam.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        if (setToast) {
          setToast({
            title: 'Tải ảnh thành công!',
            desc: 'File ảnh QR nền cute đã được lưu để bạn in/photo!',
            type: 'success'
          });
        }
      }, 'image/png', 1.0);

    } catch (err) {
      console.warn('Canvas export failed, downloading direct QR image', err);
      window.open(qrCodeUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <>
      {/* Print styles for photo paper & A4/A5 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-qr-card, #printable-qr-card * {
            visibility: visible !important;
          }
          #printable-qr-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(1.15) !important;
            width: 85% !important;
            max-width: 460px !important;
            box-shadow: none !important;
            border: 3px solid #fab3ca !important;
          }
        }
      `}</style>

      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto ${
          isClosing ? 'animate-backdrop-close pointer-events-none' : 'animate-in fade-in duration-200'
        }`}
      >
        <div
          ref={cardRef}
          onClick={(e) => e.stopPropagation()}
          className={`bg-gradient-to-b from-[#fff0f5] via-[#fdf7ff] to-[#ffeaf0] rounded-[2.8rem] sm:rounded-[3.2rem] max-w-sm sm:max-w-md w-full p-6 sm:p-9 border-[3px] border-[#ffd9e3] shadow-[0_25px_60px_-15px_rgba(134,77,97,0.35)] relative overflow-hidden transition-all flex flex-col items-center text-center my-auto ${
            isClosing ? 'animate-modal-close' : 'animate-modal-pop'
          }`}
          id="printable-qr-card"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-[#ffd9e3] text-[#864d61] border border-[#fab3ca]/60 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 font-bold z-20"
            title="Đóng"
          >
            ✕
          </button>

          {/* Clean, Cute Framed QR Code Container */}
          <div className="bg-white rounded-[2.2rem] sm:rounded-[2.6rem] p-5 sm:p-7 border-2 border-[#ffd9e3] shadow-[0_14px_36px_rgba(134,77,97,0.12)] flex items-center justify-center w-full max-w-[320px] sm:max-w-[360px] relative my-2">
            <img
              src={qrCodeUrl}
              alt="Mã QR Kẹo Kéo Dặm"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain select-none block rounded-2xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-5 pt-4 border-t border-[#ffd9e3]/80 grid grid-cols-3 gap-2 w-full">
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2.5 rounded-2xl bg-white hover:bg-[#ffd9e3]/50 text-[#864d61] font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 border border-[#ffd9e3] shadow-xs"
              title="Sao chép link web"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 rounded-2xl bg-[#ffd9e3] hover:bg-[#ffc6d7] text-[#864d61] font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 border border-[#fab3ca] shadow-xs"
              title="In mã QR ra giấy"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>In ảnh</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadStandee}
              disabled={isDownloading}
              className="py-2.5 rounded-2xl bg-[#864d61] hover:bg-[#723d4f] text-white font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-md disabled:opacity-50 clay-button-pink"
              title="Tải file ảnh QR nền cute chất lượng cao để photo"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isDownloading ? 'hourglass_top' : 'download'}
              </span>
              <span>{isDownloading ? 'Đang tạo...' : 'Tải Ảnh'}</span>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
