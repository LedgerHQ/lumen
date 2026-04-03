import { useMemo, useId, useState } from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryScatter,
  VictoryLabel,
} from 'victory';
import type { LineChartProps } from '../types';
import {
  resolveCssColor,
  resolveValueLabels,
  getRefLineStrokeDasharray,
  computeYDomain,
} from '../utils';

export const LineChartVictory = (props: LineChartProps) => {
  const {
    lines,
    width,
    height,
    showXAxis = true,
    showYAxis = true,
    showGrid = true,
    showTooltip = true,
    showCursor = true,
    formatXLabel,
    formatYLabel,
    className,
    referenceLines,
    markers,
  } = props;

  const gradientId = useId();
  const [cursorX, setCursorX] = useState<number | null>(null);

  const resolvedColors = useMemo(() => {
    const map: Record<string, string> = {};
    for (const line of lines) {
      map[line.id] = resolveCssColor(line.color);
    }
    return map;
  }, [lines]);

  const victoryData = useMemo(
    () =>
      lines.map((line) => ({
        id: line.id,
        data: line.data.map((pt) => ({ x: pt.timestamp, y: pt.value })),
        color: resolvedColors[line.id],
        width: line.width ?? 2,
        showGradient: line.showGradient ?? false,
      })),
    [lines, resolvedColors],
  );

  const valueLabelEntries = useMemo(() => resolveValueLabels(props), [props]);
  const yDomain = useMemo(() => computeYDomain(props), [props]);

  const allTimestamps = useMemo(
    () => lines.flatMap((l) => l.data.map((d) => d.timestamp)),
    [lines],
  );
  const xMin = Math.min(...allTimestamps);
  const xMax = Math.max(...allTimestamps);

  const gridStyle = showGrid
    ? {
        stroke: 'var(--border-muted)',
        strokeWidth: 0.5,
        strokeDasharray: '4 4',
      }
    : { stroke: 'transparent' };

  const hasNoAxes = !showXAxis && !showYAxis;
  const padding = hasNoAxes
    ? { top: 16, right: 40, bottom: 24, left: 16 }
    : { top: 16, right: 16, bottom: 40, left: 60 };

  const axisStyle = {
    axis: { stroke: 'var(--border-muted)' },
    tickLabels: { fontSize: 11, fill: 'var(--text-muted)', padding: 5 },
    grid: gridStyle,
  };

  const dependentAxisStyle = {
    axis: { stroke: 'transparent' },
    tickLabels: { fontSize: 11, fill: 'var(--text-muted)', padding: 5 },
    grid: gridStyle,
  };

  return (
    <div className={className}>
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          {victoryData
            .filter((d) => d.showGradient)
            .map((d) => (
              <linearGradient
                key={d.id}
                id={`${gradientId}-${d.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={d.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={d.color} stopOpacity={0} />
              </linearGradient>
            ))}
        </defs>
      </svg>

      <VictoryChart
        width={width}
        height={height}
        padding={padding}
        domain={{ y: yDomain }}
        containerComponent={
          showTooltip ? (
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }: { datum: { x: number; y: number } }) => {
                const yLabel = formatYLabel
                  ? formatYLabel(datum.y)
                  : String(datum.y);
                const xLabel = formatXLabel
                  ? formatXLabel(datum.x)
                  : String(datum.x);
                return `${xLabel}\n${yLabel}`;
              }}
              labelComponent={
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
              }
              onActivated={(points: Array<{ x: number }>) => {
                if (showCursor && points.length > 0) {
                  setCursorX(points[0].x);
                }
              }}
              onDeactivated={() => setCursorX(null)}
            />
          ) : undefined
        }
      >
        {showXAxis ? (
          <VictoryAxis
            scale="time"
            tickFormat={formatXLabel}
            style={axisStyle}
            tickCount={6}
          />
        ) : (
          <VictoryAxis
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: 'transparent' },
              grid: { stroke: 'transparent' },
            }}
          />
        )}

        {showYAxis ? (
          <VictoryAxis
            dependentAxis
            tickFormat={formatYLabel}
            style={dependentAxisStyle}
            tickCount={5}
          />
        ) : (
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: 'transparent' },
              grid: { stroke: 'transparent' },
            }}
          />
        )}

        {referenceLines?.map((rl, i) => (
          <VictoryLine
            key={`ref-${i}`}
            data={[
              { x: xMin, y: rl.value },
              { x: xMax, y: rl.value },
            ]}
            style={{
              data: {
                stroke: rl.color ?? 'var(--text-muted)',
                strokeWidth: 1,
                strokeDasharray: getRefLineStrokeDasharray(rl.style),
              },
            }}
            labels={rl.label ? [rl.label] : undefined}
            labelComponent={
              <VictoryLabel
                dy={16}
                dx={
                  rl.labelPosition === 'right'
                    ? 0
                    : rl.labelPosition === 'left'
                      ? 10
                      : 0
                }
                style={{
                  fill: rl.color ?? 'var(--text-muted)',
                  fontSize: 12,
                }}
                textAnchor={
                  rl.labelPosition === 'right'
                    ? 'end'
                    : rl.labelPosition === 'left'
                      ? 'start'
                      : 'middle'
                }
              />
            }
          />
        ))}

        {valueLabelEntries.length > 0 && (
          <VictoryScatter
            data={valueLabelEntries.map((vl) => ({
              x: vl.timestamp,
              y: vl.value,
              label: vl.label,
              placement: vl.placement,
            }))}
            size={0}
            style={{ data: { fill: 'transparent' } }}
            labels={({ datum }: { datum: { label: string } }) => datum.label}
            labelComponent={
              <VictoryLabel
                dy={({ datum }: { datum: { placement: string } }) =>
                  datum.placement === 'above' ? -12 : 16
                }
                style={{
                  fill: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
                textAnchor="middle"
              />
            }
          />
        )}

        {victoryData.map((d) =>
          d.showGradient ? (
            <VictoryArea
              key={`area-${d.id}`}
              data={d.data}
              interpolation="monotoneX"
              style={{
                data: {
                  fill: `url(#${gradientId}-${d.id})`,
                  stroke: d.color,
                  strokeWidth: d.width,
                },
              }}
            />
          ) : (
            <VictoryLine
              key={`line-${d.id}`}
              data={d.data}
              interpolation="monotoneX"
              style={{
                data: {
                  stroke: d.color,
                  strokeWidth: d.width,
                },
              }}
            />
          ),
        )}

        {markers && markers.length > 0 && (
          <VictoryScatter
            data={markers.map((m) => ({
              x: m.timestamp,
              y: m.value,
              fill: m.color ?? 'var(--text-base)',
            }))}
            size={({ datum }: { datum: { fill: string } }) => {
              const mk = markers.find(
                (m) => m.color === datum.fill,
              );
              return mk?.radius ?? 4;
            }}
            style={{
              data: {
                fill: ({ datum }: { datum: { fill: string } }) => datum.fill,
                stroke: 'none',
              },
            }}
          />
        )}

        {showCursor && cursorX != null && (
          <VictoryLine
            style={{
              data: {
                stroke: 'var(--text-muted)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              },
            }}
            data={[
              { x: cursorX, y: 0 },
              { x: cursorX, y: 1 },
            ]}
            y={(d: { y: number }) => d.y}
          />
        )}
      </VictoryChart>
    </div>
  );
};
