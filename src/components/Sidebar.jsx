import React from 'react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  speakers = [], 
  onOpenCheckinModal 
}) {
  const rentingCount = speakers.filter(s => s.status === 'renting').length;
  const availableCount = speakers.filter(s => s.status === 'available').length;
  const alertsCount = speakers.filter(s => {
    if (s.status !== 'renting' || !s.currentRental) return false;
    const hours = (Date.now() - s.currentRental.startTimestamp) / 3600000;
    return hours >= 3.5 || s.battery <= 25;
  }).length;

  const navItems = [
    {
      id: 'tong-quan',
      label: 'Tổng quan',
      icon: 'dashboard',
      badge: null
    },
    {
      id: 'ban-do-truc-tuyen',
      label: 'Bản đồ trực tuyến',
      icon: 'map',
      badge: `${rentingCount} Đang thuê`,
      badgeClass: 'bg-green-100 text-green-700 font-bold'
    },
    {
      id: 'danh-sach-thiet-bi',
      label: 'Quản lý Dàn Loa',
      icon: 'speaker',
      badge: `${speakers.length} Loa`,
      badgeClass: 'bg-surface-container text-on-surface-variant font-bold'
    },
    {
      id: 'canh-bao',
      label: 'Quản lý Cảnh báo',
      icon: 'report_problem',
      badge: alertsCount > 0 ? `${alertsCount} ca` : null,
      badgeClass: 'bg-error/10 text-error font-bold'
    },
    {
      id: 'bao-cao',
      label: 'Sổ sách & Báo cáo',
      icon: 'analytics',
      badge: null
    }
  ];

  return (
    <aside 
      id="sidebar"
      className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col border-r border-outline-variant select-none shadow-sm text-slate-800"
    >
      {/* Top red bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

      {/* Brand Header */}
      <div className="p-gutter flex items-center justify-between mb-base pt-5">
        <div 
          className="flex items-center gap-3.5 py-1 cursor-pointer"
          onClick={() => setActiveTab('tong-quan')}
        >
          <div className="h-12 w-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm border border-outline-variant/30 font-bold shrink-0">
            <span className="material-symbols-outlined text-[28px]">speaker</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-[17px] text-primary leading-tight">
              KeoKeoDam Pro
            </span>
            <span className="text-[13px] font-bold text-on-surface-variant/80 mt-0.5">
              Quản trị cho thuê loa
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 mt-5 space-y-1.5" id="main-nav">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || 
                           (activeTab === 'overview' && item.id === 'tong-quan') ||
                           (activeTab === 'map-view' && item.id === 'ban-do-truc-tuyen') ||
                           (activeTab === 'devices' && item.id === 'danh-sach-thiet-bi') ||
                           (activeTab === 'alerts' && item.id === 'canh-bao') ||
                           (activeTab === 'reports' && item.id === 'bao-cao');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full nav-item flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-semibold'
              }`}
            >
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-3.5 text-[24px]">{item.icon}</span>
                <span className="text-[15px] leading-tight">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[12px] font-mono px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                  isActive ? 'bg-white/20 text-on-primary-container font-extrabold' : item.badgeClass
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick action button in sidebar */}
        <div className="pt-5 mt-5 border-t border-outline-variant">
          <button
            onClick={() => onOpenCheckinModal('delivery')}
            className="w-full flex items-center justify-center px-4 py-3.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-all shadow-md gap-2.5 text-[15px] active:scale-98"
          >
            <span className="material-symbols-outlined text-[22px]">add_circle</span>
            <span>Giao Loa Cho Khách</span>
          </button>
        </div>
      </nav>

      {/* Kho Nhà Footer Box */}
      <div className="p-4.5 border-t border-outline-variant bg-surface-container-low/50">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-[20px] text-primary">home</span>
            <span className="font-bold text-[14px]">Kho Nhà Chính</span>
          </div>
          <span className="text-[12px] font-mono font-bold px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full">
            {availableCount} loa có sẵn
          </span>
        </div>
        <p className="text-[13px] text-on-surface-variant truncate">
          Hùng Vương, P. 7, Tuy Hòa, Phú Yên
        </p>
      </div>

    </aside>
  );
}
