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

import type { XAxisProps } from './types';

export function XAxis({
  gridLineStyle = 'solid',
  position = 'bottom',
  showGrid = false,
  showLine = false,
  showTickMark = false,
  showLabels = true,
  ticks: ticksProp,
  tickLabelFormatter,
}: XAxisProps) {
  const { getXScale, getXAxisConfig, drawingArea } = useCartesianChartContext();

  const xScale = getXScale();
  const xAxisConfig = getXAxisConfig();

  const ticksData = useMemo(
    () =>
      xScale
        ? buildTicksData(xScale, xAxisConfig, ticksProp, tickLabelFormatter)
        : [],
    [xScale, xAxisConfig, ticksProp, tickLabelFormatter],
  );

  if (!xScale || drawingArea.width <= 0) {
    return null;
  }

  const isTop = position === 'top';
  const axisY = isTop ? drawingArea.y : drawingArea.y + drawingArea.height;
  const tickDirection = isTop ? -1 : 1;
  const labelY =
    axisY + tickDirection * (AXIS_TICK_MARK_SIZE + AXIS_TICK_LABEL_OFFSET);

  return (
    <g data-testid='x-axis'>
      {showGrid &&
        ticksData.map((tick, i) => (
          <line
            key={`grid-${tick.value}-${i}`}
            x1={tick.position}
            y1={drawingArea.y}
            x2={tick.position}
            y2={drawingArea.y + drawingArea.height}
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
          x1={drawingArea.x}
          y1={axisY}
          x2={drawingArea.x + drawingArea.width}
          y2={axisY}
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
            x1={tick.position}
            y1={axisY}
            x2={tick.position}
            y2={axisY + tickDirection * AXIS_TICK_MARK_SIZE}
            style={{ stroke: AXIS_LINE_COLOR }}
            strokeWidth={CHART_HAIRLINE_STROKE_WIDTH}
          />
        ))}

      {showLabels &&
        ticksData.map((tick, i) => (
          <text
            key={`label-${tick.value}-${i}`}
            x={tick.position}
            y={labelY}
            textAnchor='middle'
            dominantBaseline={position === 'top' ? 'auto' : 'hanging'}
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
