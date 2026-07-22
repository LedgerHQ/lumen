import { Easing } from 'react-native-reanimated';

export type DonutGeometry = {
  box: number;
  innerRadius: number;
  outerRadius: number;
  cornerRadius: number;
  padAngle: number;
  activeOffset: number;
  /** Radial hitSlop: how far a tap can land beyond the ring's drawn edges and still hit. */
  hitSlopRadius: number;
};

export const DONUT_GEOMETRY = {
  md: {
    box: 168,
    innerRadius: 61,
    outerRadius: 83,
    cornerRadius: 4,
    padAngle: 0.06,
    activeOffset: 3.36,
    hitSlopRadius: 12,
  },
  sm: {
    box: 80,
    innerRadius: 28,
    outerRadius: 39,
    cornerRadius: 2,
    padAngle: 0.08,
    activeOffset: 2,
    hitSlopRadius: 8,
  },
} as const satisfies Record<string, DonutGeometry>;

export const DONUT_INTERACTION = {
  dimOpacity: 0.3,
  opacityDurationMs: 150,
  popDurationMs: 180,
  popEasing: Easing.bezier(0.2, 0.8, 0.2, 1),
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
 * `getDonutViewBox` so tap coordinates line up with arc hit-testing.
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

export type DonutSizeKey = keyof typeof DONUT_GEOMETRY;
