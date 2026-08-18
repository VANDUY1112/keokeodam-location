import React, { useState, useRef, useEffect } from 'react';
import DashboardView from './components/DashboardView';
import TrackingView from './components/TrackingView';
import ExpensesView from './components/ExpensesView';
import HistoryView from './components/HistoryView';
import CustomDropdown from './components/CustomDropdown';
import MobileCurvedNavBar from './components/MobileCurvedNavBar';
import { formatVND, parseVNDNumber } from './utils/format';

const INITIAL_EXPENSES = [
  {
    id: 1,
    title: 'Thu tiền thuê loa - Anh Hoàng (Tiệc Sinh Nhật)',
    subtitle: 'Hôm nay • Gói Loa Bass 40 (800W)',
    amount: '450.000 ₫',
    status: 'Đã duyệt',
    statusColor: 'text-secondary',
    icon: 'speaker',
    hoverColor: 'group-hover:bg-primary/10 group-hover:text-primary',
  },
  {
    id: 2,
    title: 'Đổ xăng xe máy giao loa - Trạm Petrolimex',
    subtitle: 'Hôm qua • Ship 4 đơn nội thành',
    amount: '120.000 ₫',
    status: 'Đã duyệt',
    statusColor: 'text-secondary',
    icon: 'local_gas_station',
    hoverColor: 'group-hover:bg-tertiary/10 group-hover:text-tertiary',
  },
  {
    id: 3,
    title: 'Thu tiền thuê loa - Chị Mai (Tân Gia Q.7)',
    subtitle: '24 Th10 • Gói Loa Đôi Bass 50 (1500W)',
    amount: '620.000 ₫',
    status: 'Đã duyệt',
    statusColor: 'text-secondary',
    icon: 'volume_up',
    hoverColor: 'group-hover:bg-primary/10 group-hover:text-primary',
  },
];

