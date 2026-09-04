import type { DonutGeometry } from '../config';

export const DONUT_CENTER = {
  /** Horizontal inset (px per side) so center text clears the inner ring. */
  contentInset: { md: 4, sm: 2 },
  transitionDurationMs: 180,
  transitionSlideDistance: 8,
} as const;

export const getDonutViewBox = (geometry: DonutGeometry): string => {
  const padding = geometry.activeOffset;
  const paddedBox = geometry.box + 2 * padding;
  return `-${padding} -${padding} ${paddedBox} ${paddedBox}`;
};

/**
 * Converts a point from the gesture overlay's screen-pixel space (sized to
 * `geometry.box`, stacked on top of the ring) into the origin-centered space
 * `segment.path` is drawn in, undoing the `viewBox` padding/scale from
 * `getDonutViewBox` so tap coordinates line up with segment hit-testing.
 */
export const toRingLocalPoint = (
  point: { x: number; y: number },
  geometry: DonutGeometry,
): { x: number; y: number } => {
  const { box, activeOffset } = geometry;
  const scale = (box + 2 * activeOffset) / box;
  const center = box / 2;
  return {
    x: point.x * scale - activeOffset - center,
    y: point.y * scale - activeOffset - center,
  };
};
