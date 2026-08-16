import React, { useState, useRef, useEffect } from 'react';
import DashboardView from './components/DashboardView';
import TrackingView from './components/TrackingView';
import ExpensesView from './components/ExpensesView';
import HistoryView from './components/HistoryView';
import CustomDropdown from './components/CustomDropdown';

const INITIAL_EXPENSES = [
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
];

const INITIAL_TRIPS = [
  {
    id: 1,
    title: 'Thăm văn phòng Hamburg',
    subtitle: '24 Th10 • 280 km',
    distanceKm: 280,
    duration: '03:45:00',
    status: 'Hoàn thành',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: 'near_me',
    pathCoordinates: [
      { lat: 10.7769, lng: 106.7009 },
      { lat: 10.7801, lng: 106.7052 },
      { lat: 10.7845, lng: 106.7112 },
    ],
  },
  {
    id: 2,
    title: 'Hội nghị công nghệ London',
    subtitle: '18-20 Th10 • 950 km',
    distanceKm: 950,
    duration: '12:30:00',
    status: 'Đã thanh toán',
    statusBadge: 'bg-surface-container-high text-on-surface-variant',
    icon: 'flight',
  },
  {
    id: 3,
    title: 'Họp nhà cung cấp - Cologne',
    subtitle: '12 Th10 • 145 km',
    distanceKm: 145,
    duration: '02:15:00',
    status: 'Hoàn thành',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: 'near_me',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogExpenseModal, setShowLogExpenseModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Persistent State with LocalStorage
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('expensely_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem('expensely_trips');
      return saved ? JSON.parse(saved) : INITIAL_TRIPS;
    } catch {
      return INITIAL_TRIPS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('expensely_expenses', JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('expensely_trips', JSON.stringify(trips));
    } catch (e) {
      console.error(e);
    }
  }, [trips]);

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

  const handleAddTrip = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const handleDeleteTrip = (tripId) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('expensely_user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('expensely_user_name') || 'Alex Johnson';
  });

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSelectAvatar = (url) => {
    setUserAvatar(url);
    localStorage.setItem('expensely_user_avatar', url);
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen">
      {/* ═══════════════ SIDEBAR NAVIGATION (W-72) ═══════════════ */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[1px_0_0_rgba(0,0,0,0.05)]">
        <div className="h-16 flex items-center px-lg mb-sm gap-sm">
          <img
            alt="Expensely Logo"
            className="h-8 w-8 rounded-xl shadow-xs object-cover"
            src="/favicon.svg"
          />
          <span className="font-headline-md text-primary tracking-tight font-bold">Expensely</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 px-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'dashboard'
                ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-surface-container-high hover:text-slate-900 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
              dashboard
            </span>
            <span className="text-[15px]">Tổng Quan</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            aria-current={activeTab === 'tracking' ? 'page' : undefined}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'tracking'
                ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-surface-container-high hover:text-slate-900 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
              my_location
            </span>
            <span className="text-[15px]">Hành Trình</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            aria-current={activeTab === 'expenses' ? 'page' : undefined}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'expenses'
                ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-surface-container-high hover:text-slate-900 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
              receipt_long
            </span>
            <span className="text-[15px]">Quản Lý Chi Phí</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            aria-current={activeTab === 'history' ? 'page' : undefined}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'history'
                ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-surface-container-high hover:text-slate-900 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
              history
            </span>
            <span className="text-[15px]">Lịch Sử Chuyến Đi</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            aria-current={activeTab === 'reports' ? 'page' : undefined}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'reports'
                ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-surface-container-high hover:text-slate-900 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
              assessment
            </span>
            <span className="text-[15px]">Báo Cáo & Thống Kê</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            aria-current={activeTab === 'settings' ? 'page' : undefined}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'settings'
                ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-surface-container-high hover:text-slate-900 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
              settings
            </span>
            <span className="text-[15px]">Cài Đặt</span>
          </button>
        </nav>
      </aside>

      {/* ═══════════════ TOP HEADER & MAIN CONTENT AREA ═══════════════ */}
      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 px-xl flex items-center justify-end border-b border-outline-variant/30">
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
                className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-high p-1.5 pr-3 rounded-full transition-all group border border-outline-variant/30 bg-white/60 shadow-xs"
              >
                <img
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-primary shadow-xs"
                  src={userAvatar}
                />
                <span className="font-semibold text-slate-800 text-sm">{userName}</span>
                <span className={`material-symbols-outlined text-[18px] text-slate-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180 text-primary' : ''}`}>
                  expand_more
                </span>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                    <img
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary shadow-sm"
                      src={userAvatar}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-on-surface truncate">{userName}</div>
                      <div className="text-xs text-on-surface-variant truncate">Kỹ Sư Trưởng Thực Địa</div>
                      <span className="inline-block px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[11px] font-semibold mt-1">
                        GPS Trực Tuyến
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
              <TrackingView
                onOpenLogExpense={() => setShowLogExpenseModal(true)}
                onAddTripRecord={handleAddTrip}
                onAddExpenseRecord={(rec) => {
                  setExpenses((prev) => [
                    {
                      id: Date.now(),
                      title: rec.title,
                      subtitle: `Hôm nay • Dự án Phoenix`,
                      amount: rec.amount,
                      status: 'Chờ duyệt',
                      statusColor: 'text-surface-tint',
                      icon: 'directions_car',
                      hoverColor: 'group-hover:bg-primary/10 group-hover:text-primary',
                    },
                    ...prev,
                  ]);
                }}
              />
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
              <HistoryView
                trips={trips}
                onDeleteTrip={handleDeleteTrip}
                onNavigateToTracking={() => setActiveTab('tracking')}
              />
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
                  <div className="p-lg bg-surface-container-lowest rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-48">
                    <div>
                      <span className="font-label-sm uppercase text-slate-500 font-semibold text-xs">Tháng 10 / 2026</span>
                      <h4 className="font-headline-lg text-on-surface mt-1 font-bold">Tổng Kết Công Tác Tháng</h4>
                      <p className="text-sm text-on-surface-variant mt-1 font-medium">Tổng 1.245 km • Đã chi $4,320.00</p>
                    </div>
                    <button className="self-start px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-slate-800 flex items-center gap-2 shadow-md">
                      <span className="material-symbols-outlined text-base">download</span> Xuất Báo Cáo PDF
                    </button>
                  </div>
                  <div className="p-lg bg-surface-container-lowest rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-48">
                    <div>
                      <span className="font-label-sm uppercase text-slate-500 font-semibold text-xs">Quý 3 / 2026</span>
                      <h4 className="font-headline-lg text-on-surface mt-1 font-bold">Báo Cáo Kiểm Toán Quý</h4>
                      <p className="text-sm text-on-surface-variant mt-1 font-medium">Tổng 3.840 km • Đã chi $12,900.00</p>
                    </div>
                    <button className="self-start px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-slate-800 flex items-center gap-2 shadow-md">
                      <span className="material-symbols-outlined text-base">download</span> Xuất File Excel / CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CÀI ĐẶT (SETTINGS) */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h2 className="font-headline-lg text-on-surface">Cài Đặt & Tùy Chọn</h2>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Cấu hình ảnh đại diện, phương tiện di chuyển, định mức hoàn ứng và thông tin tài khoản.
                  </p>
                </div>

                {/* Avatar & Profile Card */}
                <div className="p-6 bg-surface-container-lowest border border-slate-200 rounded-3xl shadow-sm space-y-5">
                  <div className="font-bold text-slate-900 text-base">Ảnh Đại Diện & Hồ Sơ Cá Nhân</div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <img
                      alt="Current Avatar"
                      src={userAvatar}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
                    />
                    <div className="space-y-2 flex-1 w-full">
                      <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                        Chọn Avatar Có Sẵn
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <img
                            key={idx}
                            src={preset}
                            alt={`Avatar option ${idx + 1}`}
                            onClick={() => handleSelectAvatar(preset)}
                            className={`w-12 h-12 rounded-full object-cover cursor-pointer transition-all hover:scale-110 ${
                              userAvatar === preset
                                ? 'ring-4 ring-primary shadow-lg scale-105'
                                : 'ring-2 ring-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1">
                        Tên Hiển Thị
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                          localStorage.setItem('expensely_user_name', e.target.value);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1">
                        Hoặc Dán Link Avatar Riêng
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        onBlur={(e) => {
                          if (e.target.value.trim()) {
                            handleSelectAvatar(e.target.value.trim());
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-md bg-surface-container-lowest border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                      <div className="font-semibold text-on-surface text-sm">Tự động kích hoạt GPS định vị</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">Ghi nhận tọa độ vi mô khi bắt đầu chuyến đi</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                  </div>
                  <div className="p-md bg-surface-container-lowest border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                      <div className="font-semibold text-on-surface text-sm">Thông báo phê duyệt chi phí tức thì</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">Gửi thông báo đến phòng kế toán ngay khi kết thúc lộ trình</div>
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
                <label className="block font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider text-xs font-semibold">
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
                <label className="block font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider text-xs font-semibold">
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
