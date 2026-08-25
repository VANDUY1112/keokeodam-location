import React, { useState, useEffect } from 'react';
import { 
  Download, 
  DollarSign, 
  Calendar, 
  Milestone, 
  TrendingUp, 
  Speaker,
  BarChart3,
  PieChart,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { formatVND } from '../utils/format';
import { api } from '../services/api.js';

// ─── Smooth Animated Number Component ───
function AnimatedCounter({ value, formatter = (v) => Math.round(v).toLocaleString('vi-VN'), duration = 450 }) {
  const [display, setDisplay] = useState(value);
  const prevValue = React.useRef(value);

  React.useEffect(() => {
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

export default function ReportsView({ 
  speakers = [], 
  onSelectSpeaker, 
  setActiveTab, 
  setToast 
}) {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [activeChartIdx, setActiveChartIdx] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Backend API report state & rentals
  const [apiReportData, setApiReportData] = useState(null);
  const [realRentals, setRealRentals] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Fetch reports and rentals from backend API
  useEffect(() => {
    const fetchReportAndRentals = async () => {
      setIsLoadingApi(true);
      try {
        const [repRes, rentRes] = await Promise.allSettled([
          api.getReportsSummary(timeRange),
          api.getRentals()
        ]);

        if (repRes.status === 'fulfilled' && repRes.value?.data) {
          setApiReportData(repRes.value.data);
        }
        if (rentRes.status === 'fulfilled' && Array.isArray(rentRes.value?.data)) {
          setRealRentals(rentRes.value.data.map(r => ({
            id: r.id,
            speakerId: r.speakerId || 'LKK-01',
            speakerName: r.speakerName || 'Loa Kéo',
            customerName: r.customerName || 'Khách hàng',
            address: r.address || '',
            date: r.startTime ? new Date(r.startTime).toLocaleDateString('vi-VN') : 'Hôm nay',
            durationHours: r.durationHours || 4,
            revenue: r.totalAmount || 0,
            status: r.status === 'active' ? 'Đang thuê' : 'Hoàn thành'
          })));
        }
      } catch (err) {
        console.warn('Reports API fetch error:', err.message);
      } finally {
        setIsLoadingApi(false);
      }
    };
    fetchReportAndRentals();
  }, [timeRange]);

  const currentData = {
    label: timeRange === '7d' ? '7 Ngày Qua' : timeRange === '30d' ? '30 Ngày Qua' : 'Năm Nay (YTD)',
    revenue: apiReportData?.summary?.totalRevenue || 0,
    growth: '+15% so với kỳ trước',
    rentalsCount: apiReportData?.summary?.totalRentals || realRentals.length,
    avgHours: apiReportData?.summary?.avgDurationHours ? `${apiReportData.summary.avgDurationHours}h / ca` : '4.0h / ca',
    distanceKm: apiReportData?.summary?.distanceKm || 0,
    shippingIncome: apiReportData?.summary?.shippingIncome || 0,
    avgPerRental: apiReportData?.summary?.avgPerRental || 0,
    peakDay: 'Cuối tuần',
    chartData: (apiReportData?.chartData && apiReportData.chartData.length > 0)
      ? apiReportData.chartData
      : [
          { label: 'T2', name: 'Thứ 2', revenue: 0, orders: 0, height: '10%' },
          { label: 'T3', name: 'Thứ 3', revenue: 0, orders: 0, height: '10%' },
          { label: 'T4', name: 'Thứ 4', revenue: 0, orders: 0, height: '10%' },
          { label: 'T5', name: 'Thứ 5', revenue: 0, orders: 0, height: '10%' },
          { label: 'T6', name: 'Thứ 6', revenue: 0, orders: 0, height: '10%' },
          { label: 'T7', name: 'Thứ 7', revenue: 0, orders: 0, height: '10%' },
          { label: 'CN', name: 'Chủ Nhật', revenue: 0, orders: 0, height: '10%' },
        ]
  };

  const currentCategoryShare = apiReportData?.categoryShare || [];

  const handleExport = (format) => {
    if (setToast) {
      setToast({
        title: `Đã Xuất Báo Cáo (${format})`,
        desc: `Báo cáo doanh thu & lịch sử ca thuê mốc ${currentData.label} đã được tải về.`,
        type: 'success'
      });
    }
  };

  const filteredLogs = realRentals.filter(
    (log) =>
      (log.speakerId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.speakerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full gap-5 sm:gap-6 lg:gap-8 pb-24 lg:pb-8">
      {/* ══════════ TOP HEADER & TIMEFRAME SELECTOR ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Báo Cáo & Thống Kê Kinh Doanh
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
            Tổng hợp doanh thu, ca thuê loa, đo đạc quãng đường giao nhận và hiệu suất thiết bị
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Time range pill selector */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-2xl p-1 shadow-xs">
            {[
              { id: '7d', label: '7 Ngày Qua' },
              { id: '30d', label: '30 Ngày Qua' },
              { id: 'ytd', label: 'Năm Nay (YTD)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setTimeRange(tab.id);
                  setActiveChartIdx(null);
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 text-xs sm:text-sm font-bold ${
                  timeRange === tab.id
                    ? 'bg-white text-slate-900 shadow-sm scale-102'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export Action */}
          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all shadow-xs active:scale-95 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* ══════════ 4 TOP KPI CARDS (CLEAN MONOCHROME SLATE + ANIMATED COUNTER) ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6 w-full">
        {/* Card 1: Total Revenue */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[140px] sm:min-h-[160px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base leading-tight">
              Tổng doanh thu
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[28px] font-black leading-tight tracking-tight truncate block">
              <AnimatedCounter 
                value={currentData.revenue} 
                formatter={(v) => `${Math.round(v).toLocaleString('vi-VN')} ₫`} 
              />
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] sm:text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              {currentData.growth}
            </span>
          </div>
        </div>

        {/* Card 2: Total Rental Shifts */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[140px] sm:min-h-[160px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base leading-tight">
              Tổng ca cho thuê
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <Speaker className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[28px] font-black leading-tight tracking-tight">
              <AnimatedCounter value={currentData.rentalsCount} />
            </span>
            <span className="text-slate-500 font-bold text-xs sm:text-sm">ca thuê</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] sm:text-xs">
              <span>{currentData.avgHours}</span>
            </span>
          </div>
        </div>

        {/* Card 3: Total Delivery Km */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[140px] sm:min-h-[160px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base leading-tight">
              Quãng đường ship
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <Milestone className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[28px] font-black leading-tight tracking-tight">
              <AnimatedCounter 
                value={currentData.distanceKm} 
                formatter={(v) => v.toFixed(1)} 
              />
            </span>
            <span className="text-slate-500 font-bold text-xs sm:text-sm">km</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] sm:text-xs truncate">
              Thu ship: <AnimatedCounter value={currentData.shippingIncome} formatter={(v) => `${Math.round(v).toLocaleString('vi-VN')} ₫`} />
            </span>
          </div>
        </div>

        {/* Card 4: Average per Rental */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] hover:border-slate-300 transition-all min-h-[140px] sm:min-h-[160px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-900 font-bold text-sm sm:text-base leading-tight">
              Bình quân mỗi ca
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="my-1">
            <span className="font-display text-slate-900 text-xl sm:text-2xl lg:text-[28px] font-black leading-tight tracking-tight truncate block">
              <AnimatedCounter 
                value={currentData.avgPerRental} 
                formatter={(v) => `${Math.round(v).toLocaleString('vi-VN')} ₫`} 
              />
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] sm:text-xs">
              Tiền giờ + tiền ship
            </span>
          </div>
        </div>
      </div>

      {/* ══════════ SECTION: CHARTS ROW ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left 2 Cols: Main Bar / Wave Chart (Revenue & Orders) */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_16px_rgba(11,28,48,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Biểu Đồ Doanh Thu & Ca Thuê
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {currentData.label}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Phân bổ dòng tiền và mật độ bàn giao thiết bị
                </p>
              </div>

              {/* Metric Toggle */}
              <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 self-start sm:self-auto">
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    chartMetric === 'revenue'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Doanh Thu (VNĐ)
                </button>
                <button
                  onClick={() => setChartMetric('orders')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    chartMetric === 'orders'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Số Ca Thuê
                </button>
              </div>
            </div>

            {/* Focused Item summary pill */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between mb-6">
              <div>
                <span className="text-xs text-slate-500 font-bold block">
                  {activeChartIdx !== null 
                    ? currentData.chartData[activeChartIdx]?.name 
                    : `Đỉnh cao nhất: ${currentData.peakDay}`}
                </span>
                <span className="text-base sm:text-xl font-black text-slate-900">
                  {activeChartIdx !== null
                    ? (chartMetric === 'revenue' 
                        ? formatVND(currentData.chartData[activeChartIdx]?.revenue) 
                        : `${currentData.chartData[activeChartIdx]?.orders} ca thuê`)
                    : formatVND(currentData.revenue)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block">Tỷ trọng</span>
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  {activeChartIdx !== null
                    ? `${((currentData.chartData[activeChartIdx]?.revenue / currentData.revenue) * 100).toFixed(0)}% tổng kỳ`
                    : '100%'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Modern Bar Chart Area */}
          <div className="min-h-[220px] sm:min-h-[260px] relative w-full flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 pb-6 pt-2">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none z-0">
              <div className="w-full h-px bg-slate-100"></div>
              <div className="w-full h-px bg-slate-100"></div>
              <div className="w-full h-px bg-slate-100"></div>
              <div className="w-full h-px bg-slate-200"></div>
            </div>

            {/* Bars */}
            <div className="w-full flex justify-between items-end h-full z-10 relative gap-2 sm:gap-3">
              {currentData.chartData.map((item, idx) => {
                const isSelected = activeChartIdx === idx;
                const isPeak = item.peak;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveChartIdx(idx)}
                    onMouseLeave={() => setActiveChartIdx(null)}
                    onClick={() => setActiveChartIdx(idx)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Bar Pill */}
                    <div className="w-full max-w-[48px] flex flex-col justify-end items-center h-full">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-300 relative ${
                          isSelected
                            ? 'bg-slate-900 shadow-md scale-105'
                            : isPeak
                            ? 'bg-slate-800 group-hover:bg-slate-900'
                            : 'bg-slate-200 group-hover:bg-slate-300'
                        }`}
                        style={{ height: item.height }}
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-bold text-[10px] sm:text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-30 pointer-events-none">
                          {chartMetric === 'revenue' ? formatVND(item.revenue) : `${item.orders} ca`}
                        </div>
                      </div>
                    </div>

                    {/* X-axis Label */}
                    <span className={`text-[11px] sm:text-xs font-bold mt-2 transition-colors ${
                      isSelected || isPeak ? 'text-slate-900 font-extrabold' : 'text-slate-500'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Speaker Category Share & Top Performers */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_16px_rgba(11,28,48,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tỷ Trọng Doanh Thu
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                Phân loại loa
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-5">
              Cơ cấu đóng góp doanh thu theo dòng công suất
            </p>

            {/* Category Progress Bars */}
            <div className="space-y-4">
              {currentCategoryShare.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-semibold">
                  Chưa có dữ liệu cơ cấu thiết bị
                </div>
              ) : (
                currentCategoryShare.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-slate-800 truncate pr-2">{cat.name}</span>
                      <span className="font-black text-slate-900 shrink-0">{cat.percent}%</span>
                    </div>
                    {/* Progress track */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0
                            ? 'bg-slate-900'
                            : idx === 1
                            ? 'bg-slate-700'
                            : idx === 2
                            ? 'bg-slate-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${cat.percent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{cat.count} ca thuê</span>
                      <span className="font-medium">{formatVND(cat.revenue)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Rank Highlight */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Top Loa Đắt Khách Nhất
            </span>
            <div className="space-y-2">
              {speakers.slice(0, 3).map((spk, idx) => (
                <div
                  key={spk.id}
                  onClick={() => {
                    if (onSelectSpeaker) onSelectSpeaker(spk.id);
                    if (setActiveTab) setActiveTab('device-details');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      idx === 0 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {spk.id} • {spk.name}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500">
                        {spk.totalRentalsCount} ca • {formatVND(spk.hourlyRate)}/h
                      </div>
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm font-black text-slate-900 shrink-0">
                    {(spk.totalRevenue / 1000000).toFixed(1)} tr
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ SECTION: DETAILED RENTAL HISTORY TABLE ══════════ */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-[0_2px_16px_rgba(11,28,48,0.03)] overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Lịch Sử Các Ca Thuê Gần Đây
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Lưu trữ thời gian giao/trả, số giờ hát, tiền thuê và phí vận chuyển
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Tìm mã ca, khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-56"
              />
              <span className="material-symbols-outlined absolute left-2 top-2 text-slate-400 text-[16px]">
                search
              </span>
            </div>

            <button
              onClick={() => handleExport('CSV')}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              title="Xuất Excel"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất</span>
            </button>
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900">{log.speakerId}</span>
                  <span className="text-xs text-slate-500 ml-1.5">• {log.speakerName}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                  Đã về kho
                </span>
              </div>

              <div className="text-xs text-slate-700">
                <span className="font-bold">{log.customerName}</span> ({log.customerPhone})
                <div className="text-slate-500 text-[11px] truncate mt-0.5">{log.address}</div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="text-slate-500">
                  <span>{log.rentHours}h • {log.distanceKm} km</span>
                </div>
                <div className="font-black text-slate-900 text-sm">
                  {formatVND(log.totalAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Mã Ca / Loa</th>
                <th className="py-3.5 px-4">Khách Thuê</th>
                <th className="py-3.5 px-4">Địa Chỉ Giao</th>
                <th className="py-3.5 px-4">Thời Lượng</th>
                <th className="py-3.5 px-4">Quãng Đường</th>
                <th className="py-3.5 px-4 text-right">Tổng Tiền</th>
                <th className="py-3.5 px-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{log.speakerId}</div>
                    <div className="text-xs text-slate-500">{log.speakerName}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{log.customerName}</div>
                    <div className="text-xs text-slate-500 font-mono">{log.customerPhone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-[220px] truncate">
                    {log.address}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{log.rentHours} tiếng</span>
                    <div className="text-xs text-slate-500">{formatVND(log.hourlyRate)}/h</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{log.distanceKm} km</span>
                    <div className="text-xs text-slate-500">Ship: {formatVND(log.shippingFee)}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-black text-slate-900 text-sm sm:text-base">
                      {formatVND(log.totalAmount)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs">
                      Đã Về Kho
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

