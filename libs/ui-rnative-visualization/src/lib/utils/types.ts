import type { ScaleBand, ScaleLinear, ScaleLogarithmic } from 'd3-scale';

export type AxisBounds = { min: number; max: number };

export type ChartInset = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/**
 * Pixel bounds of the drawable region.
 */
export type DrawingArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Series = {
  /**
   * Unique identifier for the series.
   */
  id: string;
  /**
   * Numeric data points; `null` entries represent gaps.
   */
  data?: Array<number | null>;
  /**
   * Human-readable label used in legends and tooltips.
   */
  label?: string;
  /**
   * CSS color applied to the series line/mark.
   */
  stroke: string;
};

export type AxisConfigProps = {
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
   */
  domain?: Partial<AxisBounds> | ((bounds: AxisBounds) => AxisBounds);
};

type AxisVisualProps = {
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
   * Explicit tick positions along the axis.
   * When omitted, ticks are computed automatically from the scale.
   */
  ticks?: number[];
  /**
   * Formats a tick value into its display label.
   * Receives the raw tick value (number or string label) and must return a string.
   */
  tickLabelFormatter?: (value: number | string) => string;
};

export type XAxisVisualProps = {
  /**
   * Where the x-axis is rendered relative to the drawing area.
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';
} & AxisVisualProps;

export type YAxisVisualProps = {
  /**
   * Where the y-axis is rendered relative to the drawing area.
   * @default 'start'
   */
  position?: 'start' | 'end';
} & AxisVisualProps;

export type NumericScale =
  | ScaleLinear<number, number>
  | ScaleLogarithmic<number, number>;

export type CategoricalScale = ScaleBand<number>;

export type ChartScaleFunction = NumericScale | CategoricalScale;

export type CartesianChartContextValue = {
  /**
   * All data series registered in the chart.
   */
  series: Series[];
  /**
   * Lookup map for series by ID. Stable reference when series identity is unchanged.
   */
  seriesMap: Map<string, Series>;
  /**
   * Returns the x-axis scale. Accepts an optional axis ID for future multi-axis support.
   */
  getXScale: (id?: string) => ChartScaleFunction | undefined;
  /**
   * Returns the y-axis scale. Accepts an optional axis ID for future multi-axis support.
   */
  getYScale: (id?: string) => ChartScaleFunction | undefined;
  /**
   * Returns the x-axis config. Accepts an optional axis ID for future multi-axis support.
   */
  getXAxisConfig: (id?: string) => AxisConfigProps | undefined;
  /**
   * Returns the y-axis config. Accepts an optional axis ID for future multi-axis support.
   */
  getYAxisConfig: (id?: string) => AxisConfigProps | undefined;
  /**
   * Pixel bounds of the drawable region.
   */
  drawingArea: DrawingArea;
  /**
   * Number of data points along the x-axis.
   */
  dataLength: number;
};
