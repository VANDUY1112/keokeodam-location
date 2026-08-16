import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { HOME_LOCATION } from '../data/speakersData';

export default function DeviceDetailsView({ 
  speakers = [], 
  selectedSpeakerId = 'LKK-01', 
  onSelectSpeaker, 
  onOpenCheckinModal, 
  onOpenAddSpeakerModal, 
  onOpenReceiptModal, 
  searchTerm = '' 
}) {
  const [currentId, setCurrentId] = useState(selectedSpeakerId || 'LKK-01');
  const [now, setNow] = useState(Date.now());
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLineRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);

  const speaker = speakers.find(s => s.id === currentId) || speakers[0] || {};
  const isRenting = speaker.status === 'renting';

  // Live rental calculations
  const rentalDurationHrs = isRenting && speaker.currentRental 
    ? Math.max(1, (now - speaker.currentRental.startTimestamp) / 3600000).toFixed(1)
    : 0;
  const elapsedMinutes = isRenting && speaker.currentRental 
    ? Math.floor(((now - speaker.currentRental.startTimestamp) % 3600000) / 60000)
    : 0;
  const elapsedHoursInt = isRenting && speaker.currentRental 
    ? Math.floor((now - speaker.currentRental.startTimestamp) / 3600000)
    : 0;

  const currentRentalCost = isRenting && speaker.currentRental 
    ? Math.round(rentalDurationHrs * speaker.hourlyRate)
    : 0;
  const shippingFee = speaker.currentRental?.shippingFee || 0;
  const deposit = speaker.currentRental?.deposit || 0;
  const totalDue = currentRentalCost + shippingFee - deposit;

  // Initialize Map for current speaker route
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const homeLat = HOME_LOCATION.lat || 10.8752;
    const homeLng = HOME_LOCATION.lng || 106.7725;

    const destLat = speaker.currentRental?.lat || (homeLat + (speaker.currentRental?.coords?.y - 50) * 0.003) || homeLat + 0.015;
    const destLng = speaker.currentRental?.lng || (homeLng + (speaker.currentRental?.coords?.x - 50) * 0.003) || homeLng + 0.018;

    const map = L.map(mapContainerRef.current, {
      center: isRenting ? [(homeLat + destLat) / 2, (homeLng + destLng) / 2] : [homeLat, homeLng],
      zoom: isRenting ? 13 : 14,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Home base marker
    const homeIcon = L.divIcon({
      className: 'home-pin',
      html: `
        <div class="flex flex-col items-center" style="transform: translate(-50%, -50%);">
          <div class="px-2 py-0.5 bg-primary text-white font-bold text-[10px] rounded shadow mb-1">Kho Nhà</div>
          <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-symbols-outlined text-[18px]">home</span>
          </div>
        </div>
      `,
      iconSize: [80, 50],
      iconAnchor: [40, 25]
    });
    L.marker([homeLat, homeLng], { icon: homeIcon }).addTo(map);

    // If renting, draw delivery route and customer location marker
    if (isRenting && speaker.currentRental) {
      const routePoints = [
        [homeLat, homeLng],
        [destLat, destLng]
      ];

      L.polyline(routePoints, {
        color: '#005ab3',
        weight: 4,
        opacity: 0.9,
        dashArray: '6, 6'
      }).addTo(map);

      const customerIcon = L.divIcon({
        className: 'customer-pin',
        html: `
          <div class="flex flex-col items-center" style="transform: translate(-50%, -50%);">
            <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center animate-ping absolute top-0"></div>
            <div class="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl border-2 border-white z-10">
              <span class="material-symbols-outlined text-[20px]">speaker</span>
            </div>
            <div class="mt-1 bg-white px-2 py-0.5 rounded shadow text-center border border-slate-300">
              <span class="font-bold text-[11px] text-slate-800">${speaker.currentRental.customerName}</span>
              <div class="text-[9px] text-primary font-mono font-bold">${speaker.currentRental.distanceKm} km</div>
            </div>
          </div>
        `,
        iconSize: [110, 60],
        iconAnchor: [55, 30]
      });

      L.marker([destLat, destLng], { icon: customerIcon }).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentId, speaker]);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden bg-background select-none -m-container-margin">
      <div className="flex-1 flex overflow-hidden">
        
        {/* ═══════════════ LEFT SIDEBAR: THÔNG TIN CHI TIẾT LOA & HÀNH TRÌNH (W-96) ═══════════════ */}
        <aside className="w-96 bg-surface flex flex-col shadow-[1px_0_4px_rgba(0,0,0,0.05)] z-10 shrink-0 border-r border-outline-variant/20">
          
          {/* Speaker Selector Pill Strip */}
          <div className="p-stack-sm bg-surface-container-low border-b border-outline-variant/20 flex gap-1.5 overflow-x-auto">
            {speakers.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentId(s.id);
                  if (onSelectSpeaker) onSelectSpeaker(s.id);
                }}
                className={`px-3 py-1 rounded-lg text-[12px] font-mono font-bold transition-all whitespace-nowrap ${
                  s.id === currentId 
                    ? 'bg-primary text-on-primary shadow-xs' 
                    : s.status === 'renting'
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-surface text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>

          {/* Speaker Card Header */}
          <div className="p-stack-lg border-b border-outline-variant/20 flex flex-col gap-stack-sm bg-surface-container-lowest relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-md text-headline-md text-on-surface font-mono font-extrabold">{speaker.id}</h1>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    isRenting ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {speaker.statusLabel || (isRenting ? 'Khách đang thuê' : 'Tại kho nhà')}
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 font-medium">
                  {speaker.name} ({speaker.type})
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">speaker</span>
              </div>
            </div>

            <div className="mt-stack-sm flex items-center justify-between text-[12px] bg-surface-container-low p-2 rounded-lg font-mono">
              <span>Đơn giá thuê: <strong className="text-primary">{speaker.hourlyRate?.toLocaleString('vi-VN')}đ / giờ</strong></span>
              <span>Pin: <strong className="text-emerald-700">{speaker.battery}%</strong></span>
            </div>
          </div>

          {/* Scroll Area */}
          <div className="flex-1 overflow-y-auto p-stack-lg flex flex-col gap-stack-lg custom-scrollbar">
            
            {/* IF RENTING: LIVE RENTAL JOURNEY DETAILS */}
            {isRenting && speaker.currentRental ? (
              <div className="flex flex-col gap-stack-md">
                
                {/* Live Meter Widget */}
                <div className="bg-primary/5 border border-primary/20 p-stack-md rounded-2xl flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-label-md uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span> Đồng hồ tính tiền
                    </span>
                    <span className="font-mono text-primary font-bold">Giao lúc: {speaker.currentRental.startTime}</span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <div className="text-[28px] font-mono font-black text-on-surface leading-tight">
                        {elapsedHoursInt}h {elapsedMinutes}p
                      </div>
                      <div className="text-[11px] text-on-surface-variant">Thời lượng hát thực tế</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[22px] font-mono font-black text-emerald-700 leading-tight">
                        {currentRentalCost.toLocaleString('vi-VN')}đ
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">Tiền giờ tạm tính</div>
                    </div>
                  </div>
                </div>

                {/* Customer & Location */}
                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/20 space-y-2 text-[12px]">
                  <div className="font-label-md text-on-surface-variant uppercase font-bold text-[11px]">
                    Thông tin chuyến giao loa
                  </div>

                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Khách thuê:</span>
                    <strong className="text-on-surface">{speaker.currentRental.customerName}</strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant">Số điện thoại:</span>
                    <a href={`tel:${speaker.currentRental.customerPhone}`} className="text-primary font-bold font-mono hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      {speaker.currentRental.customerPhone}
                    </a>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Địa điểm giao:</span>
                    <span className="text-right font-medium max-w-[180px] truncate" title={speaker.currentRental.address}>
                      {speaker.currentRental.address}
                    </span>
                  </div>

                  <div className="pt-1.5 border-t border-outline-variant/20 flex justify-between font-mono">
                    <span>Quãng đường chở đi:</span>
                    <strong className="text-primary">{speaker.currentRental.distanceKm} km</strong>
                  </div>

                  <div className="flex justify-between font-mono">
                    <span>Phí ship vận chuyển:</span>
                    <strong>+{speaker.currentRental.shippingFee?.toLocaleString('vi-VN')}đ</strong>
                  </div>

                  {deposit > 0 && (
                    <div className="flex justify-between font-mono text-amber-700">
                      <span>Đã đặt cọc trước:</span>
                      <strong>-{deposit.toLocaleString('vi-VN')}đ</strong>
                    </div>
                  )}

                  <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center text-[13px]">
                    <span className="font-bold text-on-surface">Tổng tiền cần thu:</span>
                    <span className="font-mono font-black text-[16px] text-emerald-700">
                      {Math.max(0, totalDue).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Main Action Button: End Journey */}
                <button
                  onClick={() => onOpenCheckinModal('return', speaker.id)}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Kết Thúc Hành Trình &amp; Thu Loa Về</span>
                </button>
              </div>
            ) : (
              /* IF AVAILABLE: READY TO DELIVER */
              <div className="flex flex-col gap-stack-md">
                <div className="bg-emerald-50 border border-emerald-200 p-stack-md rounded-2xl flex flex-col gap-1 text-emerald-800">
                  <div className="font-bold flex items-center gap-1 text-[13px]">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Loa đang sẵn sàng tại kho nhà
                  </div>
                  <div className="text-[12px] opacity-90">
                    Pin {speaker.battery}% đầy đủ 2 micro không dây, dây sạc. Sẵn sàng giao ngay cho khách mới.
                  </div>
                </div>

                <button
                  onClick={() => onOpenCheckinModal('delivery', speaker.id)}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>Giao Loa Cho Khách Mới</span>
                </button>
              </div>
            )}

            {/* Hardware Status */}
            <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/20 space-y-2 text-[12px]">
              <div className="font-label-md text-on-surface-variant uppercase font-bold text-[11px]">
                Trạng thái thiết bị &amp; Phụ kiện
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-container-low p-2 rounded-lg">
                  <div className="text-on-surface-variant">Micro không dây</div>
                  <div className="font-bold text-on-surface font-mono">{speaker.mics || 2} Cây (Pin Tốt)</div>
                </div>
                <div className="bg-surface-container-low p-2 rounded-lg">
                  <div className="text-on-surface-variant">Dây nguồn / Sạc</div>
                  <div className="font-bold text-emerald-700">Đầy đủ</div>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* ═══════════════ MAIN CONTENT: INTERACTIVE MAP OF JOURNEY ═══════════════ */}
        <section className="flex-1 flex flex-col relative bg-surface-dim">
          <div ref={mapContainerRef} className="flex-1 relative w-full h-full z-0"></div>

          {/* Floating Info Banner over Map */}
          <div className="absolute top-4 left-4 z-10 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-outline-variant/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
            <div>
              <div className="text-[13px] font-bold text-on-surface">
                {isRenting ? `Hành trình giao loa ${speaker.id}` : `Vị trí kho nhà (${speaker.id} đang ở kho)`}
              </div>
              <div className="text-[11px] text-on-surface-variant font-mono">
                {isRenting ? `Khoảng cách từ nhà đến khách: ${speaker.currentRental?.distanceKm} km` : HOME_LOCATION.address}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
