import { getPointOnScale, isCategoricalScale } from '../../utils/scales/scales';
import type { ChartScaleFunction, DrawingArea } from '../../utils/types';
import type { BaseAxisProps } from '../Axis';

import type { LabelAlignment, LabelPosition } from './types';

const DEFAULT_H_ALIGN: LabelAlignment = 'center';
const DEFAULT_V_ALIGN: LabelAlignment = 'end';

type LabelCoordinates = {
  x: number;
  y: number;
  textAnchor: 'start' | 'middle' | 'end';
  dominantBaseline: 'hanging' | 'central' | 'auto';
};

const DY_RATIO: Record<LabelCoordinates['dominantBaseline'], number> = {
  auto: 0,
  central: 0.35,
  hanging: 0.8,
};

type ResolvePixelParams = {
  dataValue: number;
  scale: ChartScaleFunction | undefined;
  axis: 'x' | 'y';
  drawingArea: DrawingArea;
  axisConfig?: BaseAxisProps;
};

type LabelParams = {
  pixel: number;
  labelPosition: LabelPosition;
  drawingArea: DrawingArea;
  dx?: number;
  dy?: number;
  horizontalAlignment?: LabelAlignment;
  verticalAlignment?: LabelAlignment;
};

const textAnchorMap: Record<LabelAlignment, LabelCoordinates['textAnchor']> = {
  start: 'end',
  center: 'middle',
  end: 'start',
};

const dominantBaselineMap: Record<
  LabelAlignment,
  LabelCoordinates['dominantBaseline']
> = {
  start: 'auto',
  center: 'central',
  end: 'hanging',
};

const positionRatio: Record<LabelPosition, number> = {
  start: 0,
  center: 0.5,
  end: 1,
};

/**
 * Converts a `dominantBaseline` value to a `dy` pixel offset.
 * react-native-svg doesn't support `dominantBaseline`, so we emulate it
 * with a font-relative `dy` shift — same approach used by Axis components.
 */
export const dominantBaselineToDy = (
  baseline: LabelCoordinates['dominantBaseline'],
  fontSize: number,
): number => fontSize * DY_RATIO[baseline];

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
 * Translates a data index into the value the axis scale expects.
 * When the axis config contains numeric `data`, the index is mapped to the
 * corresponding value — returns `undefined` if the index is out of bounds.
 * When there is no numeric axis data the index is used directly.
 */
const resolveDataValue = (
  index: number,
  axisConfig?: BaseAxisProps,
): number | undefined => {
  const data = axisConfig?.data;
  if (!data || data.length === 0) return index;

  if (index < 0 || index >= data.length) return undefined;

  const axisValue = data[index];
  return typeof axisValue === 'number' ? axisValue : index;
};

/**
 * Resolves a data-space value to a validated pixel coordinate.
 * When `axisConfig` is provided, the data value is first translated
 * through the axis data array before being projected onto the scale.
 * Returns `undefined` if the value is out of bounds, the scale is missing,
 * the result is not finite, or the pixel falls outside the drawing area.
 */
export const resolvePixel = ({
  dataValue,
  scale,
  axis,
  drawingArea,
  axisConfig,
}: ResolvePixelParams): number | undefined => {
  const resolved = resolveDataValue(dataValue, axisConfig);
  if (resolved === undefined) return undefined;

  if (!scale) return undefined;

  if (isCategoricalScale(scale) && scale(resolved) === undefined)
    return undefined;

  const p = getPointOnScale(resolved, scale);

  if (!Number.isFinite(p) || !isPixelWithinDrawingArea(p, axis, drawingArea)) {
    return undefined;
  }
  return p;
};

/**
 * Computes the label pixel coordinates and text alignment attributes
 * for a horizontal reference line.
 */
export const computeHorizontalLabelCoordinates = ({
  pixel,
  labelPosition,
  drawingArea,
  dx = 0,
  dy = 0,
  horizontalAlignment,
  verticalAlignment,
}: LabelParams): LabelCoordinates => ({
  x: drawingArea.x + drawingArea.width * positionRatio[labelPosition] + dx,
  y: pixel + dy,
  textAnchor: textAnchorMap[horizontalAlignment ?? labelPosition],
  dominantBaseline: dominantBaselineMap[verticalAlignment ?? DEFAULT_V_ALIGN],
});

/**
 * Computes the label pixel coordinates and text alignment attributes
 * for a vertical reference line.
 */
export const computeVerticalLabelCoordinates = ({
  pixel,
  labelPosition,
  drawingArea,
  dx = 0,
  dy = 0,
  horizontalAlignment,
  verticalAlignment,
}: LabelParams): LabelCoordinates => ({
  x: pixel + dx,
  y: drawingArea.y + drawingArea.height * positionRatio[labelPosition] + dy,
  textAnchor: textAnchorMap[horizontalAlignment ?? DEFAULT_H_ALIGN],
  dominantBaseline: dominantBaselineMap[verticalAlignment ?? labelPosition],
});
