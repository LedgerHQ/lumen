import { cssVar } from '@ledgerhq/lumen-design-core';

import type { ChartInset } from './utils/types';

/**
 * Single source of truth for chart constants, grouped by feature. Shared groups
 * (`color`, `strokeWidth`, `font`) are aliased by concept, not raw token, so two
 * aliases can diverge later even if equal today.
 */
export const chartConfig = {
  color: {
    stroke: cssVar('var(--border-muted)'),
    gridLine: cssVar('var(--border-muted-subtle-transparent)'),
    mutedLine: cssVar('var(--border-muted-subtle)'),
    markOutline: cssVar('var(--background-canvas)'),
    textMuted: cssVar('var(--text-muted)'),
    text: cssVar('var(--text-base)'),
  },
  strokeWidth: {
    hairline: cssVar('var(--stroke-1)'),
    line: cssVar('var(--stroke-2)'),
  },
  font: {
    family: cssVar('var(--font-family-font)'),
    labelSize: cssVar('var(--font-style-body-4-size)'),
    labelWeightMedium: cssVar('var(--font-style-body-4-weight-medium)'),
    bodySize: cssVar('var(--font-style-body-3-size)'),
    bodyWeightMedium: cssVar('var(--font-style-body-3-weight-medium)'),
    bodyWeightSemiBold: cssVar('var(--font-style-body-3-weight-semi-bold)'),
  },

  chart: {
    defaultHeight: 240,
    zeroPadding: { top: 0, right: 0, bottom: 0, left: 0 } as ChartInset,
  },

  axis: {
    defaultHeight: 28,
    defaultWidth: 40,
    tickMarkSize: 4,
    tickLabelOffset: 6,
    gridDashArray: '3 3',
    lineColor: cssVar('var(--border-muted)'),
  },

  line: {
    areaGradientOpacity: 0.25,
  },

  referenceLine: {
    strokeWidth: 2,
    dashArray: '0.1 6',
  },

  point: {
    defaultSize: 10,
    strokeWidth: 2,
    arrowWidth: 6,
    arrowHeight: 4,
    labelGap: 4,
    labelFontSize: 10,
    defaultColor: cssVar('var(--background-muted-strong)'),
    /** Character width as a ratio of the label font size. */
    labelCharWidthRatio: 0.6,
  },

  scrubber: {
    beaconRadius: 5,
    beaconStrokeWidth: 2,
    lineColor: cssVar('var(--border-base)'),
    overlayColor: cssVar('var(--background-base)'),
    overlayOffset: 2,
    overlayLineInset: 0.5,
    overlayOpacity: 0.8,
    lineGradientEdgeOpacity: 0.1,
    defaultMagnetRadius: 8,
    keyboardStep: 1,
    /** Fraction of the data range moved per shift + arrow-key press. */
    keyboardPageStepRatio: 0.1,
    keyboardPageStepMin: 1,
    keyboardPageStepMax: 10,
  },

  tooltip: {
    defaultOffset: 10,
    paddingX: 8,
    paddingY: 8,
    rowHeight: 16,
    rowGap: 4,
    titleGap: 6,
    labelValueGap: 12,
    transition: 'opacity 0.15s ease-out 0.05s',
    defaultMinWidth: 80,
    background: cssVar('var(--background-muted)'),
    borderRadius: cssVar('var(--border-radius-sm)'),
  },

  emptyState: {
    minDrawablePoints: 2,
    loadingAriaLabel: 'Loading chart',
    defaultLabel: 'No data',
    gridLineRatios: [0.3, 0.5, 0.7],
    placeholderViewWidth: 728,
    placeholderViewHeight: 208,
    placeholderLinePath:
      'M1.00 128.27 C4.02 127.46 13.09 125.96 19.13 123.47 C25.19 120.97 31.23 116.53 37.28 113.31 C43.33 110.10 49.38 106.15 55.42 104.20 C61.48 102.24 67.52 102.53 73.57 101.61 C79.61 100.69 85.65 99.89 91.71 98.70 C97.75 97.51 103.80 95.67 109.84 94.47 C115.90 93.27 121.94 91.71 127.99 91.49 C134.03 91.26 140.09 91.53 146.13 93.16 C152.19 94.79 158.23 98.37 164.27 101.25 C170.32 104.13 176.36 108.16 182.42 110.45 C188.46 112.74 194.51 114.41 200.55 115.00 C206.61 115.60 212.65 114.56 218.70 114.03 C224.75 113.50 230.80 112.56 236.84 111.86 C242.88 111.17 248.94 110.27 254.98 109.87 C261.03 109.48 267.07 109.14 273.13 109.49 C279.17 109.82 285.22 110.90 291.26 111.90 C297.32 112.90 303.36 114.47 309.41 115.50 C315.46 116.54 321.50 118.12 327.55 118.11 C333.59 118.10 339.65 118.08 345.69 115.45 C351.74 112.81 357.78 107.02 363.84 102.29 C369.88 97.54 375.93 90.87 381.97 87.01 C388.03 83.16 394.07 79.81 400.11 79.12 C406.17 78.43 412.21 80.79 418.26 82.88 C424.30 84.99 430.36 88.88 436.40 91.74 C442.45 94.59 448.49 98.24 454.55 100.02 C460.59 101.80 466.64 102.08 472.68 102.44 C478.72 102.81 484.78 102.31 490.82 102.21 C496.87 102.11 502.92 101.95 508.97 101.84 C515.01 101.74 521.07 101.47 527.11 101.58 C533.16 101.68 539.20 101.57 545.26 102.48 C551.30 103.39 557.34 105.37 563.39 107.02 C569.43 108.68 575.49 111.02 581.53 112.40 C587.59 113.79 593.63 114.62 599.68 115.30 C605.72 115.98 611.78 115.81 617.82 116.48 C623.87 117.16 629.91 118.39 635.95 119.32 C642.01 120.25 648.05 121.51 654.10 122.04 C660.15 122.57 666.20 123.89 672.24 122.47 C678.30 121.07 684.34 117.39 690.39 113.54 C696.43 109.69 702.49 103.53 708.53 99.38 C714.57 95.23 722.31 90.65 726.66 88.61',
  },

  reveal: {
    durationInSeconds: 0.8,
    easing: 'linear',
    pointFadeDurationInSeconds: 0.2,
    pointFadeInAfterClipInSeconds: -0.1,
  },

  shimmer: {
    pulseDurationInSeconds: 2,
    pulseEasing: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};
