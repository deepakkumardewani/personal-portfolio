/**
 * Pure layout helpers for the skills orbital (Task 17).
 * Satellites are placed on a circle; index 0 starts at 12 o'clock.
 */

export const DEFAULT_ORBIT_RADIUS_PX = 220;

export function satellitePosition(
  index: number,
  total: number,
  radiusPx: number,
): { x: number; y: number } {
  if (total < 1) {
    return { x: 0, y: 0 };
  }
  const t = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(t) * radiusPx,
    y: Math.sin(t) * radiusPx,
  };
}
