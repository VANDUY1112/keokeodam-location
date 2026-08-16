import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  MoreHorizontal, 
  Route, 
  Zap, 
  AlertTriangle, 
  Radio, 
  ArrowUpRight, 
  Navigation,
  Home,
  Speaker,
  Clock,
  Phone,
  PlusCircle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { HOME_LOCATION } from '../data/speakersData';

export default function OverviewView({ 
  speakers, 
  onSelectSpeaker, 
  statusFilter, 
  setStatusFilter, 
  onOpenCheckinModal,
  setActiveTab
}) {
  const [mapMode, setMapMode] = useState('dark');
  const [focusedSpeaker, setFocusedSpeaker] = useState(null);

  const rentingSpeakers = speakers.filter(s => s.status === 'renting');
  const availableSpeakers = speakers.filter(s => s.status === 'available');
  const returningSpeakers = speakers.filter(s => s.status === 'returning');

  const filteredSpeakers = statusFilter === 'all' 
    ? speakers 
    : speakers.filter(s => s.status === statusFilter);

  // Calculate total live revenue estimate
  const liveRevenue = rentingSpeakers.reduce((acc, spk) => {
    if (!spk.currentRental) return acc;
    const elapsedHours = Math.max(1, (Date.now() - spk.currentRental.startTimestamp) / (3600 * 1000));
    return acc + Math.round(elapsedHours * spk.hourlyRate) + (spk.currentRental.shippingFee || 0);
  }, 0);

  return (
    <div className="flex flex-col w-full relative select-none">
      
      {/* MAP COMMAND VIEWPORT */}
      <div className="w-full h-[calc(100vh-64px)] min-h-[780px] relative bg-surface-dim overflow-hidden shadow-2xl">
        
        {/* MAP BACKGROUND LAYER */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
            mapMode === 'satellite' 
              ? 'opacity-90 contrast-125' 
              : 'mix-blend-luminosity opacity-75'
          }`}
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy5zZ1NkFknjAXS99GyBryk1Q11T4kFo-00DpJq-3DclvBOKmjO-2BNkaB4W9NSiGbi9o7a4ptSL52Pr7WBGO-QkRzoGQfXQPOWv7UesjA-h5wQUbNkL0YdT8mtlsGjsUT_ovJzBjqkAOJYGNAdU84TnkEHZX6J56BzaC6eomRip10VovB6k6vk3GlbggmDIK4jxclgbnCugwLmcFdV6BtraUms9-V_2e3r5Y-aoqoLTCrj-q0ccZU')`
          }}
        />

        {/* HIGH-TECH HUD GRID OVERLAY */}
        <div className="absolute inset-0 radar-grid opacity-80 pointer-events-none" />

        {/* DISTANCE LINES FROM HOME TO RENTING SPEAKERS */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="deliveryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4be277" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffba61" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Lines connecting Home (50%, 50%) to each renting speaker */}
          {speakers.map((spk) => {
            if (!spk.currentRental || !spk.currentRental.coords) return null;
            const target = spk.currentRental.coords;
            return (
              <g key={`dist-line-${spk.id}`}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="url(#deliveryGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="6,6"
                  className="animate-pulse"
                />
                {/* Distance text on line midpoint */}
                <text
                  x={`${(50 + target.x) / 2}%`}
                  y={`${(50 + target.y) / 2 - 2}%`}
                  fill="#ffba61"
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="bg-surface p-1"
                >
                  {spk.currentRental.distanceKm} km
                </text>
              </g>
            );
          })}
        </svg>

        {/* HOME BASE MARKER (CENTER 50%, 50%) */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center group cursor-pointer pointer-events-auto">
          <div className="px-3 py-1 bg-primary text-surface-dim font-bold shadow-2xl rounded-xl mb-1.5 backdrop-blur-md flex items-center gap-1.5 text-[12px] border border-white/20">
            <Home className="w-3.5 h-3.5" />
            <span>KHO LOA TẠI NHÀ (Số 45 Đường Số 8)</span>
          </div>
          <div className="relative w-11 h-11 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-xl border-2 border-white">
              <Home className="w-4 h-4 text-surface-dim" />
            </div>
          </div>
        </div>

        {/* SPEAKER LOCATION MARKERS LAYER */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {filteredSpeakers.map((spk) => {
            if (spk.status === 'available') return null; // Already at home

            const isRenting = spk.status === 'renting';
            const isReturning = spk.status === 'returning';
            const coords = spk.currentRental?.coords || { x: 50, y: 50 };
            const isFocused = focusedSpeaker?.id === spk.id;

            // Calculate elapsed time
            const elapsedMs = spk.currentRental ? Date.now() - spk.currentRental.startTimestamp : 0;
            const elapsedHours = Math.floor(elapsedMs / (3600 * 1000));
            const elapsedMins = Math.floor((elapsedMs % (3600 * 1000)) / (60 * 1000));

            return (
              <div
                key={spk.id}
                style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
                onClick={() => setFocusedSpeaker(spk)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer pointer-events-auto transition-transform duration-300 ${
                  isFocused ? 'scale-125 z-40' : 'hover:scale-115 z-30'
                }`}
              >
                {/* HUD Label Tooltip on Hover / Focus */}
                <div className={`px-2.5 py-1.5 bg-surface-container/95 border border-outline-variant/40 shadow-2xl rounded-xl mb-1.5 transition-all duration-200 backdrop-blur-md flex flex-col items-center gap-0.5 ${
                  isFocused ? 'opacity-100 ring-2 ring-primary' : 'opacity-90 group-hover:opacity-100'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isReturning ? 'bg-secondary' : 'bg-tertiary animate-ping'}`} />
                    <span className="font-mono text-[12px] font-bold text-on-surface">
                      {spk.id}
                    </span>
                    <span className="text-[10px] text-tertiary font-bold font-mono">
                      {elapsedHours}h{elapsedMins}p
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium line-clamp-1 max-w-[130px]">
                    {spk.currentRental?.customerName}
                  </span>
                </div>

                {/* Pulsing Marker Beacon */}
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                    isReturning ? 'bg-secondary/40' : 'bg-tertiary/40'
                  }`} />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white/40 ${
                    isReturning ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary text-surface-dim'
                  }`}>
                    <Speaker className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOCUSED SPEAKER DETAIL FLOATING CARD */}
        {focusedSpeaker && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-[420px] bg-surface-container/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
                  <Speaker className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[16px] font-extrabold text-primary">{focusedSpeaker.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      focusedSpeaker.status === 'renting' ? 'bg-tertiary/20 text-tertiary' : 'bg-primary/20 text-primary'
                    }`}>
                      {focusedSpeaker.statusLabel}
                    </span>
                  </div>
                  <div className="text-[12px] text-on-surface-variant font-semibold">{focusedSpeaker.name}</div>
                </div>
              </div>
              <button 
                onClick={() => setFocusedSpeaker(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 text-[16px]"
              >
                ✕
              </button>
            </div>

            {/* Current Rental Info */}
            {focusedSpeaker.currentRental ? (
              <div className="py-3 space-y-2.5">
                <div className="bg-surface-container-high/60 p-3 rounded-xl border border-outline-variant/15 space-y-1.5 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Khách đang thuê:</span>
                    <span className="font-bold text-on-surface">{focusedSpeaker.currentRental.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Số điện thoại:</span>
                    <a href={`tel:${focusedSpeaker.currentRental.customerPhone}`} className="font-mono text-primary font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {focusedSpeaker.currentRental.customerPhone}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Địa chỉ giao loa:</span>
                    <span className="font-semibold text-on-surface text-right max-w-[220px]">{focusedSpeaker.currentRental.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Khoảng cách từ nhà:</span>
                    <span className="font-mono text-secondary font-bold">{focusedSpeaker.currentRental.distanceKm} km</span>
                  </div>
                </div>

                {/* Rental Live Metrics */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-surface-container-high p-2.5 rounded-xl border border-outline-variant/10">
                    <div className="text-[11px] font-mono text-on-surface-variant">Giờ bắt đầu giao</div>
                    <div className="text-[15px] font-bold text-on-surface font-mono mt-0.5">{focusedSpeaker.currentRental.startTime}</div>
                  </div>
                  <div className="bg-surface-container-high p-2.5 rounded-xl border border-outline-variant/10">
                    <div className="text-[11px] font-mono text-on-surface-variant">Đơn giá thuê</div>
                    <div className="text-[15px] font-bold text-primary font-mono mt-0.5">{focusedSpeaker.hourlyRate.toLocaleString('vi-VN')}đ / h</div>
                  </div>
                </div>

                {/* Action: Return speaker */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      onOpenCheckinModal('return', focusedSpeaker.id);
                      setFocusedSpeaker(null);
                    }}
                    className="flex-1 py-2.5 bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-bold rounded-xl flex items-center justify-center gap-2 text-[13px] shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check-in: Đã Chở Về Nhà</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectSpeaker(focusedSpeaker.id);
                      setActiveTab('device-details');
                    }}
                    className="p-2.5 bg-surface-container-high hover:bg-surface-bright rounded-xl border border-outline-variant/30 text-on-surface"
                    title="Xem chi tiết loa"
                  >
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center space-y-3">
                <div className="text-[13px] text-on-surface-variant">
                  Loa hiện đang ở nhà và sẵn sàng chở đi giao khách!
                </div>
                <button
                  onClick={() => {
                    onOpenCheckinModal('delivery', focusedSpeaker.id);
                    setFocusedSpeaker(null);
                  }}
                  className="w-full py-2.5 bg-primary text-surface-dim font-bold rounded-xl flex items-center justify-center gap-2 text-[13px] shadow-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Check-in Giao Loa Này</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* UI OVERLAYS (Controls & HUD widgets) */}
        <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between">
          
          {/* Top Section: Quick Map Mode & Speaker Status Card */}
          <div className="w-full flex justify-between items-start pointer-events-none">
            
            {/* Left: View Controls */}
            <div className="flex flex-wrap gap-2.5 pointer-events-auto">
              <div className="bg-surface/90 backdrop-blur-xl p-1 rounded-full border border-outline-variant/30 shadow-xl flex items-center gap-1">
                <button
                  onClick={() => setMapMode('dark')}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    mapMode === 'dark' ? 'bg-primary text-surface-dim font-bold shadow-md' : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  Bản Đồ Tối
                </button>
                <button
                  onClick={() => setMapMode('satellite')}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    mapMode === 'satellite' ? 'bg-primary text-surface-dim font-bold shadow-md' : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  Vệ Tinh
                </button>
              </div>

              {/* Reset Center to Home */}
              <button
                onClick={() => {
                  setFocusedSpeaker(null);
                  setStatusFilter('all');
                }}
                className="bg-primary/15 hover:bg-primary/25 text-primary border border-primary/40 backdrop-blur-xl px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 text-[12px] font-bold transition-all"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Căn Giữa Kho Nhà</span>
              </button>
            </div>

            {/* Right: Speaker Status Donut Card */}
            <div className="w-[340px] bg-surface-container/90 backdrop-blur-2xl rounded-2xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 pointer-events-auto flex flex-col gap-4 transform transition-transform hover:-translate-y-0.5">
              <div className="flex justify-between items-center pb-1">
                <div>
                  <h2 className="text-[17px] font-bold text-on-surface">Tình Trạng Loa Kẹo Kéo</h2>
                  <div className="text-[11px] font-mono text-on-surface-variant">Định vị & Theo dõi ca thuê</div>
                </div>
                <button 
                  onClick={() => setActiveTab('device-details')}
                  className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Donut Chart & Total Counter */}
              <div className="relative w-full aspect-[2/1] flex items-center justify-center my-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                  <path
                    className="text-surface-container-highest"
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                  {/* Renting Arc (Orange) */}
                  <path
                    className="text-tertiary drop-shadow-[0_0_10px_rgba(255,186,97,0.6)] transition-all duration-1000"
                    d="M 10 50 A 40 40 0 0 1 65 15"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="140"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                  {/* Available Arc (Green) */}
                  <path
                    className="text-primary drop-shadow-[0_0_8px_rgba(75,226,119,0.5)] transition-all duration-1000"
                    d="M 65 15 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="140"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                </svg>

                {/* Center Number Counter */}
                <div className="absolute bottom-0 flex flex-col items-center">
                  <span className="text-[36px] font-black text-on-surface leading-none font-mono tracking-tight">
                    {speakers.length}
                  </span>
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-widest mt-1">
                    Tổng Số Loa
                  </span>
                </div>
              </div>

              {/* Interactive Status Legend Filters */}
              <div className="flex flex-col gap-2 pt-1">
                <div
                  onClick={() => setStatusFilter(statusFilter === 'renting' ? 'all' : 'renting')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    statusFilter === 'renting' 
                      ? 'bg-tertiary/20 border-tertiary shadow-[0_0_12px_rgba(255,186,97,0.2)]' 
                      : 'bg-surface-container-high/40 hover:bg-surface-container-high border-outline-variant/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(255,186,97,0.8)] animate-pulse" />
                    <span className="text-[13px] font-medium text-on-surface">Khách đang thuê (Ngoài nhà)</span>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-tertiary">{rentingSpeakers.length} loa</span>
                </div>

                <div
                  onClick={() => setStatusFilter(statusFilter === 'available' ? 'all' : 'available')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    statusFilter === 'available' 
                      ? 'bg-primary/20 border-primary shadow-[0_0_12px_rgba(75,226,119,0.2)]' 
                      : 'bg-surface-container-high/40 hover:bg-surface-container-high border-outline-variant/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(75,226,119,0.6)]" />
                    <span className="text-[13px] font-medium text-on-surface">Tại nhà / Sẵn sàng cho thuê</span>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-primary">{availableSpeakers.length} loa</span>
                </div>

                <div
                  onClick={() => setStatusFilter(statusFilter === 'returning' ? 'all' : 'returning')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    statusFilter === 'returning' 
                      ? 'bg-secondary/20 border-secondary' 
                      : 'bg-surface-container-high/40 hover:bg-surface-container-high border-outline-variant/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="text-[13px] font-medium text-on-surface-variant">Đang chở về nhà</span>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-on-surface-variant">{returningSpeakers.length} loa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tray: Summary Telematics Stats */}
          <div className="w-full flex justify-start pointer-events-none mt-auto">
            <div className="w-[calc(100%-360px)] min-w-[560px] max-w-4xl bg-surface-container/90 backdrop-blur-2xl rounded-2xl border border-outline-variant/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] p-3.5 pointer-events-auto flex items-center justify-between">
              
              {/* Stat 1: Live Revenue Today */}
              <div className="flex items-center gap-3.5 px-4">
                <div className="w-11 h-11 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
                    Doanh Thu Tạm Tính Hôm Nay
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-black text-primary font-mono">
                      {(1280000 + liveRevenue).toLocaleString('vi-VN')}
                    </span>
                    <span className="font-mono text-[13px] text-primary font-bold">đ</span>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="w-px h-10 bg-outline-variant/20" />

              {/* Stat 2: Quãng đường chở loa */}
              <div className="flex items-center gap-3.5 px-4">
                <div className="w-11 h-11 rounded-xl bg-secondary-container/20 border border-secondary/30 flex items-center justify-center">
                  <Route className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
                    Tổng Quãng Đường Ship
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-extrabold text-on-surface font-mono">
                      34.6
                    </span>
                    <span className="font-mono text-[13px] text-secondary">km</span>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="w-px h-10 bg-outline-variant/20" />

              {/* Stat 3: Fast Action Button */}
              <div className="flex items-center px-4 pr-2">
                <button
                  onClick={() => onOpenCheckinModal('delivery')}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-surface-dim font-bold text-[13px] flex items-center gap-2 shadow-[0_0_15px_rgba(75,226,119,0.3)] transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Giao Loa Mới</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
