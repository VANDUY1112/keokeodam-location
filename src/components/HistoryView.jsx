import React, { useState } from 'react';
import { Milestone } from 'lucide-react';
import LiveRouteMap from './LiveRouteMap';
import { formatVND } from '../utils/format';

export default function HistoryView({ trips = [], onDeleteTrip, onNavigateToTracking, onOpenVietQR }) {
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter(
    (t) =>
      (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.speakerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalDistance = trips.reduce((acc, t) => {
    const d = parseFloat(t.distanceKm) || (t.subtitle?.match(/(\d+([\.,]\d+)?)\s*km/) ? parseFloat(t.subtitle.match(/(\d+([\.,]\d+)?)\s*km/)[1]) : 0);
    return acc + d;
  }, 0);

  const totalRevenue = trips.reduce((acc, t) => {
    const rawCost = typeof t.cost === 'number' ? t.cost : (parseFloat(String(t.cost || 0).replace(/[^\d]/g, '')) || 0);
    return acc + rawCost;
  }, 0);

  return (
    <div className="flex flex-col w-full gap-5 sm:gap-6 lg:gap-8 pb-24 lg:pb-8">
      {/* ══════════ TOP HEADER ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lịch Sử Giao & Cho Thuê Loa
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
            Nhật ký các đơn thuê loa đã bàn giao, đo đạc quãng đường GPS và tổng thu từ khách hàng
          </p>
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
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
            <span>Giao Mới</span>
          </button>
        </div>
      </div>

      {/* ══════════ 3 STATS METRIC CARDS (CLEAN SLATE) ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6 w-full">
        {/* Metric 1: Total Trips */}
        <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[135px] sm:min-h-[155px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base lg:text-lg leading-tight">
              Tổng đơn giao nhận
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                speaker_group
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[32px] font-black leading-tight tracking-tight">
              {trips.length}
            </span>
            <span className="text-slate-500 font-bold text-xs sm:text-sm lg:text-base ml-1">đơn hoàn tất</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px]">
              <span className="material-symbols-outlined text-[15px]">inventory_2</span>
              Toàn bộ lịch sử
            </span>
          </div>
        </div>

        {/* Metric 2: Total GPS Distance */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[135px] sm:min-h-[155px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base lg:text-lg leading-tight">
              Tổng quãng đường
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <Milestone className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[32px] font-black leading-tight tracking-tight">
              {totalDistance.toFixed(1)}
            </span>
            <span className="text-slate-500 font-bold text-xs sm:text-sm lg:text-base ml-1">km GPS</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px]">
              <span className="material-symbols-outlined text-[15px]">route</span>
              Đo đạc thực tế
            </span>
          </div>
        </div>

        {/* Metric 3: Total Revenue Collected */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[135px] sm:min-h-[155px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base lg:text-lg leading-tight">
              Tổng tiền thu nhận
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                payments
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[32px] font-black leading-tight tracking-tight truncate">
              {formatVND(totalRevenue)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px]">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              Đã thu hoàn tất
            </span>
          </div>
        </div>
      </div>

      {/* ══════════ TRIPS LIST ══════════ */}
      <div className="flex flex-col gap-3 sm:gap-3.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-bold text-slate-700">
            Danh sách đơn ({filteredTrips.length})
          </span>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">speaker_group</span>
            </div>
            <p className="text-slate-900 font-bold text-base">Chưa tìm thấy đơn bàn giao loa nào</p>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Hãy thử tìm kiếm từ khóa khác hoặc tạo chuyến giao mới.</p>
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const costVal = typeof trip.cost === 'number' 
              ? trip.cost 
              : (parseFloat(String(trip.cost || 0).replace(/[^\d]/g, '')) || 0);

            return (
              <div
                key={trip.id}
                className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4"
              >
                {/* Left info */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px]">
                      {trip.icon || 'speaker'}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-slate-900 truncate leading-snug">
                        {trip.title}
                      </span>
                      <span className="sm:hidden text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                        {trip.status || 'Hoàn thành'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1 flex-wrap">
                      <span>{trip.subtitle}</span>
                      {trip.duration && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <span className="material-symbols-outlined text-[13px]">timer</span>
                            {trip.duration}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right actions / financial amount */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Financial amount */}
                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs text-slate-400 font-semibold sm:hidden">Tiền thu:</span>
                    <span className="text-sm sm:text-base font-black text-slate-900 whitespace-nowrap">
                      {formatVND(costVal)}
                    </span>
                  </div>

                  {/* Status badge (Desktop) */}
                  <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded-lg border bg-slate-900 text-white border-slate-900 whitespace-nowrap">
                    {trip.status || 'Hoàn thành'}
                  </span>

                  {/* Button: Thu Tiền VietQR */}
                  {onOpenVietQR && (
                    <button
                      onClick={() => onOpenVietQR(costVal, `KEO KEO DAM nhan ${costVal.toLocaleString('vi-VN')}`)}
                      className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap active:scale-95"
                      title="Tạo mã VietQR thu tiền đơn này"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      <span>Mã QR</span>
                    </button>
                  )}

                  {/* Button: Xem Bản Đồ Lộ Trình */}
                  <button
                    onClick={() => setSelectedTripForMap(trip)}
                    className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-700">map</span>
                    <span>Lộ trình GPS</span>
                  </button>

                  {/* Delete Button */}
                  {onDeleteTrip && (
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      title="Xóa đơn này"
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ══════════ MODAL: XEM LẠI BẢN ĐỒ LỘ TRÌNH QUÁ KHỨ ══════════ */}
      {selectedTripForMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">map</span>
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-base sm:text-lg">
                    {selectedTripForMap.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedTripForMap.subtitle} • {selectedTripForMap.status || 'Đã hoàn thành'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTripForMap(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Interactive Map of this Trip */}
            <div className="flex-1 min-h-[350px] sm:min-h-[400px] w-full rounded-2xl overflow-hidden border border-slate-200 relative">
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

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-1">
              <div className="text-xs text-slate-500 font-medium">
                Tọa độ GPS đã được lưu trong cơ sở dữ liệu cục bộ.
              </div>
              <button
                onClick={() => setSelectedTripForMap(null)}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-xs"
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
