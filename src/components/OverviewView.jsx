import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { HOME_LOCATION } from '../data/speakersData';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Speaker, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  BatteryCharging, 
  Mic2, 
  Phone, 
  FileText, 
  Plus, 
  Radio, 
  BarChart3, 
  PieChart,
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  Compass,
  Milestone
} from 'lucide-react';

export default function OverviewView({ 
  speakers = [], 
  onSelectSpeaker, 
  onOpenCheckinModal, 
  setActiveTab 
}) {
  const [now, setNow] = useState(Date.now());
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const renting = speakers.filter(s => s.status === 'renting');
  const available = speakers.filter(s => s.status === 'available');

  const totalDistance = renting.reduce((acc, s) => acc + (s.currentRental?.distanceKm || 0), 0);
  const totalDeposit = renting.reduce((acc, s) => acc + (s.currentRental?.deposit || 0), 0);

  // Initialize Leaflet map with custom modern styling
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const homeLat = HOME_LOCATION.lat || 10.8752;
    const homeLng = HOME_LOCATION.lng || 106.7725;

    const map = L.map(mapContainerRef.current, {
      center: [homeLat, homeLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    // Home Marker with luxury badge
    const homeIcon = L.divIcon({
      className: 'home-pin-custom',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -50%);">
          <div style="background:linear-gradient(135deg, #b5000b, #8c0008); color:#fff; font-weight:800; font-size:11px; padding:3px 10px; border-radius:8px; box-shadow:0 4px 14px rgba(181,0,11,0.4); margin-bottom:3px; white-space:nowrap; border:1.5px solid rgba(255,255,255,0.6); display:flex; align-items:center; gap:4px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#fff; display:inline-block;"></span>
            KHO NHÀ CHÍNH
          </div>
          <div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, #b5000b, #8c0008); color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(181,0,11,0.5); border:3px solid #fff;">
            <span class="material-symbols-outlined" style="font-size:18px;">home</span>
          </div>
        </div>
      `,
      iconSize: [120, 55],
      iconAnchor: [60, 28]
    });
    const homeMarker = L.marker([homeLat, homeLng], { icon: homeIcon }).addTo(map);
    homeMarker.bindPopup(`
      <div style="font-family:sans-serif; padding:4px; font-size:13px;">
        <strong style="color:#b5000b; font-size:14px;">Kho Tổng Locahome</strong>
        <p style="margin:3px 0 0 0; color:#475569;">Đường Hùng Vương, P. 7, TP. Tuy Hòa, Phú Yên</p>
      </div>
    `);

    // Customer Pins with live radar wave
    const bounds = L.latLngBounds([[homeLat, homeLng]]);

    renting.forEach(s => {
      if (s.currentRental) {
        const destLat = s.currentRental.lat || (homeLat + (s.currentRental.coords?.y - 50) * 0.003);
        const destLng = s.currentRental.lng || (homeLng + (s.currentRental.coords?.x - 50) * 0.003);

        bounds.extend([destLat, destLng]);

        // Route casing line with glowing gradient effect
        L.polyline([[homeLat, homeLng], [destLat, destLng]], {
          color: '#fecdd3',
          weight: 6,
          opacity: 0.8
        }).addTo(map);

        L.polyline([[homeLat, homeLng], [destLat, destLng]], {
          color: '#b5000b',
          weight: 3,
          opacity: 0.95,
          dashArray: '6, 6'
        }).addTo(map);

        const spkIcon = L.divIcon({
          className: 'speaker-pin-custom',
          html: `
            <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer; transform:translate(-50%, -50%);">
              <div style="background:#ffffff; color:#0f172a; font-weight:800; font-size:11.5px; padding:3px 10px; border-radius:8px; box-shadow:0 6px 16px rgba(0,0,0,0.12); margin-bottom:4px; white-space:nowrap; border:2px solid #10b981; display:flex; align-items:center; gap:5px;">
                <span style="width:7px; height:7px; border-radius:50%; background:#10b981; display:inline-block;"></span>
                <span style="color:#b5000b; font-family:monospace; font-weight:900;">${s.id}</span> • ${s.currentRental.customerName.split(' ')[0]}
              </div>
              <div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, #10b981, #059669); color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 18px rgba(16,185,129,0.5); border:3px solid #fff;" class="speaker-marker-pulse">
                <span class="material-symbols-outlined" style="font-size:18px;">speaker</span>
              </div>
            </div>
          `,
          iconSize: [130, 60],
          iconAnchor: [65, 30]
        });

        const marker = L.marker([destLat, destLng], { icon: spkIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:sans-serif; padding:4px; font-size:13px;">
            <div style="font-weight:800; color:#b5000b; font-size:14px;">${s.id} - ${s.name}</div>
            <div style="font-weight:700; color:#0f172a; margin-top:3px;">Khách: ${s.currentRental.customerName}</div>
            <div style="color:#64748b; margin-top:2px;">Địa chỉ: ${s.currentRental.address}</div>
            <div style="color:#059669; font-weight:700; margin-top:4px;">Cự ly: ${s.currentRental.distanceKm || 4.2} km | Cọc: ${(s.currentRental.deposit || 0).toLocaleString()}đ</div>
          </div>
        `);

        marker.on('click', () => {
          onSelectSpeaker(s.id);
        });
      }
    });

    if (renting.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [speakers]);

  // Format live duration
  const getLiveDuration = (startTimestamp) => {
    if (!startTimestamp) return '00:00:00';
    const diff = Math.max(0, now - startTimestamp);
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Estimate bill
  const getLiveEstimatedBill = (spk) => {
    if (!spk.currentRental) return 0;
    const diffHours = Math.max(1, (now - spk.currentRental.startTimestamp) / 3600000);
    const hourlyFee = Math.ceil(diffHours * spk.hourlyRate);
    const shipping = spk.currentRental.shippingFee || 0;
    const deposit = spk.currentRental.deposit || 0;
    return Math.max(0, hourlyFee + shipping - deposit);
  };

  return (
    <div className="p-6 max-w-[1680px] mx-auto space-y-5 font-sans select-none text-slate-800">
      
      {/* ═══════════════ HEADER COMMAND BAR (GLASSMORPHIC) ═══════════════ */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle background ambient mesh glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/40 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-[25px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Bảng điều khiển <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b5000b] to-[#8c0008]">Tổng quan</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-extrabold bg-red-50 text-[#b5000b] border border-red-200/80 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b5000b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b5000b]"></span>
              </span>
              Live Telemetry
            </span>
          </div>
          <p className="text-[13.5px] text-slate-500 font-medium mt-1">
            Hệ thống giám sát định vị hành trình, thời gian hát thực tế và doanh thu dàn loa kẹo kéo gia đình.
          </p>
        </div>

        {/* Action Controls Group */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap relative z-10">
          {/* Live Status Pill */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-100/90 border border-slate-200 text-[13px] font-semibold text-slate-700 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{renting.length} ca đang hát</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">{available.length} loa sẵn sàng</span>
          </div>

          <button
            onClick={() => setActiveTab('bao-cao')}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-[13.5px] font-semibold shadow-xs hover:shadow transition-all cursor-pointer hover:border-slate-300 active:scale-98"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Sổ Sách Phiếu Thu</span>
          </button>

          <button
            onClick={() => onOpenCheckinModal('delivery')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b5000b] to-[#99000a] hover:from-[#8c0008] hover:to-[#730006] text-white text-[13.5px] font-bold shadow-md shadow-red-950/20 hover:shadow-lg hover:shadow-red-950/30 transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>Giao Loa Cho Khách</span>
          </button>
        </div>
      </div>

      {/* ═══════════════ ROW 1: 4 BENTO KPI CARDS (HIGH-END GRADIENTS & SPARKLINES) ═══════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        
        {/* KPI 1: Doanh Thu */}
        <div className="kpi-card p-5 relative overflow-hidden flex flex-col justify-between group border-l-4 border-l-[#b5000b]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">
                Doanh thu 7 ngày qua
              </span>
              <div className="text-[28px] font-mono font-extrabold text-slate-900 mt-1 leading-tight flex items-baseline gap-1">
                9,450,000 <span className="text-[14px] font-sans font-semibold text-slate-400">đ</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-50 to-red-100/60 text-[#b5000b] flex items-center justify-center border border-red-200/60 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5 stroke-[2.4]" />
            </div>
          </div>

          {/* Mini integrated SVG sparkline */}
          <div className="my-2 h-7 w-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,20 Q15,22 30,15 T60,18 T80,5 L100,8" fill="none" stroke="#b5000b" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[12.5px]">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" /> +12.5% vs tuần trước
            </span>
            <span className="text-slate-400 font-mono text-[12px]">Đạt 78.8%</span>
          </div>
        </div>

        {/* KPI 2: Tình Trạng Dàn Loa */}
        <div className="kpi-card p-5 relative overflow-hidden flex flex-col justify-between group border-l-4 border-l-emerald-600">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">
                Tình trạng dàn loa
              </span>
              <div className="text-[28px] font-mono font-extrabold text-slate-900 mt-1 leading-tight flex items-baseline gap-1.5">
                <span>{renting.length}</span>
                <span className="text-[14px] text-slate-400 font-bold">/ {speakers.length} loa đang hát</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Speaker className="w-5 h-5 stroke-[2.4]" />
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="my-2 h-7 w-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,15 Q25,8 50,12 T80,5 L100,5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[12.5px]">
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {available.length} loa tại kho sẵn sàng
            </span>
            <span className="text-slate-400 font-mono text-[12px]">0 hư hỏng</span>
          </div>
        </div>

        {/* KPI 3: Quãng Đường */}
        <div className="kpi-card p-5 relative overflow-hidden flex flex-col justify-between group border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">
                Quãng đường chở loa tuần
              </span>
              <div className="text-[28px] font-mono font-extrabold text-slate-900 mt-1 leading-tight flex items-baseline gap-1">
                185.4 <span className="text-[14px] font-sans font-semibold text-slate-400">km</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Milestone className="w-5 h-5 stroke-[2.4]" />
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="my-2 h-7 w-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,18 Q20,5 45,15 T80,10 L100,6" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[12.5px]">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đúng hẹn 100%
            </span>
            <span className="text-amber-700 font-bold font-mono text-[12px]">TB 4.2 km/ca</span>
          </div>
        </div>

        {/* KPI 4: Pin & Micro */}
        <div className="kpi-card p-5 relative overflow-hidden flex flex-col justify-between group border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">
                Kiểm tra Pin &amp; Micro
              </span>
              <div className="text-[28px] font-mono font-extrabold text-slate-900 mt-1 leading-tight flex items-baseline gap-1">
                12 / 12 <span className="text-[14px] font-sans font-semibold text-slate-400">Micro đủ</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Mic2 className="w-5 h-5 stroke-[2.4]" />
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="my-2 h-7 w-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path d="M0,8 Q30,12 60,6 T100,5" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[12.5px]">
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <BatteryCharging className="w-3.5 h-3.5" /> Pin TB 86%
            </span>
            <span className="text-slate-400 font-mono text-[12px]">0 thất lạc</span>
          </div>
        </div>

      </div>

      {/* ═══════════════ ROW 2: MIDDLE ANALYTICS (2 BOXES) ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5">
        
        {/* Box Left (4 cols): Hiệu Suất Khai Thác (Radial Rings) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50/90 to-transparent border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-50 text-[#b5000b] flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900">
                Hiệu suất khai thác dàn loa
              </h3>
            </div>
            <span className="text-[11.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
              83% Tối ưu
            </span>
          </div>

          <div className="p-5 flex items-center gap-5">
            {/* Multi-Ring Donut Gauge SVG */}
            <div className="relative w-34 h-34 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Outer Ring: Đang cho thuê (50%) */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                <circle 
                  cx="50" cy="50" r="42" fill="none" 
                  stroke="#b5000b" strokeWidth="7" 
                  strokeDasharray="264" strokeDashoffset="66" 
                  strokeLinecap="round" 
                />

                {/* Middle Ring: Tại kho sẵn sàng (33%) */}
                <circle cx="50" cy="50" r="32" fill="none" stroke="#f1f5f9" strokeWidth="6.5" />
                <circle 
                  cx="50" cy="50" r="32" fill="none" 
                  stroke="#10b981" strokeWidth="6.5" 
                  strokeDasharray="201" strokeDashoffset="67" 
                  strokeLinecap="round" 
                />

                {/* Inner Ring: Bảo dưỡng (17%) */}
                <circle cx="50" cy="50" r="22" fill="none" stroke="#f1f5f9" strokeWidth="5.5" />
                <circle 
                  cx="50" cy="50" r="22" fill="none" 
                  stroke="#f59e0b" strokeWidth="5.5" 
                  strokeDasharray="138" strokeDashoffset="105" 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[26px] font-mono font-extrabold text-slate-900 leading-none">83%</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#b5000b] mt-0.5">Dàn loa</span>
              </div>
            </div>

            {/* 3 Progress Bars with Gradient Fills */}
            <div className="flex-1 space-y-3 text-[13px] font-bold">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b5000b]"></span> Đang cho thuê
                  </span>
                  <span className="font-mono text-slate-900 font-bold">{renting.length} loa (50%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#b5000b] to-[#e11d48] h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Tại kho sẵn sàng
                  </span>
                  <span className="font-mono text-slate-900 font-bold">{available.length} loa (33%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Nạp pin bảo dưỡng
                  </span>
                  <span className="font-mono text-slate-900 font-bold">1 loa (17%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Box Right (8 cols): Doanh Thu 7 Ngày (Rich Spline Area & Pillar Bars) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50/90 to-transparent border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-50 text-[#b5000b] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900">
                Doanh thu 7 ngày qua (Triệu VNĐ)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-[13px] font-medium">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b5000b]"></span> Thực thu
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span> Kế hoạch
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="h-32 w-full relative flex items-end">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 130">
                <defs>
                  <linearGradient id="areaGradientRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b5000b" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#b5000b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Dashed Grid Lines */}
                <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="700" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Sleek Rounded Bars */}
                <rect x="36" y="70" width="28" height="60" rx="4" fill="#fecdd3" opacity="0.6" />
                <rect x="136" y="85" width="28" height="45" rx="4" fill="#fecdd3" opacity="0.6" />
                <rect x="236" y="60" width="28" height="70" rx="4" fill="#fecdd3" opacity="0.6" />
                <rect x="336" y="75" width="28" height="55" rx="4" fill="#fecdd3" opacity="0.6" />
                <rect x="436" y="40" width="28" height="90" rx="4" fill="#b5000b" opacity="0.85" />
                <rect x="536" y="10" width="28" height="120" rx="4" fill="#b5000b" />
                <rect x="636" y="25" width="28" height="105" rx="4" fill="#b5000b" opacity="0.9" />

                {/* Spline Area Fill */}
                <path 
                  d="M 50,70 Q 150,85 250,60 T 350,75 T 450,40 T 550,10 T 650,25 L 650,130 L 50,130 Z" 
                  fill="url(#areaGradientRed)" 
                />

                {/* Spline Line */}
                <path 
                  d="M 50,70 Q 150,85 250,60 T 350,75 T 450,40 T 550,10 T 650,25" 
                  fill="none" 
                  stroke="#b5000b" 
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Halo Glowing Data Nodes */}
                <circle cx="50" cy="70" r="4.5" fill="#b5000b" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="150" cy="85" r="4.5" fill="#b5000b" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="250" cy="60" r="4.5" fill="#b5000b" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="350" cy="75" r="4.5" fill="#b5000b" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="450" cy="40" r="4.5" fill="#b5000b" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="550" cy="10" r="6" fill="#b5000b" stroke="#ffffff" strokeWidth="3" />
                <circle cx="650" cy="25" r="4.5" fill="#b5000b" stroke="#ffffff" strokeWidth="2.5" />
              </svg>
            </div>

            <div className="grid grid-cols-7 text-center text-[13px] font-semibold text-slate-600 pt-3 border-t border-slate-100">
              <div><span>T2</span><div className="font-mono text-[11.5px] text-slate-400 font-medium">1.2tr</div></div>
              <div><span>T3</span><div className="font-mono text-[11.5px] text-slate-400 font-medium">0.9tr</div></div>
              <div><span>T4</span><div className="font-mono text-[11.5px] text-slate-400 font-medium">1.4tr</div></div>
              <div><span>T5</span><div className="font-mono text-[11.5px] text-slate-400 font-medium">1.1tr</div></div>
              <div><span className="text-[#b5000b] font-bold">T6</span><div className="font-mono text-[11.5px] text-[#b5000b] font-bold">1.8tr</div></div>
              <div><span className="text-[#b5000b] font-bold">T7 (Đỉnh)</span><div className="font-mono text-[11.5px] text-[#b5000b] font-extrabold">2.4tr</div></div>
              <div><span className="text-[#b5000b] font-bold">CN</span><div className="font-mono text-[11.5px] text-[#b5000b] font-bold">2.1tr</div></div>
            </div>
          </div>
        </div>

      </div>

      {/* ═══════════════ ROW 3: OPERATIONAL TABLES & LEAFLET MAP (2 BOXES) ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5">
        
        {/* Box Left (7 cols): Bảng Ca Thuê Trực Tiếp */}
        <div className="lg:col-span-7 glass-panel rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50/90 to-transparent border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-50 text-[#b5000b] flex items-center justify-center">
                <Speaker className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900">
                Các ca thuê loa đang hát trực tiếp
              </h3>
            </div>
            <span className="text-[12px] font-semibold text-slate-500">
              Tự động nhảy giờ &amp; tiền
            </span>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="text-[12.5px] font-bold text-slate-500 border-b border-slate-200/80 bg-slate-50/60 rounded-lg">
                  <th className="py-2.5 px-3 rounded-l-lg">Mã loa</th>
                  <th className="py-2.5 px-3">Khách thuê / SĐT</th>
                  <th className="py-2.5 px-3">Địa chỉ tiệc</th>
                  <th className="py-2.5 px-3 text-center">Thời gian</th>
                  <th className="py-2.5 px-3 text-right">Tạm tính</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {renting.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-medium text-[13.5px]">
                      Tất cả 6 loa đang sẵn sàng tại kho nhà.
                    </td>
                  </tr>
                ) : (
                  renting.map(spk => {
                    const estBill = getLiveEstimatedBill(spk);
                    const isOvertime = ((now - spk.currentRental.startTimestamp) / 3600000) >= 3.5;

                    return (
                      <tr key={spk.id} className="hover:bg-red-50/20 transition-colors">
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 bg-red-50 text-[#b5000b] rounded-lg font-mono font-bold text-[12.5px] border border-red-200/80 shadow-2xs">
                            {spk.id}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 text-[14px] leading-tight">{spk.currentRental.customerName}</div>
                          <div className="text-[12px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {spk.currentRental.customerPhone}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-[170px] truncate text-[13px]">
                          {spk.currentRental.address}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[12px] inline-flex items-center gap-1.5 shadow-2xs ${
                            isOvertime ? 'bg-amber-100 text-amber-900 animate-pulse border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {getLiveDuration(spk.currentRental.startTimestamp)}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-[14.5px]">
                          {estBill.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onSelectSpeaker(spk.id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-[#b5000b] hover:text-white text-slate-800 font-bold rounded-lg text-[12px] transition-all cursor-pointer shadow-2xs"
                          >
                            Chi tiết &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Box Right (5 cols): Bản Đồ Mini (Vignette Frame & Live HUD) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50/90 to-transparent border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-50 text-[#b5000b] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900">
                Bản đồ định vị &amp; tuyến đường
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('ban-do-truc-tuyen')}
              className="text-[12.5px] font-bold text-[#b5000b] hover:underline cursor-pointer flex items-center gap-1"
            >
              Mở rộng &rarr;
            </button>
          </div>

          <div className="p-4">
            <div 
              className="w-full rounded-xl overflow-hidden border border-slate-200/90 relative shadow-inner"
              style={{ height: '225px' }}
            >
              <div 
                ref={mapContainerRef} 
                style={{ width: '100%', height: '100%' }}
                className="z-0"
              ></div>
              
              {/* Telemetry Glassmorphic HUD Badge */}
              <div className="absolute top-2.5 right-2.5 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md text-[11.5px] font-bold text-slate-800 flex items-center gap-2 pointer-events-none">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>{renting.length} Điểm thuê trực tiếp</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[12.5px] text-slate-500 font-medium">
            <span className="truncate">Kho: Hùng Vương, P. 7, Tuy Hòa, Phú Yên</span>
            <span className="font-mono font-bold text-slate-800 shrink-0">Tổng {totalDistance.toFixed(1)} km</span>
          </div>
        </div>

      </div>

    </div>
  );
}
