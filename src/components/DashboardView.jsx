import React, { useState, useEffect, useMemo } from 'react';
import { Milestone, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { formatVND, parseVNDNumber, parseLocalDate } from '../utils/format';
import DashboardMiniMap, { generateHotspotsAround } from './DashboardMiniMap';
import { api } from '../services/api.js';
import { clusterDeliveryPoints } from '../utils/spatialCluster';
import { DashboardSkeleton } from './AppSkeletons';

export default function DashboardView({
  expenses = [],
  trips = [],
  onOpenLogExpense,
  onOpenItinerary,
  onNavigateToTab,
  onOpenLandingQRModal,
}) {
  const [isLocating, setIsLocating] = useState(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState(null);

  // Backend API data state
  const [apiSummary, setApiSummary] = useState(null);
  const [apiSpeakers, setApiSpeakers] = useState([]);
  const [apiRentals, setApiRentals] = useState([]);
  const [apiExpenses, setApiExpenses] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  // Fetch dashboard data from backend API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingApi(true);
      try {
        const [summaryRes, speakersRes, rentalsRes, expensesRes] = await Promise.allSettled([
          api.getReportsSummary('30d'),
          api.getSpeakers(),
          api.getRentals(),
          api.getExpenses()
        ]);

        if (summaryRes.status === 'fulfilled' && summaryRes.value?.data) {
          setApiSummary(summaryRes.value.data);
        }
        if (speakersRes.status === 'fulfilled' && speakersRes.value?.data) {
          const list = Array.isArray(speakersRes.value.data) ? speakersRes.value.data : [];
          setApiSpeakers(list);
        }
        if (rentalsRes.status === 'fulfilled' && rentalsRes.value?.data) {
          const list = Array.isArray(rentalsRes.value.data) ? rentalsRes.value.data : [];
          setApiRentals(list);
        }
        if (expensesRes.status === 'fulfilled' && expensesRes.value?.data) {
          const expData = expensesRes.value.data;
          setApiExpenses(Array.isArray(expData.expenses) ? expData.expenses : []);
        }
      } catch (err) {
        console.warn('Dashboard API fetch failed, using local data:', err.message);
      } finally {
        setIsLoadingApi(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Initialize user coordinates from localStorage or default
  const [userCoords, setUserCoords] = useState(() => {
    const savedLat = localStorage.getItem('kko_warehouse_lat');
    const savedLng = localStorage.getItem('kko_warehouse_lng');
    if (savedLat && savedLng) {
      return { lat: parseFloat(savedLat), lng: parseFloat(savedLng) };
    }
    return { lat: 10.7769, lng: 106.7009 }; // Default center
  });

  // Request actual user GPS
  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        localStorage.setItem('kko_warehouse_lat', String(coords.lat));
        localStorage.setItem('kko_warehouse_lng', String(coords.lng));
        setIsLocating(false);
      },
      (error) => {
        console.warn('Lỗi định vị GPS:', error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Auto request on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCoords(coords);
          localStorage.setItem('kko_warehouse_lat', String(coords.lat));
          localStorage.setItem('kko_warehouse_lng', String(coords.lng));
        },
        () => {},
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Calculate real Haversine distance from actual GPS coordinates
  const calculateGpsDistance = (coords) => {
    if (!Array.isArray(coords) || coords.length < 2) return 0;
    let totalKm = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      if (p1 && p2 && typeof p1.lat === 'number' && typeof p2.lat === 'number') {
        const R = 6371;
        const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
        const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((p1.lat * Math.PI) / 180) *
            Math.cos((p2.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        if (d > 0.005) {
          totalKm += d;
        }
      }
    }
    return parseFloat(totalKm.toFixed(2));
  };

  // Merge API data with props for display
  const displayTrips = apiRentals.length > 0 ? apiRentals.map(r => {
    let pathCoords = [];
    if (Array.isArray(r.pathCoordinates)) pathCoords = r.pathCoordinates;
    else if (typeof r.pathCoordinates === 'string') {
      try { pathCoords = JSON.parse(r.pathCoordinates); } catch (e) { }
    }
    // Strict calculation from actual GPS path coordinates
    const calculatedDist = calculateGpsDistance(pathCoords);
    const realDist = pathCoords.length > 1 ? calculatedDist : (typeof r.distanceKm === 'number' && r.distanceKm > 0 ? r.distanceKm : 0.85);

    const now = parseLocalDate(r.createdAt || r.startTime);
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = `${now.getDate()} Th${now.getMonth() + 1}`;
    const distText = `${realDist.toFixed(2)} km`;

    const resolvedName = (r.customerName && r.customerName !== 'Khách lẻ' ? r.customerName : null) || (r.address && r.address !== 'Tuy Hòa, Phú Yên' ? r.address : null) || r.customerName || 'Khách thuê';
    const displayTitle = r.customerPhone && r.customerPhone !== '0908123456' ? `${resolvedName} - ${r.customerPhone}` : resolvedName;

    return {
      id: r.id,
      title: displayTitle,
      customerName: resolvedName,
      subtitle: `${timeStr} (${dateStr}) • ${distText} • ${r.speakerName || 'Loa Kéo'} • ${formatVND(r.totalAmount || 0)}`,
      cost: r.totalAmount,
      status: r.status === 'cancelled' || r.status === 'Đã huỷ' ? 'Đã huỷ' : 'Hoàn thành',
      icon: 'speaker',
      destLat: r.destLat || r.lat,
      destLng: r.destLng || r.lng,
      address: r.address,
      speakerName: r.speakerName,
      distanceKm: realDist,
      pathCoordinates: pathCoords
    };
  }) : trips;

  // Compute dynamic real distance from actual trips
  const totalDistanceNum = displayTrips.reduce((acc, t) => {
    const d = typeof t.distanceKm === 'number' && t.distanceKm > 0 
      ? t.distanceKm 
      : calculateGpsDistance(t.pathCoordinates);
    return acc + d;
  }, 0);

  const totalRentals = displayTrips.length;

  // 🎯 DYNAMIC REAL SPATIAL CLUSTERING: Only real delivery endpoints are grouped into circular zones
  const hotspots = useMemo(() => {
    return clusterDeliveryPoints(displayTrips, 0.65, userCoords);
  }, [displayTrips, userCoords.lat, userCoords.lng]);

  const displayExpenses = apiExpenses.length > 0 ? apiExpenses.map(e => ({
    id: e.id,
    title: e.title,
    subtitle: e.subtitle || e.createdAt,
    amount: e.amount,
    status: e.status,
    icon: e.icon || 'receipt'
  })) : expenses;

  if (isLoadingApi && displayTrips.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col w-full gap-6 lg:gap-8">
      {/* ══════════ 3 TOP STAT CARDS (2 BOXES 1 LINE ON MOBILE, 17PX TITLES & BOTTOM-RIGHT ICONS) ══════════ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6 w-full">
        {/* Metric 1: Total Distance */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[110px] sm:min-h-[135px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          {/* Top Title - Full Width, wraps to next line if needed */}
          <div className="z-10">
            <span className="text-slate-900 font-bold text-[17px] leading-snug break-words block">
              Tổng quãng đường
            </span>
          </div>

          {/* Bottom Row: Number on left, Icon on right */}
          <div className="flex items-end justify-between gap-1.5 z-10 mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-on-surface text-2xl sm:text-3xl lg:text-[36px] font-black leading-none tracking-tight">
                {isLoadingApi ? '...' : totalDistanceNum.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}
              </span>
              <span className="text-slate-500 font-bold text-xs sm:text-sm">km</span>
            </div>

            <Milestone className="w-6 h-6 sm:w-7 sm:h-7 text-slate-700 shrink-0" />
          </div>
        </div>

        {/* Metric 2: Avg Speed */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[110px] sm:min-h-[135px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          {/* Top Title - Full Width, wraps to next line if needed */}
          <div className="z-10">
            <span className="text-slate-900 font-bold text-[17px] leading-snug break-words block">
              Tốc độ trung bình
            </span>
          </div>

          {/* Bottom Row: Number on left, Icon on right */}
          <div className="flex items-end justify-between gap-1.5 z-10 mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-on-surface text-2xl sm:text-3xl lg:text-[36px] font-black leading-none tracking-tight">
                {isLoadingApi ? '...' : (totalDistanceNum > 0 && totalRentals > 0 ? (totalDistanceNum / totalRentals).toFixed(1) : '0')}
              </span>
              <span className="text-slate-500 font-bold text-xs sm:text-sm">km/h</span>
            </div>

            <span className="material-symbols-outlined text-[24px] sm:text-[28px] text-slate-700 shrink-0">
              speed
            </span>
          </div>
        </div>

        {/* Metric 3: Total Speaker Rentals (Spans full line 2 on mobile) */}
        <div className="col-span-2 md:col-span-1 bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[110px] sm:min-h-[135px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          {/* Top Title - Full Width */}
          <div className="z-10">
            <span className="text-slate-900 font-bold text-[17px] leading-snug break-words block">
              Tổng loa được thuê
            </span>
          </div>

          {/* Bottom Row: Number on left, Icon on right */}
          <div className="flex items-end justify-between gap-1.5 z-10 mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-on-surface text-2xl sm:text-3xl lg:text-[36px] font-black leading-none tracking-tight">
                {isLoadingApi ? '...' : totalRentals}
              </span>
              <span className="text-slate-500 font-bold text-xs sm:text-sm">chuyến</span>
            </div>

            <img
              src="/icons8-scooter-100.png"
              alt="Thuê loa"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
            />
          </div>
        </div>
      </div>

      {/* ══════════ FULL-WIDTH HERO MAP: BẢN ĐỒ GIAO LOA THỰC TẾ & VÙNG TRÒN HOTSPOT ══════════ */}
      <div className="w-full">
        <DashboardMiniMap
          userCoords={userCoords}
          hotspots={hotspots}
          selectedHotspotId={selectedHotspotId}
          onSelectHotspot={setSelectedHotspotId}
          onRequestGPS={handleRequestGPS}
          isLocating={isLocating}
          onNavigateToTab={onNavigateToTab}
        />
      </div>

      {/* ══════════ SECTION: RECENT TRIPS ══════════ */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[16px] sm:text-xl lg:text-2xl font-bold text-on-surface">Chuyến gần đây</h3>
          <button
            onClick={() => onNavigateToTab('history')}
            className="text-primary font-bold text-xs sm:text-sm lg:text-base hover:underline transition-all"
          >
            Xem tất cả
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {displayTrips.length === 0 ? (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-slate-200/90 text-center text-slate-500 text-sm">
              {isLoadingApi ? 'Đang tải dữ liệu...' : 'Chưa có chuyến nào gần đây'}
            </div>
          ) : (
            displayTrips.slice(0, 4).map((trip) => (
              <div
                key={trip.id}
                onClick={() => onNavigateToTab('history')}
                className="bg-surface-container-lowest p-3.5 sm:p-4 lg:p-5 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_4px_16px_rgba(11,28,48,0.06)] gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all border border-slate-200/90 shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px] lg:text-[28px]">{trip.icon || 'speaker'}</span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm sm:text-base lg:text-[17px] font-bold text-on-surface truncate leading-snug">
                      {(trip.customerName || trip.title || '').replace(/^(Giao Loa|Vị trí):\s*/i, '') || `Đơn #${trip.id}`}
                    </span>
                    <span className="text-xs sm:text-[13px] lg:text-[14px] text-slate-500 font-medium mt-0.5 truncate">{trip.subtitle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10.5px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white whitespace-nowrap shadow-xs">
                    {trip.status || 'Hoàn thành'}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px] sm:text-[22px] group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0">
                    chevron_right
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
