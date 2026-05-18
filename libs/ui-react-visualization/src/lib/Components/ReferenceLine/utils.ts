import { getPointOnScale, isCategoricalScale } from '../../utils/scales/scales';
import type {
  AxisConfigProps,
  ChartScaleFunction,
  DrawingArea,
} from '../../utils/types';

import type {
  HorizontalLabelPosition,
  TextHorizontalAlignment,
  TextVerticalAlignment,
  VerticalLabelPosition,
} from './types';

const DEFAULT_H_ALIGN: TextHorizontalAlignment = 'center';
const DEFAULT_V_ALIGN: TextVerticalAlignment = 'bottom';

type LabelCoordinates = {
  x: number;
  y: number;
  textAnchor: 'start' | 'middle' | 'end';
  dominantBaseline: 'hanging' | 'central' | 'auto';
};

export type LabelOptions = {
  dx?: number;
  dy?: number;
  horizontalAlignment?: TextHorizontalAlignment;
  verticalAlignment?: TextVerticalAlignment;
};

const textAnchorMap: Record<
  TextHorizontalAlignment,
  LabelCoordinates['textAnchor']
> = {
  left: 'start',
  center: 'middle',
  right: 'end',
};

const dominantBaselineMap: Record<
  TextVerticalAlignment,
  LabelCoordinates['dominantBaseline']
> = {
  top: 'hanging',
  middle: 'central',
  bottom: 'auto',
};

const horizontalRatio: Record<HorizontalLabelPosition, number> = {
  left: 0,
  center: 0.5,
  right: 1,
};

const verticalRatio: Record<VerticalLabelPosition, number> = {
  top: 0,
  middle: 0.5,
  bottom: 1,
};

/**
 * Checks whether a pixel coordinate falls within the drawing area
 * along a single axis.
 */
export const isPixelWithinDrawingArea = (
  pixel: number,
  axis: 'x' | 'y',
  drawingArea: DrawingArea,
): boolean => {
  if (axis === 'x') {
    return pixel >= drawingArea.x && pixel <= drawingArea.x + drawingArea.width;
  }
  return pixel >= drawingArea.y && pixel <= drawingArea.y + drawingArea.height;
};

/**
 * Converts a data-space value to a validated pixel coordinate.
 * Returns `undefined` if the scale is missing, the result is not finite,
 * or the pixel falls outside the drawing area.
 */
export const resolvePixel = (
  dataValue: number,
  scale: ChartScaleFunction | undefined,
  axis: 'x' | 'y',
  drawingArea: DrawingArea,
): number | undefined => {
  if (!scale) return undefined;

  if (isCategoricalScale(scale) && scale(dataValue) === undefined)
    return undefined;

  const p = getPointOnScale(dataValue, scale);

  if (!Number.isFinite(p)) return undefined;
  if (!isPixelWithinDrawingArea(p, axis, drawingArea)) return undefined;
  return p;
};

/**
 * Translates a data index into the value the axis scale expects.
 * When the axis config contains numeric `data`, the index is mapped to the
 * corresponding value — returns `undefined` if the index is out of bounds.
 * When there is no numeric axis data the index is used directly.
 */
export const resolveDataValue = (
  index: number,
  axisConfig?: AxisConfigProps,
): number | undefined => {
  const data = axisConfig?.data;
  if (!data || data.length === 0) return index;

  if (index < 0 || index >= data.length) return undefined;

  const axisValue = data[index];
  return typeof axisValue === 'number' ? axisValue : index;
};

/**
 * Computes the label pixel coordinates and text alignment attributes
 * for a horizontal reference line.
 */
export const computeHorizontalLabelCoordinates = (
  yPixel: number,
  labelPosition: HorizontalLabelPosition,
  drawingArea: DrawingArea,
  options?: LabelOptions,
): LabelCoordinates => ({
  x:
    drawingArea.x +
    drawingArea.width * horizontalRatio[labelPosition] +
    (options?.dx ?? 0),
  y: yPixel + (options?.dy ?? 0),
  textAnchor: textAnchorMap[options?.horizontalAlignment ?? labelPosition],
  dominantBaseline:
    dominantBaselineMap[options?.verticalAlignment ?? DEFAULT_V_ALIGN],
});

/**
 * Computes the label pixel coordinates and text alignment attributes
 * for a vertical reference line.
 */
export const computeVerticalLabelCoordinates = (
  xPixel: number,
  labelPosition: VerticalLabelPosition,
  drawingArea: DrawingArea,
  options?: LabelOptions,
): LabelCoordinates => ({
  x: xPixel + (options?.dx ?? 0),
  y:
    drawingArea.y +
    drawingArea.height * verticalRatio[labelPosition] +
    (options?.dy ?? 0),
  textAnchor: textAnchorMap[options?.horizontalAlignment ?? DEFAULT_H_ALIGN],
  dominantBaseline:
    dominantBaselineMap[options?.verticalAlignment ?? labelPosition],
});
