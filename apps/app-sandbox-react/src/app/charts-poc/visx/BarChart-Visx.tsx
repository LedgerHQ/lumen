import { useMemo, useCallback } from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import type { BarChartProps, BarDataPoint, BarSeriesConfig } from '../types';
import { GRID_LINE_STROKE, GRID_LINE_STROKE_DASHARRAY } from '../utils';

const MARGIN = { top: 16, right: 16, bottom: 40, left: 60 };

type TooltipData = { category: string; seriesId: string; value: number };

export const BarChartVisx = (props: BarChartProps) => {
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

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const {
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip: showTip,
    hideTooltip,
  } = useTooltip<TooltipData>();

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        domain: data.map((d) => d.category),
        range: [0, innerWidth],
        padding: 0.2,
      }),
    [data, innerWidth],
  );

  const seriesScale = useMemo(
    () =>
      scaleBand<string>({
        domain: series.map((s) => s.id),
        range: [0, xScale.bandwidth()],
        padding: 0.1,
      }),
    [series, xScale],
  );

  const colorScale = useMemo(
    () =>
      scaleOrdinal<string, string>({
        domain: series.map((s) => s.id),
        range: series.map((s) => s.color),
      }),
    [series],
  );

  const yMax = useMemo((): number => {
    if (layout === 'stacked') {
      return Math.max(
        ...data.map((d) =>
          series.reduce((sum, s) => sum + (d.values[s.id] ?? 0), 0),
        ),
      );
    }
    return Math.max(
      ...data.flatMap((d) => series.map((s) => d.values[s.id] ?? 0)),
    );
  }, [data, series, layout]);

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, yMax * 1.1],
        range: [innerHeight, 0],
        nice: true,
      }),
    [yMax, innerHeight],
  );

  const handleMouseMove = useCallback(
    (
      event: React.MouseEvent,
      d: BarDataPoint,
      s: BarSeriesConfig,
      barX: number,
      barY: number,
    ) => {
      if (!showTooltip) return;
      const point = localPoint(event) ?? { x: 0, y: 0 };
      showTip({
        tooltipData: {
          category: d.category,
          seriesId: s.id,
          value: d.values[s.id] ?? 0,
        },
        tooltipLeft: point.x,
        tooltipTop: barY + MARGIN.top,
      });
    },
    [showTooltip, showTip],
  );

  const renderGrouped = (): React.ReactNode =>
    data.map((d) => {
      const x0 = xScale(d.category) ?? 0;
      return (
        <Group key={d.category} left={x0}>
          {series.map((s) => {
            const barWidth = seriesScale.bandwidth();
            const barX = seriesScale(s.id) ?? 0;
            const barHeight = innerHeight - (yScale(d.values[s.id] ?? 0) ?? 0);
            const barY = yScale(d.values[s.id] ?? 0) ?? 0;
            return (
              <rect
                key={s.id}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={colorScale(s.id)}
                rx={4}
                onMouseMove={(e) =>
                  handleMouseMove(e, d, s, x0 + barX, barY)
                }
                onMouseLeave={hideTooltip}
              />
            );
          })}
        </Group>
      );
    });

  const renderStacked = (): React.ReactNode =>
    data.map((d) => {
      const x0 = xScale(d.category) ?? 0;
      const barWidth = xScale.bandwidth();
      let cumY = 0;
      return (
        <Group key={d.category} left={x0}>
          {series.map((s) => {
            const value = d.values[s.id] ?? 0;
            const barHeight = innerHeight - (yScale(value) ?? 0);
            cumY += barHeight;
            const barY = innerHeight - cumY;
            return (
              <rect
                key={s.id}
                x={0}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={colorScale(s.id)}
                onMouseMove={(e) =>
                  handleMouseMove(e, d, s, x0, barY)
                }
                onMouseLeave={hideTooltip}
              />
            );
          })}
        </Group>
      );
    });

  return (
    <div className={className} style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          {showGrid && (
            <GridRows
              scale={yScale}
              width={innerWidth}
              stroke={GRID_LINE_STROKE}
              strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
            />
          )}
          {layout === 'grouped' ? renderGrouped() : renderStacked()}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            stroke='var(--border-muted)'
            tickStroke='transparent'
            tickLabelProps={{
              fill: showXLabels ? 'var(--text-muted)' : 'transparent',
              fontSize: 11,
              textAnchor: 'middle' as const,
            }}
          />
          <AxisLeft
            scale={yScale}
            stroke='transparent'
            tickStroke='transparent'
            tickFormat={
              showYLabels && formatYLabel
                ? (v) => formatYLabel(v as number)
                : undefined
            }
            tickLabelProps={{
              fill: showYLabels ? 'var(--text-muted)' : 'transparent',
              fontSize: 11,
              textAnchor: 'end' as const,
              dy: '0.33em',
            }}
          />
        </Group>
      </svg>
      {showTooltip && tooltipOpen && tooltipData && (
        <div
          style={{
            position: 'absolute',
            left: (tooltipLeft ?? 0) + 12,
            top: (tooltipTop ?? 0) - 12,
            background: 'var(--background-surface)',
            border: '1px solid var(--border-muted)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 11,
            color: 'var(--text-base)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <strong>{tooltipData.category}</strong>
          <br />
          {series.find((s) => s.id === tooltipData.seriesId)?.label ??
            tooltipData.seriesId}
          :{' '}
          {formatYLabel
            ? formatYLabel(tooltipData.value)
            : tooltipData.value}
        </div>
      )}
    </div>
  );
};
