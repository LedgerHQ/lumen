import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import {
  buildTicksData,
  isTickOnXAxisDomainEdge,
} from '../../../utils/ticks/ticks';
import { useCartesianChartContext } from '../../CartesianChart/context';

import type { XAxisProps } from './types';

const STROKE_WIDTH = 1;
const TICK_MARK_SIZE = 4;
const TICK_LABEL_OFFSET = 6;
export const DEFAULT_AXIS_HEIGHT = 28;

export const XAxis = ({
  gridLineStyle = 'dashed',
  position = 'bottom',
  showGrid = false,
  showLine = false,
  showTickMark = false,
  ticks: ticksProp,
  tickLabelFormatter,
}: XAxisProps) => {
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

  const isTop = position === 'top';
  const axisY = isTop ? drawingArea.y : drawingArea.y + drawingArea.height;

  const fontSize = theme.typographies.body4.fontSize;
  const tickDirection = isTop ? -1 : 1;
  const labelY = axisY + tickDirection * (TICK_MARK_SIZE + TICK_LABEL_OFFSET);
  const labelDy = isTop ? 0 : fontSize * 0.8;

  const gridStroke = theme.colors.border.mutedSubtle;
  const lineStroke = theme.colors.border.muted;
  const textFill = theme.colors.text.muted;

  return (
    <G>
      {showGrid &&
        ticksData
          .filter((tick) => isTickOnXAxisDomainEdge(tick, drawingArea))
          .map((tick, i) => (
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
          fontSize={fontSize}
          fontFamily={theme.fontFamilies.sans}
        >
          {tick.label}
        </SvgText>
      ))}
    </G>
  );
};
