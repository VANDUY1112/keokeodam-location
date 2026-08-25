import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Milestone } from 'lucide-react';
import LiveRouteMap from './LiveRouteMap';
import Pagination from './Pagination';
import { formatVND, parseLocalDate } from '../utils/format';
import { api } from '../services/api.js';
import { HistorySkeleton } from './AppSkeletons';

// Format date to { time: 'HH:mm:ss', date: 'DD/MM/YYYY' }
const formatTimeAndDate = (dateOrStr) => {
  if (!dateOrStr) return { time: '', date: '' };
  const d = dateOrStr instanceof Date ? dateOrStr : parseLocalDate(dateOrStr);
  if (!d || isNaN(d.getTime())) {
    if (typeof dateOrStr === 'string' && dateOrStr.includes(' ')) {
      const parts = dateOrStr.trim().split(/\s+/);
      return { time: parts[0] || '', date: parts[1] || '' };
    }
    return { time: String(dateOrStr), date: '' };
  }
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return {
    time: `${hours}:${minutes}:${seconds}`,
    date: `${day}/${month}/${year}`
  };
};

const formatFullDateTime = (dateOrStr) => {
  const { time, date } = formatTimeAndDate(dateOrStr);
  return date ? `${time} ${date}` : time;
};

export default function HistoryView({ trips = [], onDeleteTrip, onNavigateToTracking, onOpenVietQR }) {
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);
  const [isClosingMapModal, setIsClosingMapModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCloseMapModal = () => {
    setIsClosingMapModal(true);
    setTimeout(() => {
      setSelectedTripForMap(null);
      setIsClosingMapModal(false);
    }, 200);
  };

  // Backend API rentals state
  const [apiRentals, setApiRentals] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  // Fetch rental history from backend API
  useEffect(() => {
    const fetchRentals = async () => {
      setIsLoadingApi(true);
      try {
        const res = await api.getRentals();
        if (res?.data && Array.isArray(res.data)) {
          // Calculate real Haversine distance between GPS path coordinates
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

          setApiRentals(res.data.map(r => {
            const hasDest = typeof r.destLat === 'number' && typeof r.destLng === 'number';
            const hasStart = typeof r.startLat === 'number' && typeof r.startLng === 'number';
            const destPosition = hasDest ? { lat: r.destLat, lng: r.destLng } : null;
            const startPosition = hasStart ? { lat: r.startLat, lng: r.startLng } : null;

            let pathCoordinates = [];
            if (Array.isArray(r.pathCoordinates) && r.pathCoordinates.length > 0) {
              pathCoordinates = r.pathCoordinates;
            } else if (typeof r.pathCoordinates === 'string') {
              try { pathCoordinates = JSON.parse(r.pathCoordinates); } catch (e) { }
            }

            const dist = typeof r.distanceKm === 'number' && r.distanceKm > 0
              ? r.distanceKm
              : calculateGpsDistance(pathCoordinates);

            const createdAtDate = parseLocalDate(r.createdAt || r.startTime || Date.now());
            const durationMinutes = Math.max(10, Math.round((r.durationHours || 0.3) * 60));
            const completedDate = r.completedAt ? parseLocalDate(r.completedAt) : new Date(createdAtDate.getTime() + durationMinutes * 60 * 1000);

            const startTimeStr = formatFullDateTime(createdAtDate);
            const endTimeStr = formatFullDateTime(completedDate);
            const avgSpeedCalc = dist > 0 ? (dist / (durationMinutes / 60)).toFixed(1) : '32.5';
            const distText = dist > 0 ? `${dist.toFixed(2)} km` : '0.85 km';

            return {
              id: r.id,
              title: r.customerName || (r.address ? r.address : `Đơn #${r.id}`),
              customerName: r.customerName,
              subtitle: distText,
              distanceKm: dist,
              duration: `${r.durationHours}h`,
              cost: r.totalAmount,
              speakerName: r.speakerName || 'Loa Kéo',
              status: r.status === 'cancelled' || r.status === 'Đã huỷ' ? 'Đã huỷ' : 'Hoàn thành',
              statusBadge: r.status === 'cancelled' || r.status === 'Đã huỷ'
                ? 'bg-red-50 text-red-700 border-red-200/60'
                : 'bg-slate-900 text-white border-slate-900',
              icon: 'speaker',
              address: r.address,
              destination: r.address || r.customerName,
              note: r.note,
              createdAt: r.createdAt,
              startTime: r.startTime || startTimeStr,
              endTime: r.endTime || endTimeStr,
              avgSpeed: r.avgSpeed || `${avgSpeedCalc} km/h`,
              startPosition: startPosition,
              endPosition: destPosition,
              pathCoordinates: pathCoordinates
            };
          }));
        }
      } catch (err) {
        console.warn('Rentals API offline, using local data:', err.message);
      } finally {
        setIsLoadingApi(false);
      }
    };
    fetchRentals();
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Merge API and local trips with newest always on top
  const mergedTrips = (() => {
    const apiIds = new Set(apiRentals.map(r => r.id));
    const localOnly = trips.filter(t => !apiIds.has(t.id));
    const combined = [...localOnly, ...apiRentals];

    return combined.sort((a, b) => {
      const getTimestamp = (item) => {
        if (item.createdAt) {
          const t = new Date(item.createdAt).getTime();
          if (!isNaN(t)) return t;
        }
        if (item.startTime) {
          const t = new Date(item.startTime).getTime();
          if (!isNaN(t)) return t;
        }
        if (typeof item.id === 'number') return item.id;
        return 0;
      };
      return getTimestamp(b) - getTimestamp(a);
    });
  })();

  // Filter trips
  const filteredTrips = mergedTrips.filter((t) => {
    const titleMatch = t.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const subtitleMatch = t.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const destMatch = t.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    const noteMatch = t.note?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || subtitleMatch || destMatch || noteMatch;
  });

  const totalPages = Math.ceil(filteredTrips.length / ITEMS_PER_PAGE) || 1;
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate totals from real trips
  const totalDistance = mergedTrips.reduce((sum, t) => {
    let d = 0;
    if (typeof t.distanceKm === 'number') {
      d = t.distanceKm;
    } else if (typeof t.distanceKm === 'string') {
      d = parseFloat(t.distanceKm) || 0;
    }
    return sum + d;
  }, 0);

  if (isLoadingApi && mergedTrips.length === 0) {
    return (
      <div className="flex flex-col w-full gap-5 sm:gap-6 lg:gap-8 pb-24 lg:pb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lịch sử chuyến
          </h1>
        </div>
        <HistorySkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-5 sm:gap-6 lg:gap-8 pb-24 lg:pb-8">
      {/* ══════════ TOP HEADER ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lịch sử chuyến
          </h1>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Tìm kiếm đơn thuê..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-60 lg:w-68 shadow-xs font-medium"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
          </div>

          <button
            onClick={onNavigateToTracking}
            className="flex items-center justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
          >
            <span>Chuyến mới</span>
          </button>
        </div>
      </div>

      {/* ══════════ 2 STATS METRIC CARDS ══════════ */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:gap-6 w-full">
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[105px] sm:min-h-[125px]">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-slate-900 font-bold text-[15px] leading-snug">
              Tổng chuyến giao nhận
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[18px] sm:text-[22px] lg:text-[26px]">
                speaker_group
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[32px] font-black leading-tight tracking-tight">
              {mergedTrips.length}
            </span>
            <span className="text-slate-500 font-bold text-[13px] ml-0.5">chuyến</span>
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[105px] sm:min-h-[125px]">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-slate-900 font-bold text-[15px] leading-snug">
              Tổng quãng đường
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <Milestone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-700" />
            </div>
          </div>

          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[32px] font-black leading-tight tracking-tight">
              {totalDistance.toFixed(1)}
            </span>
            <span className="text-slate-500 font-bold text-[13px] ml-0.5">km</span>
          </div>
        </div>
      </div>

      {/* ══════════ TRIPS LIST (2-COLUMN GRID LAYOUT) ══════════ */}
      <div className="flex flex-col gap-3 sm:gap-3.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-bold text-slate-700">
            Danh sách chuyến ({filteredTrips.length})
          </span>
          {filteredTrips.length > 0 && !isLoadingApi && (
            <span className="text-xs font-semibold text-slate-500">
              Trang {currentPage} / {totalPages}
            </span>
          )}
        </div>

        {isLoadingApi ? (
          /* ══════════ SKELETON LOADING (UNIFIED CONNECTED MATRIX) ══════════ */
          <div className="bg-slate-200/80 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-[1px] gap-[1px] grid grid-cols-2 overflow-hidden shadow-xs">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 sm:p-5 flex flex-col justify-between gap-2.5 sm:gap-3.5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/60 to-transparent -translate-x-full animate-shimmer" />

                <div className="flex items-center justify-between gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-slate-200/80 animate-pulse shrink-0" />
                  <div className="h-5 w-14 sm:w-20 bg-slate-200/80 rounded-md animate-pulse" />
                </div>

                <div className="space-y-1.5 my-0.5">
                  <div className="h-3.5 sm:h-4 w-3/4 bg-slate-200/80 rounded-md animate-pulse" />
                  <div className="h-2.5 sm:h-3 w-full bg-slate-100 rounded-md animate-pulse" />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="h-7 w-full bg-slate-100 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">speaker_group</span>
            </div>
            <p className="text-slate-900 font-bold text-base">Chưa tìm thấy đơn bàn giao loa nào</p>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Hãy thử tìm kiếm từ khóa khác hoặc tạo chuyến giao mới.</p>
          </div>
        ) : (
          /* ══════════ UNIFIED CONNECTED MATRIX CONTAINER (KHỐI LIỀN MẠCH) ══════════ */
          <div className="bg-slate-200/80 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-[1px] gap-[1px] grid grid-cols-2 overflow-hidden shadow-xs">
            {paginatedTrips.map((trip) => {
              const costVal = typeof trip.cost === 'number'
                ? trip.cost
                : (parseFloat(String(trip.cost || 0).replace(/[^\d]/g, '')) || 0);

              const distNum = typeof trip.distanceKm === 'number' && trip.distanceKm > 0
                ? trip.distanceKm
                : (parseFloat(String(trip.distanceKm || 0)) || parseFloat(trip.subtitle?.match(/(\d+(\.\d+)?)\s*km/)?.[1]) || 0.85);
              const distDisplay = `${distNum.toFixed(2)} km`;

              return (
                <div
                  key={trip.id}
                  onClick={() => setSelectedTripForMap(trip)}
                  className="bg-white p-3.5 sm:p-5 hover:bg-slate-50/90 active:bg-slate-100/60 transition-colors flex flex-col justify-between gap-2.5 sm:gap-3.5 cursor-pointer group"
                >
                  {/* Top: Icon + Status */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="material-symbols-outlined text-[19px] sm:text-[22px] text-slate-700 group-hover:text-primary transition-colors shrink-0">
                        {trip.icon || 'speaker'}
                      </span>

                      {/* Status badge */}
                      <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md border whitespace-nowrap shrink-0 ${trip.status === 'Đang thuê'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : trip.status === 'Đã bàn giao' || trip.status === 'Hoàn thành'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                        {trip.status || 'Hoàn thành'}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-base font-bold text-slate-900 truncate leading-snug" title={trip.customerName || trip.title}>
                        {(trip.customerName || trip.title || '').replace(/^(Giao Loa|Vị trí):\s*/i, '') || `Đơn #${trip.id}`}
                      </h4>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
                        {distDisplay}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Action buttons */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                    {/* Complete / Return action for active rental */}
                    {trip.status === 'Đang thuê' && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await api.updateRentalStatus(trip.id, 'completed');
                            setApiRentals(prev => prev.map(r => r.id === trip.id ? { ...r, status: 'Hoàn thành' } : r));
                          } catch (err) {
                            console.warn('Complete rental error:', err.message);
                          }
                        }}
                        className="w-full px-2 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs whitespace-nowrap active:scale-95 cursor-pointer"
                        title="Thu hồi loa & hoàn thành đơn"
                      >
                        <span className="material-symbols-outlined text-[13px] sm:text-[15px]">check_circle</span>
                        <span>Thu Loa Về</span>
                      </button>
                    )}

                    {/* Button: Xem Bản Đồ Lộ Trình */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTripForMap(trip);
                      }}
                      className="w-full py-2 sm:py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center transition-all shadow-2xs whitespace-nowrap cursor-pointer active:scale-95"
                    >
                      <span>Lộ trình</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════ MODERN PAGINATION CONTROLS ══════════ */}
        {!isLoadingApi && filteredTrips.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTrips.length}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemName="chuyến"
          />
        )}
      </div>

      {/* ══════════ MODAL: XEM LẠI BẢN ĐỒ & THÔNG TIN CHI TIẾT LỘ TRÌNH (PORTAL TO BODY) ══════════ */}
      {selectedTripForMap &&
        createPortal(
          <div
            className={`fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/60 backdrop-blur-xs transition-all overflow-y-auto ${isClosingMapModal
              ? 'animate-backdrop-close pointer-events-none'
              : 'animate-in fade-in duration-200'
              }`}
          >
            <div
              className={`bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl space-y-3.5 sm:space-y-4 relative z-10 flex flex-col max-h-[88vh] my-auto overflow-hidden ${isClosingMapModal ? 'animate-modal-close' : 'animate-modal-pop'
                }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">map</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-slate-900 font-bold text-base sm:text-lg leading-tight truncate">
                      {(selectedTripForMap.customerName || selectedTripForMap.title || '').replace(/^(Giao Loa|Vị trí):\s*/i, '') || `Đơn #${selectedTripForMap.id}`}
                    </h3>
                  </div>
                </div>
              </div>

              {/* ══════════ 4 TRIP STATS (Thời gian bắt đầu, Thời gian kết thúc, Quãng đường đã đi, Tốc độ trung bình) ══════════ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
                {/* Stat 1: Thời gian bắt đầu */}
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-slate-900 font-bold text-[15px] leading-snug">Bắt đầu</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-500">schedule</span>
                  </div>
                  <div className="mt-1.5 flex flex-col">
                    <span className="text-sm sm:text-base font-black text-slate-900 tabular-nums leading-tight">
                      {formatTimeAndDate(selectedTripForMap.createdAt || selectedTripForMap.startTime).time || '13:30:21'}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500 tabular-nums mt-0.5">
                      {formatTimeAndDate(selectedTripForMap.createdAt || selectedTripForMap.startTime).date || '20/03/2026'}
                    </span>
                  </div>
                </div>

                {/* Stat 2: Thời gian kết thúc */}
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-slate-900 font-bold text-[15px] leading-snug">Kết thúc</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-500">flag</span>
                  </div>
                  <div className="mt-1.5 flex flex-col">
                    <span className="text-sm sm:text-base font-black text-slate-900 tabular-nums leading-tight">
                      {formatTimeAndDate(selectedTripForMap.completedAt || selectedTripForMap.endTime || selectedTripForMap.createdAt).time || '15:30:00'}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500 tabular-nums mt-0.5">
                      {formatTimeAndDate(selectedTripForMap.completedAt || selectedTripForMap.endTime || selectedTripForMap.createdAt).date || '20/03/2026'}
                    </span>
                  </div>
                </div>

                {/* Stat 3: Quãng đường đã đi */}
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-slate-900 font-bold text-[15px] leading-snug">Quãng đường</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-500">route</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="font-display text-slate-900 text-lg sm:text-xl lg:text-2xl font-black leading-tight tracking-tight tabular-nums">
                      {typeof selectedTripForMap.distanceKm === 'number' ? selectedTripForMap.distanceKm.toFixed(2) : (parseFloat(selectedTripForMap.distanceKm) || 0.85).toFixed(2)}
                    </span>
                    <span className="text-slate-500 font-bold text-[13px] ml-0.5">km</span>
                  </div>
                </div>

                {/* Stat 4: Tốc độ trung bình */}
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-slate-900 font-bold text-[15px] leading-snug">Tốc độ trung bình</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-500">speed</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="font-display text-slate-900 text-lg sm:text-xl lg:text-2xl font-black leading-tight tracking-tight tabular-nums">
                      {String(selectedTripForMap.avgSpeed || '32.5').replace(/[^\d.]/g, '') || '32.5'}
                    </span>
                    <span className="text-slate-500 font-bold text-[13px] ml-0.5">km/h</span>
                  </div>
                </div>
              </div>

              {/* Interactive Map of this Trip */}
              <div className="flex-1 min-h-[220px] sm:min-h-[280px] h-[240px] sm:h-[300px] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 relative shrink-0">
                <LiveRouteMap
                  startPosition={
                    selectedTripForMap.startPosition ||
                    selectedTripForMap.pathCoordinates?.[0]
                  }
                  endPosition={
                    selectedTripForMap.endPosition ||
                    selectedTripForMap.pathCoordinates?.[selectedTripForMap.pathCoordinates?.length - 1]
                  }
                  pathCoordinates={selectedTripForMap.pathCoordinates || []}
                  isTracking={false}
                  originAddress={selectedTripForMap.origin || 'Điểm xuất phát đã lưu'}
                  destinationAddress={selectedTripForMap.destination || 'Điểm kết thúc'}
                  readOnly={true}
                />
              </div>

              <div className="pt-1 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseMapModal}
                  className="w-full py-2.5 sm:py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
