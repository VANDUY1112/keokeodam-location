import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { HOME_LOCATION } from '../data/speakersData';

export default function MapView({ 
  speakers = [], 
  onSelectSpeaker, 
  onOpenCheckinModal 
}) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'renting' | 'available' | 'alert'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(speakers[0]?.id || 'LKK-01');
  const [mapLayer, setMapLayer] = useState('standard');
  const [showLayerDropdown, setShowLayerDropdown] = useState(false);
  const [now, setNow] = useState(Date.now());

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylinesRef = useRef([]);
  const tileLayerRef = useRef(null);

  // Live timer every 10 seconds
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);

  const rentingSpeakers = speakers.filter(s => s.status === 'renting');
  const availableSpeakers = speakers.filter(s => s.status === 'available');

  const filteredSpeakers = speakers.filter(s => {
    const matchSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.currentRental?.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.currentRental?.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (filterTab === 'renting') return s.status === 'renting';
    if (filterTab === 'available') return s.status === 'available';
    if (filterTab === 'alert') {
      if (s.status !== 'renting' || !s.currentRental) return false;
      const hours = (now - s.currentRental.startTimestamp) / 3600000;
      return hours >= 3.5 || s.battery <= 25;
    }
    return true;
  });

  // Calculate total distance & active hours
  const totalShippingDistance = rentingSpeakers.reduce((acc, s) => acc + (s.currentRental?.distanceKm || 0), 0);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const homeLat = HOME_LOCATION.lat || 10.8752;
    const homeLng = HOME_LOCATION.lng || 106.7725;

    const map = L.map(mapContainerRef.current, {
      center: [homeLat, homeLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19, subdomains: 'abcd' }
    ).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Home Base Marker
    const homeIcon = L.divIcon({
      className: 'custom-home-marker',
      html: `
        <div class="flex flex-col items-center select-none" style="transform: translate(-50%, -50%);">
          <div class="px-2.5 py-1 bg-primary text-white font-extrabold text-[10px] rounded-lg shadow-lg mb-1 whitespace-nowrap flex items-center gap-1 border border-white">
            <span class="material-symbols-outlined text-[14px]">home</span> KHO NHÀ CHÍNH
          </div>
          <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-ping absolute top-5"></div>
          <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-xl border-2 border-white text-white z-10">
            <span class="material-symbols-outlined text-[20px]">home</span>
          </div>
        </div>
      `,
      iconSize: [120, 60],
      iconAnchor: [60, 30]
    });

    const homeMarker = L.marker([homeLat, homeLng], { icon: homeIcon }).addTo(map);
    homeMarker.bindPopup(`
      <div style="font-family: Inter, sans-serif; padding: 4px;">
        <div style="font-weight: 800; font-size: 14px; color: #005ab3;">🏠 Kho Nhà & Điểm Xuất Phát</div>
        <div style="font-size: 12px; color: #414754; margin-top: 2px;">${HOME_LOCATION.address}</div>
        <div style="font-size: 12px; color: #0073e0; font-weight: bold; margin-top: 4px;">Sẵn sàng: ${availableSpeakers.length} chiếc loa</div>
      </div>
    `);

    // Add Markers and Distance Lines for Rented Speakers
    speakers.forEach((s) => {
      if (s.status === 'renting' && s.currentRental) {
        const destLat = s.currentRental.lat || (homeLat + (s.currentRental.coords?.y - 50) * 0.003);
        const destLng = s.currentRental.lng || (homeLng + (s.currentRental.coords?.x - 50) * 0.003);
        const distKm = s.currentRental.distanceKm || 3.5;

        // Draw delivery route line from Home to Customer
        const routeLine = L.polyline([
          [homeLat, homeLng],
          [destLat, destLng]
        ], {
          color: '#005ab3',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 6'
        }).addTo(map);

        polylinesRef.current.push(routeLine);

        // Marker for customer delivery destination
        const speakerIcon = L.divIcon({
          className: 'custom-speaker-marker',
          html: `
            <div class="flex flex-col items-center cursor-pointer select-none" style="transform: translate(-50%, -50%);">
              <div class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center animate-ping absolute top-0"></div>
              <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white z-10">
                <span class="material-symbols-outlined text-[18px]">speaker</span>
              </div>
              <div class="mt-1 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow text-center border border-slate-300">
                <span class="font-mono text-[11px] font-extrabold text-slate-800 block">${s.id}</span>
                <div class="text-[9px] font-bold text-primary font-mono">${distKm} km · ${s.currentRental.customerName.split('(')[0]}</div>
              </div>
            </div>
          `,
          iconSize: [100, 60],
          iconAnchor: [50, 30]
        });

        const marker = L.marker([destLat, destLng], { icon: speakerIcon }).addTo(map);

        const hoursRented = Math.max(1, ((now - s.currentRental.startTimestamp) / 3600000)).toFixed(1);
        const costAccrued = (Math.round(hoursRented * s.hourlyRate) + (s.currentRental.shippingFee || 0)).toLocaleString('vi-VN');

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 200px; padding: 4px;">
            <div style="font-weight: 800; font-size: 14px; color: #005ab3;">🔊 Loa: ${s.id} - ${s.name}</div>
            <div style="font-size: 12px; color: #111c2d; margin-top: 4px;"><strong>Khách thuê:</strong> ${s.currentRental.customerName}</div>
            <div style="font-size: 12px; color: #111c2d;"><strong>Địa chỉ:</strong> ${s.currentRental.address}</div>
            <div style="font-size: 12px; color: #111c2d;"><strong>Quãng đường:</strong> <span style="font-weight: bold; color: #005ab3;">${distKm} km</span> (Ship: +${s.currentRental.shippingFee?.toLocaleString('vi-VN')}đ)</div>
            <div style="font-size: 12px; color: #111c2d; margin-top: 2px;"><strong>Thời gian đã thuê:</strong> <span style="font-weight: bold; color: #d97706;">${hoursRented} tiếng</span></div>
            <div style="font-size: 13px; font-weight: bold; color: #059669; margin-top: 4px;">Tạm tính: ${costAccrued}đ</div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedSpeakerId(s.id);
        });

        markersRef.current[s.id] = marker;
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [speakers]);

  // Update map layer dynamically
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (mapLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapLayer === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
    tileLayerRef.current.setUrl(url);
  }, [mapLayer]);

  // Focus on selected speaker
  const focusSpeaker = (spk) => {
    setSelectedSpeakerId(spk.id);
    if (spk.status === 'renting' && spk.currentRental && mapInstanceRef.current) {
      const homeLat = HOME_LOCATION.lat || 10.8752;
      const homeLng = HOME_LOCATION.lng || 106.7725;
      const destLat = spk.currentRental.lat || (homeLat + (spk.currentRental.coords?.y - 50) * 0.003);
      const destLng = spk.currentRental.lng || (homeLng + (spk.currentRental.coords?.x - 50) * 0.003);

      mapInstanceRef.current.flyTo([destLat, destLng], 15, { duration: 1.2 });
      const marker = markersRef.current[spk.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 600);
      }
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([HOME_LOCATION.lat, HOME_LOCATION.lng], 13, { duration: 1 });
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden relative bg-surface-container-low select-none">
      
      {/* ═══════════════ INTERACTIVE LEAFLET MAP CONTAINER ═══════════════ */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 z-0 w-full h-full"
      ></div>

      {/* ═══════════════ MAP CONTROLS OVERLAY (TOP RIGHT) ═══════════════ */}
      <div className="absolute right-stack-lg top-stack-lg flex flex-col gap-stack-sm z-20 shadow-md">
        <button 
          onClick={() => mapInstanceRef.current && mapInstanceRef.current.zoomIn()}
          className="w-10 h-10 bg-surface text-on-surface rounded-full flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm focus:outline-none"
          title="Phóng to"
        >
          <span className="material-symbols-outlined text-outline">add</span>
        </button>
        <button 
          onClick={() => mapInstanceRef.current && mapInstanceRef.current.zoomOut()}
          className="w-10 h-10 bg-surface text-on-surface rounded-full flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm focus:outline-none"
          title="Thu nhỏ"
        >
          <span className="material-symbols-outlined text-outline">remove</span>
        </button>
        <button 
          onClick={handleRecenter}
          className="w-10 h-10 bg-surface text-on-surface rounded-full flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm mt-stack-md focus:outline-none"
          title="Căn giữa Kho Nhà Chính"
        >
          <span className="material-symbols-outlined text-primary">home</span>
        </button>
        
        {/* Layer Selector */}
        <div className="relative group mt-stack-md">
          <button 
            onClick={() => setShowLayerDropdown(!showLayerDropdown)}
            className="w-10 h-10 bg-surface text-on-surface rounded-full flex items-center justify-center hover:bg-surface-container transition-colors shadow-sm focus:outline-none"
            title="Đổi kiểu bản đồ"
          >
            <span className="material-symbols-outlined text-outline">satellite_alt</span>
          </button>

          <div className={`absolute right-12 top-0 bg-surface rounded-lg p-stack-sm shadow-md flex-col gap-unit whitespace-nowrap z-30 border border-outline-variant/20 ${showLayerDropdown ? 'flex' : 'hidden group-hover:flex'}`}>
            <button 
              onClick={() => { setMapLayer('standard'); setShowLayerDropdown(false); }}
              className={`text-left px-stack-sm py-unit hover:bg-surface-container rounded font-body-sm text-on-surface ${mapLayer === 'standard' ? 'font-bold text-primary bg-primary/10' : ''}`}
            >
              Bản đồ chuẩn
            </button>
            <button 
              onClick={() => { setMapLayer('satellite'); setShowLayerDropdown(false); }}
              className={`text-left px-stack-sm py-unit hover:bg-surface-container rounded font-body-sm text-on-surface ${mapLayer === 'satellite' ? 'font-bold text-primary bg-primary/10' : ''}`}
            >
              Vệ tinh
            </button>
            <button 
              onClick={() => { setMapLayer('dark'); setShowLayerDropdown(false); }}
              className={`text-left px-stack-sm py-unit hover:bg-surface-container rounded font-body-sm text-on-surface ${mapLayer === 'dark' ? 'font-bold text-primary bg-primary/10' : ''}`}
            >
              Bản đồ tối (Dark)
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════ LEFT SIDE PANEL: DANH SÁCH LOA & ĐỊA ĐIỂM THUÊ (380PX) ═══════════════ */}
      <div className="absolute left-stack-lg top-stack-lg bottom-stack-lg w-[380px] bg-surface/95 backdrop-blur-xl rounded-xl shadow-xl flex flex-col z-20 overflow-hidden border border-outline-variant/20">
        
        {/* Panel Header */}
        <div className="p-stack-md bg-primary text-on-primary">
          <div className="flex items-center justify-between mb-stack-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">speaker</span>
              <h2 className="font-headline-sm text-headline-sm font-bold">Địa điểm thuê loa</h2>
            </div>
            <span className="font-mono-data text-mono-data bg-on-primary/20 px-2 py-0.5 rounded-full font-bold">
              {rentingSpeakers.length} Đang thuê
            </span>
          </div>

          {/* Search Input inside Panel */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-primary/70 text-[20px]">
              search
            </span>
            <input 
              className="w-full bg-on-primary/10 text-on-primary placeholder:text-on-primary/70 rounded-lg py-2 pl-10 pr-4 outline-none focus:bg-on-primary/20 transition-colors font-body-sm" 
              placeholder="Tìm mã loa, tên khách, địa chỉ..." 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-surface-container-low p-unit shadow-inner">
          <button 
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-1.5 text-center font-label-md text-label-md rounded-md transition-all ${
              filterTab === 'all' 
                ? 'bg-surface text-primary shadow-sm font-bold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Tất cả ({speakers.length})
          </button>
          
          <button 
            onClick={() => setFilterTab('renting')}
            className={`flex-1 py-1.5 text-center font-label-md text-label-md rounded-md transition-all flex items-center justify-center gap-unit ${
              filterTab === 'renting' 
                ? 'bg-surface text-primary shadow-sm font-bold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Đang thuê ({rentingSpeakers.length})
          </button>

          <button 
            onClick={() => setFilterTab('available')}
            className={`flex-1 py-1.5 text-center font-label-md text-label-md rounded-md transition-all flex items-center justify-center gap-unit ${
              filterTab === 'available' 
                ? 'bg-surface text-primary shadow-sm font-bold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Tại kho ({availableSpeakers.length})
          </button>
        </div>

        {/* Speaker & Rental List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSpeakers.map((s) => {
            const isSelected = selectedSpeakerId === s.id;
            const isRenting = s.status === 'renting';
            const elapsedHours = s.currentRental ? Math.max(1, (now - s.currentRental.startTimestamp) / 3600000).toFixed(1) : 0;
            const liveTotal = isRenting && s.currentRental 
              ? (Math.round(elapsedHours * s.hourlyRate) + (s.currentRental.shippingFee || 0)).toLocaleString('vi-VN') 
              : 0;

            return (
              <div 
                key={s.id}
                onClick={() => focusSpeaker(s)}
                className={`p-stack-md hover:bg-surface-container-low transition-colors cursor-pointer relative group border-t border-outline-variant/30 ${
                  isSelected ? 'bg-primary/10' : ''
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isRenting ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                )}

                {/* Top Info */}
                <div className="flex justify-between items-start mb-unit">
                  <div className="flex items-center gap-stack-sm">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isRenting 
                        ? 'bg-amber-100 text-amber-700 font-bold' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">speaker</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-label-md text-label-md text-on-surface font-extrabold">{s.id}</h3>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          isRenting ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isRenting ? 'Đang hát' : 'Tại kho'}
                        </span>
                      </div>
                      <p className="font-body-sm text-[11px] text-on-surface-variant truncate max-w-[160px]">{s.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isRenting ? (
                      <>
                        <span className="font-mono-data text-mono-data text-emerald-700 font-extrabold block">
                          {liveTotal}đ
                        </span>
                        <span className="font-body-sm text-[10px] text-amber-700 font-mono font-bold bg-amber-50 px-1 rounded">
                          Đã thuê: {elapsedHours}h
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono-data text-mono-data text-primary font-bold">
                          {s.hourlyRate.toLocaleString('vi-VN')}đ/h
                        </span>
                        <p className="font-body-sm text-[10px] text-emerald-600 font-semibold">Pin: {s.battery}%</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Customer and Delivery Location */}
                {isRenting && s.currentRental && (
                  <div className="mt-2 pt-2 border-t border-outline-variant/20 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-on-surface">
                      <span className="text-on-surface-variant">Khách hàng:</span>
                      <strong>{s.currentRental.customerName}</strong>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                      <span className="truncate flex-1" title={s.currentRental.address}>{s.currentRental.address}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-on-surface-variant font-mono">
                      <span>Quãng đường: <strong className="text-primary">{s.currentRental.distanceKm} km</strong></span>
                      <span>Ship: <strong>+{s.currentRental.shippingFee?.toLocaleString('vi-VN')}đ</strong></span>
                    </div>

                    {/* Quick Action Button for ending journey */}
                    <div className="flex gap-2 pt-1.5">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCheckinModal('return', s.id);
                        }}
                        className="flex-1 py-1.5 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 shadow-xs transition-all"
                      >
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>Kết Thúc &amp; Thu Hồi</span>
                      </button>
                      <a 
                        href={`tel:${s.currentRental.customerPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-primary flex items-center justify-center"
                        title="Gọi khách hàng"
                      >
                        <span className="material-symbols-outlined text-[16px]">call</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Panel Footer */}
        <div className="p-stack-sm bg-surface-container shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] text-center border-t border-outline-variant/20 flex justify-between items-center px-4">
          <span className="font-body-sm text-[11px] text-outline">
            Tổng cự ly chở: <strong className="text-primary font-mono">{totalShippingDistance.toFixed(1)} km</strong>
          </span>
          <button 
            onClick={() => onOpenCheckinModal('delivery')}
            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[14px]">add</span> Giao thêm loa
          </button>
        </div>

      </div>

      {/* ═══════════════ FLOATING BOTTOM METRICS BAR ═══════════════ */}
      <div className="absolute bottom-stack-lg left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md rounded-full shadow-lg px-stack-lg py-stack-sm flex items-center gap-stack-lg border border-outline-variant/20 z-20">
        <div className="flex items-center gap-stack-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="font-label-md text-on-surface">
            Đang cho thuê: <span className="font-mono-data font-bold text-amber-700">{rentingSpeakers.length} loa</span>
          </span>
        </div>
        <div className="w-[1px] h-4 bg-outline-variant/50"></div>
        <div className="flex items-center gap-stack-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="font-label-md text-on-surface">
            Sẵn sàng tại kho: <span className="font-mono-data font-bold text-emerald-700">{availableSpeakers.length} loa</span>
          </span>
        </div>
        <div className="w-[1px] h-4 bg-outline-variant/50"></div>
        <div className="flex items-center gap-stack-sm">
          <span className="material-symbols-outlined text-[16px] text-primary">route</span>
          <span className="font-label-md text-on-surface">
            Tổng quãng đường: <span className="font-mono-data font-bold text-primary">{totalShippingDistance.toFixed(1)} km</span>
          </span>
        </div>
      </div>

    </div>
  );
}
