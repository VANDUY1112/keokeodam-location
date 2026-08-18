import React, { useState } from 'react';
import { formatVND, parseVNDNumber } from '../utils/format';

export default function ExpensesView({ expenses = [], onOpenAddExpense }) {
  const [timeRange, setTimeRange] = useState('Tháng');
  const [activePointIndex, setActivePointIndex] = useState(5); // Default focus on peak point

  const totalSpent = expenses.reduce((acc, e) => acc + parseVNDNumber(e.amount), 0);
  const displayTotalSpent = totalSpent > 0 ? formatVND(totalSpent) : '21.774.250 ₫';
  const pendingCount = expenses.filter((e) => e.status === 'Chờ duyệt').length || 3;

  // Wave Chart Data Points (Biểu đồ sóng chi phí theo chu kỳ)
  const waveData = [
    { label: 'T2', amount: 1850000, x: 20, y: 110 },
    { label: 'T3', amount: 2450000, x: 75, y: 88 },
    { label: 'T4', amount: 1950000, x: 130, y: 105 },
    { label: 'T5', amount: 3200000, x: 185, y: 62 },
    { label: 'T6', amount: 2800000, x: 240, y: 78 },
    { label: 'T7', amount: 4850000, x: 295, y: 25, peak: true },
    { label: 'CN', amount: 3600000, x: 350, y: 52 },
  ];

  // Generate smooth SVG cubic bezier path
  const generateSmoothPath = (points) => {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) / 2;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) / 2;
      const cy2 = p1.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(waveData);
  const areaPath = `${linePath} L ${waveData[waveData.length - 1].x} 150 L ${waveData[0].x} 150 Z`;

  return (
    <div className="flex flex-col w-full gap-5 sm:gap-6 lg:gap-8 pb-24 lg:pb-8">
      {/* ══════════ TOP HEADER & TIMEFRAME FILTER ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Chi Phí
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
            Theo dõi và phân loại các khoản chi tiêu trong chuyến công tác
          </p>
        </div>

        <div className="flex bg-slate-100 border border-slate-200 rounded-2xl p-1 self-start sm:self-auto shadow-xs">
          {['Ngày', 'Tuần', 'Tháng'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all text-xs sm:text-sm font-bold ${
                timeRange === range
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ 3 METRIC CARDS (CLEAN MONOCHROME SLATE) ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6 w-full">
        {/* Total Spent */}
        <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[140px] sm:min-h-[160px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base lg:text-lg leading-tight">
              Tổng đã chi
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                account_balance_wallet
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[32px] font-black leading-tight tracking-tight truncate">
              {displayTotalSpent}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px]">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +12% so với tháng trước
            </span>
          </div>
        </div>

        {/* Budget Remaining */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[140px] sm:min-h-[160px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base lg:text-lg leading-tight">
              Ngân sách còn lại
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                savings
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-slate-900 text-lg sm:text-2xl lg:text-[28px] font-black leading-tight tracking-tight truncate">
              15.500.000 ₫
            </span>
          </div>

          <div className="mt-1 w-full bg-slate-100 border border-slate-200/80 rounded-full h-2 sm:h-2.5 overflow-hidden">
            <div className="bg-slate-900 h-full rounded-full transition-all duration-700" style={{ width: '61%' }}></div>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[140px] sm:min-h-[160px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base lg:text-lg leading-tight">
              Yêu cầu chờ duyệt
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                receipt_long
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[32px] font-black leading-tight tracking-tight">
              {pendingCount}
            </span>
            <span className="text-slate-500 text-xs sm:text-sm lg:text-base font-bold">hóa đơn</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-[11px] sm:text-xs lg:text-[13px] truncate">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span className="truncate">Đang chờ xác nhận</span>
            </span>
          </div>
        </div>
      </div>

      {/* ══════════ 2-COLUMN SECTION: TABLE/CARDS & BIỂU ĐỒ SÓNG (WAVE CHART) ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {/* Left Column (2 Cols): Recent Expenses Table / Mobile Cards */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-[0_2px_16px_rgba(11,28,48,0.03)] flex flex-col">
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Chi Phí Gần Đây</h2>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 text-white px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xs active:scale-95 text-xs sm:text-sm lg:text-base font-bold whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">add</span>
              <span>Thêm Chi Phí</span>
            </button>
          </div>

          {/* Mobile Card List (Hidden on desktop) */}
          <div className="flex flex-col gap-2.5 md:hidden">
            {expenses.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 font-medium text-sm">
                Chưa có chi phí nào được ghi nhận.
              </div>
            ) : (
              expenses.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl flex items-center justify-between border border-slate-200 shadow-[0_1px_6px_rgba(11,28,48,0.02)] gap-3 hover:bg-slate-50/80 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon || 'receipt'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-bold text-slate-900 truncate leading-snug">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                        <span className="truncate">{item.subtitle ? item.subtitle.split('•')[0].trim() : 'Hôm nay'}</span>
                        <span>•</span>
                        <span className="text-slate-700 font-semibold truncate">{item.category || 'Chi phí'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="text-sm font-black text-slate-900">
                      {formatVND(item.amount)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.status === 'Đã duyệt'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
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
              <tbody className="text-slate-900 divide-y divide-slate-100 text-sm lg:text-base">
                {expenses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 pr-4 whitespace-nowrap text-slate-500 font-medium">
                      {item.subtitle ? item.subtitle.split('•')[0] : 'Hôm nay'}
                    </td>
                    <td className="py-4 pr-4 font-bold text-slate-900">{item.title}</td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs lg:text-sm">
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
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
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

        {/* Right Column (1 Col): Biến Động Chi Phí Dạng Sóng (Smooth Wave Area Chart) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between border border-slate-200 shadow-[0_2px_16px_rgba(11,28,48,0.03)]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                Biến Động Chi Phí
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                7 Ngày Qua
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mb-4">
              Dòng dao động chi tiêu thực tế theo từng ngày
            </p>

            {/* Focused data indicator pill */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
                  {waveData[activePointIndex].label === 'CN' ? 'Chủ Nhật' : `Thứ ${waveData[activePointIndex].label.replace('T', '')}`}
                </span>
                <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {formatVND(waveData[activePointIndex].amount)}
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-xs">
                {waveData[activePointIndex].peak ? '🔥 Cao nhất tuần' : 'Ổn định'}
              </span>
            </div>

            {/* Smooth SVG Wave Area Chart */}
            <div className="w-full relative py-2">
              <svg className="w-full h-44 sm:h-48 overflow-visible" viewBox="0 0 370 160">
                <defs>
                  {/* Wave Area Linear Gradient */}
                  <linearGradient id="waveFillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity="0.22" />
                    <stop offset="65%" stopColor="#0f172a" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.00" />
                  </linearGradient>

                  {/* Horizontal Grid Pattern */}
                  <pattern id="gridLines" width="100" height="35" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="35" x2="370" y2="35" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  </pattern>
                </defs>

                {/* Grid Background */}
                <rect x="0" y="10" width="370" height="140" fill="url(#gridLines)" />

                {/* Area Gradient Fill Under Curve */}
                <path d={areaPath} fill="url(#waveFillGradient)" />

                {/* Smooth Curve Stroke Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_4px_8px_rgba(15,23,42,0.15)]"
                />

                {/* Interactive Wave Data Points */}
                {waveData.map((pt, idx) => {
                  const isActive = activePointIndex === idx;
                  return (
                    <g
                      key={pt.label}
                      onClick={() => setActivePointIndex(idx)}
                      className="cursor-pointer group"
                    >
                      {/* Invisible larger hit area for touch/click */}
                      <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                      {/* Active outer pulse ring */}
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="10"
                          fill="#0f172a"
                          fillOpacity="0.15"
                          className="animate-ping"
                        />
                      )}

                      {/* Dot Marker */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 6 : 4}
                        fill={isActive ? '#0f172a' : '#ffffff'}
                        stroke="#0f172a"
                        strokeWidth={isActive ? 3 : 2.5}
                        className="transition-all duration-200 group-hover:scale-125"
                      />

                      {/* X-axis Day Label */}
                      <text
                        x={pt.x}
                        y="158"
                        textAnchor="middle"
                        className={`text-[12px] font-bold transition-colors ${
                          isActive ? 'fill-slate-900 font-black' : 'fill-slate-400 group-hover:fill-slate-700'
                        }`}
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs">Chi tiêu trung bình</span>
              <span className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">
                2.970.000 ₫/ngày
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs">Đỉnh chi tuần</span>
              <span className="text-slate-900 font-extrabold text-sm sm:text-base mt-0.5">
                4.850.000 ₫ (T7)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
