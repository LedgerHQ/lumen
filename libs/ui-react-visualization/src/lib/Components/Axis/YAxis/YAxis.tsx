import { cssVar } from '@ledgerhq/lumen-design-core';
import { useMemo } from 'react';

import {
  buildTicksData,
  isTickOnYAxisDomainEdge,
} from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { YAxisProps } from './types';

const TICK_MARK_SIZE = 4;
const TICK_LABEL_OFFSET = 6;
export const DEFAULT_AXIS_WIDTH = 40;

export function YAxis({
  gridLineStyle = 'dashed',
  position = 'start',
  showGrid = false,
  showLine = false,
  showTickMark = false,
  ticks: ticksProp,
  tickLabelFormatter,
}: YAxisProps) {
  const { getYScale, getYAxisConfig, drawingArea } = useCartesianChartContext();

  const yScale = getYScale();
  const yAxisConfig = getYAxisConfig();

  const ticksData = useMemo(
    () =>
      yScale
        ? buildTicksData(yScale, yAxisConfig, ticksProp, tickLabelFormatter)
        : [],
    [yScale, yAxisConfig, ticksProp, tickLabelFormatter],
  );

  if (!yScale || drawingArea.height <= 0) {
    return null;
  }

  const isStart = position === 'start';
  const axisX = isStart ? drawingArea.x : drawingArea.x + drawingArea.width;
  const tickDirection = isStart ? -1 : 1;
  const labelX = axisX + tickDirection * (TICK_MARK_SIZE + TICK_LABEL_OFFSET);

  return (
    <g data-testid='y-axis'>
      {showGrid &&
        ticksData
          .filter((tick) => isTickOnYAxisDomainEdge(tick, drawingArea))
          .map((tick, i) => (
            <line
              key={`grid-${tick.value}-${i}`}
              x1={drawingArea.x}
              y1={tick.position}
              x2={drawingArea.x + drawingArea.width}
              y2={tick.position}
              style={{ stroke: cssVar('var(--border-muted-subtle)') }}
              strokeWidth={cssVar('var(--stroke-1)')}
              strokeDasharray={gridLineStyle === 'dashed' ? '3 3' : undefined}
            />
          ))}

      {showLine && (
        <line
          x1={axisX}
          y1={drawingArea.y}
          x2={axisX}
          y2={drawingArea.y + drawingArea.height}
          style={{ stroke: cssVar('var(--border-muted)') }}
          strokeWidth={cssVar('var(--stroke-1)')}
          shapeRendering='crispEdges'
          strokeLinecap='square'
        />
      )}

      {showTickMark &&
        ticksData.map((tick, i) => (
          <line
            key={`tick-${tick.value}-${i}`}
            x1={axisX}
            y1={tick.position}
            x2={axisX + tickDirection * TICK_MARK_SIZE}
            y2={tick.position}
            style={{ stroke: cssVar('var(--border-muted)') }}
            strokeWidth={cssVar('var(--stroke-1)')}
          />
        ))}

      {ticksData.map((tick, i) => (
        <text
          key={`label-${tick.value}-${i}`}
          x={labelX}
          y={tick.position}
          textAnchor={position === 'start' ? 'end' : 'start'}
          dominantBaseline='central'
          style={{
            fill: cssVar('var(--text-muted)'),
            fontSize: cssVar('var(--font-style-body-4-size)'),
            fontFamily: cssVar('var(--font-family-font)'),
          }}
        >
          {tick.label}
        </text>
      ))}
    </g>
  );
}
