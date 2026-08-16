import React from 'react';

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
    const raw = e.amount?.toString().replace(/[^0-9.]/g, '');
    return acc + (parseFloat(raw) || 0);
  }, 0);

  return (
    <div className="flex flex-col w-full gap-xl">
      {/* ══════════ 4 TOP STAT CARDS: BOX 1 (1 LINE), BOX 2 & 3 (2 BOXES/LINE ON MOBILE) ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-lg w-full">
        {/* Metric 1: Total Distance - Box 1: Full width on mobile */}
        <div className="col-span-2 lg:col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-md flex flex-col gap-sm border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          <div className="flex items-center justify-between z-10">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
              Tổng Quãng Đường
            </span>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-[18px]">
                near_me
              </span>
            </div>
          </div>
          <div className="flex items-end gap-xs z-10 mt-sm">
            <span className="font-display text-on-surface text-[30px] sm:text-[34px] leading-none">
              {totalDistanceNum > 0 ? totalDistanceNum.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) : '1.245'}
            </span>
            <span className="font-body-md text-on-surface-variant mb-1 font-medium">km</span>
          </div>
          <div className="flex items-center gap-xs z-10 mt-xs">
            <span className="material-symbols-outlined text-secondary text-[16px] p-0.5 bg-secondary/10 rounded-full">
              trending_up
            </span>
            <span className="font-label-sm text-secondary font-medium text-xs sm:text-sm">+12% so với tháng trước</span>
          </div>
        </div>

        {/* Metric 2: Avg Speed - Box 2: Half width on mobile */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-md flex flex-col gap-sm border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group justify-between">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          <div className="flex items-center justify-between z-10">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px] sm:text-xs font-semibold">
              Tốc Độ TB
            </span>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-[18px]">
                speed
              </span>
            </div>
          </div>
          <div className="flex items-end gap-xs z-10 mt-sm">
            <span className="font-display text-on-surface text-[24px] sm:text-[34px] leading-none">
              68.4
            </span>
            <span className="font-body-md text-on-surface-variant mb-1 font-medium text-xs sm:text-sm">km/h</span>
          </div>
          <div className="flex items-center gap-xs z-10 mt-xs">
            <span className="material-symbols-outlined text-on-surface-variant text-[14px] p-0.5 bg-slate-100 rounded-full">
              horizontal_rule
            </span>
            <span className="text-[11px] sm:text-xs text-on-surface-variant font-medium">Vận tốc ổn định</span>
          </div>
        </div>

        {/* Metric 3: Monthly Expenses - Box 3: Half width on mobile */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-md flex flex-col gap-sm border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all relative overflow-hidden group justify-between">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          <div className="flex items-center justify-between z-10">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px] sm:text-xs font-semibold">
              Chi Phí Tháng
            </span>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-[18px]">
                receipt_long
              </span>
            </div>
          </div>
          <div className="flex items-end gap-xs z-10 mt-sm">
            <span className="font-display text-on-surface text-[22px] sm:text-[34px] leading-none truncate">
              ${totalExpenseNum > 0 ? totalExpenseNum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '4,320'}
            </span>
          </div>
          <div className="flex items-center gap-xs z-10 mt-xs">
            <span className="material-symbols-outlined text-error text-[14px] p-0.5 bg-error/10 rounded-full">
              trending_up
            </span>
            <span className="text-[11px] sm:text-xs text-error font-medium">+5% dự toán</span>
          </div>
        </div>

        {/* Metric 4: Active Trip - Box 4: Full width on mobile */}
        <div className="col-span-2 lg:col-span-1 bg-primary-container rounded-2xl p-4 sm:p-md flex flex-col gap-sm shadow-md border border-slate-800/80 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="flex items-center justify-between gap-1 z-10">
            <span className="font-label-sm text-on-primary-container uppercase tracking-wider text-xs truncate font-semibold">
              Chuyến Đang Đi
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-secondary/20 rounded-full shrink-0 border border-secondary/30">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
              <span className="text-[11px] font-semibold text-secondary tracking-wide whitespace-nowrap">
                DI CHUYỂN
              </span>
            </div>
          </div>
          <div className="flex flex-col z-10 mt-sm">
            <span className="font-headline-lg text-on-primary-container leading-tight text-xl sm:text-2xl">
              Berlin
            </span>
            <span className="font-body-md text-on-primary-container/70 flex items-center gap-1 mt-1 font-medium text-xs sm:text-sm">
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              Munich
            </span>
          </div>
          <div className="flex flex-col gap-xs z-10 mt-auto pt-2">
            <div className="w-full bg-surface-container-low/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[65%] relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-on-secondary rounded-full shadow-[0_0_8px_rgba(0,108,73,0.8)]"></div>
              </div>
            </div>
            <div className="flex justify-between w-full">
              <span className="font-label-sm text-on-primary-container/70 text-xs">340 km đã đi</span>
              <span className="font-label-sm text-on-primary-container/70 text-xs">Còn 180 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ HERO ASSIGNMENT CARD ══════════ */}
      <div className="w-full bg-surface-container-lowest rounded-[28px] p-lg border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] relative overflow-hidden flex flex-col lg:flex-row gap-lg min-h-[380px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-slate-50/50 pointer-events-none"></div>

        <div className="flex-1 flex flex-col z-10 py-md pl-md">
          <div className="flex items-center gap-sm mb-lg">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-label-sm rounded-full tracking-wider uppercase text-xs font-semibold">
              Nhiệm Vụ Hiện Tại
            </span>
            <span className="font-body-md text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span> Bắt đầu lúc 08:30
            </span>
          </div>

          <h2 className="font-display text-on-surface text-[44px] leading-none tracking-tight mb-2">
            Dự Án Phoenix
          </h2>

          <p className="font-headline-md text-on-surface-variant font-normal mb-xl max-w-lg">
            Tư vấn tại chỗ cho khách hàng và triển khai phần cứng giai đoạn 2.
          </p>

          <div className="grid grid-cols-2 gap-y-lg gap-x-xl mt-auto">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-medium">Khách hàng</span>
              <span className="font-headline-md text-on-surface">Acme Corp Ltd.</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-medium">Thời gian dự kiến</span>
              <span className="font-headline-md text-on-surface">3 Ngày</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-medium">Ngân sách cấp</span>
              <span className="font-headline-md text-on-surface font-semibold">$12,500.00</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-medium">Đã chi tiêu</span>
              <span className="font-headline-md text-secondary font-semibold">$3,420.50</span>
            </div>
          </div>

          <div className="mt-xl flex flex-wrap gap-md">
            <button
              onClick={onOpenLogExpense}
              className="bg-primary text-on-primary font-body-md font-medium px-xl py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Ghi Nhận Chi Phí
            </button>

            <button
              onClick={onOpenItinerary}
              className="bg-slate-100 border border-slate-200 text-on-surface font-body-md font-medium px-xl py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2"
            >
              Xem Lịch Trình <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Map Image Box */}
        <div
          onClick={() => onNavigateToTab('tracking')}
          className="w-full lg:w-[40%] rounded-2xl overflow-hidden relative shadow-md border border-slate-200/90 z-10 cursor-pointer min-h-[260px]"
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            data-location="Frankfurt, Germany"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwkmdpmyx4qqd78u2loh-z85VEvZ6j4dFmAQFnZ8kLmrCV4z62v2ApBCROnmEbkAyAajWgyVegqJQIC8OU3rQxpZvfb63EpepXP72bFCLjm4E35D-ArQroocYLGYfvfTxfP7AOcG5VYREJ7qdR583W4R4r2uwQ96c4cEgiulzZWx7i-WGqunr51qe2iIz5vHXZy-FauHbzVTcEnbG0T3z8ULO-Ps-dIk0yvZS4IGItT8ulRJrDheBu')`,
            }}
          ></div>

          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-md rounded-xl flex items-center justify-between shadow-lg border border-slate-200/80">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-sm">navigation</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-on-surface font-semibold">Đang điều hướng đến điểm hẹn</span>
                <span className="font-label-sm text-on-surface-variant text-xs">Dự kiến: 45 phút</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline-md text-on-surface font-bold">24 km</span>
              <span className="font-label-sm text-secondary font-medium text-xs">Thông thoáng</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ 2-COLUMN SECTION: TRIPS & EXPENSES ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl w-full">
        {/* Left Column: Recent Trips */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center justify-between px-xs">
            <h3 className="font-headline-md text-on-surface">Chuyến Đi Gần Đây</h3>
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-primary font-body-md font-semibold hover:text-primary/80 transition-colors"
            >
              Xem Tất Cả
            </button>
          </div>

          <div className="flex flex-col gap-sm">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onNavigateToTab('tracking')}
                className="bg-surface-container-lowest p-md rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_4px_16px_rgba(11,28,48,0.06)]"
              >
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-slate-100 text-on-surface-variant rounded-full flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-slate-200/60">
                    <span className="material-symbols-outlined">{trip.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-md text-on-surface font-semibold">{trip.title}</span>
                    <span className="font-label-sm text-on-surface-variant text-xs">{trip.subtitle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <span className={`px-2.5 py-1 font-label-sm rounded-lg border text-xs font-semibold ${
                    trip.statusBadge.includes('secondary')
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {trip.status}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] opacity-0 group-hover:opacity-100 transition-opacity">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Expenses */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center justify-between px-xs">
            <h3 className="font-headline-md text-on-surface">Chi Phí Gần Đây</h3>
            <button
              onClick={() => onNavigateToTab('expenses')}
              className="text-primary font-body-md font-semibold hover:text-primary/80 transition-colors"
            >
              Xem Tất Cả
            </button>
          </div>

          <div className="flex flex-col gap-sm">
            {expenses.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateToTab('expenses')}
                className="bg-surface-container-lowest p-md rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:shadow-[0_4px_16px_rgba(11,28,48,0.06)]"
              >
                <div className="flex items-center gap-md">
                  <div
                    className={`w-12 h-12 bg-slate-100 text-on-surface-variant rounded-full flex items-center justify-center transition-colors border border-slate-200/60 ${item.hoverColor}`}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-md text-on-surface font-semibold">{item.title}</span>
                    <span className="font-label-sm text-on-surface-variant text-xs">{item.subtitle}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-headline-md text-on-surface font-bold">{item.amount}</span>
                  <span className={`font-label-sm text-xs font-semibold px-2 py-0.5 rounded-md mt-0.5 ${
                    item.status === 'Đã duyệt'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
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
