import React from 'react';

export default function MobileCurvedNavBar({ activeTab, onSelectTab }) {
  // Deep elegant slate gray matching the system design
  const BAR_COLOR = '#0f172a'; // Slate 900 (Màu xám than cao cấp)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none select-none">
      <div className="relative w-full max-w-md mx-auto pointer-events-auto">
        
        {/* Central Floating Circular Button (Ôm sát, vừa vặn không bị hở rộng) */}
        <div className="absolute left-1/2 -top-4 -translate-x-1/2 z-30 flex flex-col items-center">
          <button
            type="button"
            onClick={() => onSelectTab('tracking')}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 transform active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.35)] border-2 ${
              activeTab === 'tracking'
                ? 'bg-slate-800 border-white text-white scale-105 ring-2 ring-white/30'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: activeTab === 'tracking' ? "'FILL' 1" : "'FILL' 0" }}
            >
              near_me
            </span>
          </button>
        </div>

        {/* Curved Notch SVG Bar with snug curve (Không hở rộng) */}
        <div className="relative w-full h-[62px] drop-shadow-[0_-4px_16px_rgba(0,0,0,0.25)]">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 62"
            preserveAspectRatio="none"
            style={{ fill: BAR_COLOR }}
          >
            {/* Smooth tight notch hugging the center 48px circle */}
            <path
              d="M 0,10 
                 L 168,10 
                 C 180,10 182,34 200,34 
                 C 218,34 220,10 232,10 
                 L 400,10 
                 L 400,62 
                 L 0,62 Z"
            />
          </svg>

          {/* 4 Navigation Buttons (2 Left, 2 Right) */}
          <div className="absolute inset-x-0 bottom-0 top-1 grid grid-cols-5 items-center px-1">
            {/* Left 1: Tổng Quan */}
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all active:scale-95 ${
                activeTab === 'dashboard' ? 'text-white font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}
              >
                bar_chart
              </span>
              <span className="text-[10px] font-medium tracking-tight">Tổng Quan</span>
            </button>

            {/* Left 2: Chi Phí */}
            <button
              type="button"
              onClick={() => onSelectTab('expenses')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all active:scale-95 ${
                activeTab === 'expenses' ? 'text-white font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'expenses' ? "'FILL' 1" : "'FILL' 0" }}
              >
                receipt_long
              </span>
              <span className="text-[10px] font-medium tracking-tight">Chi Phí</span>
            </button>

            {/* Center Column: Label underneath the floating button */}
            <div
              onClick={() => onSelectTab('tracking')}
              className="flex flex-col items-center justify-end pb-1.5 cursor-pointer"
            >
              <span className={`text-[9.5px] tracking-tight transition-colors ${
                activeTab === 'tracking' ? 'text-white font-bold' : 'text-slate-400 font-medium'
              }`}>
                Hành Trình
              </span>
            </div>

            {/* Right 1: Lịch Sử */}
            <button
              type="button"
              onClick={() => onSelectTab('history')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all active:scale-95 ${
                activeTab === 'history' ? 'text-white font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'history' ? "'FILL' 1" : "'FILL' 0" }}
              >
                history
              </span>
              <span className="text-[10px] font-medium tracking-tight">Lịch Sử</span>
            </button>

            {/* Right 2: Cài Đặt */}
            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all active:scale-95 ${
                activeTab === 'settings' ? 'text-white font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
              >
                settings
              </span>
              <span className="text-[10px] font-medium tracking-tight">Cài Đặt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
