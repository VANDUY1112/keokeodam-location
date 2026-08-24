import React, { useState, useEffect } from 'react';
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
      map.flyTo([selectedHotspot.lat, selectedHotspot.lng], 15.5, { duration: 0.8 });
    } else if (userCoords) {
      const allPoints = [
        [userCoords.lat, userCoords.lng],
        ...hotspots.map((p) => [p.lat, p.lng]),
      ];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50], animate: false });
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
  const selectedHotspot = hotspots.find((h) => h.id === selectedHotspotId);

  const tileUrl =
    tileMode === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&hl=vi&gl=VN&x={x}&y={y}&z={z}';

  const defaultCenter = userCoords ? [userCoords.lat, userCoords.lng] : [10.780, 106.698];

  return (
    <div className="w-full flex flex-col gap-3.5 bg-surface-container-lowest rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)]">
      {/* ══════════ 1. HEADER & FULL-LINE CONTROLS (NO WRAPPER BACKGROUND) ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-[16px] sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
          Phân Bố Khách Thuê Loa Trọng Điểm
        </h2>

        {/* Full-line Controls without wrapper background */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* Tâm GPS Button */}
          <button
            onClick={() => onSelectHotspot && onSelectHotspot(null)}
            className={`col-span-1 px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs border ${
              selectedHotspotId === null
                ? 'bg-slate-900 text-white border-slate-900 font-extrabold'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
            }`}
            title="Căn bản đồ về Tâm vị trí GPS của bạn"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${selectedHotspotId === null ? 'bg-white' : 'bg-slate-400'}`}></span>
            <span className="truncate">Tâm</span>
          </button>

          {/* Lấy GPS Button */}
          <button
            onClick={onRequestGPS}
            disabled={isLocating}
            className="col-span-1 px-3 py-2 text-xs font-bold rounded-xl text-slate-800 bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            title="Lấy lại GPS vị trí bạn đang đứng"
          >
            <span className={`material-symbols-outlined text-[16px] text-slate-700 ${isLocating ? 'animate-spin' : ''}`}>
              {isLocating ? 'sync' : 'my_location'}
            </span>
            <span className="truncate">{isLocating ? 'Đang tìm...' : 'Lấy GPS'}</span>
          </button>

          {/* Vệ tinh / Đường phố */}
          <button
            onClick={() => setTileMode(tileMode === 'street' ? 'satellite' : 'street')}
            className="col-span-1 px-3 py-2 text-xs font-bold rounded-xl text-slate-700 bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            title="Chuyển chế độ xem bản đồ"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-700">
              {tileMode === 'street' ? 'satellite_alt' : 'map'}
            </span>
            <span className="truncate">{tileMode === 'street' ? 'Vệ tinh' : 'Đường'}</span>
          </button>
        </div>
      </div>

      {/* ══════════ 2. 4-HOTSPOT BUTTONS (FULL LINE, NO WRAPPER BACKGROUND) ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-2 w-full">
        {hotspots.map((hs) => {
          const isSelected = selectedHotspotId === hs.id;
          return (
            <button
              key={hs.id}
              onClick={() => onSelectHotspot && onSelectHotspot(hs.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-1.5 border shadow-xs ${
                isSelected
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

      {/* ══════════ 3. MAP CANVAS WITH INDIVIDUAL TRIP DOTS IN EACH ZONE ══════════ */}
      <div className="w-full h-[400px] sm:h-[460px] lg:h-[490px] relative rounded-2xl overflow-hidden shadow-inner border border-slate-200/90">
        <MapContainer
          center={defaultCenter}
          zoom={14}
          zoomControl={false}
          scrollWheelZoom={false}
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
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
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
              <Popup>
                <div className="p-1.5 text-xs">
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <span>📍</span> Vị Trí Của Bạn (Tâm GPS)
                  </p>
                  <p className="text-slate-600 mt-1">Điểm xuất phát chở loa</p>
                  <p className="text-slate-400 text-[10.5px]">
                    Tọa độ: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
                  </p>
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
                  <Popup>
                    <div className="p-1.5 text-xs max-w-[220px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: hotspot.color }}></span>
                        <span className="truncate">{hotspot.name}</span>
                      </div>
                      <div className="space-y-1 text-slate-600">
                        <p>📏 <strong>Khoảng cách:</strong> <span className="font-bold text-slate-900">~ {hotspot.distance} ({hotspot.direction})</span></p>
                        <p>🔥 <strong>Mật độ thuê:</strong> <span className="font-bold text-slate-900">{hotspot.rentalCount} chuyến ({hotspot.tripDots?.length || 0} điểm giao)</span></p>
                        <p>💰 <strong>Tổng thu:</strong> <span className="font-bold text-emerald-600">{hotspot.revenue}</span></p>
                        <p>🔊 <strong>Loa chuộng:</strong> {hotspot.popularSpeaker}</p>
                        <p className="text-[10.5px] text-slate-400 mt-1">⏰ Giờ cao điểm: {hotspot.peakHours}</p>
                      </div>
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
                      <Popup>
                        <div className="py-0.5 px-1.5 text-center min-w-[40px]">
                          <span className="text-xs font-black text-slate-900 leading-none whitespace-nowrap">
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
      </div>
    </div>
  );
}
