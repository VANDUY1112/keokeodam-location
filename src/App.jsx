import React, { useState, useRef, useEffect } from 'react';
import DashboardView from './components/DashboardView';
import TrackingView from './components/TrackingView';
import ExpensesView from './components/ExpensesView';
import CustomDropdown from './components/CustomDropdown';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogExpenseModal, setShowLogExpenseModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Selected project / tech mode
  const [selectedProject, setSelectedProject] = useState('phoenix');

  const projectOptions = [
    {
      value: 'phoenix',
      label: 'Dự Án Phoenix',
      subtitle: 'Acme Corp • Frankfurt',
      icon: 'rocket_launch',
      badge: 'Đang chạy',
    },
    {
      value: 'cybernet',
      label: 'Hạ Tầng CyberNet',
      subtitle: 'Munich Data Hub',
      icon: 'hub',
      badge: 'Sắp tới',
    },
    {
      value: 'quantum',
      label: 'Quantum Cloud Link',
      subtitle: 'Berlin Headquarters',
      icon: 'cloud_sync',
      badge: 'Bảo trì',
    },
  ];

  const categoryOptions = [
    { value: 'Ăn uống', label: 'Ăn uống & Tiếp khách', icon: 'local_dining' },
    { value: 'Nhiên liệu', label: 'Nhiên liệu & Xăng xe', icon: 'local_gas_station' },
    { value: 'Di chuyển', label: 'Vé xe & Đi lại', icon: 'directions_car' },
    { value: 'Khách sạn', label: 'Khách sạn & Lưu trú', icon: 'hotel' },
    { value: 'Khác', label: 'Chi phí khác', icon: 'receipt_long' },
  ];

  // Close profile menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Ăn tối tiếp khách - Nhà hàng',
      subtitle: '26 Th10 • Dự án Phoenix',
      amount: '$245.50',
      status: 'Chờ duyệt',
      statusColor: 'text-surface-tint',
      icon: 'local_dining',
      hoverColor: 'group-hover:bg-error/10 group-hover:text-error',
    },
    {
      id: 2,
      title: 'Đổ xăng xe - Trạm Shell',
      subtitle: '24 Th10 • Chuyến công tác Hamburg',
      amount: '$85.00',
      status: 'Đã duyệt',
      statusColor: 'text-secondary',
      icon: 'local_gas_station',
      hoverColor: 'group-hover:bg-tertiary/10 group-hover:text-tertiary',
    },
    {
      id: 3,
      title: 'Khách sạn Marriott - 2 Đêm',
      subtitle: '18 Th10 • Hội nghị London Tech',
      amount: '$540.00',
      status: 'Đã duyệt',
      statusColor: 'text-secondary',
      icon: 'hotel',
      hoverColor: 'group-hover:bg-primary/10 group-hover:text-primary',
    },
  ]);

  const [trips, setTrips] = useState([
    {
      id: 1,
      title: 'Thăm văn phòng Hamburg',
      subtitle: '24 Th10 • 280 km',
      status: 'Hoàn thành',
      statusBadge: 'bg-secondary/10 text-secondary',
      icon: 'directions_car',
    },
    {
      id: 2,
      title: 'Hội nghị công nghệ London',
      subtitle: '18-20 Th10 • 950 km',
      status: 'Đã thanh toán',
      statusBadge: 'bg-surface-container-high text-on-surface-variant',
      icon: 'flight',
    },
    {
      id: 3,
      title: 'Họp nhà cung cấp - Cologne',
      subtitle: '12 Th10 • 145 km',
      status: 'Hoàn thành',
      statusBadge: 'bg-secondary/10 text-secondary',
      icon: 'directions_car',
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    title: '',
    project: 'Dự án Phoenix',
    amount: '',
    category: 'Ăn uống',
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    let icon = 'receipt_long';
    let hoverColor = 'group-hover:bg-primary/10 group-hover:text-primary';
    if (newExpense.category === 'Ăn uống') {
      icon = 'local_dining';
      hoverColor = 'group-hover:bg-error/10 group-hover:text-error';
    } else if (newExpense.category === 'Nhiên liệu' || newExpense.category === 'Di chuyển') {
      icon = 'local_gas_station';
      hoverColor = 'group-hover:bg-tertiary/10 group-hover:text-tertiary';
    } else if (newExpense.category === 'Khách sạn') {
      icon = 'hotel';
      hoverColor = 'group-hover:bg-primary/10 group-hover:text-primary';
    }

    const item = {
      id: Date.now(),
      title: newExpense.title,
      subtitle: `Hôm nay • ${newExpense.project}`,
      amount: `$${parseFloat(newExpense.amount).toFixed(2)}`,
      status: 'Chờ duyệt',
      statusColor: 'text-surface-tint',
      icon,
      hoverColor,
    };

    setExpenses([item, ...expenses]);
    setNewExpense({ title: '', project: 'Dự án Phoenix', amount: '', category: 'Ăn uống' });
    setShowLogExpenseModal(false);
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen">
      {/* ═══════════════ SIDEBAR NAVIGATION (W-72) ═══════════════ */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[1px_0_0_rgba(0,0,0,0.05)]">
        <div className="h-16 flex items-center px-lg mb-sm gap-sm">
          <img
            alt="Expensely Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZEe91jxMChIOPJ3a-L96MEXUG-c7UsjTsrXMkxi1DBCJpqAJSz4mYT2omTyPr6xFzZHkMBbxOSAEe2MWd5pZ9EaEp7g1MxrUZes9pYY6rwCPvRKk1h0-pifo7Q5QXf-_Rkz0IwJxMqU9FIZG0Hk9swkKW_T-YXFx5q3cddoXIRLgbuhxogquJxzUXZYgSRCShRp3FTLrzPWvXtiT6B_zQiPwNl0uNirrxuUjCfhXcpfYgScQ71Iqh"
          />
          <span className="font-headline-md text-primary tracking-tight">Expensely</span>
        </div>

        <nav className="flex-1 flex flex-col gap-xs px-sm" data-active-classes="bg-primary-container text-on-primary-container shadow-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'dashboard'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              dashboard
            </span>
            <span className="font-body-md font-medium">Tổng Quan</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            aria-current={activeTab === 'tracking' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'tracking'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              my_location
            </span>
            <span className="font-body-md font-medium">Hành Trình</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            aria-current={activeTab === 'expenses' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'expenses'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              receipt_long
            </span>
            <span className="font-body-md font-medium">Quản Lý Chi Phí</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            aria-current={activeTab === 'history' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'history'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              history
            </span>
            <span className="font-body-md font-medium">Lịch Sử Chuyến Đi</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            aria-current={activeTab === 'reports' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'reports'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              assessment
            </span>
            <span className="font-body-md font-medium">Báo Cáo & Thống Kê</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            aria-current={activeTab === 'settings' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'settings'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              settings
            </span>
            <span className="font-body-md font-medium">Cài Đặt</span>
          </button>
        </nav>
      </aside>

      {/* ═══════════════ TOP HEADER & MAIN CONTENT AREA ═══════════════ */}
      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 px-xl flex items-center justify-between border-b border-outline-variant/30">
          {/* Left Header: Modern Tech / Project Selector Dropdown */}
          <div className="w-72">
            <CustomDropdown
              options={projectOptions}
              value={selectedProject}
              onChange={setSelectedProject}
              placeholder="Chọn dự án công tác..."
            />
          </div>

          {/* Right Header: Notifications & Profile Dropdown */}
          <div className="flex items-center gap-lg">
            <button
              onClick={() => setShowNotificationsModal(!showNotificationsModal)}
              className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={profileMenuRef}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-md cursor-pointer hover:bg-surface-container-high p-1.5 pr-3 rounded-full transition-all group border border-outline-variant/20"
              >
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-highest group-hover:ring-primary-fixed-dim"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPd2lm08x1AlkyTD2a7EAyfL0w3g6wLf-ks695bcDug3eBb3dY7M-IYqblxUBUJkM_1JLpS-oe2ETxX133ifwVSaKDBPAoUyTnh9m2K6JGZaAXpocLvkSW-pPgCzBOCNm7rypqZsPJjCJ7JkHe9e7WnEQhZ3jdjhuV30XXIgz2jC82hw8CKQ4KGLrargMZ6FzYKrKBFWjpHswjzqdRYHAue-PJetCwtSUpvGnzOmaRO_Dz82T-AYn-"
                />
                <span className="font-body-md font-medium text-on-surface">Alex Johnson</span>
                <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${showProfileMenu ? 'rotate-180 text-primary' : ''}`}>
                  expand_more
                </span>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/25 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-outline-variant/15 flex items-center gap-3">
                    <img
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPd2lm08x1AlkyTD2a7EAyfL0w3g6wLf-ks695bcDug3eBb3dY7M-IYqblxUBUJkM_1JLpS-oe2ETxX133ifwVSaKDBPAoUyTnh9m2K6JGZaAXpocLvkSW-pPgCzBOCNm7rypqZsPJjCJ7JkHe9e7WnEQhZ3jdjhuV30XXIgz2jC82hw8CKQ4KGLrargMZ6FzYKrKBFWjpHswjzqdRYHAue-PJetCwtSUpvGnzOmaRO_Dz82T-AYn-"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-on-surface truncate">Alex Johnson</div>
                      <div className="text-xs text-on-surface-variant truncate">Lead Field Engineer</div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-semibold mt-1">
                        Online • GPS Live
                      </span>
                    </div>
                  </div>

                  <div className="py-1.5 space-y-0.5 text-xs">
                    <button
                      onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                      <span>Hồ sơ & Tài khoản</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('reports'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">analytics</span>
                      <span>Hạn mức công tác</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-tertiary">tune</span>
                      <span>Tùy chỉnh hệ thống</span>
                    </button>
                  </div>

                  <div className="pt-1.5 border-t border-outline-variant/15">
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-error hover:bg-error-container/20 transition-colors text-left text-xs font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="w-full pt-16 min-h-screen">
          <div className="p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
            {/* TAB 1: TỔNG QUAN (DASHBOARD) */}
            {activeTab === 'dashboard' && (
              <DashboardView
                expenses={expenses}
                trips={trips}
                onOpenLogExpense={() => setShowLogExpenseModal(true)}
                onOpenItinerary={() => setShowItineraryModal(true)}
                onNavigateToTab={setActiveTab}
              />
            )}

            {/* TAB 2: HÀNH TRÌNH (TRACKING) */}
            {activeTab === 'tracking' && (
              <TrackingView onOpenLogExpense={() => setShowLogExpenseModal(true)} />
            )}

            {/* TAB 3: QUẢN LÝ CHI PHÍ (EXPENSES) */}
            {activeTab === 'expenses' && (
              <ExpensesView
                expenses={expenses}
                onOpenAddExpense={() => setShowLogExpenseModal(true)}
              />
            )}

            {/* TAB 4: LỊCH SỬ CHUYẾN ĐI (HISTORY) */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-headline-lg text-on-surface">Lịch Sử Chuyến Đi & Lưu Trữ</h2>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Nhật ký toàn diện về các chuyến công tác đã hoàn tất và hoàn ứng chi phí.
                  </p>
                </div>
                <div className="flex flex-col gap-sm">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-surface-container-lowest p-lg rounded-2xl flex items-center justify-between border border-outline-variant/15 hover:bg-surface-container-low transition-colors"
                    >
                      <div className="flex items-center gap-md">
                        <div className="w-12 h-12 bg-surface-container text-primary rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined">{trip.icon}</span>
                        </div>
                        <div>
                          <div className="font-headline-md text-on-surface">{trip.title}</div>
                          <div className="font-body-md text-on-surface-variant">{trip.subtitle}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 font-label-sm rounded-lg ${trip.statusBadge}`}>
                        {trip.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: BÁO CÁO & THỐNG KÊ (REPORTS) */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-headline-lg text-on-surface">Báo Cáo & Quyết Toán Chi Phí</h2>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Tổng hợp chi phí hàng tháng, phân tích số km di chuyển và xuất báo cáo hoàn ứng.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="p-lg bg-surface-container rounded-2xl border border-outline-variant/20 flex flex-col justify-between h-48">
                    <div>
                      <span className="font-label-sm uppercase text-on-surface-variant">Tháng 10 / 2026</span>
                      <h4 className="font-headline-lg text-on-surface mt-1">Tổng Kết Công Tác Tháng</h4>
                      <p className="text-sm text-on-surface-variant mt-1">Tổng 1.245 km • Đã chi $4,320.00</p>
                    </div>
                    <button className="self-start px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">download</span> Xuất Báo Cáo PDF
                    </button>
                  </div>
                  <div className="p-lg bg-surface-container rounded-2xl border border-outline-variant/20 flex flex-col justify-between h-48">
                    <div>
                      <span className="font-label-sm uppercase text-on-surface-variant">Quý 3 / 2026</span>
                      <h4 className="font-headline-lg text-on-surface mt-1">Báo Cáo Kiểm Toán Quý</h4>
                      <p className="text-sm text-on-surface-variant mt-1">Tổng 3.840 km • Đã chi $12,900.00</p>
                    </div>
                    <button className="self-start px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">download</span> Xuất File Excel / CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CÀI ĐẶT (SETTINGS) */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="font-headline-lg text-on-surface">Cài Đặt & Tùy Chọn</h2>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Cấu hình phương tiện di chuyển, định mức hoàn ứng và thông tin tài khoản.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="p-md bg-surface-container rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-medium text-on-surface">Tự động kích hoạt GPS định vị</div>
                      <div className="text-xs text-on-surface-variant">Ghi nhận tọa độ vi mô khi bắt đầu chuyến đi</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                  </div>
                  <div className="p-md bg-surface-container rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-medium text-on-surface">Thông báo phê duyệt chi phí tức thì</div>
                      <div className="text-xs text-on-surface-variant">Gửi thông báo đến phòng kế toán ngay khi kết thúc lộ trình</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ═══════════════ MODAL: GHI NHẬN CHI PHÍ ═══════════════ */}
      {showLogExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-xl border border-outline-variant/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface">Ghi Nhận Chi Phí Mới</h3>
                  <p className="font-label-sm text-on-surface-variant">Dự án Phoenix</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogExpenseModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="flex flex-col gap-md">
              <div>
                <label className="block font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider text-xs">
                  Nội Dung / Mô Tả Chi Phí
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ăn tối tiếp khách, Đổ xăng xe..."
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-md py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body-md"
                />
              </div>

              <div>
                <label className="block font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider text-xs">
                  Số Tiền ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-md py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body-md"
                />
              </div>

              {/* Custom Modern Dropdown */}
              <div>
                <CustomDropdown
                  label="Danh Mục Chi Phí"
                  options={categoryOptions}
                  value={newExpense.category}
                  onChange={(cat) => setNewExpense({ ...newExpense, category: cat })}
                />
              </div>

              <div className="flex gap-sm mt-lg">
                <button
                  type="button"
                  onClick={() => setShowLogExpenseModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-medium transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-medium transition-colors shadow-md"
                >
                  Lưu Chi Phí
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════ MODAL: XEM LỊCH TRÌNH ═══════════════ */}
      {showItineraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-xl border border-outline-variant/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface">Lịch Trình Dự Án Phoenix</h3>
                  <p className="font-label-sm text-on-surface-variant">Frankfurt • Kế hoạch 3 ngày</p>
                </div>
              </div>
              <button
                onClick={() => setShowItineraryModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md font-semibold text-on-surface">Ngày 1: Họp Khởi Động Với Khách Hàng</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Làm việc với ban quản trị Acme Corp, kiểm toán hệ thống & lắp đặt tủ rack.</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[11px] font-medium">Đã hoàn thành</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md font-semibold text-on-surface">Ngày 2: Triển Khai Phần Cứng Giai Đoạn 2</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Cấu hình máy chủ, thiết lập đường truyền telemetry tốc độ cao & kiểm thử.</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-primary-container text-on-primary-container text-[11px] font-medium">Đang thực hiện (Dự kiến 45p)</span>
                </div>
              </div>

              <div className="flex gap-4 items-start opacity-70">
                <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md font-semibold text-on-surface">Ngày 3: Đào Tạo Nhân Sự & Bàn Giao</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Bàn giao tài liệu hướng dẫn, buổi huấn luyện nhân viên và khởi hành về.</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Sắp tới</span>
                </div>
              </div>
            </div>

            <div className="mt-xl flex justify-end">
              <button
                onClick={() => setShowItineraryModal(false)}
                className="px-xl py-2.5 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-md"
              >
                Đóng Lịch Trình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ POPUP: THÔNG BÁO ═══════════════ */}
      {showNotificationsModal && (
        <div className="fixed top-16 right-10 z-50 w-80 bg-surface-container-lowest rounded-2xl p-md border border-outline-variant/30 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-sm border-b border-outline-variant/20 mb-sm">
            <span className="font-body-md font-semibold text-on-surface">Thông Báo</span>
            <span className="font-label-sm text-secondary font-medium">2 tin mới</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
              <div className="font-medium text-on-surface">Chi phí đã được phê duyệt</div>
              <div className="text-on-surface-variant mt-0.5">Hóa đơn xăng xe ($85.00) đã được hoàn ứng.</div>
            </div>
            <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
              <div className="font-medium text-on-surface">Cảnh báo giao thông</div>
              <div className="text-on-surface-variant mt-0.5">Đoạn cao tốc A3 hướng Frankfurt đã thông thoáng.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
