import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// HCM Sample route coordinates from Warehouse to 128 Dien Bien Phu
const SAMPLE_ROUTE = [
  { lat: 10.7769, lng: 106.7009 }, // Kho Loa Kẹo Kéo (Quận 1)
  { lat: 10.7812, lng: 106.6985 },
  { lat: 10.7865, lng: 106.6952 },
  { lat: 10.7901, lng: 106.6970 },
  { lat: 10.7942, lng: 106.7015 }, // Điểm giao: 128 Điện Biên Phủ (Bình Thạnh)
];

const WAREHOUSE_POS = SAMPLE_ROUTE[0];
const DESTINATION_POS = SAMPLE_ROUTE[SAMPLE_ROUTE.length - 1];
const SHIPPER_POS = SAMPLE_ROUTE[3]; // Currently at step 3

// Custom DivIcons
const warehouseIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold">
        <span class="material-symbols-outlined text-[16px]">warehouse</span>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const shipperIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></div>
      <div class="w-9 h-9 rounded-full bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-white">
        <span class="material-symbols-outlined text-[18px]">two_wheeler</span>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const destinationIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-10 h-10 rounded-full bg-rose-500/30 animate-pulse"></div>
      <div class="w-9 h-9 rounded-full bg-rose-600 border-2 border-white shadow-2xl flex items-center justify-center text-white">
        <span class="material-symbols-outlined text-[18px]">location_on</span>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 32],
});

function MapBoundsController() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const bounds = L.latLngBounds(SAMPLE_ROUTE.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], animate: false });
  }, [map]);
  return null;
}

export default function DashboardMiniMap({ onNavigateToTracking }) {
  const [tileMode, setTileMode] = useState('street'); // 'street' | 'satellite'

  const tileUrl =
    tileMode === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&hl=vi&gl=VN&x={x}&y={y}&z={z}';

  return (
    <div className="w-full h-full min-h-[320px] lg:min-h-[360px] relative rounded-2xl overflow-hidden shadow-inner border border-slate-200/90 group">
      {/* ─── Leaflet Map Container ─── */}
      <MapContainer
        center={[10.785, 106.698]}
        zoom={16}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
        className="w-full h-full z-0"
        style={{ minHeight: '320px', height: '100%', background: '#e2e8f0' }}
      >
        <MapBoundsController />
        <TileLayer
          url={tileUrl}
          maxZoom={22}
          maxNativeZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />

        {/* Route Line Glow (Background) */}
        <Polyline
          positions={SAMPLE_ROUTE.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: '#38bdf8',
            weight: 8,
            opacity: 0.5,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        {/* Route Line Main (Foreground) */}
        <Polyline
          positions={SAMPLE_ROUTE.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: '#0284c7',
            weight: 5,
            opacity: 0.9,
            dashArray: '8, 8',
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        {/* Warehouse Marker */}
        <Marker position={[WAREHOUSE_POS.lat, WAREHOUSE_POS.lng]} icon={warehouseIcon}>
          <Popup>
            <div className="p-1 text-xs">
              <p className="font-bold text-slate-900">Kho Loa Kẹo Kéo Express</p>
              <p className="text-slate-500">Điểm xuất phát giao hàng</p>
            </div>
          </Popup>
        </Marker>

        {/* Shipper Marker */}
        <Marker position={[SHIPPER_POS.lat, SHIPPER_POS.lng]} icon={shipperIcon}>
          <Popup>
            <div className="p-1 text-xs">
              <p className="font-bold text-blue-700">🛵 Xe Giao Loa Đang Chạy</p>
              <p className="text-slate-600">Vận tốc: 35 km/h • Đang đến gần</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={[DESTINATION_POS.lat, DESTINATION_POS.lng]} icon={destinationIcon}>
          <Popup>
            <div className="p-1 text-xs">
              <p className="font-bold text-rose-700">📍 Tiệc Tân Gia - Anh Nam</p>
              <p className="text-slate-600">128 Điện Biên Phủ, P.15, Bình Thạnh</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* ─── Top Map Controls Overlay ─── */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/80">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTileMode(tileMode === 'street' ? 'satellite' : 'street');
          }}
          className="px-2.5 py-1 text-xs font-bold rounded-lg text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1"
          title="Chuyển chế độ xem bản đồ"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            {tileMode === 'street' ? 'satellite_alt' : 'map'}
          </span>
          <span>{tileMode === 'street' ? 'Vệ tinh' : 'Đường phố'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigateToTracking && onNavigateToTracking();
          }}
          className="p-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center"
          title="Mở toàn màn hình theo dõi"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_full</span>
        </button>
      </div>
    </div>
  );
}
