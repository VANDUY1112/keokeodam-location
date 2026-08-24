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
import LandingPageView from './components/LandingPageView';
import LandingPageQRModal from './components/LandingPageQRModal';
import UserLoginPageView from './components/UserLoginPageView';
import AdminLoginPageView from './components/AdminLoginPageView';
import { formatVND, parseVNDNumber } from './utils/format';
import { api } from './services/api.js';
import { supabase } from './services/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get('page') || urlParams.get('tab') || window.location.hash.replace('#', '');
      if (pageParam === 'landing' || pageParam === 'home' || pageParam === 'reviews') {
        return 'landing';
      }
      if (pageParam === 'admin-login' || pageParam === 'admin') {
        return 'admin-login';
      }
      if (pageParam === 'login' || pageParam === 'user-login' || pageParam === 'signin') {
        return 'user-login';
      }
      if (['dashboard', 'tracking', 'expenses', 'history', 'reports', 'settings'].includes(pageParam)) {
        return pageParam;
      }
      // If a stored token exists, go to dashboard, otherwise default to landing page for guests/scanned users
      const hasToken = localStorage.getItem('locahome_token');
      return hasToken ? 'dashboard' : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('locahome_token'));
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('locahome_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName && (/Duy/i.test(parsed.fullName) && /(Hồ|Hổ|Ho)/i.test(parsed.fullName))) {
          parsed.fullName = 'Hồ Văn Duy';
        }
        localStorage.setItem('locahome_current_user', JSON.stringify(parsed));
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [showLandingQRModal, setShowLandingQRModal] = useState(false);
  const [loginInitialType, setLoginInitialType] = useState('user');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogExpenseModal, setShowLogExpenseModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Persistent State with backend API + LocalStorage fallback
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
      return [];
    } catch {
      return [];
    }
  });

  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem('expensely_trips');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [speakers, setSpeakers] = useState([]);
  const [toast, setToast] = useState(null);
  const [showVietQRModal, setShowVietQRModal] = useState(false);
  const [vietQRData, setVietQRData] = useState({ amount: 280000, note: 'LOCAHOME THUE LOA' });

  // Initial Real Data Loading from Backend SQLite API
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const [expRes, rentRes, spkRes] = await Promise.allSettled([
          api.getExpenses(),
          api.getRentals(),
          api.getSpeakers()
        ]);

        if (expRes.status === 'fulfilled' && expRes.value?.data?.expenses) {
          const apiExp = expRes.value.data.expenses.map(e => ({
            id: e.id,
            title: e.title,
            subtitle: e.subtitle || 'Hôm nay',
            amount: formatVND(e.amount),
            status: e.status || 'Đã duyệt',
            statusColor: e.status === 'Chờ duyệt' ? 'text-surface-tint' : 'text-secondary',
            icon: e.icon || 'receipt',
            hoverColor: 'group-hover:bg-primary/10 group-hover:text-primary',
            category: e.category
          }));
          if (apiExp.length > 0) {
            setExpenses(apiExp);
          }
        }

        if (rentRes.status === 'fulfilled' && Array.isArray(rentRes.value?.data)) {
          const calcDist = (lat, lng, hours = 4) => {
            if (!lat || !lng) return parseFloat((hours * 1.8).toFixed(1));
            const wLat = 10.8505, wLng = 106.7718;
            const dLat = (lat - wLat) * 111;
            const dLng = (lng - wLng) * 111 * Math.cos((wLat * Math.PI) / 180);
            const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 1.35;
            return dist > 0.5 ? parseFloat(dist.toFixed(1)) : parseFloat((hours * 1.8).toFixed(1));
          };

          const apiTrips = rentRes.value.data.map(r => {
            const dist = calcDist(r.destLat, r.destLng, r.durationHours);
            return {
              id: r.id,
              title: `Giao Loa: ${r.customerName} - ${r.customerPhone}`,
              subtitle: `${r.speakerName || 'Loa Kéo'} • ${dist} km • ${r.durationHours}h • ${formatVND(r.totalAmount)}`,
              distanceKm: dist,
              duration: `${r.durationHours}h`,
              cost: r.totalAmount,
              speakerName: r.speakerName || 'Loa Kéo',
              customerName: r.customerName,
              status: r.status === 'active' ? 'Đang thuê' : r.status === 'completed' ? 'Đã bàn giao' : 'Đã huỷ',
              statusBadge: r.status === 'active'
                ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                : r.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                  : 'bg-red-50 text-red-700 border-red-200/60',
              icon: 'speaker',
              pathCoordinates: [
                { lat: 10.8505, lng: 106.7718 },
                { lat: r.destLat || 10.8522, lng: r.destLng || 106.7725 }
              ]
            };
          });
          if (apiTrips.length > 0) {
            setTrips(apiTrips);
          }
        }

        if (spkRes.status === 'fulfilled' && Array.isArray(spkRes.value?.data) && spkRes.value.data.length > 0) {
          setSpeakers(spkRes.value.data);
        }
      } catch (err) {
        console.warn('Real data loading notice:', err.message);
      }
    };

    loadRealData();
  }, []);

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

  // Supabase Real Social Auth State Listener
  useEffect(() => {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          if (!localStorage.getItem('locahome_token')) {
            setCurrentUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('locahome_current_user');
          }
          return;
        }

        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const identData = session.user.identities?.[0]?.identity_data || {};

          let parsedFullName = meta.full_name || meta.name || identData.full_name || identData.name;

          // If separate Vietnamese name fields exist (last_name, middle_name, first_name)
          if (meta.last_name && meta.first_name) {
            parsedFullName = [meta.last_name, meta.middle_name, meta.first_name].filter(Boolean).join(' ');
          } else if (identData.last_name && identData.first_name) {
            parsedFullName = [identData.last_name, identData.middle_name, identData.first_name].filter(Boolean).join(' ');
          }

          if (!parsedFullName) {
            parsedFullName = session.user.email?.split('@')[0] || 'Khách Hàng';
          }

          if (parsedFullName && (/Duy/i.test(parsedFullName) && /(Hồ|Hổ|Ho)/i.test(parsedFullName))) {
            parsedFullName = 'Hồ Văn Duy';
          }

          const rawAvatar = meta.avatar_url || meta.picture || identData.avatar_url || identData.picture || meta.photos?.[0]?.value || '';

          const user = {
            id: session.user.id,
            email: session.user.email || session.user.phone,
            fullName: parsedFullName,
            avatarUrl: rawAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: 'customer',
            points: 120
          };
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('locahome_current_user', JSON.stringify(user));
        }
      });
      return () => subscription?.unsubscribe();
    } catch (e) {
      console.warn('Supabase auth state listener error:', e);
    }
  }, []);

  const [newExpense, setNewExpense] = useState({
    title: '',
    project: 'Dịch vụ Kẹo Kéo Dặm',
    amount: '',
    category: 'Ăn uống',
  });

  const handleAddExpense = async (e) => {
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
      id: `EXP-${Date.now().toString().slice(-6)}`,
      title: newExpense.title,
      subtitle: `Hôm nay • ${newExpense.project}`,
      amount: formattedAmount,
      status: 'Đã duyệt',
      statusColor: 'text-secondary',
      icon,
      hoverColor,
      category: newExpense.category
    };

    // Save to real SQLite backend API
    try {
      await api.createExpense({
        title: newExpense.title,
        amount: rawNum,
        category: newExpense.category,
        subtitle: `Hôm nay • ${newExpense.project}`,
        icon,
        status: 'Đã duyệt'
      });
    } catch (err) {
      console.warn('Could not save to backend API:', err.message);
    }

    setExpenses([item, ...expenses]);
    setNewExpense({ title: '', project: 'Dịch vụ Kẹo Kéo Dặm', amount: '', category: 'Ăn uống' });
    setShowLogExpenseModal(false);
  };

  const handleAddTrip = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await api.updateRentalStatus(tripId, 'cancelled');
    } catch (e) {
      console.warn('Cancel rental in backend:', e.message);
    }
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
    const saved = localStorage.getItem('expensely_user_name');
    if (!saved || saved === 'Alex Johnson') {
      localStorage.setItem('expensely_user_name', 'Trần Anh Tuấn');
      return 'Trần Anh Tuấn';
    }
    return saved;
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

  // Synchronize URL with active tab so scanning QR or sharing link opens exact page
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (activeTab === 'landing') {
        url.searchParams.set('page', 'landing');
      } else if (activeTab === 'login') {
        url.searchParams.set('page', 'login');
      } else {
        url.searchParams.set('page', activeTab);
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // ignore
    }
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    api.setToken(null);
    localStorage.removeItem('locahome_token');
    localStorage.removeItem('locahome_current_user');
    // Clear all Supabase session storage keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowProfileMenu(false);
    setActiveTab('landing');
  };

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: 'dashboard' },
    { id: 'tracking', label: 'Giao Loa & GPS', icon: 'two_wheeler' },
    { id: 'expenses', label: 'Doanh Thu & Chi Phí', icon: 'payments' },
    { id: 'history', label: 'Lịch Sử Đơn Thuê', icon: 'speaker' },
    { id: 'reports', label: 'Báo Cáo & Thống Kê', icon: 'assessment' },
    { id: 'settings', label: 'Cài Đặt', icon: 'settings' },
  ];

  // ═══════════════ VIEW 1A: TRANG ĐĂNG NHẬP KHÁCH HÀNG (USER LOGIN) ═══════════════
  if (activeTab === 'user-login' || activeTab === 'login') {
    return (
      <div className="min-h-screen">
        <UserLoginPageView
          onLoginSuccess={(user) => {
            setIsAuthenticated(true);
            setCurrentUser(user);
            setActiveTab('landing');
          }}
          onNavigateToLanding={() => setActiveTab('landing')}
          setToast={setToast}
        />

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 border border-slate-700 max-w-md">
            <span className="material-symbols-outlined text-emerald-400 text-2xl shrink-0">check_circle</span>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{toast.title}</div>
              <div className="text-xs text-slate-300 line-clamp-2">{toast.desc || toast.message}</div>
            </div>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white shrink-0 ml-auto">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════ VIEW 1B: TRANG ĐĂNG NHẬP QUẢN TRỊ (ADMIN & SHIPPER LOGIN) ═══════════════
  if (activeTab === 'admin-login') {
    return (
      <div className="min-h-screen">
        <AdminLoginPageView
          onLoginSuccess={(user) => {
            setIsAuthenticated(true);
            setCurrentUser(user);
            if (user.fullName) {
              setUserName(user.fullName);
              localStorage.setItem('expensely_user_name', user.fullName);
            }
            if (user.avatarUrl) {
              setUserAvatar(user.avatarUrl);
              localStorage.setItem('expensely_user_avatar', user.avatarUrl);
            }
            localStorage.setItem('locahome_current_user', JSON.stringify(user));
            setActiveTab('dashboard');
          }}
          onNavigateToLanding={() => setActiveTab('landing')}
          setToast={setToast}
        />

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 border border-slate-700 max-w-md">
            <span className="material-symbols-outlined text-emerald-400 text-2xl shrink-0">check_circle</span>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{toast.title}</div>
              <div className="text-xs text-slate-300 line-clamp-2">{toast.desc || toast.message}</div>
            </div>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white shrink-0 ml-auto">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════ VIEW 2: TRANG KHÁCH HÀNG (LANDING PAGE) ═══════════════
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[#fdf7ff]">
        <LandingPageView
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateToAdmin={() => isAuthenticated ? setActiveTab('dashboard') : setActiveTab('admin-login')}
          onNavigateToLogin={() => setActiveTab('user-login')}
          onOpenQRModal={() => setShowLandingQRModal(true)}
          onOpenVietQR={openVietQR}
          onAddBooking={(booking) => {
            handleAddTrip({
              title: `Đơn Khách: ${booking.customerName} - ${booking.customerPhone}`,
              subtitle: `Mới Đặt • ${booking.speakerName} • ${booking.duration}`,
              cost: booking.totalAmount,
              speakerName: booking.speakerName,
              customerName: booking.customerName,
              status: 'Đã nhận đơn',
              statusBadge: 'bg-pink-50 text-pink-700 border-pink-200/60',
              icon: 'speaker',
            });
            setToast({
              title: '🎉 Đã Nhận Đơn Thuê Mới!',
              desc: `${booking.customerName} vừa đặt thuê ${booking.speakerName}!`,
              type: 'success',
            });
          }}
        />

        {/* Landing Page QR Code & Standee Modal */}
        {showLandingQRModal && (
          <LandingPageQRModal
            isOpen={showLandingQRModal}
            onClose={() => setShowLandingQRModal(false)}
            setToast={setToast}
          />
        )}

        {/* VietQR Modal */}
        {showVietQRModal && (
          <VietQRModal
            isOpen={showVietQRModal}
            onClose={() => setShowVietQRModal(false)}
            amount={vietQRData.amount}
            note={vietQRData.note}
          />
        )}

        {/* Toast Alert Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 border border-slate-700 max-w-md">
            <span className="material-symbols-outlined text-emerald-400 text-2xl shrink-0">check_circle</span>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{toast.title}</div>
              <div className="text-xs text-slate-300 line-clamp-2">{toast.desc || toast.message}</div>
            </div>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white shrink-0 ml-auto">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}
      </div>
    );
  }

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
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group text-left ${activeTab === item.id
                  ? 'bg-primary text-white shadow-md font-bold'
                  : item.highlight
                    ? 'bg-[#ffb7ce]/30 text-[#864d61] hover:bg-[#ffb7ce]/50 font-bold border border-[#ffd9e3]'
                    : 'text-slate-600 hover:bg-surface-container-high hover:text-slate-900 font-semibold'
                }`}
            >
              <span className={`material-symbols-outlined text-[24px] transition-transform ${activeTab === item.id
                  ? 'text-white'
                  : item.highlight
                    ? 'text-[#864d61]'
                    : 'text-slate-500 group-hover:scale-110 group-hover:text-slate-900'
                }`}>
                {item.icon}
              </span>
              <span className="text-[15px] lg:text-base">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ═══════════════ MOBILE DRAWER MENU (PREMIUM SLIDE & BLUR) ═══════════════ */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`relative w-80 max-w-[85vw] bg-white h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.3)] p-5 z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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

          <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === item.id
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${activeTab === item.id ? 'text-white' : 'text-slate-500'
                  }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Mobile Drawer Actions */}
          <div className="pt-3 border-t border-slate-100 mt-auto flex flex-col gap-2">
            <button
              onClick={() => {
                setShowLandingQRModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white hover:bg-rose-50 text-[#864d61] font-bold text-xs shadow-xs transition-all border border-rose-200 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] text-rose-600">qr_code_2</span>
              <span>Mã QR Quán</span>
            </button>

            <button
              onClick={() => {
                openVietQR(280000, 'LOCAHOME THUE LOA');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Tạo VietQR Thu Tiền</span>
            </button>
          </div>
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

          {/* Right Header: QR Button, VietQR, Notifications & Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Landing QR Code Generator Button (Desktop/Tablet only) */}
            <button
              onClick={() => setShowLandingQRModal(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-[#864d61] font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all border border-rose-200 cursor-pointer"
              title="Mở mã QR quán / in bảng đặt bàn"
            >
              <span className="material-symbols-outlined text-[18px] text-rose-600">qr_code_2</span>
              <span>Mã QR Quán</span>
            </button>

            {/* Quick VietQR Button (Desktop/Tablet only) */}
            <button
              onClick={() => openVietQR(280000, 'LOCAHOME THUE LOA')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Tạo mã VietQR thu tiền"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>Thu Tiền VietQR</span>
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
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:bg-slate-100 py-1.5 px-3 sm:px-3.5 rounded-2xl transition-all group border border-slate-200 bg-white shadow-xs"
              >
                <span className="font-bold text-slate-800 text-xs sm:text-sm md:text-base truncate max-w-[120px] sm:max-w-[180px]">
                  {userName}
                </span>
                <span className={`material-symbols-outlined text-[18px] sm:text-[20px] text-slate-500 transition-transform duration-200 shrink-0 ${showProfileMenu ? 'rotate-180 text-primary' : ''}`}>
                  expand_more
                </span>
              </div>

              {/* Profile Dropdown Menu (Open & Close transition) */}
              <div
                className={`absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-3xl shadow-2xl p-3 z-50 flex flex-col space-y-3 transition-all duration-200 ease-out origin-top-right ${showProfileMenu
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
                  }`}
              >
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <div className="font-extrabold text-base text-slate-900 truncate">{userName}</div>
                </div>

                <div className="pt-1 flex items-center justify-between gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 border border-rose-200 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Đăng Xuất</span>
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
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
                onOpenLandingQRModal={() => setShowLandingQRModal(true)}
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
                onSelectSpeaker={(id) => { }}
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
                  <p className="text-xs lg:text-sm text-slate-500 font-medium">Dịch vụ Kẹo Kéo Dặm</p>
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

      {/* ═══════════════ MODAL: XEM LỊCH TRÌNH GIAO NHẬN LOA ═══════════════ */}
      {showItineraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 lg:p-8 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">map</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-on-surface">Lộ Trình Giao Nhận Loa</h3>
                  <p className="text-xs lg:text-sm text-slate-500 font-medium">Kế hoạch phục vụ hôm nay • Kẹo Kéo Dặm</p>
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
                  <h4 className="text-base font-bold text-on-surface">Ca Sáng: Bàn Giao Loa Khai Trương & Tiệc Trưa</h4>
                  <p className="text-xs lg:text-sm text-slate-600 mt-1">Giao dàn Loa Bass 40 Nanomax kèm 2 micro UHF sạc đầy pin và hướng dẫn kết nối Bluetooth.</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-secondary/10 text-secondary text-xs font-bold">Đã hoàn thành</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5">
                  02
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-on-surface">Ca Chiều Tối: Phục Vụ Tiệc Sinh Nhật & Karaoke</h4>
                  <p className="text-xs lg:text-sm text-slate-600 mt-1">Điều phối loa Đôi Bass 50 công suất lớn, căn chỉnh Echo & Reverb chuyên nghiệp.</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">Đang phục vụ</span>
                </div>
              </div>

              <div className="flex gap-4 items-start opacity-80">
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5">
                  03
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-on-surface">Ca Đêm: Thu Hồi Thiết Bị & Sạc Pin Bảo Dưỡng</h4>
                  <p className="text-xs lg:text-sm text-slate-600 mt-1">Nhận lại loa, kiểm tra micro, vệ sinh màng loa và cắm sạc bình ắc quy tại kho tổng.</p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">Dự kiến 22:30</span>
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
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-200 ${showNotificationsModal
            ? 'pointer-events-auto visible'
            : 'pointer-events-none invisible'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-slate-950/20 backdrop-blur-xs transition-opacity duration-200 ease-out ${showNotificationsModal ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setShowNotificationsModal(false)}
        ></div>

        {/* Animated Dropdown Card */}
        <div
          className={`fixed top-20 right-4 sm:right-10 z-50 w-88 sm:w-96 max-w-[92vw] bg-white rounded-3xl p-5 border border-slate-200 shadow-2xl flex flex-col space-y-3 transition-all duration-200 ease-out origin-top-right ${showNotificationsModal
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-3'
            }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900">Thông Báo Hệ Thống</span>
              <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {Math.max(1, trips.length)} đơn
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
            {/* Notification 1: Recent Rental */}
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
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">Đơn thuê loa hoạt động</span>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">Hôm nay</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  {trips.length > 0 ? trips[0].title : 'Hệ thống Kẹo Kéo Dặm sẵn sàng tiếp nhận đơn đặt mới.'}
                </p>
              </div>
            </div>

            {/* Notification 2: Speaker Fleet Status */}
            <div
              onClick={() => {
                setActiveTab('tracking');
                setShowNotificationsModal(false);
              }}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">speaker</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">Kho thiết bị sẵn sàng</span>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">Trực tiếp</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  {speakers.length > 0 ? `Đang quản lý ${speakers.length} dàn loa kéo công suất lớn tại kho tổng.` : 'Đã kết nối cơ sở dữ liệu kho loa.'}
                </p>
              </div>
            </div>

            {/* Notification 3: Expenses Record */}
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
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">Sổ thu chi & Hóa đơn</span>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">Cập nhật</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                  {expenses.length > 0 ? `Đã ghi nhận ${expenses.length} khoản chi phí vận hành.` : 'Chưa có khoản chi phát sinh.'}
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

      {/* ═══════════════ LANDING PAGE QR CODE & STANDEE MODAL ═══════════════ */}
      {showLandingQRModal && (
        <LandingPageQRModal
          isOpen={showLandingQRModal}
          onClose={() => setShowLandingQRModal(false)}
          setToast={setToast}
        />
      )}

      {/* ═══════════════ VIETQR PAYMENT MODAL ═══════════════ */}
      <VietQRModal
        isOpen={showVietQRModal}
        onClose={() => setShowVietQRModal(false)}
        initialAmount={vietQRData.amount}
        initialNote={vietQRData.note}
        setToast={setToast}
        onConfirmPayment={(data) => {
          // Add income record to expenses list
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');
          const timeStr = `${hours}:${minutes}:${seconds}`;
          const formattedAmt = formatVND(data.amount).replace(' ₫', '');
          const incomeRecord = {
            id: Date.now(),
            title: `KEO KEO DAM nhan ${formattedAmt}`,
            subtitle: `Thành công lúc ${timeStr}`,
            amount: formatVND(data.amount),
            status: 'Thành công',
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
