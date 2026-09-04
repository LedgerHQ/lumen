import type { ScaleBand, ScaleLinear, ScaleLogarithmic } from 'd3-scale';

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
 * - `'stepAfter'` — stepped line where changes occur after the x-coordinate (`curveStepAfter`).
 * - `'stepBefore'` — stepped line where changes occur before the x-coordinate (`curveStepBefore`).
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
  /**
   * When true, skips null values and draws a continuous line across gaps.
   * When false (default), null values create gaps in the line.
   * Overridden by the chart-level `connectNulls` prop when that is set.
   * @default false
   */
  connectNulls?: boolean;
};

export type NumericScale =
  | ScaleLinear<number, number>
  | ScaleLogarithmic<number, number>;

export type CategoricalScale = ScaleBand<number>;

export type ChartScaleFunction = NumericScale | CategoricalScale;
