import { useTheme } from '@ledgerhq/lumen-ui-react';
import { useMemo } from 'react';

import { buildTicksData } from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { YAxisProps } from './types';

const STROKE_WIDTH = 1;
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
  const { theme } = useTheme();
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
        ticksData.map((tick, i) => (
          <line
            key={`grid-${tick.value}-${i}`}
            x1={drawingArea.x}
            y1={tick.position}
            x2={drawingArea.x + drawingArea.width}
            y2={tick.position}
            style={{ stroke: theme.colors.border.mutedSubtle }}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={gridLineStyle === 'dashed' ? '3 3' : undefined}
          />
        ))}

      {showLine && (
        <line
          x1={axisX}
          y1={drawingArea.y}
          x2={axisX}
          y2={drawingArea.y + drawingArea.height}
          style={{ stroke: theme.colors.border.muted }}
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
            style={{ stroke: theme.colors.border.muted }}
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
          style={{ fill: theme.colors.text.muted }}
          fontSize={theme.typographies.xs.body.body4.fontSize}
          fontFamily={theme.fontFamilies.sans}
        >
          {tick.label}
        </text>
      ))}
    </g>
  );
}
