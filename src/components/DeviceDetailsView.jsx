import React, { useState, useEffect } from 'react';
import { 
  Speaker, 
  Battery, 
  Mic2, 
  MapPin, 
  Clock, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  PlusCircle, 
  Route, 
  Calendar,
  AlertCircle,
  Truck
} from 'lucide-react';

export default function DeviceDetailsView({ 
  speakers, 
  selectedSpeakerId, 
  onSelectSpeaker, 
  onOpenCheckinModal, 
  searchTerm 
}) {
  const [now, setNow] = useState(Date.now());

  // Ticker for live rental clock
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredSpeakers = speakers.filter(s => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q);
  });

  const selectedSpeaker = speakers.find(s => s.id === selectedSpeakerId) || speakers[0];

  // Calculate live rental timer
  let elapsedFormatted = "0h 00m 00s";
  let elapsedHoursDecimal = 0;
  let liveRentalAmount = 0;

  if (selectedSpeaker?.currentRental) {
    const elapsedMs = now - selectedSpeaker.currentRental.startTimestamp;
    const hrs = Math.floor(elapsedMs / (3600 * 1000));
    const mins = Math.floor((elapsedMs % (3600 * 1000)) / (60 * 1000));
    const secs = Math.floor((elapsedMs % (60 * 1000)) / 1000);
    elapsedFormatted = `${hrs}h ${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    
    elapsedHoursDecimal = Math.max(1, +(elapsedMs / (3600 * 1000)).toFixed(2));
    liveRentalAmount = Math.round(elapsedHoursDecimal * selectedSpeaker.hourlyRate) + (selectedSpeaker.currentRental.shippingFee || 0);
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto select-none space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container/80 backdrop-blur-xl border border-outline-variant/20 p-5 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(75,226,119,0.2)]">
            <Speaker className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-on-surface font-mono">{selectedSpeaker.id}</h1>
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                selectedSpeaker.status === 'renting'
                  ? 'bg-tertiary/20 text-tertiary border border-tertiary/30 animate-pulse'
                  : selectedSpeaker.status === 'returning'
                  ? 'bg-secondary/20 text-secondary border border-secondary/30'
                  : 'bg-primary/20 text-primary border border-primary/30'
              }`}>
                {selectedSpeaker.statusLabel}
              </span>
            </div>
            <p className="text-[13px] text-on-surface-variant mt-0.5">{selectedSpeaker.name} • Loại: <span className="text-on-surface font-semibold">{selectedSpeaker.type}</span></p>
          </div>
        </div>

        {/* Quick Check-in Actions */}
        <div className="flex items-center gap-2.5">
          {selectedSpeaker.status === 'available' ? (
            <button
              onClick={() => onOpenCheckinModal('delivery', selectedSpeaker.id)}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-surface-dim font-bold text-[13px] flex items-center gap-2 shadow-[0_0_12px_rgba(75,226,119,0.25)] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Giao Loa Này Đến Khách</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenCheckinModal('return', selectedSpeaker.id)}
              className="px-4 py-2 rounded-xl bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-bold text-[13px] flex items-center gap-2 shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check-in: Đã Chở Loa Về Nhà</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Speaker List / Right Deep Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Speaker Directory (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[14px] font-bold text-on-surface uppercase tracking-wider font-mono">
              Danh Sách Loa ({speakers.length} Loa)
            </h2>
            <span className="text-[11px] text-primary font-mono font-bold">
              {speakers.filter(s => s.status === 'available').length} Có Sẵn Tại Nhà
            </span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredSpeakers.map((spk) => {
              const isSelected = spk.id === selectedSpeaker.id;
              const isRenting = spk.status === 'renting';

              return (
                <div
                  key={spk.id}
                  onClick={() => onSelectSpeaker(spk.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container-high border-primary/60 shadow-[0_0_20px_rgba(75,226,119,0.15)] ring-1 ring-primary/40'
                      : 'bg-surface-container/60 hover:bg-surface-container-high border-outline-variant/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        isRenting ? 'bg-tertiary animate-ping' : spk.status === 'returning' ? 'bg-secondary' : 'bg-primary'
                      }`} />
                      <div>
                        <span className="font-mono text-[15px] font-bold text-on-surface">{spk.id}</span>
                        <div className="text-[12px] text-on-surface-variant font-medium line-clamp-1">{spk.name}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[13px] font-bold text-primary">{spk.hourlyRate.toLocaleString('vi-VN')}đ/h</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-outline-variant/10 text-[11px] font-mono">
                    <div>
                      <span className="text-on-surface-variant">Pin:</span>{' '}
                      <span className="text-on-surface font-semibold">{spk.battery}%</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Micro:</span>{' '}
                      <span className="text-primary font-bold">{spk.mics} mic</span>
                    </div>
                    <div className="text-right">
                      <span className={`${isRenting ? 'text-tertiary font-bold' : 'text-on-surface-variant'}`}>
                        {isRenting ? 'Đang thuê' : 'Tại nhà'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Speaker Telemetry & Live Rental Clock (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hardware Status Gauges (Pin, Micro, Đơn giá, Quãng đường) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Battery Level */}
            <div className="bg-surface-container/80 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[11px] font-mono uppercase font-semibold">Ắc Quy / Pin Loa</span>
                <Battery className="w-4 h-4 text-primary" />
              </div>
              <div className="my-2">
                <div className="text-[28px] font-black text-on-surface font-mono">{selectedSpeaker.battery}%</div>
                <div className="text-[11px] text-on-surface-variant font-mono">Hát liên tục ~6-8 tiếng</div>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${selectedSpeaker.battery < 30 ? 'bg-error' : 'bg-primary'}`}
                  style={{ width: `${selectedSpeaker.battery}%` }}
                />
              </div>
            </div>

            {/* Micro kèm theo */}
            <div className="bg-surface-container/80 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[11px] font-mono uppercase font-semibold">Phụ Kiện Kèm</span>
                <Mic2 className="w-4 h-4 text-secondary" />
              </div>
              <div className="my-2">
                <div className="text-[28px] font-black text-secondary font-mono">{selectedSpeaker.mics} Micro</div>
                <div className="text-[11px] text-on-surface-variant font-mono">Đủ dây sạc nguồn</div>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Đơn giá thuê */}
            <div className="bg-surface-container/80 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[11px] font-mono uppercase font-semibold">Đơn Giá Thuê</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div className="my-2">
                <div className="text-[24px] font-black text-primary font-mono">
                  {selectedSpeaker.hourlyRate.toLocaleString('vi-VN')}
                </div>
                <div className="text-[11px] text-on-surface-variant font-mono">VNĐ / mỗi tiếng</div>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Tổng doanh thu tích lũy của loa */}
            <div className="bg-surface-container/80 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="text-[11px] font-mono uppercase font-semibold">Tổng Ca Thuê</span>
                <Clock className="w-4 h-4 text-tertiary" />
              </div>
              <div className="my-2">
                <div className="text-[28px] font-black text-on-surface font-mono">{selectedSpeaker.totalRentalsCount} ca</div>
                <div className="text-[11px] text-primary font-mono font-bold">{(selectedSpeaker.totalRevenue / 1000000).toFixed(1)} triệu VNĐ</div>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-tertiary h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

          </div>

          {/* RENTAL ACTIVE DETAILS & LIVE CLOCK (Nếu đang cho thuê) */}
          {selectedSpeaker.currentRental ? (
            <div className="bg-surface-container/90 backdrop-blur-xl border border-tertiary/40 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/20 relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                    <h3 className="text-[17px] font-bold text-on-surface">Ca Thuê Đang Hoạt Động (Trực Tiếp)</h3>
                  </div>
                  <p className="text-[12px] text-on-surface-variant font-mono mt-0.5">Khách đã nhận loa và đang tính tiền theo giờ</p>
                </div>

                <a
                  href={`tel:${selectedSpeaker.currentRental.customerPhone}`}
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright border border-outline-variant/30 text-on-surface text-[13px] font-mono flex items-center gap-2 transition-all w-fit"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Gọi Cho Khách: {selectedSpeaker.currentRental.customerPhone}</span>
                </a>
              </div>

              {/* Live Rental Stopwatch Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                
                {/* Timer Clock */}
                <div className="bg-surface-container-high/80 border border-outline-variant/20 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
                    Thời Gian Khách Đã Thuê (Live Timer)
                  </span>
                  <div className="text-[32px] font-black text-primary font-mono my-1 tracking-wider">
                    {elapsedFormatted}
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-mono">
                    Check-in giao lúc: <strong className="text-on-surface">{selectedSpeaker.currentRental.startTime}</strong>
                  </div>
                </div>

                {/* Amount Accumulator */}
                <div className="bg-surface-container-high/80 border border-outline-variant/20 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
                    Tiền Thuê Tạm Tính Hiện Tại
                  </span>
                  <div className="text-[32px] font-black text-tertiary font-mono my-1 tracking-wider">
                    {liveRentalAmount.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-mono">
                    ({elapsedHoursDecimal}h × {selectedSpeaker.hourlyRate.toLocaleString('vi-VN')}đ) + Ship {selectedSpeaker.currentRental.shippingFee.toLocaleString('vi-VN')}đ
                  </div>
                </div>

              </div>

              {/* Customer & Location Dossier */}
              <div className="bg-surface-container-low/80 p-4 rounded-xl border border-outline-variant/15 space-y-2 text-[13px] relative z-10">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Khách thuê:</span>
                  <strong className="text-on-surface">{selectedSpeaker.currentRental.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Địa chỉ giao loa:</span>
                  <span className="font-medium text-on-surface text-right">{selectedSpeaker.currentRental.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Quãng đường chở từ nhà:</span>
                  <span className="font-mono text-secondary font-bold">{selectedSpeaker.currentRental.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Ghi chú phụ kiện:</span>
                  <span className="text-on-surface-variant">{selectedSpeaker.currentRental.notes}</span>
                </div>
              </div>

              {/* Return Button Trigger */}
              <button
                onClick={() => onOpenCheckinModal('return', selectedSpeaker.id)}
                className="w-full py-3 bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-bold rounded-xl flex items-center justify-center gap-2 text-[14px] shadow-lg transition-all relative z-10"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Check-in: Khách Đã Trả & Đã Chở Loa Về Nhà (Chốt Tiền)</span>
              </button>

            </div>
          ) : (
            <div className="bg-surface-container/80 backdrop-blur-xl border border-outline-variant/20 p-8 rounded-2xl text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto">
                <Speaker className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-on-surface">Loa Hiện Đang Ở Nhà / Kho Sẵn Sàng</h3>
                <p className="text-[13px] text-on-surface-variant max-w-md mx-auto mt-1">
                  Loa đã được sạc đầy pin ắc quy ({selectedSpeaker.battery}%), đầy đủ 2 micro không dây và dây sạc. Sẵn sàng chở đi giao khách bất cứ lúc nào!
                </p>
              </div>
              <button
                onClick={() => onOpenCheckinModal('delivery', selectedSpeaker.id)}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-surface-dim font-bold rounded-xl inline-flex items-center gap-2 text-[14px] shadow-[0_0_15px_rgba(75,226,119,0.3)] transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                <span>+ Check-in Chở Loa Này Đi Giao Khách</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
