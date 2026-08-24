import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { formatVND } from '../utils/format';

// Warehouse / Store central icon
const warehouseIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 rounded-full bg-slate-900/20 animate-ping"></div>
      <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] flex items-center justify-center text-white">
        <span class="material-symbols-outlined text-[20px]">storefront</span>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Helper to create real Customer Rental marker pin
function createCustomerMarkerIcon(rental, isSelected) {
  const isRenting = rental.status === 'active' || rental.status === 'Đang thuê';
  const bgColor = isRenting ? '#f59e0b' : '#10b981'; // Amber for active, Emerald for completed

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center group cursor-pointer transition-transform ${isSelected ? 'scale-110' : 'hover:scale-105'}">
        <div class="absolute w-7 h-7 rounded-full ${isSelected ? 'animate-ping opacity-80' : 'opacity-30'}" style="background-color: ${bgColor}"></div>
        <div class="px-2.5 py-1 rounded-full text-white font-bold text-xs shadow-lg flex items-center gap-1 border-2 border-white" style="background-color: ${bgColor}">
          <span class="material-symbols-outlined text-[13px]">${isRenting ? 'speaker' : 'check_circle'}</span>
          <span class="max-w-[110px] truncate">${rental.customerName || rental.title || 'Đơn thuê'}</span>
        </div>
      </div>
    `,
    iconSize: [110, 30],
    iconAnchor: [55, 15],
  });
}

function MapBoundsController({ userCoords, rentals, selectedRental }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (selectedRental && selectedRental.destLat && selectedRental.destLng) {
      map.flyTo([selectedRental.destLat, selectedRental.destLng], 16, { duration: 0.8 });
    } else if (rentals && rentals.length > 0) {
      const validPoints = rentals
        .filter(r => (r.destLat && r.destLng) || (r.lat && r.lng) || (r.endPosition?.lat && r.endPosition?.lng))
        .map(r => [r.destLat || r.lat || r.endPosition.lat, r.destLng || r.lng || r.endPosition.lng]);

      if (userCoords) validPoints.push([userCoords.lat, userCoords.lng]);

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [50, 50], animate: true, maxZoom: 16 });
      }
    } else if (userCoords) {
      map.setView([userCoords.lat, userCoords.lng], 15);
    }
  }, [map, userCoords, rentals, selectedRental]);
  return null;
}

export default function DashboardMiniMap({
  userCoords,
  rentals = [],
  onRequestGPS,
  isLocating,
  onNavigateToTab,
}) {
  const [tileMode, setTileMode] = useState('street'); // 'street' | 'satellite'
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'completed'

  const tileUrl =
    tileMode === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&hl=vi&gl=VN&x={x}&y={y}&z={z}';

  const defaultCenter = userCoords ? [userCoords.lat, userCoords.lng] : [10.7769, 106.7009];

  // Filter rentals with valid coordinates
  const validRentals = rentals.filter(r => {
    const lat = r.destLat || r.lat || r.endPosition?.lat;
    const lng = r.destLng || r.lng || r.endPosition?.lng;
    return typeof lat === 'number' && typeof lng === 'number';
  }).map(r => ({
    ...r,
    destLat: r.destLat || r.lat || r.endPosition?.lat,
    destLng: r.destLng || r.lng || r.endPosition?.lng,
  }));

  const filteredRentals = validRentals.filter(r => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return r.status === 'active' || r.status === 'Đang thuê';
    if (filterStatus === 'completed') return r.status === 'completed' || r.status === 'Hoàn thành' || r.status === 'Đã bàn giao';
    return true;
  });

  const selectedRental = filteredRentals.find(r => r.id === selectedRentalId) || null;

  return (
    <div className="w-full flex flex-col gap-3.5 bg-surface-container-lowest rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)]">
      {/* ══════════ 1. HEADER & CONTROLS ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
            Bản Đồ Điểm Giao Loa Thực Tế
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            {validRentals.length} điểm
          </span>
        </div>

        {/* Map View Controls */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          {/* Lấy GPS Button */}
          <button
            onClick={onRequestGPS}
            disabled={isLocating}
            className="col-span-1 px-3 py-2 text-xs font-bold rounded-xl text-slate-800 bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            title="Cập nhật vị trí GPS thiết bị của bạn"
          >
            <span className={`material-symbols-outlined text-[16px] text-slate-700 ${isLocating ? 'animate-spin' : ''}`}>
              {isLocating ? 'sync' : 'my_location'}
            </span>
            <span className="truncate">{isLocating ? 'Đang tìm...' : 'Lấy GPS'}</span>
          </button>

          {/* Vệ tinh / Đường phố */}
          <button
            onClick={() => setTileMode(tileMode === 'street' ? 'satellite' : 'street')}
            className="col-span-1 px-3 py-2 text-xs font-bold rounded-xl text-slate-700 bg-white shadow-xs border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            title="Chuyển chế độ xem bản đồ"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-700">
              {tileMode === 'street' ? 'satellite_alt' : 'map'}
            </span>
            <span className="truncate">{tileMode === 'street' ? 'Vệ tinh' : 'Đường'}</span>
          </button>
        </div>
      </div>

      {/* ══════════ 2. REAL ORDERS PILL TABS (IF ANY REAL RENTALS) ══════════ */}
      {validRentals.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => { setFilterStatus('all'); setSelectedRentalId(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${filterStatus === 'all' && !selectedRentalId
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
          >
            Tất cả ({validRentals.length})
          </button>

          {validRentals.map((r) => {
            const isSelected = selectedRentalId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRentalId(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 whitespace-nowrap border shadow-xs ${isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-extrabold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${r.status === 'active' || r.status === 'Đang thuê' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className="truncate">{r.customerName || r.title || `Đơn #${r.id}`}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ══════════ 3. MAP CANVAS WITH REAL DELIVERY PINS ══════════ */}
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
            rentals={filteredRentals}
            selectedRental={selectedRental}
          />

          <TileLayer
            url={tileUrl}
            maxZoom={22}
            maxNativeZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />

          {/* User / Warehouse GPS Marker */}
          {userCoords && (
            <Marker position={[userCoords.lat, userCoords.lng]} icon={warehouseIcon} />
          )}

          {/* Lines connecting warehouse to real rental destinations */}
          {userCoords && filteredRentals.map((r) => (
            <Polyline
              key={`line-${r.id}`}
              positions={[
                [userCoords.lat, userCoords.lng],
                [r.destLat, r.destLng],
              ]}
              pathOptions={{
                color: r.id === selectedRentalId ? '#2563eb' : (r.status === 'active' || r.status === 'Đang thuê' ? '#f59e0b' : '#10b981'),
                weight: r.id === selectedRentalId ? 3.5 : 2,
                opacity: r.id === selectedRentalId ? 0.9 : 0.45,
                dashArray: '5, 5',
              }}
            />
          ))}

          {/* Real Rental Markers */}
          {filteredRentals.map((r) => {
            const isSelected = selectedRentalId === r.id;
            return (
              <Marker
                key={r.id}
                position={[r.destLat, r.destLng]}
                icon={createCustomerMarkerIcon(r, isSelected)}
                eventHandlers={{
                  click: () => setSelectedRentalId(r.id),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 mb-1.5">
                      <span className="font-bold text-sm text-slate-900">{r.customerName || r.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'active' || r.status === 'Đang thuê' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {r.status || 'Hoàn thành'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      {r.speakerName && <div>🔊 <b>Loa:</b> {r.speakerName}</div>}
                      {r.address && <div>📍 <b>Đ/c:</b> {r.address}</div>}
                      {r.cost && <div>💰 <b>Thu:</b> {formatVND(r.cost)}</div>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
