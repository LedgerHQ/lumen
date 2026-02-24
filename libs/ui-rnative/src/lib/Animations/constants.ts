import { Easing } from 'react-native-reanimated';

export const durations = {
  '0': 0,
  '75': 75,
  '100': 100,
  '120': 120,
  '150': 150,
  '200': 200,
  '250': 250,
  '300': 300,
  '500': 500,
  '700': 700,
  '1000': 1000,
  '2000': 2000,
  '3000': 3000,
} as const;

export type DurationKey = keyof typeof durations;

export const easingCurves = {
  bezier: {
    default: Easing.bezier(0.4, 0, 0.2, 1),
    emphasize: Easing.bezier(0.05, 0.7, 0.1, 1),
    out: Easing.bezier(0, 0, 0.2, 1),
    in: Easing.bezier(0.4, 0, 1, 1),
  },
  quad: Easing.quad,
  ease: Easing.ease,
  linear: Easing.linear,
} as const;
