import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Click listener to fine-tune exact position on map
function MapClickHandler({ onSelectPosition, isTracking }) {
  useMapEvents({
    click(e) {
      if (!isTracking && onSelectPosition) {
        onSelectPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

// Helper component for map controls (re-center & fit-bounds)
function MapController({ position, startPosition, endPosition, pathCoordinates = [], isTracking, recenterTrigger, readOnly }) {
  const map = useMap();
  const lastPanRef = useRef(0);

  // Invalidate map size so it renders accurately inside modals
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!map) return;

    if (isTracking && position && typeof position.lat === 'number' && typeof position.lng === 'number') {
      const now = performance.now();
      // Throttle camera pan to every 150ms for buttery-smooth follow
      if (now - lastPanRef.current > 150) {
        lastPanRef.current = now;
        map.panTo([position.lat, position.lng], { animate: true, duration: 0.25 });
      }
      return;
    }

    // Collect all actual GPS coordinates of this trip for static bounds
    const allPoints = [
      ...(pathCoordinates || []),
      ...(position ? [position] : []),
      ...(startPosition ? [startPosition] : []),
      ...(endPosition ? [endPosition] : [])
    ].filter((p) => p && typeof p.lat === 'number' && typeof p.lng === 'number');

    if (allPoints.length >= 2 && !isTracking) {
      const bounds = L.latLngBounds(allPoints.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18, animate: true });
    } else if (allPoints.length === 1 && !isTracking) {
      map.setView([allPoints[0].lat, allPoints[0].lng], 18, { animate: true });
    } else if (position && !isTracking) {
      map.setView([position.lat, position.lng], 18, { animate: true });
    }
  }, [position, startPosition, endPosition, pathCoordinates, isTracking, map, readOnly]);

  // Recenter on demand when user clicks "My Location" button
  useEffect(() => {
    if (recenterTrigger && (position || startPosition) && map) {
      const target = position || startPosition;
      map.setView([target.lat, target.lng], 18.5, { animate: true });
    }
  }, [recenterTrigger, position, startPosition, map]);

  return null;
}

// Custom Leaflet DivIcons with 3D drop-shadow & Pulse Waves
const createStartIcon = () =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center select-none" style="width: 38px; height: 38px;">
        <div class="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping pointer-events-none" style="animation-duration: 2s;"></div>
        <div class="relative z-10 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-[0_4px_14px_rgba(16,185,129,0.55)] flex items-center justify-center text-white">
          <span class="material-symbols-outlined text-[17px] font-bold">trip_origin</span>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

const createEndIcon = () =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center select-none" style="width: 38px; height: 38px;">
        <div class="absolute inset-0 rounded-full bg-rose-500/25 animate-ping pointer-events-none" style="animation-duration: 2.2s;"></div>
        <div class="relative z-10 w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-[0_4px_14px_rgba(225,29,72,0.55)] flex items-center justify-center text-white">
          <span class="material-symbols-outlined text-[17px] font-bold">flag</span>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

// Calculate bearing (in degrees 0-360) between 2 points
function calculateBearing(startLat, startLng, endLat, endLng) {
  if (!startLat || !startLng || !endLat || !endLng) return 0;
  if (startLat === endLat && startLng === endLng) return 0;
  const dLng = ((endLng - startLng) * Math.PI) / 180;
  const lat1 = (startLat * Math.PI) / 180;
  const lat2 = (endLat * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Custom Smooth Marker that tracks live/simulated GPS coordinates & vehicle heading
function SmoothMovingMarker({ position, isTracking, destinationAddress }) {
  const [heading, setHeading] = useState(0);
  const prevPosRef = useRef(position);

  // 🧭 SENSOR FUSION: Hardware Gyroscope & Compass Orientation
  useEffect(() => {
    const handleOrientation = (e) => {
      if (!isTracking) return;
      const compassHeading = e.webkitCompassHeading !== undefined
        ? e.webkitCompassHeading
        : e.alpha !== null
          ? (360 - e.alpha) % 360
          : null;
      if (compassHeading !== null) {
        setHeading(Math.round(compassHeading));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, [isTracking]);

  // Calculate bearing angle from coordinate movement vector
  useEffect(() => {
    if (!position || typeof position.lat !== 'number' || typeof position.lng !== 'number') return;

    const prev = prevPosRef.current;
    if (prev && (prev.lat !== position.lat || prev.lng !== position.lng)) {
      const dist = Math.hypot(position.lat - prev.lat, position.lng - prev.lng);
      if (dist > 0.00002) {
        const newHeading = calculateBearing(prev.lat, prev.lng, position.lat, position.lng);
        if (newHeading !== 0) {
          setHeading(Math.round(newHeading));
        }
        prevPosRef.current = position;
      }
    } else {
      prevPosRef.current = position;
    }
  }, [position?.lat, position?.lng]);

  if (!position || typeof position.lat !== 'number' || typeof position.lng !== 'number') return null;

  const dynamicIcon = L.divIcon({
    className: 'custom-moving-shipper',
    html: `
      <div class="relative flex items-center justify-center select-none" style="width: 48px; height: 48px;">
        <!-- Radar Pulse Waves when tracking -->
        ${isTracking ? `
          <div class="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" style="animation-duration: 2.2s;"></div>
          <div class="absolute w-8 h-8 rounded-full bg-emerald-400/25 animate-pulse pointer-events-none"></div>
          <!-- Direction Headlight Beam -->
          <div class="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none transition-transform duration-200 ease-out" style="transform: translate(-50%, -50%) rotate(${heading}deg);">
            <div class="w-10 h-14 -mt-14 -ml-5 bg-gradient-to-t from-cyan-400/35 via-cyan-300/10 to-transparent clip-triangle blur-[1px]"></div>
          </div>
        ` : ''}
        
        <!-- Shipper Vehicle Avatar Circle with Smooth Heading Rotation -->
        <div class="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-900 shadow-md flex items-center justify-center p-1.5 transition-transform duration-200 ease-out"
             style="transform: rotate(${heading > 0 ? heading : 0}deg);">
          <img src="/motorcycle.png" alt="Shipper" class="w-full h-full object-contain drop-shadow-xs pointer-events-none" />
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  return (
    <Marker position={[position.lat, position.lng]} icon={dynamicIcon}>
      <Popup className="custom-leaflet-popup">
        <div className="p-1 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Vị trí shipper trực tiếp</span>
          </div>
          <div className="text-slate-600 mt-0.5 text-[11px]">
            Tọa độ: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </div>
          {destinationAddress && (
            <div className="text-slate-500 text-[10px] mt-1 line-clamp-1">
              Đến: {destinationAddress}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

// Map Tile Options (Large, high-contrast Vietnamese text labels)
export const MAP_LAYERS = {
  googleHybrid: {
    id: 'googleHybrid',
    name: 'Vệ Tinh',
    url: 'https://mt{s}.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}&scale=2',
    maxZoom: 22,
    maxNativeZoom: 20,
    subdomains: ['0', '1', '2', '3'],
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
    url: 'https://mt{s}.google.com/vt/lyrs=m&hl=vi&gl=VN&x={x}&y={y}&z={z}&scale=2',
    maxZoom: 22,
    maxNativeZoom: 20,
    subdomains: ['0', '1', '2', '3'],
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
  gpsAccuracy = null,
  onSelectPosition = null,
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
        preferCanvas={true}
        inertia={true}
        inertiaDeceleration={2000}
        inertiaMaxSpeed={3000}
        easeLinearity={0.15}
        zoomSnap={0.5}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={100}
        className="w-full h-full min-h-[480px] z-0"
        attributionControl={false}
      >
        {/* Active Map Tile Layer (Retina HD High Res with Tile Pre-caching) */}
        <TileLayer
          key={selectedLayer}
          url={activeLayerConfig.url}
          maxZoom={activeLayerConfig.maxZoom}
          maxNativeZoom={activeLayerConfig.maxNativeZoom}
          subdomains={activeLayerConfig.subdomains}
          keepBuffer={10}
          updateWhenIdle={false}
          updateWhenZooming={false}
        />

        {/* Dynamic Route Polyline (Google Maps Authentic Navigation Route Strip) */}
        {polylinePositions.length > 1 && (
          <>
            {/* Layer 1: Google Maps Deep Border Casing */}
            <Polyline
              positions={polylinePositions}
              pathOptions={{
                color: '#1558d6',
                weight: 9,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Layer 2: Google Maps Iconic Vibrant Royal Blue Route */}
            <Polyline
              positions={polylinePositions}
              pathOptions={{
                color: '#4285F4',
                weight: 6,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Layer 3: Inner Core Highlight Strip */}
            <Polyline
              positions={polylinePositions}
              pathOptions={{
                color: '#8ab4f8',
                weight: 2,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}

        {/* Start Point Marker: Render only when moved away from current point or completed */}
        {startPosition && (!isTracking || (currentPosition && (Math.abs(startPosition.lat - currentPosition.lat) > 0.0002 || Math.abs(startPosition.lng - currentPosition.lng) > 0.0002))) && (
          <Marker position={[startPosition.lat, startPosition.lng]} icon={createStartIcon()}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-xs">
                <div className="font-bold text-emerald-600">Điểm Xuất Phát</div>
                <div className="text-slate-700 mt-0.5">{originAddress}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* End Point Marker: Render ONLY for finished trips (when not tracking) */}
        {!isTracking && endPosition && (
          <Marker position={[endPosition.lat, endPosition.lng]} icon={createEndIcon()}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-xs">
                <div className="font-bold text-rose-600">Điểm Kết Thúc</div>
                <div className="text-slate-700 mt-0.5">{destinationAddress}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Current Live Moving Marker: Render during tracking or when idle without finished end flag */}
        {(isTracking || !endPosition) && currentPosition && (
          <SmoothMovingMarker
            position={currentPosition}
            isTracking={isTracking}
            destinationAddress={destinationAddress}
          />
        )}

        {/* Map Click Listener to fine-tune exact position */}
        <MapClickHandler onSelectPosition={onSelectPosition} isTracking={isTracking} />

        <MapController
          position={currentPosition || startPosition}
          startPosition={startPosition}
          endPosition={endPosition}
          pathCoordinates={pathCoordinates}
          isTracking={isTracking}
          recenterTrigger={recenterTrigger}
          readOnly={readOnly}
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
