import React, { useState, useEffect } from 'react';
import { Milestone, Flame, TrendingUp, ChevronRight } from 'lucide-react';
import { formatVND, parseVNDNumber } from '../utils/format';
import DashboardMiniMap, { generateHotspotsAround } from './DashboardMiniMap';
import { api } from '../services/api.js';

export default function DashboardView({
  expenses = [],
  trips = [],
  onOpenLogExpense,
  onOpenItinerary,
  onNavigateToTab,
}) {
  const [selectedHotspotId, setSelectedHotspotId] = useState('hs-1');
  const [isLocating, setIsLocating] = useState(false);

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

  const hotspots = generateHotspotsAround(userCoords.lat, userCoords.lng);

  // Compute dynamic stats from API or fallback to props
  const summaryData = apiSummary?.summary || null;
  const totalDistanceNum = summaryData?.distanceKm || trips.reduce((acc, t) => {
    const d = parseFloat(t.distanceKm) || (t.subtitle?.match(/(\d+([\.,]\d+)?)\s*km/) ? parseFloat(t.subtitle.match(/(\d+([\.,]\d+)?)\s*km/)[1]) : 0);
    return acc + d;
  }, 0);

  const totalExpenseNum = summaryData?.totalRevenue || expenses.reduce((acc, e) => {
    return acc + parseVNDNumber(e.amount);
  }, 0);

  const totalRentals = summaryData?.totalRentals || (apiRentals.length > 0 ? apiRentals.length : trips.length);

  // Merge API data with props for display
  const displayTrips = apiRentals.length > 0 ? apiRentals.map(r => ({
    id: r.id,
    title: `${r.customerName} - ${r.customerPhone || ''}`,
    subtitle: `${r.speakerName || 'Loa Kéo'} • ${r.durationHours}h • ${formatVND(r.totalAmount)}`,
    cost: r.totalAmount,
    status: r.status === 'active' ? 'Đang thuê' : r.status === 'completed' ? 'Hoàn thành' : 'Đã huỷ',
    icon: 'speaker',
    distanceKm: 0
  })) : trips;

  const displayExpenses = apiExpenses.length > 0 ? apiExpenses.map(e => ({
    id: e.id,
    title: e.title,
    subtitle: e.subtitle || e.createdAt,
    amount: e.amount,
    status: e.status,
    icon: e.icon || 'receipt'
  })) : expenses;

  return (
    <div className="flex flex-col w-full gap-6 lg:gap-8">
      {/* ══════════ 4 TOP STAT CARDS ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
        {/* Metric 1: Total Distance */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[150px] lg:min-h-[175px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          <div className="flex items-center justify-between gap-2 z-10">
            <span className="text-slate-900 font-bold text-base sm:text-lg lg:text-xl leading-tight">
              Tổng quãng đường
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
              <Milestone className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-2 z-10 my-1">
            <span className="font-display text-on-surface text-2xl sm:text-3xl lg:text-[38px] font-extrabold leading-none tracking-tight">
              {totalDistanceNum > 0 ? totalDistanceNum.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) : (isLoadingApi ? '...' : '1.245')}
            </span>
            <span className="text-slate-500 font-bold text-sm sm:text-base lg:text-lg">km</span>
          </div>

          <div className="flex items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px] lg:text-[14px]">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                trending_up
              </span>
              +12% tháng trước
            </span>
          </div>
        </div>

        {/* Metric 2: Avg Speed */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[150px] lg:min-h-[175px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          <div className="flex items-center justify-between gap-2 z-10">
            <span className="text-slate-900 font-bold text-base sm:text-lg lg:text-xl leading-tight">
              Tốc độ trung bình
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                speed
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-2 z-10 my-1">
            <span className="font-display text-on-surface text-2xl sm:text-3xl lg:text-[38px] font-extrabold leading-none tracking-tight">
              68.4
            </span>
            <span className="text-slate-500 font-bold text-sm sm:text-base lg:text-lg">km/h</span>
          </div>

          <div className="flex items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px] lg:text-[14px]">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                horizontal_rule
              </span>
              Vận tốc ổn định
            </span>
          </div>
        </div>

        {/* Metric 3: Monthly Revenue / Expenses (VNĐ) */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[150px] lg:min-h-[175px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          <div className="flex items-center justify-between gap-2 z-10">
            <span className="text-slate-900 font-bold text-base sm:text-lg lg:text-xl leading-tight">
              Doanh thu tháng
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                payments
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 z-10 my-1">
            <span className="font-display text-on-surface text-xl sm:text-2xl lg:text-[32px] font-extrabold leading-none tracking-tight truncate">
              {totalExpenseNum > 0 ? formatVND(totalExpenseNum) : (isLoadingApi ? '...' : '21.500.000 ₫')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px] lg:text-[14px]">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                trending_up
              </span>
              +15% tháng trước
            </span>
          </div>
        </div>

        {/* Metric 4: Total Speaker Rentals */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[150px] lg:min-h-[175px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          <div className="flex items-center justify-between gap-2 z-10">
            <span className="text-slate-900 font-bold text-base sm:text-lg lg:text-xl leading-tight">
              Tổng loa được thuê
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                speaker
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-2 z-10 my-1">
            <span className="font-display text-on-surface text-2xl sm:text-3xl lg:text-[38px] font-extrabold leading-none tracking-tight">
              {totalRentals > 0 ? totalRentals : (isLoadingApi ? '...' : 36)}
            </span>
            <span className="text-slate-500 font-bold text-sm sm:text-base lg:text-lg">đơn</span>
          </div>

          <div className="flex items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px] lg:text-[14px]">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                trending_up
              </span>
              +8 đơn tuần này
            </span>
          </div>
        </div>
      </div>

      {/* ══════════ FULL-WIDTH HERO MAP: BẢN ĐỒ MẬT ĐỘ THUÊ LOA QUANH BẠN ══════════ */}
      <div className="w-full">
        <DashboardMiniMap
          userCoords={userCoords}
          hotspots={hotspots}
          selectedHotspotId={selectedHotspotId}
          onSelectHotspot={(id) => setSelectedHotspotId(id)}
          onRequestGPS={handleRequestGPS}
          isLocating={isLocating}
          onNavigateToTab={onNavigateToTab}
        />
      </div>

      {/* ══════════ 2-COLUMN SECTION: TRIPS & EXPENSES ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full">
        {/* Left Column: Recent Trips */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[16px] sm:text-xl lg:text-2xl font-bold text-on-surface">Chuyến Gần Đây</h3>
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-primary font-bold text-xs sm:text-sm lg:text-base hover:underline transition-all"
            >
              Xem Tất Cả
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
                  onClick={() => onNavigateToTab('tracking')}
                  className="bg-surface-container-lowest p-3.5 sm:p-4 lg:p-5 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_4px_16px_rgba(11,28,48,0.06)] gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all border border-slate-200/90 shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-[20px] sm:text-[24px] lg:text-[28px]">{trip.icon || 'speaker'}</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm sm:text-base lg:text-[17px] font-bold text-on-surface truncate leading-snug">{trip.title}</span>
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

        {/* Right Column: Recent Revenue */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[16px] sm:text-xl lg:text-2xl font-bold text-on-surface">Doanh Thu Gần Đây</h3>
            <button
              onClick={() => onNavigateToTab('expenses')}
              className="text-primary font-bold text-xs sm:text-sm lg:text-base hover:underline transition-all"
            >
              Xem Tất Cả
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {displayExpenses.length === 0 ? (
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-slate-200/90 text-center text-slate-500 text-sm">
                {isLoadingApi ? 'Đang tải dữ liệu...' : 'Chưa có doanh thu nào gần đây'}
              </div>
            ) : (
              displayExpenses.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateToTab('expenses')}
                  className="bg-surface-container-lowest p-3.5 sm:p-4 lg:p-5 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_4px_16px_rgba(11,28,48,0.06)] gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all border border-slate-200/60 shadow-xs shrink-0 group-hover:bg-slate-900 group-hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[20px] sm:text-[24px] lg:text-[28px]">{item.icon || 'qr_code_2'}</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm sm:text-base lg:text-[17px] font-bold text-on-surface truncate leading-snug">{item.title}</span>
                      <span className="text-xs sm:text-[13px] lg:text-[14px] text-slate-500 font-medium mt-0.5 truncate">{item.subtitle}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <span className="font-display font-extrabold text-sm sm:text-base lg:text-lg text-on-surface whitespace-nowrap">
                      {formatVND(item.amount)}
                    </span>
                    <span className="text-[10.5px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white mt-1 whitespace-nowrap shadow-xs">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
