import { useMemo, useCallback, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import type { LineChartProps } from '../types';
import {
  resolveCssColor,
  resolveValueLabels,
  getRefLineStrokeDasharray,
  computeYDomain,
} from '../utils';

type MergedDataPoint = {
  timestamp: number;
  [key: string]: number;
};

function mergeLineData(props: LineChartProps): MergedDataPoint[] {
  const timestampMap = new Map<number, MergedDataPoint>();

  for (const line of props.lines) {
    for (const point of line.data) {
      let entry = timestampMap.get(point.timestamp);
      if (!entry) {
        entry = { timestamp: point.timestamp };
        timestampMap.set(point.timestamp, entry);
      }
      entry[line.id] = point.value;
    }
  }

  return Array.from(timestampMap.values()).sort(
    (a, b) => a.timestamp - b.timestamp,
  );
}

type TooltipEntry = {
  name: string;
  value: number;
  color: string;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  formatXLabel,
  formatYLabel,
}: {
  active?: boolean;
  payload?: readonly TooltipEntry[];
  label?: number;
  formatXLabel?: (ts: number) => string;
  formatYLabel?: (v: number) => string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--background-surface)',
        color: 'var(--text-base)',
        border: '1px solid var(--border-muted)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 13,
      }}
    >
      <p style={{ margin: 0, marginBottom: 4, opacity: 0.7 }}>
        {formatXLabel ? formatXLabel(label ?? 0) : String(label)}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          style={{ margin: '2px 0', color: entry.color, fontWeight: 600 }}
        >
          {entry.name}: {formatYLabel ? formatYLabel(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

const DIM_COLOR = 'rgba(128, 128, 128, 0.4)';

export const LineChartRecharts = (props: LineChartProps) => {
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
    className,
    referenceLines,
    markers,
  } = props;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const mergedData = useMemo(() => mergeLineData(props), [props]);
  const valueLabelEntries = useMemo(() => resolveValueLabels(props), [props]);
  const yDomain = useMemo(() => computeYDomain(props), [props]);

  const resolvedColors = useMemo(() => {
    const map: Record<string, string> = {};
    for (const line of lines) {
      map[line.id] = resolveCssColor(line.color);
    }
    return map;
  }, [lines]);

  const renderTooltipContent = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (tooltipProps: any) => {
      if (!showTooltip) return null;
      return (
        <CustomTooltip
          active={tooltipProps.active}
          payload={tooltipProps.payload}
          label={tooltipProps.label}
          formatXLabel={formatXLabel}
          formatYLabel={formatYLabel}
        />
      );
    },
    [showTooltip, formatXLabel, formatYLabel],
  );

  const handleMouseMove = useCallback(
    (state: { activeTooltipIndex?: number; isTooltipActive?: boolean }) => {
      if (
        state?.isTooltipActive &&
        state.activeTooltipIndex != null
      ) {
        setActiveIndex(state.activeTooltipIndex as number);
        const entry = mergedData[state.activeTooltipIndex];
        if (entry && onPointHover) {
          const lineId = lines[0]?.id ?? '';
          onPointHover(
            { timestamp: entry.timestamp, value: entry[lineId] as number },
            lineId,
          );
        }
      }
    },
    [onPointHover, mergedData, lines],
  );

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
    onPointHover?.(null, '');
  }, [onPointHover]);

  const cursorFraction = useMemo((): number | null => {
    if (!dimAfterCursor || activeIndex == null || mergedData.length < 2)
      return null;
    const xMin = mergedData[0].timestamp;
    const xMax = mergedData[mergedData.length - 1].timestamp;
    const range = xMax - xMin;
    if (range === 0) return null;
    return (mergedData[activeIndex].timestamp - xMin) / range;
  }, [dimAfterCursor, activeIndex, mergedData]);

  const hasNoAxes = !showXAxis && !showYAxis;
  const chartMargin = hasNoAxes
    ? { top: 16, right: 40, left: 16, bottom: 24 }
    : { top: 8, right: 8, left: 8, bottom: 8 };

  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <ComposedChart
          data={mergedData}
          margin={chartMargin}
          onMouseMove={
            onPointHover || dimAfterCursor ? handleMouseMove : undefined
          }
          onMouseLeave={
            onPointHover || dimAfterCursor ? handleMouseLeave : undefined
          }
        >
          <defs>
            {lines
              .filter((l) => l.showGradient)
              .map((line) => (
                <linearGradient
                  key={`grad-${line.id}`}
                  id={`recharts-grad-${line.id}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='0%'
                    stopColor={resolvedColors[line.id]}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset='100%'
                    stopColor={resolvedColors[line.id]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            {cursorFraction != null &&
              lines.map((line) => (
                <g key={`split-grads-${line.id}`}>
                  <linearGradient
                    id={`recharts-split-${line.id}`}
                    x1='0'
                    y1='0'
                    x2='1'
                    y2='0'
                  >
                    <stop
                      offset={`${cursorFraction}`}
                      stopColor={resolvedColors[line.id]}
                    />
                    <stop
                      offset={`${cursorFraction}`}
                      stopColor={DIM_COLOR}
                    />
                  </linearGradient>
                  {line.showGradient && (
                    <linearGradient
                      id={`recharts-split-fill-${line.id}`}
                      x1='0'
                      y1='0'
                      x2='1'
                      y2='0'
                    >
                      <stop
                        offset={`${cursorFraction}`}
                        stopColor={resolvedColors[line.id]}
                        stopOpacity={0.15}
                      />
                      <stop
                        offset={`${cursorFraction}`}
                        stopColor={resolvedColors[line.id]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  )}
                </g>
              ))}
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='var(--border-muted)'
              strokeOpacity={0.5}
            />
          )}

          <XAxis
            dataKey='timestamp'
            type='number'
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatXLabel}
            stroke='var(--text-muted)'
            tick={showXAxis ? { fontSize: 11 } : false}
            tickLine={false}
            axisLine={showXAxis ? { stroke: 'var(--border-muted)' } : false}
            hide={!showXAxis}
          />

          <YAxis
            domain={yDomain}
            tickFormatter={formatYLabel}
            stroke='var(--text-muted)'
            tick={showYAxis ? { fontSize: 11 } : false}
            tickLine={false}
            axisLine={false}
            width={showYAxis ? 60 : 0}
            hide={!showYAxis}
            allowDataOverflow
          />

          {(showTooltip || showCursor) && (
            <Tooltip
              content={renderTooltipContent}
              cursor={
                showCursor
                  ? {
                      stroke: 'var(--text-muted)',
                      strokeWidth: 1,
                      strokeDasharray: '4 4',
                    }
                  : false
              }
            />
          )}

          {referenceLines?.map((rl, i) => (
            <ReferenceLine
              key={`ref-${i}`}
              y={rl.value}
              stroke={rl.color ?? 'var(--text-muted)'}
              strokeDasharray={getRefLineStrokeDasharray(rl.style)}
              strokeWidth={1}
              label={
                rl.label
                  ? {
                      value: rl.label,
                      position:
                        rl.labelPosition === 'left'
                          ? 'insideLeft'
                          : rl.labelPosition === 'right'
                            ? 'insideRight'
                            : 'insideBottomLeft',
                      fill: rl.color ?? 'var(--text-muted)',
                      fontSize: 12,
                      dy: 14,
                    }
                  : undefined
              }
            />
          ))}

          {valueLabelEntries.map((vl) => (
            <ReferenceDot
              key={`vl-${vl.value}-${vl.placement}`}
              x={vl.timestamp}
              y={vl.value}
              r={0}
              label={{
                value: vl.label,
                position: vl.placement === 'above' ? 'top' : 'bottom',
                fill: 'rgba(255, 255, 255, 0.7)',
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          ))}

          {lines.map((line) => {
            const strokeColor =
              cursorFraction != null
                ? `url(#recharts-split-${line.id})`
                : resolvedColors[line.id];
            const fillColor =
              cursorFraction != null && line.showGradient
                ? `url(#recharts-split-fill-${line.id})`
                : `url(#recharts-grad-${line.id})`;

            return line.showGradient ? (
              <Area
                key={`area-${line.id}`}
                type='natural'
                dataKey={line.id}
                stroke={strokeColor}
                strokeWidth={line.width ?? 2}
                fill={fillColor}
                fillOpacity={1}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            ) : (
              <Line
                key={`line-${line.id}`}
                type='natural'
                dataKey={line.id}
                stroke={strokeColor}
                strokeWidth={line.width ?? 2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            );
          })}

          {showCursorLabel &&
            activeIndex != null &&
            lines.map((ln) => {
              const entry = mergedData[activeIndex];
              if (!entry) return null;
              const val = entry[ln.id] as number | undefined;
              if (val == null) return null;
              const label = formatYLabel ? formatYLabel(val) : String(val);
              return (
                <ReferenceDot
                  key={`cursor-label-${ln.id}`}
                  x={entry.timestamp}
                  y={val}
                  r={0}
                  label={{
                    value: label,
                    position: 'right',
                    fill: '#fff',
                    fontSize: 11,
                    fontWeight: 600,
                    dx: 8,
                  }}
                />
              );
            })}

          {markers?.map((m, i) => (
            <ReferenceDot
              key={`marker-${i}`}
              x={m.timestamp}
              y={m.value}
              r={m.radius ?? 4}
              fill={m.color ?? 'var(--text-base)'}
              stroke='none'
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
