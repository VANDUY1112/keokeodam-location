import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper component for map controls (re-center & fit-bounds)
function MapController({ position, pathCoordinates, isTracking, recenterTrigger }) {
  const map = useMap();
  const hasCenteredInitial = useRef(false);

  useEffect(() => {
    if (!position || !map) return;

    if (!hasCenteredInitial.current) {
      map.setView([position.lat, position.lng], 18, { animate: true });
      hasCenteredInitial.current = true;
    } else if (isTracking) {
      map.panTo([position.lat, position.lng], { animate: true, duration: 1 });
    }
  }, [position, isTracking, map]);

  // Recenter on demand when user clicks "My Location" button
  useEffect(() => {
    if (recenterTrigger && position && map) {
      map.setView([position.lat, position.lng], 18.5, { animate: true });
    }
  }, [recenterTrigger, position, map]);

  useEffect(() => {
    if (pathCoordinates.length > 2 && !isTracking && map) {
      const bounds = L.latLngBounds(pathCoordinates.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [pathCoordinates, isTracking, map]);

  return null;
}

// Custom Leaflet DivIcons
const createStartIcon = () =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-emerald-400/40 animate-ping"></div>
        <div class="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold">
          <span class="material-symbols-outlined text-[16px]">trip_origin</span>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const createEndIcon = () =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-rose-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
          <span class="material-symbols-outlined text-[18px]">sports_score</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

const createCurrentIcon = () =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 rounded-full bg-cyan-400/30 animate-pulse"></div>
        <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-300 shadow-2xl flex items-center justify-center text-cyan-300">
          <span class="material-symbols-outlined text-[18px]">navigation</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

// Map Tile Options (Large, high-contrast Vietnamese text labels)
export const MAP_LAYERS = {
  googleHybrid: {
    id: 'googleHybrid',
    name: 'Vệ Tinh',
    url: 'https://mt1.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}',
    maxZoom: 22,
    maxNativeZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  darkMuted: {
    id: 'darkMuted',
    name: 'Bản Đồ Đêm',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    maxZoom: 20,
    maxNativeZoom: 19,
    subdomains: 'abcd',
  },
  googleStreets: {
    id: 'googleStreets',
    name: 'Đường Phố',
    url: 'https://mt1.google.com/vt/lyrs=m&hl=vi&gl=VN&x={x}&y={y}&z={z}',
    maxZoom: 22,
    maxNativeZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
};

export default function LiveRouteMap({
  currentPosition,
  startPosition,
  endPosition,
  pathCoordinates = [],
  isTracking = false,
  originAddress = 'Điểm định vị GPS',
  destinationAddress = 'Đang di chuyển...',
  readOnly = false,
  selectedLayer: propSelectedLayer,
  recenterTrigger: propRecenterTrigger,
  showInternalControls = false,
}) {
  const [internalSelectedLayer, setInternalSelectedLayer] = useState('googleHybrid');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [internalRecenterTrigger, setInternalRecenterTrigger] = useState(0);

  const selectedLayer = propSelectedLayer !== undefined ? propSelectedLayer : internalSelectedLayer;
  const recenterTrigger = propRecenterTrigger !== undefined ? propRecenterTrigger : internalRecenterTrigger;

  const defaultCenter = [10.7769, 106.7009];
  const center = currentPosition
    ? [currentPosition.lat, currentPosition.lng]
    : startPosition
    ? [startPosition.lat, startPosition.lng]
    : defaultCenter;

  const polylinePositions = pathCoordinates.map((p) => [p.lat, p.lng]);
  const activeLayerConfig = MAP_LAYERS[selectedLayer] || MAP_LAYERS.googleHybrid;

  return (
    <div className="w-full h-full relative overflow-hidden">
      <MapContainer
        center={center}
        zoom={18}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[480px] z-0"
        attributionControl={false}
      >
        {/* Active Map Tile Layer (Retina HD High Res) */}
        <TileLayer
          key={selectedLayer}
          url={activeLayerConfig.url}
          maxZoom={activeLayerConfig.maxZoom}
          maxNativeZoom={activeLayerConfig.maxNativeZoom}
          subdomains={activeLayerConfig.subdomains}
        />

        {/* Dynamic Route Polyline */}
        {polylinePositions.length > 1 && (
          <>
            {/* Outer Glow Line */}
            <Polyline
              positions={polylinePositions}
              pathOptions={{
                color: '#06b6d4',
                weight: 8,
                opacity: 0.6,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Core Solid Bright Line */}
            <Polyline
              positions={polylinePositions}
              pathOptions={{
                color: '#ffffff',
                weight: 4,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: isTracking ? '2, 6' : undefined,
              }}
            />
          </>
        )}

        {/* Start Point Marker */}
        {startPosition && (
          <Marker position={[startPosition.lat, startPosition.lng]} icon={createStartIcon()}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-xs">
                <div className="font-bold text-emerald-600">Điểm Bắt Đầu</div>
                <div className="text-slate-700 mt-0.5">{originAddress}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* End Point Marker */}
        {endPosition && (
          <Marker position={[endPosition.lat, endPosition.lng]} icon={createEndIcon()}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-xs">
                <div className="font-bold text-rose-600">Điểm Kết Thúc</div>
                <div className="text-slate-700 mt-0.5">{destinationAddress}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Current Live Moving Marker */}
        {currentPosition && isTracking && (
          <Marker position={[currentPosition.lat, currentPosition.lng]} icon={createCurrentIcon()}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-xs">
                <div className="font-bold text-cyan-700">Vị trí hiện tại</div>
                <div className="text-slate-600 mt-0.5">Tín hiệu GPS trực tiếp</div>
              </div>
            </Popup>
          </Marker>
        )}

        <MapController
          position={currentPosition || startPosition}
          pathCoordinates={pathCoordinates}
          isTracking={isTracking}
          recenterTrigger={recenterTrigger}
        />
      </MapContainer>

      {/* ══════════ FLOATING CONTROLS: RECENTER & LAYER SWITCHER (OPTIONAL INTERNAL) ══════════ */}
      {showInternalControls && (
        <div className="absolute top-4 right-4 z-[400] pointer-events-auto flex items-center gap-2">
          {/* Nút Căn Giữa Vị Trí Hiện Tại (My Location / Recenter) */}
          <button
            type="button"
            title="Căn giữa vị trí của tôi"
            onClick={() => setInternalRecenterTrigger((t) => t + 1)}
            className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-white text-slate-700 flex items-center justify-center backdrop-blur-md border border-slate-200/90 shadow-xl transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
              my_location
            </span>
          </button>

          {/* Map Layer Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-xl transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-700">satellite_alt</span>
              <span>{activeLayerConfig.name}</span>
              <span className={`material-symbols-outlined text-[16px] text-slate-500 transition-transform duration-200 ${showLayerMenu ? 'rotate-180 text-slate-900' : ''}`}>
                expand_more
              </span>
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-48 sm:w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 transition-all duration-200 ease-out origin-top-right ${
                showLayerMenu
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
              }`}
            >
              {Object.values(MAP_LAYERS).map((layer) => {
                const isSelected = layer.id === selectedLayer;
                return (
                  <button
                    key={layer.id}
                    onClick={() => {
                      setInternalSelectedLayer(layer.id);
                      setTimeout(() => setShowLayerMenu(false), 120);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm transition-all duration-200 ease-out active:scale-95 group ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-xs translate-x-0.5'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 hover:translate-x-1 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          isSelected
                            ? 'bg-white scale-100'
                            : 'bg-slate-300 group-hover:bg-slate-600 scale-75 group-hover:scale-100'
                        }`}
                      ></span>
                      <span>{layer.name}</span>
                    </span>
                    <span
                      className={`material-symbols-outlined text-[16px] transition-all duration-200 ${
                        isSelected
                          ? 'text-white scale-100 opacity-100'
                          : 'scale-0 opacity-0 text-transparent'
                      }`}
                    >
                      check
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
