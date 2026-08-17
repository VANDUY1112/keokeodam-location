import React from 'react';
import { formatVND, parseVNDNumber } from '../utils/format';
import DashboardMiniMap from './DashboardMiniMap';

export default function DashboardView({
  expenses = [],
  trips = [],
  onOpenLogExpense,
  onOpenItinerary,
  onNavigateToTab,
}) {
  // Compute dynamic stats from actual data
  const totalDistanceNum = trips.reduce((acc, t) => {
    const d = parseFloat(t.distanceKm) || (t.subtitle?.match(/(\d+([\.,]\d+)?)\s*km/) ? parseFloat(t.subtitle.match(/(\d+([\.,]\d+)?)\s*km/)[1]) : 0);
    return acc + d;
  }, 0);

  const totalExpenseNum = expenses.reduce((acc, e) => {
    return acc + parseVNDNumber(e.amount);
  }, 0);

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
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                near_me
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 sm:gap-2 z-10 my-1">
            <span className="font-display text-on-surface text-2xl sm:text-3xl lg:text-[38px] font-extrabold leading-none tracking-tight">
              {totalDistanceNum > 0 ? totalDistanceNum.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) : '1.245'}
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
              {totalExpenseNum > 0 ? formatVND(totalExpenseNum) : '21.500.000 ₫'}
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
              {trips.length > 0 ? trips.length : 36}
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

      {/* ══════════ HERO ASSIGNMENT CARD: LOA KẸO KÉO ══════════ */}
      <div className="w-full bg-surface-container-lowest rounded-3xl p-6 lg:p-8 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] relative overflow-hidden flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-slate-50/60 pointer-events-none"></div>

        <div className="flex-1 flex flex-col z-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="px-3.5 py-1.5 bg-slate-100 border border-slate-200/80 text-slate-800 font-bold rounded-xl text-xs sm:text-sm lg:text-[15px]">
              Đơn Thuê Loa Tiêu Biểu
            </span>
            <span className="text-slate-600 font-medium text-xs sm:text-sm lg:text-[15px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">schedule</span> Bàn giao lúc 08:30
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 leading-snug tracking-tight mb-2">
            Tiệc Tân Gia - Anh Nam
          </h2>

          <p className="text-slate-600 text-sm sm:text-base lg:text-[17px] font-normal leading-relaxed mb-4 max-w-xl">
            Cho thuê dàn loa kéo đôi Bass 50 công suất 1500W kèm 2 mic kim loại UHF + phí cước ship tận nhà.
          </p>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 sm:gap-x-8 mt-auto pt-3 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs sm:text-sm lg:text-[15px] font-medium">Khách hàng</span>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mt-0.5">Anh Nam</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs sm:text-sm lg:text-[15px] font-medium">Tổng giờ thuê</span>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mt-0.5">24 Giờ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs sm:text-sm lg:text-[15px] font-medium">Số điện thoại</span>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mt-0.5 tracking-normal">0912.345.678</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs sm:text-sm lg:text-[15px] font-medium">Tổng tiền thu từ khách</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 mt-0.5">575.000 ₫</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('history')}
              className="bg-slate-900 text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-slate-800 transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px] sm:text-[19px] shrink-0">visibility</span>
              <span className="truncate">Xem Chi Tiết</span>
            </button>

            <button
              onClick={() => onNavigateToTab && onNavigateToTab('tracking')}
              className="bg-slate-100 border border-slate-200/90 text-slate-800 font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px] sm:text-[19px] text-slate-700 shrink-0">replay</span>
              <span className="truncate">Thuê Lại Loa</span>
            </button>
          </div>
        </div>

        {/* Right Map Box: Live Leaflet Interactive Map */}
        <div className="w-full lg:w-[46%] rounded-2xl overflow-hidden relative shadow-md border border-slate-200/90 z-10 min-h-[320px] lg:min-h-[360px] flex flex-col">
          <DashboardMiniMap onNavigateToTracking={() => onNavigateToTab && onNavigateToTab('tracking')} />
        </div>
      </div>

      {/* ══════════ 2-COLUMN SECTION: TRIPS & EXPENSES ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full">
        {/* Left Column: Recent Trips */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl lg:text-2xl font-bold text-on-surface">Chuyến Đi Gần Đây</h3>
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-primary font-bold text-sm lg:text-base hover:underline transition-all"
            >
              Xem Tất Cả
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {trips.map((trip) => (
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
                  <span className="px-3 py-1 font-bold rounded-lg border border-slate-200/80 bg-slate-100 text-slate-700 text-xs sm:text-[13px] lg:text-[14px] whitespace-nowrap shrink-0">
                    {trip.status || 'Hoàn thành'}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px] sm:text-[22px] group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Expenses */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl lg:text-2xl font-bold text-on-surface">Chi Phí Gần Đây</h3>
            <button
              onClick={() => onNavigateToTab('expenses')}
              className="text-primary font-bold text-sm lg:text-base hover:underline transition-all"
            >
              Xem Tất Cả
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {expenses.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateToTab('expenses')}
                className="bg-surface-container-lowest p-3.5 sm:p-4 lg:p-5 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_4px_16px_rgba(11,28,48,0.06)] gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-slate-100 text-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all border border-slate-200/60 shadow-xs shrink-0 ${item.hoverColor || 'group-hover:bg-primary group-hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[24px] lg:text-[28px]">{item.icon || 'receipt_long'}</span>
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
                  <span className="text-xs sm:text-[13px] lg:text-[14px] font-medium mt-0.5 text-slate-500 whitespace-nowrap">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
