import type { CSSProperties, ReactNode } from 'react';

import type { DrawingArea, Series } from '../../../utils';

/**
 * Value shared by the reveal animation provider.
 *
 * - `clipPathAttr` drives the left-to-right clip wipe consumed by path-based
 *   components (e.g. `Line`).
 * - `getPointRevealStyle` returns the opacity fade-in style for accessory
 *   components (e.g. `Point`) that must not be clipped, so edge content stays
 *   visible.
 */
export type RevealAnimationContextValue = {
  /**
   * `clip-path` attribute (`url(#id)`) used by the line/area wipe.
   */
  clipPathAttr: string;
  /**
   * Builds the opacity fade-in style for an accessory (e.g. `Point`) so it
   * reveals without being clipped, keeping edge content visible.
   */
  getPointRevealStyle: () => CSSProperties;
};

export type EnterTransitionConfig = {
  /**
   * Duration in seconds. @default 0.8
   */
  duration?: number;
  /**
   * CSS easing function. @default 'linear'
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
   * @default { enter: { duration: 0.8, easing: 'linear' } }
   */
  transitions?: { enter?: EnterTransitionConfig };
  /**
   * Data series used to compute a fingerprint that restarts
   * the animation when data changes.
   */
  series: Series[];
};
