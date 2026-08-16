import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Crosshair, 
  MoreHorizontal, 
  Route, 
  Zap, 
  AlertTriangle, 
  Gauge, 
  Fuel, 
  Thermometer, 
  Radio, 
  Eye, 
  ArrowUpRight, 
  ShieldAlert,
  Navigation,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function OverviewView({ 
  fleet, 
  stats, 
  onSelectUnit, 
  statusFilter, 
  setStatusFilter, 
  selectedUnit,
  setActiveTab
}) {
  const [mapMode, setMapMode] = useState('dark'); // 'dark' | 'satellite' | 'tactical'
  const [showRadar, setShowRadar] = useState(true);
  const [focusedVehicle, setFocusedVehicle] = useState(null);
  const [animatedDistance, setAnimatedDistance] = useState(0);

  // Counter animation on load
  useEffect(() => {
    let current = 0;
    const target = stats.distanceToday;
    const step = target / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedDistance(target);
        clearInterval(interval);
      } else {
        setAnimatedDistance(Math.floor(current));
      }
    }, 25);
    return () => clearInterval(interval);
  }, [stats.distanceToday]);

  const filteredFleet = statusFilter === 'all' 
    ? fleet 
    : fleet.filter(v => v.status === statusFilter);

  // Donut Arc geometry calculation
  const total = stats.totalUnits || 31;
  const activeCount = fleet.filter(v => v.status === 'active').length + 18; // 24
  const warningCount = fleet.filter(v => v.status === 'warning').length + 3; // 5
  const idleCount = fleet.filter(v => v.status === 'idle' || v.status === 'maintenance').length; // 2

  return (
    <div className="flex flex-col w-full relative select-none">
      {/* MAP COMMAND VIEWPORT */}
      <div className="w-full h-[calc(100vh-64px)] min-h-[780px] relative bg-surface-dim overflow-hidden shadow-2xl">
        
        {/* MAP BACKGROUND LAYER */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
            mapMode === 'satellite' 
              ? 'opacity-90 contrast-125' 
              : mapMode === 'tactical'
              ? 'opacity-50 invert mix-blend-screen'
              : 'mix-blend-luminosity opacity-70'
          }`}
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy5zZ1NkFknjAXS99GyBryk1Q11T4kFo-00DpJq-3DclvBOKmjO-2BNkaB4W9NSiGbi9o7a4ptSL52Pr7WBGO-QkRzoGQfXQPOWv7UesjA-h5wQUbNkL0YdT8mtlsGjsUT_ovJzBjqkAOJYGNAdU84TnkEHZX6J56BzaC6eomRip10VovB6k6vk3GlbggmDIK4jxclgbnCugwLmcFdV6BtraUms9-V_2e3r5Y-aoqoLTCrj-q0ccZU')`
          }}
        />

        {/* HIGH-TECH HUD GRID OVERLAY */}
        <div className="absolute inset-0 radar-grid opacity-80 pointer-events-none" />

        {/* RADAR SWEEP ANIMATION */}
        {showRadar && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-primary/20 pointer-events-none overflow-hidden">
            <div className="w-full h-full rounded-full border border-primary/10 flex items-center justify-center">
              <div className="w-2/3 h-2/3 rounded-full border border-primary/15 flex items-center justify-center">
                <div className="w-1/3 h-1/3 rounded-full border border-primary/25" />
              </div>
            </div>
            {/* Sweep Beam */}
            <div className="absolute top-0 left-0 w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(75,226,119,0.18)_0deg,transparent_60deg)] animate-radar-sweep" />
          </div>
        )}

        {/* SIMULATED ROUTE POLYLINES */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4be277" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#89ceff" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="alertRouteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffba61" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Draw active lines connecting waypoints */}
          {filteredFleet.map((unit) => {
            if (!unit.route || unit.route.length < 2) return null;
            const pointsStr = unit.route.map(pt => `${pt.x}%,${pt.y}%`).join(' ');
            const isWarning = unit.status === 'warning';
            return (
              <g key={`path-${unit.id}`}>
                <polyline
                  points={pointsStr}
                  fill="none"
                  stroke={isWarning ? 'url(#alertRouteGradient)' : 'url(#routeGradient)'}
                  strokeWidth="2.5"
                  strokeDasharray={unit.status === 'active' ? '6,6' : '4,4'}
                  className={unit.status === 'active' ? 'animate-pulse' : ''}
                />
                {unit.route.map((pt, i) => (
                  <circle
                    key={i}
                    cx={`${pt.x}%`}
                    cy={`${pt.y}%`}
                    r="3.5"
                    fill={isWarning ? '#ffba61' : '#4be277'}
                    opacity="0.7"
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {/* INTERACTIVE VEHICLE MARKERS LAYER */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {filteredFleet.map((unit) => {
            const isWarning = unit.status === 'warning';
            const isIdle = unit.status === 'idle' || unit.status === 'maintenance';
            const isFocused = focusedVehicle?.id === unit.id;

            return (
              <div
                key={unit.id}
                style={{ top: `${unit.coords.y}%`, left: `${unit.coords.x}%` }}
                onClick={() => {
                  setFocusedVehicle(unit);
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer pointer-events-auto transition-transform duration-300 ${
                  isFocused ? 'scale-125 z-40' : 'hover:scale-115 z-30'
                }`}
              >
                {/* HUD Label Tooltip on Hover / Focus */}
                <div className={`px-2.5 py-1 bg-surface-container/95 border border-outline-variant/40 shadow-xl rounded-lg mb-1.5 transition-all duration-200 backdrop-blur-md flex items-center gap-1.5 ${
                  isFocused ? 'opacity-100 ring-2 ring-primary' : 'opacity-85 group-hover:opacity-100'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isWarning ? 'bg-error animate-ping' : isIdle ? 'bg-secondary' : 'bg-primary'
                  }`} />
                  <span className="font-mono text-[12px] font-bold text-on-surface">
                    {unit.id}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {unit.speed} mph
                  </span>
                </div>

                {/* Animated Pulsing Beacon Marker */}
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                    isWarning ? 'bg-tertiary/40' : isIdle ? 'bg-secondary/30' : 'bg-primary/40'
                  }`} />
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 ${
                    isWarning ? 'bg-tertiary' : isIdle ? 'bg-surface-bright border-secondary' : 'bg-primary'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isWarning ? 'bg-surface-dim' : isIdle ? 'bg-secondary' : 'bg-on-primary'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOCUSED VEHICLE FLOATING TELEMETRY CARD */}
        {focusedVehicle && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 w-96 bg-surface-container/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[16px] font-bold text-primary">{focusedVehicle.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      focusedVehicle.status === 'warning' ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'
                    }`}>
                      {focusedVehicle.statusLabel}
                    </span>
                  </div>
                  <div className="text-[12px] text-on-surface-variant font-medium">{focusedVehicle.name}</div>
                </div>
              </div>
              <button 
                onClick={() => setFocusedVehicle(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 text-[16px]"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 py-3.5 text-center">
              <div className="bg-surface-container-high/60 p-2.5 rounded-xl border border-outline-variant/10">
                <div className="text-[10px] text-on-surface-variant font-mono uppercase">Velocity</div>
                <div className="font-mono text-[16px] font-bold text-on-surface mt-0.5">{focusedVehicle.speed} <span className="text-[11px] text-on-surface-variant">mph</span></div>
              </div>
              <div className="bg-surface-container-high/60 p-2.5 rounded-xl border border-outline-variant/10">
                <div className="text-[10px] text-on-surface-variant font-mono uppercase">Energy / Fuel</div>
                <div className="font-mono text-[16px] font-bold text-primary mt-0.5">{focusedVehicle.fuel}%</div>
              </div>
              <div className="bg-surface-container-high/60 p-2.5 rounded-xl border border-outline-variant/10">
                <div className="text-[10px] text-on-surface-variant font-mono uppercase">Engine Temp</div>
                <div className={`font-mono text-[16px] font-bold mt-0.5 ${
                  focusedVehicle.engineTemp > 220 ? 'text-error' : 'text-on-surface'
                }`}>
                  {focusedVehicle.engineTemp}°F
                </div>
              </div>
            </div>

            {/* Destination & Driver */}
            <div className="space-y-1.5 text-[12px] bg-surface-container-low/80 p-3 rounded-xl border border-outline-variant/10 mb-3">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Destination:</span>
                <span className="font-semibold text-on-surface">{focusedVehicle.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Driver:</span>
                <span className="font-mono text-primary">{focusedVehicle.driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">ETA:</span>
                <span className="font-mono text-on-surface">{focusedVehicle.eta}</span>
              </div>
            </div>

            {/* Action Deep Dive */}
            <button
              onClick={() => {
                onSelectUnit(focusedVehicle.id);
                setActiveTab('device-details');
              }}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-surface-dim font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(75,226,119,0.3)] text-[13px]"
            >
              <span>Launch Detailed Telematics Hub</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* UI OVERLAYS (Controls & HUD widgets) */}
        <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between">
          
          {/* Top Section: Quick Map Mode & Fleet Status Card */}
          <div className="w-full flex justify-between items-start pointer-events-none">
            
            {/* Left: View Controls */}
            <div className="flex flex-wrap gap-2.5 pointer-events-auto">
              <div className="bg-surface/90 backdrop-blur-xl p-1 rounded-full border border-outline-variant/30 shadow-xl flex items-center gap-1">
                <button
                  onClick={() => setMapMode('dark')}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    mapMode === 'dark' ? 'bg-primary text-surface-dim font-bold shadow-md' : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  Dark Ops
                </button>
                <button
                  onClick={() => setMapMode('satellite')}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    mapMode === 'satellite' ? 'bg-primary text-surface-dim font-bold shadow-md' : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  Satellite
                </button>
              </div>

              {/* Radar Sweep Toggle */}
              <button
                onClick={() => setShowRadar(!showRadar)}
                className={`bg-surface/90 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-outline-variant/30 shadow-xl flex items-center gap-2 text-[12px] transition-all ${
                  showRadar ? 'text-primary border-primary/40' : 'text-on-surface-variant'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-primary" />
                <span>{showRadar ? 'Radar Sweep Active' : 'Radar Off'}</span>
              </button>

              {/* Reset Center */}
              <button
                onClick={() => {
                  setFocusedVehicle(null);
                  setStatusFilter('all');
                }}
                className="bg-primary/15 hover:bg-primary/25 text-primary border border-primary/40 backdrop-blur-xl px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 text-[12px] font-semibold transition-all"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Center Fleet</span>
              </button>
            </div>

            {/* Right: Fleet Status Donut Card */}
            <div className="w-[340px] bg-surface-container/90 backdrop-blur-2xl rounded-2xl border border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 pointer-events-auto flex flex-col gap-4 transform transition-transform hover:-translate-y-0.5">
              <div className="flex justify-between items-center pb-1">
                <div>
                  <h2 className="text-[17px] font-bold text-on-surface">Fleet Status</h2>
                  <div className="text-[11px] font-mono text-on-surface-variant">Real-time Telemetry Hub</div>
                </div>
                <button 
                  onClick={() => setActiveTab('device-details')}
                  className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Donut Chart & Total Counter */}
              <div className="relative w-full aspect-[2/1] flex items-center justify-center my-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                  {/* Background Arc */}
                  <path
                    className="text-surface-container-highest"
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                  {/* Primary (Online/Active) Arc */}
                  <path
                    className="text-primary drop-shadow-[0_0_10px_rgba(75,226,119,0.6)] transition-all duration-1000"
                    d="M 10 50 A 40 40 0 0 1 70 15"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="140"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                  {/* Tertiary (Warning / Idle) Arc */}
                  <path
                    className="text-tertiary drop-shadow-[0_0_8px_rgba(255,186,97,0.5)] transition-all duration-1000"
                    d="M 70 15 A 40 40 0 0 1 85 30"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="140"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeWidth="11"
                  />
                </svg>

                {/* Center Number Counter */}
                <div className="absolute bottom-0 flex flex-col items-center">
                  <span className="text-[36px] font-black text-on-surface leading-none font-mono tracking-tight">
                    {stats.totalUnits}
                  </span>
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-widest mt-1">
                    Total Units
                  </span>
                </div>
              </div>

              {/* Interactive Status Legend Filters */}
              <div className="flex flex-col gap-2 pt-1">
                <div
                  onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    statusFilter === 'active' 
                      ? 'bg-primary/20 border-primary shadow-[0_0_12px_rgba(75,226,119,0.2)]' 
                      : 'bg-surface-container-high/40 hover:bg-surface-container-high border-outline-variant/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(75,226,119,0.8)] animate-pulse" />
                    <span className="text-[13px] font-medium text-on-surface">Active / Routing</span>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-primary">24</span>
                </div>

                <div
                  onClick={() => setStatusFilter(statusFilter === 'warning' ? 'all' : 'warning')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    statusFilter === 'warning' 
                      ? 'bg-tertiary/20 border-tertiary shadow-[0_0_12px_rgba(255,186,97,0.2)]' 
                      : 'bg-surface-container-high/40 hover:bg-surface-container-high border-outline-variant/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(255,186,97,0.6)]" />
                    <span className="text-[13px] font-medium text-on-surface">Idle / Loading</span>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-tertiary">05</span>
                </div>

                <div
                  onClick={() => setStatusFilter(statusFilter === 'maintenance' ? 'all' : 'maintenance')}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    statusFilter === 'maintenance' 
                      ? 'bg-secondary/20 border-secondary' 
                      : 'bg-surface-container-high/40 hover:bg-surface-container-high border-outline-variant/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="text-[13px] font-medium text-on-surface-variant">Offline / Maintenance</span>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-on-surface-variant">02</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tray: Summary Telematics Stats */}
          <div className="w-full flex justify-start pointer-events-none mt-auto">
            <div className="w-[calc(100%-360px)] min-w-[560px] max-w-4xl bg-surface-container/90 backdrop-blur-2xl rounded-2xl border border-outline-variant/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] p-3.5 pointer-events-auto flex items-center justify-between">
              
              {/* Stat 1: Distance Today */}
              <div className="flex items-center gap-3.5 px-4">
                <div className="w-11 h-11 rounded-xl bg-secondary-container/20 border border-secondary/30 flex items-center justify-center">
                  <Route className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
                    Distance Today
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-extrabold text-on-surface font-mono">
                      {animatedDistance.toLocaleString()}
                    </span>
                    <span className="font-mono text-[13px] text-secondary">mi</span>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="w-px h-10 bg-outline-variant/20" />

              {/* Stat 2: Avg Efficiency */}
              <div className="flex items-center gap-3.5 px-4">
                <div className="w-11 h-11 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
                    Avg Efficiency
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-extrabold text-on-surface font-mono">
                      {stats.avgEfficiency}
                    </span>
                    <span className="font-mono text-[13px] text-primary">mpg</span>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="w-px h-10 bg-outline-variant/20" />

              {/* Stat 3: Active Alerts (Clickable) */}
              <div 
                onClick={() => setActiveTab('alerts')}
                className="flex items-center gap-3.5 px-4 pr-6 cursor-pointer group hover:bg-surface-container-high/40 rounded-xl py-1 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-error-container/20 border border-error/30 flex items-center justify-center group-hover:bg-error-container/40 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-error animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider group-hover:text-error transition-colors">
                    Active Alerts
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-extrabold text-error font-mono">
                      {stats.activeAlerts}
                    </span>
                    <span className="font-mono text-[12px] text-error/80 uppercase font-semibold">Critical Event</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
