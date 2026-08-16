import React from 'react';
import { 
  Radio, 
  LayoutDashboard, 
  Truck, 
  BellRing, 
  BarChart3, 
  ShieldCheck, 
  Cpu, 
  Layers
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, unreadAlertsCount, fleetCount }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Live Command Map & HUD'
    },
    {
      id: 'device-details',
      label: 'Device Details',
      icon: Truck,
      badge: `${fleetCount}`,
      desc: 'Telemetry & Route Playback'
    },
    {
      id: 'alerts',
      label: 'Alerts & Events',
      icon: BellRing,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null,
      badgeColor: 'bg-error text-surface-dim font-bold animate-pulse',
      desc: 'Real-time Incident Center'
    },
    {
      id: 'reports',
      label: 'Analytics & Reports',
      icon: BarChart3,
      badge: 'Live',
      badgeColor: 'bg-primary/20 text-primary',
      desc: 'Fleet KPI & Scorecards'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface-container-low border-r border-outline-variant/20 z-50 flex flex-col select-none">
      {/* Brand Header */}
      <div className="h-[64px] flex items-center justify-between px-6 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/15 border border-primary/40 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(75,226,119,0.3)]">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div>
            <div className="font-headline-md text-[14px] text-primary tracking-[0.2em] font-bold uppercase">
              Kinetic Core
            </div>
            <div className="text-[11px] text-on-surface-variant font-mono">
              v3.8 • IoT Telematics
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-on-surface-variant/60">
          Command Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-[0_0_15px_rgba(75,226,119,0.15)] font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                <div>
                  <div className="text-[14px] leading-tight">{item.label}</div>
                  <div className="text-[11px] text-on-surface-variant/70 font-normal leading-normal">{item.desc}</div>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-surface-container-highest text-on-surface'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Live System Telemetry Status Footer */}
      <div className="p-4 border-t border-outline-variant/10 bg-surface-dim/50">
        <div className="bg-surface-container/90 border border-outline-variant/20 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            <div>
              <div className="text-[12px] font-semibold text-on-surface">System: Nominal</div>
              <div className="text-[10px] font-mono text-on-surface-variant">Hub: Chicago Gateway</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              99.98%
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
