import React, { useState } from 'react';
import { 
  Download, 
  ChevronRight 
} from 'lucide-react';

export default function ReportsView({ fleet, stats, onSelectUnit, setActiveTab, setToast }) {
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d' | 'ytd'

  const weeklyData = [
    { day: 'Thứ 2', km: '4,500 km', height: '45%', highlight: false },
    { day: 'Thứ 3', km: '6,000 km', height: '60%', highlight: false },
    { day: 'Thứ 4', km: '8,500 km', height: '85%', highlight: false },
    { day: 'Thứ 5', km: '5,500 km', height: '55%', highlight: false },
    { day: 'Thứ 6', km: '9,500 km', height: '95%', highlight: true },
    { day: 'Thứ 7', km: '3,000 km', height: '30%', highlight: false },
    { day: 'Chủ Nhật', km: '2,000 km', height: '20%', highlight: false },
  ];

  const telemetryLogs = [
    {
      id: 'TRK-8902',
      status: 'Đang chạy',
      statusType: 'moving',
      location: '41.8781° B, 87.6298° T',
      fuel: 85,
      fuelColor: 'bg-primary',
      engineHrs: '1,204 giờ'
    },
    {
      id: 'TRK-8903',
      status: 'Tạm dừng',
      statusType: 'idle',
      location: '34.0522° B, 118.2437° T',
      fuel: 42,
      fuelColor: 'bg-secondary-container',
      engineHrs: '982 giờ'
    },
    {
      id: 'TRK-8904',
      status: 'Cảnh báo',
      statusType: 'alert',
      location: '39.7392° B, 104.9903° T',
      fuel: 12,
      fuelColor: 'bg-error',
      engineHrs: '2,105 giờ'
    },
    {
      id: 'TRK-102',
      status: 'Đang chạy',
      statusType: 'moving',
      location: '35.0110° B, 115.4734° T',
      fuel: 60,
      fuelColor: 'bg-primary',
      engineHrs: '1,540 giờ'
    },
    {
      id: 'TRK-084',
      status: 'Tạm dừng',
      statusType: 'idle',
      location: '41.5284° B, 87.8921° T',
      fuel: 48,
      fuelColor: 'bg-secondary-container',
      engineHrs: '890 giờ'
    }
  ];

  const handleExport = (format) => {
    setToast({
      title: `Đã Xuất Báo Cáo Viễn Thông (${format})`,
      desc: `Tài liệu phân tích hiệu suất đội xe cho mốc thời gian: ${timeRange === '7d' ? '7 NGÀY QUA' : timeRange === '30d' ? '30 NGÀY QUA' : 'TỪ ĐẦU NĂM (YTD)'}.`,
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
              Phân Tích & Báo Cáo Đội Xe
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Chỉ số hiệu suất thời gian thực và lịch sử dữ liệu viễn thông.
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
                7 Ngày
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-md py-sm rounded-full font-label-md text-label-md transition-all ${
                  timeRange === '30d' 
                    ? 'bg-primary/20 text-primary font-bold shadow' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                30 Ngày
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
          
          {/* Card 1: Avg Fuel Cons */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px] text-primary">local_gas_station</span>
            </div>
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-primary">speed</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Tiêu Hao Nhiên Liệu TB
              </span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-on-surface font-mono font-black">14.2</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">L/100km</span>
            </div>
            <div className="mt-md flex items-center gap-xs text-primary font-medium">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              <span className="font-label-sm text-label-sm">2.4% so với tuần trước</span>
            </div>
          </div>

          {/* Card 2: Total Hours */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px] text-primary">schedule</span>
            </div>
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-primary">timer</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Tổng Giờ Hoạt Động
              </span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-on-surface font-mono font-black">3,492</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">giờ</span>
            </div>
            <div className="mt-md flex items-center gap-xs text-primary font-medium">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span className="font-label-sm text-label-sm">5.1% so với tuần trước</span>
            </div>
          </div>

          {/* Card 3: Active Alerts */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px] text-tertiary">warning</span>
            </div>
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-tertiary">engineering</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Cảnh Báo Đang Mở
              </span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-on-surface font-mono font-black">12</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">xe</span>
            </div>
            <div className="mt-md flex items-center gap-xs text-error font-medium">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span className="font-label-sm text-label-sm font-bold">3 khẩn cấp</span>
            </div>
          </div>

          {/* Card 4: Total Distance */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[64px] text-secondary-container">route</span>
            </div>
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-8 h-8 rounded-full bg-secondary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-secondary-container">map</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Tổng Quãng Đường
              </span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-lg text-headline-lg text-on-surface font-mono font-black">128.4</span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">nghìn km</span>
            </div>
            <div className="mt-md flex items-center gap-xs text-on-surface-variant">
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary-container w-[75%] rounded-full"></div>
              </div>
              <span className="font-label-sm text-label-sm whitespace-nowrap font-mono font-medium">75% chỉ tiêu</span>
            </div>
          </div>

        </div>

        {/* Middle Section: Distance Covered & Fleet Utilization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          
          {/* Distance Covered (Weekly Breakdown) */}
          <div className="lg:col-span-2 bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg flex flex-col relative">
            <div className="flex items-center justify-between mb-xl">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Quãng Đường Hoàn Thành</h2>
                <p className="font-label-md text-label-md text-on-surface-variant">Phân rã theo ngày trong tuần của từng nhóm xe</p>
              </div>
              <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
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
                {weeklyData.map((item, idx) => (
                  <div
                    key={idx}
                    className={`w-12 rounded-t-sm transition-all duration-300 relative group cursor-pointer ${
                      item.highlight
                        ? 'bg-primary hover:bg-primary-fixed shadow-[0_0_15px_rgba(75,226,119,0.4)]'
                        : 'bg-primary/20 hover:bg-primary/40 border-t border-primary/50'
                    }`}
                    style={{ height: item.height }}
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface font-mono-data text-mono-data px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-outline-variant/20 z-20 font-bold">
                      {item.km}
                    </div>
                    {/* Day label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant font-mono whitespace-nowrap">
                      {item.day}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fleet Utilization (Donut Chart) */}
          <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg flex flex-col relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg font-bold">Tỷ Lệ Sử Dụng Đội Xe</h2>
            
            <div className="flex-1 flex items-center justify-center relative my-xl">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-highest"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                <circle
                  className="text-primary transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(75,226,119,0.5)]"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8"
                  strokeLinecap="round"
                  strokeWidth="8"
                ></circle>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display-lg text-display-lg text-on-surface font-mono font-black">75%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest font-mono">Đang Chạy</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-sm mt-auto">
              <div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="font-label-md text-label-md text-on-surface font-medium">Đang di chuyển</span>
                </div>
                <span className="font-mono-data text-mono-data text-on-surface font-bold">142</span>
              </div>

              <div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-sm">
                  <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                  <span className="font-label-md text-label-md text-on-surface font-medium">Bảo dưỡng</span>
                </div>
                <span className="font-mono-data text-mono-data text-on-surface font-bold">18</span>
              </div>

              <div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-sm">
                  <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
                  <span className="font-label-md text-label-md text-on-surface font-medium">Tạm nghỉ / Đỗ</span>
                </div>
                <span className="font-mono-data text-mono-data text-on-surface font-bold">29</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section: Vehicle Telemetry Log Table */}
        <div className="bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-lg flex items-center justify-between border-b border-outline-variant/10">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Nhật Ký Viễn Thông Phương Tiện</h2>
            <div className="flex items-center gap-sm">
              <button
                onClick={() => handleExport('CSV')}
                className="flex items-center gap-xs px-md py-sm rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-mono font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Xuất CSV
              </button>
              <button
                onClick={() => handleExport('PDF')}
                className="flex items-center gap-xs px-md py-sm rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-mono font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                Xuất PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Mã Phương Tiện</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Trạng Thái</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Vị Trí Hiện Tại</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Mức Nhiên Liệu</th>
                  <th className="p-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Giờ Động Cơ</th>
                  <th className="p-md text-right font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="font-mono-data text-mono-data text-on-surface">
                {telemetryLogs.map((row) => (
                  <tr 
                    key={row.id}
                    onClick={() => {
                      if (onSelectUnit) onSelectUnit(row.id);
                      if (setActiveTab) setActiveTab('device-details');
                    }}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors group cursor-pointer"
                  >
                    <td className="p-md flex items-center gap-sm">
                      <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">local_shipping</span>
                      </div>
                      <span className="font-bold text-on-surface group-hover:text-primary transition-colors">{row.id}</span>
                    </td>
                    
                    <td className="p-md">
                      {row.statusType === 'moving' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold border border-primary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Đang chạy
                        </span>
                      )}
                      {row.statusType === 'idle' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span> Tạm dừng
                        </span>
                      )}
                      {row.statusType === 'alert' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error/10 text-error font-label-sm text-label-sm font-semibold border border-error/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> Cảnh báo
                        </span>
                      )}
                    </td>

                    <td className="p-md text-on-surface-variant text-[13px]">{row.location}</td>

                    <td className="p-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${row.fuelColor}`} 
                            style={{ width: `${row.fuel}%` }}
                          ></div>
                        </div>
                        <span className={`${row.statusType === 'alert' ? 'text-error font-bold' : ''}`}>{row.fuel}%</span>
                      </div>
                    </td>

                    <td className="p-md text-[13px]">{row.engineHrs}</td>

                    <td className="p-md text-right">
                      <button className="text-primary hover:text-primary-fixed transition-colors opacity-0 group-hover:opacity-100 p-1">
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
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
