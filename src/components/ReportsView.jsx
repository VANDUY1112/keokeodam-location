import React, { useState } from 'react';
import { 
  Download, 
  DollarSign, 
  Calendar, 
  Route, 
  TrendingUp, 
  Speaker
} from 'lucide-react';
import { RECENT_RENTAL_LOGS } from '../data/speakersData';

export default function ReportsView({ 
  speakers, 
  onSelectSpeaker, 
  setActiveTab, 
  setToast 
}) {
  const [timeRange, setTimeRange] = useState('7d');

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
    <div className="flex flex-col w-full relative min-h-screen select-none p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] text-slate-900 font-black tracking-tight">
            Sổ Doanh Thu & Lịch Sử Thuê Loa
          </h1>
          <p className="text-[13px] text-slate-500 max-w-2xl mt-0.5">
            Thống kê tiền cho thuê theo tiếng, phí vận chuyển và lịch sử từng ca thuê loa kẹo kéo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                timeRange === '7d' 
                  ? 'bg-white text-ocean-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Ngày Qua
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                timeRange === '30d' 
                  ? 'bg-white text-ocean-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Ngày Qua
            </button>
            <button
              onClick={() => setTimeRange('ytd')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                timeRange === 'ytd' 
                  ? 'bg-white text-ocean-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Từ Đầu Năm (YTD)
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Doanh Thu Tuần Này
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-black text-ocean-700 font-mono">11.95</span>
            <span className="text-[14px] text-slate-600 font-bold font-mono">triệu đ</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-emerald-600 font-semibold text-[12px]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tăng 18% so với tuần trước</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Speaker className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Tổng Ca Cho Thuê
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-black text-slate-800 font-mono">38</span>
            <span className="text-[14px] text-slate-600 font-bold font-mono">ca thuê</span>
          </div>
          <div className="mt-2 text-slate-500 text-[12px]">
            <span>Trung bình ~3.8 tiếng / mỗi ca</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Route className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Tổng Quãng Đường Ship
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-black text-slate-800 font-mono">215.4</span>
            <span className="text-[14px] text-slate-600 font-bold font-mono">km</span>
          </div>
          <div className="mt-2 text-amber-700 text-[12px] font-medium">
            <span>Thu về ~920.000đ tiền ship</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Bình Quân Mỗi Ca
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-black text-emerald-600 font-mono">314</span>
            <span className="text-[14px] text-slate-600 font-bold font-mono">nghìn đ</span>
          </div>
          <div className="mt-2 text-slate-500 text-[12px]">
            <span>Bao gồm tiền giờ + ship</span>
          </div>
        </div>

      </div>

      {/* Middle Section: Weekly Revenue Bars & Speaker Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Doanh Thu 7 Ngày Trong Tuần */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[16px] font-bold text-slate-800">Doanh Thu Thu Tiền Theo Ngày</h2>
              <p className="text-[12px] text-slate-500">Biểu đồ tổng tiền thu từ Thứ 2 đến Chủ Nhật</p>
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex-1 min-h-[260px] relative w-full flex items-end justify-between gap-3 px-4 pb-8">
            <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0 pointer-events-none">
              <div className="w-full h-[1px] bg-slate-100"></div>
              <div className="w-full h-[1px] bg-slate-100"></div>
              <div className="w-full h-[1px] bg-slate-100"></div>
              <div className="w-full h-[1px] bg-slate-100"></div>
              <div className="w-full h-[1px] bg-slate-200"></div>
            </div>

            {/* Bars */}
            <div className="w-full flex justify-between items-end h-full z-10 relative">
              {weeklyRevenueData.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-12 rounded-t-md transition-all duration-200 relative group cursor-pointer ${
                    item.highlight
                      ? 'bg-ocean-600 hover:bg-ocean-700 shadow-md shadow-ocean-600/20'
                      : 'bg-ocean-100 hover:bg-ocean-200'
                  }`}
                  style={{ height: item.height }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-mono font-bold text-[11px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                    {item.revenue}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-slate-600 font-semibold whitespace-nowrap">
                    {item.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Loa Cho Thuê Chạy Nhất */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <h2 className="text-[16px] font-bold text-slate-800 mb-4">Loa Đắt Khách Nhất</h2>
          
          <div className="space-y-2.5">
            {speakers.slice(0, 4).map((spk, idx) => (
              <div
                key={spk.id}
                onClick={() => {
                  onSelectSpeaker(spk.id);
                  setActiveTab('device-details');
                }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-ocean-50/50 hover:border-ocean-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] ${
                    idx === 0 ? 'bg-ocean-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">{spk.id} - {spk.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{spk.totalRentalsCount} ca thuê • {spk.hourlyRate.toLocaleString('vi-VN')}đ/h</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-ocean-700 text-[13px]">
                    {(spk.totalRevenue / 1000000).toFixed(1)} tr
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Bottom Section: Lịch Sử Ca Thuê */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-[16px] font-bold text-slate-800">Lịch Sử Các Ca Thuê Gần Đây</h2>
            <p className="text-[12px] text-slate-500 font-mono mt-0.5">Lưu trữ thời gian giao/trả, số giờ hát, tiền thuê và phí ship</p>
          </div>

          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] transition-colors border border-slate-200"
          >
            <Download className="w-4 h-4 text-ocean-600" />
            <span>Xuất Excel / CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold">
                <th className="p-3.5">Mã Ca / Loa</th>
                <th className="p-3.5">Khách Thuê</th>
                <th className="p-3.5">Địa Chỉ Giao</th>
                <th className="p-3.5">Số Giờ Hát</th>
                <th className="p-3.5">Quãng Đường</th>
                <th className="p-3.5">Tổng Tiền Thu</th>
                <th className="p-3.5 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {RECENT_RENTAL_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-ocean-800 font-mono">{log.speakerId}</div>
                    <div className="text-[11px] text-slate-500">{log.speakerName}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">{log.customerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{log.customerPhone}</div>
                  </td>

                  <td className="p-3.5 text-slate-600">{log.address}</td>

                  <td className="p-3.5">
                    <span className="font-bold text-slate-800">{log.rentHours} tiếng</span>
                    <div className="text-[10px] text-slate-500">{log.hourlyRate.toLocaleString('vi-VN')}đ/h</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <span>{log.distanceKm} km</span>
                    <div className="text-[10px] text-slate-500">Ship: {log.shippingFee.toLocaleString('vi-VN')}đ</div>
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-ocean-700 font-mono text-[14px]">{log.totalAmount.toLocaleString('vi-VN')} đ</span>
                  </td>

                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
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
