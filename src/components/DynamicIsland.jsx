import React, { useState } from 'react';
import { Milestone, Zap, ChevronRight, Navigation, Sparkles } from 'lucide-react';
import { formatVND } from '../utils/format';

export default function DynamicIsland({
  isTracking = false,
  seconds = 0,
  distanceKm = 0,
  speedKmh = 0,
  activeTab = 'dashboard',
  customerName = '',
  speakerName = 'Loa Kéo',
  onNavigateToTracking,
  onOpenVietQR
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isTracking) return null;

  const formatTime = (totalSec) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const distDisplay = typeof distanceKm === 'number' ? distanceKm.toFixed(2) : Number(distanceKm || 0).toFixed(2);
  const speedDisplay = Math.round(Number(speedKmh) || 0);

  return (
    <div className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-[9999] max-w-[94vw] sm:max-w-xl transition-all duration-300 animate-modal-pop">
      <div
        className={`bg-slate-950/95 backdrop-blur-xl border border-slate-700/70 shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-full text-white px-3.5 sm:px-4 py-2 transition-all duration-300 select-none ${
          isExpanded ? 'rounded-2xl p-4' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Shipper Radar Avatar */}
          <div
            onClick={onNavigateToTracking}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700/80 shadow-inner">
              <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping"></span>
              <img
                src="/motorcycle.png"
                alt="Delivery"
                className="w-5 h-5 object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
              />
            </div>

            <div className="flex flex-col text-left leading-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-400">
                  Đang giao hàng
                </span>
              </div>
              <span className="text-[12px] sm:text-sm font-bold text-slate-200 mt-0.5 tabular-nums">
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          {/* Center: Live Stats Mini Badges */}
          <div
            onClick={onNavigateToTracking}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full text-xs font-bold text-slate-100">
              <Milestone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{distDisplay} km</span>
            </div>

            <div className="hidden xs:flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full text-xs font-bold text-slate-100">
              <span className="text-amber-400 font-mono text-[10px]">⚡</span>
              <span>{speedDisplay} km/h</span>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick VietQR Button */}
            {onOpenVietQR && (
              <button
                type="button"
                onClick={() => onOpenVietQR({ amount: 350000, note: `KEO KEO DAM ${customerName || 'GIAO LOA'}` })}
                title="Mở nhanh VietQR thu tiền"
                className="h-8 px-2.5 sm:px-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">VietQR</span>
              </button>
            )}

            {/* Switch to Tracking Tab */}
            {activeTab !== 'tracking' && (
              <button
                type="button"
                onClick={onNavigateToTracking}
                title="Xem bản đồ lộ trình"
                className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-700/80 active:scale-95 transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
