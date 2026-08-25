/**
 * Advanced 2D Kalman Filter for Realtime GPS Noise Filtering
 * Combines satellite accuracy covariance to eliminate jitter & building reflections
 */
export class GPSKalmanFilter {
  constructor(processNoise = 2.5, defaultMeasurementNoise = 4.0) {
    this.processNoise = processNoise; // Q: Process noise
    this.defaultMeasurementNoise = defaultMeasurementNoise; // R: Measurement noise
    this.lat = null;
    this.lng = null;
    this.variance = -1; // P: Estimation error variance
    this.timestamp = null;
  }

  /**
   * Process a new raw GPS coordinate through the Kalman filter
   * @param {number} rawLat - Raw latitude
   * @param {number} rawLng - Raw longitude
   * @param {number} accuracy - GPS accuracy in meters from sensor
   * @param {number} timestamp - Epoch timestamp in ms
   * @returns {{ lat: number, lng: number }} Smoothed coordinate
   */
  filter(rawLat, rawLng, accuracy = 5, timestamp = Date.now()) {
    if (this.variance < 0 || this.lat === null || this.lng === null) {
      this.lat = rawLat;
      this.lng = rawLng;
      this.variance = Math.max(accuracy * accuracy, 1);
      this.timestamp = timestamp;
      return { lat: rawLat, lng: rawLng };
    }

    const dt = Math.min(Math.max((timestamp - this.timestamp) / 1000, 0.1), 10);
    this.timestamp = timestamp;

    // 1. Prediction step: expand variance over time
    this.variance += this.processNoise * dt;

    // 2. Update step: calculate Kalman Gain
    const measurementVariance = Math.max(accuracy * accuracy, 2);
    const K = this.variance / (this.variance + measurementVariance);

    // 3. Estimate update
    this.lat = this.lat + K * (rawLat - this.lat);
    this.lng = this.lng + K * (rawLng - this.lng);
    this.variance = (1 - K) * this.variance;

    return { lat: this.lat, lng: this.lng };
  }

  reset() {
    this.lat = null;
    this.lng = null;
    this.variance = -1;
    this.timestamp = null;
  }
}

/**
 * Snap a GPS coordinate to the nearest real road segment (OSRM Map Matching)
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<{ lat: number, lng: number }>}
 */
export async function snapToNearestRoad(lat, lng) {
  try {
    const url = `https://router.project-osrm.org/nearest/v1/driving/${lng},${lat}?number=1`;
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (response.ok) {
      const data = await response.json();
      if (data.code === 'Ok' && data.waypoints && data.waypoints.length > 0) {
        const [snapLng, snapLat] = data.waypoints[0].location;
        const distance = data.waypoints[0].distance; // Distance to road in meters
        // Only snap if road is within 25 meters
        if (distance <= 25) {
          return { lat: snapLat, lng: snapLng, snapped: true };
        }
      }
    }
  } catch {
    // Fallback if offline or timeout
  }
  return { lat, lng, snapped: false };
}
