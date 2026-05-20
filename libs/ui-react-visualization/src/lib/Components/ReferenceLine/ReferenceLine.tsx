import { cssVar } from '@ledgerhq/lumen-design-core';

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

export function ReferenceLine({
  label,
  labelDx = 0,
  labelDy = 0,
  labelHorizontalAlignment,
  labelVerticalAlignment,
  labelPosition = 'end',
  stroke = DEFAULT_STROKE,
  lineStyle = 'dashed',
  ...props
}: Readonly<ReferenceLineProps>) {
  const { getXScale, getYScale, getXAxisConfig, getYAxisConfig, drawingArea } =
    useCartesianChartContext();

  const dashArray = lineStyle === 'dashed' ? DASH_ARRAY : undefined;

  if (props.dataY !== undefined) {
    const yPixel = resolvePixel({
      dataValue: props.dataY,
      scale: getYScale(),
      axis: 'y',
      drawingArea,
      axisConfig: getYAxisConfig(),
    });
    if (yPixel === undefined) return null;

    const labelCoords = label
      ? computeHorizontalLabelCoordinates({
          pixel: yPixel,
          labelPosition,
          drawingArea,
          dx: labelDx,
          dy: labelDy,
          horizontalAlignment: labelHorizontalAlignment,
          verticalAlignment: labelVerticalAlignment,
        })
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
        />
        {labelCoords && (
          <text
            data-testid='reference-line-label'
            x={labelCoords.x}
            y={labelCoords.y}
            textAnchor={labelCoords.textAnchor}
            dominantBaseline={labelCoords.dominantBaseline}
            style={labelStyle}
          >
            {label}
          </text>
        )}
      </g>
    );
  }

  if (props.dataX !== undefined) {
    const xPixel = resolvePixel({
      dataValue: props.dataX,
      scale: getXScale(),
      axis: 'x',
      drawingArea,
      axisConfig: getXAxisConfig(),
    });
    if (xPixel === undefined) return null;

    const labelCoords = label
      ? computeVerticalLabelCoordinates({
          pixel: xPixel,
          labelPosition,
          drawingArea,
          dx: labelDx,
          dy: labelDy,
          horizontalAlignment: labelHorizontalAlignment,
          verticalAlignment: labelVerticalAlignment,
        })
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
        />
        {labelCoords && (
          <text
            data-testid='reference-line-label'
            x={labelCoords.x}
            y={labelCoords.y}
            textAnchor={labelCoords.textAnchor}
            dominantBaseline={labelCoords.dominantBaseline}
            style={labelStyle}
          >
            {label}
          </text>
        )}
      </g>
    );
  }

  return null;
}
