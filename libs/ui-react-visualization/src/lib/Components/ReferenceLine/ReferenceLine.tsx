import { cssVar } from '@ledgerhq/lumen-design-core';

import { useCartesianChartContext } from '../CartesianChart/context';

import { DEFAULT_STROKE, DASH_ARRAY, STROKE_WIDTH } from './constants';
import type { ReferenceLineProps } from './types';
import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  resolveDataValue,
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
  stroke = DEFAULT_STROKE,
  lineStyle = 'dashed',
  opacity = 1,
  ...props
}: Readonly<ReferenceLineProps>) {
  const { getXScale, getYScale, getXAxisConfig, getYAxisConfig, drawingArea } =
    useCartesianChartContext();

  const dashArray = lineStyle === 'dashed' ? DASH_ARRAY : undefined;

  if (props.dataY !== undefined) {
    const yValue = resolveDataValue(props.dataY, getYAxisConfig());
    if (yValue === undefined) return null;
    const yPixel = resolvePixel(yValue, getYScale(), 'y', drawingArea);
    if (yPixel === undefined) return null;

    const labelCoords = label
      ? computeHorizontalLabelCoordinates(
          yPixel,
          props.labelPosition ?? 'right',
          drawingArea,
          {
            dx: labelDx,
            dy: labelDy,
            horizontalAlignment: labelHorizontalAlignment,
            verticalAlignment: labelVerticalAlignment,
          },
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
    const xValue = resolveDataValue(props.dataX, getXAxisConfig());
    if (xValue === undefined) return null;
    const xPixel = resolvePixel(xValue, getXScale(), 'x', drawingArea);
    if (xPixel === undefined) return null;

    const labelCoords = label
      ? computeVerticalLabelCoordinates(
          xPixel,
          props.labelPosition ?? 'top',
          drawingArea,
          {
            dx: labelDx,
            dy: labelDy,
            horizontalAlignment: labelHorizontalAlignment,
            verticalAlignment: labelVerticalAlignment,
          },
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
}
