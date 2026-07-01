import { cssVar } from '@ledgerhq/lumen-design-core';
import { useMemo } from 'react';

import {
  AXIS_GRID_DASH_ARRAY,
  AXIS_LINE_COLOR,
  AXIS_TICK_LABEL_OFFSET,
  AXIS_TICK_MARK_SIZE,
  CHART_FONT_FAMILY,
  CHART_GRID_LINE_COLOR,
  CHART_HAIRLINE_STROKE_WIDTH,
  CHART_TEXT_MUTED_COLOR,
} from '../../../config';
import { buildTicksData } from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { YAxisProps } from './types';

export function YAxis({
  gridLineStyle = 'solid',
  position = 'start',
  showGrid = false,
  showLine = false,
  showTickMark = false,
  showLabels = true,
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
  const labelX =
    axisX + tickDirection * (AXIS_TICK_MARK_SIZE + AXIS_TICK_LABEL_OFFSET);

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
            style={{
              stroke: CHART_GRID_LINE_COLOR,
            }}
            strokeWidth={CHART_HAIRLINE_STROKE_WIDTH}
            strokeDasharray={
              gridLineStyle === 'dashed' ? AXIS_GRID_DASH_ARRAY : undefined
            }
          />
        ))}

      {showLine && (
        <line
          x1={axisX}
          y1={drawingArea.y}
          x2={axisX}
          y2={drawingArea.y + drawingArea.height}
          style={{ stroke: AXIS_LINE_COLOR }}
          strokeWidth={CHART_HAIRLINE_STROKE_WIDTH}
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
            x2={axisX + tickDirection * AXIS_TICK_MARK_SIZE}
            y2={tick.position}
            style={{ stroke: AXIS_LINE_COLOR }}
            strokeWidth={CHART_HAIRLINE_STROKE_WIDTH}
          />
        ))}

      {showLabels &&
        ticksData.map((tick, i) => (
          <text
            key={`label-${tick.value}-${i}`}
            x={labelX}
            y={tick.position}
            textAnchor={position === 'start' ? 'end' : 'start'}
            dominantBaseline='central'
            style={{
              fill: CHART_TEXT_MUTED_COLOR,
              fontSize: cssVar('var(--font-style-body-4-size)'),
              fontFamily: CHART_FONT_FAMILY,
            }}
          >
            {tick.label}
          </text>
        ))}
    </g>
  );
}
