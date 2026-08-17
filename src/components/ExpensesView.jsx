import React, { useState } from 'react';
import { formatVND, parseVNDNumber } from '../utils/format';

export default function ExpensesView({ expenses = [], onOpenAddExpense }) {
  const [timeRange, setTimeRange] = useState('Tháng');

  const totalSpent = expenses.reduce((acc, e) => acc + parseVNDNumber(e.amount), 0);
  const displayTotalSpent = totalSpent > 0 ? formatVND(totalSpent) : '24.500.000 ₫';
  const pendingCount = expenses.filter(e => e.status === 'Chờ duyệt').length || 3;

  return (
    <div className="flex flex-col w-full gap-6 lg:gap-8">
      {/* ══════════ TOP HEADER & TIMEFRAME FILTER ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Quản Lý Chi Phí</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Theo dõi và phân loại các khoản chi tiêu trong chuyến công tác
          </p>
        </div>

        <div className="flex bg-surface-container-high/60 border border-slate-200/90 rounded-2xl p-1.5 self-start sm:self-auto shadow-sm">
          {['Ngày', 'Tuần', 'Tháng'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl transition-all text-sm font-bold ${
                timeRange === range
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-surface-container-high'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ 3 METRIC CARDS ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Total Spent */}
        <div className="col-span-2 lg:col-span-1 bg-surface-container-lowest rounded-3xl p-5 lg:p-6 relative overflow-hidden group border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 p-4 lg:p-6 opacity-15 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary">
              account_balance_wallet
            </span>
          </div>
          <div>
            <p className="text-slate-500 uppercase tracking-wider text-xs lg:text-[13px] font-bold">
              Tổng Đã Chi
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl lg:text-[34px] font-black text-on-surface leading-tight">
                {displayTotalSpent}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-secondary text-xs lg:text-sm">
            <span className="material-symbols-outlined text-base p-0.5 bg-secondary/10 rounded-full">trending_up</span>
            <span className="font-bold">+12% so với tháng trước</span>
          </div>
        </div>

        {/* Budget Remaining */}
        <div className="col-span-1 bg-surface-container-lowest rounded-3xl p-5 lg:p-6 relative overflow-hidden group border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="absolute top-0 right-0 p-4 lg:p-6 opacity-15 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-4xl sm:text-5xl text-secondary">savings</span>
            </div>
            <p className="text-slate-500 uppercase tracking-wider text-xs lg:text-[13px] font-bold">
              Ngân Sách Còn Lại
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl lg:text-[34px] font-black text-on-surface leading-tight">
                15.500.000 ₫
              </span>
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-100 border border-slate-200/60 rounded-full h-2.5 overflow-hidden">
            <div className="bg-secondary h-full rounded-full transition-all duration-700 shadow-sm" style={{ width: '61%' }}></div>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="col-span-1 bg-surface-container-lowest rounded-3xl p-5 lg:p-6 relative overflow-hidden group border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_8px_30px_rgba(11,28,48,0.08)] hover:border-slate-300 transition-all flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="absolute top-0 right-0 p-4 lg:p-6 opacity-15 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <span className="material-symbols-outlined text-4xl sm:text-5xl text-amber-600">receipt_long</span>
            </div>
            <p className="text-slate-500 uppercase tracking-wider text-xs lg:text-[13px] font-bold">
              Yêu Cầu Chờ Duyệt
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl lg:text-[34px] font-black text-on-surface leading-tight">
                {pendingCount}
              </span>
              <span className="text-slate-500 text-sm lg:text-base font-bold">hóa đơn</span>
            </div>
          </div>
          <div className="mt-3 text-xs lg:text-sm text-slate-500 flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span>Đang chờ kế toán xác nhận</span>
          </div>
        </div>
      </div>

      {/* ══════════ 2-COLUMN SECTION: TABLE & DONUT CHART ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column (2 Cols): Recent Expenses Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 lg:p-8 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-on-surface">Chi Phí Gần Đây</h2>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 text-sm lg:text-base font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Thêm Chi Phí</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs lg:text-sm font-bold">
                  <th className="pb-3.5">Ngày</th>
                  <th className="pb-3.5">Mô tả</th>
                  <th className="pb-3.5">Phân loại</th>
                  <th className="pb-3.5 text-right">Số tiền</th>
                  <th className="pb-3.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-on-surface divide-y divide-slate-100 text-sm lg:text-base">
                {expenses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 pr-4 whitespace-nowrap text-slate-500 font-medium">
                      {item.subtitle ? item.subtitle.split('•')[0] : 'Hôm nay'}
                    </td>
                    <td className="py-4 pr-4 font-bold text-on-surface">{item.title}</td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold text-xs lg:text-sm">
                        <span className="material-symbols-outlined text-[18px]">{item.icon || 'receipt'}</span>
                        <span>{item.category || 'Chi phí'}</span>
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right font-black text-slate-900 whitespace-nowrap">
                      {formatVND(item.amount)}
                    </td>
                    <td className="py-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs lg:text-sm font-bold border ${
                        item.status === 'Đã duyệt'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 border-amber-200/60'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Spending by Category Donut */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 flex flex-col border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)]">
          <h2 className="text-xl lg:text-2xl font-bold text-on-surface mb-6">Chi Phí Theo Danh Mục</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[260px]">
            <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 100 100">
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

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-slate-500 uppercase tracking-wider text-xs lg:text-sm font-bold">Tổng chi</span>
              <span className="text-xl lg:text-2xl font-black text-on-surface mt-0.5">24.500.000 ₫</span>
            </div>
          </div>

          <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 text-sm lg:text-base">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-primary/20"></div>
                <span className="font-semibold text-on-surface">Di chuyển & Đi lại</span>
              </div>
              <span className="font-bold text-slate-700">45%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-secondary/20"></div>
                <span className="font-semibold text-on-surface">Khách sạn & Lưu trú</span>
              </div>
              <span className="font-bold text-slate-700">35%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-600 ring-2 ring-amber-600/20"></div>
                <span className="font-semibold text-on-surface">Ăn uống & Tiếp khách</span>
              </div>
              <span className="font-bold text-slate-700">15%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-300 ring-2 ring-slate-300/30"></div>
                <span className="font-semibold text-on-surface">Chi phí khác</span>
              </div>
              <span className="font-bold text-slate-700">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
