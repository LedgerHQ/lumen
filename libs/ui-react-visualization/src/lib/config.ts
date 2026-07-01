import { cssVar } from '@ledgerhq/lumen-design-core';

import type { ChartInset } from './utils/types';

/**
 * Single source of truth for chart constants, grouped by feature and prefixed to
 * stay unambiguous in this shared scope. SHARED tokens are aliased by concept,
 * not by raw token, so two aliases can diverge later even if equal today.
 */

/* ============================================================================
 * SHARED — cross-cutting design tokens (used by 2+ features)
 * ========================================================================== */

/** Data series, reference lines, and scrubber beacons. */
export const CHART_DEFAULT_STROKE = cssVar('var(--border-muted)');

/** Background grid lines (axes and empty/loading state). */
export const CHART_GRID_LINE_COLOR = cssVar(
  'var(--border-muted-subtle-transparent)',
);

/** Placeholder and loading/transition lines. */
export const CHART_MUTED_LINE_COLOR = cssVar('var(--border-muted-subtle)');

/** Outline around filled marks (points, scrubber beacons). */
export const CHART_MARK_OUTLINE_COLOR = cssVar('var(--background-canvas)');

/** Grid lines, tick marks, axis baselines, scrubber line. */
export const CHART_HAIRLINE_STROKE_WIDTH = cssVar('var(--stroke-1)');

/** Data lines and the empty-state placeholder line. */
export const CHART_LINE_STROKE_WIDTH = cssVar('var(--stroke-2)');

export const CHART_FONT_FAMILY = cssVar('var(--font-family-font)');

/** Axis, reference-line, and tooltip labels. */
export const CHART_TEXT_MUTED_COLOR = cssVar('var(--text-muted)');

/** Point labels and tooltip values. */
export const CHART_TEXT_COLOR = cssVar('var(--text-base)');

/* ============================================================================
 * CHART (CartesianChart)
 * ========================================================================== */

export const CHART_DEFAULT_HEIGHT = 240;

export const CHART_ZERO_PADDING: ChartInset = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

/* ============================================================================
 * AXIS
 * ========================================================================== */

export const AXIS_DEFAULT_HEIGHT = 28;
export const AXIS_DEFAULT_WIDTH = 40;
export const AXIS_TICK_MARK_SIZE = 4;
export const AXIS_TICK_LABEL_OFFSET = 6;
export const AXIS_GRID_DASH_ARRAY = '3 3';

/** Axis baseline and tick marks; kept separate from data styling. */
export const AXIS_LINE_COLOR = cssVar('var(--border-muted)');

/* ============================================================================
 * LINE
 * ========================================================================== */

export const LINE_AREA_GRADIENT_OPACITY = 0.25;

/* ============================================================================
 * LINE CHART — empty & loading state
 * ========================================================================== */

/** Minimum finite points a series needs to be drawable as a line. */
export const MIN_DRAWABLE_POINTS = 2;
export const LOADING_ARIA_LABEL = 'Loading chart';
export const DEFAULT_EMPTY_LABEL = 'No data';
export const EMPTY_STATE_GRID_LINE_RATIOS = [0.3, 0.5, 0.7];

export const PLACEHOLDER_VIEW_WIDTH = 728;
export const PLACEHOLDER_VIEW_HEIGHT = 208;

