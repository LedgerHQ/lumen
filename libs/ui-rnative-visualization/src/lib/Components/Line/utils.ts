import {
  area,
  curveBumpX,
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  line,
  type CurveFactory,
} from 'd3-shape';

import { isFiniteNumber } from '../../utils/numbers';
import { isCategoricalScale } from '../../utils/scales/scales';
import type {
  ChartScaleFunction,
  CurveType,
  DrawingArea,
  NumericScale,
} from '../../utils/types';

type Point = [x: number, y: number];

/**
 * Maps the public `CurveType` values to their d3-shape curve factories.
 */
const CURVE_FACTORIES: Record<CurveType, CurveFactory> = {
  bump: curveBumpX,
  linear: curveLinear,
  monotone: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
  stepAfter: curveStepAfter,
  stepBefore: curveStepBefore,
};

const DEFAULT_CURVE: CurveType = 'bump';

const getCurveFactory = (curve: CurveType = DEFAULT_CURVE): CurveFactory =>
  CURVE_FACTORIES[curve] ?? CURVE_FACTORIES[DEFAULT_CURVE];

/**
 * Project series data into scaled [x, y] pixel coordinates, skipping any
 * non-finite entries.
 *
 * When `xData` contains numeric values, those values are fed into the scale
 * instead of the array index so the points honour a numeric X domain.
 *
 * When `xData` is provided, iteration is capped at `xData.length` so a series
 * with more points than the axis has labels does not overflow past the right
 * edge of the chart. The axis is treated as authoritative for the X domain.
 */
export const toScaledPoints = (
  data: (number | null)[],
  xScale: ChartScaleFunction,
  yScale: NumericScale,
  xData?: readonly (string | number)[],
): Point[] | null => {
  const pts: Point[] = [];
  const limit = xData ? Math.min(data.length, xData.length) : data.length;

  for (let i = 0; i < limit; i++) {
    const value = data[i];
    if (!isFiniteNumber(value)) continue;

    const xInput =
      xData && typeof xData[i] === 'number' ? (xData[i] as number) : i;

    const x = isCategoricalScale(xScale)
      ? (xScale(xInput) ?? 0) + xScale.bandwidth() / 2
      : xScale(xInput);
    const y = yScale(value);

    pts.push([x as number, y]);
  }

  return pts.length >= 2 ? pts : null;
};

/**
 * Build the SVG `d` attribute for the line stroke.
 */
export const buildLinePath = (
  points: Point[],
  curve?: CurveType,
): string | null => {
  return (
    line<Point>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(getCurveFactory(curve))(points) ?? null
  );
};

/**
 * Build the SVG `d` attribute for the filled area beneath the line.
 */
export const buildAreaPath = (
  points: Point[],
  drawingArea: DrawingArea,
  curve?: CurveType,
): string | null => {
  const yBottom = drawingArea.y + drawingArea.height;

  return (
    area<Point>()
      .x((d) => d[0])
      .y0(yBottom)
      .y1((d) => d[1])
      .curve(getCurveFactory(curve))(points) ?? null
  );
};
