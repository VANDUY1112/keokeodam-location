import React, { useState } from 'react';
import { 
  Download, 
  ChevronRight, 
  DollarSign, 
  Calendar, 
  Route, 
  TrendingUp, 
  Speaker, 
  FileSpreadsheet
} from 'lucide-react';
import { RECENT_RENTAL_LOGS } from '../data/speakersData';

export default function ReportsView({ 
  speakers, 
  onSelectSpeaker, 
  setActiveTab, 
  setToast 
}) {
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d' | 'ytd'

  const weeklyRevenueData = [
    { day: 'Thứ 2', revenue: '850.000đ', amount: 850000, height: '45%' },
    { day: 'Thứ 3', revenue: '1.150.000đ', amount: 1150000, height: '60%' },
    { day: 'Thứ 4', revenue: '980.000đ', amount: 980000, height: '50%' },
    { day: 'Thứ 5', revenue: '1.420.000đ', amount: 1420000, height: '70%' },
    { day: 'Thứ 6', revenue: '2.100.000đ', amount: 2100000, height: '90%' },
    { day: 'Thứ 7', revenue: '2.850.000đ', amount: 2850000, height: '100%', highlight: true },
    { day: 'Chủ Nhật', revenue: '2.600.000đ', amount: 2600000, height: '95%', highlight: true },
  ];

  const handleExport = (format) => {
    setToast({
      title: `Đã Xuất Sổ Thu Tiền Cho Thuê Loa (${format})`,
      desc: `Báo cáo doanh thu & lịch sử ca thuê cho mốc: ${timeRange === '7d' ? '7 NGÀY QUA' : timeRange === '30d' ? '30 NGÀY QUA' : 'TỪ ĐẦU NĂM (YTD)'}.`,
      type: 'success'
    });
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[40%] -right-[15%] w-[40%] h-[60%] rounded-full bg-secondary-container/5 blur-[150px] mix-blend-screen"></div>
      </div>

      <div className="px-lg py-xl relative z-10 flex flex-col gap-lg w-full max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs font-black tracking-tight">
              Sổ Doanh Thu & Lịch Sử Thuê Loa
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Thống kê tiền cho thuê theo tiếng, phí vận chuyển và lịch sử từng ca thuê loa kẹo kéo.
            </p>
          </div>

          <div className="flex items-center gap-md">
            <div className="flex items-center bg-surface-container-high rounded-full p-xs border border-outline-variant/30">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-md py-sm rounded-full font-label-md text-label-md transition-all ${
                  timeRange === '7d' 
                    ? 'bg-primary/20 text-primary font-bold shadow' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                7 Ngày Qua
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-md py-sm rounded-full font-label-md text-label-md transition-all ${
                  timeRange === '30d' 
                    ? 'bg-primary/20 text-primary font-bold shadow' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                30 Ngày Qua
              </button>
              <button
                onClick={() => setTimeRange('ytd')}
                className={`px-md py-sm rounded-full font-label-md text-label-md transition-all ${
                  timeRange === 'ytd' 
                    ? 'bg-primary/20 text-primary font-bold shadow' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Từ Đầu Năm (YTD)
              </button>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          
          {/* Card 1: Doanh thu tuần này */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Doanh Thu Tuần Này
              </span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-primary font-mono font-black">11.95</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono font-bold">triệu đ</span>
            </div>
            <div className="mt-md flex items-center gap-xs text-primary font-medium text-[12px]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tăng 18% so với tuần trước (Cao điểm T7-CN)</span>
            </div>
          </div>

          {/* Card 2: Tổng Ca Thuê */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-secondary-container/10 flex items-center justify-center">
                <Speaker className="w-4 h-4 text-secondary" />
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Tổng Ca Cho Thuê
              </span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-on-surface font-mono font-black">38</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">ca thuê</span>
            </div>
            <div className="mt-md flex items-center gap-xs text-secondary font-medium text-[12px]">
              <span>Trung bình ~3.8 tiếng / mỗi ca</span>
            </div>
          </div>

          {/* Card 3: Quãng đường chạy ship */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
                <Route className="w-4 h-4 text-tertiary" />
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Tổng Quãng Đường Ship
              </span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-on-surface font-mono font-black">215.4</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">km</span>
            </div>
            <div className="mt-md flex items-center gap-xs text-tertiary font-medium text-[12px]">
              <span>Thu về ~920.000đ tiền ship vận chuyển</span>
            </div>
          </div>

          {/* Card 4: Giá trị trung bình ca */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Bình Quân Mỗi Ca
              </span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-on-surface font-mono font-black">314</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">nghìn đ</span>
            </div>
            <div className="mt-md flex items-center gap-xs text-on-surface-variant text-[12px]">
              <span>Bao gồm tiền giờ + ship</span>
            </div>
          </div>

        </div>

        {/* Middle Section: Weekly Revenue Bars & Speaker Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          
          {/* Doanh Thu 7 Ngày Trong Tuần */}
          <div className="lg:col-span-2 bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg flex flex-col relative">
            <div className="flex items-center justify-between mb-xl">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Doanh Thu Thu Tiền Theo Ngày</h2>
                <p className="font-label-md text-label-md text-on-surface-variant">Biểu đồ tổng tiền thu từ Thứ 2 đến Chủ Nhật (Đỉnh điểm cuối tuần)</p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[300px] relative w-full flex items-end justify-between gap-2 px-md pb-xl">
              <div className="absolute inset-0 flex flex-col justify-between pb-xl z-0 pointer-events-none">
                <div className="w-full h-[1px] bg-outline-variant/10"></div>
                <div className="w-full h-[1px] bg-outline-variant/10"></div>
                <div className="w-full h-[1px] bg-outline-variant/10"></div>
                <div className="w-full h-[1px] bg-outline-variant/10"></div>
                <div className="w-full h-[1px] bg-outline-variant/20"></div>
              </div>

              {/* Bars */}
              <div className="w-full flex justify-between items-end h-full z-10 relative">
                {weeklyRevenueData.map((item, idx) => (
                  <div
                    key={idx}
                    className={`w-12 rounded-t-sm transition-all duration-300 relative group cursor-pointer ${
                      item.highlight
                        ? 'bg-primary hover:bg-primary-fixed shadow-[0_0_15px_rgba(75,226,119,0.5)]'
                        : 'bg-primary/20 hover:bg-primary/40 border-t border-primary/50'
                    }`}
                    style={{ height: item.height }}
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-primary font-mono font-black text-[12px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-outline-variant/30 z-20">
                      {item.revenue}
                    </div>
                    {/* Day label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant font-mono whitespace-nowrap font-medium">
                      {item.day}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Loa Cho Thuê Chạy Nhất */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg flex flex-col relative overflow-hidden">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg font-bold">Loa Đắt Khách Nhất</h2>
            
            <div className="space-y-3">
              {speakers.slice(0, 4).map((spk, idx) => (
                <div
                  key={spk.id}
                  onClick={() => {
                    onSelectSpeaker(spk.id);
                    setActiveTab('device-details');
                  }}
                  className="p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/15 hover:bg-surface-bright transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[12px] ${
                      idx === 0 ? 'bg-tertiary text-surface-dim font-bold shadow' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-[13px] font-bold text-on-surface">{spk.id} - {spk.name}</div>
                      <div className="text-[11px] text-on-surface-variant font-mono">{spk.totalRentalsCount} ca thuê • {spk.hourlyRate.toLocaleString('vi-VN')}đ/h</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-black text-primary text-[14px]">
                      {(spk.totalRevenue / 1000000).toFixed(1)} tr
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Bottom Section: Lịch Sử Ca Thuê & Thu Tiền */}
        <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-lg flex items-center justify-between border-b border-outline-variant/10">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Lịch Sử Các Ca Thuê Gần Đây</h2>
              <p className="text-[12px] text-on-surface-variant font-mono mt-0.5">Lưu trữ thời gian giao/trả, số giờ hát, tiền thuê và phí ship</p>
            </div>

            <div className="flex items-center gap-sm">
              <button
                onClick={() => handleExport('CSV')}
                className="flex items-center gap-xs px-md py-sm rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-mono font-semibold"
              >
                <Download className="w-4 h-4 text-primary" />
                Xuất Excel / CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Mã Ca / Loa</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Khách Thuê</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Địa Chỉ Giao</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Số Giờ Hát</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Quãng Đường</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Tổng Tiền Thu</th>
                  <th className="p-md text-right font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="font-mono-data text-mono-data text-on-surface">
                {RECENT_RENTAL_LOGS.map((log) => (
                  <tr 
                    key={log.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors"
                  >
                    <td className="p-md">
                      <div className="font-bold text-primary">{log.speakerId}</div>
                      <div className="text-[11px] text-on-surface-variant">{log.speakerName}</div>
                    </td>

                    <td className="p-md">
                      <div className="font-semibold text-on-surface">{log.customerName}</div>
                      <div className="text-[11px] text-on-surface-variant">{log.customerPhone}</div>
                    </td>

                    <td className="p-md text-on-surface-variant text-[13px]">{log.address}</td>

                    <td className="p-md">
                      <span className="font-bold text-on-surface">{log.rentHours} tiếng</span>
                      <div className="text-[10px] text-on-surface-variant">{log.hourlyRate.toLocaleString('vi-VN')}đ/h</div>
                    </td>

                    <td className="p-md text-[13px]">
                      <span>{log.distanceKm} km</span>
                      <div className="text-[10px] text-on-surface-variant">Ship: {log.shippingFee.toLocaleString('vi-VN')}đ</div>
                    </td>

                    <td className="p-md">
                      <span className="font-bold text-primary text-[15px]">{log.totalAmount.toLocaleString('vi-VN')} đ</span>
                    </td>

                    <td className="p-md text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-bold">
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

    </div>
  );
}