/** Placeholder shape authored against the PLACEHOLDER_VIEW_* viewBox. */
export const PLACEHOLDER_LINE_PATH =
  'M1.00 128.27 C4.02 127.46 13.09 125.96 19.13 123.47 C25.19 120.97 31.23 116.53 37.28 113.31 C43.33 110.10 49.38 106.15 55.42 104.20 C61.48 102.24 67.52 102.53 73.57 101.61 C79.61 100.69 85.65 99.89 91.71 98.70 C97.75 97.51 103.80 95.67 109.84 94.47 C115.90 93.27 121.94 91.71 127.99 91.49 C134.03 91.26 140.09 91.53 146.13 93.16 C152.19 94.79 158.23 98.37 164.27 101.25 C170.32 104.13 176.36 108.16 182.42 110.45 C188.46 112.74 194.51 114.41 200.55 115.00 C206.61 115.60 212.65 114.56 218.70 114.03 C224.75 113.50 230.80 112.56 236.84 111.86 C242.88 111.17 248.94 110.27 254.98 109.87 C261.03 109.48 267.07 109.14 273.13 109.49 C279.17 109.82 285.22 110.90 291.26 111.90 C297.32 112.90 303.36 114.47 309.41 115.50 C315.46 116.54 321.50 118.12 327.55 118.11 C333.59 118.10 339.65 118.08 345.69 115.45 C351.74 112.81 357.78 107.02 363.84 102.29 C369.88 97.54 375.93 90.87 381.97 87.01 C388.03 83.16 394.07 79.81 400.11 79.12 C406.17 78.43 412.21 80.79 418.26 82.88 C424.30 84.99 430.36 88.88 436.40 91.74 C442.45 94.59 448.49 98.24 454.55 100.02 C460.59 101.80 466.64 102.08 472.68 102.44 C478.72 102.81 484.78 102.31 490.82 102.21 C496.87 102.11 502.92 101.95 508.97 101.84 C515.01 101.74 521.07 101.47 527.11 101.58 C533.16 101.68 539.20 101.57 545.26 102.48 C551.30 103.39 557.34 105.37 563.39 107.02 C569.43 108.68 575.49 111.02 581.53 112.40 C587.59 113.79 593.63 114.62 599.68 115.30 C605.72 115.98 611.78 115.81 617.82 116.48 C623.87 117.16 629.91 118.39 635.95 119.32 C642.01 120.25 648.05 121.51 654.10 122.04 C660.15 122.57 666.20 123.89 672.24 122.47 C678.30 121.07 684.34 117.39 690.39 113.54 C696.43 109.69 702.49 103.53 708.53 99.38 C714.57 95.23 722.31 90.65 726.66 88.61';

/* ============================================================================
 * POINT
 * ========================================================================== */

export const POINT_DEFAULT_SIZE = 10;
export const POINT_STROKE_WIDTH = 2;
export const POINT_ARROW_WIDTH = 6;
export const POINT_ARROW_HEIGHT = 4;
export const POINT_LABEL_GAP = 4;
export const POINT_LABEL_FONT_SIZE = 10;
/** Character width as a ratio of the label font size. */
export const POINT_LABEL_CHAR_WIDTH_RATIO = 0.6;

/* ============================================================================
 * REFERENCE LINE
 * ========================================================================== */

export const REFERENCE_LINE_STROKE_WIDTH = 2;
export const REFERENCE_LINE_DASH_ARRAY = '0.1 6';

/* ============================================================================
 * SCRUBBER
 * ========================================================================== */

export const BEACON_RADIUS = 5;
export const BEACON_STROKE_WIDTH = 2;
export const OVERLAY_OFFSET = 2;
export const OVERLAY_LINE_INSET = 0.5;
export const OVERLAY_OPACITY = 0.8;
export const SCRUBBER_LINE_GRADIENT_EDGE_OPACITY = 0.1;
export const DEFAULT_MAGNET_RADIUS = 8;

/** Index step per arrow-key press. */
export const KEYBOARD_STEP = 1;
/** Fraction of the data range moved per shift + arrow-key press. */
export const KEYBOARD_PAGE_STEP_RATIO = 0.1;
export const KEYBOARD_PAGE_STEP_MIN = 1;
export const KEYBOARD_PAGE_STEP_MAX = 10;

/* ============================================================================
 * SCRUBBER TOOLTIP
 * ========================================================================== */

export const TOOLTIP_DEFAULT_OFFSET = 10;
export const TOOLTIP_PADDING_X = 8;
export const TOOLTIP_PADDING_Y = 8;
export const TOOLTIP_ROW_HEIGHT = 16;
export const TOOLTIP_ROW_GAP = 4;
export const TOOLTIP_TITLE_GAP = 6;
export const TOOLTIP_LABEL_VALUE_GAP = 12;
export const TOOLTIP_TRANSITION = 'opacity 0.15s ease-out 0.05s';
export const TOOLTIP_DEFAULT_MIN_WIDTH = 80;

/* ============================================================================
 * ANIMATION — reveal
 * ========================================================================== */

export const REVEAL_DURATION_IN_SECONDS = 0.8;
export const REVEAL_EASING = 'linear';
export const POINT_FADE_DURATION_IN_SECONDS = 0.2;
/** Negative so points start fading in just before the line reveal completes. */
export const POINT_FADE_IN_AFTER_CLIP_IN_SECONDS = -0.1;

/* ============================================================================
 * ANIMATION — shimmer / pulse
 * ========================================================================== */

export const PULSE_DURATION_IN_SECONDS = 2;
export const PULSE_EASING = 'cubic-bezier(0.4, 0, 0.6, 1)';
