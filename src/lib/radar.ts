const DEG2RAD = Math.PI / 180;
const MAX_RANGE = 5000; // meters — matches useSounds search radius

/**
 * Bearing from point 1 to point 2, in degrees 0-360 (0 = north, 90 = east).
 */
export function getBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = (lng2 - lng1) * DEG2RAD;
  const y = Math.sin(dLng) * Math.cos(lat2 * DEG2RAD);
  const x =
    Math.cos(lat1 * DEG2RAD) * Math.sin(lat2 * DEG2RAD) -
    Math.sin(lat1 * DEG2RAD) * Math.cos(lat2 * DEG2RAD) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * Map distance (meters) → 0..1 fraction using logarithmic scaling.
 * Near sounds spread out, far sounds compress toward the edge.
 */
export function distanceToScreenFraction(meters: number): number {
  const clamped = Math.max(1, Math.min(meters, MAX_RANGE));
  return Math.log(clamped) / Math.log(MAX_RANGE);
}

/**
 * Convert a sound's geo-position into pixel coordinates on a canvas of size w×h,
 * centered on the user.
 */
export function soundToScreen(
  userLat: number,
  userLng: number,
  soundLat: number,
  soundLng: number,
  distMeters: number,
  w: number,
  h: number
): { x: number; y: number } {
  const bearing = getBearing(userLat, userLng, soundLat, soundLng);
  const frac = distanceToScreenFraction(distMeters);

  // Leave 12% margin so edge orbs don't clip
  const radius = Math.min(w, h) * 0.5 * 0.88;
  const rad = ((bearing - 90) * Math.PI) / 180; // CSS: 0° = right

  return {
    x: w / 2 + Math.cos(rad) * radius * frac,
    y: h / 2 + Math.sin(rad) * radius * frac,
  };
}

/** Orb pixel size — near: 40px, far: 10px */
export function distanceToOrbSize(meters: number): number {
  const t = Math.min(meters / MAX_RANGE, 1);
  return 40 - 30 * t;
}

/** Orb opacity — near: 1.0, far: 0.25 */
export function distanceToOpacity(meters: number): number {
  const t = Math.min(meters / MAX_RANGE, 1);
  return 1 - 0.75 * t;
}
