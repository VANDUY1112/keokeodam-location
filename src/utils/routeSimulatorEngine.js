/**
 * 🚀 HIGH-PRECISION 60FPS ROUTE SIMULATION ENGINE
 * Powered by OSRM Real Road Routing & Kinematic Physics Interpolator
 */

// Preset popular speaker delivery routes in Tuy Hoa / Phu Yen
export const PRESET_ROUTES = [
  {
    id: 'route_beach',
    name: 'Kho ➔ Bãi Biển Tuy Hòa',
    desc: 'Tuyến đường giao loa ven biển Độc Lập - Quảng Trường 1/4',
    start: { lat: 13.0882, lng: 109.3105, name: 'Kho Loa Kẹo Kéo Trung Tâm' },
    end: { lat: 13.0955, lng: 109.3248, name: 'Quảng Trường 1/4 & Bãi Biển Tuy Hòa' },
    customer: 'Anh Tuấn - Tiệc BBQ Bãi Biển',
    speaker: 'Loa Kéo Đôi Bass 50 Khủng (1500W)'
  },
  {
    id: 'route_nghinhphong',
    name: 'Kho ➔ Tháp Nghinh Phong',
    desc: 'Tuyến đại lộ Hùng Vương ➔ Quảng trường Nghinh Phong',
    start: { lat: 13.0882, lng: 109.3105, name: 'Kho Loa Kẹo Kéo Trung Tâm' },
    end: { lat: 13.1118, lng: 109.3185, name: 'Quảng Trường Tháp Nghinh Phong' },
    customer: 'Chị Mai - Sự kiện Check-in',
    speaker: 'Combo Loa Kéo + Đèn Laser Sân Khấu'
  },
  {
    id: 'route_boke',
    name: 'Kho ➔ Bờ Kè Bạch Đằng',
    desc: 'Tuyến đường ẩm thực hải sản & tiệc bờ kè sông Đà Rằng',
    start: { lat: 13.0882, lng: 109.3105, name: 'Kho Loa Kẹo Kéo Trung Tâm' },
    end: { lat: 13.0789, lng: 109.3032, name: 'Khu Ẩm Thực Bờ Kè Bạch Đằng' },
    customer: 'Quán Hải Sản Năm Ánh',
    speaker: 'Loa Kéo Bass 40 (Công suất 800W)'
  },
  {
    id: 'route_thapnhan',
    name: 'Kho ➔ Núi Nhạn & Sông Chùa',
    desc: 'Tuyến đường Trần Hưng Đạo ➔ Di tích Tháp Nhạn',
    start: { lat: 13.0882, lng: 109.3105, name: 'Kho Loa Kẹo Kéo Trung Tâm' },
    end: { lat: 13.0825, lng: 109.2995, name: 'Khu Du Lịch Núi Nhạn' },
    customer: 'Gia đình Chú Sáu - Tiệc Mừng Thọ',
    speaker: 'Loa Kéo Xách Tay Mini (400W)'
  }
];

/**
 * Calculate Haversine distance in meters
 */
export function haversineDistanceMeters(p1, p2) {
  if (!p1 || !p2) return 0;
  const R = 6371000; // meters
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate Bearing angle (0-360 degrees) between two coordinates
 */
export function calculateBearing(startLat, startLng, destLat, destLng) {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Convert bearing angle to compass name (Đông, Tây, Nam, Bắc)
 */
export function bearingToCompass(bearing) {
  const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Fetch high-fidelity real road polyline from OSRM driving engine
 */
export async function fetchOSRMRoute(startCoords, destCoords) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
        const distanceKm = route.distance / 1000;
        const durationSec = route.duration;
        const steps = route.legs?.[0]?.steps?.map(s => ({
          instruction: s.maneuver?.type === 'depart' ? 'Bắt đầu di chuyển từ điểm xuất phát' :
                       s.maneuver?.type === 'arrive' ? 'Đã đến điểm giao loa khách hàng' :
                       s.name ? `Rẽ vào đường ${s.name}` : 'Tiếp tục di chuyển thẳng',
          distance: s.distance,
          location: { lat: s.maneuver.location[1], lng: s.maneuver.location[0] }
        })) || [];

        return {
          coordinates,
          distanceKm,
          durationSec,
          steps,
          isRealRoad: true
        };
      }
    }
  } catch (err) {
    console.warn('OSRM routing fetch timeout or network error, generating organic interpolation:', err.message);
  }

  // Fallback high-density organic spline interpolation if offline
  return generateCurvedRoadFallback(startCoords, destCoords);
}

/**
 * Fallback curved spline path generator when offline
 */
