import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldAlert, 
  Radio, 
  ArrowRight,
  Download
} from 'lucide-react';

export default function AlertsView({ 
  alerts, 
  setAlerts, 
  onSelectUnit, 
  setActiveTab,
  setToast 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' | 'Geofence' | 'Speed'
  const [engagedIncident, setEngagedIncident] = useState(null);
  const [tacticalNote, setTacticalNote] = useState('');

  // Filter alerts by category
  const filteredAlerts = alerts.filter((alert) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Geofence') return alert.category === 'geofence';
    if (selectedCategory === 'Speed') return alert.category === 'speed';
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && a.status === 'active').length;

  const handleEngage = (incident) => {
    setEngagedIncident(incident);
  };

  const handleConfirmEngagement = (e) => {
    e.preventDefault();
    if (!engagedIncident) return;

    setAlerts(alerts.map(a => 
      a.id === engagedIncident.id 
        ? { ...a, severity: 'resolved', status: 'resolved', actionLabel: 'Auto-Cleared', eventTitle: `${a.eventTitle} (Engaged & Mitigated)` } 
        : a
    ));

    setToast({
      title: `Emergency Protocol Engaged for ${engagedIncident.assetId}`,
      desc: `Tactical team deployed. Note: "${tacticalNote || 'Standard containment protocol applied'}"`,
      type: 'success'
    });

    setTacticalNote('');
    setEngagedIncident(null);
  };

  const handleReview = (incident) => {
    onSelectUnit(incident.assetId);
    setActiveTab('device-details');
  };

  return (
    <div className="flex flex-col w-full relative select-none min-h-[calc(100vh-64px)]">
      
      {/* Ambient Map Background Overlay */}
      <div className="fixed inset-0 top-[64px] left-[280px] z-0 pointer-events-none overflow-hidden">
        <div 
          className="w-full h-full opacity-20 mix-blend-luminosity bg-cover bg-center"
          style={{ backgroundImage: `url('https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        {/* Decorative glowing orb behind critical items */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-error/10 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>
      </div>

      <div className="flex flex-col w-full px-lg py-lg gap-lg relative z-10 max-w-[1600px] mx-auto">
        
        {/* Command Panel / Filters Header */}
        <div className="w-full bg-surface-container/90 backdrop-blur-xl shadow-lg rounded-xl p-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-lg relative overflow-hidden group border border-outline-variant/15">
          {/* Animated Background Gradient in Header */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none"></div>
          
          <div className="flex items-center gap-md z-10">
            <div className="relative w-12 h-12 bg-surface-bright rounded-full flex items-center justify-center shadow-md border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface text-[24px]">radar</span>
              {criticalCount > 0 && (
                <>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-error rounded-full animate-ping"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-error rounded-full"></div>
                </>
              )}
            </div>
            
            <div className="flex flex-col">
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Telemetry Alerts</h1>
              <div className="flex items-center gap-sm mt-xs">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="font-mono-data text-mono-data text-error font-bold">{criticalCount} CRITICAL</span>
                <span className="w-1 h-1 rounded-full bg-on-surface-variant/50 mx-xs"></span>
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span className="font-mono-data text-mono-data text-tertiary font-bold">{warningCount} WARNINGS</span>
              </div>
            </div>
          </div>

          {/* Trend Chart (24h Event Frequency) */}
          <div className="hidden md:flex flex-col items-end z-10">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-sm font-semibold">
              24h Event Frequency
            </span>
            <svg className="w-32 h-8 text-tertiary" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path 
                d="M0,20 L0,15 L10,12 L20,18 L30,5 L40,10 L50,8 L60,15 L70,2 L80,10 L90,14 L100,6 L100,20 Z" 
                fill="currentColor" 
                fillOpacity="0.2"
              ></path>
              <path 
                d="M0,15 L10,12 L20,18 L30,5 L40,10 L50,8 L60,15 L70,2 L80,10 L90,14 L100,6" 
                fill="none" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeWidth="2"
              ></path>
            </svg>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-sm w-full sm:w-auto z-10">
            <div className="bg-surface-container-high rounded-full px-xs py-xs flex shadow-inner border border-outline-variant/20">
              {['All', 'Geofence', 'Speed'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-md py-sm rounded-full font-label-md text-label-md transition-all ${
                    selectedCategory === cat
                      ? 'bg-surface-bright text-on-surface shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-bright/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setToast({
                  title: 'Incident Filters Applied',
                  desc: 'Showing verified telematics telemetry streams.',
                  type: 'info'
                });
              }}
              className="w-10 h-10 bg-surface-container-high hover:bg-surface-bright rounded-full flex items-center justify-center text-on-surface shadow-sm transition-transform hover:scale-105 border border-outline-variant/20"
              title="Filter list"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>

        </div>

        {/* Alert List Container */}
        <div className="flex flex-col w-full gap-sm">
          
          {/* Column Headers (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-[120px_160px_1fr_2fr_120px] gap-md px-lg py-sm text-on-surface-variant font-label-sm text-label-sm uppercase tracking-[0.15em] opacity-70">
            <div>Severity</div>
            <div>Timestamp</div>
            <div>Asset ID</div>
            <div>Event Signature</div>
            <div className="text-right">Action</div>
          </div>

          {/* Alert Items */}
          {filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isResolved = alert.severity === 'resolved' || alert.status === 'resolved';

            if (isCritical) {
              return (
                <div
                  key={alert.id}
                  className="group grid grid-cols-1 md:grid-cols-[120px_160px_1fr_2fr_120px] items-center gap-md bg-surface-container-low/80 hover:bg-surface-container/90 backdrop-blur-md p-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden border border-outline-variant/10"
                >
                  {/* Status Indicator Rail */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-error opacity-80"></div>
                  
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-error-container flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-on-error-container text-[16px]">priority_high</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-error uppercase tracking-widest font-bold">Critical</span>
                  </div>

                  <div className="font-mono-data text-mono-data text-on-surface-variant text-[13px]">
                    {alert.timestamp}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-mono font-bold">{alert.assetId}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{alert.unitGroup}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{alert.eventTitle}</span>
                    <span className="font-mono-data text-label-sm text-error/70 font-mono">{alert.coordinates}</span>
                  </div>

                  <div className="flex justify-end w-full md:w-auto mt-sm md:mt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEngage(alert);
                      }}
                      className="px-md py-sm bg-error hover:bg-error/90 text-on-error rounded-full font-label-md text-label-md shadow-md transition-all hover:-translate-y-0.5 font-bold"
                    >
                      Engage
                    </button>
                  </div>
                </div>
              );
            }

            if (isWarning) {
              return (
                <div
                  key={alert.id}
                  className="group grid grid-cols-1 md:grid-cols-[120px_160px_1fr_2fr_120px] items-center gap-md bg-surface-container-low/80 hover:bg-surface-container/90 backdrop-blur-md p-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden border border-outline-variant/10"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary opacity-80"></div>
                  
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-on-tertiary-container text-[16px]">speed</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest font-bold">Warning</span>
                  </div>

                  <div className="font-mono-data text-mono-data text-on-surface-variant text-[13px]">
                    {alert.timestamp}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-mono font-bold">{alert.assetId}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{alert.unitGroup}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-on-surface font-semibold">{alert.eventTitle}</span>
                    <span className="font-mono-data text-label-sm text-tertiary/70 font-mono">{alert.coordinates}</span>
                  </div>

                  <div className="flex justify-end w-full md:w-auto mt-sm md:mt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview(alert);
                      }}
                      className="px-md py-sm bg-surface-bright hover:bg-surface-container-highest text-on-surface rounded-full font-label-md text-label-md shadow-sm transition-all hover:-translate-y-0.5 font-medium border border-outline-variant/20"
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            }

            // Resolved items
            return (
              <div
                key={alert.id}
                className="group grid grid-cols-1 md:grid-cols-[120px_160px_1fr_2fr_120px] items-center gap-md bg-surface-container-lowest/40 hover:bg-surface-container-lowest/80 backdrop-blur-sm p-md rounded-xl transition-all cursor-pointer relative overflow-hidden opacity-80 hover:opacity-100 border border-outline-variant/10"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50 group-hover:bg-primary transition-colors"></div>
                
                <div className="flex items-center gap-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-container/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container text-[16px]">check_circle</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">Resolved</span>
                </div>

                <div className="font-mono-data text-mono-data text-on-surface-variant text-[13px]">
                  {alert.timestamp}
                </div>

                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-mono font-semibold">{alert.assetId}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{alert.unitGroup}</span>
                </div>

                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-medium">{alert.eventTitle}</span>
                  <span className="font-mono-data text-label-sm text-on-surface-variant font-mono">{alert.coordinates}</span>
                </div>

                <div className="flex justify-end w-full md:w-auto mt-sm md:mt-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant px-md py-sm font-mono">
                    {alert.actionLabel || 'Auto-Cleared'}
                  </span>
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* ENGAGE EMERGENCY PROTOCOL MODAL */}
      {engagedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container border border-error/50 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-[20px]">priority_high</span>
                </div>
                <h3 className="text-[17px] font-bold text-on-surface">Emergency Response: {engagedIncident.assetId}</h3>
              </div>
              <button onClick={() => setEngagedIncident(null)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-error/10 border border-error/30 rounded-xl p-3.5 space-y-1">
              <div className="text-[14px] font-bold text-error">{engagedIncident.eventTitle}</div>
              <div className="text-[12px] font-mono text-on-surface-variant">Signature: {engagedIncident.coordinates}</div>
              <div className="text-[12px] text-on-surface">Convoy / Asset: <strong>{engagedIncident.unitGroup}</strong></div>
            </div>

            <form onSubmit={handleConfirmEngagement} className="space-y-4">
              <div>
                <label className="text-[12px] font-mono text-on-surface-variant uppercase">Command Directives & Notes</label>
                <textarea
                  value={tacticalNote}
                  onChange={(e) => setTacticalNote(e.target.value)}
                  placeholder="Issue tactical containment directive or route override..."
                  rows="3"
                  className="w-full mt-1 bg-surface-container-high border border-outline-variant/30 rounded-xl p-3 text-on-surface text-[14px] focus:outline-none focus:border-error font-mono"
                  autoFocus
                ></textarea>
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEngagedIncident(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-error hover:bg-error/90 text-on-error font-bold text-[13px] flex items-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Execute Intervention</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
