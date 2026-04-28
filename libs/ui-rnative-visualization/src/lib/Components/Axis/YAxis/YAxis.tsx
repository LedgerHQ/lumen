import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import { buildTicksData } from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { YAxisProps } from './types';

const STROKE_WIDTH = 1;
const TICK_MARK_SIZE = 4;
const TICK_LABEL_OFFSET = 6;
export const DEFAULT_AXIS_WIDTH = 40;

export const YAxis = ({
  position = 'start',
  showGrid = false,
  showLine = false,
  showTickMark = false,
  gridLineStyle = 'dashed',
  ticks: ticksProp,
  tickLabelFormatter,
}: YAxisProps) => {
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

  const isStart = position === 'start';
  const axisX = isStart ? drawingArea.x : drawingArea.x + drawingArea.width;
  const tickDirection = isStart ? -1 : 1;
  const labelX = axisX + tickDirection * (TICK_MARK_SIZE + TICK_LABEL_OFFSET);
  const fontSize = theme.typographies.body4.fontSize;
  const labelDy = fontSize * 0.35;

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
            strokeDasharray={gridLineStyle === 'dashed' ? '3 3' : undefined}
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
          fontSize={theme.typographies.body4.fontSize}
          fontFamily={theme.fontFamilies.sans}
        >
          {tick.label}
        </SvgText>
      ))}
    </G>
  );
};
