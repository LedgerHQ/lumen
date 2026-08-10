import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { Easing } from 'react-native-reanimated';

import type { ChartInset } from './utils/types';

/**
 * Single source of truth for chart configuration.
 *
 * `chartConfig` holds theme-independent literals (geometry, opacities, ratios,
 * dash arrays). Values that map to design tokens on web (colors, stroke widths,
 * fonts, radius -- anything the web config wraps in `cssVar`) are resolved at
 * runtime via `useChartTokens`, since React Native tokens are provider-scoped.
 */
export const chartConfig = {
  root: {
    defaultHeight: 228,
    zeroPadding: { top: 0, right: 0, bottom: 0, left: 0 } as ChartInset,
  },

  axis: {
    defaultHeight: 28,
    defaultWidth: 40,
    tickMarkSize: 4,
    tickLabelOffset: 6,
    gridDashArray: '3 3',
  },

  line: {
    areaGradientOpacity: 0.25,
  },

  referenceLine: {
    dashArray: '0.1 6',
  },

  point: {
    defaultSize: 10,
    labelFontSize: 10,
    arrowWidth: 6,
    arrowHeight: 4,
    labelGap: 4,
    /** Approximate width of a character in the label font, as a ratio of the font size. */
    labelCharWidthRatio: 0.6,
  },

  scrubber: {
    beaconRadius: 5,
    overlayOffset: 2,
    overlayLineInset: 0.5,
    overlayOpacity: 0.8,
    lineGradientEdgeOpacity: 0.1,
  },

  tooltip: {
    defaultOffset: 10,
    defaultMinWidth: 80,
    paddingX: 8,
    paddingY: 8,
    rowHeight: 16,
    rowGap: 4,
    titleGap: 6,
    labelValueGap: 12,
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
    duration: 800,
    pointFadeDuration: 200,
    pointFadeInAfterClip: -100,
  },

  shimmer: {
    pulseDuration: 2000,
  },

  donut: {
    /** Defaults applied by `useDonutSeries` when preparing a raw series. */
    series: {
      maxSegments: 7,
      otherId: 'other',
      /** A tail shorter than this is kept as-is rather than folded into `other`. */
      minGroupedSegments: 2,
      /**
       * Floor on the segments kept before the tail, so an out-of-range
       * `groupBelowShare` (`1`, or `4` misread as "4%") can never fold the
       * whole series away.
       */
      minKeptSegments: 1,
    },
    /** Per-size ring geometry measured from Figma; kept in one place for refinement. */
    size: {
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
    },
    interaction: {
      dimOpacity: 0.3,
      opacityDurationMs: 150,
      popDurationMs: 180,
      popEasing: Easing.bezier(0.2, 0.8, 0.2, 1),
    },
    placeholder: {
      segmentValues: [25, 19, 15, 13, 10, 10, 8],
    },
    loading: {
      duration: 2000,
      minOpacity: 0.5,
      ariaLabel: 'Loading donut chart',
    },
  },
} as const;

/** Ring dimensions for a given size, in SVG user units. */
export type DonutGeometry = {
  box: number;
  innerRadius: number;
  outerRadius: number;
  cornerRadius: number;
  padAngle: number;
  /** How far an active segment pops outward, and the viewBox padding it needs. */
  activeOffset: number;
  /** Radial tolerance added when hit-testing taps near the ring edges. */
  hitSlopRadius: number;
};

export const DONUT_GEOMETRY = chartConfig.donut.size;

export const DONUT_INTERACTION = chartConfig.donut.interaction;

export type DonutSizeKey = keyof typeof DONUT_GEOMETRY;

type Theme = ReturnType<typeof useTheme>['theme'];

/**
 * Chart tokens resolved from the active theme, aliased by concept (not raw
 * token) so two aliases can diverge later even if equal today. Mirrors the
 * groups the web config wraps in `cssVar`.
 */
const resolveChartTokens = (t: Theme) =>
  ({
    color: {
      stroke: t.colors.border.muted,
      gridLine: t.colors.border.mutedSubtleTransparent,
      mutedLine: t.colors.border.mutedSubtle,
      markOutline: t.colors.bg.canvas,
      markFill: t.colors.bg.mutedStrong,
      surface: t.colors.bg.muted,
      text: t.colors.text.base,
      textMuted: t.colors.text.muted,
      scrubberLine: t.colors.border.base,
      scrubberOverlay: t.colors.bg.base,
    },
    stroke: {
      hairline: t.stroke.s1,
      line: t.stroke.s2,
    },
    font: {
      family: t.fontFamilies.sans,
      labelSize: t.typographies.body4.fontSize,
      labelWeightMedium: t.typographies.body4.fontWeight,
      bodySize: t.typographies.body3.fontSize,
      bodyWeightMedium: t.typographies.body3.fontWeight,
      bodyWeightSemiBold: t.typographies.body3SemiBold.fontWeight,
    },
    radius: {
      sm: t.borderRadius.sm,
    },
  }) as const;

export type ChartTokens = ReturnType<typeof resolveChartTokens>;

/**
 * The theme reference is stable per color scheme (memoized by the provider), so
 * caching by theme yields a single resolved object per theme app-wide with a
 * stable identity -- keeping primitive props stable for memoized SVG children.
 */
const chartTokensCache = new WeakMap<Theme, ChartTokens>();

export const useChartTokens = (): ChartTokens => {
  const { theme } = useTheme();
  let tokens = chartTokensCache.get(theme);
  if (!tokens) {
    tokens = resolveChartTokens(theme);
    chartTokensCache.set(theme, tokens);
  }
  return tokens;
};