function generateCurvedRoadFallback(start, end) {
  const points = [];
  const count = 40;
  const dLat = end.lat - start.lat;
  const dLng = end.lng - start.lng;
  const totalMeters = haversineDistanceMeters(start, end);

  for (let i = 0; i <= count; i++) {
    const t = i / count;
    // Add sinusoidal street curvature
    const curve = Math.sin(t * Math.PI) * 0.0015;
    const curvePerp = Math.cos(t * Math.PI * 2) * 0.0008;
    points.push({
      lat: start.lat + dLat * t + curve,
      lng: start.lng + dLng * t + curvePerp
    });
  }

  return {
    coordinates: points,
    distanceKm: totalMeters / 1000,
    durationSec: Math.round(totalMeters / 8.5), // ~30 km/h
    steps: [
      { instruction: 'Bắt đầu di chuyển từ kho', distance: 100 },
      { instruction: 'Di chuyển theo tuyến đường chính', distance: totalMeters * 0.7 },
      { instruction: 'Chuẩn bị rẽ vào điểm giao khách hàng', distance: 50 }
    ],
    isRealRoad: false
  };
}

/**
 * 🏎️ High-Performance Kinematic Route Simulator Class
 */
export class KinematicRouteSimulator {
  constructor({
    path = [],
    speedMultiplier = 1,
    baseSpeedKmh = 32,
    onPositionUpdate = () => {},
    onStepChange = () => {},
    onComplete = () => {}
  }) {
    this.path = path;
    this.speedMultiplier = speedMultiplier;
    this.baseSpeedKmh = baseSpeedKmh;
    this.onPositionUpdate = onPositionUpdate;
    this.onStepChange = onStepChange;
    this.onComplete = onComplete;

    this.currentIndex = 0;
    this.progress = 0; // 0 to 1 between segment points
    this.isRunning = false;
    this.isPaused = false;
    this.animationFrameId = null;
    this.lastTimestamp = null;
    this.currentBearing = 0;
    this.currentSpeedKmh = 0;
    this.totalDistanceMeters = 0;
    this.traveledMeters = 0;

    this.calculateSegmentLengths();
  }

  calculateSegmentLengths() {
    this.segments = [];
    this.totalDistanceMeters = 0;
    for (let i = 0; i < this.path.length - 1; i++) {
      const dist = haversineDistanceMeters(this.path[i], this.path[i + 1]);
      this.segments.push(dist);
      this.totalDistanceMeters += dist;
    }
  }

  setSpeedMultiplier(multiplier) {
    this.speedMultiplier = multiplier;
  }

  start() {
    if (this.path.length < 2) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastTimestamp = performance.now();
    this.tick(this.lastTimestamp);
  }

  pause() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume() {
    if (!this.isRunning) return this.start();
    this.isPaused = false;
    this.lastTimestamp = performance.now();
    this.tick(this.lastTimestamp);
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  tick(timestamp) {
    if (!this.isRunning || this.isPaused) return;

    const deltaSec = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    if (this.currentIndex >= this.path.length - 1) {
      this.stop();
      this.onComplete();
      return;
    }

    const p1 = this.path[this.currentIndex];
    const p2 = this.path[this.currentIndex + 1];
    const segmentLength = this.segments[this.currentIndex] || 1;

    // Kinematic speed calculation with natural variance & multiplier
    const targetSpeedKmh = Math.max(15, this.baseSpeedKmh * this.speedMultiplier + (Math.sin(timestamp / 600) * 4));
    this.currentSpeedKmh = targetSpeedKmh;
    const metersPerSec = (targetSpeedKmh * 1000) / 3600;
    const distanceStep = metersPerSec * deltaSec;

    this.traveledMeters += distanceStep;
    this.progress += distanceStep / segmentLength;

    if (this.progress >= 1) {
      this.currentIndex++;
      this.progress = 0;
      if (this.currentIndex >= this.path.length - 1) {
        this.onPositionUpdate({
          coords: this.path[this.path.length - 1],
          speed: 0,
          bearing: this.currentBearing,
          traveledMeters: this.totalDistanceMeters,
          remainingMeters: 0,
          progressRatio: 1
        });
        this.stop();
        this.onComplete();
        return;
      }
    }

    // High-precision sub-meter linear interpolation
    const interpLat = p1.lat + (p2.lat - p1.lat) * this.progress;
    const interpLng = p1.lng + (p2.lng - p1.lng) * this.progress;
    const interpPoint = { lat: interpLat, lng: interpLng };

    // Calculate heading angle
    const targetBearing = calculateBearing(p1.lat, p1.lng, p2.lat, p2.lng);
    // Smooth angle interpolation to prevent jerky marker rotation
    const diff = (targetBearing - this.currentBearing + 180) % 360 - 180;
    this.currentBearing = (this.currentBearing + diff * 0.25 + 360) % 360;

    const remainingMeters = Math.max(0, this.totalDistanceMeters - this.traveledMeters);
    const progressRatio = Math.min(1, this.traveledMeters / Math.max(1, this.totalDistanceMeters));

    this.onPositionUpdate({
      coords: interpPoint,
      speed: Math.round(this.currentSpeedKmh),
      bearing: Math.round(this.currentBearing),
      compass: bearingToCompass(this.currentBearing),
      traveledMeters: Math.round(this.traveledMeters),
      remainingMeters: Math.round(remainingMeters),
      progressRatio
    });

    this.animationFrameId = requestAnimationFrame((t) => this.tick(t));
  }
}
