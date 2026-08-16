import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Play, 
  Pause, 
  User, 
  AlertTriangle, 
  X,
  ExternalLink
} from 'lucide-react';

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  isSimulating, 
  setIsSimulating, 
  unreadAlertsCount,
  alerts,
  onSelectUnit,
  setActiveTab
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-[280px] right-0 h-[64px] bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10 z-40 px-6 flex items-center justify-between select-none">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-4 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm mã xe, tài xế, số VIN hoặc vị trí..."
            className="w-full bg-surface-container-high/60 border border-outline-variant/30 rounded-full py-2 pl-11 pr-10 text-on-surface text-[14px] placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all font-mono"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 p-1 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Controls & Quick Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Live Simulation Play/Pause Engine */}
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-mono transition-all duration-200 border ${
            isSimulating
              ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_12px_rgba(75,226,119,0.2)]'
              : 'bg-surface-container-high/60 border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
          }`}
          title="Bật/Tắt mô phỏng vị trí GPS và thông số viễn thông thực tế"
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold">MÔ PHỎNG: BẬT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-on-surface-variant" />
              <span>MÔ PHỎNG: TẠM DỪNG</span>
            </>
          )}
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-surface-container-high/40 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-surface-dim font-bold text-[10px] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-84 bg-surface-container/95 backdrop-blur-2xl border border-outline-variant/30 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-tertiary" />
                  <span className="text-[13px] font-bold text-on-surface">Sự Cố Gần Đây</span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveTab('alerts');
                  }}
                  className="text-[11px] text-primary hover:underline font-mono flex items-center gap-1 font-semibold"
                >
                  Xem tất cả <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {alerts.slice(0, 3).map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectUnit(alt.assetId || alt.unitId);
                    }}
                    className="p-2.5 rounded-xl bg-surface-container-high/50 hover:bg-surface-container-high border border-outline-variant/10 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-primary">{alt.assetId || alt.unitId}</span>
                      <span className="text-on-surface-variant font-mono">{alt.timestamp}</span>
                    </div>
                    <div className="text-[12px] font-medium text-on-surface mt-1 line-clamp-1">{alt.eventTitle || alt.title}</div>
                    <div className="text-[11px] text-on-surface-variant/80 mt-0.5">{alt.coordinates || alt.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info / HQ Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/20">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-semibold text-on-surface leading-tight">Quản Trị Đội Xe</div>
            <div className="text-[11px] text-on-surface-variant font-mono">Trung Tâm Điều Hành • Phân Khu 01</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(75,226,119,0.25)]">
            <User className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
