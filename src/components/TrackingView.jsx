import React, { useState, useEffect } from 'react';

export default function TrackingView({ onOpenLogExpense }) {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [seconds, setSeconds] = useState(42 * 60 + 15);
  const [liveDistance, setLiveDistance] = useState(12.4);
  const [currentSpeed, setCurrentSpeed] = useState(65);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    if (!isCheckedIn) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        const nextSec = prev + 1;
        if (nextSec % 3 === 0) {
          setLiveDistance((d) => +(d + 0.02).toFixed(2));
          setCurrentSpeed(Math.floor(62 + Math.random() * 7));
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCheckedIn]);

  const formatTime = (totalSec) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setActionNotice({ type: 'success', text: 'Đã bắt đầu lộ trình! Tín hiệu GPS định vị đang hoạt động.' });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setActionNotice({ type: 'info', text: 'Đã kết thúc hành trình. Lộ trình đã được lưu vào hệ thống.' });
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="absolute top-0 right-0 z-30 mb-4 bg-primary text-on-primary text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <span className="material-symbols-outlined text-base">
            {actionNotice.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span>{actionNotice.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-140px)] gap-gutter">
        {/* Left Panel: Controls & Trip Details */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-lg z-10 relative">
          {/* Live Status Header */}
          <div className="bg-surface-container-lowest rounded-3xl p-lg border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] flex flex-col gap-sm relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
            <div className="flex items-center justify-between z-10">
              <h2 className="font-headline-lg text-on-surface tracking-tight">Hành Trình Trực Tuyến</h2>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
                  isCheckedIn
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                ></span>
                <span className="font-label-sm uppercase tracking-wider font-semibold text-xs">
                  {isCheckedIn ? 'Đang theo dõi' : 'Tạm dừng'}
                </span>
              </div>
            </div>
            
            <div className="mt-md space-y-1 z-10">
              <p className="font-body-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">schedule</span>
                <span className="font-headline-md text-on-surface font-bold text-2xl tabular-nums">
                  {formatTime(seconds)}
                </span>
              </p>
              <p className="font-body-md text-on-surface-variant ml-8 text-xs font-medium">Thời gian đã trôi qua</p>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex gap-md w-full">
            <button
              onClick={handleCheckIn}
              className={`flex-1 rounded-2xl p-md flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-md group relative overflow-hidden border ${
                isCheckedIn
                  ? 'bg-primary text-on-primary border-primary ring-2 ring-primary/30'
                  : 'bg-primary text-on-primary border-primary hover:bg-slate-800'
              }`}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span
                className="material-symbols-outlined text-display"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              <span className="font-body-lg font-semibold">Bắt Đầu</span>
            </button>

            <button
              onClick={handleCheckOut}
              className={`flex-1 rounded-2xl p-md flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group border ${
                !isCheckedIn
                  ? 'bg-rose-50 text-rose-700 border-rose-200 ring-2 ring-rose-200'
                  : 'bg-surface-container-lowest text-on-surface border-slate-200/90 shadow-sm hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
              }`}
            >
              <span className="material-symbols-outlined text-display group-hover:text-rose-600 transition-colors">
                stop_circle
              </span>
              <span className="font-body-lg font-semibold">Kết Thúc</span>
            </button>
          </div>

          {/* Trip Details Bento */}
          <div className="grid grid-cols-2 gap-sm w-full">
            {/* Est. Dist */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_12px_rgba(11,28,48,0.03)] border border-slate-200/90 flex flex-col justify-between h-32 relative overflow-hidden group">
              <span className="material-symbols-outlined text-primary text-headline-lg z-10">
                route
              </span>
              <div className="z-10">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-1 font-medium">Khoảng cách dự tính</p>
                <p className="font-headline-md text-on-surface font-bold">
                  42.5 <span className="font-body-md text-on-surface-variant font-normal text-sm">km</span>
                </p>
              </div>
            </div>

            {/* Start Time */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_12px_rgba(11,28,48,0.03)] border border-slate-200/90 flex flex-col justify-between h-32 relative overflow-hidden group">
              <span className="material-symbols-outlined text-amber-600 text-headline-lg z-10">
                event_available
              </span>
              <div className="z-10">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-1 font-medium">Giờ xuất phát</p>
                <p className="font-headline-md text-on-surface font-bold">
                  08:15 <span className="font-body-md text-on-surface-variant font-normal text-sm">Sáng</span>
                </p>
              </div>
            </div>

            {/* Client / Project (Full Width) */}
            <div className="col-span-2 bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_12px_rgba(11,28,48,0.03)] border border-slate-200/90 flex items-center gap-md">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined">domain</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-0.5 font-medium">Dự án</p>
                <p className="font-body-lg text-on-surface truncate font-semibold">
                  Acme Corp - Kiểm toán Onsite Quý 4
                </p>
              </div>
              {onOpenLogExpense && (
                <button
                  onClick={onOpenLogExpense}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs font-semibold text-on-surface transition-colors"
                >
                  + Chi Phí
                </button>
              )}
            </div>
          </div>

          {/* Decorative GPS element */}
          <div className="mt-auto hidden lg:flex items-center gap-sm opacity-60 pt-4">
            <div className="h-px bg-slate-300 flex-1"></div>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 text-xs">
              Định vị GPS Đang bật
            </span>
          </div>
        </aside>

        {/* Right Panel: Map Area */}
        <main className="w-full lg:w-2/3 min-h-[480px] lg:h-auto rounded-[2rem] overflow-hidden relative shadow-lg border border-slate-300 group">
          {/* Map Image Background */}
          <div
            className="w-full h-full bg-cover bg-center absolute inset-0 transition-transform duration-[10s] ease-linear group-hover:scale-105"
            data-location="San Francisco to San Jose, CA route"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0x0NVWAbsA0gt2IOUkUy-8DyKRvHtkIFsQ4mhPyBNsN56xJUpl7frx9CGoK2Qj3R5DxTz9qr96gadRhH6nl9AuXRfmfAQospC25hck0WY09L7JJ2ykjmIKg7ZfaC8rbko8cogP2asc1LMpSbwkN6RWcBDoO2ygNWVkv6na3yOu6K_0q1Es5U8BWwo9wSbIjzPUfh8l0onIBktqLJaSTSN0oDShMQXqwiPwv95obun391GSKm6xRBr')`,
            }}
          ></div>

          {/* Map Scrim / Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>

          {/* Route Summary Overlay (Top Left) */}
          <div className="absolute top-md left-md bg-white/95 backdrop-blur-md rounded-2xl p-md shadow-xl border border-slate-200/90 flex flex-col gap-3 z-10 max-w-xs">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-slate-900 ring-4 ring-slate-200"></div>
                <div className="w-0.5 h-8 bg-slate-300 border-l-2 border-dashed border-slate-400"></div>
                <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/30"></div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <div>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Điểm xuất phát</p>
                  <p className="font-body-md text-on-surface font-semibold truncate">
                    100 Market St, SF
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">Điểm đến</p>
                  <p className="font-body-md text-on-surface font-semibold truncate">
                    HQ Campus, SJ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Telemetry Floating Overlay (Bottom Center/Right) */}
          <div className="absolute bottom-md right-md lg:bottom-xl lg:right-xl flex flex-wrap gap-sm z-10">
            {/* Speed */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-sm shadow-xl flex items-center gap-md border border-slate-200/90 transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-surface text-xl">speed</span>
              </div>
              <div className="pr-md">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px] mb-0.5 font-medium">
                  Tốc độ hiện tại
                </p>
                <p className="font-headline-lg text-on-surface font-bold leading-none">
                  {isCheckedIn ? currentSpeed : 0}{' '}
                  <span className="font-body-md text-on-surface-variant font-normal text-sm ml-0.5">km/h</span>
                </p>
              </div>
            </div>

            {/* Distance */}
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-sm shadow-xl flex items-center gap-md border border-slate-700 transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white">multiple_stop</span>
              </div>
              <div className="pr-md">
                <p className="font-label-sm text-slate-400 uppercase tracking-wider text-[11px] mb-0.5 font-medium">
                  Quãng đường trực tiếp
                </p>
                <p className="font-headline-lg text-white font-bold leading-none">
                  {liveDistance.toFixed(1)}{' '}
                  <span className="font-body-md text-slate-300 font-normal text-sm ml-0.5">km</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