const INITIAL_TRIPS = [
  {
    id: 1,
    title: 'Giao Loa: Anh Hoàng - 0903.111.222',
    subtitle: 'Hôm nay • 5.2 km • Loa Bass 40 (800W)',
    distanceKm: 5.2,
    duration: '00:18:30',
    cost: 428000,
    speakerName: 'Loa Kéo Bass 40 (800W)',
    customerName: 'Anh Hoàng',
    status: 'Đã bàn giao',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: 'speaker',
    pathCoordinates: [
      { lat: 10.7769, lng: 106.7009 },
      { lat: 10.7801, lng: 106.7052 },
      { lat: 10.7845, lng: 106.7112 },
    ],
  },
  {
    id: 2,
    title: 'Giao Loa: Chị Mai - 0918.333.444',
    subtitle: 'Hôm qua • 8.4 km • Loa Đôi Bass 50',
    distanceKm: 8.4,
    duration: '00:26:45',
    cost: 626000,
    speakerName: 'Loa Kéo Đôi Bass 50 Khủng (1500W)',
    customerName: 'Chị Mai',
    status: 'Đã bàn giao',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: 'volume_up',
  },
  {
    id: 3,
    title: 'Giao Loa: Anh Nam - 0912.345.678',
    subtitle: '24 Th10 • 3.8 km • Loa Bass 40',
    distanceKm: 3.8,
    duration: '00:14:10',
    cost: 407000,
    speakerName: 'Loa Kéo Bass 40',
    customerName: 'Anh Nam',
    status: 'Đã bàn giao',
    statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: 'speaker',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogExpenseModal, setShowLogExpenseModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Persistent State with LocalStorage & Automatic VNĐ format sanitization
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('expensely_expenses');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          amount: formatVND(item.amount),
        }));
      }
      return INITIAL_EXPENSES;
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

    const rawNum = parseFloat(String(newExpense.amount).replace(/[^0-9.]/g, '')) || 0;
    const formattedAmount = formatVND(rawNum);

    const item = {
      id: Date.now(),
      title: newExpense.title,
      subtitle: `Hôm nay • ${newExpense.project}`,
      amount: formattedAmount,
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

  const NAV_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230f172a"/><path d="M70 30 L56 70 L47 47 L30 56 Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>`;

  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem('expensely_user_avatar');
    // If no saved avatar or old photo preset, default to NAV_AVATAR
    if (!saved || saved.includes('unsplash.com')) {
      localStorage.setItem('expensely_user_avatar', NAV_AVATAR);
      return NAV_AVATAR;
    }
    return saved;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('expensely_user_name') || 'Alex Johnson';
  });

  const AVATAR_PRESETS = [
    NAV_AVATAR,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSelectAvatar = (url) => {
    setUserAvatar(url);
    localStorage.setItem('expensely_user_avatar', url);
  };

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: 'dashboard' },
    { id: 'tracking', label: 'Giao Loa & GPS', icon: 'two_wheeler' },
    { id: 'expenses', label: 'Doanh Thu & Chi Phí', icon: 'payments' },
    { id: 'history', label: 'Lịch Sử Đơn Thuê', icon: 'speaker' },
    { id: 'reports', label: 'Báo Cáo & Thống Kê', icon: 'assessment' },
    { id: 'settings', label: 'Cài Đặt', icon: 'settings' },
  ];

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen">
      {/* ═══════════════ DESKTOP SIDEBAR NAVIGATION (W-72) ═══════════════ */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex-col shadow-[1px_0_0_rgba(0,0,0,0.05)] border-r border-slate-200/60">
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-200/60">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
          </div>
          <div>
            <span className="text-lg text-slate-900 tracking-tight font-black block leading-none">Kẹo Kéo Express</span>
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-1 block">Cho Thuê Loa GPS</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-3.5 py-5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group text-left ${
                activeTab === item.id
                  ? 'bg-primary text-white shadow-md font-bold'
                  : 'text-slate-600 hover:bg-surface-container-high hover:text-slate-900 font-semibold'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] transition-transform ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:scale-110 group-hover:text-slate-900'}`}>
                {item.icon}
              </span>
              <span className="text-[15px] lg:text-base">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ═══════════════ MOBILE DRAWER MENU (PREMIUM SLIDE & BLUR) ═══════════════ */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`relative w-80 max-w-[85vw] bg-white h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.3)] p-5 z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-base leading-tight">Kẹo Kéo Express</span>
                <span className="text-xs text-slate-500 font-medium">Quản lý & Giao loa GPS</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === item.id
                    ? 'bg-slate-900 text-white font-bold shadow-md shadow-slate-900/15'
                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ═══════════════ TOP HEADER & MAIN CONTENT AREA ═══════════════ */}
      <div className="pl-0 lg:pl-72">
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-surface/90 backdrop-blur-xl z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-outline-variant/30 shadow-xs">
          {/* Mobile Left: Hamburger Button */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              title="Mở menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>

          {/* Spacer for desktop */}
          <div className="hidden lg:block"></div>

          {/* Right Header: Notifications & Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setShowNotificationsModal(!showNotificationsModal)}
              className="relative p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface"></span>
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={profileMenuRef}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-surface-container-high p-1.5 sm:p-2 sm:pr-4 rounded-full transition-all group border border-outline-variant/30 bg-white/70 shadow-xs"
              >
                <img
                  alt="Profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-primary shadow-xs"
                  src={userAvatar}
                />
                <span className="font-bold text-slate-800 text-sm sm:text-base hidden sm:inline">{userName}</span>
                <span className={`material-symbols-outlined text-[20px] text-slate-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180 text-primary' : ''}`}>
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

                  <div className="py-2 space-y-1 text-xs sm:text-sm">
                    <button
                      onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[20px] text-primary">person</span>
                      <span className="font-medium">Hồ sơ & Tài khoản</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('reports'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[20px] text-secondary">analytics</span>
                      <span className="font-medium">Hạn mức công tác</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[20px] text-tertiary">tune</span>
                      <span className="font-medium">Tùy chỉnh hệ thống</span>
                    </button>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100">
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-error hover:bg-error-container/20 transition-colors text-left text-xs sm:text-sm font-semibold"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full pt-20 lg:pt-24 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto pb-24 lg:pb-8">
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
                      amount: formatVND(rec.amount),
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
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Báo Cáo & Quyết Toán Chi Phí</h2>
                  <p className="text-slate-600 text-sm sm:text-base mt-1">
                    Tổng hợp chi phí hàng tháng, phân tích số km di chuyển và xuất báo cáo hoàn ứng.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="p-6 lg:p-8 bg-surface-container-lowest rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-56">
                    <div>
                      <span className="font-bold uppercase text-slate-500 text-xs lg:text-sm tracking-wider">Tháng 10 / 2026</span>
                      <h4 className="text-xl lg:text-2xl font-black text-on-surface mt-1.5">Tổng Kết Công Tác Tháng</h4>
                      <p className="text-base text-slate-600 mt-2 font-medium">Tổng 1.245 km • Đã chi <span className="font-bold text-slate-900">32.500.000 ₫</span></p>
                    </div>
                    <button className="self-start px-5 py-2.5 rounded-xl bg-primary text-white text-sm lg:text-base font-semibold hover:bg-slate-800 flex items-center gap-2 shadow-md transition-all">
                      <span className="material-symbols-outlined text-lg">download</span> Xuất Báo Cáo PDF
                    </button>
                  </div>
                  <div className="p-6 lg:p-8 bg-surface-container-lowest rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-56">
                    <div>
                      <span className="font-bold uppercase text-slate-500 text-xs lg:text-sm tracking-wider">Quý 3 / 2026</span>
                      <h4 className="text-xl lg:text-2xl font-black text-on-surface mt-1.5">Báo Cáo Kiểm Toán Quý</h4>
                      <p className="text-base text-slate-600 mt-2 font-medium">Tổng 3.840 km • Đã chi <span className="font-bold text-slate-900">98.600.000 ₫</span></p>
                    </div>
                    <button className="self-start px-5 py-2.5 rounded-xl bg-primary text-white text-sm lg:text-base font-semibold hover:bg-slate-800 flex items-center gap-2 shadow-md transition-all">
                      <span className="material-symbols-outlined text-lg">download</span> Xuất File Excel / CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CÀI ĐẶT (SETTINGS) */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface">Cài Đặt & Tùy Chọn</h2>
                  <p className="text-slate-600 text-sm sm:text-base mt-1">
                    Cấu hình ảnh đại diện, phương tiện di chuyển, định mức hoàn ứng và thông tin tài khoản.
                  </p>
                </div>

                {/* Avatar & Profile Card */}
                <div className="p-6 lg:p-8 bg-surface-container-lowest border border-slate-200 rounded-3xl shadow-sm space-y-6">
                  <div className="font-extrabold text-slate-900 text-lg">Ảnh Đại Diện & Hồ Sơ Cá Nhân</div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img
                      alt="Current Avatar"
                      src={userAvatar}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
                    />
                    <div className="space-y-2.5 flex-1 w-full text-center sm:text-left">
                      <label className="text-xs lg:text-sm font-bold uppercase text-slate-500 tracking-wider">
                        Chọn Avatar Có Sẵn
                      </label>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3.5">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <img
                            key={idx}
                            src={preset}
                            alt={`Avatar option ${idx + 1}`}
                            onClick={() => handleSelectAvatar(preset)}
                            className={`w-13 h-13 rounded-full object-cover cursor-pointer transition-all hover:scale-110 ${
                              userAvatar === preset
                                ? 'ring-4 ring-primary shadow-lg scale-105'
                                : 'ring-2 ring-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs lg:text-sm font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                        Tên Hiển Thị
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                          localStorage.setItem('expensely_user_name', e.target.value);
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-bold uppercase text-slate-500 tracking-wider mb-1.5">
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
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 lg:p-6 bg-surface-container-lowest border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                      <div className="font-bold text-on-surface text-base">Tự động kích hoạt GPS định vị</div>
                      <div className="text-sm text-slate-500 mt-0.5">Ghi nhận tọa độ vi mô khi bắt đầu chuyến đi</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                  </div>
                  <div className="p-5 lg:p-6 bg-surface-container-lowest border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                      <div className="font-bold text-on-surface text-base">Thông báo phê duyệt chi phí tức thì</div>
                      <div className="text-sm text-slate-500 mt-0.5">Gửi thông báo đến phòng kế toán ngay khi kết thúc lộ trình</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ═══════════════ MOBILE CURVED BOTTOM NAVIGATION BAR ═══════════════ */}
        <MobileCurvedNavBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>

      {/* ═══════════════ MODAL: GHI NHẬN CHI PHÍ ═══════════════ */}
      {showLogExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 lg:p-8 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-on-surface">Ghi Nhận Chi Phí Mới</h3>
                  <p className="text-xs lg:text-sm text-slate-500 font-medium">Dự án Phoenix</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogExpenseModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
              <div>
                <label className="block text-slate-700 mb-1.5 uppercase tracking-wider text-xs lg:text-sm font-bold">
                  Nội Dung / Mô Tả Chi Phí
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ăn tối tiếp khách, Đổ xăng xe..."
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 font-medium text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 uppercase tracking-wider text-xs lg:text-sm font-bold">
                  Số Tiền (VNĐ)
                </label>
                <input
                  type="number"
                  step="1000"
                  required
                  placeholder="Ví dụ: 250.000 hoặc 1.500.000"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 font-bold text-base"
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

              <div className="flex gap-3 mt-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogExpenseModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-on-surface font-bold transition-colors text-base"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-slate-800 text-on-primary font-bold transition-colors shadow-md text-base"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 lg:p-8 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">map</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-on-surface">Lịch Trình Dự Án Phoenix</h3>
                  <p className="text-xs lg:text-sm text-slate-500 font-medium">Frankfurt • Kế hoạch 3 ngày</p>
                </div>
              </div>
              <button
                onClick={() => setShowItineraryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5">
                  01
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-on-surface">Ngày 1: Họp Khởi Động Với Khách Hàng</h4>
                  <p className="text-xs lg:text-sm text-slate-600 mt-1">Làm việc với ban quản trị Acme Corp, kiểm toán hệ thống & lắp đặt tủ rack.</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-secondary/10 text-secondary text-xs font-bold">Đã hoàn thành</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5">
                  02
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-on-surface">Ngày 2: Triển Khai Phần Cứng Giai Đoạn 2</h4>
                  <p className="text-xs lg:text-sm text-slate-600 mt-1">Cấu hình máy chủ, thiết lập đường truyền telemetry tốc độ cao & kiểm thử.</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">Đang thực hiện (Dự kiến 45p)</span>
                </div>
              </div>

              <div className="flex gap-4 items-start opacity-70">
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5">
                  03
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-on-surface">Ngày 3: Đào Tạo Nhân Sự & Bàn Giao</h4>
                  <p className="text-xs lg:text-sm text-slate-600 mt-1">Bàn giao tài liệu hướng dẫn, buổi huấn luyện nhân viên và khởi hành về.</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Sắp tới</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowItineraryModal(false)}
                className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-slate-800 transition-colors shadow-md text-base"
              >
                Đóng Lịch Trình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ POPUP: THÔNG BÁO ═══════════════ */}
      {showNotificationsModal && (
        <div className="fixed top-20 right-4 sm:right-10 z-50 w-88 max-w-[90vw] bg-surface-container-lowest rounded-3xl p-5 border border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="font-bold text-base text-on-surface">Thông Báo</span>
            <span className="text-xs font-bold text-secondary bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">2 tin mới</span>
          </div>
          <div className="space-y-2.5 text-xs lg:text-sm">
            <div className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100">
              <div className="font-bold text-on-surface text-sm">Chi phí đã được phê duyệt</div>
              <div className="text-slate-600 mt-1">Hóa đơn xăng xe (650.000 ₫) đã được hoàn ứng.</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100">
              <div className="font-bold text-on-surface text-sm">Cảnh báo giao thông</div>
              <div className="text-slate-600 mt-1">Đoạn cao tốc A3 hướng Frankfurt đã thông thoáng.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
