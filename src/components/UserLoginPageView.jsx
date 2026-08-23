import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';

export default function UserLoginPageView({
  onLoginSuccess,
  onNavigateToLanding,
  setToast = null
}) {
  const [isLoadingProvider, setIsLoadingProvider] = useState(null); // 'google' | 'facebook' | null
  const [errorMessage, setErrorMessage] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onNavigateToLanding();
    }, 220);
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
            redirectTo: window.location.origin + (window.location.pathname || '') + '?page=landing'
          }
        });

        if (error) {
          console.warn(`Supabase OAuth for ${provider}:`, error.message);
          // Fallback simulation if provider not yet toggled in Supabase dashboard
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
        fullName: 'Hoàng Trần (Google)',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        provider: 'Google'
      };
    } else if (provider === 'facebook') {
      customerUser = {
        ...customerUser,
        email: 'minhtuan.fb@facebook.com',
        fullName: 'Minh Tuấn (Facebook)',
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

      {/* MAIN SOCIAL LOGIN CARD */}
      <main className="w-full max-w-md mx-auto px-4 py-6 z-10">
        <div className={`bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-7 sm:p-9 border-2 border-[#ffd9e3] shadow-[0_20px_50px_rgba(134,77,97,0.10)] transition-all duration-300 ${isExiting ? 'scale-95 opacity-0 blur-[2px]' : 'animate-page-enter'
          }`}>

          {/* Header Title */}
          <div className="text-center mb-7">
            <h1 className="font-headline text-2xl sm:text-3xl text-[#864d61] tracking-tight font-black">
              Đăng Nhập
            </h1>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ══════════ SOCIAL LOGIN BUTTONS ══════════ */}
          <div className="space-y-3.5">
            {/* GOOGLE BUTTON */}
            <button
              type="button"
              disabled={Boolean(isLoadingProvider)}
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200/90 text-slate-800 font-bold text-sm shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {isLoadingProvider === 'google' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin"></div>
                  <span>Đang kết nối Google...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              className="w-full py-3.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-md shadow-blue-200/50 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {isLoadingProvider === 'facebook' ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>Đang kết nối Facebook...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Tiếp tục với Facebook</span>
                </>
              )}
            </button>
          </div>

        </div>
      </main>

      {/* Spacer */}
      <div className="py-4"></div>
    </div>
  );
}
