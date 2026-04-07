import { useMemo } from 'react';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryStack,
  VictoryGroup,
  VictoryTooltip,
} from 'victory';
import type { BarChartProps } from '../types';
import {
  GRID_LINE_STROKE,
  GRID_LINE_STROKE_DASHARRAY,
  GRID_LINE_STROKE_WIDTH,
} from '../utils';

export const BarChartVictory = (props: BarChartProps) => {
  const {
    data,
    series,
    width,
    height,
    layout = 'grouped',
    formatYLabel,
    showGrid = true,
    showTooltip = true,
    showXLabels = true,
    showYLabels = true,
    className,
  } = props;

  const victoryData = useMemo(
    () =>
      series.map((s) => ({
        id: s.id,
        label: s.label ?? s.id,
        color: s.color,
        data: data.map((d) => ({
          x: d.category,
          y: d.values[s.id] ?? 0,
        })),
      })),
    [data, series],
  );

  const bars = victoryData.map((s) => (
    <VictoryBar
      key={s.id}
      data={s.data}
      animate={false}
      style={{ data: { fill: s.color } }}
      cornerRadius={layout === 'stacked' ? 0 : { top: 4 }}
      labels={
        showTooltip
          ? ({
              datum,
            }: {
              datum: { x: string; y: number };
            }): string =>
              `${s.label}: ${formatYLabel ? formatYLabel(datum.y) : datum.y}`
          : undefined
      }
      labelComponent={
        showTooltip ? (
          <VictoryTooltip
            cornerRadius={8}
            flyoutStyle={{
              fill: 'var(--background-surface)',
              stroke: 'var(--border-muted)',
              strokeWidth: 1,
            }}
            style={{ fontSize: 11, fill: 'var(--text-base)' }}
            flyoutPadding={{ top: 8, bottom: 8, left: 12, right: 12 }}
          />
        ) : undefined
      }
    />
  ));

  const Wrapper = layout === 'stacked' ? VictoryStack : VictoryGroup;

  return (
    <div className={className}>
      <VictoryChart
        animate={false}
        width={width}
        height={height}
        padding={{ top: 16, right: 16, bottom: 40, left: 60 }}
        domainPadding={{ x: 30 }}
      >
        <VictoryAxis
          animate={false}
          style={{
            axis: { stroke: 'var(--border-muted)' },
            tickLabels: {
              fontSize: 11,
              fill: showXLabels ? 'var(--text-muted)' : 'transparent',
              padding: 5,
            },
            grid: { stroke: 'transparent' },
          }}
        />
        <VictoryAxis
          animate={false}
          dependentAxis
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: {
              fontSize: 11,
              fill: showYLabels ? 'var(--text-muted)' : 'transparent',
              padding: 5,
            },
            grid: showGrid
              ? {
                  stroke: GRID_LINE_STROKE,
                  strokeWidth: GRID_LINE_STROKE_WIDTH,
                  strokeDasharray: GRID_LINE_STROKE_DASHARRAY,
                }
              : { stroke: 'transparent' },
          }}
          tickFormat={showYLabels ? formatYLabel : (): string => ''}
        />
        <Wrapper offset={layout === 'grouped' ? 16 : undefined}>
          {bars}
        </Wrapper>
      </VictoryChart>
    </div>
  );
};
