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

const DIM_COLOR = 'rgba(128, 128, 128, 0.4)';

function computeXExtent(lines: LineChartProps['lines']): {
  xMin: number;
  xMax: number;
} {
  let xMin = Infinity;
  let xMax = -Infinity;
  for (const line of lines) {
    for (const d of line.data) {
      if (d.timestamp < xMin) xMin = d.timestamp;
      if (d.timestamp > xMax) xMax = d.timestamp;
    }
  }
  if (!Number.isFinite(xMin) || !Number.isFinite(xMax)) {
    return { xMin: 0, xMax: 1 };
  }
  return { xMin, xMax };
}

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
    showCursorLabel = false,
    dimAfterCursor = false,
    formatXLabel,
    formatYLabel,
    onPointHover,
    onMarkerHover,
    className,
    referenceLines,
    markers,
    valueLabels,
  } = props;

  const gradientId = useId();
  const [cursorX, setCursorX] = useState<number | null>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);

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

  const valueLabelEntries = useMemo(
    () => resolveValueLabels(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular deps mirror resolveValueLabels inputs
    [lines, valueLabels, formatYLabel],
  );
  const yDomain = useMemo(
    () => computeYDomain(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular deps mirror computeYDomain inputs
    [lines, referenceLines, valueLabels],
  );

  const { xMin, xMax } = useMemo(() => computeXExtent(lines), [lines]);

  const hasNoAxes = !showXAxis && !showYAxis;
  const padding = useMemo(
    () =>
      hasNoAxes
        ? { top: 16, right: 40, bottom: 24, left: 16 }
        : { top: 16, right: 16, bottom: 40, left: 60 },
    [hasNoAxes],
  );

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const isDimming =
    dimAfterCursor && cursorX != null && xMax > xMin && innerWidth > 0;

  let clipBeforeW = 0;
  let clipAfterX = 0;
  let clipAfterW = 0;
  if (dimAfterCursor && cursorX != null && xMax > xMin && innerWidth > 0) {
    const t = (cursorX - xMin) / (xMax - xMin);
    const clampedT = Math.min(1, Math.max(0, t));
    const cursorClipPx = padding.left + clampedT * innerWidth;
    clipBeforeW = Math.max(0, cursorClipPx - padding.left);
    clipAfterX = cursorClipPx;
    clipAfterW = Math.max(0, width - padding.right - cursorClipPx);
  }

  const gridStyle = showGrid
    ? {
        stroke: 'var(--border-muted)',
        strokeWidth: 0.5,
        strokeDasharray: '4 4',
      }
    : { stroke: 'transparent' };

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

  const clipBeforeId = `${gradientId}-clip-before`;
  const clipAfterId = `${gradientId}-clip-after`;

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
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='0%' stopColor={d.color} stopOpacity={0.3} />
                <stop offset='100%' stopColor={d.color} stopOpacity={0} />
              </linearGradient>
            ))}
        </defs>
      </svg>

      <VictoryChart
        animate={false}
        width={width}
        height={height}
        padding={padding}
        domain={{ y: yDomain }}
        containerComponent={
          showTooltip || showCursor ? (
            <VictoryVoronoiContainer
              voronoiDimension='x'
              labels={({ datum }: { datum: { x: number; y: number } }) => {
                if (!showTooltip) return ' ';
                const yLabel = formatYLabel
                  ? formatYLabel(datum.y)
                  : String(datum.y);
                const xLabel = formatXLabel
                  ? formatXLabel(datum.x)
                  : String(datum.x);
                return `${xLabel}\n${yLabel}`;
              }}
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
                ) : (
                  <VictoryLabel style={{ fill: 'transparent' }} />
                )
              }
              onActivated={(points: Array<{ x: number; y: number }>) => {
                if (points.length > 0) {
                  setCursorX(points[0].x);
                  setCursorY(points[0].y);
                  onPointHover?.(
                    { timestamp: points[0].x, value: points[0].y },
                    lines[0]?.id ?? '',
                  );

                  if (markers) {
                    const totalRange = xMax - xMin;
                    const hit = markers.find(
                      (m) =>
                        Math.abs(m.timestamp - points[0].x) <
                        totalRange * 0.015,
                    );
                    onMarkerHover?.(hit ?? null);
                  }
                }
              }}
              onDeactivated={() => {
                setCursorX(null);
                setCursorY(null);
                onPointHover?.(null, '');
                onMarkerHover?.(null);
              }}
            />
          ) : undefined
        }
      >
        {isDimming && (
          <defs>
            <clipPath id={clipBeforeId}>
              <rect
                x={padding.left}
                y={padding.top}
                width={clipBeforeW}
                height={innerHeight}
              />
            </clipPath>
            <clipPath id={clipAfterId}>
              <rect
                x={clipAfterX}
                y={padding.top}
                width={clipAfterW}
                height={innerHeight}
              />
            </clipPath>
          </defs>
        )}

        {showXAxis ? (
          <VictoryAxis
            animate={false}
            scale='time'
            tickFormat={formatXLabel}
            style={axisStyle}
            tickCount={6}
          />
        ) : (
          <VictoryAxis
            animate={false}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: 'transparent' },
              grid: { stroke: 'transparent' },
            }}
          />
        )}

        {showYAxis ? (
          <VictoryAxis
            animate={false}
            dependentAxis
            tickFormat={formatYLabel}
            style={dependentAxisStyle}
            tickCount={5}
          />
        ) : (
          <VictoryAxis
            animate={false}
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
            animate={false}
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
            animate={false}
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Victory CallbackArgs
                dy={({ datum }: any) =>
                  datum?.placement === 'above' ? -12 : 16
                }
                style={{
                  fill: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
                textAnchor='middle'
              />
            }
          />
        )}

        {victoryData.map((d) => {
          if (isDimming) {
            return (
              <g key={d.id}>
                <g clipPath={`url(#${clipBeforeId})`}>
                  {d.showGradient ? (
                    <VictoryArea
                      animate={false}
                      data={d.data}
                      interpolation='natural'
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
                      animate={false}
                      data={d.data}
                      interpolation='natural'
                      style={{
                        data: {
                          stroke: d.color,
                          strokeWidth: d.width,
                        },
                      }}
                    />
                  )}
                </g>
                <g clipPath={`url(#${clipAfterId})`}>
                  <VictoryLine
                    animate={false}
                    data={d.data}
                    interpolation='natural'
                    style={{
                      data: {
                        stroke: DIM_COLOR,
                        strokeWidth: d.width,
                      },
                    }}
                  />
                </g>
              </g>
            );
          }

          return d.showGradient ? (
            <VictoryArea
              key={`area-${d.id}`}
              animate={false}
              data={d.data}
              interpolation='natural'
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
              animate={false}
              data={d.data}
              interpolation='natural'
              style={{
                data: {
                  stroke: d.color,
                  strokeWidth: d.width,
                },
              }}
            />
          );
        })}

        {markers && markers.length > 0 && (
          <VictoryScatter
            animate={false}
            data={markers.map((m) => ({
              x: m.timestamp,
              y: m.value,
              _color: m.color ?? 'var(--text-base)',
              _variant: m.variant ?? 'filled',
              _radius: m.radius ?? 4,
            }))}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            size={({ datum }: any) => datum?._radius ?? 4}
            style={{
              data: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fill: ({ datum }: any) =>
                  datum?._variant === 'outlined'
                    ? 'transparent'
                    : (datum?._color ?? 'var(--text-base)'),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stroke: ({ datum }: any) =>
                  datum?._variant === 'outlined'
                    ? (datum?._color ?? 'var(--text-base)')
                    : 'none',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                strokeWidth: ({ datum }: any) =>
                  datum?._variant === 'outlined' ? 2 : 0,
              },
            }}
          />
        )}

        {showCursor && cursorX != null && (
          <VictoryLine
            animate={false}
            style={{
              data: {
                stroke: 'var(--text-muted)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              },
            }}
            data={[
              { x: cursorX, y: yDomain[0] },
              { x: cursorX, y: yDomain[1] },
            ]}
          />
        )}

        {showCursorLabel && cursorX != null && cursorY != null && (
          <VictoryScatter
            animate={false}
            data={[{ x: cursorX, y: cursorY }]}
            size={0}
            style={{ data: { fill: 'transparent' } }}
            labels={[formatYLabel ? formatYLabel(cursorY) : String(cursorY)]}
            labelComponent={
              <VictoryLabel
                dx={12}
                style={{
                  fill: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                }}
                textAnchor='start'
              />
            }
          />
        )}
      </VictoryChart>
    </div>
  );
};
