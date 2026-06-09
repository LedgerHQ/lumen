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

/**
 * Interpolation used to draw a line (and its area) between data points.
 * Each value maps to a [d3-shape](https://d3js.org/d3-shape/curve) curve:
 * - `'bump'` — smooth cubic curve with horizontal tangents (`curveBumpX`).
 * - `'natural'` — natural cubic spline through every point (`curveNatural`).
 * - `'monotone'` — smooth curve that preserves monotonicity (`curveMonotoneX`).
 * - `'linear'` — straight segments between points (`curveLinear`).
 * - `'step'` — stepped, piecewise-constant line (`curveStep`).
 */
export type CurveType =
  | 'bump'
  | 'natural'
  | 'monotone'
  | 'linear'
  | 'step'
  | 'stepAfter'
  | 'stepBefore';

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
   * Color applied to the series line/mark.
   * @default border-muted
   */
  stroke?: string;
  /**
   * Interpolation used to draw the line between data points.
   * @default 'bump'
   */
  curve?: CurveType;
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
