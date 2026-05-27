import { area, curveBumpX, line } from 'd3-shape';

import { isCategoricalScale } from '../../utils/scales/scales';
import type {
  ChartScaleFunction,
  DrawingArea,
  NumericScale,
} from '../../utils/types';

type Point = [x: number, y: number];

/**
 * Project series data into scaled [x, y] pixel coordinates, skipping nulls.
 *
 * When `xData` contains numeric values, those values are fed into the scale
 * instead of the array index so the points honour a numeric X domain.
 */
export const toScaledPoints = (
  data: (number | null)[],
  xScale: ChartScaleFunction,
  yScale: NumericScale,
  xData?: readonly (string | number)[],
): Point[] | null => {
  const pts: Point[] = [];

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    if (value === null) continue;

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
export const buildLinePath = (points: Point[]): string | null => {
  return (
    line<Point>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(curveBumpX)(points) ?? null
  );
};

/**
 * Build the SVG `d` attribute for the filled area beneath the line.
 */
export const buildAreaPath = (
  points: Point[],
  drawingArea: DrawingArea,
): string | null => {
  const yBottom = drawingArea.y + drawingArea.height;

  return (
    area<Point>()
      .x((d) => d[0])
      .y0(yBottom)
      .y1((d) => d[1])
      .curve(curveBumpX)(points) ?? null
  );
};
