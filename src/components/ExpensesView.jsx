import React, { useState } from 'react';

export default function ExpensesView({ expenses, onOpenAddExpense }) {
  const [timeRange, setTimeRange] = useState('Tháng');

  return (
    <div className="flex flex-col w-full gap-xl">
      {/* ══════════ TOP HEADER & TIMEFRAME FILTER ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-on-surface">Quản Lý Chi Phí</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Theo dõi và phân loại các khoản chi tiêu trong chuyến công tác
          </p>
        </div>

        <div className="flex bg-surface-container-high/60 border border-slate-200/90 rounded-xl p-1 self-start sm:self-auto shadow-sm">
          {['Ngày', 'Tuần', 'Tháng'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-md py-1.5 rounded-lg transition-all font-label-sm ${
                timeRange === range
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ 3 METRIC CARDS: BOX 1 (1 LINE), BOX 2 & 3 (2 BOXES/LINE ON MOBILE) ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-lg">
        {/* Total Spent - Box 1: Full width on mobile */}
        <div className="col-span-2 lg:col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-lg relative overflow-hidden group border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all">
          <div className="absolute top-0 right-0 p-3 sm:p-lg opacity-15 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary">
              account_balance_wallet
            </span>
          </div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
            Tổng Đã Chi
          </p>
          <div className="mt-sm flex items-baseline gap-sm">
            <span className="font-display text-on-surface text-[30px] sm:text-[34px] leading-tight">$2,450.00</span>
          </div>
          <div className="mt-md flex items-center gap-xs text-secondary text-xs sm:text-sm">
            <span className="material-symbols-outlined text-sm p-0.5 bg-secondary/10 rounded-full">trending_up</span>
            <span className="font-medium">+12% so với tháng trước</span>
          </div>
        </div>

        {/* Budget Remaining - Box 2: Half width on mobile */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-lg relative overflow-hidden group border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="absolute top-0 right-0 p-3 sm:p-lg opacity-15 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-secondary">savings</span>
            </div>
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px] sm:text-xs font-semibold">
              Ngân Sách Còn Lại
            </p>
            <div className="mt-sm flex items-baseline gap-sm">
              <span className="font-display text-on-surface text-[24px] sm:text-[34px] leading-tight">$1,550.00</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 border border-slate-200/60 rounded-full h-2 overflow-hidden">
            <div className="bg-secondary h-2 rounded-full transition-all duration-700 shadow-sm" style={{ width: '61%' }}></div>
          </div>
        </div>

        {/* Pending Claims - Box 3: Half width on mobile */}
        <div className="col-span-1 bg-surface-container-lowest rounded-2xl p-4 sm:p-lg relative overflow-hidden group border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="absolute top-0 right-0 p-3 sm:p-lg opacity-15 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-tertiary">receipt_long</span>
            </div>
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px] sm:text-xs font-semibold">
              Yêu Cầu Chờ Duyệt
            </p>
            <div className="mt-sm flex items-baseline gap-xs">
              <span className="font-display text-on-surface text-[24px] sm:text-[34px] leading-tight">3</span>
              <span className="text-on-surface-variant text-xs sm:text-sm font-medium">hóa đơn</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] sm:text-xs text-on-surface-variant flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-xs sm:text-sm">schedule</span>
            <span>Đang chờ kế toán xác nhận</span>
          </div>
        </div>
      </div>

      {/* ══════════ 2-COLUMN SECTION: TABLE & DONUT CHART ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column (2 Cols): Recent Expenses Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-lg border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)]">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-md text-on-surface">Chi Phí Gần Đây</h2>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-xs bg-primary text-on-primary px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="font-label-sm font-medium">Thêm Chi Phí</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-on-surface-variant font-label-sm uppercase tracking-wider text-xs">
                  <th className="pb-3 font-semibold">Ngày</th>
                  <th className="pb-3 font-semibold">Mô tả</th>
                  <th className="pb-3 font-semibold">Phân loại</th>
                  <th className="pb-3 font-semibold text-right">Số tiền</th>
                  <th className="pb-3 font-semibold text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-on-surface divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 pr-md whitespace-nowrap text-on-surface-variant">24 Th10, 2026</td>
                  <td className="py-3.5 pr-md font-medium text-on-surface">Ăn tối tiếp khách - Nhà hàng</td>
                  <td className="py-3.5 pr-md whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/60 font-medium text-xs">
                      <span className="material-symbols-outlined text-sm">restaurant</span> Ăn uống
                    </span>
                  </td>
                  <td className="py-3.5 pr-md text-right font-semibold">$145.20</td>
                  <td className="py-3.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
                      Đã duyệt
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 pr-md whitespace-nowrap text-on-surface-variant">22 Th10, 2026</td>
                  <td className="py-3.5 pr-md font-medium text-on-surface">Taxi sân bay</td>
                  <td className="py-3.5 pr-md whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 font-medium text-xs">
                      <span className="material-symbols-outlined text-sm">local_taxi</span> Di chuyển
                    </span>
                  </td>
                  <td className="py-3.5 pr-md text-right font-semibold">$45.00</td>
                  <td className="py-3.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-semibold">
                      Chờ duyệt
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 pr-md whitespace-nowrap text-on-surface-variant">20 Th10, 2026</td>
                  <td className="py-3.5 pr-md font-medium text-on-surface">Phòng khách sạn Marriott</td>
                  <td className="py-3.5 pr-md whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60 font-medium text-xs">
                      <span className="material-symbols-outlined text-sm">hotel</span> Lưu trú
                    </span>
                  </td>
                  <td className="py-3.5 pr-md text-right font-semibold">$850.00</td>
                  <td className="py-3.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
                      Đã duyệt
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 pr-md whitespace-nowrap text-on-surface-variant">18 Th10, 2026</td>
                  <td className="py-3.5 pr-md font-medium text-on-surface">Văn phòng phẩm dự án</td>
                  <td className="py-3.5 pr-md whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs">
                      <span className="material-symbols-outlined text-sm">inventory_2</span> Vật tư
                    </span>
                  </td>
                  <td className="py-3.5 pr-md text-right font-semibold">$32.50</td>
                  <td className="py-3.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
                      Đã duyệt
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Spending by Category Donut */}
        <div className="bg-surface-container-lowest rounded-2xl p-lg flex flex-col border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)]">
          <h2 className="font-headline-md text-on-surface mb-lg">Chi Phí Theo Danh Mục</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-slate-100"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeWidth="18"
              ></circle>
              <circle
                className="text-primary"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="62.8"
                strokeWidth="18"
              ></circle>
              <circle
                className="text-secondary"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="188.4"
                strokeWidth="18"
                transform="rotate(270 50 50)"
              ></circle>
              <circle
                className="text-amber-600"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="213.52"
                strokeWidth="18"
                transform="rotate(330 50 50)"
              ></circle>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-label-sm uppercase tracking-wider text-xs text-on-surface-variant">Tổng chi</span>
              <span className="font-headline-lg font-bold text-on-surface mt-0.5">$2,450</span>
            </div>
          </div>

          <div className="mt-lg space-y-2.5 pt-md border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/20"></div>
                <span className="font-body-md text-on-surface font-medium">Di chuyển & Đi lại</span>
              </div>
              <span className="font-body-md text-on-surface-variant font-semibold">45%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-secondary ring-2 ring-secondary/20"></div>
                <span className="font-body-md text-on-surface font-medium">Khách sạn & Lưu trú</span>
              </div>
              <span className="font-body-md text-on-surface-variant font-semibold">35%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-amber-600 ring-2 ring-amber-600/20"></div>
                <span className="font-body-md text-on-surface font-medium">Ăn uống & Tiếp khách</span>
              </div>
              <span className="font-body-md text-on-surface-variant font-semibold">15%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-slate-300 ring-2 ring-slate-300/30"></div>
                <span className="font-body-md text-on-surface font-medium">Chi phí khác</span>
              </div>
              <span className="font-body-md text-on-surface-variant font-semibold">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
