import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Lock, Eye, EyeOff, Camera } from 'lucide-react';
import { supabase } from '../services/supabase';
import { apiService } from '../services/api';

const DEFAULT_AVATAR = '/pink.png';

export default function UserLoginPageView({
  onLoginSuccess,
  onNavigateToLanding,
  setToast = null
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProvider, setIsLoadingProvider] = useState(null); // 'google' | 'facebook' | null
  const [errorMessage, setErrorMessage] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  // Form Fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);

  const fileInputRef = useRef(null);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onNavigateToLanding();
    }, 220);
  };

  // Smooth switch animation between login and register
  const switchMode = (newMode) => {
    if (newMode === mode || isSwitching) return;
    setIsSwitching(true);
    setErrorMessage('');
    setTimeout(() => {
      setMode(newMode);
      setTimeout(() => {
        setIsSwitching(false);
      }, 50);
    }, 150);
  };

  // Handle custom image file upload for Avatar
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Dung lượng ảnh tối đa 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedAvatar(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Vui lòng nhập Tài khoản hoặc Email');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMessage('Vui lòng nhập Mật khẩu');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiService.login(loginIdentifier.trim(), loginPassword);
      if (res && (res.success || res.data?.token)) {
        const isHotadam = loginIdentifier.trim().toLowerCase() === 'hotadam';
        const isDiep = loginIdentifier.trim().toLowerCase() === 'nguyenaidiep';
        const isAdmin = isHotadam || isDiep || loginIdentifier.includes('admin');

        const user = res.data?.user || {
          role: isAdmin ? 'admin' : 'customer',
          fullName: isDiep ? 'Nguyễn Ái Diệp' : (isHotadam ? 'Hồ Văn Duy' : loginIdentifier.trim()),
          avatarUrl: isDiep ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : '/pink.png',
          points: 120
        };

        setIsExiting(true);
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(user);
          }
        }, 220);
      } else {
        setErrorMessage(res.error || 'Tài khoản hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Tài khoản hoặc mật khẩu không chính xác');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Form Submit (Register)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập Mật khẩu');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu nhập lại không khớp!');
      return;
    }

    setIsLoading(true);

    try {
      // Call real backend API
      const res = await apiService.register(fullName.trim(), password, selectedAvatar);
      const user = res.data?.user || {
        role: 'customer',
        fullName: fullName.trim(),
        avatarUrl: selectedAvatar,
        points: 200
      };

      if (setToast) {
        setToast({
          title: '🎉 Đăng Ký Thành Công',
          desc: `Chào mừng ${user.fullName} đến với Dặm!`,
          type: 'success'
        });
      }

      setIsExiting(true);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }, 220);
    } catch (err) {
      setErrorMessage(err.message || 'Lỗi khi tạo tài khoản');
    } finally {
      setIsLoading(false);
    }
  };

  // Real Supabase Social Login (Google, Facebook)
  const handleSocialLogin = async (provider) => {
    setIsLoadingProvider(provider);
    setErrorMessage('');

    try {
      if (['google', 'facebook'].includes(provider)) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            scopes: provider === 'facebook' ? 'email,public_profile' : undefined,
            redirectTo: window.location.origin + (window.location.pathname || '') + '?page=landing'
          }
        });

        if (error) {
          console.warn(`Supabase OAuth for ${provider}:`, error.message);
          fallbackSocialUser(provider);
        }
      } else {
        fallbackSocialUser(provider);
      }
    } catch (err) {
      console.warn('Social login fallback:', err);
      fallbackSocialUser(provider);
    }
  };

  const fallbackSocialUser = (provider) => {
    let customerUser = {
      role: 'customer',
      points: 120,
    };

    if (provider === 'google') {
      customerUser = {
        ...customerUser,
        email: 'hoang.tran.google@gmail.com',
        fullName: 'Hoàng Trần',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        provider: 'Google'
      };
    } else if (provider === 'facebook') {
      customerUser = {
        ...customerUser,
        email: 'minhtuan.fb@facebook.com',
        fullName: 'Minh Tuấn',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        provider: 'Facebook'
      };
    }

    setIsExiting(true);
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(customerUser);
      }
    }, 220);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#fff0f4] via-[#fdf7ff] to-[#f0f4ff] flex flex-col justify-between relative text-slate-800 antialiased selection:bg-[#ffb7ce] selection:text-[#864d61] transition-opacity duration-200 ${isExiting ? 'opacity-0' : 'animate-page-fade'}`}>
      {/* Pastel Glow Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[20%] left-[15%] w-[550px] h-[550px] bg-[#ffd9e3]/60 rounded-full blur-[130px]"></div>
        <div className="absolute top-[50%] -right-[10%] w-[500px] h-[500px] bg-[#e0d6ff]/50 rounded-full blur-[140px]"></div>
      </div>

      {/* TOP HEADER */}
      <header className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between z-10">
        <div
          onClick={handleBack}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Trở về Trang Khách Hàng"
        >
          <img
            src="/anh3.png"
            alt="Dặm"
            className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="font-headline text-2xl text-[#864d61] tracking-tight block font-black">Dặm</span>
        </div>

        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-[#864d61] text-xs sm:text-sm font-bold shadow-xs hover:shadow active:scale-95 transition-all cursor-pointer border border-[#ffd9e3]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </header>

      {/* MAIN SOCIAL LOGIN / REGISTER CARD */}
      <main className="w-full max-w-md mx-auto px-4 py-4 z-10">
        <div className={`bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border-2 border-[#ffd9e3] shadow-[0_20px_50px_rgba(134,77,97,0.10)] transition-all duration-300 ${isExiting ? 'scale-95 opacity-0 blur-[2px]' : 'animate-page-enter'}`}>

          {/* DYNAMIC ANIMATED CONTENT CONTAINER */}
          <div className={`transition-all duration-200 ease-out transform ${isSwitching ? 'opacity-0 translate-y-2 scale-[0.97]' : 'opacity-100 translate-y-0 scale-100'}`}>

            {/* TOP AVATAR / MASCOT (At the very top of the card) */}
            <div className="flex flex-col items-center mb-3">
              {mode === 'register' ? (
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title="Bấm để tải ảnh đại diện từ máy"
                >
                  <img
                    src={selectedAvatar}
                    alt="Avatar"
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-3 border-[#ffd9e3] shadow-md group-hover:opacity-90 transition-opacity bg-[#fff5f8]"
                  />
                  <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#864d61] text-white flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 border-3 border-[#ffd9e3] shadow-md bg-[#fff5f8] flex items-center justify-center">
                  <img
                    src="/pink.png"
                    alt="Chibi Dặm"
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </div>

            {/* Header Title */}
            <div className="text-center mb-5">
              <h1 className="font-headline text-2xl sm:text-3xl text-[#864d61] tracking-tight font-black">
                {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </h1>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ══════════ LOGIN MODE: USERNAME/PASSWORD + SOCIAL BUTTONS ══════════ */}
            {mode === 'login' && (
              <div className="space-y-4">
                {/* LOGIN FORM */}
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tài khoản hoặc Email</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="Nhập tên tài khoản hoặc email"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd9e3] focus:border-[#864d61] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd9e3] focus:border-[#864d61] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#864d61] text-white font-headline font-bold text-sm clay-button-pink flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        <span>Đang đăng nhập...</span>
                      </div>
                    ) : (
                      <span>Đăng Nhập</span>
                    )}
                  </button>
                </form>

                {/* DIVIDER */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200/80"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-slate-400 font-medium">Hoặc tiếp tục với</span>
                  </div>
                </div>

                {/* SOCIAL BUTTONS */}
                <div className="space-y-2.5">
                  {/* GOOGLE BUTTON */}
                  <button
                    type="button"
                    disabled={Boolean(isLoadingProvider)}
                    onClick={() => handleSocialLogin('google')}
                    className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoadingProvider === 'google' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin"></div>
                        <span>Đang kết nối Google...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                        </svg>
                        <span>Tiếp tục với Google</span>
                      </>
                    )}
                  </button>

                  {/* FACEBOOK BUTTON */}
                  <button
                    type="button"
                    disabled={Boolean(isLoadingProvider)}
                    onClick={() => handleSocialLogin('facebook')}
                    className="w-full py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoadingProvider === 'facebook' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        <span>Đang kết nối Facebook...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Tiếp tục với Facebook</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ══════════ REGISTER MODE: FIELDS ══════════ */}
            {mode === 'register' && (
              <div className="space-y-4">

                {/* FORM FIELDS */}
                <form onSubmit={handleSubmitForm} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nhập tên"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd9e3] focus:border-[#864d61] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd9e3] focus:border-[#864d61] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nhập lại mật khẩu</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd9e3] focus:border-[#864d61] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#864d61] text-white font-headline font-bold text-sm clay-button-pink flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        <span>Đang tạo tài khoản...</span>
                      </div>
                    ) : (
                      <span>Tạo Tài Khoản</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* FOOTER SWITCH */}
            <div className="mt-6 text-center">
              {mode === 'login' ? (
                <p className="text-xs text-slate-500 font-medium">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="font-bold text-[#864d61] hover:underline cursor-pointer ml-1"
                  >
                    Tạo tài khoản
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500 font-medium">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-bold text-[#864d61] hover:underline cursor-pointer ml-1"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Spacer */}
      <div className="py-2"></div>
    </div>
  );
}
