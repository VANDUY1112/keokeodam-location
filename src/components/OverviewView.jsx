import React, { useState } from 'react';
import { 
  Crosshair, 
  MoreHorizontal, 
  Route, 
  Home,
  Speaker,
  Clock,
  Phone,
  PlusCircle,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  MapPin
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
  const [mapMode, setMapMode] = useState('light');
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
    <div className="flex flex-col w-full relative select-none p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* TOP 4 SUMMARY METRIC CARDS (Ocean Blue + Clean White) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Doanh Thu Hôm Nay */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-ocean-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 font-mono">Doanh Thu Tạm Tính</span>
            <div className="w-8 h-8 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[26px] font-black text-ocean-700 font-mono">
              {(1280000 + liveRevenue).toLocaleString('vi-VN')}
            </span>
            <span className="text-[14px] text-ocean-600 font-bold font-mono">đ</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Bao gồm các ca đang hát trực tiếp</div>
        </div>

        {/* Card 2: Đang Cho Thuê */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 font-mono">Khách Đang Thuê</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Speaker className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[26px] font-black text-amber-600 font-mono">
              {rentingSpeakers.length}
            </span>
            <span className="text-[13px] text-slate-600 font-bold font-mono">/ {speakers.length} loa</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Đồng hồ đang tính tiền theo giờ</div>
        </div>

        {/* Card 3: Có Sẵn Tại Nhà */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 font-mono">Sẵn Sàng Tại Nhà</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[26px] font-black text-emerald-600 font-mono">
              {availableSpeakers.length}
            </span>
            <span className="text-[13px] text-slate-600 font-bold font-mono">loa có sẵn</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Pin 100%, sẵn sàng chở đi ngay</div>
        </div>

        {/* Card 4: Quãng Đường Đã Chở */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-ocean-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400 font-mono">Quãng Đường Chở</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Route className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[26px] font-black text-slate-800 font-mono">
              34.6
            </span>
            <span className="text-[13px] text-slate-600 font-bold font-mono">km hôm nay</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Tổng quãng đường các ca giao/trả</div>
        </div>

      </div>

      {/* MAP & STATUS SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / CENTER: INTERACTIVE SPEAKER MAP (8 COLS) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs relative flex flex-col min-h-[580px]">
          
          {/* Map Top Bar */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ocean-600" />
              <span className="text-[14px] font-bold text-slate-800">Bản Đồ Định Vị Loa & Kho Nhà</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFocusedSpeaker(null)}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[12px] font-bold text-ocean-700 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Căn Giữa Nhà</span>
              </button>
            </div>
          </div>

          {/* MAP CANVAS VIEWPORT */}
          <div className="relative flex-1 bg-slate-100 map-grid-light overflow-hidden min-h-[500px]">
            
            {/* Soft map background texture */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply pointer-events-none"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy5zZ1NkFknjAXS99GyBryk1Q11T4kFo-00DpJq-3DclvBOKmjO-2BNkaB4W9NSiGbi9o7a4ptSL52Pr7WBGO-QkRzoGQfXQPOWv7UesjA-h5wQUbNkL0YdT8mtlsGjsUT_ovJzBjqkAOJYGNAdU84TnkEHZX6J56BzaC6eomRip10VovB6k6vk3GlbggmDIK4jxclgbnCugwLmcFdV6BtraUms9-V_2e3r5Y-aoqoLTCrj-q0ccZU')`
              }}
            />

            {/* DISTANCE LINES FROM HOME TO RENTING SPEAKERS */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id="lightDeliveryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                </linearGradient>
              </defs>

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
                      stroke="url(#lightDeliveryGradient)"
                      strokeWidth="2.5"
                      strokeDasharray="6,6"
                    />
                    <text
                      x={`${(50 + target.x) / 2}%`}
                      y={`${(50 + target.y) / 2 - 2}%`}
                      fill="#0369a1"
                      fontSize="11"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {spk.currentRental.distanceKm} km
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* HOME BASE MARKER (CENTER 50%, 50%) */}
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center group cursor-pointer pointer-events-auto">
              <div className="px-3 py-1 bg-ocean-700 text-white font-bold shadow-md rounded-xl mb-1.5 flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                <Home className="w-3.5 h-3.5" />
                <span>KHO LOA TẠI NHÀ (Số 45 Đường Số 8)</span>
              </div>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-ocean-500/20 rounded-full animate-ping"></div>
                <div className="w-8 h-8 rounded-full bg-ocean-600 flex items-center justify-center shadow-lg border-2 border-white text-white">
                  <Home className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* SPEAKER LOCATION MARKERS */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {filteredSpeakers.map((spk) => {
                if (spk.status === 'available') return null;

                const isRenting = spk.status === 'renting';
                const coords = spk.currentRental?.coords || { x: 50, y: 50 };
                const isFocused = focusedSpeaker?.id === spk.id;

                const elapsedMs = spk.currentRental ? Date.now() - spk.currentRental.startTimestamp : 0;
                const elapsedHours = Math.floor(elapsedMs / (3600 * 1000));
                const elapsedMins = Math.floor((elapsedMs % (3600 * 1000)) / (60 * 1000));

                return (
                  <div
                    key={spk.id}
                    style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
                    onClick={() => setFocusedSpeaker(spk)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer pointer-events-auto transition-transform duration-200 ${
                      isFocused ? 'scale-115 z-40' : 'hover:scale-110 z-30'
                    }`}
                  >
                    <div className={`px-2.5 py-1.5 bg-white border border-slate-200 shadow-md rounded-xl mb-1 flex flex-col items-center gap-0.5 ${
                      isFocused ? 'ring-2 ring-ocean-600' : ''
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isRenting ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span className="font-mono text-[12px] font-bold text-slate-800">
                          {spk.id}
                        </span>
                        <span className="text-[10px] text-amber-700 font-bold font-mono bg-amber-50 px-1 rounded">
                          {elapsedHours}h{elapsedMins}p
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium line-clamp-1 max-w-[120px]">
                        {spk.currentRental?.customerName}
                      </span>
                    </div>

                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white text-white ${
                        isRenting ? 'bg-amber-500' : 'bg-slate-600'
                      }`}>
                        <Speaker className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOCUSED SPEAKER FLOATING POPUP */}
            {focusedSpeaker && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-[380px] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-ocean-50 text-ocean-700 flex items-center justify-center font-bold">
                      <Speaker className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[15px] font-bold text-ocean-800">{focusedSpeaker.id}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {focusedSpeaker.statusLabel}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">{focusedSpeaker.name}</div>
                    </div>
                  </div>
                  <button onClick={() => setFocusedSpeaker(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                {focusedSpeaker.currentRental && (
                  <div className="py-2.5 space-y-2 text-[12px]">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Khách thuê:</span>
                        <strong className="text-slate-800">{focusedSpeaker.currentRental.customerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Số điện thoại:</span>
                        <a href={`tel:${focusedSpeaker.currentRental.customerPhone}`} className="font-mono text-ocean-700 font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {focusedSpeaker.currentRental.customerPhone}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Địa chỉ giao:</span>
                        <span className="text-slate-700 text-right max-w-[180px]">{focusedSpeaker.currentRental.address}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="text-[10px] text-slate-500">Giờ giao</div>
                        <div className="text-[14px] font-bold text-slate-800 font-mono">{focusedSpeaker.currentRental.startTime}</div>
                      </div>
                      <div className="bg-ocean-50 p-2 rounded-lg border border-ocean-100">
                        <div className="text-[10px] text-ocean-600">Đơn giá</div>
                        <div className="text-[14px] font-bold text-ocean-800 font-mono">{focusedSpeaker.hourlyRate.toLocaleString('vi-VN')}đ/h</div>
                      </div>
                    </div>

                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={() => {
                          onOpenCheckinModal('return', focusedSpeaker.id);
                          setFocusedSpeaker(null);
                        }}
                        className="flex-1 py-2 bg-ocean-600 hover:bg-ocean-700 text-white font-bold rounded-xl text-[12px] flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Loa Đã Về Nhà (Chốt Tiền)</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectSpeaker(focusedSpeaker.id);
                          setActiveTab('device-details');
                        }}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700"
                        title="Xem chi tiết loa"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT: LIST OF SPEAKERS (4 COLS) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-[16px] font-bold text-slate-800">Danh Sách Loa & Ca Thuê</h2>
              <p className="text-[11px] text-slate-500">Bấm vào loa để xem vị trí trên bản đồ</p>
            </div>
            <button
              onClick={() => onOpenCheckinModal('delivery')}
              className="px-3 py-1.5 bg-ocean-600 hover:bg-ocean-700 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Giao Loa</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`py-1.5 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Tất Cả ({speakers.length})
            </button>
            <button
              onClick={() => setStatusFilter('renting')}
              className={`py-1.5 rounded-lg transition-all ${statusFilter === 'renting' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'}`}
            >
              Đang Thuê ({rentingSpeakers.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`py-1.5 rounded-lg transition-all ${statusFilter === 'available' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              Tại Nhà ({availableSpeakers.length})
            </button>
          </div>

          {/* Speakers List */}
          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {filteredSpeakers.map((spk) => {
              const isRenting = spk.status === 'renting';

              return (
                <div
                  key={spk.id}
                  onClick={() => {
                    setFocusedSpeaker(spk);
                    onSelectSpeaker(spk.id);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    focusedSpeaker?.id === spk.id
                      ? 'bg-ocean-50/70 border-ocean-300 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isRenting ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <div>
                        <span className="font-mono text-[14px] font-bold text-slate-900">{spk.id}</span>
                        <div className="text-[11px] text-slate-500 font-medium line-clamp-1">{spk.name}</div>
                      </div>
                    </div>

                    <span className="text-[12px] font-mono font-bold text-ocean-700">{spk.hourlyRate.toLocaleString('vi-VN')}đ/h</span>
                  </div>

                  {isRenting && spk.currentRental ? (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center">
                      <span className="text-slate-600 font-medium truncate max-w-[180px]">Khách: {spk.currentRental.customerName}</span>
                      <span className="font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Giao: {spk.currentRental.startTime}</span>
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center text-slate-500">
                      <span>Pin: {spk.battery}% • 2 Micro</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Sẵn Sàng</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
