import { cssVar } from '@ledgerhq/lumen-design-core';
import { useMemo } from 'react';

import { projectPoint } from '../../utils/scales/scales';
import { useCartesianChartContext } from '../CartesianChart/context';

import type { PointProps } from './types';
import {
  buildArrowPoints,
  computeLabelY,
  DEFAULT_SIZE,
  isWithinBounds,
  resolveLabel,
  STROKE_WIDTH,
} from './utils';

export function Point({
  dataX,
  dataY,
  color,
  label,
  labelComponent,
  labelPosition = 'top',
  hidePoint = false,
  showArrow = true,
  size = DEFAULT_SIZE,
  onClick,
}: PointProps) {
  const { getXScale, getYScale, drawingArea } = useCartesianChartContext();

  const xScale = getXScale();
  const yScale = getYScale();

  const radius = size / 2;
  const fill = color ?? cssVar('var(--background-muted-strong)');

  const pixel = useMemo(() => {
    if (!xScale || !yScale) return undefined;
    return projectPoint(dataX, dataY, xScale, yScale);
  }, [dataX, dataY, xScale, yScale]);

  if (!pixel || !isWithinBounds(pixel.x, pixel.y, drawingArea)) {
    return null;
  }

  const resolvedLabel = resolveLabel(label, dataX);
  const hasLabel = labelComponent != null || resolvedLabel != null;
  const renderArrow = showArrow && hasLabel;
  const labelY = computeLabelY(pixel.y, radius, labelPosition, renderArrow);

  return (
    <g
      data-testid='point-group'
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {!hidePoint && (
        <circle
          data-testid='point-circle'
          cx={pixel.x}
          cy={pixel.y}
          r={radius}
          style={{
            fill,
            stroke: cssVar('var(--background-canvas)'),
          }}
          strokeWidth={STROKE_WIDTH}
        />
      )}
      {renderArrow && (
        <polygon
          data-testid='point-arrow'
          points={buildArrowPoints(pixel.x, pixel.y, radius, labelPosition)}
          style={{ fill: cssVar('var(--text-base)') }}
        />
      )}
      {labelComponent && (
        <g transform={`translate(${pixel.x},${labelY})`}>{labelComponent}</g>
      )}
      {!labelComponent && resolvedLabel != null && (
        <text
          data-testid='point-label'
          x={pixel.x}
          y={labelY}
          textAnchor='middle'
          dominantBaseline='auto'
          style={{
            fill: cssVar('var(--text-base)'),
            fontSize: cssVar('var(--font-style-body-4-size)'),
            fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
            fontFamily: cssVar('var(--font-family-font)'),
          }}
        >
          {resolvedLabel}
        </text>
      )}
    </g>
  );
}
