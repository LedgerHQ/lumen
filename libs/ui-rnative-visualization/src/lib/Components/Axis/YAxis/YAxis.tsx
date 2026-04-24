import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { useMemo } from 'react';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import { buildTicksData } from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { YAxisProps } from './types';

const STROKE_WIDTH = 1;
const TICK_MARK_SIZE = 4;
const TICK_LABEL_OFFSET = 6;
const FONT_SIZE = 11;
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
  const { theme } = useTheme();

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
  const labelDy = FONT_SIZE * 0.35;

  const gridStroke = theme.colors.border.mutedSubtle;
  const lineStroke = theme.colors.border.muted;
  const textFill = theme.colors.text.muted;

  return (
    <G>
      {showGrid &&
        ticksData.map((tick, i) => (
          <SvgLine
            key={`grid-${tick.value}-${i}`}
            x1={drawingArea.x}
            y1={tick.position}
            x2={drawingArea.x + drawingArea.width}
            y2={tick.position}
            stroke={gridStroke}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray='2 2'
          />
        ))}

      {showLine && (
        <SvgLine
          x1={axisX}
          y1={drawingArea.y}
          x2={axisX}
          y2={drawingArea.y + drawingArea.height}
          stroke={lineStroke}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap='square'
        />
      )}

      {showTickMark &&
        ticksData.map((tick, i) => (
          <SvgLine
            key={`tick-${tick.value}-${i}`}
            x1={axisX}
            y1={tick.position}
            x2={axisX + tickDirection * TICK_MARK_SIZE}
            y2={tick.position}
            stroke={lineStroke}
            strokeWidth={STROKE_WIDTH}
          />
        ))}

      {ticksData.map((tick, i) => (
        <SvgText
          key={`label-${tick.value}-${i}`}
          x={labelX}
          y={tick.position}
          dy={labelDy}
          textAnchor={position === 'start' ? 'end' : 'start'}
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
