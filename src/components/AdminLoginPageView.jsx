import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLoginPageView({
  onLoginSuccess,
  onNavigateToLanding,
  setToast = null
}) {
  const [email, setEmail] = useState('hotadam');
  const [password, setPassword] = useState('Denyeubama1');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleSelectAdminUser = (account) => {
    setErrorMessage('');
    if (account === 'hotadam') {
      setEmail('hotadam');
      setPassword('Denyeubama1');
    } else {
      setEmail('nguyenaidiep');
      setPassword('Denyeubama1');
    }
  };

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onNavigateToLanding();
    }, 220);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ Tài khoản và Mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.login(email.trim(), password);

      if (res && (res.success || res.data?.token)) {
        const isDiep = email.trim().toLowerCase().includes('nguyenaidiep');

        const userData = res.data?.user || {
          email: email.trim(),
          role: 'admin',
          fullName: isDiep ? 'Nguyễn Ái Diệp' : 'Hồ Văn Duy',
          avatarUrl: isDiep 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : '/pink.png'
        };

        if (rememberMe) {
          localStorage.setItem('locahome_saved_email', email.trim());
        } else {
          localStorage.removeItem('locahome_saved_email');
        }

        setIsExiting(true);
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(userData);
          }
        }, 220);
      } else {
        throw new Error(res?.error || 'Tài khoản hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#fafafc] flex flex-col justify-between relative text-slate-900 antialiased selection:bg-slate-900 selection:text-white transition-opacity duration-200 ${isExiting ? 'opacity-0' : 'animate-page-fade'}`}>
      {/* Subtle Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[30%] left-[20%] w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[140px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[120px]"></div>
      </div>

      {/* TOP HEADER */}
      <header className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between z-10">
        <div
          onClick={handleBack}
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

        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-950 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </header>

      {/* MAIN ADMIN LOGIN CARD */}
      <main className="w-full max-w-md mx-auto px-4 py-8 z-10">
        <div className={`bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-300 ${
          isExiting ? 'scale-95 opacity-0 blur-[2px]' : 'animate-page-enter'
        }`}>
          
          {/* Header Title */}
          <div className="mb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <ShieldCheck className="w-8 h-8 text-rose-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản Trị Viên</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Đăng nhập hệ thống điều phối Kẹo Kéo Dặm
            </p>
          </div>

          {/* Quick Admin Selector */}
          <div className="mb-5 bg-slate-100/90 p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleSelectAdminUser('hotadam')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                email === 'hotadam'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👑 Hồ Văn Duy</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectAdminUser('nguyenaidiep')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                email === 'nguyenaidiep'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👑 Nguyễn Ái Diệp</span>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
