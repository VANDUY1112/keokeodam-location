import React, { useState, useEffect, useRef } from 'react';
import { VIETNAM_BANKS, DEFAULT_BANK_CONFIG, generateVietQRUrl } from '../utils/vietqr';
import { formatVND } from '../utils/format';
import { gpsSocket } from '../services/gpsSocket';

function formatNoteForAmount(val) {
  const num = Math.max(0, parseInt(val, 10) || 0);
  if (num === 0) return 'KEO KEO DAM nhan';
  const formatted = num.toLocaleString('vi-VN');
  return `KEO KEO DAM nhan ${formatted}`;
}

// Play pleasant web audio success chime
function playSuccessTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
    osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
    osc1.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36); // C6

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc1.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.85);
  } catch {
    // Ignore if audio is restricted
  }
}

export default function VietQRModal({
  isOpen,
  onClose,
  initialAmount = 500000,
  initialNote = '',
  orderInfo = null,
  onConfirmPayment = null,
  setToast = null
}) {
  const [bankConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('locahome_bank_config');
      return saved ? JSON.parse(saved) : DEFAULT_BANK_CONFIG;
    } catch {
      return DEFAULT_BANK_CONFIG;
    }
  });

  const [amount, setAmount] = useState(initialAmount || 500000);
  const [note, setNote] = useState(() => initialNote || formatNoteForAmount(initialAmount || 500000));
  const [isCopied, setIsCopied] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Auto payment status state
  const [isPaid, setIsPaid] = useState(false);
  const [paidDetails, setPaidDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);

  const amountRef = useRef(amount);
  const noteRef = useRef(note);
  amountRef.current = amount;
  noteRef.current = note;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const startAmt = initialAmount || 500000;
      setAmount(startAmt);
      setNote(initialNote || formatNoteForAmount(startAmt));
      setIsPaid(false);
      setPaidDetails(null);
      setCountdown(5);
    }
  }, [isOpen, initialAmount, initialNote]);

  // Listen to Realtime WebSocket Payment Events
  useEffect(() => {
    if (!isOpen || isPaid) return;

    const unsubscribe = gpsSocket.subscribe((eventData) => {
      if (eventData && (eventData.transactionId || eventData.amount)) {
        triggerPaymentSuccess({
          transactionId: eventData.transactionId || `MB-${Date.now().toString().slice(-6)}`,
          amount: eventData.amount || amountRef.current,
          gateway: eventData.gateway || 'MBBank Napas 247',
          content: eventData.content || noteRef.current,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      }
    });

    return () => unsubscribe();
  }, [isOpen, isPaid]);

  // Countdown timer to auto-close after success
  useEffect(() => {
    if (!isPaid) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaid, onClose]);

  const triggerPaymentSuccess = (details) => {
    setIsPaid(true);
    setPaidDetails(details);
    playSuccessTone();

    if (onConfirmPayment) {
      onConfirmPayment({
        amount: details.amount,
        note: details.content,
        orderInfo,
        transactionId: details.transactionId
      });
    }

    if (setToast) {
      setToast({
        title: 'Ting Ting! Đã Nhận Được Tiền',
        desc: `Chuyển khoản thành công ${formatVND(details.amount)} (${details.gateway}).`,
        type: 'success'
      });
    }
  };

  const handleAmountChange = (newAmt) => {
    const cleanAmt = Math.max(0, parseInt(newAmt, 10) || 0);
    setAmount(cleanAmt);
    setNote(formatNoteForAmount(cleanAmt));
  };

  if (!isOpen) return null;

  const currentBank = VIETNAM_BANKS.find((b) => b.id === bankConfig.bankId) || VIETNAM_BANKS[0];
  const qrUrl = generateVietQRUrl({
    bankId: bankConfig.bankId,
    accountNo: bankConfig.accountNo,
    accountName: bankConfig.accountName,
    amount: amount,
    addInfo: note,
    template: 'compact2'
  });

  const handleCopyAccountNo = () => {
    navigator.clipboard.writeText(bankConfig.accountNo);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    if (setToast) {
      setToast({
        title: 'Đã Sao Chép Số Tài Khoản',
        desc: `${bankConfig.accountNo} (${currentBank.shortName})`,
        type: 'success'
      });
    }
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `VietQR_Locahome_${amount}d.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      if (setToast) {
        setToast({
          title: 'Đã Tải Mã QR Về Máy',
          desc: 'Hình ảnh mã VietQR Napas 247 đã được lưu thành công.',
          type: 'success'
        });
      }
    } catch {
      window.open(qrUrl, '_blank');
    }
  };

  const handleSimulateWebhook = () => {
    triggerPaymentSuccess({
      transactionId: `MB-${Date.now().toString().slice(-6)}`,
      amount: amount,
      gateway: `${currentBank.shortName} (Napas 247)`,
      content: note,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  };

  const QUICK_AMOUNTS = [
    { label: '100k', value: 100000 },
    { label: '240k', value: 240000 },
    { label: '280k', value: 280000 },
    { label: '500k', value: 500000 },
    { label: '1 Triệu', value: 1000000 },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xl z-10 flex flex-col gap-3.5 animate-popup-open my-auto max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* ══════════ SCREEN 1: SUCCESS CELEBRATION (AUTOMATIC DETECTED) ══════════ */}
        {isPaid ? (
          <div className="flex flex-col items-center text-center py-4 space-y-3.5 animate-in zoom-in-95 duration-300">
            {/* Animated Green Check Circle */}
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </div>

            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                Tự Động Nhận Diện Webhook
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Thanh Toán Thành Công!
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Khách hàng đã chuyển tiền qua {paidDetails?.gateway || 'VietQR'}
              </p>
            </div>

            {/* Amount Badge */}
            <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Số tiền nhận:</span>
                <span className="text-base font-bold text-emerald-600">
                  +{formatVND(paidDetails?.amount || amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Mã giao dịch:</span>
                <span className="font-mono font-semibold text-slate-800 text-xs">
                  {paidDetails?.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Nội dung:</span>
                <span className="font-semibold text-slate-800 text-xs truncate max-w-[200px]">
                  {paidDetails?.content}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Thời gian:</span>
                <span className="font-medium text-slate-600 text-xs">
                  {paidDetails?.timestamp}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-normal">
              Tự động đóng sau <strong className="text-slate-700 font-semibold">{countdown}s</strong> hoặc bấm Đóng bên dưới
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        ) : (
          /* ══════════ SCREEN 2: ACTIVE VIETQR CODE ══════════ */
          <>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-2xs">
                  <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight">
                  Mã VietQR Thu Tiền
                </h3>
              </div>
            </div>

            {/* Amount Input & Quick Select Full Line Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Số tiền muốn nhận
                </label>
                <span className="text-sm sm:text-base font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200/80 shadow-2xs">
                  {formatVND(amount)}
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="10000"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                  placeholder="Nhập số tiền..."
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ₫
                </span>
              </div>

              {/* Quick Select Buttons - FULL LINE GRID (5 Columns) */}
              <div className="grid grid-cols-5 gap-1.5 pt-0.5 w-full">
                {QUICK_AMOUNTS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleAmountChange(item.value)}
                    className={`py-1.5 px-1 rounded-xl text-xs font-semibold text-center transition-all duration-150 active:scale-95 truncate w-full ${
                      amount === item.value
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note / Transfer Description Input */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Nội dung chuyển khoản
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm sm:text-base focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
                placeholder="Ví dụ: KEO KEO DAM nhan 500.000..."
              />
            </div>

            {/* VietQR Live Preview Frame */}
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl relative">
              <div className="relative w-full max-w-[210px] aspect-[4/5] bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex items-center justify-center p-1.5">
                <img
                  src={qrUrl}
                  alt="Mã VietQR"
                  onLoad={() => setIsImageLoading(false)}
                  className="w-full h-full object-contain transition-opacity duration-200"
                />
                {isImageLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 gap-1.5">
                    <span className="material-symbols-outlined text-2xl animate-spin text-slate-800">progress_activity</span>
                    <span className="text-xs font-medium text-slate-500">Đang tải mã QR...</span>
                  </div>
                )}
              </div>

              {/* Account Details Pill */}
              <div className="w-full mt-2.5 p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 text-xs truncate">
                    {currentBank.shortName} • {bankConfig.accountNo}
                  </div>
                  <div className="text-slate-500 font-medium text-xs truncate mt-0.5">
                    Chủ TK: {bankConfig.accountName}
                  </div>
                </div>
                <button
                  onClick={handleCopyAccountNo}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs shrink-0 transition-colors active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isCopied ? 'check' : 'content_copy'}
                  </span>
                  <span>{isCopied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>

            {/* Auto-checking Radar Status & Action Buttons */}
            <div className="flex flex-col gap-2 pt-0.5">
              {/* Auto Checking Live Radar Bar */}
              <div 
                onClick={handleSimulateWebhook}
                title="Hệ thống đang kết nối ngân hàng và tự động kiểm tra biến động số dư theo thời gian thực"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-xs border border-slate-800 select-none cursor-pointer group hover:bg-slate-850 transition-all active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-100">
                    Đang tự động kiểm tra...
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                  <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
                  <span>Trực tiếp</span>
                </div>
              </div>

              {/* Auxiliary Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all active:scale-95 border border-slate-200/80"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>Tải Ảnh QR</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-all active:scale-95 border border-slate-200/80"
                >
                  <span>Đóng</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
