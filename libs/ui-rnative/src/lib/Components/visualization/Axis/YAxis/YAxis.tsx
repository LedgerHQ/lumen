import { useMemo } from 'react';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../../config';
import { buildTicksData } from '../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { YAxisProps } from './types';

export const DEFAULT_AXIS_WIDTH = chartConfig.axis.defaultWidth;

export const YAxis = ({
  position = 'start',
  showGrid = false,
  showLine = false,
  showTickMark = false,
  showLabels = true,
  gridLineStyle = 'dashed',
  ticks: ticksProp,
  tickLabelFormatter,
}: YAxisProps) => {
  const { getYScale, getYAxisConfig, drawingArea } = useCartesianChartContext();
  const tokens = useChartTokens();

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

  const { tickMarkSize, tickLabelOffset, gridDashArray } = chartConfig.axis;
  const isStart = position === 'start';
  const axisX = isStart ? drawingArea.x : drawingArea.x + drawingArea.width;
  const tickDirection = isStart ? -1 : 1;
  const labelX = axisX + tickDirection * (tickMarkSize + tickLabelOffset);
  const fontSize = tokens.font.labelSize;
  const labelDy = fontSize * 0.35;

  const gridStroke = tokens.color.gridLine;
  const lineStroke = tokens.color.stroke;
  const textFill = tokens.color.textMuted;
  const strokeWidth = tokens.stroke.hairline;

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
            strokeWidth={strokeWidth}
            strokeDasharray={
              gridLineStyle === 'dashed' ? gridDashArray : undefined
            }
          />
        ))}

      {showLine && (
        <SvgLine
          x1={axisX}
          y1={drawingArea.y}
          x2={axisX}
          y2={drawingArea.y + drawingArea.height}
          stroke={lineStroke}
          strokeWidth={strokeWidth}
          strokeLinecap='square'
        />
      )}

      {showTickMark &&
        ticksData.map((tick, i) => (
          <SvgLine
            key={`tick-${tick.value}-${i}`}
            x1={axisX}
            y1={tick.position}
            x2={axisX + tickDirection * tickMarkSize}
            y2={tick.position}
            stroke={lineStroke}
            strokeWidth={strokeWidth}
          />
        ))}

      {showLabels &&
        ticksData.map((tick, i) => (
          <SvgText
            key={`label-${tick.value}-${i}`}
            x={labelX}
            y={tick.position}
            dy={labelDy}
            textAnchor={position === 'start' ? 'end' : 'start'}
            fill={textFill}
            fontSize={tokens.font.labelSize}
            fontFamily={tokens.font.family}
          >
            {tick.label}
          </SvgText>
        ))}
    </G>
  );
};
