import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';

// ══════════════════════════════════════════════════════════
// 💖 KAWAII VECTOR ICONS (CUTE, 3D GLOSSY & POLISHED SVGS)
// ══════════════════════════════════════════════════════════

export function CuteSpeakerIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="6" width="32" height="36" rx="8" fill="url(#spk-grad)" stroke="#864d61" strokeWidth="2.2" />
      <circle cx="24" cy="16" r="4" fill="#ffffff" fillOpacity="0.85" />
      <circle cx="24" cy="16" r="2.2" fill="#864d61" />
      <circle cx="24" cy="30" r="8" fill="#ffffff" fillOpacity="0.85" />
      <circle cx="24" cy="30" r="5.5" fill="#864d61" />
      <circle cx="24" cy="30" r="2.5" fill="#ffb7ce" />
      {/* Gloss reflection */}
      <path d="M12 10C12 8.89543 12.8954 8 14 8H34C35.1046 8 36 8.89543 36 10V14C24 14 14 18 12 24V10Z" fill="white" fillOpacity="0.4" />
      <defs>
        <linearGradient id="spk-grad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd9e3" />
          <stop offset="1" stopColor="#fab3ca" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteCameraIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 7L12 4H20L22 7H26C27.6569 7 29 8.34315 29 10V24C29 25.6569 27.6569 27 26 27H6C4.34315 27 3 25.6569 3 24V10C3 8.34315 4.34315 7 6 7H10Z" fill="url(#cam-grad)" stroke="#2e6385" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="16" cy="17" r="6" fill="#ffffff" fillOpacity="0.85" stroke="#2e6385" strokeWidth="1.5" />
      <circle cx="16" cy="17" r="3.5" fill="#2e6385" />
      <circle cx="14.5" cy="15.5" r="1" fill="#ffffff" />
      <circle cx="24" cy="11" r="1.5" fill="#e11d48" />
      <defs>
        <linearGradient id="cam-grad" x1="3" y1="4" x2="29" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9e6ff" />
          <stop offset="1" stopColor="#9accf3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteMicIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="6" width="12" height="20" rx="6" fill="url(#mic-grad)" stroke="#864d61" strokeWidth="2" />
      <path d="M13 18C13 24.0751 17.9249 29 24 29C30.0751 29 35 24.0751 35 18" stroke="#864d61" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 29V38" stroke="#864d61" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M17 38H31" stroke="#864d61" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M37 8L38 12L42 13L38 14L37 18L36 14L32 13L36 12L37 8Z" fill="#ffb7ce" />
      <defs>
        <linearGradient id="mic-grad" x1="18" y1="6" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb7ce" />
          <stop offset="1" stopColor="#864d61" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteStarIcon({ filled = true, className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L14.9 8.26L21.8 9.27L16.8 14.14L18 21.02L12 17.77L6 21.02L7.2 14.14L2.2 9.27L9.1 8.26L12 2Z"
        fill={filled ? "url(#star-gold)" : "#e2e8f0"}
        stroke={filled ? "#f59e0b" : "#cbd5e1"}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {filled && (
        <circle cx="9" cy="9" r="1.5" fill="#ffffff" fillOpacity="0.8" />
      )}
      <defs>
        <linearGradient id="star-gold" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde047" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteLightningIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 3L6 17H16L14 29L26 15H16L18 3Z"
        fill="url(#bolt-grad)"
        stroke="#d97706"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="bolt-grad" x1="6" y1="3" x2="26" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteBatteryIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="22" height="16" rx="4" fill="url(#bat-bg)" stroke="#2f6a3f" strokeWidth="1.8" />
      <path d="M28 13C29.1 13 30 13.9 30 15V17C30 18.1 29.1 19 28 19V13Z" fill="#2f6a3f" />
      <rect x="7" y="11" width="16" height="10" rx="2" fill="url(#bat-fill)" />
      <path d="M16 12L13 16H17L14 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="bat-bg" x1="4" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0fdf4" />
          <stop offset="1" stopColor="#dcfce7" />
        </linearGradient>
        <linearGradient id="bat-fill" x1="7" y1="11" x2="23" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteHeartIcon({ filled = true, className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
        fill={filled ? "url(#heart-grad)" : "none"}
        stroke={filled ? "#e11d48" : "#94a3b8"}
        strokeWidth="1.5"
      />
      {filled && (
        <circle cx="7.5" cy="7.5" r="1.5" fill="#ffffff" fillOpacity="0.8" />
      )}
      <defs>
        <linearGradient id="heart-grad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb7185" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteCheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill="url(#chk-grad)" />
      <path d="M6 10L8.5 12.5L14 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="chk-grad" x1="2" y1="2" x2="18" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteQRIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="10" height="10" rx="3" fill="url(#qr-grad)" stroke="#235a7c" strokeWidth="1.5" />
      <rect x="7" y="7" width="4" height="4" rx="1" fill="#235a7c" />
      <rect x="18" y="4" width="10" height="10" rx="3" fill="url(#qr-grad)" stroke="#235a7c" strokeWidth="1.5" />
      <rect x="21" y="7" width="4" height="4" rx="1" fill="#235a7c" />
      <rect x="4" y="18" width="10" height="10" rx="3" fill="url(#qr-grad)" stroke="#235a7c" strokeWidth="1.5" />
      <rect x="7" y="21" width="4" height="4" rx="1" fill="#235a7c" />
      <rect x="18" y="18" width="4" height="4" rx="1" fill="#235a7c" />
      <rect x="24" y="18" width="4" height="4" rx="1" fill="#235a7c" />
      <rect x="18" y="24" width="10" height="4" rx="1" fill="#235a7c" />
      <defs>
        <linearGradient id="qr-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteSwapIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="url(#swp-grad)" stroke="#2e6385" strokeWidth="1.5" />
      <path d="M10 13H22M22 13L18 9M22 13L18 17" stroke="#2e6385" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 19H10M10 19L14 15M10 19L14 23" stroke="#2e6385" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="swp-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9e6ff" />
          <stop offset="1" stopColor="#9accf3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteMusicNotesDecor({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 24C10.3431 24 9 22.6569 9 21C9 19.3431 10.3431 18 12 18C13.6569 18 15 19.3431 15 21V8L25 5V18C23.3431 18 22 19.3431 22 21C22 22.6569 23.3431 24 25 24C26.6569 24 28 22.6569 28 21V5C28 3.89543 27.1046 3 26 3L13 7C11.8954 7.33846 11 8.44772 11 9.6V21C11 22.6569 12 24 12 24Z" fill="url(#mus-grad)" />
      <defs>
        <linearGradient id="mus-grad" x1="9" y1="3" x2="28" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb7ce" />
          <stop offset="0.5" stopColor="#864d61" />
          <stop offset="1" stopColor="#360b1e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteChatAnswerIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 12C20 16.4183 16.4183 20 12 20C10.4578 20 9.01429 19.5636 7.78853 18.8093L3.5 20L4.78652 15.8652C3.66699 14.7303 3 13.2458 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 20 7.58172 20 12Z"
        fill="url(#chat-grad)"
        stroke="#864d61"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="12" r="1.2" fill="#864d61" />
      <circle cx="12" cy="12" r="1.2" fill="#864d61" />
      <circle cx="15.5" cy="12" r="1.2" fill="#864d61" />
      <defs>
        <linearGradient id="chat-grad" x1="3" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd9e3" />
          <stop offset="1" stopColor="#fab3ca" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteAudioWaveIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10V14M7 6V18M11 3V21M15 8V16M19 11V13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CuteSparkleDiscoIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="currentColor" />
      <path d="M19 17L20 19.5L22.5 20.5L20 21.5L19 24L18 21.5L15.5 20.5L18 19.5L19 17Z" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function CuteCoffeeCupIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17 8H3V15C3 17.2091 4.79086 19 7 19H13C15.2091 19 17 17.2091 17 15V8ZM17 8H19C20.1046 8 21 8.89543 21 10V11C21 12.1046 20.1046 13 19 13H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 3V5M10 3V5M14 3V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CutePhoneSaveIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor" />
      <circle cx="18" cy="6" r="3.5" fill="#f43f5e" />
      <path d="M18 4.5V7.5M16.5 6H19.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function CutePenToolIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 19L9.5 21.5L8 16L13.5 14.5L12 19Z" fill="url(#pen-tip-grad)" stroke="#864d61" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 16L14 10L18 14L12 20" stroke="#864d61" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 11L17 7C17.5 6.5 18.5 6.5 19 7L20 8C20.5 8.5 20.5 9.5 20 10L16 14" stroke="#864d61" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="12.5" r="1.5" fill="#864d61" />
      <defs>
        <linearGradient id="pen-tip-grad" x1="8" y1="14.5" x2="13.5" y2="21.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd9e3" />
          <stop offset="1" stopColor="#fab3ca" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteLayersIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#lay-grad)" stroke="#2f6a3f" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="#2f6a3f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17L12 22L22 17" stroke="#2f6a3f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="lay-grad" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dcfce7" />
          <stop offset="1" stopColor="#b2f2bb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteCodeIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 18L22 12L16 6" stroke="#235a7c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6L2 12L8 18" stroke="#235a7c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4L10 20" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CuteReviewChatIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C6.477 3 2 6.92 2 11.75C2 14.17 3.12 16.36 4.96 17.92L4.03 21.05C3.93 21.39 4.29 21.68 4.6 21.5L8.43 19.34C9.56 19.76 10.75 20 12 20C17.523 20 22 16.08 22 11.25C22 6.42 17.523 3 12 3Z" fill="url(#chat-bubble-grad)" stroke="#864d61" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="8" cy="11.5" r="1.3" fill="#864d61" />
      <circle cx="12" cy="11.5" r="1.3" fill="#864d61" />
      <circle cx="16" cy="11.5" r="1.3" fill="#864d61" />
      <defs>
        <linearGradient id="chat-bubble-grad" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd9e3" />
          <stop offset="1" stopColor="#ffeef4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CuteAvatarPill({ name = "User", letter = "U", color = "pink", className = "" }) {
  const bgStyles = {
    pink: "bg-gradient-to-br from-[#ffd9e3] to-[#ffb7ce] text-[#864d61] border-[#fab3ca]",
    blue: "bg-gradient-to-br from-[#c9e6ff] to-[#9ed1f8] text-[#235a7c] border-[#9ed1f8]",
    green: "bg-gradient-to-br from-[#b2f2bb] to-[#8ce99a] text-[#2f6a3f] border-[#96d5a0]",
    purple: "bg-gradient-to-br from-[#ebd4ff] to-[#d0bfff] text-purple-800 border-purple-300"
  };

  const avatarSrc = color === 'green' ? '/green.png' : color === 'blue' ? '/blue.png' : '/pink.png';

  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-headline text-base font-extrabold shadow-sm border-2 overflow-hidden bg-white ${bgStyles[color] || bgStyles.pink} ${className}`}>
      <img
        src={avatarSrc}
        alt={name}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// 🌟 MAIN LANDING PAGE VIEW COMPONENT
// ══════════════════════════════════════════════════════════

export default function LandingPageView({
  currentUser,
  onLogout,
  onNavigateToAdmin,
  onNavigateToLogin,
  onOpenVietQR,
  onAddBooking
}) {
  const [activeNav, setActiveNav] = useState('reviews');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [selectedSpeakerForBooking, setSelectedSpeakerForBooking] = useState('puffy-bass-pro');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Audio Demo State with Web Audio Synthesizer
  const [playingAudio, setPlayingAudio] = useState(null); // 'bass' | 'bolero' | 'disco' | 'acoustic' | null
  const audioCtxRef = useRef(null);
  const synthTimerRef = useRef(null);

  // Particles / Confetti state
  const [floatingParticles, setFloatingParticles] = useState([]);

  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    address: '',
    durationHours: 4,
    startTime: '18:00',
    notes: '',
    speakerType: 'Puffy Bass Pro 40 (800W) - Best Seller',
    pricePerHour: 80000
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showStarDropdown, setShowStarDropdown] = useState(false);
  const starDropdownRef = useRef(null);

  // Form validation states
  const [reviewFormTouched, setReviewFormTouched] = useState({ name: false, comment: false });
  const [reviewFormShake, setReviewFormShake] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleAnimatedLogout = (e) => {
    if (e) {
      triggerParticleBurst(e.clientX, e.clientY);
    }
    setIsLoggingOut(true);
    setTimeout(() => {
      if (onLogout) onLogout();
      setIsLoggingOut(false);
    }, 280);
  };
  const [isClosingReviewModal, setIsClosingReviewModal] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewToast, setReviewToast] = useState(null);
  const [highlightedReviewId, setHighlightedReviewId] = useState(null);
  const reviewSuccessTimerRef = useRef(null);
  const reviewToastTimerRef = useRef(null);
  const [submittedReviewInfo, setSubmittedReviewInfo] = useState({ name: '', rating: 5 });

  const handleOpenReviewModal = () => {
    if (reviewSuccessTimerRef.current) clearTimeout(reviewSuccessTimerRef.current);
    setIsClosingReviewModal(false);
    setReviewSuccess(false);
    setShowAddReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    if (reviewSuccessTimerRef.current) clearTimeout(reviewSuccessTimerRef.current);
    setIsClosingReviewModal(true);
    setTimeout(() => {
      setShowAddReviewModal(false);
      setIsClosingReviewModal(false);
      setReviewSuccess(false);
      setReviewFormTouched({ name: false, comment: false });
    }, 280);
  };

  // Lightbox Zoom Modal for Scenic Photos
  const [zoomImageModal, setZoomImageModal] = useState(null);
  const [modalZoomScale, setModalZoomScale] = useState(1);

  const [bookingFormTouched, setBookingFormTouched] = useState({ name: false, phone: false, address: false });
  const [bookingFormShake, setBookingFormShake] = useState(false);

  // 👑 Owner Reply Modal State
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [targetReviewForReply, setTargetReviewForReply] = useState(null);
  const [ownerReplyInput, setOwnerReplyInput] = useState('');
  const [ownerNameInput, setOwnerNameInput] = useState('Kẹo Kéo Dặm');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const toggleReplyExpand = (reviewId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Load reviews from backend API on mount
  useEffect(() => {
    const fetchReviewsFromBackend = async () => {
      try {
        setIsLoadingReviews(true);
        const res = await api.getReviews();
        if (res && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.reviews || []);
          setReviewsList(list);
        }
      } catch (err) {
        console.warn('Backend reviews offline or unavailable:', err.message);
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviewsFromBackend();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (starDropdownRef.current && !starDropdownRef.current.contains(event.target)) {
        setShowStarDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Floating particles disabled per user preference
  const triggerParticleBurst = () => { };

  // Play cute synthetic Web Audio chime demo
  const playSoundDemo = (type) => {
    try {
      if (playingAudio === type) {
        setPlayingAudio(null);
        if (synthTimerRef.current) clearInterval(synthTimerRef.current);
        return;
      }

      setPlayingAudio(type);

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Frequencies for different demo moods
      const patterns = {
        bass: [65.41, 82.41, 98.00, 130.81, 65.41], // C2, E2, G2, C3
        bolero: [261.63, 329.63, 392.00, 523.25, 392.00], // C4, E4, G4, C5
        disco: [130.81, 196.00, 261.63, 329.63, 392.00], // Funky disco bass
        acoustic: [329.63, 392.00, 493.88, 587.33, 493.88] // E4, G4, B4, D5
      };

      const notes = patterns[type] || patterns.bass;
      let noteIndex = 0;

      if (synthTimerRef.current) clearInterval(synthTimerRef.current);

      const playTone = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type === 'bass' ? 'triangle' : type === 'disco' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(notes[noteIndex % notes.length], ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.45);
        noteIndex++;
      };

      playTone();
      synthTimerRef.current = setInterval(playTone, 380);

      // Auto stop after 6 seconds
      setTimeout(() => {
        if (synthTimerRef.current) clearInterval(synthTimerRef.current);
        setPlayingAudio(null);
      }, 6000);
    } catch (e) {
      console.warn("Audio demo not supported or blocked", e);
    }
  };

  useEffect(() => {
    return () => {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    };
  }, []);

  // Speaker Packages Data
  const speakerPackages = [
    {
      id: 'puffy-mini',
      name: 'Puffy Mini Xách Tay',
      badge: 'Gọn Nhẹ & Tiện Lợi',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      power: '400W Peak',
      battery: '10 - 12 Tiếng',
      hourlyRate: 60000,
      dailyRate: 280000,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
      color: 'from-amber-50 to-orange-100/60',
      accentColor: 'text-amber-700',
      buttonBg: 'bg-[#864d61] text-white',
      features: [
        'Trọng lượng chỉ 4.5kg xách tay gọn gàng',
        '2 Micro UHF hợp kim chống hú cực tốt',
        'Kết nối Bluetooth 5.3 + Aux 3.5mm + USB',
        'Thích hợp picnic, dã ngoại, tiệc 5-10 người'
      ]
    },
    {
      id: 'puffy-bass-pro',
      name: 'Puffy Bass Pro 40',
      badge: 'Best-Seller Yêu Thích',
      badgeColor: 'bg-pink-100 text-pink-800 border-pink-300 animate-pulse',
      power: '800W Super Bass',
      battery: '8 - 10 Tiếng',
      hourlyRate: 80000,
      dailyRate: 350000,
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      popular: true,
      color: 'from-pink-50 to-rose-100/70',
      accentColor: 'text-[#864d61]',
      buttonBg: 'bg-[#864d61] text-white',
      features: [
        'Bass 40cm đập cực chắc, âm thanh vang dội',
        '2 Micro nhôm cao cấp chỉnh Echo & Reverb',
        'Có tay kéo vali & 4 bánh xe di chuyển êm',
        'Tặng kèm 4 viên pin tiểu sạc dự phòng'
      ]
    },
    {
      id: 'mega-puff-50',
      name: 'Mega Puff Đôi 50 Khủng',
      badge: 'Sân Vườn & Ngoài Trời',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      power: '1200W Cực Đại',
      battery: '7 - 9 Tiếng',
      hourlyRate: 100000,
      dailyRate: 500000,
      image: 'https://images.unsplash.com/photo-1520523839898-50712825e617?w=600&auto=format&fit=crop&q=80',
      color: 'from-blue-50 to-sky-100/70',
      accentColor: 'text-[#235a7c]',
      buttonBg: 'bg-[#864d61] text-white',
      features: [
        'Hệ thống 2 Bass 50cm kép siêu uy lực',
        'Âm thanh phủ rộng 300m² tiệc 30-80 người',
        'Bộ lọc âm chuyên dụng cho Bolero & Remix',
        'Giao hỏa tốc tận nơi hỗ trợ căn chỉnh trọn gói'
      ]
    },
    {
      id: 'party-monster-disco',
      name: 'Party Monster Disco Led',
      badge: 'Đèn Led Nháy Theo Nhạc',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      power: '1500W RGB Glow',
      battery: '8 Tiếng',
      hourlyRate: 120000,
      dailyRate: 600000,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      color: 'from-purple-50 to-violet-100/70',
      accentColor: 'text-purple-800',
      buttonBg: 'bg-[#864d61] text-white',
      features: [
        'Vòng Led RGB cảm biến theo nhịp bass cực chill',
        'Chế độ DJ Effect biến không gian thành sàn quẩy',
        '2 Micro không dây cao cấp bắt giọng nhẹ tênh',
        'Miễn phí giao hàng hỏa tốc bán kính 5km'
      ]
    }
  ];

  // Reviews Data - Real Data from Backend
  const [reviewsList, setReviewsList] = useState([]);

  // FAQ Questions Data
  const faqs = [
    {
      q: 'Thuê loa kéo tại Locahome có cần đặt cọc CCCD hoặc giấy tờ không?',
      a: 'Hoàn toàn KHÔNG cần giữ CCCD hay bằng lái xe! Bạn chỉ cần cung cấp số điện thoại chính chủ và địa chỉ nhận loa rõ ràng là nhân viên sẽ giao và lắp đặt tận nơi chu đáo.'
    },
    {
      q: 'Thời gian giao loa mất bao lâu sau khi đặt?',
      a: 'Đội ngũ shipper hỏa tốc Locahome cam kết giao hàng trong 30-45 phút tại TP. Tuy Hòa, TX. Sông Cầu, TX. Đông Hòa và toàn tỉnh Phú Yên.'
    },
    {
      q: 'Mỗi dàn loa cho thuê gồm những phụ kiện gì?',
      a: 'Mọi gói thuê đều bao gồm trọn bộ: 1 thân loa cao cấp, 2 micro không dây UHF chống hú 100%, 1 dây sạc nguồn, và tặng kèm 4 viên pin tiểu sạc dự phòng miễn phí.'
    },
    {
      q: 'Nếu đang hát mà loa hết pin hoặc gặp sự cố thì xử lý thế nào?',
      a: 'Chúng mình có đội ngũ hỗ trợ kỹ thuật 24/7. Nếu loa gặp sự cố, Locahome cam kết đổi loa mới trong 15-20 phút và tặng bù thêm 1 giờ thuê miễn phí cho bạn!'
    },
    {
      q: 'Có những hình thức thanh toán nào?',
      a: 'Bạn có thể quét mã VietQR tự động qua bất kỳ ứng dụng ngân hàng nào (MoMo, ZaloPay, Vietcombank, MBBank...) hoặc thanh toán tiền mặt trực tiếp cho nhân viên khi nhận loa.'
    }
  ];

  // Filtered & Sorted reviews
  const filteredReviews = [...reviewsList]
    .filter(r => {
      if (reviewFilter === '5star') return r.rating === 5;
      if (reviewFilter === '4star') return r.rating === 4;
      if (reviewFilter === '3star') return r.rating === 3;
      if (reviewFilter === '2star') return r.rating === 2;
      if (reviewFilter === '1star') return r.rating === 1;
      return true;
    })
    .sort((a, b) => {
      if (reviewFilter === 'oldest') return (a.id > b.id ? 1 : -1);
      if (reviewFilter === 'newest') return (a.id < b.id ? 1 : -1);
      return 0;
    });

  // ══════════ REVIEWS PAGINATION CONFIG (3 reviews per page) ══════════
  const REVIEWS_PER_PAGE = 3;
  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  const [pageSlideDirection, setPageSlideDirection] = useState('next');

  useEffect(() => {
    setReviewCurrentPage(1);
  }, [reviewFilter]);

  const totalReviewPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1;
  const paginatedReviews = filteredReviews.slice(
    (reviewCurrentPage - 1) * REVIEWS_PER_PAGE,
    reviewCurrentPage * REVIEWS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalReviewPages || newPage === reviewCurrentPage) return;
    setPageSlideDirection(newPage > reviewCurrentPage ? 'next' : 'prev');
    setReviewCurrentPage(newPage);
    const el = document.getElementById('reviews');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleOpenRentSpeaker = (pkg) => {
    setSelectedSpeakerForBooking(pkg.id);
    setBookingFormData(prev => ({
      ...prev,
      speakerType: `${pkg.name} (${pkg.power})`,
      pricePerHour: pkg.hourlyRate
    }));
    setShowBookingModal(true);
  };

  const handleSaveContact = (e) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      triggerParticleBurst(rect.left + 50, rect.top);
    }
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Dặm;Kẹo Kéo;;;',
      'FN:Kẹo Kéo Dặm',
      'ORG:Locahome - Cho Thuê Loa Kéo',
      'TEL;TYPE=CELL,VOICE:0368115592',
      'TEL;TYPE=WORK,VOICE:0368115592',
      'NOTE:Dịch vụ cho thuê loa kéo hỏa tốc 30 phút Tuy Hòa & Phú Yên - Hotline: 0368.115.592',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Keo-Keo-Dam-0368115592.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingFormTouched({ name: true, phone: true, address: true });

    const phoneClean = bookingFormData.phone.replace(/[\s.-]/g, '');
    const isPhoneValid = /^(0[3|5|7|8|9])[0-9]{8}$/.test(phoneClean);
    const isNameValid = Boolean(bookingFormData.name.trim());
    const isAddressValid = Boolean(bookingFormData.address.trim());

    if (!isNameValid || !isPhoneValid || !isAddressValid) {
      setBookingFormShake(true);
      setTimeout(() => setBookingFormShake(false), 500);
      return;
    }

    const totalEstimate = (bookingFormData.durationHours * bookingFormData.pricePerHour) + 20000;

    // Save rental to real SQLite database API
    api.createRental({
      speakerId: 'LKK-01',
      customerName: bookingFormData.name.trim(),
      customerPhone: phoneClean,
      address: bookingFormData.address.trim(),
      durationHours: bookingFormData.durationHours,
      rentPrice: bookingFormData.durationHours * bookingFormData.pricePerHour,
      shippingFee: 20000,
      totalAmount: totalEstimate,
      depositAmount: 500000,
      note: `Đặt online lúc ${bookingFormData.startTime}: ${bookingFormData.notes || 'Khách đặt từ landing page'}`
    }).catch(err => console.warn('Could not save booking to real API:', err.message));

    if (onAddBooking) {
      onAddBooking({
        customerName: bookingFormData.name.trim(),
        customerPhone: phoneClean,
        address: bookingFormData.address.trim(),
        speakerName: bookingFormData.speakerType,
        totalAmount: totalEstimate,
        duration: `${bookingFormData.durationHours} giờ`,
        startTime: bookingFormData.startTime,
        notes: bookingFormData.notes
      });
    }

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
      setBookingFormData({
        name: '',
        phone: '',
        address: '',
        durationHours: 4,
        startTime: '18:00',
        notes: '',
        speakerType: 'Puffy Bass Pro 40 (800W) - Best Seller',
        pricePerHour: 80000
      });
      setBookingFormTouched({ name: false, phone: false, address: false });
    }, 2200);
  };

  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    rating: 5,
    role: 'Khách thuê loa',
    comment: '',
    category: 'karaoke',
    colorScheme: 'pink'
  });

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewFormTouched({ name: true, comment: true });

    const isNameValid = Boolean(newReviewForm.name.trim());
    const isCommentValid = Boolean(newReviewForm.comment.trim() && newReviewForm.comment.trim().length >= 5);

    if (!isNameValid || !isCommentValid) {
      setReviewFormShake(true);
      setTimeout(() => setReviewFormShake(false), 500);
      return;
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formattedPostTime = `${pad(now.getHours())}:${pad(now.getMinutes())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

    const chosenColor = newReviewForm.colorScheme || 'pink';
    const defaultAvatarForColor = chosenColor === 'green' ? '/green.png' : chosenColor === 'blue' ? '/blue.png' : '/pink.png';

    const newRev = {
      id: `REV-${Date.now()}`,
      name: newReviewForm.name.trim(),
      category: newReviewForm.category,
      time: formattedPostTime,
      rating: Number(newReviewForm.rating),
      verified: true,
      avatar: defaultAvatarForColor,
      avatarLetter: newReviewForm.name.trim().charAt(0).toUpperCase(),
      avatarColor: chosenColor,
      comment: newReviewForm.comment.trim(),
      colorScheme: chosenColor,
      ownerReply: null,
      ownerReplyAt: null,
      ownerReplyBy: null
    };

    setIsSubmittingReview(true);

    // 1. Optimistic UI update - Add new review to the top immediately
    setReviewsList((prev) => [newRev, ...prev]);
    setHighlightedReviewId(newRev.id);

    // 2. Smoothly glide & dissolve the modal out immediately (no abrupt shrink)
    handleCloseReviewModal();

    // 3. Trigger celebratory Floating Toast Notification at top of screen
    setReviewToast({
      name: newRev.name,
      rating: newRev.rating,
      comment: newRev.comment
    });

    if (reviewToastTimerRef.current) clearTimeout(reviewToastTimerRef.current);
    reviewToastTimerRef.current = setTimeout(() => {
      setReviewToast(null);
    }, 5000);

    // Clear highlighted review card ring after 6.5s
    setTimeout(() => {
      setHighlightedReviewId((curr) => (curr === newRev.id ? null : curr));
    }, 6500);

    // 4. Smoothly scroll to reviews section so user sees their new card
    setTimeout(() => {
      const el = document.getElementById('reviews');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

    // 5. Call Backend API asynchronously in the background
    try {
      await api.createReview(newRev);
    } catch (err) {
      console.warn('Backend sync failed, saved in local state', err);
    } finally {
      setIsSubmittingReview(false);
      setNewReviewForm({
        name: '',
        rating: 5,
        role: 'Khách thuê loa',
        comment: '',
        category: 'karaoke',
        colorScheme: 'pink'
      });
      setReviewFormTouched({ name: false, comment: false });
    }
  };

  // 👑 Owner Reply Handlers
  const handleOpenReplyModal = (rev) => {
    setTargetReviewForReply(rev);
    setOwnerReplyInput(rev.ownerReply || '');
    setOwnerNameInput(rev.ownerReplyBy || 'Kẹo Kéo Dặm');
    setShowReplyModal(true);
  };

  const handleSaveOwnerReply = async (e) => {
    e.preventDefault();
    if (!targetReviewForReply) return;

    setIsSubmittingReply(true);
    const replyText = ownerReplyInput.trim();
    const ownerName = ownerNameInput.trim() || 'Kẹo Kéo Dặm';
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formattedReplyTime = `${pad(now.getHours())}:${pad(now.getMinutes())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

    // Optimistically update in state
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === targetReviewForReply.id) {
          return {
            ...r,
            ownerReply: replyText || null,
            ownerReplyAt: replyText ? formattedReplyTime : null,
            ownerReplyBy: replyText ? ownerName : null
          };
        }
        return r;
      })
    );

    // Sync with backend API
    try {
      await api.replyReview(targetReviewForReply.id, replyText, ownerName);
    } catch (err) {
      console.warn('Error saving owner reply to backend:', err);
    } finally {
      setIsSubmittingReply(false);
      setShowReplyModal(false);
      setTargetReviewForReply(null);
      setOwnerReplyInput('');
    }
  };

  const handleDeleteOwnerReply = async () => {
    if (!targetReviewForReply) return;
    setIsSubmittingReply(true);

    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === targetReviewForReply.id) {
          return {
            ...r,
            ownerReply: null,
            ownerReplyAt: null,
            ownerReplyBy: null
          };
        }
        return r;
      })
    );

    try {
      await api.replyReview(targetReviewForReply.id, '', '');
    } catch (err) {
      console.warn('Error deleting owner reply on backend:', err);
    } finally {
      setIsSubmittingReply(false);
      setShowReplyModal(false);
      setTargetReviewForReply(null);
      setOwnerReplyInput('');
    }
  };

  return (
    <div className="bg-[#fdf7ff] min-h-screen font-cute text-[#201047] selection:bg-[#ffb7ce] selection:text-[#360b1e] relative overflow-x-hidden">
      {/* ═══════════════ FLOATING TOAST NOTIFICATION KHI ĐĂNG THÀNH CÔNG ═══════════════ */}
      {reviewToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-xl rounded-full px-5 py-2.5 border-2 border-[#b2f2bb] shadow-[0_12px_36px_rgba(47,106,63,0.2)] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-6 duration-300">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#34d399] to-[#10b981] text-white flex items-center justify-center shadow-xs shrink-0 animate-success-spring">
            <CuteCheckIcon className="w-3.5 h-3.5" />
          </div>
          <span className="font-headline text-xs sm:text-sm text-[#2f6a3f] font-black whitespace-nowrap">
            Đăng Đánh Giá Thành Công!
          </span>
        </div>
      )}

      {/* Background Pastel Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#ffd9e3]/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/3 translate-x-1/3 pointer-events-none z-0"></div>
      <div className="fixed top-1/3 left-0 w-[450px] h-[450px] bg-[#c9e6ff]/50 rounded-full mix-blend-multiply filter blur-3xl opacity-65 -translate-x-1/3 pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#b2f2bb]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/3 pointer-events-none z-0"></div>

      {/* ═══════════════ PERMANENT FIXED TOP WRAPPER (HEADER) ═══════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full shadow-[0_4px_24px_rgba(134,77,97,0.08)]">
        {/* HEADER */}
        <header className="w-full bg-[#fdf7ff]/95 backdrop-blur-xl border-b border-[#864d61]/10">
          <div className="h-16 sm:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            {/* Logo */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src="/anh3.png"
                alt="Dặm"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 group-hover:scale-110 group-active:scale-95 transition-all duration-300 drop-shadow-[0_4px_10px_rgba(134,77,97,0.18)]"
              />
              <span className="font-headline text-2xl sm:text-3xl text-[#864d61] tracking-tight block font-black">
                Dặm
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              <a
                href="#reviews"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav('reviews');
                  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`font-headline text-xs sm:text-sm px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${activeNav === 'reviews'
                  ? 'bg-[#864d61]/15 text-[#864d61] font-extrabold shadow-inner'
                  : 'text-slate-600 hover:text-[#864d61] hover:bg-[#864d61]/8 font-bold'
                  }`}
              >
                <span>Đánh Giá</span>
              </a>

              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav('pricing');
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`font-headline text-xs sm:text-sm px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${activeNav === 'pricing'
                  ? 'bg-[#864d61]/15 text-[#864d61] font-extrabold shadow-inner'
                  : 'text-slate-600 hover:text-[#864d61] hover:bg-[#864d61]/8 font-bold'
                  }`}
              >
                <span>Bảng Giá Loa</span>
              </a>

              <a
                href="#vivu"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav('vivu');
                  document.getElementById('vivu')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`font-headline text-xs sm:text-sm px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${activeNav === 'vivu'
                  ? 'bg-[#864d61]/15 text-[#864d61] font-extrabold shadow-inner'
                  : 'text-slate-600 hover:text-[#864d61] hover:bg-[#864d61]/8 font-bold'
                  }`}
              >
                <span>Vi vu</span>
              </a>

              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav('faq');
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`font-headline text-xs sm:text-sm px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${activeNav === 'faq'
                  ? 'bg-[#864d61]/15 text-[#864d61] font-extrabold shadow-inner'
                  : 'text-slate-600 hover:text-[#864d61] hover:bg-[#864d61]/8 font-bold'
                  }`}
              >
                <span>Hỏi Đáp</span>
              </a>
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={(e) => {
                  triggerParticleBurst(e.clientX, e.clientY);
                  handleOpenReviewModal();
                }}
                className="bg-[#864d61] text-white font-headline text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full clay-button-pink flex items-center justify-center cursor-pointer active:scale-95 transition-transform whitespace-nowrap shrink-0 shadow-md hover:scale-105"
                title="Mở form viết đánh giá trải nghiệm"
              >
                <span>Viết Đánh Giá</span>
              </button>

              {currentUser && currentUser.role === 'customer' ? (
                <div className={`flex items-center gap-2 bg-white/95 border border-[#ffd9e3] py-1 px-2.5 sm:px-3 rounded-full shadow-xs transition-all duration-300 ${isLoggingOut ? 'scale-75 opacity-0 blur-xs -translate-y-1' : 'animate-page-enter'
                  }`}>
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-[#ffd9e3]"
                  />
                  <span className="font-bold text-[#864d61] text-xs sm:text-sm max-w-[90px] sm:max-w-[140px] truncate">
                    {currentUser.fullName}
                  </span>
                  <button
                    onClick={handleAnimatedLogout}
                    disabled={isLoggingOut}
                    className="text-slate-400 hover:text-rose-600 transition-all p-0.5 hover:rotate-12 active:scale-90 cursor-pointer disabled:opacity-50"
                    title="Đăng xuất tài khoản"
                  >
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px]">logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    triggerParticleBurst(e.clientX, e.clientY);
                    if (onNavigateToLogin) onNavigateToLogin();
                    else if (onNavigateToAdmin) onNavigateToAdmin();
                  }}
                  className="bg-[#864d61] text-white font-headline text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full clay-button-pink flex items-center justify-center cursor-pointer active:scale-95 transition-transform whitespace-nowrap shrink-0 shadow-md hover:scale-105 animate-page-enter"
                  title="Đăng nhập thành viên"
                >
                  <span>Đăng nhập</span>
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Spacer to prevent content from going behind fixed header */}
      <div className="h-16 sm:h-20 w-full pointer-events-none"></div>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="pt-4 pb-2 relative z-10">
        {/* HERO BANNER SECTION */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          <div className="flex flex-col items-center text-center gap-6">

            {/* Chibi Mascot Banner Card */}
            <div className="w-full max-w-4xl rounded-[2.8rem] overflow-hidden shadow-[0_16px_40px_rgba(134,77,97,0.14)] border-4 border-white">
              <div className="relative w-full aspect-[1774/887] overflow-hidden bg-[#201047]">
                <img
                  src="/beach.png"
                  alt="Locahome Beach Banner"
                  className="w-full h-full object-cover scale-[1.07] hover:scale-[1.1] transition-transform duration-700 block"
                />
              </div>
            </div>

            {/* Cute Hero Copy */}
            <div className="max-w-3xl mt-2">

              <h1 className="font-headline text-3xl sm:text-5xl md:text-6xl text-[#864d61] tracking-tight leading-tight sm:leading-none">
                What our <span className="text-[#2f6a3f] relative whitespace-nowrap">
                  happy singers
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#96d5a0] opacity-70" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
                  </svg>
                </span> say!
              </h1>

              <p className="text-base sm:text-xl text-[#514347] font-semibold mt-4 max-w-2xl mx-auto leading-relaxed">
                Squishy speakers, big bass, and lots of love from our karaoke family. Loa kéo xịn xò, micro nhẹ như bay, giao ngay 30 phút!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    const el = document.getElementById('speakers');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#864d61] text-white font-headline text-base px-8 py-3.5 rounded-full clay-button-pink flex items-center justify-center cursor-pointer active:scale-95 transition-transform shadow-md"
                >
                  <span>Thuê Loa Ngay</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('sound-demo');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#b2f2bb] text-[#00210b] font-headline text-base px-7 py-3.5 rounded-full clay-button-green flex items-center justify-center cursor-pointer active:scale-95 transition-transform shadow-md"
                >
                  <span>Vi vu</span>
                </button>
              </div>

              {/* Party Combo Visual Showcase - Ảnh Tràn Viền 100% Cực Kỳ Sướng Mắt */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-6 mt-12 max-w-5xl mx-auto w-full">
                {/* Card 1: Bia */}
                <div
                  onClick={() => setZoomImageModal({ id: 'bia', location: 'Bia Tươi Mát Lạnh', img: '/bia.png' })}
                  className="relative aspect-[3/4] max-h-72 rounded-[2rem] sm:rounded-[2.4rem] overflow-hidden border-2 border-[#ffd9e3] bg-gradient-to-b from-[#ffe5ee] via-[#fff0f5] to-[#ffd6e4] shadow-[0_12px_28px_rgba(134,77,97,0.12)] hover:shadow-[0_20px_45px_rgba(134,77,97,0.25)] hover:-translate-y-2 active:scale-95 transition-all duration-500 flex items-center justify-center p-3 sm:p-4 group cursor-pointer select-none"
                >
                  <img
                    src="/bia.png"
                    alt="Bia"
                    className="h-[92%] w-auto object-contain drop-shadow-[0_12px_20px_rgba(134,77,97,0.25)] group-hover:scale-120 group-hover:rotate-[-5deg] transition-all duration-500 ease-out"
                  />
                </div>

                {/* Card 2: Mồi - Tràn viền 100% */}
                <div
                  onClick={() => setZoomImageModal({ id: 'moi', location: 'Mồi Ngon Phú Yên', img: '/moi.png' })}
                  className="relative aspect-[3/4] max-h-72 rounded-[2rem] sm:rounded-[2.4rem] overflow-hidden border-2 border-[#b2f2bb] shadow-[0_12px_28px_rgba(47,106,63,0.12)] hover:shadow-[0_20px_45px_rgba(47,106,63,0.25)] hover:-translate-y-2 active:scale-95 transition-all duration-500 group cursor-pointer select-none"
                >
                  <img
                    src="/moi.png"
                    alt="Mồi"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Card 3: Bạn Bè - Tràn viền 100% */}
                <div
                  onClick={() => setZoomImageModal({ id: 'friend', location: 'Hội Mấy Ní Ca Hát', img: '/friend.png' })}
                  className="relative aspect-[3/4] max-h-72 rounded-[2rem] sm:rounded-[2.4rem] overflow-hidden border-2 border-[#c9e6ff] shadow-[0_12px_28px_rgba(35,90,124,0.12)] hover:shadow-[0_20px_45px_rgba(35,90,124,0.25)] hover:-translate-y-2 active:scale-95 transition-all duration-500 group cursor-pointer select-none"
                >
                  <img
                    src="/friend.png"
                    alt="Bạn bè"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Card 4: Clean - Tràn viền 100% */}
                <div
                  onClick={() => setZoomImageModal({ id: 'clean', location: 'Dọn Dẹp Gọn Gàng', img: '/clean.png' })}
                  className="relative aspect-[3/4] max-h-72 rounded-[2rem] sm:rounded-[2.4rem] overflow-hidden border-2 border-[#ebd4ff] shadow-[0_12px_28px_rgba(107,33,168,0.12)] hover:shadow-[0_20px_45px_rgba(107,33,168,0.25)] hover:-translate-y-2 active:scale-95 transition-all duration-500 group cursor-pointer select-none"
                >
                  <img
                    src="/clean.png"
                    alt="Dọn dẹp sạch sẽ"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════ INTERACTIVE SOUND DEMO & EQUALIZER ═══════════════ */}
        <section id="sound-demo" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 rounded-[3rem] p-6 sm:p-10 border-2 border-[#ffd9e3] shadow-[0_12px_36px_rgba(134,77,97,0.08)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Left text */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center px-3.5 py-1 bg-[#ffd9e3] rounded-full text-[#864d61] text-[13px] font-bold tracking-wide mb-2">
                  <span>Ngắm một tí nhé! rồi hát tiếp</span>
                </div>
                <h3 className="font-headline text-xl sm:text-4xl text-[#864d61] max-w-md leading-snug">
                  Vi vu một tí rồi dô bia
                </h3>
              </div>

              {/* Right Demo Buttons: 1 ảnh 1 dòng trên Mobile, 2 cột trên Tablet/Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full md:w-[480px]">
                {[
                  { id: 'nhan', name: 'Tháp Nhạn', location: 'Tháp Nhạn Cổ Kính • Tuy Hòa', img: '/anh8.png', color: 'from-[#864d61]/90', ring: 'ring-[#864d61]' },
                  { id: 'nghinhphong', name: 'Tháp Nghinh Phong', location: 'Tháp Nghinh Phong • Tuy Hòa', img: '/anh5.png', color: 'from-[#2f6a3f]/90', ring: 'ring-[#2f6a3f]' },
                  { id: 'honyen', name: 'Hòn Yến', location: 'Hòn Yến Biển Xanh • Tuy An', img: '/anh6.png', color: 'from-purple-950/90', ring: 'ring-purple-700' },
                  { id: 'muidien', name: 'Hải Đăng Mũi Điện', location: 'Hải Đăng Mũi Điện • Bãi Môn', img: '/anh7.png', color: 'from-[#235a7c]/90', ring: 'ring-[#235a7c]' }
                ].map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => setZoomImageModal(item)}
                      className="relative aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#ffd9e3] hover:border-[#864d61]/60 transition-all duration-300 active:scale-90 hover:scale-[1.03] cursor-pointer group shadow-sm hover:shadow-2xl select-none"
                    >
                      <img
                        src={item.img}
                        alt={item.location}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-112 group-active:scale-95 transition-transform duration-500 ease-out"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity`}></div>

                      {/* Click effect ripple highlight */}
                      <div className="absolute inset-0 bg-white/0 group-active:bg-white/25 transition-colors pointer-events-none"></div>

                      {/* Bottom Info: Chỉ hiển thị tên danh lam thắng cảnh */}
                      <div className="absolute bottom-2.5 left-3 right-3 text-left">
                        <span className="font-headline text-sm sm:text-base text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] block truncate group-hover:translate-x-1 transition-transform">
                          {item.location}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════ REVIEWS SECTION (MASONRY SPEECH BUBBLES) ═══════════════ */}
        <section id="reviews" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="font-headline text-xl sm:text-4xl text-[#864d61]">
                Cảm nhận của các nẫu
              </h2>
              <p className="text-[#514347] font-semibold text-sm sm:text-base mt-1">
                Mọi đánh giá đều thể hiện sự minh bạch, rõ ràng trong quá trình trải nghiệm.
              </p>
            </div>

            {/* Filter Tags Bar - Full width 4-column on mobile */}
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <button
                onClick={() => setReviewFilter('all')}
                className={`w-full sm:w-auto px-1.5 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center justify-center flex items-center whitespace-nowrap ${reviewFilter === 'all'
                  ? 'bg-[#864d61] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-[#eee4ff] border border-slate-200/60'
                  }`}
              >
                Tất cả ({reviewsList.length})
              </button>

              <button
                onClick={() => setReviewFilter('newest')}
                className={`w-full sm:w-auto px-1.5 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 sm:gap-1 whitespace-nowrap ${reviewFilter === 'newest'
                  ? 'bg-[#864d61] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-[#eee4ff] border border-slate-200/60'
                  }`}
              >
                <span>Gần nhất</span>
              </button>

              <button
                onClick={() => setReviewFilter('oldest')}
                className={`w-full sm:w-auto px-1.5 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 sm:gap-1 whitespace-nowrap ${reviewFilter === 'oldest'
                  ? 'bg-[#864d61] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-[#eee4ff] border border-slate-200/60'
                  }`}
              >
                <span>Lâu nhất</span>
              </button>

              {/* Star Rating Animated Dropdown */}
              <div className="relative w-full sm:w-auto" ref={starDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowStarDropdown(!showStarDropdown)}
                  className={`w-full sm:w-auto px-1.5 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap ${['5star', '4star', '3star', '2star', '1star'].includes(reviewFilter) || showStarDropdown
                    ? 'bg-[#864d61] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-[#eee4ff] border border-slate-200/60'
                    }`}
                >
                  <CuteStarIcon filled={true} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    {reviewFilter === '5star' ? '5 Sao' :
                      reviewFilter === '4star' ? '4 Sao' :
                        reviewFilter === '3star' ? '3 Sao' :
                          reviewFilter === '2star' ? '2 Sao' :
                            reviewFilter === '1star' ? '1 Sao' : 'Sao'}
                  </span>
                  <svg
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 shrink-0 ${showStarDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Animated Dropdown Menu with Smooth Unfold / Fold Transitions */}
                <div
                  className={`absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-36 sm:w-44 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-[0_14px_36px_rgba(134,77,97,0.2)] border-2 border-[#ffd9e3] z-40 origin-top-right sm:origin-top-left transition-all duration-300 ease-out ${showStarDropdown
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
                    }`}
                >
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const filterKey = `${stars}star`;
                    const isSelected = reviewFilter === filterKey;
                    const count = reviewsList.filter(r => r.rating === stars).length;
                    return (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => {
                          setReviewFilter(filterKey);
                          setShowStarDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected
                          ? 'bg-[#ffd9e3] text-[#864d61]'
                          : 'hover:bg-[#f8f1ff] text-slate-700 hover:text-[#864d61]'
                          }`}
                      >
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="flex text-amber-400">
                            {Array.from({ length: stars }).map((_, i) => (
                              <CuteStarIcon key={i} filled={true} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            ))}
                          </span>
                          <span className="text-[11px] sm:text-xs">{stars} Sao</span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold shrink-0">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Masonry Review Columns / Empty State / Loading */}
          {isLoadingReviews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white/80 rounded-[2rem] p-6 border border-[#ffd9e3] animate-pulse space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-amber-100/70 rounded-full w-24"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3.5 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-3.5 bg-slate-100 rounded-full w-4/5"></div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-28"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 sm:p-12 text-center border-2 border-dashed border-[#fab3ca] shadow-[0_12px_36px_rgba(134,77,97,0.06)] max-w-xl mx-auto my-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffd9e3] via-[#ffecf2] to-[#ffe5ee] border-2 border-[#fab3ca] flex items-center justify-center mb-4 shadow-xs">
                <CuteReviewChatIcon className="w-10 h-10 text-[#864d61]" />
              </div>
              <h3 className="font-headline text-xl sm:text-2xl text-[#864d61] mb-2">
                Chưa có nhận xét nào
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md mb-6 leading-relaxed">
                {reviewFilter !== 'all' && reviewFilter !== 'newest' && reviewFilter !== 'oldest'
                  ? 'Chưa có đánh giá nào trong bộ lọc này. Hãy thử chọn bộ lọc khác hoặc là người đầu tiên để lại cảm nhận nhé!'
                  : 'Hãy là người đầu tiên chia sẻ cảm nhận trải nghiệm thuê loa tại Kẹo Kéo Dặm nhé!'}
              </p>
              <button
                type="button"
                onClick={handleOpenReviewModal}
                className="px-6 py-3.5 rounded-2xl bg-[#864d61] text-white font-headline text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer clay-button-pink"
              >
                <span>Viết đánh giá ngay</span>
              </button>
            </div>
          ) : (
            <>
              <div
                key={`${reviewCurrentPage}-${pageSlideDirection}`}
                className={`columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 animate-in fade-in duration-350 ease-out ${pageSlideDirection === 'next' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'
                  }`}
              >
                {paginatedReviews.map((rev) => {
                  // Reusable Owner Reply Component Block
                  const renderOwnerReplyBlock = () => {
                    const isExpanded = Boolean(expandedReplies[rev.id]);

                    return (
                      <div className="mt-2.5 relative pl-5 sm:pl-7">
                        {/* Thread Connector Curve */}
                        <div className="absolute left-2 top-0 bottom-4 w-3.5 border-l-2 border-b-2 border-[#fab3ca]/70 rounded-bl-xl pointer-events-none"></div>

                        {rev.ownerReply ? (
                          <div className="relative z-10 space-y-1.5">
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => toggleReplyExpand(rev.id)}
                                className="text-[11px] font-headline font-bold text-[#864d61] bg-[#ffd9e3]/90 hover:bg-[#ffd9e3] px-3 py-1 rounded-full border border-[#fab3ca] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 hover:scale-105"
                              >
                                <span>{isExpanded ? 'Ẩn phản hồi' : 'Xem phản hồi'}</span>
                                <svg
                                  className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>

                            <div
                              className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                                }`}
                            >
                              <div className="overflow-hidden">
                                <div className="bg-white/95 backdrop-blur-xs rounded-2xl rounded-tl-sm p-3.5 shadow-sm border border-[#fab3ca]/80 transition-all duration-300 relative mt-1">
                                  {/* Connector Speech Tail */}
                                  <div className="absolute -top-1.5 left-3 w-3 h-3 bg-white transform rotate-45 border-t border-l border-[#fab3ca]/80"></div>

                                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap relative z-10">
                                    <div className="flex items-center gap-2">
                                      <img
                                        src="/anh3.png"
                                        alt="Kẹo Kéo Dặm"
                                        className="w-6 h-6 rounded-full object-cover border border-[#fab3ca] shadow-2xs shrink-0"
                                      />
                                      <span className="font-headline font-bold text-xs text-[#864d61]">
                                        {rev.ownerReplyBy || 'Kẹo Kéo Dặm'}
                                      </span>
                                    </div>
                                    {rev.ownerReplyAt && (
                                      <span className="text-xs font-bold text-[#864d61] bg-[#ffd9e3] px-2.5 py-0.5 rounded-full border border-[#fab3ca] shadow-2xs">
                                        {rev.ownerReplyAt}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-[13px] text-[#514347] font-medium leading-relaxed bg-[#fdf7ff] p-2.5 rounded-xl border border-[#ffd9e3]/60 relative z-10">
                                    {rev.ownerReply}
                                  </p>
                                  <div className="flex justify-end mt-1.5 relative z-10">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenReplyModal(rev)}
                                      className="text-[11px] font-bold text-[#864d61] hover:underline cursor-pointer transition-colors"
                                    >
                                      <span>Sửa phản hồi</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative z-10 flex items-center justify-between py-1">
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100/90 px-2.5 py-0.5 rounded-full border border-slate-200/70 select-none">
                              Chưa phản hồi
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenReplyModal(rev)}
                              className="text-[11px] font-bold text-[#864d61] hover:text-[#512332] hover:underline cursor-pointer transition-colors ml-auto"
                            >
                              <span>Trả lời</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  };

                  if (rev.colorScheme === 'imageCard') {
                    return (
                      <article key={rev.id} className="break-inside-avoid relative">
                        <div className="bg-[#ffb7ce] rounded-[2rem] p-1.5 shadow-[0_12px_32px_rgba(134,77,97,0.15)] relative z-10 transition-transform duration-300 hover:scale-[1.02] border border-[#fab3ca]">
                          <div className="relative w-full h-48 rounded-t-[1.7rem] overflow-hidden mb-2">
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url('${rev.bannerImage}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ffb7ce] via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <CuteStarIcon key={i} filled={true} className="w-5 h-5 drop-shadow-xs" />
                                ))}
                              </div>
                              {rev.time && (
                                <span className="text-xs font-bold text-[#7b4458] bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#fab3ca]/60 shadow-xs">
                                  {rev.time}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-4 pt-1">
                            <h4 className="font-headline text-lg sm:text-xl text-[#7b4458] mb-2">{rev.title || 'Buổi Tiệc Tuyệt Vời Nhất'}</h4>
                            <p className="text-sm sm:text-base text-[#7b4458]/90 font-medium leading-relaxed">
                              "{rev.comment}"
                            </p>
                            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#864d61]/15">
                              <div className="w-11 h-11 rounded-full border-2 border-[#864d61] bg-white shadow-sm shrink-0 overflow-hidden">
                                <img src={rev.avatar || '/pink.png'} alt={rev.name} className="w-full h-full object-cover rounded-full" />
                              </div>
                              <div>
                                <h3 className="font-headline text-sm text-[#7b4458]">{rev.name}</h3>
                              </div>
                            </div>
                            {renderOwnerReplyBlock()}
                          </div>
                        </div>
                      </article>
                    );
                  }

                  if (rev.colorScheme === 'darkCard') {
                    return (
                      <article key={rev.id} className="break-inside-avoid relative">
                        <div className="bg-[#201047] rounded-[2.5rem] p-6 shadow-xl relative z-10 transition-transform duration-300 hover:-translate-y-2 border border-purple-900/40">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-1">
                              {[...Array(rev.rating)].map((_, i) => (
                                <CuteStarIcon key={i} filled={true} className="w-5 h-5" />
                              ))}
                            </div>
                            {rev.time && (
                              <span className="text-xs font-bold text-purple-200 bg-purple-900/80 px-2.5 py-0.5 rounded-full border border-purple-700/60 shadow-xs">
                                {rev.time}
                              </span>
                            )}
                          </div>
                          <p className="text-base text-[#f6eeff] font-medium leading-relaxed mb-4">
                            "{rev.comment}"
                          </p>
                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-purple-800/40">
                            <div className="w-11 h-11 rounded-full border-2 border-[#ffb7ce] bg-white shrink-0 overflow-hidden">
                              <img src={rev.avatar || '/pink.png'} alt={rev.name} className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div>
                              <h3 className="font-headline text-sm text-[#f6eeff]">{rev.name}</h3>
                            </div>
                          </div>
                          {renderOwnerReplyBlock()}
                        </div>
                      </article>
                    );
                  }

                  if (rev.colorScheme === 'whiteCard') {
                    return (
                      <article key={rev.id} className="break-inside-avoid relative">
                        <div className="bg-white rounded-[2rem] p-6 shadow-[0_6px_20px_rgba(134,77,97,0.06)] border-2 border-[#ffd9e3] relative z-10 transition-transform duration-300 hover:-translate-y-2">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-1">
                              {[...Array(rev.rating)].map((_, i) => (
                                <CuteStarIcon key={i} filled={true} className="w-4.5 h-4.5" />
                              ))}
                            </div>
                            {rev.time && (
                              <span className="text-xs font-bold text-[#864d61] bg-[#ffd9e3]/70 px-2.5 py-0.5 rounded-full border border-[#fab3ca]/60 shadow-xs">
                                {rev.time}
                              </span>
                            )}
                          </div>
                          <p className="text-sm sm:text-base text-[#201047] font-medium leading-relaxed mb-4 italic">
                            "{rev.comment}"
                          </p>
                          <div className="flex items-center gap-3">
                            <CuteAvatarPill name={rev.name} letter={rev.avatarLetter || 'K'} color={rev.avatarColor || rev.colorScheme || 'pink'} />
                            <div>
                              <h3 className="font-headline text-sm text-[#201047]">{rev.name}</h3>
                            </div>
                          </div>
                          {renderOwnerReplyBlock()}
                        </div>
                      </article>
                    );
                  }

                  if (rev.colorScheme === 'blue') {
                    return (
                      <article key={rev.id} className="break-inside-avoid relative">
                        <div className="bg-[#c9e6ff]/50 rounded-[2.2rem] p-6 shadow-[0_8px_24px_rgba(35,90,124,0.06),inset_0_2px_12px_rgba(255,255,255,0.9)] relative z-10 transition-transform duration-300 hover:-translate-y-2 border border-[#9ed1f8]/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-1">
                              {[...Array(rev.rating)].map((_, i) => (
                                <CuteStarIcon key={i} filled={true} className="w-5 h-5" />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-[#235a7c] bg-[#c9e6ff] px-2.5 py-0.5 rounded-full border border-[#9ed1f8]">{rev.time}</span>
                          </div>
                          <p className="text-sm sm:text-base text-[#0c4b6c] font-semibold leading-relaxed mb-2">
                            "{rev.comment}"
                          </p>
                        </div>
                        <div className="flex items-center flex-row-reverse gap-3 mt-4 pr-3 text-right">
                          <div className="w-12 h-12 rounded-2xl border-[3px] border-[#9ed1f8] bg-white shadow-sm shrink-0 transform rotate-3 overflow-hidden">
                            <img src={rev.avatar || '/blue.png'} alt={rev.name} className="w-full h-full object-cover rounded-xl" />
                          </div>
                          <div>
                            <h3 className="font-headline text-sm text-[#201047]">{rev.name}</h3>
                          </div>
                        </div>
                        {renderOwnerReplyBlock()}
                      </article>
                    );
                  }

                  if (rev.colorScheme === 'green') {
                    return (
                      <article key={rev.id} className="break-inside-avoid relative">
                        <div className="bg-[#b2f2bb]/50 rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(47,106,63,0.06),inset_0_2px_12px_rgba(255,255,255,0.9)] relative z-10 transition-transform duration-300 hover:-translate-y-2 border border-[#96d5a0]/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-1">
                              {[...Array(rev.rating)].map((_, i) => (
                                <CuteStarIcon key={i} filled={true} className="w-5 h-5" />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-[#2f6a3f] bg-[#b2f2bb] px-2.5 py-0.5 rounded-full border border-[#96d5a0] flex items-center gap-1 shadow-xs">
                              {rev.time}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-[#00210b] font-semibold leading-relaxed mb-2">
                            "{rev.comment}"
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 pl-3">
                          <div className="w-12 h-12 rounded-full border-[3px] border-[#96d5a0] bg-white shadow-sm shrink-0 overflow-hidden">
                            <img src={rev.avatar || '/green.png'} alt={rev.name} className="w-full h-full object-cover rounded-full" />
                          </div>
                          <div>
                            <h3 className="font-headline text-sm text-[#201047]">{rev.name}</h3>
                          </div>
                        </div>
                        {renderOwnerReplyBlock()}
                      </article>
                    );
                  }

                  const isNewlyAdded = rev.id === highlightedReviewId;

                  return (
                    <article key={rev.id} className={`break-inside-avoid relative transition-all duration-500 ${isNewlyAdded ? 'ring-4 ring-[#10b981] ring-offset-4 rounded-[2.5rem] shadow-[0_0_40px_rgba(16,185,129,0.35)] scale-[1.02] animate-in zoom-in-95' : ''}`}>
                      {isNewlyAdded && (
                        <div className="absolute -top-3 right-6 z-30 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black px-3 py-0.5 rounded-full shadow-md animate-bounce flex items-center gap-1 border border-white">
                          <span>✨ Vừa đăng mới!</span>
                        </div>
                      )}
                      <div className="bg-[#f3eaff] rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(134,77,97,0.06),inset_0_2px_12px_rgba(255,255,255,0.8)] relative z-10 transition-transform duration-300 hover:-translate-y-2 border border-[#ffd9e3]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex gap-1">
                            {[...Array(rev.rating)].map((_, i) => (
                              <CuteStarIcon key={i} filled={true} className="w-5 h-5" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#864d61] bg-[#ffd9e3] px-2.5 py-0.5 rounded-full border border-[#fab3ca]">{rev.time}</span>
                        </div>
                        <p className="text-sm sm:text-base text-[#201047] font-semibold leading-relaxed mb-2">
                          "{rev.comment}"
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 pl-3">
                        <div className="w-12 h-12 rounded-full border-[3px] border-[#ffd9e3] bg-white shadow-sm shrink-0 overflow-hidden">
                          {rev.avatar ? (
                            <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <CuteAvatarPill name={rev.name} letter={rev.avatarLetter || 'U'} color={rev.avatarColor || rev.colorScheme || 'pink'} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-headline text-sm text-[#201047]">{rev.name}</h3>
                        </div>
                      </div>
                      {renderOwnerReplyBlock()}
                    </article>
                  );
                })}
              </div>

              {/* ═══════════════ PAGINATION CONTROLS CHO ĐÁNH GIÁ ═══════════════ */}
              {totalReviewPages > 1 && (
                <div className="mt-8 flex justify-center w-full">
                  <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full sm:rounded-3xl p-1.5 sm:px-6 sm:py-3.5 border-2 border-[#ffd9e3] shadow-[0_4px_16px_rgba(134,77,97,0.06)] sm:w-full sm:justify-between">
                    <span className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-slate-500 text-left">
                      Hiển thị <strong className="text-[#864d61]">{(reviewCurrentPage - 1) * REVIEWS_PER_PAGE + 1} - {Math.min(reviewCurrentPage * REVIEWS_PER_PAGE, filteredReviews.length)}</strong> trong <strong className="text-[#201047]">{filteredReviews.length}</strong> nhận xét
                    </span>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Prev Button */}
                      <button
                        type="button"
                        disabled={reviewCurrentPage === 1}
                        onClick={() => handlePageChange(reviewCurrentPage - 1)}
                        className="w-9 h-9 sm:w-auto sm:px-3.5 sm:py-2 rounded-full sm:rounded-2xl border-2 border-[#fab3ca]/60 font-headline font-bold text-xs sm:text-sm text-[#864d61] bg-white hover:bg-[#ffd9e3] disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center gap-1"
                        title="Trang trước"
                      >
                        <span className="text-sm">←</span>
                        <span className="hidden sm:inline">Trước</span>
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalReviewPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isActive = pageNum === reviewCurrentPage;

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full sm:rounded-2xl font-headline font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center ${isActive
                              ? 'bg-[#864d61] text-white shadow-md shadow-[#864d61]/30 scale-105 border-2 border-[#864d61]'
                              : 'bg-white hover:bg-[#ffd9e3]/60 text-slate-700 hover:text-[#864d61] border-2 border-slate-200/70 hover:border-[#fab3ca]'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        type="button"
                        disabled={reviewCurrentPage === totalReviewPages}
                        onClick={() => handlePageChange(reviewCurrentPage + 1)}
                        className="w-9 h-9 sm:w-auto sm:px-3.5 sm:py-2 rounded-full sm:rounded-2xl border-2 border-[#fab3ca]/60 font-headline font-bold text-xs sm:text-sm text-[#864d61] bg-white hover:bg-[#ffd9e3] disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center gap-1"
                        title="Trang sau"
                      >
                        <span className="hidden sm:inline">Sau</span>
                        <span className="text-sm">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* ═══════════════ SPEAKER FLEET & PRICING PACKAGES ═══════════════ */}
        <section id="speakers" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#ffd9e3] rounded-full text-[#864d61] text-xs font-bold uppercase tracking-wider mb-2">
              <CuteSpeakerIcon className="w-4 h-4" />
              <span>Bảng Giá Thuê Loa Siêu Xinh</span>
            </div>
            <h2 className="font-headline text-xl sm:text-4xl text-[#864d61]">
              Những dàn loa cho các nẫu
            </h2>
            <p className="text-[#514347] font-semibold text-sm sm:text-base mt-2">
              Tất cả các gói đều bao gồm 2 micro không dây UHF cao cấp, pin dự phòng và hỗ trợ test âm thanh tận nơi!
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {speakerPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-3xl sm:rounded-[2.5rem] bg-white p-3.5 sm:p-6 shadow-[0_10px_30px_rgba(134,77,97,0.08)] border-2 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${pkg.popular ? 'border-[#864d61] ring-2 sm:ring-4 ring-[#ffd9e3]/60' : 'border-[#e9ddff]'
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#864d61] text-white text-[9px] sm:text-xs font-headline px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
                    <CuteStarIcon filled={true} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                    <span>Khuyên Dùng</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className={`text-[9px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border truncate max-w-[85px] sm:max-w-none ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#f3eaff] text-[#864d61] flex items-center justify-center border border-[#ffd9e3] shrink-0">
                      <CuteSpeakerIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <h3 className="font-headline text-sm sm:text-xl text-[#201047] mb-1 line-clamp-1">{pkg.name}</h3>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1 my-2 sm:my-3">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline text-lg sm:text-3xl text-[#864d61]">
                        {pkg.hourlyRate.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ giờ</span>
                    </div>
                    <span className="text-[9px] sm:text-xs font-bold text-emerald-700 sm:ml-auto bg-emerald-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-emerald-200 w-fit">
                      {pkg.dailyRate.toLocaleString('vi-VN')}₫/ngày
                    </span>
                  </div>

                  {/* Specs Pill */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 py-1 sm:py-2 px-1.5 sm:px-3 bg-[#fdf7ff] rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-600 mb-3 sm:mb-4 border border-[#e9ddff]">
                    <span className="flex items-center gap-0.5 sm:gap-1 text-amber-700">
                      <CuteLightningIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {pkg.power}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="flex items-center gap-0.5 sm:gap-1 text-emerald-700">
                      <CuteBatteryIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {pkg.battery}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs font-semibold text-[#514347] mb-3 sm:mb-6">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1 sm:gap-2">
                        <CuteCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenRentSpeaker(pkg)}
                  className={`w-full py-2 sm:py-3.5 rounded-xl sm:rounded-2xl font-headline text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center ${pkg.buttonBg}`}
                >
                  <span>Thuê Loa Này</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ FAQ SECTION (CÂU HỎI THƯỜNG GẶP) ═══════════════ */}
        <section id="faq" className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-headline text-xl sm:text-4xl text-[#864d61]">
              Câu hỏi hằng ngày
            </h2>

          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${isOpen
                    ? 'border-[#fab3ca] shadow-[0_8px_24px_rgba(134,77,97,0.1)] ring-2 ring-[#ffd9e3]/60 -translate-y-0.5'
                    : 'border-[#e9ddff] hover:border-[#ffd9e3] hover:shadow-sm'
                    }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-headline text-base text-[#201047] hover:bg-[#fdf7ff] transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${isOpen ? 'bg-[#864d61] text-white' : 'bg-[#ffd9e3] text-[#864d61]'
                        }`}>
                        {idx + 1}
                      </span>
                      <span className="font-headline font-bold text-sm sm:text-base text-[#201047]">{faq.q}</span>
                    </span>

                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${isOpen
                      ? 'bg-[#ffd9e3] text-[#864d61] rotate-180'
                      : 'bg-[#fdf7ff] text-[#864d61] group-hover:bg-[#ffd9e3]/60'
                      }`}>
                      <svg className="w-4 h-4 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>

                  {/* Smooth Animated Height & Opacity Collapse Container */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-2 text-sm font-semibold text-[#514347] leading-relaxed border-t border-[#ffd9e3]/40 bg-[#fdf7ff]/70">
                        <div className="flex items-start gap-3">
                          <CuteChatAnswerIcon className="w-5 h-5 shrink-0 mt-0.5" />
                          <span>{faq.a}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ WHY CHOOSE US (ƯU ĐIỂM) ═══════════════ */}
        <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#f3eaff] rounded-[2.5rem] sm:rounded-[3.5rem] p-4 sm:p-12 border-2 border-[#ffd9e3] shadow-[inset_0_4px_20px_rgba(255,255,255,0.9),0_10px_30px_rgba(134,77,97,0.06)]">
            <div className="text-left mb-4 sm:mb-6">
              <h2 className="font-headline text-xl sm:text-4xl text-[#864d61]">
                Dặm sẽ ship hỏa tốc?
              </h2>
            </div>

            <div
              onClick={() => {
                setModalZoomScale(1.6);
                setZoomImageModal({
                  id: 'loca',
                  location: 'Khu vực giao loa hỏa tốc Tuy Hòa - Phú Yên',
                  img: '/loca.png'
                });
              }}
              className="w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border-2 border-[#ffd9e3] bg-white cursor-pointer group relative select-none h-80 sm:h-96 md:h-[28rem]"
              title="Nhấn để xem ảnh phóng to"
            >
              <img
                src="/loca.png"
                alt="Khu vực giao loa hỏa tốc Tuy Hòa - Phú Yên"
                className="w-full h-full object-cover object-[67%_62%] scale-[1.45] sm:scale-[1.3] group-hover:scale-[1.5] transition-transform duration-500 ease-out origin-[67%_62%]"
              />
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm font-headline px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-lg border border-white/25 transition-all opacity-85 group-hover:opacity-100 group-hover:scale-105">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <span>Xem ảnh lớn</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ BOTTOM CTA BANNER ═══════════════ */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 text-center">
          <div className="bg-[#f8f1ff] rounded-[3.5rem] p-8 sm:p-14 shadow-[inset_0_4px_24px_rgba(255,255,255,0.9),0_8px_32px_rgba(134,77,97,0.08)] flex flex-col items-center border-[4px] border-white">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#ffb7ce] rounded-[2rem] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(255,255,255,0.5),0_8px_16px_rgba(134,77,97,0.2)] mb-6 transform rotate-[-10deg] hover:rotate-0 transition-transform border-2 border-white">
              <CuteMicIcon className="w-12 h-12" />
            </div>

            <h2 className="font-headline text-xl sm:text-4xl text-[#864d61] mb-2">
              Chuẩn bị hết rồi thì đừng quên
            </h2>

            <p className="text-[#514347] font-semibold text-sm sm:text-base max-w-md mb-8">
              Rủ bạn bè tụ tập, nhận ngay loa xịn và cùng nhau tạo nên những kỷ niệm thật vui nhộn nào!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:0368115592"
                className="bg-[#864d61] text-white font-headline text-base sm:text-lg px-8 py-4 rounded-full clay-button-pink flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                title="Mở ứng dụng điện thoại và tự soạn sẵn số 0368.115.592"
              >
                <span>Lưu Số Ngay</span>
              </a>

              <a
                href="tel:0368115592"
                className="bg-white text-[#201047] font-headline text-base sm:text-lg px-7 py-4 rounded-full border-2 border-[#864d61]/20 hover:bg-[#eee4ff] transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Hotline: 0368.115.592</span>
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════ SAFETY NOTICE SECTION (ĐÃ UỐNG RƯỢU BIA THÌ KHÔNG LÁI XE) ═══════════════ */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <div className="bg-gradient-to-br from-[#fff5f5] via-[#fff0f3] to-[#fff8f0] rounded-[2.8rem] p-6 sm:p-10 border-2 border-[#ffd9e3] shadow-[0_12px_36px_rgba(134,77,97,0.08)] flex flex-col items-center">
            <h3 className="font-headline text-xl sm:text-4xl text-rose-700 leading-snug mb-5 sm:mb-7 text-center">
              Lưu ý! Đã uống rượu bia thì không lái xe.
            </h3>
            <div
              onClick={() => setZoomImageModal({ id: 'congan', location: 'Lưu ý! Đã uống rượu bia thì không lái xe.', img: '/congan.png' })}
              className="w-full max-w-2xl rounded-3xl overflow-hidden border-2 border-white/80 shadow-md bg-white cursor-pointer hover:shadow-2xl active:scale-95 transition-all group select-none"
              title="Chạm để phóng to"
            >
              <img
                src="/congan.png"
                alt="Chú công an nhắc nhở an toàn giao thông"
                className="w-full h-auto max-h-[480px] object-contain group-hover:scale-105 transition-transform duration-500 block mx-auto"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-[#f8f1ff] border-t border-[#864d61]/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-3">
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/anh3.png"
              alt="Dặm"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_10px_rgba(134,77,97,0.18)]"
            />
            <span className="font-headline text-[20px] text-[#864d61] tracking-tight">Dặm</span>
          </div>
          <p className="text-sm font-semibold text-slate-500 max-w-md">
            Chia sẻ âm thanh hạnh phúc đến mọi bữa tiệc. Thuê loa kẹo kéo uy tín, âm thanh chất lượng tốt nhất.
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs font-bold flex-wrap justify-center">
            <span className="text-[#864d61]/70">Được phát triển bởi Hồ Văn Duy</span>
          </div>
        </div>
      </footer>

      {/* ═══════════════ MODAL: ĐẶT LOA SIÊU NHANH ═══════════════ */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 border-2 border-[#ffd9e3] shadow-2xl relative overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ffb7ce] text-[#7b4458] flex items-center justify-center shadow-xs border border-[#fab3ca]">
                  <CuteSpeakerIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-headline text-xl text-[#864d61]">Đặt Thuê Loa Ngay</h3>
                  <p className="text-xs font-bold text-slate-500">Giao hỏa tốc 30 phút Tuy Hòa & Phú Yên • Test loa ưng ý mới nhận</p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce border-2 border-emerald-300">
                  <CuteCheckIcon className="w-8 h-8" />
                </div>
                <h4 className="font-headline text-2xl text-emerald-800">Đặt Loa Thành Công!</h4>
                <p className="text-sm font-semibold text-slate-600 max-w-xs">
                  Nhân viên Locahome đang chuẩn bị loa và sẽ gọi xác nhận trong 3 phút tới nhé!
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className={`flex flex-col gap-3.5 ${bookingFormShake ? 'animate-shake' : ''}`}>
                {/* Speaker Package Selector */}
                <div>
                  <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider mb-1">
                    Dòng Loa Đã Chọn
                  </label>
                  <select
                    value={bookingFormData.speakerType}
                    onChange={(e) => {
                      const selected = speakerPackages.find(p => `${p.name} (${p.power})` === e.target.value);
                      setBookingFormData({
                        ...bookingFormData,
                        speakerType: e.target.value,
                        pricePerHour: selected ? selected.hourlyRate : 80000
                      });
                    }}
                    className="w-full px-4 py-3 rounded-2xl bg-[#fdf7ff] border border-[#e9ddff] font-bold text-sm text-[#201047] focus:ring-2 focus:ring-[#864d61] focus:outline-none"
                  >
                    {speakerPackages.map(pkg => (
                      <option key={pkg.id} value={`${pkg.name} (${pkg.power})`}>
                        {pkg.name} ({pkg.power}) - {pkg.hourlyRate.toLocaleString('vi-VN')}₫/h
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider">
                        Họ Và Tên <span className="text-rose-500">*</span>
                      </label>
                      {bookingFormTouched.name && bookingFormData.name.trim() && (
                        <span className="text-[13px] font-bold text-emerald-600">Hợp lệ</span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Ví dụ: Anh Nam, Chị Mai"
                      value={bookingFormData.name}
                      onBlur={() => setBookingFormTouched(prev => ({ ...prev, name: true }))}
                      onChange={(e) => {
                        setBookingFormData({ ...bookingFormData, name: e.target.value });
                        if (!bookingFormTouched.name) setBookingFormTouched(prev => ({ ...prev, name: true }));
                      }}
                      className={`w-full px-4 py-2.5 rounded-2xl font-bold text-sm text-slate-900 transition-all focus:outline-none ${bookingFormTouched.name && !bookingFormData.name.trim()
                        ? 'bg-rose-50/70 border-2 border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : bookingFormTouched.name && bookingFormData.name.trim()
                          ? 'bg-emerald-50/20 border-2 border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                          : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#864d61]'
                        }`}
                    />
                    {bookingFormTouched.name && !bookingFormData.name.trim() && (
                      <p className="text-[13px] font-bold text-rose-600 mt-1">Vui lòng nhập họ tên</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider">
                        Số Điện Thoại <span className="text-rose-500">*</span>
                      </label>
                      {bookingFormTouched.phone && /^(0[3|5|7|8|9])[0-9]{8}$/.test(bookingFormData.phone.replace(/[\s.-]/g, '')) && (
                        <span className="text-[13px] font-bold text-emerald-600">Hợp lệ</span>
                      )}
                    </div>
                    <input
                      type="tel"
                      placeholder="0368.xxx.xxx"
                      value={bookingFormData.phone}
                      onBlur={() => setBookingFormTouched(prev => ({ ...prev, phone: true }))}
                      onChange={(e) => {
                        setBookingFormData({ ...bookingFormData, phone: e.target.value });
                        if (!bookingFormTouched.phone) setBookingFormTouched(prev => ({ ...prev, phone: true }));
                      }}
                      className={`w-full px-4 py-2.5 rounded-2xl font-bold text-sm text-slate-900 transition-all focus:outline-none ${bookingFormTouched.phone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(bookingFormData.phone.replace(/[\s.-]/g, ''))
                        ? 'bg-rose-50/70 border-2 border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : bookingFormTouched.phone && /^(0[3|5|7|8|9])[0-9]{8}$/.test(bookingFormData.phone.replace(/[\s.-]/g, ''))
                          ? 'bg-emerald-50/20 border-2 border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                          : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#864d61]'
                        }`}
                    />
                    {bookingFormTouched.phone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(bookingFormData.phone.replace(/[\s.-]/g, '')) && (
                      <p className="text-[13px] font-bold text-rose-600 mt-1">SĐT không hợp lệ (VD: 0368115592)</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider">
                      Địa Chỉ Giao Loa Tận Nơi <span className="text-rose-500">*</span>
                    </label>
                    {bookingFormTouched.address && bookingFormData.address.trim() && (
                      <span className="text-[13px] font-bold text-emerald-600">Hợp lệ</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường, phường, quận/huyện..."
                    value={bookingFormData.address}
                    onBlur={() => setBookingFormTouched(prev => ({ ...prev, address: true }))}
                    onChange={(e) => {
                      setBookingFormData({ ...bookingFormData, address: e.target.value });
                      if (!bookingFormTouched.address) setBookingFormTouched(prev => ({ ...prev, address: true }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-2xl font-bold text-sm text-slate-900 transition-all focus:outline-none ${bookingFormTouched.address && !bookingFormData.address.trim()
                      ? 'bg-rose-50/70 border-2 border-rose-400 focus:ring-2 focus:ring-rose-200'
                      : bookingFormTouched.address && bookingFormData.address.trim()
                        ? 'bg-emerald-50/20 border-2 border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                        : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#864d61]'
                      }`}
                  />
                  {bookingFormTouched.address && !bookingFormData.address.trim() && (
                    <p className="text-[13px] font-bold text-rose-600 mt-1">Vui lòng nhập địa chỉ giao loa</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider mb-1">
                      Thời Lượng Thuê
                    </label>
                    <select
                      value={bookingFormData.durationHours}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, durationHours: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm text-slate-900 focus:ring-2 focus:ring-[#864d61] focus:outline-none"
                    >
                      <option value={3}>3 Tiếng</option>
                      <option value={4}>4 Tiếng (Khuyên Dùng)</option>
                      <option value={6}>6 Tiếng</option>
                      <option value={12}>12 Tiếng (Nửa Ngày)</option>
                      <option value={24}>24 Tiếng (Trọn Gói 1 Ngày)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider mb-1">
                      Giờ Giao Loa
                    </label>
                    <input
                      type="time"
                      value={bookingFormData.startTime}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, startTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm text-slate-900 focus:ring-2 focus:ring-[#864d61] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Estimate Summary */}
                <div className="p-3.5 bg-[#fdf7ff] rounded-2xl border border-[#ffd9e3] flex items-center justify-between mt-1">
                  <div>
                    <p className="text-xs font-bold text-slate-500">Tạm tính ({bookingFormData.durationHours}h + Phí ship)</p>
                    <p className="text-lg font-headline text-[#864d61]">
                      {((bookingFormData.durationHours * bookingFormData.pricePerHour) + 20000).toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                    Miễn cọc CCCD
                  </span>
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenVietQR) {
                        const total = (bookingFormData.durationHours * bookingFormData.pricePerHour) + 20000;
                        onOpenVietQR(total, `LOCAHOME THUE LOA ${bookingFormData.name || 'KHACH'}`);
                      }
                    }}
                    className="flex-1 py-3 rounded-2xl bg-[#c9e6ff] text-[#0c4b6c] font-headline text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-[#9ed1f8] transition-colors border border-[#9ed1f8]"
                  >
                    <CuteQRIcon className="w-5 h-5" />
                    <span>Quét VietQR</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-[#864d61] text-white font-headline text-xs sm:text-sm clay-button-pink flex items-center justify-center gap-1.5"
                  >
                    <CuteCheckIcon className="w-4.5 h-4.5" />
                    <span>Xác Nhận Đặt Loa</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════ MODAL: VIẾT ĐÁNH GIÁ (HIỆU ỨNG MỞ & ĐÓNG SIÊU MƯỢT) ═══════════════ */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${showAddReviewModal && !isClosingReviewModal
          ? 'opacity-100 pointer-events-auto visible bg-black/60 backdrop-blur-md'
          : 'opacity-0 pointer-events-none invisible bg-black/0 backdrop-blur-none'
          }`}
        onClick={handleCloseReviewModal}
      >
        <div
          className={`bg-white rounded-[2.8rem] max-w-md w-full p-6 sm:p-8 border-3 border-[#ffd9e3] shadow-[0_25px_60px_rgba(134,77,97,0.25)] relative overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${showAddReviewModal && !isClosingReviewModal
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-90 translate-y-8 opacity-0 pointer-events-none'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Color Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#ffd9e3] via-[#ffb7ce] to-[#b2f2bb]"></div>

          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffd9e3] text-[#864d61] flex items-center justify-center border-2 border-[#fab3ca] shadow-xs shrink-0">
                <CuteStarIcon filled={true} className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-headline text-xl text-[#864d61]">Viết Đánh Giá Của Bạn</h3>
                <p className="text-xs font-semibold text-slate-500">Chia sẻ trải nghiệm thuê loa kéo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseReviewModal}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              title="Đóng"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleAddReviewSubmit} className={`flex flex-col gap-4 ${reviewFormShake ? 'animate-shake' : ''}`}>
            {/* Field: Name */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[13px] font-headline text-[#201047]">
                  Tên của bạn<span className="text-rose-500">*</span>
                </label>
                {reviewFormTouched.name && newReviewForm.name.trim() && (
                  <span className="text-[13px] font-bold text-emerald-600">
                    Hợp lệ
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="Nhập tên của bạn..."
                value={newReviewForm.name}
                onBlur={() => setReviewFormTouched(prev => ({ ...prev, name: true }))}
                onChange={(e) => {
                  setNewReviewForm({ ...newReviewForm, name: e.target.value });
                  if (!reviewFormTouched.name) setReviewFormTouched(prev => ({ ...prev, name: true }));
                }}
                className={`w-full px-4 py-3 rounded-2xl font-bold text-sm text-slate-900 transition-all shadow-inner focus:outline-none ${reviewFormTouched.name && !newReviewForm.name.trim()
                  ? 'bg-rose-50/70 border-2 border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : reviewFormTouched.name && newReviewForm.name.trim()
                    ? 'bg-emerald-50/20 border-2 border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                    : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#864d61] focus:bg-white'
                  }`}
              />
              {reviewFormTouched.name && !newReviewForm.name.trim() && (
                <p className="text-[13px] font-bold text-rose-600 mt-1 animate-in fade-in slide-in-from-top-1">
                  Vui lòng nhập tên của bạn
                </p>
              )}
            </div>

            {/* Field: Star Rating */}
            <div>
              <label className="block text-[13px] font-headline text-[#201047] mb-1.5">
                Số sao đánh giá
              </label>
              <div className="flex items-center gap-3 bg-[#fdf7ff] p-2.5 rounded-2xl border border-[#ffd9e3]">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => {
                        setNewReviewForm({ ...newReviewForm, rating: star });
                      }}
                      className="p-1 hover:scale-125 active:scale-90 transition-transform cursor-pointer"
                      title={`${star} Sao`}
                    >
                      <CuteStarIcon
                        filled={star <= newReviewForm.rating}
                        className={`w-7 h-7 transition-colors ${star <= newReviewForm.rating ? 'text-amber-400 drop-shadow-xs' : 'text-slate-200 hover:text-amber-200'
                          }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-xl border border-amber-200 shrink-0 ml-auto">
                  {newReviewForm.rating === 5 ? 'Quá đã! 5⭐' :
                    newReviewForm.rating === 4 ? 'Hài lòng 4⭐' :
                      newReviewForm.rating === 3 ? 'Bình thường 3⭐' :
                        newReviewForm.rating === 2 ? 'Tạm ổn 2⭐' : 'Cần cải thiện 1⭐'}
                </span>
              </div>
            </div>

            {/* Field: Chọn Màu Nền Thẻ Đánh Giá */}
            <div>
              <label className="block text-[13px] font-headline text-[#201047] mb-1.5">
                Chọn màu nền thẻ đánh giá
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {[
                  {
                    id: 'pink',
                    name: 'Hồng',
                    activeClass: 'bg-[#864d61] text-white border-[#864d61] shadow-md shadow-[#864d61]/30 ring-2 ring-[#864d61]/20 scale-[1.03]',
                    inactiveClass: 'bg-[#ffd9e3]/40 border-[#fab3ca]/60 text-[#864d61] hover:bg-[#ffd9e3]/80 hover:border-[#fab3ca]'
                  },
                  {
                    id: 'blue',
                    name: 'Xanh Dương',
                    activeClass: 'bg-[#235a7c] text-white border-[#235a7c] shadow-md shadow-[#235a7c]/30 ring-2 ring-[#235a7c]/20 scale-[1.03]',
                    inactiveClass: 'bg-[#c9e6ff]/40 border-[#9ed1f8]/60 text-[#235a7c] hover:bg-[#c9e6ff]/80 hover:border-[#9ed1f8]'
                  },
                  {
                    id: 'green',
                    name: 'Xanh Lá',
                    activeClass: 'bg-[#2f6a3f] text-white border-[#2f6a3f] shadow-md shadow-[#2f6a3f]/30 ring-2 ring-[#2f6a3f]/20 scale-[1.03]',
                    inactiveClass: 'bg-[#b2f2bb]/40 border-[#96d5a0]/60 text-[#2f6a3f] hover:bg-[#b2f2bb]/80 hover:border-[#96d5a0]'
                  }
                ].map((theme) => {
                  const isSelected = (newReviewForm.colorScheme || 'pink') === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setNewReviewForm({ ...newReviewForm, colorScheme: theme.id })}
                      className={`flex items-center justify-center gap-1 py-2.5 px-2 rounded-2xl border-2 font-headline font-bold text-xs sm:text-[13px] transition-all duration-200 cursor-pointer ${isSelected ? theme.activeClass : theme.inactiveClass
                        }`}
                    >
                      {isSelected && <span className="text-xs font-black">✓</span>}
                      <span>{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field: Comment */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[13px] font-headline text-[#201047]">
                  Nội dung cảm nhận<span className="text-rose-500">*</span>
                </label>
                <span className={`text-[12px] font-bold ${newReviewForm.comment.trim().length >= 5 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {newReviewForm.comment.trim().length}/300 ký tự
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                placeholder="Viết cảm nhận, đánh giá..."
                value={newReviewForm.comment}
                onBlur={() => setReviewFormTouched(prev => ({ ...prev, comment: true }))}
                onChange={(e) => {
                  setNewReviewForm({ ...newReviewForm, comment: e.target.value });
                  if (!reviewFormTouched.comment) setReviewFormTouched(prev => ({ ...prev, comment: true }));
                }}
                className={`w-full px-4 py-3 rounded-2xl font-medium text-sm text-slate-900 transition-all shadow-inner focus:outline-none ${reviewFormTouched.comment && (!newReviewForm.comment.trim() || newReviewForm.comment.trim().length < 5)
                  ? 'bg-rose-50/70 border-2 border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : reviewFormTouched.comment && newReviewForm.comment.trim().length >= 5
                    ? 'bg-emerald-50/20 border-2 border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                    : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#864d61] focus:bg-white'
                  }`}
              ></textarea>
              {reviewFormTouched.comment && (!newReviewForm.comment.trim() || newReviewForm.comment.trim().length < 5) && (
                <p className="text-[13px] font-bold text-rose-600 mt-1 animate-in fade-in slide-in-from-top-1">
                  {newReviewForm.comment.trim().length === 0 ? 'Vui lòng nhập cảm nhận của bạn' : 'Nội dung cảm nhận nên có ít nhất 5 ký tự'}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={handleCloseReviewModal}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 font-headline text-xs text-slate-700 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="flex-1 py-3.5 rounded-2xl bg-[#864d61] text-white font-headline text-xs clay-button-pink flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer disabled:opacity-70"
              >
                {isSubmittingReview ? (
                  <span className="inline-block animate-spin mr-1.5">⏳</span>
                ) : null}
                <span>{isSubmittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ═══════════════ MODAL: LIGHTBOX XEM FULL ẢNH VI VU PHÚ YÊN (HIỆU ỨNG MỞ & ĐÓNG) ═══════════════ */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 transition-all duration-300 ease-out ${zoomImageModal
          ? 'opacity-100 pointer-events-auto visible bg-black/85 backdrop-blur-md'
          : 'opacity-0 pointer-events-none invisible bg-black/0 backdrop-blur-none'
          }`}
        onClick={() => setZoomImageModal(null)}
      >
        <div
          className={`relative max-w-5xl w-full max-h-[94vh] flex flex-col items-center justify-center transition-all duration-300 ease-out transform ${zoomImageModal
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-90 translate-y-8 opacity-0 pointer-events-none'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setZoomImageModal(null)}
            className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center font-bold text-lg transition-all backdrop-blur-md cursor-pointer z-10 hover:scale-110 active:scale-90"
            title="Đóng (Esc)"
          >
            ✕
          </button>

          {/* Main Full Uncropped Image */}
          {zoomImageModal && (
            <div className="w-full flex flex-col items-center justify-center animate-photo-pop">
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-black/40 flex items-center justify-center max-h-[80vh] w-full">
                <img
                  src={zoomImageModal.img}
                  alt={zoomImageModal.location}
                  style={{
                    transform: `scale(${modalZoomScale})`,
                    transformOrigin: zoomImageModal.id === 'loca' ? '67% 62%' : 'center center',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-3xl select-none"
                />

                {/* Floating Zoom Controls */}
                <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-2xl border border-white/20 flex items-center gap-1.5 z-20 text-white shadow-lg">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalZoomScale(prev => Math.max(1, +(prev - 0.3).toFixed(1)));
                    }}
                    className="w-7 h-7 rounded-xl bg-white/20 hover:bg-white/40 flex items-center justify-center font-bold text-base transition-colors"
                    title="Thu nhỏ"
                  >
                    -
                  </button>
                  <span className="text-[11px] font-mono font-bold px-1 min-w-[2.8rem] text-center">
                    {Math.round(modalZoomScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalZoomScale(prev => Math.min(3, +(prev + 0.3).toFixed(1)));
                    }}
                    className="w-7 h-7 rounded-xl bg-white/20 hover:bg-white/40 flex items-center justify-center font-bold text-base transition-colors"
                    title="Phóng to"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalZoomScale(zoomImageModal.id === 'loca' ? 1.6 : 1);
                    }}
                    className="w-7 h-7 rounded-xl bg-white/20 hover:bg-white/40 flex items-center justify-center text-xs transition-colors"
                    title="Về mặc định"
                  >
                    ↺
                  </button>
                </div>
              </div>

              {/* Info bar below photo */}
              {zoomImageModal.location && (
                <div className="mt-3 w-full bg-white/15 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 text-white shadow-lg text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="font-headline text-base sm:text-lg text-white drop-shadow-sm">
                    {zoomImageModal.location}
                  </h4>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ MODAL: CHỦ QUÁN TRẢ LỜI ĐÁNH GIÁ (OWNER REPLY MODAL) ═══════════════ */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${showReplyModal && targetReviewForReply
          ? 'opacity-100 pointer-events-auto visible bg-black/65 backdrop-blur-md'
          : 'opacity-0 pointer-events-none invisible bg-black/0 backdrop-blur-none'
          }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowReplyModal(false);
        }}
      >
        <div
          className={`bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 border-3 border-[#ffd9e3] shadow-[0_25px_60px_rgba(134,77,97,0.25)] relative overflow-hidden transition-all duration-300 ease-out transform ${showReplyModal && targetReviewForReply
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-90 translate-y-8 opacity-0 pointer-events-none'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Rainbow Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#ffd9e3] via-[#ffb7ce] to-[#b2f2bb]"></div>

          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#fab3ca] shadow-xs shrink-0 bg-white">
                <img src="/anh3.png" alt="Kẹo Kéo Dặm" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-headline text-lg sm:text-xl text-[#864d61]">
                  {targetReviewForReply?.ownerReply ? 'Chỉnh Sửa Phản Hồi' : 'Phản Hồi Đánh Giá Của Khách'}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Câu trả lời sẽ được hiển thị công khai ngay dưới đánh giá
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowReplyModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Customer Review Summary Box */}
          {targetReviewForReply && (
            <div className="bg-[#fdf7ff] rounded-2xl p-3.5 mb-4 border border-[#ffd9e3]/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-headline text-xs font-bold text-[#201047]">
                  {targetReviewForReply.name}
                </span>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(targetReviewForReply.rating || 5)].map((_, i) => (
                    <CuteStarIcon key={i} filled={true} className="w-3.5 h-3.5" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#514347] italic line-clamp-2">
                "{targetReviewForReply.comment}"
              </p>
            </div>
          )}

          <form onSubmit={handleSaveOwnerReply} className="flex flex-col gap-3.5">
            {/* Field: Responder Name */}
            <div>
              <label className="block text-[13px] font-headline text-[#201047] mb-1">
                Tên / Danh xưng của bạn
              </label>
              <input
                type="text"
                value={ownerNameInput}
                onChange={(e) => setOwnerNameInput(e.target.value)}
                placeholder="VD: Kẹo Kéo Dặm"
                className="w-full px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#864d61] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Quick Suggestion Chips */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                Gợi ý mẫu câu nhanh:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Dạ cảm ơn bạn nhiều ạ! Hẹn gặp lại bạn vào những buổi tiệc sau nhé ❤️',
                  'Locahome luôn cam kết giao hỏa tốc 30 phút. Chúc bạn hát vui vẻ!',
                  'Cảm ơn quý khách đã tin tưởng và ủng hộ dàn loa của tụi mình ạ! 🎶'
                ].map((sample, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setOwnerReplyInput(sample)}
                    className="text-[10px] sm:text-[11px] font-medium bg-[#f8f1ff] hover:bg-[#ffd9e3] text-[#864d61] px-2.5 py-1 rounded-lg border border-[#ffd9e3] transition-colors text-left cursor-pointer"
                  >
                    + {sample.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Field: Reply Content */}
            <div>
              <label className="block text-[13px] font-headline text-[#201047] mb-1">
                Nội dung trả lời <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={ownerReplyInput}
                onChange={(e) => setOwnerReplyInput(e.target.value)}
                placeholder="Nhập lời cảm ơn, giải đáp hoặc phản hồi tới khách hàng..."
                className="w-full px-3.5 py-2.5 rounded-2xl font-medium text-xs sm:text-sm text-slate-900 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#864d61] focus:bg-white focus:outline-none transition-all shadow-inner"
                required
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {targetReviewForReply?.ownerReply && (
                <button
                  type="button"
                  onClick={handleDeleteOwnerReply}
                  disabled={isSubmittingReply}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-headline text-xs border border-rose-200 transition-colors cursor-pointer"
                >
                  Xóa Phản Hồi
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowReplyModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-headline text-xs text-slate-700 transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSubmittingReply || !ownerReplyInput.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#864d61] hover:bg-[#723f51] text-white font-headline text-xs clay-button-pink shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmittingReply ? 'Đang lưu...' : 'Lưu Phản Hồi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

