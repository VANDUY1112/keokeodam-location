import React from 'react';
import { 
  MapPin, 
  Speaker, 
  BellRing, 
  BarChart3, 
  PlusCircle, 
  Home,
  CheckCircle2
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
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200 font-bold',
      desc: 'Định vị loa & Quãng đường'
    },
    {
      id: 'device-details',
      label: 'Quản Lý Từng Chiếc Loa',
      icon: Speaker,
      badge: `${speakers.length} Loa`,
      badgeColor: 'bg-ocean-50 text-ocean-700 border border-ocean-200 font-bold',
      desc: 'Đồng hồ đếm giờ & Pin/Mic'
    },
    {
      id: 'alerts',
      label: 'Cảnh Báo Giờ Thuê',
      icon: BellRing,
      badge: rentingCount > 0 ? 'Cần Chú Ý' : null,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold animate-pulse',
      desc: 'Nhắc quá giờ & Thu hồi loa đêm'
    },
    {
      id: 'reports',
      label: 'Doanh Thu & Lịch Sử',
      icon: BarChart3,
      badge: 'Sổ Sách',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold',
      desc: 'Tính tiền theo tiếng & Lịch sử'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-slate-200 z-50 flex flex-col select-none shadow-sm">
      
      {/* Brand Header */}
      <div className="h-[64px] flex items-center justify-between px-6 border-b border-slate-100 bg-ocean-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-white shadow-inner">
            <Speaker className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-[15px] tracking-wider uppercase">
              KeoKeoDam Pro
            </div>
            <div className="text-[11px] text-ocean-100 font-medium">
              Cho Thuê Loa Kẹo Kéo
            </div>
          </div>
        </div>
      </div>

      {/* Quick Check-in Button */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={() => onOpenCheckinModal('delivery')}
          className="w-full py-2.5 px-4 bg-ocean-600 hover:bg-ocean-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-ocean-600/20 transition-all text-[13px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Check-in Giao Loa Mới</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Menu Điều Hành
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 text-left ${
                isActive
                  ? 'bg-ocean-50 text-ocean-700 border-l-4 border-ocean-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-ocean-600' : 'text-slate-400 group-hover:text-ocean-600'}`} />
                <div>
                  <div className="text-[14px] leading-tight">{item.label}</div>
                  <div className="text-[11px] text-slate-500 font-normal leading-normal">{item.desc}</div>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Home Base Status Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-ocean-600" />
              <span className="text-[12px] font-bold text-slate-800">Kho Loa Tại Nhà</span>
            </div>
            <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
              {availableCount} có sẵn
            </span>
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            Số 45 Đường Số 8, Linh Xuân, Thủ Đức
          </div>
        </div>
      </div>
    </aside>
  );
}
