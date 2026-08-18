import React, { useState, useRef, useEffect } from 'react';
import DashboardView from './components/DashboardView';
import TrackingView from './components/TrackingView';
import ExpensesView from './components/ExpensesView';
import HistoryView from './components/HistoryView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import CustomDropdown from './components/CustomDropdown';
import MobileCurvedNavBar from './components/MobileCurvedNavBar';
import VietQRModal from './components/VietQRModal';
import { formatVND, parseVNDNumber } from './utils/format';
import { INITIAL_SPEAKERS } from './data/speakersData';

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

  const [speakers, setSpeakers] = useState(INITIAL_SPEAKERS);
  const [toast, setToast] = useState(null);
  const [showVietQRModal, setShowVietQRModal] = useState(false);
  const [vietQRData, setVietQRData] = useState({ amount: 280000, note: 'LOCAHOME THUE LOA' });

  const openVietQR = (amount = 280000, note = 'LOCAHOME THUE LOA') => {
    setVietQRData({ amount, note });
    setShowVietQRModal(true);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  const NAV_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230f172a"/><polygon points="72,28 56,72 47,47 28,56" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg>`;

  const [userAvatar, setUserAvatar] = useState(() => {
    const saved = localStorage.getItem('expensely_user_avatar');
    // If no saved avatar or old photo preset or old circular SVG, default to new NAV_AVATAR
    if (!saved || saved.includes('unsplash.com') || saved.includes('<circle')) {
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
        <div
          onClick={() => setActiveTab('dashboard')}
          className="h-20 flex items-center px-6 gap-3 border-b border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors group"
          title="Trở về Trang Tổng Quan"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
          </div>
          <span className="text-xl text-slate-900 tracking-tight font-black">Locahome</span>
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
          <div
            onClick={() => {
              setActiveTab('dashboard');
              setMobileMenuOpen(false);
            }}
            className="flex items-center pb-4 border-b border-slate-100 mb-4 cursor-pointer group"
            title="Trở về Trang Tổng Quan"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
              </div>
              <span className="font-bold text-slate-900 text-lg">Locahome</span>
            </div>
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
        <header className="fixed top-0 left-0 lg:left-72 right-0 bg-white/95 backdrop-blur-xl z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-200 shadow-xs mobile-header-bar">
          {/* Mobile Left: Hamburger Button */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl active:scale-95 transition-transform"
              title="Mở menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>

          {/* Spacer for desktop */}
          <div className="hidden lg:block"></div>

          {/* Right Header: VietQR Quick Button, Notifications & Profile Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Quick VietQR Button */}
            <button
              onClick={() => openVietQR(280000, 'LOCAHOME THUE LOA')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all"
              title="Tạo mã VietQR thu tiền"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              <span className="hidden sm:inline">Tạo Mã QR</span>
            </button>

            <button
              onClick={() => setShowNotificationsModal(!showNotificationsModal)}
              className="relative p-1.5 text-slate-700 hover:text-slate-950 transition-transform active:scale-90 group focus:outline-none"
              title="Thông báo"
            >
              <span className="material-symbols-outlined text-[26px] group-hover:rotate-12 transition-transform duration-200 block">
                notifications
              </span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
            </button>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={profileMenuRef}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-slate-100 p-1 sm:p-1.5 sm:pr-3.5 rounded-2xl transition-all group border border-slate-200 bg-white shadow-xs"
              >
                <img
                  alt="Profile"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-slate-300 shadow-xs"
                  src={userAvatar}
                />
                <span className="font-bold text-slate-800 text-sm sm:text-base hidden sm:inline">{userName}</span>
                <span className={`material-symbols-outlined text-[20px] text-slate-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180 text-primary' : ''}`}>
                  expand_more
                </span>
              </div>

              {/* Profile Dropdown Menu (Open & Close transition) */}
              <div
                className={`absolute right-0 top-full mt-2 w-76 bg-white border border-slate-200 rounded-3xl shadow-2xl p-3 z-50 flex flex-col space-y-2 transition-all duration-200 ease-out origin-top-right ${
                  showProfileMenu
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
                }`}
              >
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                  <img
                    alt="Profile"
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs"
                    src={userAvatar}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-slate-900 truncate">{userName}</div>
                    <div className="text-xs text-slate-500 truncate">Quản Trị Viên Locahome</div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-800 text-[10px] font-bold mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Đang Hoạt Động
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs sm:text-sm">
                  <button
                    onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors text-left group"
                  >
                    <span className="material-symbols-outlined text-[20px] text-slate-500 group-hover:text-slate-900">settings</span>
                    <span className="font-semibold">Cài Đặt & Cấu Hình</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('reports'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors text-left group"
                  >
                    <span className="material-symbols-outlined text-[20px] text-slate-500 group-hover:text-slate-900">assessment</span>
                    <span className="font-semibold">Báo Cáo & Thống Kê</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('tracking'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors text-left group"
                  >
                    <span className="material-symbols-outlined text-[20px] text-slate-500 group-hover:text-slate-900">two_wheeler</span>
                    <span className="font-semibold">Giao Loa & GPS</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('expenses'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors text-left group"
                  >
                    <span className="material-symbols-outlined text-[20px] text-slate-500 group-hover:text-slate-900">payments</span>
                    <span className="font-semibold">Sổ Thu Chi & Hoá Đơn</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      if (window.confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="text-slate-500 hover:text-slate-900 font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    Đặt Lại Dữ Liệu
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="text-slate-400 hover:text-slate-700 font-bold"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full mobile-main-content min-h-screen">
          <div key={activeTab} className="p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto pb-24 lg:pb-8 animate-page-enter">
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
                onOpenVietQR={openVietQR}
                onAddTripRecord={handleAddTrip}
                onAddExpenseRecord={(rec) => {
                  setExpenses((prev) => [
                    {
                      id: Date.now(),
                      title: rec.title,
                      subtitle: `Hôm nay • Thu tiền giao loa`,
                      amount: formatVND(rec.amount),
                      status: 'Đã duyệt',
                      statusColor: 'text-secondary',
                      icon: 'speaker',
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
                onOpenVietQR={openVietQR}
                onNavigateToTracking={() => setActiveTab('tracking')}
              />
            )}

            {/* TAB 5: BÁO CÁO & THỐNG KÊ (REPORTS) */}
            {activeTab === 'reports' && (
              <ReportsView
                speakers={speakers}
                onSelectSpeaker={(id) => {}}
                setActiveTab={setActiveTab}
                setToast={setToast}
              />
            )}

            {/* TAB 6: CÀI ĐẶT (SETTINGS) */}
            {activeTab === 'settings' && (
              <SettingsView
                userAvatar={userAvatar}
                setUserAvatar={setUserAvatar}
                userName={userName}
                setUserName={setUserName}
                setToast={setToast}
                onResetAllData={() => {
                  setExpenses(INITIAL_EXPENSES);
                  setTrips(INITIAL_TRIPS);
                  setSpeakers(INITIAL_SPEAKERS);
                  localStorage.removeItem('expensely_expenses');
                  localStorage.removeItem('expensely_trips');
                }}
              />
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

      {/* ═══════════════ POPUP: THÔNG BÁO (ANIMATED OPEN & CLOSE) ═══════════════ */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-200 ${
          showNotificationsModal
            ? 'pointer-events-auto visible'
            : 'pointer-events-none invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-slate-950/20 backdrop-blur-xs transition-opacity duration-200 ease-out ${
            showNotificationsModal ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setShowNotificationsModal(false)}
        ></div>

        {/* Animated Dropdown Card */}
        <div
          className={`fixed top-20 right-4 sm:right-10 z-50 w-88 sm:w-96 max-w-[92vw] bg-white rounded-3xl p-5 border border-slate-200 shadow-2xl flex flex-col space-y-3 transition-all duration-200 ease-out origin-top-right ${
            showNotificationsModal
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-3'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900">Thông Báo</span>
              <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                3 mới
              </span>
            </div>
            <button
              onClick={() => setShowNotificationsModal(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar">
            {/* Notification 1 */}
            <div
              onClick={() => {
                setActiveTab('history');
                setShowNotificationsModal(false);
              }}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">Đơn thuê mới hoàn tất</span>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">5p trước</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  Loa Bass 40 Nanomax đã bàn giao thành công cho khách Anh Hoàng (Tiệc Sinh Nhật).
                </p>
              </div>
            </div>

            {/* Notification 2 */}
            <div
              onClick={() => {
                setActiveTab('tracking');
                setShowNotificationsModal(false);
              }}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">battery_alert</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">Nhắc pin loa LKK-04</span>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">25p trước</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  Pin loa Dalton 600W còn 55%, đã thuê hơn 4 tiếng tại Kha Vạn Cân.
                </p>
              </div>
            </div>

            {/* Notification 3 */}
            <div
              onClick={() => {
                setActiveTab('expenses');
                setShowNotificationsModal(false);
              }}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">Đã duyệt chi phí xăng xe</span>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">1h trước</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  Hóa đơn 120.000 ₫ trạm xăng Petrolimex đã được cập nhật vào sổ chi tiêu.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Đã cập nhật tất cả</span>
            <button
              onClick={() => setShowNotificationsModal(false)}
              className="font-bold text-slate-900 hover:underline"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════ VIETQR PAYMENT MODAL ═══════════════ */}
      <VietQRModal
        isOpen={showVietQRModal}
        onClose={() => setShowVietQRModal(false)}
        initialAmount={vietQRData.amount}
        initialNote={vietQRData.note}
        setToast={setToast}
        onConfirmPayment={(data) => {
          // Add income record to expenses list
          const incomeRecord = {
            id: Date.now(),
            title: `Thu tiền VietQR - ${data.note}`,
            subtitle: `Vừa xong • Chuyển khoản VietQR Napas 247`,
            amount: formatVND(data.amount),
            status: 'Đã duyệt',
            statusColor: 'text-secondary',
            icon: 'qr_code_2',
            hoverColor: 'group-hover:bg-emerald-500/10 group-hover:text-emerald-600',
          };
          setExpenses([incomeRecord, ...expenses]);
        }}
      />

      {/* ═══════════════ TOAST NOTIFICATION ═══════════════ */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 border border-slate-700 max-w-md">
          <span className="material-symbols-outlined text-emerald-400 text-2xl shrink-0">check_circle</span>
          <div className="min-w-0">
            <div className="text-sm font-bold truncate">{toast.title}</div>
            <div className="text-xs text-slate-300 line-clamp-2">{toast.desc}</div>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white shrink-0 ml-auto">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
