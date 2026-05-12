import { cssVar } from '@ledgerhq/lumen-design-core';
import { memo } from 'react';

import { getPointOnScale } from '../../utils/scales/scales';
import { useCartesianChartContext } from '../CartesianChart/context';

import { DEFAULT_STROKE, DASH_ARRAY, STROKE_WIDTH } from './constants';
import type { ReferenceLineProps } from './types';
import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  isPixelWithinDrawingArea,
} from './utils';

const labelStyle = {
  fill: cssVar('var(--text-muted)'),
  fontSize: cssVar('var(--font-style-body-4-size)'),
  fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
  fontFamily: cssVar('var(--font-family-font)'),
};

export const ReferenceLine = memo(
  ({
    label,
    labelDx = 0,
    labelDy = 0,
    labelHorizontalAlignment,
    labelVerticalAlignment,
    stroke = DEFAULT_STROKE,
    lineStyle = 'dashed',
    opacity = 1,
    dataY,
    dataX,
    labelPosition,
  }: Readonly<ReferenceLineProps>) => {
    const { getXScale, getYScale, drawingArea } = useCartesianChartContext();

    const dashArray = lineStyle === 'dashed' ? DASH_ARRAY : undefined;

    if (dataY !== undefined) {
      const yScale = getYScale();
      if (!yScale) return null;

      const yPixel = getPointOnScale(dataY, yScale);
      if (!Number.isFinite(yPixel)) return null;
      if (!isPixelWithinDrawingArea(yPixel, 'y', drawingArea)) return null;

      const labelCoords = label
        ? computeHorizontalLabelCoordinates(
            yPixel,
            labelPosition ?? 'right',
            drawingArea,
            labelDx,
            labelDy,
            labelHorizontalAlignment,
            labelVerticalAlignment,
          )
        : null;

      return (
        <g data-testid='reference-line'>
          <line
            data-testid='reference-line-line'
            x1={drawingArea.x}
            y1={yPixel}
            x2={drawingArea.x + drawingArea.width}
            y2={yPixel}
            stroke={stroke}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={dashArray}
            strokeLinecap='round'
            opacity={opacity}
          />
          {labelCoords && (
            <text
              data-testid='reference-line-label'
              x={labelCoords.x}
              y={labelCoords.y}
              textAnchor={labelCoords.textAnchor}
              dominantBaseline={labelCoords.dominantBaseline}
              style={labelStyle}
              opacity={opacity}
            >
              {label}
            </text>
          )}
        </g>
      );
    }

    if (dataX !== undefined) {
      const xScale = getXScale();
      if (!xScale) return null;

      const xPixel = getPointOnScale(dataX, xScale);
      if (!Number.isFinite(xPixel)) return null;
      if (!isPixelWithinDrawingArea(xPixel, 'x', drawingArea)) return null;

      const labelCoords = label
        ? computeVerticalLabelCoordinates(
            xPixel,
            labelPosition ?? 'top',
            drawingArea,
            labelDx,
            labelDy,
            labelHorizontalAlignment,
            labelVerticalAlignment,
          )
        : null;

      return (
        <g data-testid='reference-line'>
          <line
            data-testid='reference-line-line'
            x1={xPixel}
            y1={drawingArea.y}
            x2={xPixel}
            y2={drawingArea.y + drawingArea.height}
            stroke={stroke}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={dashArray}
            strokeLinecap='round'
            opacity={opacity}
          />
          {labelCoords && (
            <text
              data-testid='reference-line-label'
              x={labelCoords.x}
              y={labelCoords.y}
              textAnchor={labelCoords.textAnchor}
              dominantBaseline={labelCoords.dominantBaseline}
              style={labelStyle}
              opacity={opacity}
            >
              {label}
            </text>
          )}
        </g>
      );
    }

    return null;
  },
);

ReferenceLine.displayName = 'ReferenceLine';
