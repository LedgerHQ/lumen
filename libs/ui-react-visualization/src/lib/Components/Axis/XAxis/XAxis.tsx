import { cssVar } from '@ledgerhq/lumen-design-core';
import { useMemo } from 'react';

import { buildTicksData } from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { XAxisProps } from './types';

const TICK_MARK_SIZE = 4;
const TICK_LABEL_OFFSET = 6;
export const DEFAULT_AXIS_HEIGHT = 28;

export function XAxis({
  gridLineStyle = 'dashed',
  position = 'bottom',
  showGrid = false,
  showLine = false,
  showTickMark = false,
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
  const labelY = axisY + tickDirection * (TICK_MARK_SIZE + TICK_LABEL_OFFSET);

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
            style={{ stroke: cssVar('var(--border-muted-subtle)') }}
            strokeWidth={cssVar('var(--stroke-1)')}
            strokeDasharray={gridLineStyle === 'dashed' ? '3 3' : undefined}
          />
        ))}

      {showLine && (
        <line
          x1={drawingArea.x}
          y1={axisY}
          x2={drawingArea.x + drawingArea.width}
          y2={axisY}
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
            x1={tick.position}
            y1={axisY}
            x2={tick.position}
            y2={axisY + tickDirection * TICK_MARK_SIZE}
            style={{ stroke: cssVar('var(--border-muted)') }}
            strokeWidth={cssVar('var(--stroke-1)')}
          />
        ))}

      {ticksData.map((tick, i) => (
        <>
          {' '}
          <text
            key={`label-${tick.value}-${i}`}
            x={tick.position}
            y={labelY}
            textAnchor='middle'
            dominantBaseline={position === 'top' ? 'auto' : 'hanging'}
            style={{
              fill: cssVar('var(--text-muted)'),
              fontSize: cssVar('var(--font-style-body-4-size)'),
              fontFamily: cssVar('var(--font-family-font)'),
            }}
          >
            {tick.label}
          </text>
        </>
      ))}
    </g>
  );
}
