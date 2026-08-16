import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  CheckCircle2, 
  User, 
  AlertTriangle, 
  X,
  ExternalLink,
  Speaker,
  Coins
} from 'lucide-react';

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  speakers,
  onOpenCheckinModal,
  setActiveTab,
  onSelectSpeaker
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const rentingSpeakers = speakers.filter(s => s.status === 'renting');
  const availableSpeakers = speakers.filter(s => s.status === 'available');

  // Calculate live estimated revenue from active rentals
  const liveEstimatedRevenue = rentingSpeakers.reduce((acc, spk) => {
    if (!spk.currentRental) return acc;
    const elapsedHours = Math.max(1, (Date.now() - spk.currentRental.startTimestamp) / (3600 * 1000));
    return acc + Math.round(elapsedHours * spk.hourlyRate) + (spk.currentRental.shippingFee || 0);
  }, 0);

  return (
    <header className="fixed top-0 left-[280px] right-0 h-[64px] bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10 z-40 px-6 flex items-center justify-between select-none">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-4 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm mã loa, tên khách thuê, địa chỉ..."
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
      <div className="flex items-center gap-3.5 ml-6">
        
        {/* Quick Check-in Giao Loa */}
        <button
          onClick={() => onOpenCheckinModal('delivery')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-primary hover:bg-primary/90 text-surface-dim shadow-[0_0_12px_rgba(75,226,119,0.25)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Check-in Giao Loa</span>
        </button>

        {/* Quick Check-in Trả Loa Về Nhà */}
        <button
          onClick={() => onOpenCheckinModal('return')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-secondary-container/20 hover:bg-secondary-container/30 border border-secondary-container/40 text-secondary transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Check-in Loa Về Nhà</span>
        </button>

        {/* Notifications / Sắp hết giờ */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-surface-container-high/40 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {rentingSpeakers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-tertiary text-surface-dim font-bold text-[10px] rounded-full flex items-center justify-center shadow-lg">
                {rentingSpeakers.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-88 bg-surface-container/95 backdrop-blur-2xl border border-outline-variant/30 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <Speaker className="w-4 h-4 text-primary" />
                  <span className="text-[13px] font-bold text-on-surface">Loa Đang Cho Thuê ({rentingSpeakers.length})</span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveTab('device-details');
                  }}
                  className="text-[11px] text-primary hover:underline font-mono flex items-center gap-1 font-semibold"
                >
                  Xem tất cả <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {rentingSpeakers.map((spk) => (
                  <div
                    key={spk.id}
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectSpeaker(spk.id);
                      setActiveTab('device-details');
                    }}
                    className="p-2.5 rounded-xl bg-surface-container-high/50 hover:bg-surface-container-high border border-outline-variant/10 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-primary">{spk.id} - {spk.name}</span>
                      <span className="text-tertiary font-mono font-bold">Từ {spk.currentRental?.startTime}</span>
                    </div>
                    <div className="text-[12px] font-semibold text-on-surface mt-1">{spk.currentRental?.customerName}</div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5 truncate">{spk.currentRental?.address}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info / House HQ */}
        <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/20">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-bold text-on-surface leading-tight">Gia Đình Đàm</div>
            <div className="text-[11px] text-primary font-mono font-semibold">Cho Thuê Loa Kẹo Kéo</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(75,226,119,0.25)]">
            <User className="w-4 h-4 text-primary" />
          </div>
        </div>

      </div>
    </header>
  );
}
