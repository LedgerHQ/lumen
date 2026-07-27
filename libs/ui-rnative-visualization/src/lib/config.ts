/**
 * Single source of truth for static chart constants, grouped by feature.
 *
 * This holds only theme-independent literals (geometry, opacities, ratios, dash
 * arrays). Values that map to design tokens on web (colors, stroke widths,
 * fonts, radius -- anything the web config wraps in `cssVar`) are resolved at
 * runtime via `useChartTokens`, since React Native tokens are provider-scoped.
 */
export const chartConfig = {
  point: {
    defaultSize: 10,
    labelFontSize: 10,
    arrowWidth: 6,
    arrowHeight: 4,
    gap: 4,
    /** Approximate width of a character in the label font, as a ratio of the font size. */
    labelCharWidthRatio: 0.6,
  },

  line: {
    areaGradientOpacity: 0.25,
  },

  scrubber: {
    beaconRadius: 5,
    labelOffsetY: 12,
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

  referenceLine: {
    dashArray: '0.1 6',
  },

  /** Per-size ring geometry measured from Figma; kept in one place for refinement. */
  donut: {
    md: {
      box: 168,
      innerRadius: 61,
      outerRadius: 83,
      cornerRadius: 4,
      padAngle: 0.06,
    },
    sm: {
      box: 80,
      innerRadius: 28,
      outerRadius: 39,
      cornerRadius: 2,
      padAngle: 0.08,
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
};

export const DONUT_GEOMETRY = chartConfig.donut;

export type DonutSizeKey = keyof typeof DONUT_GEOMETRY;
