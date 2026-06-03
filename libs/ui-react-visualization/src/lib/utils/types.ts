import type { ScaleBand, ScaleLinear, ScaleLogarithmic } from 'd3-scale';
import type { BaseAxisProps } from '../Components/Axis';

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
  data?: (number | null)[];
  /**
   * Human-readable label used in legends and tooltips.
   */
  label?: string;
  /**
   * CSS color applied to the series line/mark.
   */
  stroke: string;
};

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
  getXAxisConfig: (id?: string) => BaseAxisProps | undefined;
  /**
   * Returns the y-axis config. Accepts an optional axis ID for future multi-axis support.
   */
  getYAxisConfig: (id?: string) => BaseAxisProps | undefined;
  /**
   * Pixel bounds of the drawable region.
   */
  drawingArea: DrawingArea;
  /**
   * Number of data points along the x-axis.
   */
  dataLength: number;
};
