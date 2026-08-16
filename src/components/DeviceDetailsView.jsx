import React, { useState } from 'react';
import { 
  Search, 
  Gauge, 
  Radio, 
  MessageSquare, 
  History, 
  Satellite, 
  Zap, 
  Fuel, 
  Signal, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Truck,
  Send,
  X
} from 'lucide-react';

export default function DeviceDetailsView({ 
  fleet, 
  selectedUnitId, 
  onSelectUnit, 
  searchTerm: globalSearchTerm,
  setToast 
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [dispatchMessage, setDispatchMessage] = useState('');

  const effectiveSearch = localSearch || globalSearchTerm;
  const filteredList = fleet.filter(v => 
    !effectiveSearch || 
    v.id.toLowerCase().includes(effectiveSearch.toLowerCase()) || 
    v.type.toLowerCase().includes(effectiveSearch.toLowerCase())
  );

  const selectedVehicle = fleet.find(v => v.id === selectedUnitId) || fleet[0];

  const handleSendDispatch = (e) => {
    e.preventDefault();
    if (!dispatchMessage.trim()) return;
    setToast({
      title: `Dispatch Message Sent to ${selectedVehicle.id}`,
      desc: `Driver ${selectedVehicle.driver.name} received instruction: "${dispatchMessage}"`,
      type: 'success'
    });
    setDispatchMessage('');
    setShowDispatchModal(false);
  };

  // SVG Progress Ring calculation for Power Cell (circumference = 2 * PI * 40 ≈ 251.2)
  const powerCellVal = selectedVehicle.powerCell || 85;
  const strokeDashoffset = 251.2 - (251.2 * powerCellVal) / 100;

  return (
    <div className="flex flex-col w-full select-none">
      <div className="flex flex-col lg:flex-row gap-lg p-lg w-full max-w-[1600px] mx-auto">
        
        {/* LEFT PANEL: DEVICE LIST (340px) */}
        <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-lg">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface">Active Fleet</h2>
            <div className="font-mono-data text-mono-data text-primary bg-primary/10 px-sm py-xs rounded-full border border-primary/20">
              {fleet.filter(v => v.status === 'active').length + 22} Online
            </div>
          </div>

          {/* Search Box */}
          <div className="bg-surface-container-high rounded-xl px-md py-sm flex items-center gap-sm shadow-sm transition-all focus-within:shadow-primary/10 border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search vehicle ID..."
              className="bg-transparent text-on-surface font-body-md w-full outline-none placeholder:text-on-surface-variant/50 text-[14px]"
            />
            {localSearch && (
              <button onClick={() => setLocalSearch('')} className="text-on-surface-variant hover:text-on-surface text-[12px]">
                ✕
              </button>
            )}
          </div>

          {/* Vehicle List */}
          <div className="flex flex-col gap-sm overflow-y-auto h-[calc(100vh-250px)] pr-xs">
            {filteredList.map((unit) => {
              const isSelected = unit.id === selectedVehicle.id;
              const isLive = unit.status === 'active';
              const isIdle = unit.status === 'idle';
              const isOffline = unit.status === 'offline' || unit.status === 'maintenance';

              if (isSelected) {
                return (
                  <div
                    key={unit.id}
                    className="bg-primary/10 border border-primary/40 rounded-[16px] p-md shadow-lg relative overflow-hidden cursor-default group transition-all"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-[16px]"></div>
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/15 rounded-full blur-xl pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-md relative">
                      <div>
                        <span className="font-headline-md text-headline-md text-primary tracking-tight font-mono font-bold">
                          {unit.id}
                        </span>
                        <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-xs">
                          {unit.type}
                        </div>
                      </div>
                      
                      <span className="flex items-center gap-xs bg-primary/20 px-sm py-xs rounded-full border border-primary/30">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="font-label-sm text-label-sm text-primary font-bold">Live</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-mono-data text-mono-data text-on-surface relative text-[13px]">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="material-symbols-outlined text-[16px] text-primary">speed</span> 
                        {unit.speed} mph
                      </span>
                      <span className="text-on-surface-variant font-medium">ETA: {unit.eta}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={unit.id}
                  onClick={() => onSelectUnit(unit.id)}
                  className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/10 transition-all rounded-[16px] p-md shadow-sm cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-sm">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface font-bold font-mono group-hover:text-primary transition-colors">
                        {unit.id}
                      </span>
                      <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-xs">
                        {unit.type}
                      </div>
                    </div>

                    <span className="flex items-center gap-xs">
                      <div className={`w-2 h-2 rounded-full ${
                        isLive ? 'bg-primary-fixed-dim' : isIdle ? 'bg-tertiary' : 'bg-surface-variant'
                      }`}></div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant capitalize">
                        {unit.statusLabel || unit.status}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-mono-data text-mono-data text-on-surface-variant text-[13px]">
                    {isLive ? (
                      <span className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px]">speed</span> {unit.speed} mph
                      </span>
                    ) : isIdle ? (
                      <span className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px]">speed</span> 0 mph
                      </span>
                    ) : (
                      <span>Last seen: 4h ago</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT PANEL: DETAILED VIEW (Bento Grid) */}
        <div className="flex-1 flex flex-col gap-lg min-w-0">
          
          {/* Quick Action Header */}
          <div className="flex justify-between items-center bg-surface-container-low border border-outline-variant/15 rounded-xl p-sm shadow-sm backdrop-blur-md">
            <div className="flex gap-md px-md">
              <button 
                onClick={() => setShowDispatchModal(true)}
                className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">chat</span>
                <span className="font-label-sm text-label-sm font-semibold">Dispatch</span>
              </button>
              
              <button 
                onClick={() => setShowLogsModal(true)}
                className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">history</span>
                <span className="font-label-sm text-label-sm font-semibold">Logs</span>
              </button>
            </div>

            <div className="font-mono-data text-mono-data text-on-surface-variant flex items-center gap-sm pr-md text-[13px]">
              <span className="material-symbols-outlined text-[18px] text-primary animate-pulse">satellite_alt</span>
              GPS Fix: {selectedVehicle.gpsFix || '3ms ago'}
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
            
            {/* Map (Spans 2 cols) */}
            <div className="xl:col-span-2 h-[420px] rounded-[24px] bg-surface-container shadow-2xl relative overflow-hidden group isolate border border-outline-variant/20">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105" 
                style={{ backgroundImage: `url('${selectedVehicle.mapImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtcavSoNsAn1Xzk4EhQq3XtqzGIejY_svNcX4n4C3o-qsWyqAh5FgLE5Mgs2G4QtJZwPvIxJxScXuUuzf5nWHJXyBqI20qaqeRyQog1NC1njdZaNtznX7U_6tK9CbO77k4aetcEkFq2gVDqZzlmnvok-BGRq4_VDunSrZxRzX3MSssi5wxt7kmZWCJWS6qQQV--SZznptq_ZGR_aSGUilf68HvWm05JHRbauZbpxYg2oMa7u6FPA-N'}')` }}
              />

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface/95 via-surface/30 to-transparent pointer-events-none"></div>

              {/* Breadcrumb pathing visual overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-primary animate-ping opacity-75"></div>
                  <div className="absolute inset-0.5 rounded-full bg-primary border-2 border-white shadow-[0_0_15px_#4be277]"></div>
                </div>
              </div>

              {/* HUD Overlay */}
              <div className="absolute bottom-md left-md right-md flex justify-between items-end">
                <div className="bg-surface-container/90 backdrop-blur-xl rounded-xl p-md shadow-2xl border border-outline-variant/30">
                  <div className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-xs flex items-center gap-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">navigation</span> Current Heading
                  </div>
                  <div className="font-display-lg text-display-lg text-on-surface leading-none font-mono">
                    {selectedVehicle.heading || 'NNE'} <span className="text-headline-md font-headline-md text-on-surface-variant">{selectedVehicle.headingDeg || 32}°</span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-mono mt-1">Location: {selectedVehicle.hub}</div>
                </div>

                <div className="bg-primary text-on-primary rounded-xl p-md shadow-2xl shadow-primary/30 flex flex-col items-end border border-primary-fixed">
                  <div className="font-label-sm text-label-sm uppercase tracking-widest opacity-90 mb-xs font-bold">Speed</div>
                  <div className="font-display-lg text-display-lg leading-none font-mono font-black">
                    {selectedVehicle.speed}<span className="text-headline-md font-headline-md opacity-80 ml-xs">mph</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Sidebar (3 cards) */}
            <div className="flex flex-col gap-lg h-[420px]">
              
              {/* Battery / Power Cell */}
              <div className="bg-surface-container border border-outline-variant/20 rounded-[24px] p-lg flex-1 shadow-md flex items-center justify-between relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-xs text-primary mb-sm font-semibold">
                    <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider">Power Cell</span>
                  </div>
                  <div className="font-headline-lg text-headline-lg text-on-surface font-mono font-black">
                    {selectedVehicle.powerCell || 85}%
                  </div>
                  <div className="font-mono-data text-mono-data text-on-surface-variant mt-xs text-[12px]">
                    Discharging {selectedVehicle.powerDischarge || '-2.4kW'}
                  </div>
                </div>

                {/* SVG Ring */}
                <div className="w-24 h-24 relative z-10">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                    <circle className="stroke-surface-variant" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                    <circle 
                      className="stroke-primary" 
                      cx="50" 
                      cy="50" 
                      fill="transparent" 
                      r="40" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={strokeDashoffset} 
                      strokeLinecap="round" 
                      strokeWidth="8"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-label-sm text-label-sm text-on-surface font-mono font-bold">
                    OK
                  </div>
                </div>
              </div>

              {/* Fuel / Energy */}
              <div className="bg-surface-container border border-outline-variant/20 rounded-[24px] p-lg flex-1 shadow-md flex flex-col justify-center relative">
                <div className="flex justify-between items-end mb-md">
                  <div className="flex items-center gap-xs text-on-surface font-semibold">
                    <span className="material-symbols-outlined text-[20px] text-secondary">local_gas_station</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider">Auxiliary Fuel</span>
                  </div>
                  <div className="font-mono-data text-mono-data text-on-surface font-bold">{selectedVehicle.fuel}%</div>
                </div>
                <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-secondary-fixed rounded-full relative transition-all duration-700" 
                    style={{ width: `${selectedVehicle.fuel}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent"></div>
                  </div>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-sm text-right font-mono">
                  Est. Range: {selectedVehicle.fuelRange || '420 mi'}
                </div>
              </div>

              {/* Signal / Telemetry Link */}
              <div className="bg-surface-container border border-outline-variant/20 rounded-[24px] p-lg flex-1 shadow-md flex items-center gap-md">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner shrink-0">
                  <span className="material-symbols-outlined text-[28px]">network_cell</span>
                </div>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Telemetry Link</div>
                  <div className="font-headline-md text-headline-md text-on-surface mt-xs tracking-tight font-bold">
                    {selectedVehicle.signalStrength || 'Strong'}
                  </div>
                  <div className="font-mono-data text-mono-data text-primary mt-xs text-[12px]">
                    Ping: {selectedVehicle.ping || '24ms (LTE-M)'}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Chart Section: Velocity Profile */}
          <div className="bg-surface-container border border-outline-variant/20 rounded-[24px] p-lg shadow-2xl relative overflow-hidden mt-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-xl relative z-10">
              <div className="flex items-center gap-md">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Velocity Profile</h3>
                <span className="bg-surface-variant text-on-surface-variant px-sm py-xs rounded-md font-label-sm text-label-sm font-mono">
                  Last 6 Hours
                </span>
              </div>
              <div className="flex items-center gap-md font-mono-data text-mono-data text-on-surface-variant text-[12px]">
                <div className="flex items-center gap-xs">
                  <div className="w-2 h-2 rounded-full bg-primary"></div> Speed (mph)
                </div>
                <div className="flex items-center gap-xs">
                  <div className="w-2 h-2 rounded-full bg-surface-variant"></div> Limit
                </div>
              </div>
            </div>

            <div className="h-56 w-full relative z-10">
              {/* Inline SVG Chart */}
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop className="text-primary" offset="0%" stopColor="#4be277" stopOpacity="0.25"></stop>
                    <stop className="text-primary" offset="100%" stopColor="#4be277" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                <line className="stroke-surface-variant/50" strokeWidth="1" x1="0" x2="1000" y1="40" y2="40"></line>
                <line className="stroke-surface-variant/50" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100"></line>
                <line className="stroke-surface-variant/50" strokeWidth="1" x1="0" x2="1000" y1="160" y2="160"></line>
                
                {/* Speed Limit Line (dashed) */}
                <line className="stroke-outline/40" strokeDasharray="8,8" strokeWidth="2" x1="0" x2="1000" y1="60" y2="60"></line>
                
                {/* Area Fill */}
                <path d="M0,200 L0,140 C150,130 250,50 400,65 C550,80 650,45 800,55 C900,60 950,40 1000,45 L1000,200 Z" fill="url(#areaGradient)"></path>
                
                {/* Line */}
                <path 
                  className="stroke-primary" 
                  d="M0,140 C150,130 250,50 400,65 C550,80 650,45 800,55 C900,60 950,40 1000,45" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="3.5" 
                  style={{ filter: 'drop-shadow(0 4px 10px rgba(75, 226, 119, 0.4))' }}
                ></path>
                
                {/* Data Point (Current) */}
                <circle className="fill-surface stroke-primary" cx="1000" cy="45" r="6" strokeWidth="3"></circle>
                <circle className="fill-primary/20 animate-ping" cx="1000" cy="45" r="14"></circle>
              </svg>

              {/* X-Axis Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between font-mono-data text-mono-data text-on-surface-variant text-[11px] transform translate-y-full pt-sm">
                <span>08:00</span>
                <span>09:00</span>
                <span>10:00</span>
                <span>11:00</span>
                <span>12:00</span>
                <span>13:00</span>
                <span className="text-primary font-bold">Now ({selectedVehicle.speed} mph)</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* DISPATCH POPUP MODAL */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container border border-primary/40 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat</span>
                <h3 className="text-[16px] font-bold text-on-surface">Dispatch Radio to {selectedVehicle.id}</h3>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[13px] text-on-surface-variant">
              Recipient: <strong className="text-on-surface">{selectedVehicle.driver.name}</strong> • Channel: LTE-M Satellite Encrypted
            </div>

            <form onSubmit={handleSendDispatch} className="space-y-4">
              <textarea
                value={dispatchMessage}
                onChange={(e) => setDispatchMessage(e.target.value)}
                placeholder="Enter dispatch instructions or route redirection..."
                rows="3"
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-3 text-on-surface text-[14px] focus:outline-none focus:border-primary font-mono"
                autoFocus
              ></textarea>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-surface-dim font-bold text-[13px] flex items-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGS POPUP MODAL */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">history</span>
                <h3 className="text-[16px] font-bold text-on-surface">Telemetry Event Logs ({selectedVehicle.id})</h3>
              </div>
              <button onClick={() => setShowLogsModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto font-mono text-[12px]">
              <div className="p-2.5 rounded-xl bg-surface-container-high border border-outline-variant/10">
                <div className="flex justify-between text-primary">
                  <span>GPS Ping Transmitted</span>
                  <span>13:58:12 CST</span>
                </div>
                <div className="text-on-surface-variant mt-0.5">Lat: {selectedVehicle.lat}, Lng: {selectedVehicle.lng}, Speed: {selectedVehicle.speed} mph</div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-high border border-outline-variant/10">
                <div className="flex justify-between text-on-surface">
                  <span>CAN-Bus Engine Packet</span>
                  <span>13:55:00 CST</span>
                </div>
                <div className="text-on-surface-variant mt-0.5">Coolant Temp: {selectedVehicle.engineTemp}°F, Battery: {selectedVehicle.powerCell}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-high border border-outline-variant/10">
                <div className="flex justify-between text-secondary">
                  <span>Checkpoint Reached</span>
                  <span>13:30:15 CST</span>
                </div>
                <div className="text-on-surface-variant mt-0.5">Passed Mojave Corridor Checkpoint 04 on schedule.</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-[13px] font-mono"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
