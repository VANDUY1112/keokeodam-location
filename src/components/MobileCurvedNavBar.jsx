import React from 'react';
import {
  Navigation,
  BarChart3,
  Receipt,
  History,
  Settings,
} from 'lucide-react';

export default function MobileCurvedNavBar({ activeTab, onSelectTab }) {
  const isCenterActive = activeTab === 'tracking';
  const BG_COLOR = '#0f172a'; // Slate 900 (Màu xám than cao cấp)
  const ACTIVE_CENTER_BG = '#1e293b'; // Slate 800

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pointer-events-none select-none">
      {/* Khung chứa thanh điều hướng */}
      <div className="pointer-events-auto relative w-full">
        
        {/* --- 1. PHẦN NỀN CẮT LÕM ĐỐI XỨNG (SVG NOTCH) --- */}
        <div className="absolute inset-0 -z-10 filter drop-shadow-[0_-4px_16px_rgba(0,0,0,0.25)]">
          {/* Thanh phẳng bên trái (từ mép trái đến mép vết lõm) */}
          <div
            className="absolute left-0 top-0 right-[calc(50%+59px)] bottom-0"
            style={{ backgroundColor: BG_COLOR }}
          />

          {/* Vết lõm bo cong ở giữa (Rộng 120px) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[120px] bottom-0">
            <svg
              viewBox="0 0 120 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full block"
              preserveAspectRatio="xMidYMin slice"
            >
              <path
                d="
                  M 0 0
                  L 12 0
                  C 20 0 25 4 27 10
                  C 31 25 44 38 60 38
                  C 76 38 89 25 93 10
                  C 95 4 100 0 108 0
                  L 120 0
                  L 120 80
                  L 0 80
                  Z
                "
                fill={BG_COLOR}
              />
            </svg>
          </div>

          {/* Thanh phẳng bên phải (từ mép vết lõm đến mép phải) */}
          <div
            className="absolute left-[calc(50%+59px)] top-0 right-0 bottom-0"
            style={{ backgroundColor: BG_COLOR }}
          />
        </div>

        {/* --- 2. NÚT TRÒN TRUNG TÂM NỔI (FLOATING TRACKING BUTTON) --- */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-[23px] z-20">
          <button
            onClick={() => onSelectTab('tracking')}
            className={`
              cursor-pointer relative flex items-center justify-center w-[54px] h-[54px] rounded-full
              text-white
              shadow-[0_6px_16px_rgba(0,0,0,0.45)] border-2 border-white/20
              hover:scale-105 active:scale-95 transition-all duration-200
              ${isCenterActive ? 'ring-2 ring-white shadow-[0_8px_22px_rgba(6,182,212,0.4)] scale-105' : ''}
            `}
            style={{ backgroundColor: isCenterActive ? ACTIVE_CENTER_BG : BG_COLOR }}
            title="Giao Loa & GPS"
          >
            <div className="relative flex items-center justify-center">
              <Navigation size={26} className="text-white drop-shadow-sm fill-white" />
            </div>
          </button>
        </div>

        {/* --- 3. 4 NÚT ĐIỀU HƯỚNG 2 BÊN --- */}
        <nav className="w-full grid grid-cols-5 items-center pt-2 pb-safe px-1 text-white min-h-[64px]">
          {/* Nút 1: Tổng Quan */}
          <button
            onClick={() => onSelectTab('dashboard')}
            onTouchStart={() => {}}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="flex flex-col items-center justify-center py-1 cursor-pointer group active:scale-90 transition-all duration-200"
            title="Tổng Quan"
          >
            <div className={`relative transition-transform duration-200 ${activeTab === 'dashboard' ? '-translate-y-1 scale-105' : ''}`}>
              <BarChart3
                size={23}
                className={`transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'text-white stroke-[2.8] drop-shadow-sm'
                    : 'text-slate-400 group-hover:text-white stroke-[1.8]'
                }`}
              />
              {activeTab === 'dashboard' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-xs"></span>
              )}
            </div>
            <span className={`text-[11px] sm:text-xs mt-1.5 leading-none transition-colors duration-200 ${activeTab === 'dashboard' ? 'font-bold text-white' : 'text-slate-400 font-medium'}`}>
              Tổng Quan
            </span>
          </button>

          {/* Nút 2: Chi Phí */}
          <button
            onClick={() => onSelectTab('expenses')}
            onTouchStart={() => {}}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="flex flex-col items-center justify-center py-1 cursor-pointer group active:scale-90 transition-all duration-200"
            title="Chi Phí"
          >
            <div className={`relative transition-transform duration-200 ${activeTab === 'expenses' ? '-translate-y-1 scale-105' : ''}`}>
              <Receipt
                size={23}
                className={`transition-all duration-200 ${
                  activeTab === 'expenses'
                    ? 'text-white stroke-[2.8] drop-shadow-sm'
                    : 'text-slate-400 group-hover:text-white stroke-[1.8]'
                }`}
              />
              {activeTab === 'expenses' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-xs"></span>
              )}
            </div>
            <span className={`text-[11px] sm:text-xs mt-1.5 leading-none transition-colors duration-200 ${activeTab === 'expenses' ? 'font-bold text-white' : 'text-slate-400 font-medium'}`}>
              Chi Phí
            </span>
          </button>

          {/* Cột số 3: Khoảng trống ở giữa dành cho nút tròn nổi */}
          <div className="flex flex-col items-center justify-center h-full pointer-events-none" />

          {/* Nút 4: Lịch Sử */}
          <button
            onClick={() => onSelectTab('history')}
            onTouchStart={() => {}}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="flex flex-col items-center justify-center py-1 cursor-pointer group active:scale-90 transition-all duration-200"
            title="Lịch Sử"
          >
            <div className={`relative transition-transform duration-200 ${activeTab === 'history' ? '-translate-y-1 scale-105' : ''}`}>
              <History
                size={23}
                className={`transition-all duration-200 ${
                  activeTab === 'history'
                    ? 'text-white stroke-[2.8] drop-shadow-sm'
                    : 'text-slate-400 group-hover:text-white stroke-[1.8]'
                }`}
              />
              {activeTab === 'history' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-xs"></span>
              )}
            </div>
            <span className={`text-[11px] sm:text-xs mt-1.5 leading-none transition-colors duration-200 ${activeTab === 'history' ? 'font-bold text-white' : 'text-slate-400 font-medium'}`}>
              Lịch Sử
            </span>
          </button>

          {/* Nút 5: Cài Đặt */}
          <button
            onClick={() => onSelectTab('settings')}
            onTouchStart={() => {}}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="flex flex-col items-center justify-center py-1 cursor-pointer group active:scale-90 transition-all duration-200"
            title="Cài Đặt"
          >
            <div className={`relative transition-transform duration-200 ${activeTab === 'settings' ? '-translate-y-1 scale-105' : ''}`}>
              <Settings
                size={23}
                className={`transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'text-white stroke-[2.8] drop-shadow-sm'
                    : 'text-slate-400 group-hover:text-white stroke-[1.8]'
                }`}
              />
              {activeTab === 'settings' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-xs"></span>
              )}
            </div>
            <span className={`text-[11px] sm:text-xs mt-1.5 leading-none transition-colors duration-200 ${activeTab === 'settings' ? 'font-bold text-white' : 'text-slate-400 font-medium'}`}>
              Cài Đặt
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
