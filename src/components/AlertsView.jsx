import React, { useState } from 'react';
import { 
  Clock, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Speaker
} from 'lucide-react';

export default function AlertsView({ 
  speakers, 
  onOpenCheckinModal, 
  onSelectSpeaker, 
  setActiveTab, 
  setToast 
}) {
  const [filterType, setFilterType] = useState('all');

  const rentalAlerts = [
    {
      id: "ALT-01",
      speakerId: "LKK-04",
      speakerName: "Loa Kéo Bass 40 Dalton 600W",
      customerName: "Anh Dũng (Khai Trương Cửa Hàng)",
      customerPhone: "0933 888 999",
      severity: "critical",
      type: "time",
      title: "Khách Đã Thuê Quá 4 Tiếng (Hiện tại: 4h 40m)",
      desc: "Loa check-in giao từ lúc 10:15 sáng. Hãy gọi điện hỏi khách có nhu cầu gia hạn thêm không hoặc xếp lịch đi chở về.",
      timeFormatted: "10:15 - Hiện tại",
      action: "call"
    },
    {
      id: "ALT-02",
      speakerId: "LKK-01",
      speakerName: "Loa Kéo Bass 40 Nanomax 800W",
      customerName: "Anh Tuấn (Tiệc Sinh Nhật)",
      customerPhone: "0908 123 456",
      severity: "warning",
      type: "time",
      title: "Loa Đang Thuê 3 Tiếng 25 Phút",
      desc: "Giao lúc 11:30 tại 128 Đường Số 5 Linh Trung. Cần chú ý thời gian tiệc kết thúc để đi lấy loa.",
      timeFormatted: "11:30 - Hiện tại",
      action: "call"
    },
    {
      id: "ALT-03",
      speakerId: "LKK-06",
      speakerName: "Loa Kéo 4 Tấc Đôi Sân Khấu",
      customerName: "Bác Hùng (Đám Giỗ)",
      customerPhone: "0977 654 321",
      severity: "info",
      type: "shipping",
      title: "Loa Đang Trên Đường Chở Về Nhà",
      desc: "Shipper đang chở loa từ Quận 9 về kho Số 45 Đường Số 8. Chuẩn bị cắm sạc pin ắc quy.",
      timeFormatted: "Cách nhà 6.4 km",
      action: "return"
    },
    {
      id: "ALT-04",
      speakerId: "LKK-02",
      speakerName: "Loa Bass 50 Đôi Khủng 1200W",
      customerName: "Chị Lan (Tiệc Tất Niên)",
      customerPhone: "0912 345 678",
      severity: "warning",
      type: "night",
      title: "Nhắc Nhở Thu Hồi Loa Đêm Trước 22:00",
      desc: "Quy định khu dân cư giới hạn âm thanh sau 22:00 đêm. Chủ động liên hệ khách lúc 21:30 để thu hồi loa đúng giờ.",
      timeFormatted: "Hạn thu: 21:45",
      action: "call"
    }
  ];

  const filteredAlerts = rentalAlerts.filter(a => {
    if (filterType === 'all') return true;
    if (filterType === 'time') return a.type === 'time';
    return true;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto select-none space-y-6">
      
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-rose-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-mono text-rose-700 uppercase font-bold">Thuê Quá 4 Tiếng</div>
            <div className="text-[28px] font-black text-slate-800 font-mono mt-0.5">1 Loa</div>
            <div className="text-[11px] text-slate-500 font-medium">Cần gọi điện xác nhận gia hạn</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-mono text-amber-700 uppercase font-bold">Đang Cho Thuê</div>
            <div className="text-[28px] font-black text-slate-800 font-mono mt-0.5">3 Loa</div>
            <div className="text-[11px] text-slate-500 font-medium">Đang tính tiền trực tiếp theo giờ</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Speaker className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[12px] font-mono text-emerald-700 uppercase font-bold">Có Sẵn Tại Nhà</div>
            <div className="text-[28px] font-black text-emerald-600 font-mono mt-0.5">2 Loa</div>
            <div className="text-[11px] text-slate-500 font-medium">Pin 100%, sẵn sàng giao ngay</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-500 uppercase mr-2 font-mono">Phân Loại:</span>
          
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              filterType === 'all'
                ? 'bg-ocean-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất Cả Cảnh Báo ({rentalAlerts.length})
          </button>

          <button
            onClick={() => setFilterType('time')}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              filterType === 'time'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Thời Gian Thuê Dài
          </button>
        </div>

        <div className="text-[12px] font-medium text-slate-500">
          Giới nghiêm âm thanh khu dân cư: <strong className="text-amber-700">22:00 Đêm</strong>
        </div>
      </div>

      {/* Alert Cards Stream */}
      <div className="space-y-3">
        {filteredAlerts.map((alt) => {
          const isCritical = alt.severity === 'critical';
          const isWarning = alt.severity === 'warning';

          return (
            <div
              key={alt.id}
              className={`p-5 rounded-2xl border transition-all bg-white shadow-xs ${
                isCritical
                  ? 'border-rose-300 hover:border-rose-400'
                  : isWarning
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCritical
                      ? 'bg-rose-50 text-rose-600'
                      : isWarning
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-ocean-50 text-ocean-600'
                  }`}>
                    {isCritical ? <AlertTriangle className="w-5 h-5 animate-pulse" /> : <Clock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-bold text-[15px] text-ocean-800">{alt.speakerId}</span>
                      <span className="text-[13px] text-slate-500 font-medium">({alt.speakerName})</span>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isWarning
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isCritical ? 'Khẩn Cấp' : isWarning ? 'Cần Chú Ý' : 'Thông Tin'}
                      </span>
                    </div>

                    <h3 className="text-[15px] font-bold text-slate-800 mt-1">{alt.title}</h3>
                    <p className="text-[13px] text-slate-600 mt-0.5">{alt.desc}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-[12px] text-slate-500">
                      <span>Khách: <strong className="text-slate-800">{alt.customerName}</strong></span>
                      <span>SĐT: <strong className="text-ocean-700 font-mono">{alt.customerPhone}</strong></span>
                      <span>Thời gian: <strong className="text-slate-800">{alt.timeFormatted}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`tel:${alt.customerPhone}`}
                    className="px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-[12px] flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi Khách Ngay</span>
                  </a>

                  <button
                    onClick={() => onOpenCheckinModal('return', alt.speakerId)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12px] flex items-center gap-1.5 transition-all border border-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Loa Đã Về</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
