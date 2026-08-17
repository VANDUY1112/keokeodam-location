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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Lịch Sử Giao & Cho Thuê Loa</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Nhật ký các đơn thuê loa đã bàn giao, đo đạc quãng đường GPS và tổng thu từ khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm đơn thuê loa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl bg-surface-container-lowest border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 shadow-sm font-medium"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-3 text-slate-400 text-lg">
              search
            </span>
          </div>

          <button
            onClick={onNavigateToTracking}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">two_wheeler</span>
            <span>Giao Loa Mới</span>
          </button>
        </div>
      </div>

      {/* ══════════ STATS SUMMARY ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Box 1 */}
        <div className="col-span-2 lg:col-span-1 bg-surface-container-lowest rounded-3xl p-5 lg:p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] min-h-[140px] flex flex-col justify-between">
          <div className="text-xs lg:text-[13px] uppercase tracking-wider text-slate-500 font-bold">Tổng Đơn Giao Loa</div>
          <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 mt-1">{trips.length} đơn</div>
        </div>

        {/* Box 2 */}
        <div className="col-span-1 bg-surface-container-lowest rounded-3xl p-5 lg:p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] flex flex-col justify-between min-h-[140px]">
          <div className="text-xs lg:text-[13px] uppercase tracking-wider text-slate-500 font-bold">Tổng Km Giao Nhận</div>
          <div className="text-2xl sm:text-3xl lg:text-[34px] font-black text-primary mt-1">
            {trips.reduce((acc, t) => acc + (parseFloat(t.distanceKm) || (t.subtitle?.match(/(\d+([\.,]\d+)?)\s*km/) ? parseFloat(t.subtitle.match(/(\d+([\.,]\d+)?)\s*km/)[1]) : 25)), 0).toFixed(1)} km
          </div>
        </div>

        {/* Box 3 */}
        <div className="col-span-1 bg-surface-container-lowest rounded-3xl p-5 lg:p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] flex flex-col justify-between min-h-[140px]">
          <div className="text-xs lg:text-[13px] uppercase tracking-wider text-slate-500 font-bold">Trạng Thái Đồng Bộ</div>
          <div className="text-sm sm:text-base lg:text-lg font-bold text-emerald-700 mt-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">Đã lưu LocalStorage</span>
          </div>
        </div>
      </div>

      {/* ══════════ TRIPS LIST ══════════ */}
      <div className="flex flex-col gap-3.5">
        {filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-slate-200">
            <span className="material-symbols-outlined text-5xl text-slate-400">speaker_group</span>
            <p className="text-slate-600 mt-3 font-semibold text-base">Chưa tìm thấy đơn bàn giao loa nào.</p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface-container-lowest p-5 lg:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_6px_20px_rgba(11,28,48,0.06)] hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-13 h-13 lg:w-14 lg:h-14 rounded-2xl bg-blue-50 border border-blue-200/60 text-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[26px] lg:text-[28px]">{trip.icon || 'speaker'}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-base lg:text-lg font-bold text-on-surface truncate">
                    {trip.title}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-500 font-medium mt-1 flex flex-wrap items-center gap-2">
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
                {trip.cost && (
                  <span className="font-black text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-sm">
                    Thu: {typeof trip.cost === 'number' ? `${trip.cost.toLocaleString('vi-VN')} ₫` : trip.cost}
                  </span>
                )}

                <span
                  className={`px-3 py-1.5 font-bold rounded-xl border text-xs lg:text-sm ${
                    trip.statusBadge?.includes('secondary') || trip.status === 'Đã bàn giao' || trip.status === 'Hoàn thành'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {trip.status}
                </span>

                {/* Button: Xem Bản Đồ Lộ Trình */}
                <button
                  onClick={() => setSelectedTripForMap(trip)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs lg:text-sm font-bold text-slate-800 flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">map</span>
                  <span>Lộ Trình GPS</span>
                </button>

                {/* Delete Button */}
                {onDeleteTrip && (
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    title="Xóa đơn này"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
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
