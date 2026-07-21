import { Easing } from 'react-native-reanimated';

export type DonutGeometry = {
  box: number;
  innerRadius: number;
  outerRadius: number;
  cornerRadius: number;
  padAngle: number;
  activeOffset: number;
};

export const DONUT_GEOMETRY = {
  md: {
    box: 168,
    innerRadius: 61,
    outerRadius: 83,
    cornerRadius: 4,
    padAngle: 0.06,
    activeOffset: 3.36,
  },
  sm: {
    box: 80,
    innerRadius: 28,
    outerRadius: 39,
    cornerRadius: 2,
    padAngle: 0.08,
    activeOffset: 2,
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

export type DonutSizeKey = keyof typeof DONUT_GEOMETRY;
