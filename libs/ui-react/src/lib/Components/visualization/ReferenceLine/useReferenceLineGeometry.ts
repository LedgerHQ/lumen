import { useCartesianChartContext } from '../CartesianChart/context';

import type { ReferenceLineProps } from './types';
import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  resolvePixel,
  type LabelCoordinates,
} from './utils';

type ReferenceLineGeometry = {
  linePoints: { x1: number; y1: number; x2: number; y2: number };
  labelCoords: LabelCoordinates | null;
};

/**
 * Resolves a reference line's chart geometry: reads the chart context, projects
 * the targeted `dataX` (vertical) or `dataY` (horizontal) value to a validated
 * pixel, and derives the line endpoints and optional label coordinates.
 * Returns `null` when the value cannot be projected into the drawing area
 * (see {@link resolvePixel}) or when neither axis is set.
 */
export const useReferenceLineGeometry = (
  props: Readonly<ReferenceLineProps>,
): ReferenceLineGeometry | null => {
  const { getXScale, getYScale, getXAxisConfig, getYAxisConfig, drawingArea } =
    useCartesianChartContext();

  const labelArgs = {
    labelPosition: props.labelPosition ?? 'end',
    drawingArea,
    dx: props.labelDx ?? 0,
    dy: props.labelDy ?? 0,
    horizontalAlignment: props.labelHorizontalAlignment,
    verticalAlignment: props.labelVerticalAlignment,
  };

  if (props.dataY !== undefined) {
    const yPixel = resolvePixel({
      dataValue: props.dataY,
      scale: getYScale(),
      axis: 'y',
      drawingArea,
      axisConfig: getYAxisConfig(),
    });
    if (yPixel === undefined) return null;

    return {
      linePoints: {
        x1: drawingArea.x,
        y1: yPixel,
        x2: drawingArea.x + drawingArea.width,
        y2: yPixel,
      },
      labelCoords: props.label
        ? computeHorizontalLabelCoordinates({ pixel: yPixel, ...labelArgs })
        : null,
    };
  }

  const xPixel = resolvePixel({
    dataValue: props.dataX,
    scale: getXScale(),
    axis: 'x',
    drawingArea,
    axisConfig: getXAxisConfig(),
  });
  if (xPixel === undefined) return null;

  return {
    linePoints: {
      x1: xPixel,
      y1: drawingArea.y,
      x2: xPixel,
      y2: drawingArea.y + drawingArea.height,
    },
    labelCoords: props.label
      ? computeVerticalLabelCoordinates({ pixel: xPixel, ...labelArgs })
      : null,
  };
};
