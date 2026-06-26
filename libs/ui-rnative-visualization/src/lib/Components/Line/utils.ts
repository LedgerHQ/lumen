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

type Point = [x: number, y: number | null];

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
 * Project series data into scaled [x, y] pixel coordinates.
 *
 * When `xData` contains numeric values, those values are fed into the scale
 * instead of the array index so the points honour a numeric X domain.
 *
 * When `xData` is provided, iteration is capped at `xData.length` so a series
 * with more points than the axis has labels does not overflow past the right
 * edge of the chart. The axis is treated as authoritative for the X domain.
 *
 * Non-finite values (e.g. `null`) are handled according to `connectNulls`:
 * - `false` (default): kept as `[x, null]` holes so the line/area break into
 *   gaps via the generators' `.defined()` check.
 * - `true`: skipped entirely so the line is drawn continuously across gaps.
 */
export const toScaledPoints = (
  data: (number | null)[],
  xScale: ChartScaleFunction,
  yScale: NumericScale,
  xData?: readonly (string | number)[],
  connectNulls = false,
): Point[] | null => {
  const pts: Point[] = [];
  const limit = xData ? Math.min(data.length, xData.length) : data.length;
  let finiteCount = 0;

  for (let i = 0; i < limit; i++) {
    const value = data[i];
    const isFiniteValue = isFiniteNumber(value);

    if (!isFiniteValue && connectNulls) continue;

    const xInput =
      xData && typeof xData[i] === 'number' ? (xData[i] as number) : i;

    const x = isCategoricalScale(xScale)
      ? (xScale(xInput) ?? 0) + xScale.bandwidth() / 2
      : xScale(xInput);

    if (!isFiniteValue) {
      pts.push([x as number, null]);
      continue;
    }

    pts.push([x as number, yScale(value)]);
    finiteCount++;
  }

  return finiteCount >= 2 ? pts : null;
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
      .defined((d) => d[1] !== null)
      .x((d) => d[0])
      .y((d) => d[1] as number)
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
      .defined((d) => d[1] !== null)
      .x((d) => d[0])
      .y0(yBottom)
      .y1((d) => d[1] as number)
      .curve(getCurveFactory(curve))(points) ?? null
  );
};
