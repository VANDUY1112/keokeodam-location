import React, { useState } from 'react';
import LiveRouteMap from './LiveRouteMap';

export default function HistoryView({ trips, onDeleteTrip, onNavigateToTracking }) {
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-xl">
      {/* ══════════ TOP HEADER ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-on-surface">Lịch Sử Chuyến Đi & Lưu Trữ</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Nhật ký toàn diện về các chuyến công tác đã hoàn tất, đo đạc GPS và hoàn ứng chi phí.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm chuyến đi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-surface-container-lowest border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 shadow-sm"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-lg">
              search
            </span>
          </div>

          <button
            onClick={onNavigateToTracking}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">add_location_alt</span>
            <span>Tạo Lộ Trình Mới</span>
          </button>
        </div>
      </div>

      {/* ══════════ STATS SUMMARY: BOX 1 (1 LINE), BOX 2 & 3 (2 BOXES/LINE ON MOBILE) ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-lg">
        {/* Box 1: Full width on mobile */}
        <div className="col-span-2 lg:col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-lg border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)]">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Tổng Chuyến Đi Đã Ghi</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{trips.length} chuyến</div>
        </div>

        {/* Box 2: Half width on mobile */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-lg border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold">Tổng Km Tích Lũy</div>
          <div className="text-xl sm:text-3xl font-bold text-primary mt-1">
            {trips.reduce((acc, t) => acc + (parseFloat(t.distanceKm) || (t.subtitle?.match(/(\d+([\.,]\d+)?)\s*km/) ? parseFloat(t.subtitle.match(/(\d+([\.,]\d+)?)\s*km/)[1]) : 25)), 0).toFixed(1)} km
          </div>
        </div>

        {/* Box 3: Half width on mobile */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-lg border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] flex flex-col justify-between">
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold">Trạng Thái</div>
          <div className="text-xs sm:text-base font-semibold text-emerald-700 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">Đồng bộ LocalStorage</span>
          </div>
        </div>
      </div>

      {/* ══════════ TRIPS LIST ══════════ */}
      <div className="flex flex-col gap-sm">
        {filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-400">explore_off</span>
            <p className="text-slate-600 mt-2 font-medium">Chưa tìm thấy chuyến đi nào.</p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface-container-lowest p-lg rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_6px_20px_rgba(11,28,48,0.06)] hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-md min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">{trip.icon || 'near_me'}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-headline-md text-on-surface font-semibold text-base truncate">
                    {trip.title}
                  </div>
                  <div className="text-xs text-on-surface-variant font-medium mt-0.5 flex items-center gap-2">
                    <span>{trip.subtitle}</span>
                    {trip.duration && (
                      <>
                        <span>•</span>
                        <span>⏱️ {trip.duration}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <span
                  className={`px-3 py-1 font-label-sm rounded-lg border text-xs font-semibold ${
                    trip.statusBadge?.includes('secondary') || trip.status === 'Hoàn thành'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {trip.status}
                </span>

                {/* Button: Xem Bản Đồ Lộ Trình */}
                <button
                  onClick={() => setSelectedTripForMap(trip)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">map</span>
                  <span>Xem Lộ Trình</span>
                </button>

                {/* Delete Button */}
                {onDeleteTrip && (
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    title="Xóa chuyến đi này"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ══════════ MODAL: XEM LẠI BẢN ĐỒ LỘ TRÌNH QUÁ KHỨ ══════════ */}
      {selectedTripForMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl max-w-4xl w-full p-lg border border-slate-200 shadow-2xl space-y-md animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface font-bold text-lg">
                    {selectedTripForMap.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {selectedTripForMap.subtitle} • {selectedTripForMap.status}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTripForMap(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Interactive Map of this Trip */}
            <div className="flex-1 min-h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 relative">
              <LiveRouteMap
                startPosition={
                  selectedTripForMap.pathCoordinates?.[0] ||
                  selectedTripForMap.startPosition || { lat: 10.7769, lng: 106.7009 }
                }
                endPosition={
                  selectedTripForMap.pathCoordinates?.[selectedTripForMap.pathCoordinates?.length - 1] ||
                  selectedTripForMap.endPosition || { lat: 10.782, lng: 106.708 }
                }
                pathCoordinates={
                  selectedTripForMap.pathCoordinates?.length > 0
                    ? selectedTripForMap.pathCoordinates
                    : [
                        { lat: 10.7769, lng: 106.7009 },
                        { lat: 10.7785, lng: 106.7032 },
                        { lat: 10.782, lng: 106.708 },
                      ]
                }
                isTracking={false}
                originAddress={selectedTripForMap.origin || 'Điểm xuất phát đã lưu'}
                destinationAddress={selectedTripForMap.destination || 'Điểm kết thúc'}
                readOnly={true}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-slate-500">
                Tọa độ GPS đã được lưu vĩnh viễn trong dữ liệu cục bộ.
              </div>
              <button
                onClick={() => setSelectedTripForMap(null)}
                className="px-6 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
