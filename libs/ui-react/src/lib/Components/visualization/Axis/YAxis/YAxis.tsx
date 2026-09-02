import { useMemo } from 'react';

import { chartConfig } from '../../../config';
import { buildTicksData } from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { YAxisProps } from './types';

const { axis, color, strokeWidth, font } = chartConfig;

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
    axisX + tickDirection * (axis.tickMarkSize + axis.tickLabelOffset);

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
              stroke: color.gridLine,
            }}
            strokeWidth={strokeWidth.hairline}
            strokeDasharray={
              gridLineStyle === 'dashed' ? axis.gridDashArray : undefined
            }
          />
        ))}

      {showLine && (
        <line
          x1={axisX}
          y1={drawingArea.y}
          x2={axisX}
          y2={drawingArea.y + drawingArea.height}
          style={{ stroke: axis.lineColor }}
          strokeWidth={strokeWidth.hairline}
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
            x2={axisX + tickDirection * axis.tickMarkSize}
            y2={tick.position}
            style={{ stroke: axis.lineColor }}
            strokeWidth={strokeWidth.hairline}
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
              fill: color.textMuted,
              fontSize: font.labelSize,
              fontFamily: font.family,
            }}
          >
            {tick.label}
          </text>
        ))}
    </g>
  );
}
