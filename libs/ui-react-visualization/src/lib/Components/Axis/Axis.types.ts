export type AxisBounds = {
  min: number;
  max: number;
};

export type BaseAxisProps = {
  /**
   * Whether to render grid lines at each tick.
   * @default false
   */
  showGrid?: boolean;
  /**
   * Appearance of the grid lines.
   * @default 'dashed'
   */
  gridLineStyle?: 'solid' | 'dashed';
  /**
   * Whether to render the axis baseline.
   * @default false
   */
  showLine?: boolean;
  /**
   * Whether to render tick marks at each tick position.
   * @default false
   */
  showTickMark?: boolean;
  /**
   * Whether to render the tick labels along the axis.
   * Set to `false` to keep ticks/grid while hiding their text labels.
   * @default true
   */
  showLabels?: boolean;
  /**
   * Explicit tick positions along the axis.
   * When omitted, ticks are computed automatically from the scale.
   */
  ticks?: number[];
  /**
   * Formats a tick value into its display label.
   * Receives the raw tick value (number or string label) and must return a string.
   */
  tickLabelFormatter?: (value: number | string) => string;
  /**
   * Scale algorithm used by this axis.
   * @default 'linear'
   */
  scaleType?: 'linear' | 'log' | 'band';
  /**
   * Explicit data values for band scales or category labels.
   * For band scales, provides the discrete domain. For numeric scales, string values
   * are used as tick labels at corresponding indices.
   */
  data?: string[] | number[];
  /**
   * Fixed domain bounds or a function that adjusts the computed bounds.
   * A partial object overrides only the specified bound(s).
   * A function receives the auto-computed bounds and returns adjusted ones.
   *
   * Applied before {@link BaseAxisProps.nice}. To keep your bounds exactly as
   * provided, set `nice: false` alongside a full `{ min, max }` override.
   */
  domain?: Partial<AxisBounds> | ((bounds: AxisBounds) => AxisBounds);
  /**
   * Round the domain outward to clean boundaries via d3's `.nice()`
   * (e.g. `[4, 98]` becomes `[0, 100]`).
   *
   * Defaults to `true`. Set to `false` to keep the domain exactly as provided
   * so data fills the plot area boundary-to-boundary — typically only useful
   * when you also pass a full `domain: { min, max }` and don't have overlays
   * (reference lines, scrubber positions, annotations) that may sit outside
   * the data range.
   *
   * Applied after any {@link BaseAxisProps.domain} override.
   */
  nice?: boolean;
};
