import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Clock, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Speaker, 
  BatteryWarning, 
  Moon,
  Truck
} from 'lucide-react';

export default function AlertsView({ 
  speakers, 
  onOpenCheckinModal, 
  onSelectSpeaker, 
  setActiveTab, 
  setToast 
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'time' | 'battery'

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
    if (filterType === 'battery') return a.type === 'battery';
    return true;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto select-none space-y-6">
      
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-surface-container/80 backdrop-blur-xl border border-error/30 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[12px] font-mono text-error uppercase font-bold">Thuê Quá 4 Tiếng</div>
            <div className="text-[28px] font-black text-on-surface font-mono mt-0.5">1 Loa</div>
            <div className="text-[11px] text-on-surface-variant font-medium">Cần gọi điện xác nhận gia hạn</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-error/15 flex items-center justify-center text-error">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-surface-container/80 backdrop-blur-xl border border-tertiary/30 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[12px] font-mono text-tertiary uppercase font-bold">Đang Cho Thuê</div>
            <div className="text-[28px] font-black text-on-surface font-mono mt-0.5">3 Loa</div>
            <div className="text-[11px] text-on-surface-variant font-medium">Đang tính tiền trực tiếp theo giờ</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-tertiary/15 flex items-center justify-center text-tertiary">
            <Speaker className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface-container/80 backdrop-blur-xl border border-primary/30 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[12px] font-mono text-primary uppercase font-bold">Có Sẵn Tại Nhà</div>
            <div className="text-[28px] font-black text-primary font-mono mt-0.5">2 Loa</div>
            <div className="text-[11px] text-on-surface-variant font-medium">Pin 100%, sẵn sàng giao ngay</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-primary">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container/70 border border-outline-variant/20 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-mono text-on-surface-variant uppercase mr-2 font-bold">Phân Loại:</span>
          
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              filterType === 'all'
                ? 'bg-primary text-surface-dim shadow-md'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-bright'
            }`}
          >
            Tất Cả Cảnh Báo ({rentalAlerts.length})
          </button>

          <button
            onClick={() => setFilterType('time')}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              filterType === 'time'
                ? 'bg-tertiary text-surface-dim shadow-md'
                : 'bg-surface-container-high text-tertiary hover:bg-surface-bright'
            }`}
          >
            Thời Gian Thuê Dài
          </button>
        </div>

        <div className="text-[12px] font-mono text-on-surface-variant">
          Giờ giới nghiêm âm thanh khu dân cư: <strong className="text-tertiary">22:00 Đêm</strong>
        </div>
      </div>

      {/* Alert Cards Stream */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alt) => {
          const isCritical = alt.severity === 'critical';
          const isWarning = alt.severity === 'warning';

          return (
            <div
              key={alt.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCritical
                  ? 'bg-surface-container-high/90 border-error/50 shadow-[0_0_20px_rgba(255,180,171,0.15)] ring-1 ring-error/30'
                  : isWarning
                  ? 'bg-surface-container/80 border-tertiary/40'
                  : 'bg-surface-container/80 border-outline-variant/20'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    isCritical
                      ? 'bg-error/20 text-error'
                      : isWarning
                      ? 'bg-tertiary/20 text-tertiary'
                      : 'bg-secondary-container/20 text-secondary'
                  }`}>
                    {isCritical ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <Clock className="w-6 h-6" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-bold text-[15px] text-primary">{alt.speakerId}</span>
                      <span className="text-[13px] text-on-surface-variant font-medium">({alt.speakerName})</span>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold ${
                        isCritical
                          ? 'bg-error text-surface-dim'
                          : isWarning
                          ? 'bg-tertiary text-surface-dim'
                          : 'bg-secondary/20 text-secondary'
                      }`}>
                        {isCritical ? 'Khẩn Cấp' : isWarning ? 'Cần Chú Ý' : 'Thông Tin'}
                      </span>
                    </div>

                    <h3 className="text-[16px] font-bold text-on-surface mt-1">{alt.title}</h3>
                    <p className="text-[13px] text-on-surface-variant mt-0.5">{alt.desc}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-2.5 text-[12px] font-mono text-on-surface-variant">
                      <span>Khách: <strong className="text-on-surface">{alt.customerName}</strong></span>
                      <span>SĐT: <strong className="text-primary">{alt.customerPhone}</strong></span>
                      <span>Thời gian: <strong className="text-on-surface">{alt.timeFormatted}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`tel:${alt.customerPhone}`}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-surface-dim font-bold text-[13px] flex items-center gap-1.5 shadow-[0_0_12px_rgba(75,226,119,0.2)] transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi Khách Ngay</span>
                  </a>

                  <button
                    onClick={() => onOpenCheckinModal('return', alt.speakerId)}
                    className="px-4 py-2.5 rounded-xl bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-bold text-[13px] flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Check-in Loa Đã Về</span>
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
