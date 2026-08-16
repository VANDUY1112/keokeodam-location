import React, { useState, useEffect } from 'react';

export default function TrackingView({ onOpenLogExpense }) {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [seconds, setSeconds] = useState(42 * 60 + 15); // Start at 00:42:15
  const [liveDistance, setLiveDistance] = useState(12.4);
  const [currentSpeed, setCurrentSpeed] = useState(65);
  const [actionNotice, setActionNotice] = useState(null);

  // Live timer simulation when checked in
  useEffect(() => {
    if (!isCheckedIn) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        const nextSec = prev + 1;
        if (nextSec % 3 === 0) {
          setLiveDistance((d) => +(d + 0.02).toFixed(2));
          // subtle realistic speed jitter between 62 and 68 km/h
          setCurrentSpeed(Math.floor(62 + Math.random() * 7));
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCheckedIn]);

  const formatTime = (totalSec) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setActionNotice({ type: 'success', text: 'Checked in to Active Route! GPS Telemetry active.' });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setActionNotice({ type: 'info', text: 'Checked out. Route paused and trip summary recorded.' });
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="absolute top-0 right-0 z-30 mb-4 bg-primary text-on-primary text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-base">
            {actionNotice.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span>{actionNotice.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-140px)] bg-surface gap-gutter">
        {/* Left Panel: Controls & Trip Details */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-lg z-10 relative">
          {/* Live Status Header */}
          <div className="bg-surface-container rounded-3xl p-lg shadow-sm flex flex-col gap-sm relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
            <div className="flex items-center justify-between z-10">
              <h2 className="font-headline-lg text-on-surface tracking-tight">Active Route</h2>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                  isCheckedIn ? 'bg-secondary-container' : 'bg-surface-container-high'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCheckedIn ? 'bg-secondary animate-pulse' : 'bg-on-surface-variant'
                  }`}
                ></span>
                <span
                  className={`font-label-sm uppercase tracking-wider font-semibold ${
                    isCheckedIn ? 'text-on-secondary-container' : 'text-on-surface-variant'
                  }`}
                >
                  {isCheckedIn ? 'Tracking' : 'Paused'}
                </span>
              </div>
            </div>
            
            <div className="mt-md space-y-1 z-10">
              <p className="font-body-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">schedule</span>
                <span className="font-headline-md text-on-surface tabular-nums">
                  {formatTime(seconds)}
                </span>
              </p>
              <p className="font-body-md text-on-surface-variant ml-8">Elapsed Time</p>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex gap-md w-full">
            <button
              onClick={handleCheckIn}
              className={`flex-1 rounded-2xl p-md flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 shadow-md group relative overflow-hidden ${
                isCheckedIn
                  ? 'bg-primary text-on-primary ring-2 ring-primary/40'
                  : 'bg-primary text-on-primary hover:bg-inverse-surface'
              }`}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span
                className="material-symbols-outlined text-display"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              <span className="font-body-lg font-medium">Check-In</span>
            </button>

            <button
              onClick={handleCheckOut}
              className={`flex-1 rounded-2xl p-md flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group ${
                !isCheckedIn
                  ? 'bg-error-container text-on-error-container ring-2 ring-error/30'
                  : 'bg-surface-container-high text-on-surface hover:bg-error-container hover:text-on-error-container'
              }`}
            >
              <span className="material-symbols-outlined text-display group-hover:text-error transition-colors">
                stop_circle
              </span>
              <span className="font-body-lg font-medium">Check-Out</span>
            </button>
          </div>

          {/* Trip Details Bento */}
          <div className="grid grid-cols-2 gap-sm w-full">
            {/* Est. Dist */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 relative overflow-hidden group border border-outline-variant/15">
              <div className="absolute right-0 bottom-0 w-16 h-16 bg-surface-container translate-x-4 translate-y-4 rounded-tl-3xl opacity-50 transition-transform group-hover:scale-110"></div>
              <span className="material-symbols-outlined text-on-surface-variant text-headline-lg z-10">
                route
              </span>
              <div className="z-10">
                <p className="font-label-sm text-on-surface-variant uppercase mb-1">Est. Distance</p>
                <p className="font-headline-md text-on-surface">
                  42.5 <span className="font-body-md text-on-surface-variant">km</span>
                </p>
              </div>
            </div>

            {/* Start Time */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-32 relative overflow-hidden group border border-outline-variant/15">
              <div className="absolute right-0 bottom-0 w-16 h-16 bg-surface-container translate-x-4 translate-y-4 rounded-tl-3xl opacity-50 transition-transform group-hover:scale-110"></div>
              <span className="material-symbols-outlined text-on-surface-variant text-headline-lg z-10">
                event_available
              </span>
              <div className="z-10">
                <p className="font-label-sm text-on-surface-variant uppercase mb-1">Start Time</p>
                <p className="font-headline-md text-on-surface">
                  08:15 <span className="font-body-md text-on-surface-variant">AM</span>
                </p>
              </div>
            </div>

            {/* Client / Project (Full Width) */}
            <div className="col-span-2 bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-md border border-outline-variant/15">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">domain</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-label-sm text-on-surface-variant uppercase mb-1">Project</p>
                <p className="font-body-lg text-on-surface truncate font-medium">
                  Acme Corp - Q4 Onsite Audit
                </p>
              </div>
              {onOpenLogExpense && (
                <button
                  onClick={onOpenLogExpense}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-medium text-on-surface transition-colors"
                >
                  + Expense
                </button>
              )}
            </div>
          </div>

          {/* Decorative GPS element */}
          <div className="mt-auto hidden lg:flex items-center gap-sm opacity-60 pt-4">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
              GPS Active
            </span>
          </div>
        </aside>

        {/* Right Panel: Map Area */}
        <main className="w-full lg:w-2/3 min-h-[480px] lg:h-auto rounded-[2rem] overflow-hidden relative shadow-md group border border-outline-variant/20">
          {/* Map Image Background */}
          <div
            className="w-full h-full bg-cover bg-center absolute inset-0 transition-transform duration-[10s] ease-linear group-hover:scale-105"
            data-location="San Francisco to San Jose, CA route"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0x0NVWAbsA0gt2IOUkUy-8DyKRvHtkIFsQ4mhPyBNsN56xJUpl7frx9CGoK2Qj3R5DxTz9qr96gadRhH6nl9AuXRfmfAQospC25hck0WY09L7JJ2ykjmIKg7ZfaC8rbko8cogP2asc1LMpSbwkN6RWcBDoO2ygNWVkv6na3yOu6K_0q1Es5U8BWwo9wSbIjzPUfh8l0onIBktqLJaSTSN0oDShMQXqwiPwv95obun391GSKm6xRBr')`,
            }}
          ></div>

          {/* Map Scrim / Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>

          {/* Route Summary Overlay (Top Left) */}
          <div className="absolute top-md left-md bg-surface/95 backdrop-blur-md rounded-2xl p-md shadow-lg border border-white/30 flex flex-col gap-3 z-10 max-w-xs">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-on-surface ring-4 ring-surface"></div>
                <div className="w-0.5 h-8 bg-outline-variant border-l-2 border-dashed border-outline-variant"></div>
                <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div>
                  <p className="font-body-md text-on-surface-variant truncate">Origin</p>
                  <p className="font-body-lg text-on-surface font-medium truncate">
                    100 Market St, SF
                  </p>
                </div>
                <div>
                  <p className="font-body-md text-on-surface-variant truncate">Destination</p>
                  <p className="font-body-lg text-on-surface font-medium truncate">
                    HQ Campus, SJ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Telemetry Floating Overlay (Bottom Center/Right) */}
          <div className="absolute bottom-md right-md lg:bottom-xl lg:right-xl flex flex-wrap gap-sm z-10">
            {/* Speed */}
            <div className="bg-surface/95 backdrop-blur-xl rounded-2xl p-sm shadow-xl flex items-center gap-md border border-white/30 transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                <svg
                  className="text-on-surface"
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  ></path>
                  <path
                    d="M12 16L16 12M12 16L8 12M12 16V8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <div className="pr-md">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-0.5">
                  Current Speed
                </p>
                <p className="font-headline-lg text-on-surface leading-none">
                  {isCheckedIn ? currentSpeed : 0}{' '}
                  <span className="font-body-md text-on-surface-variant ml-1">km/h</span>
                </p>
              </div>
            </div>

            {/* Distance */}
            <div className="bg-primary/95 backdrop-blur-xl rounded-2xl p-sm shadow-xl flex items-center gap-md border border-white/10 transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary">multiple_stop</span>
              </div>
              <div className="pr-md">
                <p className="font-label-sm text-inverse-primary uppercase tracking-wider mb-0.5">
                  Live Dist.
                </p>
                <p className="font-headline-lg text-on-primary leading-none">
                  {liveDistance.toFixed(1)}{' '}
                  <span className="font-body-md text-inverse-primary ml-1">km</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
