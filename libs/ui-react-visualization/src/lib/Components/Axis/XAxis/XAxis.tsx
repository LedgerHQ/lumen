import { useMemo } from 'react';

import { chartConfig } from '../../../config';
import { buildTicksData } from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { XAxisProps } from './types';

const { axis, color, strokeWidth, font } = chartConfig;

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
    axisY + tickDirection * (axis.tickMarkSize + axis.tickLabelOffset);

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
          x1={drawingArea.x}
          y1={axisY}
          x2={drawingArea.x + drawingArea.width}
          y2={axisY}
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
            x1={tick.position}
            y1={axisY}
            x2={tick.position}
            y2={axisY + tickDirection * axis.tickMarkSize}
            style={{ stroke: axis.lineColor }}
            strokeWidth={strokeWidth.hairline}
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
