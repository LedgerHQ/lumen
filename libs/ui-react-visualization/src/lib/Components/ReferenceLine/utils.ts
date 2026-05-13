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

type LabelCoordinates = {
  x: number;
  y: number;
  textAnchor: 'start' | 'middle' | 'end';
  dominantBaseline: 'hanging' | 'central' | 'auto';
};

const resolveTextAnchor = (
  alignment: TextHorizontalAlignment,
): LabelCoordinates['textAnchor'] => {
  switch (alignment) {
    case 'left':
      return 'start';
    case 'right':
      return 'end';
    case 'center':
    default:
      return 'middle';
  }
};

const resolveDominantBaseline = (
  alignment: TextVerticalAlignment,
): LabelCoordinates['dominantBaseline'] => {
  switch (alignment) {
    case 'top':
      return 'hanging';
    case 'middle':
      return 'central';
    case 'bottom':
    default:
      return 'auto';
  }
};

/**
 * Computes the label pixel coordinates and text alignment attributes
 * for a horizontal reference line.
 */
export const computeHorizontalLabelCoordinates = (
  yPixel: number,
  labelPosition: HorizontalLabelPosition,
  drawingArea: DrawingArea,
  labelDx: number,
  labelDy: number,
  horizontalAlignment?: TextHorizontalAlignment,
  verticalAlignment?: TextVerticalAlignment,
): LabelCoordinates => {
  let x: number;
  let defaultHorizontalAlignment: TextHorizontalAlignment;

  switch (labelPosition) {
    case 'left':
      x = drawingArea.x;
      defaultHorizontalAlignment = 'left';
      break;
    case 'center':
      x = drawingArea.x + drawingArea.width / 2;
      defaultHorizontalAlignment = 'center';
      break;
    case 'right':
    default:
      x = drawingArea.x + drawingArea.width;
      defaultHorizontalAlignment = 'right';
      break;
  }

  return {
    x: x + labelDx,
    y: yPixel + labelDy,
    textAnchor: resolveTextAnchor(
      horizontalAlignment ?? defaultHorizontalAlignment,
    ),
    dominantBaseline: resolveDominantBaseline(verticalAlignment ?? 'bottom'),
  };
};

/**
 * Computes the label pixel coordinates and text alignment attributes
 * for a vertical reference line.
 */
export const computeVerticalLabelCoordinates = (
  xPixel: number,
  labelPosition: VerticalLabelPosition,
  drawingArea: DrawingArea,
  labelDx: number,
  labelDy: number,
  horizontalAlignment?: TextHorizontalAlignment,
  verticalAlignment?: TextVerticalAlignment,
): LabelCoordinates => {
  let y: number;
  let defaultVerticalAlignment: TextVerticalAlignment;

  switch (labelPosition) {
    case 'top':
      y = drawingArea.y;
      defaultVerticalAlignment = 'top';
      break;
    case 'middle':
      y = drawingArea.y + drawingArea.height / 2;
      defaultVerticalAlignment = 'middle';
      break;
    case 'bottom':
    default:
      y = drawingArea.y + drawingArea.height;
      defaultVerticalAlignment = 'bottom';
      break;
  }

  return {
    x: xPixel + labelDx,
    y: y + labelDy,
    textAnchor: resolveTextAnchor(horizontalAlignment ?? 'center'),
    dominantBaseline: resolveDominantBaseline(
      verticalAlignment ?? defaultVerticalAlignment,
    ),
  };
};
