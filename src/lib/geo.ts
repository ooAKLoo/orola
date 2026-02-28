const EARTH_RADIUS = 6371000; // meters

/** Haversine distance in meters */
export function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}

/** Format distance for display */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

/** Get bounding box for a center + radius (in meters) */
export function getBoundingBox(
  lat: number,
  lng: number,
  radiusM: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const dLat = radiusM / EARTH_RADIUS;
  const dLng = radiusM / (EARTH_RADIUS * Math.cos(toRad(lat)));
  const dLatDeg = (dLat * 180) / Math.PI;
  const dLngDeg = (dLng * 180) / Math.PI;
  return {
    minLat: lat - dLatDeg,
    maxLat: lat + dLatDeg,
    minLng: lng - dLngDeg,
    maxLng: lng + dLngDeg,
  };
}
