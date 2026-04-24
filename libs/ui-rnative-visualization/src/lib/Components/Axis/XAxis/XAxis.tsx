import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { useMemo } from 'react';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import { buildTicksData } from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { XAxisProps } from './types';

const STROKE_WIDTH = 1;
const TICK_MARK_SIZE = 4;
const TICK_LABEL_OFFSET = 6;
const FONT_SIZE = 11;
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
  const { theme } = useTheme();

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

  const axisY =
    position === 'top' ? drawingArea.y : drawingArea.y + drawingArea.height;

  const tickDirection = position === 'top' ? -1 : 1;
  const labelY = axisY + tickDirection * (TICK_MARK_SIZE + TICK_LABEL_OFFSET);
  const labelDy = position === 'top' ? 0 : FONT_SIZE * 0.8;

  const gridStroke = theme.colors.border.mutedSubtle;
  const lineStroke = theme.colors.border.muted;
  const textFill = theme.colors.text.muted;

  return (
    <G>
      {showGrid &&
        ticksData.map((tick, i) => (
          <SvgLine
            key={`grid-${tick.value}-${i}`}
            x1={tick.position}
            y1={drawingArea.y}
            x2={tick.position}
            y2={drawingArea.y + drawingArea.height}
            stroke={gridStroke}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={gridLineStyle === 'dashed' ? '3 3' : undefined}
          />
        ))}

      {showLine && (
        <SvgLine
          x1={drawingArea.x}
          y1={axisY}
          x2={drawingArea.x + drawingArea.width}
          y2={axisY}
          stroke={lineStroke}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap='square'
        />
      )}

      {showTickMark &&
        ticksData.map((tick, i) => (
          <SvgLine
            key={`tick-${tick.value}-${i}`}
            x1={tick.position}
            y1={axisY}
            x2={tick.position}
            y2={axisY + tickDirection * TICK_MARK_SIZE}
            stroke={lineStroke}
            strokeWidth={STROKE_WIDTH}
          />
        ))}

      {ticksData.map((tick, i) => (
        <SvgText
          key={`label-${tick.value}-${i}`}
          x={tick.position}
          y={labelY}
          dy={labelDy}
          textAnchor='middle'
          fill={textFill}
          fontSize={FONT_SIZE}
          fontFamily='Inter'
        >
          {tick.label}
        </SvgText>
      ))}
    </G>
  );
}
