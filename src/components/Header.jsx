import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  CheckCircle2, 
  User, 
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

  return (
    <header className="fixed top-0 left-[280px] right-0 h-[64px] bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 px-6 flex items-center justify-between select-none shadow-xs">
      
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm mã loa, tên khách, số điện thoại..."
            className="w-full bg-slate-100/80 border border-slate-200 rounded-xl py-2 pl-10 pr-9 text-slate-800 text-[13px] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Controls & Quick Actions */}
      <div className="flex items-center gap-3 ml-6">
        
        {/* Quick Check-in Giao Loa */}
        <button
          onClick={() => onOpenCheckinModal('delivery')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold bg-ocean-600 hover:bg-ocean-700 text-white shadow-sm shadow-ocean-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Check-in Giao Loa</span>
        </button>

        {/* Quick Check-in Trả Loa Về Nhà */}
        <button
          onClick={() => onOpenCheckinModal('return')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Loa Đã Về Nhà</span>
        </button>

        {/* Notifications / Đang thuê */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {rentingSpeakers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
                {rentingSpeakers.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-88 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Speaker className="w-4 h-4 text-ocean-600" />
                  <span className="text-[13px] font-bold text-slate-800">Loa Đang Cho Thuê ({rentingSpeakers.length})</span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveTab('device-details');
                  }}
                  className="text-[11px] text-ocean-600 hover:underline font-bold flex items-center gap-1"
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
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-ocean-50 border border-slate-100 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-ocean-700">{spk.id} - {spk.name}</span>
                      <span className="text-amber-700 font-mono font-bold bg-amber-50 px-1.5 py-0.5 rounded">Từ {spk.currentRental?.startTime}</span>
                    </div>
                    <div className="text-[12px] font-semibold text-slate-800 mt-1">{spk.currentRental?.customerName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">{spk.currentRental?.address}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-bold text-slate-800 leading-tight">Gia Đình Đàm</div>
            <div className="text-[11px] text-ocean-600 font-semibold">Quản Trị Cho Thuê</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-ocean-50 border border-ocean-200 flex items-center justify-center text-ocean-700 font-bold shadow-xs">
            <User className="w-4 h-4" />
          </div>
        </div>

      </div>
    </header>
  );
}
