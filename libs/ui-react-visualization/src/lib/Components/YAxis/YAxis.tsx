import { useMemo } from 'react';

import { buildTicksData } from '../../utils/ticks/ticks';
import { useCartesianChartContext } from '../CartesianChart/context';

import type { YAxisProps } from './types';

const STROKE_WIDTH = 1;
const TICK_MARK_SIZE = 4;
const TICK_LABEL_OFFSET = 6;
export const DEFAULT_AXIS_WIDTH = 40;

export function YAxis({
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

  const axisX =
    position === 'start' ? drawingArea.x : drawingArea.x + drawingArea.width;

  const tickDirection = position === 'start' ? -1 : 1;
  const labelX = axisX + tickDirection * (TICK_MARK_SIZE + TICK_LABEL_OFFSET);

  return (
    <g data-testid='y-axis'>
      {showGrid &&
        ticksData.map((tick, i) => (
          <line
            key={`grid-${tick.value}-${i}`}
            x1={drawingArea.x}
            y1={tick.position}
            x2={drawingArea.x + drawingArea.width}
            y2={tick.position}
            style={{ stroke: 'var(--border-muted-subtle)' }}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray='2 2'
          />
        ))}

      {showLine && (
        <line
          x1={axisX}
          y1={drawingArea.y}
          x2={axisX}
          y2={drawingArea.y + drawingArea.height}
          style={{ stroke: 'var(--border-muted)' }}
          strokeWidth={STROKE_WIDTH}
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
            style={{ stroke: 'var(--border-muted)' }}
            strokeWidth={STROKE_WIDTH}
          />
        ))}

      {ticksData.map((tick, i) => (
        <text
          key={`label-${tick.value}-${i}`}
          x={labelX}
          y={tick.position}
          textAnchor={position === 'start' ? 'end' : 'start'}
          dominantBaseline='central'
          style={{ fill: 'var(--text-muted)' }}
          fontSize={11}
          fontFamily='Inter, system-ui, sans-serif'
        >
          {tick.label}
        </text>
      ))}
    </g>
  );
}
