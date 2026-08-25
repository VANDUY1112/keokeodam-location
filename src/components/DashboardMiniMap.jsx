import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Circle, CircleMarker, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';

// Generate dynamic hotspots around a central GPS point with individual trip dots inside each zone
export function generateHotspotsAround(centerLat, centerLng) {
  const list = [
    {
      id: 'hs-1',
      name: 'Khu Nhà Hàng - Tiệc Cưới Lân Cận',
      shortName: 'Nhà Hàng Tiệc Cưới',
      direction: 'Phía Bắc',
      distance: '650m',
      lat: centerLat + 0.0055,
      lng: centerLng + 0.0035,
      rentalCount: 18,
      revenue: '8.200.000 ₫',
      popularSpeaker: 'Loa Đôi Bass 50 Khủng (1500W)',
      peakHours: '18:00 - 22:30 (Cuối tuần)',
      color: '#ef4444', // Red
      radius: 360,
      badgeText: '18 chuyến',
    },
    {
      id: 'hs-2',
      name: 'Khu Dân Cư - Phố Ẩm Thực',
      shortName: 'Phố Ẩm Thực',
      direction: 'Phía Đông',
      distance: '1.1 km',
      lat: centerLat - 0.0042,
      lng: centerLng + 0.0085,
      rentalCount: 12,
      revenue: '5.400.000 ₫',
      popularSpeaker: 'Loa Kéo Bass 40 (800W)',
      peakHours: '17:30 - 21:30',
      color: '#f59e0b', // Amber
      radius: 300,
      badgeText: '12 chuyến',
    },
    {
      id: 'hs-3',
      name: 'Khu Quán Ăn Sân Vườn',
      shortName: 'Quán Sân Vườn',
      direction: 'Phía Tây',
      distance: '800m',
      lat: centerLat + 0.0038,
      lng: centerLng - 0.0065,
      rentalCount: 9,
      revenue: '4.100.000 ₫',
      popularSpeaker: 'Loa Kéo Bass 40',
      peakHours: '19:00 - 23:00',
      color: '#3b82f6', // Blue
      radius: 260,
      badgeText: '9 chuyến',
    },
    {
      id: 'hs-4',
      name: 'Khu Biệt Thự / Tiệc Gia Đình',
      shortName: 'Khu Biệt Thự',
      direction: 'Phía Nam',
      distance: '1.5 km',
      lat: centerLat - 0.0080,
      lng: centerLng - 0.0040,
      rentalCount: 7,
      revenue: '3.200.000 ₫',
      popularSpeaker: 'Loa Đôi Bass 50',
      peakHours: '16:00 - 20:00',
      color: '#10b981', // Emerald
      radius: 240,
      badgeText: '7 chuyến',
    },
  ];

  const CUSTOMER_NAMES = [
    'Tuấn', 'Minh Trí', 'Anh Hoàng', 'Chị Lan', 'Hương Cau',
    'Anh Thành', 'Bảo', 'Đức Huy', 'Quốc Bảo', 'Chị Mai',
    'Anh Hùng', 'Văn Duy', 'Phúc', 'Ngọc', 'Tấn Phát',
    'Chị Phương', 'Khánh', 'Anh Long', 'Lộc Vừng', 'Thanh Hải'
  ];

  return list.map((hs, hsIdx) => {
    // Generate individual trip dots scattered naturally within the zone's circular area
    const tripDots = [];
    const radiusDeg = (hs.radius * 0.72) / 111000;
    for (let i = 0; i < hs.rentalCount; i++) {
      const angle = i * 2.39996 + (hs.id.charCodeAt(3) || 1);
      const r = Math.sqrt((i + 0.55) / hs.rentalCount) * radiusDeg;
      const dotLat = hs.lat + r * Math.cos(angle);
      const dotLng = hs.lng + (r * Math.sin(angle)) / Math.cos((hs.lat * Math.PI) / 180);
      const customerName = CUSTOMER_NAMES[(i + hsIdx * 4) % CUSTOMER_NAMES.length];
      tripDots.push({
        id: `${hs.id}-dot-${i + 1}`,
        tripNumber: i + 1,
        customerName: customerName,
        lat: dotLat,
        lng: dotLng,
        speaker: i % 2 === 0 ? hs.popularSpeaker : 'Loa Kéo Bass 40 (800W)',
        cost: i % 2 === 0 ? '600.000 ₫' : '450.000 ₫',
      });
    }
    return {
      ...hs,
      tripDots,
    };
  });
}

const userCurrentLocationIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 rounded-full bg-cyan-400/25 animate-ping"></div>
      <div class="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs border-2 border-slate-900 shadow-[0_4px_14px_rgba(0,0,0,0.35)] flex items-center justify-center p-1">
        <img src="/motorcycle.png" alt="Shipper" class="w-full h-full object-contain drop-shadow-xs" />
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Helper to create custom Hotspot Icon (showing "X chuyến")
function createHotspotIcon(hotspot, isSelected) {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center group cursor-pointer ${isSelected ? 'scale-110' : ''}">
        <div class="absolute w-8 h-8 rounded-full ${isSelected ? 'animate-ping opacity-90' : 'opacity-40'}" style="background-color: ${hotspot.color}"></div>
        <div class="px-2.5 py-1 rounded-full text-white font-black text-xs shadow-xl flex items-center gap-1 border-2 ${isSelected ? 'border-white ring-2 ring-slate-900' : 'border-white'} whitespace-nowrap" style="background-color: ${hotspot.color}">
          <span class="material-symbols-outlined text-[13px]">local_fire_department</span>
          <span>${hotspot.badgeText}</span>
        </div>
      </div>
    `,
    iconSize: [85, 32],
    iconAnchor: [42, 16],
  });
}

function MapBoundsController({ userCoords, hotspots, selectedHotspot }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (selectedHotspot) {
      map.flyTo([selectedHotspot.lat, selectedHotspot.lng], 15, { duration: 0.8 });
    } else if (userCoords) {
      if (hotspots && hotspots.length > 1) {
        const allPoints = [
          [userCoords.lat, userCoords.lng],
          ...hotspots.map((p) => [p.lat, p.lng]),
        ];
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14.5, animate: false });
      } else {
        // Standard wide city overview zoom level (14.5)
        map.setView([userCoords.lat, userCoords.lng], 14.5, { animate: false });
      }
    }
  }, [map, userCoords, hotspots, selectedHotspot]);
  return null;
}

export default function DashboardMiniMap({
  userCoords,
  hotspots = [],
  selectedHotspotId,
  onSelectHotspot,
  onRequestGPS,
  isLocating,
  onNavigateToTab,
}) {
  const [tileMode, setTileMode] = useState('street'); // 'street' | 'satellite'
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const selectedHotspot = hotspots.find((h) => h.id === selectedHotspotId);

  const handleCloseFullscreen = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 280);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded && !isClosing) {
        handleCloseFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, isClosing]);

  // 🚀 ULTRA-HD RETINA GOOGLE TILES (scale=2 prevents blur/pixelation on phones & retina screens)
  const tileUrl =
    tileMode === 'satellite'
      ? 'https://mt{s}.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}&scale=2'
      : 'https://mt{s}.google.com/vt/lyrs=m&hl=vi&gl=VN&x={x}&y={y}&z={z}&scale=2';

  const defaultCenter = userCoords ? [userCoords.lat, userCoords.lng] : [10.780, 106.698];

  return (
    <div className="w-full flex flex-col gap-3.5 bg-surface-container-lowest rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)]">
      {/* ══════════ 1. HEADER (CLEAN & SPACIOUS ON MOBILE) ══════════ */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
          Phân bố khu vực
        </h2>

        {/* Top Action Buttons (Compact on Mobile, Never Cut Text) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Vệ tinh / Đường phố Toggle */}
          <button
            onClick={() => setTileMode(tileMode === 'street' ? 'satellite' : 'street')}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl text-slate-700 bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            title="Chuyển chế độ xem bản đồ"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-700">
              {tileMode === 'street' ? 'satellite_alt' : 'map'}
            </span>
            <span className="hidden sm:inline">{tileMode === 'street' ? 'Vệ tinh' : 'Đường'}</span>
          </button>

          {/* Mở rộng Toàn màn hình */}
          <button
            onClick={() => setIsExpanded(true)}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl text-slate-700 bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            title="Mở rộng xem toàn màn hình"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-700">
              fullscreen
            </span>
            <span className="hidden sm:inline">Mở rộng</span>
          </button>
        </div>
      </div>

      {/* ══════════ 2. REAL CLUSTER BUTTONS (RENDER ONLY WHEN REAL TRIPS EXIST) ══════════ */}
      {hotspots && hotspots.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-2 w-full">
          {hotspots.map((hs) => {
            const isSelected = selectedHotspotId === hs.id;
            return (
              <button
                key={hs.id}
                onClick={() => onSelectHotspot && onSelectHotspot(hs.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-1.5 border shadow-xs ${isSelected
                  ? 'bg-slate-900 text-white border-slate-900 font-extrabold shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold'
                  }`}
                title="Bấm để trỏ tới điểm này trên bản đồ"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: hs.color }}
                  ></span>
                  <span className="font-bold truncate">
                    {hs.rentalCount} chuyến
                  </span>
                </div>
                <span className={`text-[11px] font-normal shrink-0 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  ~ {hs.distance}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ══════════ 3. MAP CANVAS WITH INDIVIDUAL TRIP DOTS IN EACH ZONE ══════════ */}
      <div className="w-full h-[400px] sm:h-[460px] lg:h-[490px] relative rounded-2xl overflow-hidden shadow-inner border border-slate-200/90">
        <MapContainer
          center={defaultCenter}
          zoom={14}
          zoomControl={false}
          scrollWheelZoom={true}
          preferCanvas={true}
          inertia={true}
          inertiaDeceleration={2000}
          inertiaMaxSpeed={3000}
          easeLinearity={0.15}
          zoomSnap={0.5}
          zoomDelta={0.5}
          wheelPxPerZoomLevel={100}
          attributionControl={false}
          className="w-full h-full z-0"
          style={{ minHeight: '100%', height: '100%', background: '#e2e8f0' }}
        >
          <MapBoundsController
            userCoords={userCoords}
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
          />

          <TileLayer
            url={tileUrl}
            maxZoom={22}
            maxNativeZoom={20}
            subdomains={['0', '1', '2', '3']}
            keepBuffer={10}
            updateWhenIdle={false}
            updateWhenZooming={false}
          />

          {/* Connecting line from user to selected hotspot */}
          {userCoords && selectedHotspot && (
            <Polyline
              positions={[
                [userCoords.lat, userCoords.lng],
                [selectedHotspot.lat, selectedHotspot.lng],
              ]}
              pathOptions={{
                color: selectedHotspot.color,
                weight: 3.5,
                opacity: 0.85,
                dashArray: '6, 6',
              }}
            />
          )}

          {/* User Current / Warehouse GPS Marker */}
          {userCoords && (
            <Marker position={[userCoords.lat, userCoords.lng]} icon={userCurrentLocationIcon}>
              <Popup closeButton={false} className="custom-compact-popup">
                <div className="py-0.5 px-2 text-center">
                  <span className="font-bold text-slate-900 text-xs whitespace-nowrap">Vị trí của bạn</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Hotspot Circles & Markers around user */}
          {hotspots.map((hotspot) => {
            const isSelected = selectedHotspotId === hotspot.id;
            return (
              <React.Fragment key={hotspot.id}>
                {/* Zone Circle Boundary */}
                <Circle
                  center={[hotspot.lat, hotspot.lng]}
                  radius={hotspot.radius}
                  pathOptions={{
                    color: hotspot.color,
                    fillColor: hotspot.color,
                    fillOpacity: isSelected ? 0.30 : 0.15,
                    weight: isSelected ? 3 : 1.5,
                    dashArray: '4, 4',
                  }}
                  eventHandlers={{
                    click: () => {
                      if (onSelectHotspot) onSelectHotspot(hotspot.id);
                    },
                  }}
                >
                  <Popup closeButton={false} className="custom-compact-popup">
                    <div className="py-0.5 px-2 text-center">
                      <span className="font-extrabold text-slate-900 text-xs whitespace-nowrap">
                        {hotspot.rentalCount} chuyến
                      </span>
                    </div>
                  </Popup>
                </Circle>

                {/* Individual Trip Dots inside this zone (Mỗi chấm = 1 chuyến đã thuê) */}
                {hotspot.tripDots &&
                  hotspot.tripDots.map((dot) => (
                    <CircleMarker
                      key={dot.id}
                      center={[dot.lat, dot.lng]}
                      radius={isSelected ? 6 : 5}
                      pathOptions={{
                        color: '#ffffff',
                        weight: 2,
                        fillColor: hotspot.color,
                        fillOpacity: isSelected ? 1 : 0.9,
                      }}
                      eventHandlers={{
                        click: () => {
                          if (onSelectHotspot) onSelectHotspot(hotspot.id);
                        },
                      }}
                    >
                      <Popup closeButton={false} className="custom-compact-popup">
                        <div className="py-0.5 px-1.5 text-center min-w-[30px]">
                          <span className="text-xs font-bold text-slate-900 leading-none whitespace-nowrap">
                            {dot.customerName}
                          </span>
                        </div>
                      </Popup>
                      <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                        <div className="text-[11px] font-bold text-slate-900 whitespace-nowrap">
                          {dot.customerName}
                        </div>
                      </Tooltip>
                    </CircleMarker>
                  ))}
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating In-Map GPS Recenter Button */}
        <div className="absolute bottom-3 right-3 z-[400] flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={() => {
              if (onSelectHotspot) onSelectHotspot(null);
              if (onRequestGPS) onRequestGPS();
            }}
            disabled={isLocating}
            className="w-11 h-11 rounded-2xl bg-white/95 hover:bg-white text-slate-900 shadow-xl border border-slate-200/90 flex items-center justify-center backdrop-blur-md active:scale-95 transition-all cursor-pointer group"
            title="Căn giữa vị trí của bạn"
          >
            <span className={`material-symbols-outlined text-[22px] text-slate-800 group-hover:scale-110 transition-transform ${isLocating ? 'animate-spin' : ''}`}>
              {isLocating ? 'sync' : 'my_location'}
            </span>
          </button>
        </div>
      </div>

      {/* ══════════ 4. FULLSCREEN MAP MODAL (PORTAL TO BODY WITH SMOOTH ANIMATION) ══════════ */}
      {isExpanded &&
        createPortal(
          <div
            className={`fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${
              isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in'
            }`}
          >
            {/* Floating Close Button in Top Right with Slide & Scale Animation */}
            <button
              onClick={handleCloseFullscreen}
              className={`absolute top-4 right-4 z-[99999] w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-90 border border-white/20 hover:border-white/40 ${
                isClosing
                  ? 'scale-75 opacity-0'
                  : 'scale-100 opacity-100 animate-in zoom-in-75 slide-in-from-top-2 duration-300'
              }`}
              title="Đóng toàn màn hình (Esc)"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {/* Fullscreen Edge-to-Edge Map Canvas with Smooth Scale/Zoom Transition */}
            <div
              className={`w-full h-full relative bg-slate-900 overflow-hidden transition-all duration-300 ease-out transform ${
                isClosing
                  ? 'scale-90 opacity-0 rounded-[40px]'
                  : 'scale-100 opacity-100 rounded-none animate-in zoom-in-95 duration-300'
              }`}
            >
              <MapContainer
                center={defaultCenter}
                zoom={15}
                zoomControl={false}
                scrollWheelZoom={true}
                preferCanvas={true}
                inertia={true}
                inertiaDeceleration={2000}
                inertiaMaxSpeed={3000}
                easeLinearity={0.15}
                zoomSnap={0.5}
                zoomDelta={0.5}
                wheelPxPerZoomLevel={100}
                attributionControl={false}
                className="w-full h-full z-0"
                style={{ width: '100vw', height: '100vh' }}
              >
                  <MapBoundsController
                    userCoords={userCoords}
                    hotspots={hotspots}
                    selectedHotspot={selectedHotspot}
                  />

                  <TileLayer
                    url={tileUrl}
                    maxZoom={22}
                    maxNativeZoom={20}
                    subdomains={['0', '1', '2', '3']}
                    keepBuffer={12}
                    updateWhenIdle={false}
                    updateWhenZooming={false}
                  />

                  {/* Connecting line */}
                  {userCoords && selectedHotspot && (
                    <Polyline
                      positions={[
                        [userCoords.lat, userCoords.lng],
                        [selectedHotspot.lat, selectedHotspot.lng],
                      ]}
                      pathOptions={{
                        color: selectedHotspot.color,
                        weight: 4,
                        opacity: 0.9,
                        dashArray: '6, 6',
                      }}
                    />
                  )}

                  {/* User Current Marker */}
                  {userCoords && (
                    <Marker position={[userCoords.lat, userCoords.lng]} icon={userCurrentLocationIcon}>
                      <Popup closeButton={false}>
                        <div className="py-0.5 px-2 text-center">
                          <span className="font-bold text-slate-900 text-xs">Vị trí của bạn</span>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Hotspots */}
                  {hotspots.map((hotspot) => {
                    const isSelected = selectedHotspotId === hotspot.id;
                    return (
                      <React.Fragment key={hotspot.id}>
                        <Circle
                          center={[hotspot.lat, hotspot.lng]}
                          radius={hotspot.radius}
                          pathOptions={{
                            color: hotspot.color,
                            fillColor: hotspot.color,
                            fillOpacity: isSelected ? 0.35 : 0.2,
                            weight: isSelected ? 3 : 2,
                            dashArray: '4, 4',
                          }}
                        />
                        {hotspot.tripDots?.map((dot) => (
                          <CircleMarker
                            key={dot.id}
                            center={[dot.lat, dot.lng]}
                            radius={6}
                            pathOptions={{
                              color: '#ffffff',
                              weight: 2,
                              fillColor: hotspot.color,
                              fillOpacity: 1,
                            }}
                          >
                            <Popup closeButton={false}>
                              <div className="py-0.5 px-1.5 text-center">
                                <span className="text-xs font-bold text-slate-900">
                                  {dot.customerName}
                                </span>
                              </div>
                            </Popup>
                            <Tooltip direction="top" offset={[0, -6]} permanent opacity={0.9}>
                              <div className="text-[11px] font-bold text-slate-900">
                                {dot.customerName}
                              </div>
                            </Tooltip>
                          </CircleMarker>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </MapContainer>
              </div>
          </div>,
          document.body
        )}
    </div>
  );
}
