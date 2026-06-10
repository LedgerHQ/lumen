import type { ReactNode } from 'react';

import type { DrawingArea, Series } from '../../../utils/types';

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

export type RevealClipDefsProps = {
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
