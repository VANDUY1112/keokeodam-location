import React, { useState, useEffect } from 'react';
import { formatVND, parseVNDNumber } from '../utils/format';
import { Pagination } from './Pagination';

const TIME_RANGE_DATA = {
  'Ngày': {
    badge: 'Hôm Nay',
    totalSpent: '1.450.000 ₫',
    trend: '+8% so với hôm qua',
    trendIcon: 'trending_up',
    remainingBudget: '18.550.000 ₫',
    budgetProgress: '88%',
    pendingCount: 1,
    avgLabel: 'Chi tiêu trung bình',
    avgValue: '241.000 ₫/mốc',
    peakLabel: 'Đỉnh chi ngày',
    peakValue: '550.000 ₫ (17h)',
    points: [
      { label: '08h', amount: 120000, x: 25, y: 120, showLabel: true },
      { label: '11h', amount: 350000, x: 85, y: 85, showLabel: false },
      { label: '14h', amount: 180000, x: 150, y: 110, showLabel: true },
      { label: '17h', amount: 550000, x: 215, y: 30, peak: true, showLabel: false },
      { label: '20h', amount: 250000, x: 280, y: 95, showLabel: true },
      { label: '23h', amount: 0, x: 345, y: 135, showLabel: true },
    ],
    defaultActiveIndex: 3,
    expenses: [
      {
        id: 'day-1',
        title: 'Bảo dưỡng định kỳ 2 micro UHF & thay pin sạc',
        subtitle: '17:30 • Hôm nay',
        category: 'Bảo trì thiết bị',
        icon: 'mic',
        amount: '550.000 ₫',
        status: 'Đã duyệt',
      },
      {
        id: 'day-2',
        title: 'Ăn trưa tiếp đối tác thuê loa sự kiện',
        subtitle: '11:45 • Hôm nay',
        category: 'Ăn uống & Tiếp khách',
        icon: 'restaurant',
        amount: '350.000 ₫',
        status: 'Đã duyệt',
      },
      {
        id: 'day-3',
        title: 'Đổ xăng xe máy giao loa 3 đơn Quận 1 & Bình Thạnh',
        subtitle: '08:15 • Hôm nay',
        category: 'Nhiên liệu & Xăng xe',
        icon: 'local_gas_station',
        amount: '120.000 ₫',
        status: 'Đã duyệt',
      },
    ],
  },
  'Tuần': {
    badge: '7 Ngày Qua',
    totalSpent: '6.850.000 ₫',
    trend: '-5% so với tuần trước',
    trendIcon: 'trending_down',
    remainingBudget: '16.150.000 ₫',
    budgetProgress: '72%',
    pendingCount: 2,
    avgLabel: 'Chi tiêu trung bình',
    avgValue: '978.000 ₫/ngày',
    peakLabel: 'Đỉnh chi tuần',
    peakValue: '1.850.000 ₫ (T7)',
    points: [
      { label: 'T2', amount: 650000, x: 20, y: 115, showLabel: true },
      { label: 'T3', amount: 820000, x: 75, y: 100, showLabel: false },
      { label: 'T4', amount: 540000, x: 130, y: 120, showLabel: true },
      { label: 'T5', amount: 1150000, x: 185, y: 75, showLabel: false },
      { label: 'T6', amount: 980000, x: 240, y: 90, showLabel: true },
      { label: 'T7', amount: 1850000, x: 295, y: 25, peak: true, showLabel: false },
      { label: 'CN', amount: 860000, x: 350, y: 95, showLabel: true },
    ],
    defaultActiveIndex: 5,
    expenses: [
      {
        id: 'wk-1',
        title: 'Thay củ loa Bass 40 công suất cao cho dàn tiệc',
        subtitle: 'Thứ 7 • Tuần này',
        category: 'Nâng cấp linh kiện',
        icon: 'speaker',
        amount: '1.850.000 ₫',
        status: 'Đã duyệt',
      },
      {
        id: 'wk-2',
        title: 'Mua dây cáp tín hiệu âm thanh Canon & Jack 6.5mm',
        subtitle: 'Thứ 5 • Tuần này',
        category: 'Phụ kiện',
        icon: 'cable',
        amount: '680.000 ₫',
        status: 'Chờ duyệt',
      },
      {
        id: 'wk-3',
        title: 'Tiền xăng xe & bảo dưỡng xe máy giao nhận',
        subtitle: 'Thứ 3 • Tuần này',
        category: 'Di chuyển',
        icon: 'two_wheeler',
        amount: '450.000 ₫',
        status: 'Đã duyệt',
      },
      {
        id: 'wk-4',
        title: 'Ăn uống đoàn giao loa sự kiện ngoại thành',
        subtitle: 'Thứ 2 • Tuần này',
        category: 'Ăn uống',
        icon: 'restaurant',
        amount: '320.000 ₫',
        status: 'Đã duyệt',
      },
    ],
  },
  'Tháng': {
    badge: 'Tháng Này',
    totalSpent: '21.774.250 ₫',
    trend: '+12% so với tháng trước',
    trendIcon: 'trending_up',
    remainingBudget: '15.500.000 ₫',
    budgetProgress: '61%',
    pendingCount: 3,
    avgLabel: 'Chi tiêu trung bình',
    avgValue: '5.443.500 ₫/tuần',
    peakLabel: 'Đỉnh chi tháng',
    peakValue: '7.154.250 ₫ (Tuần 4)',
    points: [
      { label: 'Tuần 1', amount: 4850000, x: 30, y: 85, showLabel: true },
      { label: 'Tuần 2', amount: 5620000, x: 135, y: 70, showLabel: true },
      { label: 'Tuần 3', amount: 4150000, x: 240, y: 100, showLabel: true },
      { label: 'Tuần 4', amount: 7154250, x: 340, y: 25, peak: true, showLabel: true },
    ],
    defaultActiveIndex: 3,
    expenses: [
      {
        id: 'mo-1',
        title: 'Thu tiền thuê loa - Anh Hoàng (Tiệc Sinh Nhật)',
        subtitle: 'Hôm nay • Gói Loa Bass 40 (800W)',
        category: 'Cho thuê loa',
        icon: 'speaker',
        amount: '450.000 ₫',
        status: 'Đã duyệt',
      },
      {
        id: 'mo-2',
        title: 'Đổ xăng xe máy giao loa - Trạm Petrolimex',
        subtitle: 'Hôm qua • Ship 4 đơn nội thành',
        category: 'Nhiên liệu',
        icon: 'local_gas_station',
        amount: '120.000 ₫',
        status: 'Đã duyệt',
      },
      {
        id: 'mo-3',
        title: 'Thu tiền thuê loa - Chị Mai (Tân Gia Q.7)',
        subtitle: '24 Th10 • Gói Loa Đôi Bass 50 (1500W)',
        category: 'Cho thuê loa',
        icon: 'volume_up',
        amount: '620.000 ₫',
        status: 'Đã duyệt',
      },
      {
        id: 'mo-4',
        title: 'Mua bổ sung 4 bình ắc quy khô 12V-14Ah cho dàn loa',
        subtitle: '18 Th10 • Kho Linh Xuân',
        category: 'Phụ tùng',
        icon: 'battery_charging_full',
        amount: '2.400.000 ₫',
        status: 'Đã duyệt',
      },
    ],
  },
};

