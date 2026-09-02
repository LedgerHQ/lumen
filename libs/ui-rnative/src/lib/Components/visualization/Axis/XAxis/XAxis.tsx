import { useMemo } from 'react';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import { useCartesianChartContext } from '../../CartesianChart/context';
import { chartConfig, useChartTokens } from '../../config';
import { buildTicksData } from '../../utils/ticks/ticks';

import type { XAxisProps } from './types';

export const DEFAULT_AXIS_HEIGHT = chartConfig.axis.defaultHeight;

export const XAxis = ({
  gridLineStyle = 'dashed',
  position = 'bottom',
  showGrid = false,
  showLine = false,
  showTickMark = false,
  showLabels = true,
  ticks: ticksProp,
  tickLabelFormatter,
}: XAxisProps) => {
  const { getXScale, getXAxisConfig, drawingArea } = useCartesianChartContext();
  const tokens = useChartTokens();

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

  const { tickMarkSize, tickLabelOffset, gridDashArray } = chartConfig.axis;
  const fontSize = tokens.font.labelSize;
  const tickDirection = isTop ? -1 : 1;
  const labelY = axisY + tickDirection * (tickMarkSize + tickLabelOffset);
  const labelDy = isTop ? 0 : fontSize * 0.8;

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
            x1={tick.position}
            y1={drawingArea.y}
            x2={tick.position}
            y2={drawingArea.y + drawingArea.height}
            stroke={gridStroke}
            strokeWidth={strokeWidth}
            strokeDasharray={
              gridLineStyle === 'dashed' ? gridDashArray : undefined
            }
          />
        ))}

      {showLine && (
        <SvgLine
          x1={drawingArea.x}
          y1={axisY}
          x2={drawingArea.x + drawingArea.width}
          y2={axisY}
          stroke={lineStroke}
          strokeWidth={strokeWidth}
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
            y2={axisY + tickDirection * tickMarkSize}
            stroke={lineStroke}
            strokeWidth={strokeWidth}
          />
        ))}

      {showLabels &&
        ticksData.map((tick, i) => (
          <SvgText
            key={`label-${tick.value}-${i}`}
            x={tick.position}
            y={labelY}
            dy={labelDy}
            textAnchor='middle'
            fill={textFill}
            fontSize={fontSize}
            fontFamily={tokens.font.family}
          >
            {tick.label}
          </SvgText>
        ))}
    </G>
  );
};
