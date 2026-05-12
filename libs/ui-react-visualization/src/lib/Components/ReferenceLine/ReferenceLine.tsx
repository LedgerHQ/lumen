import { cssVar } from '@ledgerhq/lumen-design-core';
import { memo } from 'react';

import { useCartesianChartContext } from '../CartesianChart/context';

import { DEFAULT_STROKE, DASH_ARRAY, STROKE_WIDTH } from './constants';
import type { ReferenceLineProps } from './types';
import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  resolvePixel,
} from './utils';

const labelStyle = {
  fill: cssVar('var(--text-muted)'),
  fontSize: cssVar('var(--font-style-body-4-size)'),
  fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
  fontFamily: cssVar('var(--font-family-font)'),
};

export const ReferenceLine = memo((props: Readonly<ReferenceLineProps>) => {
  const {
    label,
    labelDx = 0,
    labelDy = 0,
    labelHorizontalAlignment,
    labelVerticalAlignment,
    stroke = DEFAULT_STROKE,
    lineStyle = 'dashed',
    opacity = 1,
  } = props;

  const { getXScale, getYScale, drawingArea } = useCartesianChartContext();

  const dashArray = lineStyle === 'dashed' ? DASH_ARRAY : undefined;

  if (props.dataY !== undefined) {
    const yPixel = resolvePixel(props.dataY, getYScale(), 'y', drawingArea);
    if (yPixel === undefined) return null;

    const labelCoords = label
      ? computeHorizontalLabelCoordinates(
          yPixel,
          props.labelPosition ?? 'right',
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

  if (props.dataX !== undefined) {
    const xPixel = resolvePixel(props.dataX, getXScale(), 'x', drawingArea);
    if (xPixel === undefined) return null;

    const labelCoords = label
      ? computeVerticalLabelCoordinates(
          xPixel,
          props.labelPosition ?? 'top',
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
});

ReferenceLine.displayName = 'ReferenceLine';
