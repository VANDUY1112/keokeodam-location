import React from 'react';
import { formatVND, parseVNDNumber } from '../utils/format';

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
        <div className="col-span-2 lg:col-span-1 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 flex flex-col justify-between border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[160px] lg:min-h-[175px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          <div className="flex items-center justify-between z-10">
            <span className="text-slate-700 font-bold uppercase tracking-wide text-sm sm:text-base">
              Tổng quãng đường
            </span>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-50 border border-blue-100 text-primary flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined text-[22px] lg:text-[26px]">
                near_me
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 z-10 my-1">
            <span className="font-display text-on-surface text-3xl lg:text-[38px] font-extrabold leading-none tracking-tight">
              {totalDistanceNum > 0 ? totalDistanceNum.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) : '1.245'}
            </span>
            <span className="text-slate-500 font-bold text-base lg:text-lg">km</span>
          </div>

          <div className="flex items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold text-xs lg:text-sm">
              <span className="material-symbols-outlined text-[16px] lg:text-[18px]">
                trending_up
              </span>
              +12% so với tháng trước
            </span>
          </div>
        </div>

        {/* Metric 2: Avg Speed */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 flex flex-col justify-between border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[160px] lg:min-h-[175px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          <div className="flex items-center justify-between z-10">
            <span className="text-slate-700 font-bold uppercase tracking-wide text-sm sm:text-base">
              Tốc độ trung bình
            </span>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined text-[22px] lg:text-[26px]">
                speed
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 z-10 my-1">
            <span className="font-display text-on-surface text-3xl lg:text-[38px] font-extrabold leading-none tracking-tight">
              68.4
            </span>
            <span className="text-slate-500 font-bold text-base lg:text-lg">km/h</span>
          </div>

          <div className="flex items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60 font-semibold text-xs lg:text-sm">
              <span className="material-symbols-outlined text-[16px] lg:text-[18px]">
                horizontal_rule
              </span>
              Vận tốc ổn định
            </span>
          </div>
        </div>

        {/* Metric 3: Monthly Expenses (VNĐ) */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-5 lg:p-6 flex flex-col justify-between border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group min-h-[160px] lg:min-h-[175px]">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>

          <div className="flex items-center justify-between z-10">
            <span className="text-slate-700 font-bold uppercase tracking-wide text-sm sm:text-base">
              Chi phí tháng
            </span>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-50 border border-blue-100 text-primary flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined text-[22px] lg:text-[26px]">
                receipt_long
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 z-10 my-1">
            <span className="font-display text-on-surface text-2xl lg:text-[32px] font-extrabold leading-none tracking-tight truncate">
              {totalExpenseNum > 0 ? formatVND(totalExpenseNum) : '21.500.000 ₫'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold text-xs lg:text-sm">
              <span className="material-symbols-outlined text-[16px] lg:text-[18px]">
                trending_up
              </span>
              +5% so với tháng trước
            </span>
          </div>
        </div>

        {/* Metric 4: Active Trip */}
        <div className="col-span-2 lg:col-span-1 bg-primary-container rounded-2xl p-5 lg:p-6 flex flex-col justify-between shadow-md border border-slate-800/80 relative overflow-hidden group min-h-[160px] lg:min-h-[175px]">
          <div className="absolute top-0 right-0 w-36 h-36 bg-primary/30 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>

          <div className="flex items-center justify-between gap-2 z-10">
            <span className="text-on-primary-container font-bold uppercase tracking-wide text-sm sm:text-base truncate">
              Chuyến đang đi
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/25 rounded-full shrink-0 border border-secondary/40">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-secondary tracking-wide whitespace-nowrap">
                DI CHUYỂN
              </span>
            </div>
          </div>

          <div className="flex flex-col z-10 my-1">
            <span className="font-headline-lg text-on-primary-container leading-tight text-2xl lg:text-3xl font-extrabold">
              Berlin
            </span>
            <span className="font-body-md text-on-primary-container/80 flex items-center gap-1.5 mt-1 font-semibold text-sm lg:text-base">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              Munich
            </span>
          </div>

          <div className="flex flex-col gap-1.5 z-10">
            <div className="w-full bg-surface-container-low/20 h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[65%] relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-on-secondary rounded-full shadow-[0_0_8px_rgba(0,108,73,0.8)]"></div>
              </div>
            </div>
            <div className="flex justify-between w-full font-label-sm text-on-primary-container/80 text-xs lg:text-[13px] font-medium">
              <span>340 km đã đi</span>
              <span>Còn 180 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ HERO ASSIGNMENT CARD ══════════ */}
      <div className="w-full bg-surface-container-lowest rounded-3xl p-6 lg:p-8 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] relative overflow-hidden flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-slate-50/60 pointer-events-none"></div>

        <div className="flex-1 flex flex-col z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary font-label-sm rounded-full tracking-wider uppercase text-xs lg:text-sm font-bold">
              Nhiệm Vụ Hiện Tại
            </span>
            <span className="text-slate-500 font-medium text-sm lg:text-base flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">schedule</span> Bắt đầu lúc 08:30
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-on-surface leading-tight tracking-tight mb-2">
            Dự Án Phoenix
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-normal mb-6 max-w-xl">
            Tư vấn tại chỗ cho khách hàng và triển khai phần cứng giai đoạn 2.
          </p>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:gap-x-10 mt-auto pt-2 border-t border-slate-100/80">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider text-xs lg:text-[13px] font-bold">Khách hàng</span>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-on-surface">Acme Corp Ltd.</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider text-xs lg:text-[13px] font-bold">Thời gian dự kiến</span>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-on-surface">3 Ngày</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider text-xs lg:text-[13px] font-bold">Ngân sách cấp</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-on-surface">300.000.000 ₫</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider text-xs lg:text-[13px] font-bold">Đã chi tiêu</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-on-surface">85.500.000 ₫</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={onOpenLogExpense}
              className="bg-primary text-on-primary font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Ghi Nhận Chi Phí
            </button>

            <button
              onClick={onOpenItinerary}
              className="bg-slate-100 border border-slate-200 text-on-surface font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2"
            >
              Xem Lịch Trình <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Map Image Box */}
        <div
          onClick={() => onNavigateToTab('tracking')}
          className="w-full lg:w-[42%] rounded-2xl overflow-hidden relative shadow-md border border-slate-200/90 z-10 cursor-pointer min-h-[280px]"
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            data-location="Frankfurt, Germany"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwkmdpmyx4qqd78u2loh-z85VEvZ6j4dFmAQFnZ8kLmrCV4z62v2ApBCROnmEbkAyAajWgyVegqJQIC8OU3rQxpZvfb63EpepXP72bFCLjm4E35D-ArQroocYLGYfvfTxfP7AOcG5VYREJ7qdR583W4R4r2uwQ96c4cEgiulzZWx7i-WGqunr51qe2iIz5vHXZy-FauHbzVTcEnbG0T3z8ULO-Ps-dIk0yvZS4IGItT8ulRJrDheBu')`,
            }}
          ></div>

          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between shadow-lg border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-primary text-on-primary rounded-xl flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[22px]">navigation</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm lg:text-base font-bold text-on-surface">Đang điều hướng đến điểm hẹn</span>
                <span className="text-xs lg:text-sm text-slate-500 font-medium">Dự kiến: 45 phút</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg lg:text-2xl font-extrabold text-on-surface">24 km</span>
              <span className="text-xs lg:text-sm font-bold text-emerald-700">Thông thoáng</span>
            </div>
          </div>
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
                className="bg-surface-container-lowest p-4 lg:p-5 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_4px_16px_rgba(11,28,48,0.06)]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all border border-slate-200/60 shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[24px] lg:text-[28px]">{trip.icon || 'near_me'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base lg:text-[17px] font-bold text-on-surface">{trip.title}</span>
                    <span className="text-xs lg:text-sm text-slate-500 font-medium mt-0.5">{trip.subtitle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 font-semibold rounded-lg border text-xs lg:text-sm ${trip.statusBadge?.includes('secondary') || trip.status === 'Hoàn thành'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                    {trip.status}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-[22px] group-hover:text-primary group-hover:translate-x-0.5 transition-all">
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
                className="bg-surface-container-lowest p-4 lg:p-5 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_4px_16px_rgba(11,28,48,0.06)]"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center transition-all border border-slate-200/60 shadow-xs shrink-0 ${item.hoverColor || 'group-hover:bg-primary group-hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined text-[24px] lg:text-[28px]">{item.icon || 'receipt_long'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base lg:text-[17px] font-bold text-on-surface">{item.title}</span>
                    <span className="text-xs lg:text-sm text-slate-500 font-medium mt-0.5">{item.subtitle}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-base lg:text-lg font-extrabold text-on-surface">{formatVND(item.amount)}</span>
                  <span className={`text-xs lg:text-sm font-bold px-2.5 py-0.5 rounded-md mt-1 ${item.status === 'Đã duyệt'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}>
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
