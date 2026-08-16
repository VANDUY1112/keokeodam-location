import React from 'react';
import { 
  Radio, 
  MapPin, 
  Speaker, 
  BellRing, 
  BarChart3, 
  PlusCircle, 
  CheckCircle2, 
  Home
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  speakers, 
  onOpenCheckinModal 
}) {
  const rentingCount = speakers.filter(s => s.status === 'renting').length;
  const availableCount = speakers.filter(s => s.status === 'available').length;

  const navItems = [
    {
      id: 'overview',
      label: 'Bản Đồ Vị Trí Loa',
      icon: MapPin,
      badge: `${rentingCount} Đang Thuê`,
      badgeColor: 'bg-tertiary/20 text-tertiary font-bold',
      desc: 'Định vị Loa ở đâu & Quãng đường'
    },
    {
      id: 'device-details',
      label: 'Quản Lý Từng Chiếc Loa',
      icon: Speaker,
      badge: `${speakers.length} Loa`,
      badgeColor: 'bg-primary/20 text-primary',
      desc: 'Đồng hồ đếm giờ & Tình trạng Pin/Mic'
    },
    {
      id: 'alerts',
      label: 'Cảnh Báo Giờ Thuê',
      icon: BellRing,
      badge: rentingCount > 0 ? 'Cần Chú Ý' : null,
      badgeColor: 'bg-error text-surface-dim font-bold animate-pulse',
      desc: 'Nhắc quá giờ & Thu hồi loa đêm'
    },
    {
      id: 'reports',
      label: 'Doanh Thu & Lịch Sử',
      icon: BarChart3,
      badge: 'Sổ Sách',
      badgeColor: 'bg-secondary-container/20 text-secondary',
      desc: 'Tính tiền theo tiếng & Lịch sử ca thuê'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant/20 z-50 flex flex-col select-none">
      {/* Brand Header */}
      <div className="h-[64px] flex items-center justify-between px-6 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/15 border border-primary/40 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(75,226,119,0.3)]">
            <Speaker className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div>
            <div className="font-headline-md text-[15px] text-primary tracking-[0.15em] font-extrabold uppercase">
              KeoKeoDam Pro
            </div>
            <div className="text-[11px] text-on-surface-variant font-mono">
              Cho Thuê Loa Kẹo Kéo Theo Tiếng
            </div>
          </div>
        </div>
      </div>

      {/* Quick Check-in Button on Sidebar */}
      <div className="p-4 border-b border-outline-variant/10">
        <button
          onClick={() => onOpenCheckinModal('delivery')}
          className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-surface-dim font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(75,226,119,0.25)] transition-all text-[13px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Check-in Giao Loa Mới</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <div className="px-3 pb-1 text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/60 font-semibold">
          Menu Điều Hành
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-[0_0_15px_rgba(75,226,119,0.15)] font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                <div>
                  <div className="text-[14px] leading-tight font-bold">{item.label}</div>
                  <div className="text-[11px] text-on-surface-variant/70 font-normal leading-normal">{item.desc}</div>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-surface-container-highest text-on-surface'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Home Base Status Footer */}
      <div className="p-4 border-t border-outline-variant/10 bg-surface-dim/50">
        <div className="bg-surface-container/90 border border-outline-variant/20 p-3 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" />
              <span className="text-[12px] font-bold text-on-surface">Kho Loa Tại Nhà</span>
            </div>
            <span className="text-[11px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
              {availableCount} loa có sẵn
            </span>
          </div>
          <div className="text-[10px] text-on-surface-variant font-mono truncate">
            Số 45 Đường Số 8, Linh Xuân, Thủ Đức
          </div>
        </div>
      </div>
    </aside>
  );
}
