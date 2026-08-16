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
      map.setView([position.lat, position.lng], 16, { animate: true });
      hasCenteredInitial.current = true;
    } else if (isTracking) {
      map.panTo([position.lat, position.lng], { animate: true, duration: 1 });
    }
  }, [position, isTracking, map]);

  // Recenter on demand when user clicks "My Location" button
  useEffect(() => {
    if (recenterTrigger && position && map) {
      map.setView([position.lat, position.lng], 17, { animate: true });
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

// Map Tile Options
const MAP_LAYERS = {
  googleHybrid: {
    id: 'googleHybrid',
    name: 'Vệ Tinh Google',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  darkMuted: {
    id: 'darkMuted',
    name: 'Bản Đồ Đêm (Dịu Mắt)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    maxZoom: 19,
    subdomains: 'abcd',
  },
  googleStreets: {
    id: 'googleStreets',
    name: 'Đường Phố Google',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 20,
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
}) {
  const [selectedLayer, setSelectedLayer] = useState('googleHybrid');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const defaultCenter = [10.7769, 106.7009];
  const center = currentPosition
    ? [currentPosition.lat, currentPosition.lng]
    : startPosition
    ? [startPosition.lat, startPosition.lng]
    : defaultCenter;

  const polylinePositions = pathCoordinates.map((p) => [p.lat, p.lng]);
  const activeLayerConfig = MAP_LAYERS[selectedLayer] || MAP_LAYERS.googleHybrid;

  return (
    <div className="w-full h-full relative rounded-[2rem] overflow-hidden">
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[480px] z-0"
        attributionControl={false}
      >
        {/* Active Map Tile Layer */}
        <TileLayer
          key={selectedLayer}
          url={activeLayerConfig.url}
          maxZoom={activeLayerConfig.maxZoom}
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

      {/* ══════════ FLOATING CONTROLS: RECENTER & LAYER SWITCHER (TOP RIGHT) ══════════ */}
      <div className="absolute top-4 right-4 z-[400] pointer-events-auto flex items-center gap-2">
        {/* Nút Căn Giữa Vị Trí Hiện Tại (My Location / Recenter) */}
        <button
          type="button"
          title="Căn giữa vị trí của tôi"
          onClick={() => setRecenterTrigger((t) => t + 1)}
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
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/95 hover:bg-white text-slate-700 text-xs font-semibold backdrop-blur-md border border-slate-200/90 shadow-xl transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-700">layers</span>
            <span>{activeLayerConfig.name}</span>
            <span className={`material-symbols-outlined text-[16px] text-slate-500 transition-transform ${showLayerMenu ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              {Object.values(MAP_LAYERS).map((layer) => {
                const isSelected = layer.id === selectedLayer;
                return (
                  <button
                    key={layer.id}
                    onClick={() => {
                      setSelectedLayer(layer.id);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200/80 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{layer.name}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-slate-900 font-bold">check</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
