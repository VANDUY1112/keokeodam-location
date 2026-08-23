import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, User, Heart, Gift } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPageView({
  initialType = 'user', // 'user' | 'admin'
  onLoginSuccess,
  onNavigateToLanding,
  onOpenQRModal,
  setToast = null
}) {
  const [loginType, setLoginType] = useState(initialType); // 'user' | 'admin'
  
  // User state
  const [userEmail, setUserEmail] = useState('khachhang.dam@gmail.com');
  const [userPassword, setUserPassword] = useState('123456');

  // Admin / Shipper state
  const [adminRole, setAdminRole] = useState('admin'); // 'admin' | 'shipper'
  const [adminEmail, setAdminEmail] = useState('admin@locahome.vn');
  const [adminPassword, setAdminPassword] = useState('admin123456');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectAdminRole = (role) => {
    setAdminRole(role);
    setErrorMessage('');
    if (role === 'admin') {
      setAdminEmail('admin@locahome.vn');
      setAdminPassword('admin123456');
    } else {
      setAdminEmail('shipper1@locahome.vn');
      setAdminPassword('admin123456');
    }
  };

  const handleUserQuickFill = (name) => {
    setErrorMessage('');
    if (name === 'vip') {
      setUserEmail('anhhoang.vip@gmail.com');
      setUserPassword('123456');
    } else {
      setUserEmail('chilan.party@gmail.com');
      setUserPassword('123456');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const email = loginType === 'user' ? userEmail : adminEmail;
    const password = loginType === 'user' ? userPassword : adminPassword;

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);

      if (loginType === 'user') {
        // Customer login demo
        await new Promise(r => setTimeout(r, 400));
        const customerUser = {
          email: email.trim(),
          role: 'customer',
          fullName: email.includes('hoang') ? 'Anh Hoàng (VIP Bạc)' : 'Chị Lan (Thành Viên Mới)',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          points: 120,
        };

        if (setToast) {
          setToast({
            title: '💖 Đăng Nhập Thành Viên Thành Công!',
            desc: `Chào mừng ${customerUser.fullName} trở lại với Kẹo Kéo Dặm!`,
            type: 'success'
          });
        }

        if (onLoginSuccess) {
          onLoginSuccess(customerUser);
        }
      } else {
        // Admin / Shipper login via backend API
        const res = await api.login(email.trim(), password);

        if (res && (res.success || res.data?.token)) {
          const userData = res.data?.user || {
            email: email.trim(),
            role: email.includes('shipper') ? 'driver' : 'admin',
            fullName: email.includes('shipper') ? 'Nguyễn Văn Hùng' : 'Trần Anh Tuấn',
            avatarUrl: email.includes('shipper')
              ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          };

          if (rememberMe) {
            localStorage.setItem('locahome_saved_email', email.trim());
          } else {
            localStorage.removeItem('locahome_saved_email');
          }

          if (setToast) {
            setToast({
              title: '🎉 Đăng Nhập Thành Công',
              desc: `Xin chào ${userData.fullName || 'Quản trị viên'}!`,
              type: 'success'
            });
          }

          if (onLoginSuccess) {
            onLoginSuccess(userData);
          }
        } else {
          throw new Error(res?.error || 'Tài khoản hoặc mật khẩu không chính xác.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════
  // 🌸 THEME 1: GIAO DIỆN KHÁCH HÀNG (USER - LANDING PAGE STYLE)
  // ══════════════════════════════════════════════════════════
  if (loginType === 'user') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff0f4] via-[#fdf7ff] to-[#f0f4ff] flex flex-col justify-between relative text-slate-800 antialiased overflow-hidden selection:bg-[#ffb7ce] selection:text-[#864d61]">
        {/* Decorative Pastel Ambient Blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[20%] left-[15%] w-[550px] h-[550px] bg-[#ffd9e3]/60 rounded-full blur-[130px]"></div>
          <div className="absolute top-[50%] -right-[10%] w-[500px] h-[500px] bg-[#e0d6ff]/50 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[0%] left-[5%] w-[400px] h-[400px] bg-[#ffd6c4]/40 rounded-full blur-[120px]"></div>
        </div>

        {/* TOP HEADER */}
        <header className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between z-10">
          <div
            onClick={onNavigateToLanding}
            className="flex items-center gap-3 cursor-pointer group"
            title="Trở về Trang Khách Hàng"
          >
            <img
              src="/anh3.png"
              alt="Dặm"
              className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-headline text-2xl text-[#864d61] tracking-tight block font-black">Dặm</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoginType('admin');
                setErrorMessage('');
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 text-xs sm:text-sm font-bold border border-slate-200/80 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Dành Cho Quản Trị</span>
            </button>

            <button
              onClick={onNavigateToLanding}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-[#864d61] text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-[#ffd9e3]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </button>
          </div>
        </header>

        {/* MAIN USER LOGIN CARD */}
        <main className="w-full max-w-md mx-auto px-4 py-6 z-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-7 sm:p-9 border-2 border-[#ffd9e3] shadow-[0_20px_50px_rgba(134,77,97,0.12)]">
            
            {/* Header Title with cute icon */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#864d61] to-[#ff8fa3] text-white mx-auto flex items-center justify-center shadow-md shadow-pink-200 mb-3 group-hover:scale-105 transition-transform">
                <Heart className="w-7 h-7 fill-white" />
              </div>
              <h1 className="font-headline text-2xl sm:text-3xl text-[#864d61] tracking-tight font-black">
                Thành Viên Dặm
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Tích điểm ca thuê & nhận voucher ưu đãi 20%
              </p>
            </div>

            {/* Quick Demo Fill for Customer */}
            <div className="mb-5 bg-[#fff5f8] border border-[#ffd9e3] rounded-2xl p-3">
              <div className="text-[11px] font-bold text-[#864d61] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Chọn nhanh tài khoản mẫu (Demo)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleUserQuickFill('vip')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    userEmail === 'anhhoang.vip@gmail.com'
                      ? 'bg-[#864d61] text-white border-[#864d61] shadow-xs'
                      : 'bg-white text-slate-700 border-[#ffd9e3] hover:bg-pink-50'
                  }`}
                >
                  <span>⭐ Khách VIP</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUserQuickFill('new')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    userEmail === 'chilan.party@gmail.com'
                      ? 'bg-[#864d61] text-white border-[#864d61] shadow-xs'
                      : 'bg-white text-slate-700 border-[#ffd9e3] hover:bg-pink-50'
                  }`}
                >
                  <span>🎉 Khách Mới</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* User Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email hoặc Số Điện Thoại
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="email@example.com hoặc 0905..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#fdf7ff] border border-[#ffd9e3] text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#864d61] focus:ring-4 focus:ring-pink-100 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Mật Khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Mật khẩu mẫu demo là: 123456')}
                    className="text-xs text-[#864d61] hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#fdf7ff] border border-[#ffd9e3] text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#864d61] focus:ring-4 focus:ring-pink-100 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#864d61] focus:ring-[#864d61] border-pink-300 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-semibold">Ghi nhớ tài khoản</span>
                </label>

                <span className="text-[11px] text-pink-600 font-bold inline-flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  Tặng 50K khi vào tiệc
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 rounded-full bg-gradient-to-r from-[#864d61] to-[#ba5c7b] hover:opacity-95 text-white font-headline font-bold text-sm tracking-wide shadow-md shadow-rose-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Đang đăng nhập...</span>
                ) : (
                  <>
                    <span>Đăng Nhập Thành Viên</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Direct Order without login */}
            <div className="mt-5 pt-4 border-t border-pink-100 text-center">
              <button
                type="button"
                onClick={onNavigateToLanding}
                className="text-xs text-slate-600 hover:text-[#864d61] font-bold transition-colors"
              >
                Không cần đăng nhập? <span className="underline font-black text-[#864d61]">Đặt thuê loa ngay →</span>
              </button>
            </div>

          </div>
        </main>

        {/* FOOTER */}
        <footer className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-5 text-center z-10 text-xs text-slate-500 font-semibold">
          <p>© {new Date().getFullYear()} Dặm • Hotline Đặt Loa & Hỗ Trợ: 0368.115.592</p>
        </footer>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // 🛡️ THEME 2: GIAO DIỆN QUẢN TRỊ VIÊN (ADMIN & SHIPPER - SLATE STYLE)
  // ══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col justify-between relative text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      {/* Subtle Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[30%] left-[20%] w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[140px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[120px]"></div>
      </div>

      {/* TOP HEADER */}
      <header className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between z-10">
        <div
          onClick={onNavigateToLanding}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Trở về Trang Khách"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight block">Locahome</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLoginType('user');
              setErrorMessage('');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#864d61] text-xs sm:text-sm font-bold border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-[#864d61]" />
            <span>Giao Diện Khách Hàng</span>
          </button>

          <button
            onClick={onNavigateToLanding}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-950 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ</span>
          </button>
        </div>
      </header>

      {/* MAIN ADMIN LOGIN CARD */}
      <main className="w-full max-w-md mx-auto px-4 py-8 z-10">
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          
          {/* Header Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Đăng nhập quản trị</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Hệ thống quản lý dịch vụ Kẹo Kéo Dặm
            </p>
          </div>

          {/* Clean Segmented Role Switcher */}
          <div className="mb-6 bg-slate-100/90 p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleSelectAdminRole('admin')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                adminRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👑 Quản trị viên</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectAdminRole('shipper')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                adminRole === 'shipper'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🛵 Kỹ thuật / Shipper</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email hoặc tên tài khoản
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="name@locahome.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => alert('Mật khẩu mẫu mặc định là: admin123456')}
                  className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300 cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">Ghi nhớ đăng nhập</span>
              </label>

              <span className="text-[11px] text-slate-400 font-medium inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Bảo mật SSL
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm tracking-tight shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Đang kiểm tra...</span>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-5 text-center z-10 text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} Locahome • Hotline Kỹ Thuật: 0368.115.592</p>
      </footer>
    </div>
  );
}


