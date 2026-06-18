import type { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { DrawingArea, Series } from '../../../utils/types';

export type EnterTransitionConfig = {
  /**
   * Duration in seconds. @default 0.8
   */
  duration?: number;
  /**
   * Reanimated easing is configured internally.
   * This field is kept for API parity with the web variant but is unused on native.
   */
  easing?: string;
};

export type RevealAnimationProps = {
  children: ReactNode;
  /**
   * The drawing area whose bounds define the clip rectangle.
   */
  drawingArea: DrawingArea;
  /**
   * Whether to animate the chart.
   * @default true
   */
  animate?: boolean;
  /**
   * Transition configuration.
   * @default { enter: { duration: 0.8 } }
   */
  transitions?: { enter?: EnterTransitionConfig };
  /**
   * Data series used to compute a fingerprint that restarts
   * the animation when data changes.
   */
  series: Series[];
};

/**
 * Value shared by the reveal animation provider.
 *
 * - `clipPathAttr` drives the left-to-right clip wipe consumed by path-based
 *   components (e.g. `Line`, `LineChartEmptyState`).
 * - `pointOpacity` is the shared opacity value for accessory components (e.g.
 *   `Point`) that must not be clipped, so they fade in after the wipe instead.
 */
export type RevealAnimationContextValue = {
  clipPathAttr: string;
  pointOpacity: SharedValue<number>;
};
