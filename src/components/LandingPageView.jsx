import React, { useState, useEffect, useRef } from 'react';

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

export function CuteAvatarPill({ letter = "K", color = "pink" }) {
  const bgStyles = {
    pink: "bg-gradient-to-br from-pink-200 to-rose-300 text-[#864d61] border-pink-300",
    blue: "bg-gradient-to-br from-sky-200 to-blue-300 text-[#235a7c] border-sky-300",
    green: "bg-gradient-to-br from-emerald-200 to-teal-300 text-[#2f6a3f] border-emerald-300",
    purple: "bg-gradient-to-br from-purple-200 to-indigo-300 text-purple-800 border-purple-300"
  };

  return (
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-headline text-base font-extrabold shadow-sm border-2 ${bgStyles[color] || bgStyles.pink}`}>
      {letter}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// 🌟 MAIN LANDING PAGE VIEW COMPONENT
// ══════════════════════════════════════════════════════════

export default function LandingPageView({
  onNavigateToAdmin,
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
  const [submittedReviewInfo, setSubmittedReviewInfo] = useState({ name: '', rating: 5 });

  // Lightbox Zoom Modal for Scenic Photos
  const [zoomImageModal, setZoomImageModal] = useState(null);

  const [bookingFormTouched, setBookingFormTouched] = useState({ name: false, phone: false, address: false });
  const [bookingFormShake, setBookingFormShake] = useState(false);

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
      buttonBg: 'bg-[#ffb7ce] text-[#360b1e]',
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
      buttonBg: 'bg-[#235a7c] text-white',
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
      buttonBg: 'bg-purple-700 text-white',
      features: [
        'Vòng Led RGB cảm biến theo nhịp bass cực chill',
        'Chế độ DJ Effect biến không gian thành sàn quẩy',
        '2 Micro không dây cao cấp bắt giọng nhẹ tênh',
        'Miễn phí giao hàng hỏa tốc bán kính 5km'
      ]
    }
  ];

  // Reviews Data
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Trần Văn Nam',
      role: 'Thuê Puffy Bass Pro',
      category: 'karaoke',
      time: '1 ngày trước',
      rating: 5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG39jxglMBvLSQP8WYNkmznOolrZS8IKVbiCnb14ABWu84BCV_Awt5FmaZ7eOgs0aN_yEGHcKfRswVx7dgGKCjSneartsqRRlyiRwywkXlHZQ-R_ZqGyEndlrBfP_phDzuaQz5uTuO0sDyW8l84RRVYchvsTRJzK-OjUzwmR6Ww1OIM2Z8HuxK1pxu9xzgAS_Le50pPfL-LQcRhZl6fnBnixRKUfdomciUZBpiqHJyEV1b3BuVgyVF',
      comment: 'Âm bass đập cực chắc, pin trâu hát cả đêm không hết! Thật sự rất bất ngờ với ngoại hình nhỏ bé mà âm thanh khủng thế này.',
      colorScheme: 'pink'
    },
    {
      id: 2,
      name: 'Lê Thị Mai',
      role: 'Cứu Hộ Tiệc Sinh Nhật',
      category: 'party',
      time: '2 ngày trước',
      rating: 5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDViO73UAoF3-TwSek3tM-NwCVDgAkSME_ATkVbzHd6E7q49HiMURLPXkE7jOAn8wHCMUL9uy2nT6QiYtUMb6fSd9n84vxHtgA_9FOJqmfYLprQHuFSQpATZQeZJmP_O-ojrTIcaVktaRItYXqnOe6i6lR-cc2GKPEK027sOShe1xVVlOPztso3s6BqRuZqr9_3X5huU_xsjMnuP4rV14_Jdat8lx1d9cUlqZpv07P3erTfO5Fqcfql',
      comment: 'Dịch vụ siêu nhanh! Mình gọi điện đặt gấp, 30 phút sau loa đã có mặt tại nhà. Các bạn nhân viên siêu dễ thương và nhiệt tình hướng dẫn.',
      colorScheme: 'blue'
    },
    {
      id: 3,
      name: 'Nguyễn Tấn Đạt',
      role: 'Hát Bolero Cuối Tuần',
      category: 'karaoke',
      time: '3 ngày trước',
      rating: 4,
      verified: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxtDafNm7kkFj56vltInH7glM_OI-Pmpxu4t3jtCldR1E5Q01z9Sph6dej69uZcePS4qi0J__9t3HXYuREQEKWSXHdy8457eFHhdikvjNMfOlcQKd6Fv8I6RKFcKFXIj5JkJie2uIdg3-Nn35rkNI6fOtG9sMBDZoQSiTI_lRN5-zbifZqRZseAwFJMSD3giXDUV7_jHtDgBFInDv6FqMJHE0UgGaskeXZiqFf3dX1WI5Sm_RsA19f',
      comment: 'Mic hát cực nhẹ, không bị hú dù đứng gần loa. Phù hợp cho những ai đam mê bolero như gia đình mình cuối tuần.',
      colorScheme: 'green'
    },
    {
      id: 4,
      name: 'Sarah J.',
      role: 'Chủ Tiệc Birthday',
      category: 'party',
      time: '4 ngày trước',
      rating: 5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCQYPFv-WTIF8HKSwFaCz2WzJp51sU6xR2sN-3XNgWLJU3eFIGhqCNAArpwq11_FMzKP9qCCrxyCCMP0YIMakgjL68j47OJwcTKc3F5JZTOBiMlL4MiyqUYzlNlOi2gSDd953GAsD3ER5cmLfzZHNkVHItWwm_833unxG7xgMblN3Y2aWLsHbRYmx6eIw1Ten2jy6koYp9jo0J8yHdBazaGAzkxnAmKBKUgIcyMdQGKv8cqu9yyCrM',
      bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeMXmIMPw2bEqBuBSF_-hbAsvy7I3USk5EK0WSaanKsmvrbSSeI0DwWRKwHSuxAKBl-Sod5xC3RfKG24XO8QUbjMHjGOyRkEU70hOw8wLTB9sPEUV6-69lHd66kOj_SEwKAcTrHiCa2NFZA0N4DNcejMWpl4kut_QqFbg3CLXJITlP3SbrO0ETo3n2SdJjgNQkTuPQtJd0y2Q2KCCSaKZ3rcAWFxpgX7vmv6bzXF9zdyUZDQHQqQin',
      title: 'Buổi Tiệc Tuyệt Vời Nhất',
      comment: 'Mình thuê dàn Mega Puff cho tiệc sinh nhật. Âm thanh cực đỉnh, bass rung sàn mà loa lại nhìn quá đỗi đáng yêu, bạn bè chụp ảnh selfie check-in suốt buổi!',
      colorScheme: 'imageCard'
    },
    {
      id: 5,
      name: 'Kimberly W.',
      role: 'Gia Đình Chung Cư',
      category: 'karaoke',
      time: '5 ngày trước',
      rating: 5,
      avatar: null,
      avatarLetter: 'K',
      avatarColor: 'blue',
      comment: 'Loa nhỏ gọn xinh xắn để trong phòng khách rất sang. Âm thanh trong trẻo, mở phim nghe như rạp chiếu bóng!',
      colorScheme: 'whiteCard'
    },
    {
      id: 6,
      name: 'Alex Chen',
      role: 'Quản Lý Nhân Sự (HR)',
      category: 'company',
      time: '1 tuần trước',
      rating: 5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf9RwyMAsqXVrzUYdyVkyDLsATlf0LhZRQU9sENL6o5dY1NrYaknEIVH4In5iuZv4FDmpBzniReRwWXg7YnyHufFMIaHwl9MTFpMMqOpIFsVG8K-8kDwyvi9agIomt3JUH4OBKkHRpA7FXzwqzu5GVBaSKL8uytdPb4BeSQDwMO3cA6nL-pcUBJjYprUBwtQx-eDqZtTqcDB8ok40gPO8zE1MLFikoGQNRM5t_NmM6qwtnl_iTd7UG',
      comment: 'Cả công ty thuê dàn đôi đi dã ngoại. Mọi người hát hò gắn kết vui vẻ từ chiều đến khuya, pin loa dùng mãi không hết.',
      colorScheme: 'darkCard'
    }
  ]);

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
      if (reviewFilter === 'oldest') return a.id - b.id;
      if (reviewFilter === 'newest') return b.id - a.id;
      return 0;
    });

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
    category: 'karaoke'
  });

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    setReviewFormTouched({ name: true, comment: true });

    const isNameValid = Boolean(newReviewForm.name.trim());
    const isCommentValid = Boolean(newReviewForm.comment.trim() && newReviewForm.comment.trim().length >= 5);

    if (!isNameValid || !isCommentValid) {
      setReviewFormShake(true);
      setTimeout(() => setReviewFormShake(false), 500);
      return;
    }

    const newRev = {
      id: Date.now(),
      name: newReviewForm.name.trim(),
      role: newReviewForm.role || 'Khách hàng thân thiết',
      category: newReviewForm.category,
      time: 'Vừa xong',
      rating: Number(newReviewForm.rating),
      verified: true,
      avatar: null,
      avatarLetter: newReviewForm.name.trim().charAt(0).toUpperCase(),
      avatarColor: ['pink', 'blue', 'green', 'purple'][Math.floor(Math.random() * 4)],
      comment: newReviewForm.comment.trim(),
      colorScheme: ['pink', 'blue', 'green'][Math.floor(Math.random() * 3)]
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmittedReviewInfo({
      name: newReviewForm.name.trim(),
      rating: Number(newReviewForm.rating)
    });
    setReviewSuccess(true);

    // After 1800ms, start closing modal smoothly with 300ms exit animation
    setTimeout(() => {
      setShowAddReviewModal(false);
    }, 1800);

    // After modal has fully finished exiting (2200ms), reset state
    setTimeout(() => {
      setReviewSuccess(false);
      setNewReviewForm({
        name: '',
        rating: 5,
        role: 'Khách thuê loa',
        comment: '',
        category: 'karaoke'
      });
      setReviewFormTouched({ name: false, comment: false });
    }, 2200);
  };

  return (
    <div className="bg-[#fdf7ff] min-h-screen font-cute text-[#201047] selection:bg-[#ffb7ce] selection:text-[#360b1e] relative overflow-x-hidden">
      {/* Background Pastel Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#ffd9e3]/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/3 translate-x-1/3 pointer-events-none z-0"></div>
      <div className="fixed top-1/3 left-0 w-[450px] h-[450px] bg-[#c9e6ff]/50 rounded-full mix-blend-multiply filter blur-3xl opacity-65 -translate-x-1/3 pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#b2f2bb]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/3 pointer-events-none z-0"></div>

      {/* ═══════════════ PERMANENT FIXED TOP WRAPPER (MARQUEE + HEADER) ═══════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full shadow-[0_4px_24px_rgba(134,77,97,0.08)]">
        {/* TOP PROMO FLASH BAR (SEAMLESS RUNNING MARQUEE) */}
        <div className="bg-gradient-to-r from-[#ffd9e3] via-[#ffb7ce] to-[#c9e6ff] text-[#360b1e] py-1.5 border-b border-[#fab3ca]/40 overflow-hidden select-none">
          <div className="animate-marquee items-center gap-8 text-xs sm:text-sm font-bold whitespace-nowrap">
            {/* Ticker Set 1 */}
            <div className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-1.5">
                <CuteHeartIcon className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
                <strong>ƯU ĐÃI HÔM NAY:</strong> Giảm ngay 20.000₫ & Tặng 4 viên pin sạc khi thanh toán qua VietQR!
              </span>
              <span className="text-[#864d61]/40">•</span>
              <span className="flex items-center gap-1.5">
                <CuteLightningIcon className="w-4 h-4 text-amber-600 shrink-0" />
                <strong>GIAO HỎA TỐC 30 PHÚT:</strong> TP. Tuy Hòa, Sông Cầu, Đông Hòa & Toàn Tỉnh Phú Yên!
              </span>
              <span className="text-[#864d61]/40">•</span>
              <span className="flex items-center gap-1.5">
                <CuteMicIcon className="w-4 h-4 text-[#2f6a3f] shrink-0" />
                <strong>MIC SÂN KHẤU UHF:</strong> Chống hú rè 100%, hát nhẹ hơi cực êm!
              </span>
              <span className="text-[#864d61]/40">•</span>
              <span className="flex items-center gap-1.5">
                <CuteStarIcon filled={true} className="w-4 h-4 text-amber-500 shrink-0" />
                <strong>ĐỔI LOA MIỄN PHÍ:</strong> Trong 15 phút nếu chưa hài lòng âm thanh!
              </span>
              <span className="text-[#864d61]/40">•</span>
              <span className="flex items-center gap-1.5">
                <CutePhoneSaveIcon className="w-4 h-4 text-rose-500 shrink-0" />
                <strong>HOTLINE 24/7:</strong> 0368.115.592 (Hồ Văn Duy)
              </span>
              <span className="text-[#864d61]/40">•</span>
            </div>

            {/* Ticker Set 2 (Duplicate for seamless infinite scrolling) */}
            <div className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-1.5">
                <CuteHeartIcon className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
                <strong>ƯU ĐÃI HÔM NAY:</strong> Giảm ngay 20.000₫ & Tặng 4 viên pin sạc khi thanh toán qua VietQR!
              </span>
              <span className="text-[#864d61]/40">•</span>
              <span className="flex items-center gap-1.5">
                <CuteLightningIcon className="w-4 h-4 text-amber-600 shrink-0" />
                <strong>GIAO HỎA TỐC 30 PHÚT:</strong> TP. Tuy Hòa, Sông Cầu, Đông Hòa & Toàn Tỉnh Phú Yên!
              </span>
              <span className="text-[#864d61]/40">•</span>
              <span className="flex items-center gap-1.5">
                <CuteMicIcon className="w-4 h-4 text-[#2f6a3f] shrink-0" />
                <strong>MIC SÂN KHẤU UHF:</strong> Chống hú rè 100%, hát nhẹ hơi cực êm!
              </span>
              <span className="text-[#864d61]/40">•</span>
              <span className="flex items-center gap-1.5">
                <CuteStarIcon filled={true} className="w-4 h-4 text-amber-500 shrink-0" />
                <strong>ĐỔI LOA MIỄN PHÍ:</strong> Trong 15 phút nếu chưa hài lòng âm thanh!
              </span>
              <span className="text-[#864d61]/40">•</span>
              <span className="flex items-center gap-1.5">
                <CutePhoneSaveIcon className="w-4 h-4 text-rose-500 shrink-0" />
                <strong>HOTLINE 24/7:</strong> 0368.115.592 (Hồ Văn Duy)
              </span>
              <span className="text-[#864d61]/40">•</span>
            </div>
          </div>
        </div>

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
                alt="Locahome"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 group-hover:scale-110 group-active:scale-95 transition-all duration-300 drop-shadow-[0_4px_10px_rgba(134,77,97,0.18)]"
              />
              <span className="font-headline text-2xl sm:text-3xl text-[#864d61] tracking-tight block">Locahome</span>
            </div>

            {/* Clean Kawaii Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-[#864d61]/10 shadow-xs">
              <a
                href="#reviews"
                onClick={() => setActiveNav('reviews')}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${activeNav === 'reviews'
                  ? 'bg-[#b2f2bb] text-[#00210b] shadow-xs'
                  : 'text-[#514347] hover:bg-[#eee4ff] hover:text-[#201047]'
                  }`}
              >
                <CuteStarIcon filled={activeNav === 'reviews'} className="w-4 h-4" />
                <span>Đánh Giá</span>
              </a>
              <a
                href="#speakers"
                onClick={() => setActiveNav('speakers')}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${activeNav === 'speakers'
                  ? 'bg-[#b2f2bb] text-[#00210b] shadow-xs'
                  : 'text-[#514347] hover:bg-[#eee4ff] hover:text-[#201047]'
                  }`}
              >
                <CuteSpeakerIcon className="w-4 h-4" />
                <span>Bảng Giá Loa</span>
              </a>
              <a
                href="#sound-demo"
                onClick={() => setActiveNav('sound-demo')}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${activeNav === 'sound-demo'
                  ? 'bg-[#b2f2bb] text-[#00210b] shadow-xs'
                  : 'text-[#514347] hover:bg-[#eee4ff] hover:text-[#201047]'
                  }`}
              >
                <CuteMusicNotesDecor className="w-4 h-4" />
                <span>Vi vu</span>
              </a>
              <a
                href="#faq"
                onClick={() => setActiveNav('faq')}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${activeNav === 'faq'
                  ? 'bg-[#b2f2bb] text-[#00210b] shadow-xs'
                  : 'text-[#514347] hover:bg-[#eee4ff] hover:text-[#201047]'
                  }`}
              >
                <CuteHeartIcon filled={activeNav === 'faq'} className="w-4 h-4" />
                <span>Hỏi Đáp</span>
              </a>
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={(e) => {
                  triggerParticleBurst(e.clientX, e.clientY);
                  setShowAddReviewModal(true);
                }}
                className="bg-[#864d61] text-white font-headline text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full clay-button-pink flex items-center justify-center cursor-pointer active:scale-95 transition-transform whitespace-nowrap shrink-0 shadow-md hover:scale-105"
                title="Mở form viết đánh giá trải nghiệm"
              >
                <span>Viết Đánh Giá</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer to prevent content from going behind fixed header */}
      <div className="h-[92px] sm:h-[110px] w-full pointer-events-none"></div>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="pt-4 pb-2 relative z-10">
        {/* HERO BANNER SECTION */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          <div className="flex flex-col items-center text-center gap-6">

            {/* Chibi Mascot Banner Card */}
            <div className="w-full max-w-4xl rounded-[2.8rem] overflow-hidden shadow-[0_16px_40px_rgba(134,77,97,0.14)] border-4 border-white">
              <div className="relative w-full aspect-[1774/887] overflow-hidden bg-[#201047]">
                <img
                  src="/anh1.png"
                  alt="Locahome Chibi Mascot Banner"
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

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-4xl mx-auto">
                <div className="relative h-[76px] sm:h-[84px] bg-gradient-to-br from-[#fff2f5] to-[#fdf7ff] rounded-2xl border-2 border-[#ffd9e3] overflow-hidden shadow-sm hover:scale-105 transition-all flex items-center justify-center p-2 group cursor-pointer">
                  <img src="/bia.png" alt="Bia" className="h-full w-auto max-w-[60%] object-contain group-hover:scale-115 transition-transform duration-300 drop-shadow-sm shrink-0" />
                  <div className="flex-1 text-center">
                    <span className="font-headline text-base sm:text-lg text-[#864d61]">
                      Bia
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/90 rounded-2xl border border-[#864d61]/10 flex items-center gap-3 shadow-sm hover:scale-105 transition-transform">
                  <div className="w-11 h-11 rounded-2xl bg-[#b2f2bb] flex items-center justify-center shrink-0 border border-[#96d5a0]/50 shadow-xs">
                    <CuteMicIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-500">2 Micro xịn</p>
                    <p className="text-sm font-extrabold text-[#201047]">Hát nhẹ chống hú</p>
                  </div>
                </div>

                <div className="p-3.5 bg-white/90 rounded-2xl border border-[#864d61]/10 flex items-center gap-3 shadow-sm hover:scale-105 transition-transform">
                  <div className="w-11 h-11 rounded-2xl bg-[#c9e6ff] flex items-center justify-center shrink-0 border border-[#9ed1f8]/50 shadow-xs">
                    <CuteBatteryIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-500">Pin trâu</p>
                    <p className="text-sm font-extrabold text-[#201047]">Hát 8-12 tiếng</p>
                  </div>
                </div>

                <div className="p-3.5 bg-white/90 rounded-2xl border border-[#864d61]/10 flex items-center gap-3 shadow-sm hover:scale-105 transition-transform">
                  <div className="w-11 h-11 rounded-2xl bg-[#eee4ff] flex items-center justify-center shrink-0 border border-[#d5c2c6]/50 shadow-xs">
                    <CuteStarIcon filled={true} className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-500">Đánh giá 4.9★</p>
                    <p className="text-sm font-extrabold text-[#201047]">500+ Khách khen</p>
                  </div>
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffd9e3] rounded-full text-[#864d61] text-xs font-bold uppercase tracking-wider mb-2">
                  <CuteMusicNotesDecor className="w-4 h-4" />
                  <span>Ngắm một tí nhé! rồi hát tiếp</span>
                </div>
                <h3 className="font-headline text-2xl sm:text-3xl text-[#864d61] max-w-md leading-snug">
                  Cùng nẫu vi vu một tí rồi dô bia nha!
                </h3>
              </div>

              {/* Right Demo Buttons: 1 ảnh 1 dòng trên Mobile, 2 cột trên Tablet/Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full md:w-[480px]">
                {[
                  { id: 'nhan', name: 'Tháp Nhạn', location: 'Tháp Nhạn Cổ Kính • Tuy Hòa', img: '/anh4.png', color: 'from-[#864d61]/90', ring: 'ring-[#864d61]' },
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
              <h2 className="font-headline text-2xl sm:text-4xl text-[#864d61]">
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

          {/* Masonry Review Columns */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredReviews.map((rev) => {
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
                        <div className="absolute bottom-3 left-4 flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <CuteStarIcon key={i} filled={true} className="w-5 h-5 drop-shadow-xs" />
                          ))}
                        </div>
                      </div>
                      <div className="p-4 pt-1">
                        <h4 className="font-headline text-lg sm:text-xl text-[#7b4458] mb-2">{rev.title || 'Buổi Tiệc Tuyệt Vời Nhất'}</h4>
                        <p className="text-sm sm:text-base text-[#7b4458]/90 font-medium leading-relaxed">
                          "{rev.comment}"
                        </p>
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#864d61]/15">
                          <div className="w-11 h-11 rounded-full border-2 border-[#864d61] bg-white p-[1px] shadow-sm shrink-0 overflow-hidden">
                            <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover rounded-full" />
                          </div>
                          <div>
                            <h3 className="font-headline text-sm text-[#7b4458]">{rev.name}</h3>
                            <p className="text-xs font-bold text-[#7b4458]/70">{rev.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              if (rev.colorScheme === 'darkCard') {
                return (
                  <article key={rev.id} className="break-inside-avoid relative">
                    <div className="bg-[#201047] rounded-[2.5rem] p-6 shadow-xl relative z-10 transition-transform duration-300 hover:-translate-y-2 border border-purple-900/40">
                      <div className="absolute top-4 right-5 text-[#fab3ca] text-[50px] opacity-20 font-headline">"</div>
                      <div className="flex gap-1 mb-4">
                        {[...Array(rev.rating)].map((_, i) => (
                          <CuteStarIcon key={i} filled={true} className="w-5 h-5" />
                        ))}
                      </div>
                      <p className="text-base text-[#f6eeff] font-medium leading-relaxed mb-4">
                        "{rev.comment}"
                      </p>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-purple-800/40">
                        <div className="w-11 h-11 rounded-full border-2 border-[#ffb7ce] bg-white p-[1px] shrink-0 overflow-hidden">
                          <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                          <h3 className="font-headline text-sm text-[#f6eeff]">{rev.name}</h3>
                          <p className="text-xs font-bold text-purple-300">{rev.role}</p>
                        </div>
                      </div>
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
                        <CuteHeartIcon className="w-4.5 h-4.5" />
                      </div>
                      <p className="text-sm sm:text-base text-[#201047] font-medium leading-relaxed mb-4 italic">
                        "{rev.comment}"
                      </p>
                      <div className="flex items-center gap-3">
                        <CuteAvatarPill letter={rev.avatarLetter || 'K'} color={rev.avatarColor || 'blue'} />
                        <div>
                          <h3 className="font-headline text-sm text-[#201047]">{rev.name}</h3>
                          <p className="text-xs font-bold text-slate-400">{rev.role}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              if (rev.colorScheme === 'blue') {
                return (
                  <article key={rev.id} className="break-inside-avoid relative">
                    <div className="bg-[#c9e6ff]/50 rounded-[2.2rem] p-6 shadow-[0_8px_24px_rgba(35,90,124,0.06),inset_0_2px_12px_rgba(255,255,255,0.9)] relative z-10 transition-transform duration-300 hover:-translate-y-2 border border-[#9ed1f8]/50">
                      <div className="absolute -bottom-3 right-10 w-7 h-7 bg-[#c9e6ff]/50 transform rotate-45 rounded-xs shadow-[3px_3px_6px_rgba(35,90,124,0.04)] -z-10 border-r border-b border-[#9ed1f8]/50"></div>
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
                      <div className="w-12 h-12 rounded-2xl border-[3px] border-[#9ed1f8] bg-white p-0.5 shadow-sm shrink-0 transform rotate-3 overflow-hidden">
                        <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <h3 className="font-headline text-sm text-[#201047]">{rev.name}</h3>
                        <p className="text-xs font-bold text-[#2e6385]">{rev.role}</p>
                      </div>
                    </div>
                  </article>
                );
              }

              if (rev.colorScheme === 'green') {
                return (
                  <article key={rev.id} className="break-inside-avoid relative">
                    <div className="bg-[#b2f2bb]/50 rounded-[2rem] rounded-tr-none p-6 shadow-[0_8px_24px_rgba(47,106,63,0.06),inset_0_2px_12px_rgba(255,255,255,0.9)] relative z-10 transition-transform duration-300 hover:-translate-y-2 border border-[#96d5a0]/50">
                      <div className="absolute -top-3 right-0 w-7 h-7 bg-[#b2f2bb]/50 transform rotate-45 rounded-xs -z-10 border-t border-r border-[#96d5a0]/50"></div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <CuteStarIcon key={i} filled={true} className="w-5 h-5" />
                          ))}
                        </div>
                        {rev.verified && (
                          <div className="px-2.5 py-0.5 bg-[#2f6a3f] text-white text-[11px] font-bold rounded-lg transform -rotate-2 flex items-center gap-1 shadow-xs">
                            <CuteCheckIcon className="w-3.5 h-3.5" />
                            <span>Đã Thuê</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm sm:text-base text-[#00210b] font-semibold leading-relaxed mb-2">
                        "{rev.comment}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pl-3">
                      <div className="w-12 h-12 rounded-full border-[3px] border-[#96d5a0] bg-white p-0.5 shadow-sm shrink-0 overflow-hidden">
                        <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-headline text-sm text-[#201047]">{rev.name}</h3>
                        <p className="text-xs font-bold text-[#2f6a3f]">{rev.role}</p>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article key={rev.id} className="break-inside-avoid relative">
                  <div className="bg-[#f3eaff] rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(134,77,97,0.06),inset_0_2px_12px_rgba(255,255,255,0.8)] relative z-10 transition-transform duration-300 hover:-translate-y-2 border border-[#ffd9e3]">
                    <div className="absolute -bottom-3 left-10 w-7 h-7 bg-[#f3eaff] transform rotate-45 rounded-xs shadow-[3px_3px_6px_rgba(134,77,97,0.03)] -z-10 border-r border-b border-[#ffd9e3]"></div>
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
                    <div className="w-12 h-12 rounded-full border-[3px] border-[#ffd9e3] bg-white p-0.5 shadow-sm shrink-0 overflow-hidden">
                      {rev.avatar ? (
                        <img src={rev.avatar} alt={rev.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <CuteAvatarPill letter={rev.avatarLetter || 'U'} color={rev.avatarColor || 'pink'} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-headline text-sm text-[#201047]">{rev.name}</h3>
                      <p className="text-xs font-bold text-[#864d61]">{rev.role}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ SPEAKER FLEET & PRICING PACKAGES ═══════════════ */}
        <section id="speakers" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#ffd9e3] rounded-full text-[#864d61] text-xs font-bold uppercase tracking-wider mb-2">
              <CuteSpeakerIcon className="w-4 h-4" />
              <span>Bảng Giá Thuê Loa Siêu Xinh</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-4xl text-[#864d61]">
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
                  className={`w-full py-2 sm:py-3.5 rounded-xl sm:rounded-2xl font-headline text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1 sm:gap-2 ${pkg.buttonBg}`}
                >
                  <CuteMicIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0" />
                  <span>Thuê Loa Này</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════ FAQ SECTION (CÂU HỎI THƯỜNG GẶP) ═══════════════ */}
        <section id="faq" className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-headline text-2xl sm:text-4xl text-[#864d61]">
              Câu Hỏi Thường Gặp Khi Thuê Loa
            </h2>
            <p className="text-sm sm:text-base font-semibold text-[#514347] mt-1">
              Mọi điều bạn cần biết trước khi đặt thuê loa tại Locahome.
            </p>
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
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
              <h2 className="font-headline text-xl sm:text-4xl text-[#864d61]">
                Tại Sao Hơn 500+ Khách Hàng Chọn Locahome?
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm border border-[#e9ddff] hover:scale-105 transition-transform flex flex-col">
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-[#ffd9e3] text-[#864d61] flex items-center justify-center mb-2.5 sm:mb-4 border border-[#fab3ca]/60 shrink-0">
                  <CuteLightningIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-headline text-xs sm:text-lg text-[#201047] mb-1 sm:mb-1.5 line-clamp-1">Giao Nhanh 30 Phút</h3>
                <p className="text-[10px] sm:text-sm text-slate-600 font-semibold leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Đội ngũ shipper hỏa tốc luôn sẵn sàng mang loa đến tận nhà ngay sau khi bạn chốt đơn.
                </p>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm border border-[#e9ddff] hover:scale-105 transition-transform flex flex-col">
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-[#b2f2bb] text-[#2f6a3f] flex items-center justify-center mb-2.5 sm:mb-4 border border-[#96d5a0]/60 shrink-0">
                  <CuteMicIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-headline text-xs sm:text-lg text-[#201047] mb-1 sm:mb-1.5 line-clamp-1">Mic Chống Hú 100%</h3>
                <p className="text-[10px] sm:text-sm text-slate-600 font-semibold leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Micro UHF chuẩn sân khấu bắt âm cực nhạy, hát nhẹ hơi, không lo rè hú chói tai.
                </p>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm border border-[#e9ddff] hover:scale-105 transition-transform flex flex-col">
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-[#c9e6ff] text-[#2e6385] flex items-center justify-center mb-2.5 sm:mb-4 border border-[#9ed1f8]/60 shrink-0">
                  <CuteSwapIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-headline text-xs sm:text-lg text-[#201047] mb-1 sm:mb-1.5 line-clamp-1">Đổi Loa Miễn Phí</h3>
                <p className="text-[10px] sm:text-sm text-slate-600 font-semibold leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Nếu không hài lòng hoặc âm thanh có vấn đề, chúng mình đổi loa mới ngay trong 15 phút!
                </p>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm border border-[#e9ddff] hover:scale-105 transition-transform flex flex-col">
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-[#eee4ff] text-[#864d61] flex items-center justify-center mb-2.5 sm:mb-4 border border-[#fab3ca]/60 shrink-0">
                  <CuteQRIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-headline text-xs sm:text-lg text-[#201047] mb-1 sm:mb-1.5 line-clamp-1">VietQR Tiện Lợi</h3>
                <p className="text-[10px] sm:text-sm text-slate-600 font-semibold leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Quét mã QR thanh toán tức thì qua mọi ngân hàng hoặc chọn trả tiền mặt khi nhận loa.
                </p>
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

            <h2 className="font-headline text-2xl sm:text-4xl text-[#864d61] mb-2">
              Sẵn Sàng Hát Mê Say Tối Nay?
            </h2>

            <p className="text-[#514347] font-semibold text-sm sm:text-base max-w-md mb-8">
              Rủ bạn bè tụ tập, nhận ngay loa xịn và cùng nhau tạo nên những kỷ niệm thật vui nhộn nào!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleSaveContact}
                className="bg-[#864d61] text-white font-headline text-base sm:text-lg px-8 py-4 rounded-full clay-button-pink flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                title="Lưu số hotline Locahome vào danh bạ"
              >
                <span>Lưu Số Ngay</span>
              </button>

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
            <h3 className="font-headline text-xl sm:text-3xl text-rose-700 leading-snug mb-5 sm:mb-7 text-center">
              Lưu ý! Đã uống rượu bia thì không lái xe.
            </h3>
            <div className="w-full max-w-2xl rounded-3xl overflow-hidden border-2 border-white/80 shadow-md bg-white">
              <img
                src="/congan.png"
                alt="Chú công an nhắc nhở an toàn giao thông"
                className="w-full h-auto max-h-[480px] object-contain hover:scale-105 transition-transform duration-500 block mx-auto"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-[#f8f1ff] border-t border-[#864d61]/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-4">
          <img
            src="/anh3.png"
            alt="Locahome"
            className="w-14 h-14 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_12px_rgba(134,77,97,0.18)]"
          />

          <p className="font-headline text-lg text-[#864d61]">Locahome</p>
          <p className="text-sm font-semibold text-slate-500 max-w-md">
            Chia sẻ âm thanh hạnh phúc đến mọi bữa tiệc. Thuê loa kẹo kéo uy tín, âm thanh chất lượng tốt nhất.
          </p>

          <p className="text-xs font-bold text-[#864d61]/70 mt-2 tracking-wide">
            Locahome được phát triển bởi Hồ Văn Duy
          </p>
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

      {/* ═══════════════ MODAL: VIẾT ĐÁNH GIÁ (HIỆU ỨNG MỞ & ĐÓNG MƯỢT MÀ) ═══════════════ */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${showAddReviewModal
          ? 'opacity-100 pointer-events-auto visible bg-black/60 backdrop-blur-md'
          : 'opacity-0 pointer-events-none invisible bg-black/0 backdrop-blur-none'
          }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowAddReviewModal(false);
        }}
      >
        <div
          className={`bg-white rounded-[2.8rem] max-w-md w-full p-6 sm:p-8 border-3 border-[#ffd9e3] shadow-[0_25px_60px_rgba(134,77,97,0.25)] relative overflow-hidden transition-all duration-300 ease-out transform ${showAddReviewModal
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-90 translate-y-8 opacity-0 pointer-events-none'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Color Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ffd9e3] via-[#c9e6ff] to-[#b2f2bb]"></div>

          {reviewSuccess ? (
            <div className="py-8 text-center flex flex-col items-center justify-center animate-in zoom-in-75 fade-in duration-400 ease-out">
              <div className="w-20 h-20 rounded-3xl bg-[#b2f2bb] text-[#2f6a3f] flex items-center justify-center mb-4 border-3 border-[#96d5a0] shadow-[0_12px_28px_rgba(47,106,63,0.2)] animate-bounce">
                <CuteCheckIcon className="w-11 h-11" />
              </div>
              <h3 className="font-headline text-2xl text-[#864d61] mb-2 animate-in slide-in-from-bottom-2 duration-300">
                Gửi Đánh Giá Thành Công!
              </h3>
              <p className="text-sm font-semibold text-[#514347] max-w-xs leading-relaxed">
                Cảm ơn bạn <span className="font-bold text-[#201047]">"{submittedReviewInfo.name}"</span> đã chia sẻ trải nghiệm chân thực cùng Locahome.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 rounded-full text-xs font-bold text-amber-700 border border-amber-200 shadow-xs animate-in zoom-in-90 duration-300 delay-100">
                <CuteStarIcon filled={true} className="w-4 h-4 text-amber-400" />
                <span>Đánh giá {submittedReviewInfo.rating} sao đã được ghi nhận</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#ffd9e3] text-[#864d61] flex items-center justify-center border-2 border-[#fab3ca] shadow-xs shrink-0">
                  <CuteStarIcon filled={true} className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-headline text-xl text-[#864d61]">Viết Đánh Giá Của Bạn</h3>
              </div>

              <form onSubmit={handleAddReviewSubmit} className={`flex flex-col gap-4 ${reviewFormShake ? 'animate-shake' : ''}`}>
                {/* Field: Name */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider">
                      Tên Của Bạn <span className="text-rose-500">*</span>
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
                  <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider mb-1.5">
                    Số Sao Đánh Giá
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

                {/* Field: Comment */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-headline text-[#201047] uppercase tracking-wider">
                      Nội Dung Cảm Nhận <span className="text-rose-500">*</span>
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
                    onClick={() => {
                      setShowAddReviewModal(false);
                      setReviewFormTouched({ name: false, comment: false });
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 font-headline text-xs text-slate-700 transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-[#864d61] text-white font-headline text-xs clay-button-pink flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
                  >
                    <span>Gửi Đánh Giá</span>
                  </button>
                </div>
              </form>
            </>
          )}
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
          className={`relative max-w-3xl w-full max-h-[92vh] flex flex-col items-center justify-center transition-all duration-300 ease-out transform ${zoomImageModal
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
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-black/40 flex items-center justify-center max-h-[72vh] w-full">
                <img
                  src={zoomImageModal.img}
                  alt={zoomImageModal.location}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-3xl"
                />
              </div>

              {/* Info bar below photo: Chỉ để tên danh lam thắng cảnh */}
              <div className="mt-3 w-full bg-white/15 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 text-white shadow-lg text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h4 className="font-headline text-base sm:text-lg text-white drop-shadow-sm">
                  {zoomImageModal.location}
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
