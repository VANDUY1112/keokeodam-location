/**
 * Spatial Clustering Engine for Delivery Destinations (DBSCAN Algorithm)
 * Groups nearby delivery endpoints into dynamic hotspot zones with centroids & bounding radius
 */

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const CLUSTER_COLORS = [
  '#ef4444', // Red (High density)
  '#f59e0b', // Amber (Medium density)
  '#3b82f6', // Blue (Standard)
  '#10b981', // Emerald (Quiet zone)
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

/**
 * Cluster trips/rentals based on destination coordinates
 * @param {Array} trips - Array of trip/rental objects
 * @param {number} maxRadiusKm - Max distance in km to be in the same cluster (default: 0.6 km = 600m)
 * @param {Object} userCoords - Origin warehouse coordinates { lat, lng }
 * @returns {Array} List of cluster objects with centroid, radius, count, and member trip dots
 */
export function clusterDeliveryPoints(trips = [], maxRadiusKm = 0.65, userCoords = null) {
  const validPoints = trips
    .map((t, idx) => {
      const lat = t.destLat || t.lat || t.endPosition?.lat || t.startLat;
      const lng = t.destLng || t.lng || t.endPosition?.lng || t.startLng;
      if (typeof lat !== 'number' || typeof lng !== 'number') return null;
      return {
        id: t.id || `pt-${idx}`,
        lat,
        lng,
        customerName: t.customerName || t.title?.replace('Giao Loa: ', '') || `Khách #${idx + 1}`,
        address: t.address || t.destination || 'Điểm giao',
        cost: t.cost || t.totalAmount || 350000,
        speakerName: t.speakerName || 'Loa Kéo',
        status: t.status || 'Hoàn thành',
        original: t
      };
    })
    .filter(Boolean);

  if (validPoints.length === 0) return [];

  const visited = new Set();
  const clusters = [];

  for (let i = 0; i < validPoints.length; i++) {
    const point = validPoints[i];
    if (visited.has(point.id)) continue;

    visited.add(point.id);
    const currentClusterMembers = [point];

    // Find all neighbors within maxRadiusKm
    for (let j = 0; j < validPoints.length; j++) {
      if (i === j) continue;
      const neighbor = validPoints[j];
      const dist = calculateDistanceKm(point.lat, point.lng, neighbor.lat, neighbor.lng);

      if (dist <= maxRadiusKm) {
        visited.add(neighbor.id);
        currentClusterMembers.push(neighbor);
      }
    }

    // Calculate cluster centroid (average lat/lng)
    const centerLat = currentClusterMembers.reduce((sum, p) => sum + p.lat, 0) / currentClusterMembers.length;
    const centerLng = currentClusterMembers.reduce((sum, p) => sum + p.lng, 0) / currentClusterMembers.length;

    // Calculate bounding radius (max distance from centroid to any member point)
    let maxDistFromCenter = 0;
    currentClusterMembers.forEach((p) => {
      const d = calculateDistanceKm(centerLat, centerLng, p.lat, p.lng);
      if (d > maxDistFromCenter) maxDistFromCenter = d;
    });

    // Convert km to meters for Leaflet Circle radius (minimum 180m for nice visual circle)
    const radiusMeters = Math.max(180, Math.round(maxDistFromCenter * 1000) + 70);

    // Calculate distance from user warehouse to this cluster center
    let distFromWarehouse = '~ 800m';
    if (userCoords && typeof userCoords.lat === 'number') {
      const d = calculateDistanceKm(userCoords.lat, userCoords.lng, centerLat, centerLng);
      distFromWarehouse = d >= 1 ? `~ ${d.toFixed(1)} km` : `~ ${Math.round(d * 1000)}m`;
    }

    const clusterIdx = clusters.length;
    const color = CLUSTER_COLORS[clusterIdx % CLUSTER_COLORS.length];

    // Cluster Name based on address or location
    const firstAddr = currentClusterMembers[0]?.address || `Khu Vực Giao #${clusterIdx + 1}`;
    const cleanName = firstAddr.split(',')[0] || `Khu Vực #${clusterIdx + 1}`;

    clusters.push({
      id: `cluster-${clusterIdx + 1}`,
      name: `Cụm ${clusterIdx + 1}: ${cleanName}`,
      shortName: cleanName,
      lat: centerLat,
      lng: centerLng,
      radius: radiusMeters,
      rentalCount: currentClusterMembers.length,
      distance: distFromWarehouse,
      color,
      badgeText: `${currentClusterMembers.length} chuyến`,
      tripDots: currentClusterMembers.map((m, mIdx) => ({
        id: `${m.id}-dot`,
        tripNumber: mIdx + 1,
        customerName: m.customerName,
        lat: m.lat,
        lng: m.lng,
        address: m.address,
        speaker: m.speakerName,
        cost: m.cost
      }))
    });
  }

  // Sort clusters: Largest number of trips first
  return clusters.sort((a, b) => b.rentalCount - a.rentalCount);
}