// ─── Smooth Animated Number Component ───
function AnimatedCounter({ value, formatter = (v) => Math.round(v).toLocaleString('vi-VN'), duration = 450 }) {
  const [display, setDisplay] = useState(value);
  const prevValue = React.useRef(value);

  useEffect(() => {
    const start = typeof prevValue.current === 'number' ? prevValue.current : 0;
    const end = typeof value === 'number' ? value : 0;
    prevValue.current = value;
    if (start === end) return;

    let startTime = null;
    let animId;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // Cubic ease out curve
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      setDisplay(current);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setDisplay(end);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return <span className="tabular-nums tracking-tight">{formatter(display)}</span>;
}

export default function ExpensesView({ expenses = [], onOpenAddExpense }) {
  const [timeRange, setTimeRange] = useState('Tháng');
  const activeData = TIME_RANGE_DATA[timeRange] || TIME_RANGE_DATA['Tháng'];
  const [activePointIndex, setActivePointIndex] = useState(activeData.defaultActiveIndex);

  // Sync active point index when switching timeRange
  useEffect(() => {
    setActivePointIndex(activeData.defaultActiveIndex);
  }, [timeRange]);

  const currentExpenses =
    timeRange === 'Tháng' && expenses.length > 0
      ? expenses
      : activeData.expenses;

  // Pagination state & calculations
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [timeRange]);

  const totalItems = currentExpenses.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedExpenses = currentExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalSpentNumeric =
    timeRange === 'Tháng' && expenses.length > 0
      ? expenses.reduce((acc, e) => acc + parseVNDNumber(e.amount), 0)
      : parseVNDNumber(activeData.totalSpent);

  const budgetRemainingNumeric = parseVNDNumber(activeData.remainingBudget);

  const currentPendingCount =
    timeRange === 'Tháng' && expenses.length > 0
      ? expenses.filter((e) => e.status === 'Chờ duyệt').length || activeData.pendingCount
      : activeData.pendingCount;

  // Catmull-Rom to Cubic Bezier smooth spline (strictly passes through every point)
  const generateSmoothPath = (points) => {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(activeData.points);
  const areaPath = activeData.points.length > 0
    ? `${linePath} L ${activeData.points[activeData.points.length - 1].x} 150 L ${activeData.points[0].x} 150 Z`
    : '';

  const activePoint = activeData.points[activePointIndex] || activeData.points[0];

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
              Tổng đã chi ({timeRange.toLowerCase()})
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] lg:text-[26px]">
                account_balance_wallet
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[32px] font-black leading-tight tracking-tight truncate">
              <AnimatedCounter 
                value={totalSpentNumeric} 
                formatter={(v) => `${Math.round(v).toLocaleString('vi-VN')} ₫`} 
              />
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-bold text-xs sm:text-[13px]">
              <span className="material-symbols-outlined text-[16px]">{activeData.trendIcon}</span>
              {activeData.trend}
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
              <AnimatedCounter 
                value={budgetRemainingNumeric} 
                formatter={(v) => `${Math.round(v).toLocaleString('vi-VN')} ₫`} 
              />
            </span>
          </div>

          <div className="mt-1 w-full bg-slate-100 border border-slate-200/80 rounded-full h-2 sm:h-2.5 overflow-hidden">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-700"
              style={{ width: activeData.budgetProgress }}
            ></div>
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
              <AnimatedCounter value={currentPendingCount} />
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
            <h2 className="text-[16px] font-bold text-slate-900">
              Chi Phí Gần Đây ({activeData.badge})
            </h2>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-1 sm:gap-1.5 bg-slate-900 text-white px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl hover:bg-slate-800 transition-all shadow-xs active:scale-95 text-xs sm:text-[13px] font-bold whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[17px]">add</span>
              <span>Thêm Chi Phí</span>
            </button>
          </div>

          {/* Mobile Divided Row List (Clean divider without cramped card borders) */}
          <div className="divide-y divide-slate-100 md:hidden">
            {paginatedExpenses.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 font-medium text-sm">
                Chưa có chi phí nào được ghi nhận.
              </div>
            ) : (
              paginatedExpenses.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs shrink-0">
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
                  <div className="flex flex-col items-end shrink-0 gap-1 pl-1">
                    <span className="text-sm font-black text-slate-900 whitespace-nowrap">
                      {formatVND(item.amount)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
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
                  <th className="pb-3.5">Ngày / Giờ</th>
                  <th className="pb-3.5">Mô tả</th>
                  <th className="pb-3.5">Phân loại</th>
                  <th className="pb-3.5 text-right">Số tiền</th>
                  <th className="pb-3.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-slate-900 divide-y divide-slate-100 text-sm lg:text-base">
                {paginatedExpenses.map((item) => (
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

          {/* Modern Pagination Bar */}
          {totalItems > 0 && (
            <div className="mt-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20, 50]}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Biến Động Chi Phí Dạng Sóng (Smooth Wave Area Chart) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col justify-between border border-slate-200 shadow-[0_2px_16px_rgba(11,28,48,0.03)]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[16px] font-bold text-slate-900">
                Biến Động Chi Phí
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                {activeData.badge}
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mb-4">
              Dòng dao động chi tiêu thực tế theo {timeRange.toLowerCase()}
            </p>

            {/* Focused data indicator pill */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between mb-4">
              <div>
                <span className="text-xs sm:text-sm text-slate-600 font-bold block">
                  {timeRange === 'Ngày' ? `Mốc ${activePoint?.label}` : timeRange === 'Tuần' ? (activePoint?.label === 'CN' ? 'Chủ Nhật' : `Thứ ${activePoint?.label?.replace('T', '')}`) : activePoint?.label}
                </span>
                <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {formatVND(activePoint?.amount || 0)}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                  activePoint?.peak
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {activePoint?.peak ? 'trending_up' : 'check'}
                </span>
                <span>{activePoint?.peak ? `Cao nhất ${timeRange.toLowerCase()}` : 'Mức ổn định'}</span>
              </span>
            </div>

            {/* Smooth SVG Wave Area Chart on Tinted Premium Canvas */}
            <div className="w-full relative py-3 px-2 sm:px-3 bg-gradient-to-b from-slate-50/90 via-slate-50/40 to-slate-100/60 rounded-2xl border border-slate-200/70 select-none shadow-[inset_0_1px_4px_rgba(15,23,42,0.02)]">
              <svg className="w-full h-44 sm:h-48 overflow-visible" viewBox="0 0 370 160">
                <defs>
                  {/* Wave Area Linear Gradient with soft downward reflection */}
                  <linearGradient id="waveFillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity="0.30" />
                    <stop offset="35%" stopColor="#0f172a" stopOpacity="0.14" />
                    <stop offset="75%" stopColor="#0f172a" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.00" />
                  </linearGradient>

                  {/* Soft curve glow reflection filter */}
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#0f172a" floodOpacity="0.22" />
                  </filter>
                </defs>

                {/* Refined Horizontal Grid Lines */}
                <line x1="10" y1="30" x2="360" y2="30" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="10" y1="65" x2="360" y2="65" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="10" y1="100" x2="360" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="10" y1="135" x2="360" y2="135" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />

                {/* Area Gradient Fill Under Curve (Downward Reflection) */}
                {areaPath && <path d={areaPath} fill="url(#waveFillGradient)" />}

                {/* Active Point Vertical Crosshair Line */}
                {activePoint && (
                  <line
                    x1={activePoint.x}
                    y1={activePoint.y}
                    x2={activePoint.x}
                    y2="135"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    strokeOpacity="0.30"
                  />
                )}

                {/* Smooth Curve Stroke Line with downward glow */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#softGlow)"
                  />
                )}

                {/* Interactive Wave Data Points */}
                {activeData.points.map((pt, idx) => {
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
                        <>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="11"
                            fill="#0f172a"
                            fillOpacity="0.12"
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="7.5"
                            fill="#0f172a"
                            fillOpacity="0.22"
                          />
                        </>
                      )}

                      {/* Dot Marker (Accurately positioned on curve line) */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 5.5 : 4}
                        fill={isActive ? '#0f172a' : '#ffffff'}
                        stroke="#0f172a"
                        strokeWidth={isActive ? 2.5 : 2}
                      />

                      {/* X-axis Day/Time Label (Bolder, thicker, larger font size) */}
                      {pt.showLabel !== false && (
                        <text
                          x={pt.x}
                          y="156"
                          textAnchor="middle"
                          className={`text-[13px] sm:text-[14px] font-black transition-colors ${
                            isActive ? 'fill-slate-950 font-black' : 'fill-slate-700 font-bold group-hover:fill-slate-900'
                          }`}
                        >
                          {pt.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Quick Metrics Footer (Crisp Typography) */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <span className="text-slate-500 font-medium text-xs sm:text-sm">{activeData.avgLabel}</span>
              <span className="text-slate-900 font-black text-sm sm:text-base mt-0.5">
                {activeData.avgValue}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-500 font-medium text-xs sm:text-sm">{activeData.peakLabel}</span>
              <span className="text-slate-900 font-black text-sm sm:text-base mt-0.5">
                {activeData.peakValue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
