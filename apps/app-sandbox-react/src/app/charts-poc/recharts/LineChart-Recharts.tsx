import { useMemo, useCallback, useState, useRef } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { getRechartsLineType } from '../chartCurves';
import type { LineChartProps, LineConfig } from '../types';
import {
  buildEvenlySpacedTicks,
  ensureDomainBoundaryTicks,
  getSeriesLabel,
  resolveCssColor,
  resolveValueLabels,
  getRefLineStrokeDasharray,
  getReferenceLineStrokeWidth,
  REFERENCE_LINE_STROKE,
  computeYDomain,
  computeXTimeDomainMs,
  GRID_LINE_STROKE,
  GRID_LINE_STROKE_DASHARRAY,
  resolveChartInset,
  effectiveShowXAxis,
  effectiveShowXAxisLabels,
  effectiveShowYAxis,
  effectiveShowYAxisLabels,
  resolveGridVisibility,
  resolveSeries,
} from '../utils';

type MergedDataPoint = {
  timestamp: number;
  [key: string]: number | null;
};

function mergeLineData(lines: LineConfig[]): MergedDataPoint[] {
  if (lines.length === 1) {
    const line = lines[0];
    return line.data.map((point) => ({
      timestamp: point.timestamp,
      [line.id]: point.value,
    }));
  }

  const timestampMap = new Map<number, MergedDataPoint>();

  for (const line of lines) {
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
  value: number | null;
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
          {entry.name}:{' '}
          {entry.value == null
            ? '—'
            : formatYLabel
              ? formatYLabel(entry.value)
              : entry.value}
        </p>
      ))}
    </div>
  );
};

const DIM_COLOR = 'rgba(128, 128, 128, 0.4)';

export const LineChartRecharts = (props: LineChartProps) => {
  const lines = resolveSeries(props);
  const {
    width,
    height,
    enableScrubbing = true,
    showTooltip = true,
    showCursor = true,
    showCursorLabel = false,
    formatXLabel,
    formatYLabel,
    onPointHover,
    onMarkerHover,
    className,
    referenceLines,
    markers,
    valueLabels,
    inset,
    onActiveIndexChange,
    chartAccessibilityLabel,
    getPointA11yLabel,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
  } = props;

  const showTooltipEff = showTooltip && enableScrubbing;
  const showCursorEff = showCursor && enableScrubbing;
  const showCursorLabelEff = showCursorLabel && enableScrubbing;
  const dimAfterCursorEff = enableScrubbing;
  const gridVisibility = resolveGridVisibility(props);
  const xAxisTickFormatter = xAxisConfig?.tickFormatter ?? formatXLabel;
  const yAxisTickFormatter = yAxisConfig?.tickFormatter ?? formatYLabel;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastActiveIndexRef = useRef<number | null>(null);

  const showXAxisEff = effectiveShowXAxis(props);
  const showYAxisEff = effectiveShowYAxis(props);
  const showXAxisLabelsEff = effectiveShowXAxisLabels(props);
  const showYAxisLabelsEff = effectiveShowYAxisLabels(props);

  const mergedData = useMemo(() => mergeLineData(lines), [lines]);
  const valueLabelEntries = useMemo(
    () => resolveValueLabels(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lines/valueLabels/formatYLabel mirror resolveValueLabels inputs
    [lines, valueLabels, formatYLabel],
  );
  const yDomain = useMemo(
    () => computeYDomain(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular inputs for computeYDomain
    [lines, referenceLines, valueLabels, yAxisConfig?.domain],
  );

  const xDomainMs = useMemo(
    () => computeXTimeDomainMs(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- xAxis.domain via props
    [lines, xAxisConfig?.domain],
  );

  const xTicks = useMemo(
    () =>
      ensureDomainBoundaryTicks(
        xAxisConfig?.ticks ??
          buildEvenlySpacedTicks(xDomainMs, xAxisConfig?.tickCount ?? 6),
        xDomainMs,
      ),
    [xAxisConfig?.ticks, xAxisConfig?.tickCount, xDomainMs],
  );

  const yTicks = useMemo(
    () =>
      ensureDomainBoundaryTicks(
        yAxisConfig?.ticks ??
          buildEvenlySpacedTicks(yDomain, yAxisConfig?.tickCount ?? 5),
        yDomain,
      ),
    [yAxisConfig?.ticks, yAxisConfig?.tickCount, yDomain],
  );

  const verticalGridCoordinatesGenerator = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Recharts grid callback shape is not exported with stable typing
    ({ offset }: any): number[] => {
      if (!offset) return [];
      const count = Math.max(2, xTicks.length);
      const start = offset.left;
      const end = offset.left + offset.width;
      const step = count > 1 ? (end - start) / (count - 1) : 0;
      return Array.from({ length: count }, (_, i) => start + i * step);
    },
    [xTicks.length],
  );

  const horizontalGridCoordinatesGenerator = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Recharts grid callback shape is not exported with stable typing
    ({ offset }: any): number[] => {
      if (!offset) return [];
      const count = Math.max(2, yTicks.length);
      const start = offset.top;
      const end = offset.top + offset.height;
      const step = count > 1 ? (end - start) / (count - 1) : 0;
      return Array.from({ length: count }, (_, i) => start + i * step);
    },
    [yTicks.length],
  );

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
      if (!showTooltipEff) return null;
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
    [showTooltipEff, formatXLabel, formatYLabel],
  );

  const handleMouseMove = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Recharts passes MouseHandlerDataParam; index may be TooltipIndex | null
    (state: any) => {
      if (!enableScrubbing) return;
      if (state?.isTooltipActive && state.activeTooltipIndex != null) {
        setActiveIndex(Number(state.activeTooltipIndex));
        const entry = mergedData[state.activeTooltipIndex];
        if (entry && onPointHover) {
          const lineId = lines[0]?.id ?? '';
          const raw = entry[lineId] as number | null | undefined;
          onPointHover(
            { timestamp: entry.timestamp, value: raw ?? null },
            lineId,
          );
        }

        if (entry && lines[0]) {
          const idx = lines[0].data.findIndex(
            (p) => p.timestamp === entry.timestamp,
          );
          const nextIdx = idx >= 0 ? idx : null;
          if (nextIdx !== lastActiveIndexRef.current) {
            lastActiveIndexRef.current = nextIdx;
            onActiveIndexChange?.(nextIdx);
          }
        }

        if (markers && entry) {
          const hit = markers.find((m) => {
            const timeDiff = Math.abs(m.timestamp - entry.timestamp);
            const totalRange =
              mergedData[mergedData.length - 1].timestamp -
              mergedData[0].timestamp;
            return timeDiff < totalRange * 0.015;
          });
          onMarkerHover?.(hit ?? null);
        } else {
          onMarkerHover?.(null);
        }
      }
    },
    [
      enableScrubbing,
      onPointHover,
      onMarkerHover,
      mergedData,
      lines,
      markers,
      onActiveIndexChange,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
    lastActiveIndexRef.current = null;
    onActiveIndexChange?.(null);
    onPointHover?.(null, '');
    onMarkerHover?.(null);
  }, [onPointHover, onMarkerHover, onActiveIndexChange]);

  const cursorFraction = useMemo((): number | null => {
    if (!dimAfterCursorEff || activeIndex == null || mergedData.length < 2)
      return null;
    const xMin = mergedData[0].timestamp;
    const xMax = mergedData[mergedData.length - 1].timestamp;
    const range = xMax - xMin;
    if (range === 0) return null;
    return (mergedData[activeIndex].timestamp - xMin) / range;
  }, [dimAfterCursorEff, activeIndex, mergedData]);

  const hasNoAxes = !showXAxisEff && !showYAxisEff;
  const chartMargin = resolveChartInset(
    inset,
    hasNoAxes
      ? { top: 16, right: 40, left: 16, bottom: 24 }
      : { top: 8, right: 8, left: 8, bottom: 8 },
  );

  const a11yPoint =
    activeIndex != null &&
    mergedData[activeIndex] &&
    lines[0] &&
    getPointA11yLabel
      ? getPointA11yLabel(
          {
            timestamp: mergedData[activeIndex].timestamp,
            value:
              (mergedData[activeIndex][lines[0].id] as number | null) ?? null,
          },
          lines[0].id,
        )
      : null;

  return (
    <div
      className={className}
      role={chartAccessibilityLabel ? 'img' : undefined}
      aria-label={chartAccessibilityLabel}
    >
      {a11yPoint ? <span className='sr-only'>{a11yPoint}</span> : null}
      <ComposedChart
        width={width}
        height={height}
        data={mergedData}
        margin={chartMargin}
        onMouseMove={
          enableScrubbing &&
          (onPointHover ||
            dimAfterCursorEff ||
            onActiveIndexChange ||
            Boolean(markers?.length))
            ? handleMouseMove
            : undefined
        }
        onMouseLeave={
          enableScrubbing &&
          (onPointHover ||
            dimAfterCursorEff ||
            onActiveIndexChange ||
            Boolean(markers?.length))
            ? handleMouseLeave
            : undefined
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
                  <stop offset={`${cursorFraction}`} stopColor={DIM_COLOR} />
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

        {(gridVisibility.x || gridVisibility.y) && (
          <CartesianGrid
            strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
            stroke={GRID_LINE_STROKE}
            vertical={gridVisibility.x}
            horizontal={gridVisibility.y}
            verticalCoordinatesGenerator={
              gridVisibility.x ? verticalGridCoordinatesGenerator : undefined
            }
            horizontalCoordinatesGenerator={
              gridVisibility.y ? horizontalGridCoordinatesGenerator : undefined
            }
          />
        )}

        <XAxis
          dataKey='timestamp'
          type='number'
          domain={[xDomainMs[0], xDomainMs[1]]}
          ticks={xTicks}
          tickFormatter={xAxisTickFormatter}
          stroke='var(--text-muted)'
          tick={showXAxisLabelsEff ? { fontSize: 11 } : false}
          tickLine={false}
          axisLine={
            showXAxisLabelsEff ? { stroke: 'var(--border-muted)' } : false
          }
          hide={!showXAxisEff}
          tickCount={xAxisConfig?.tickCount}
        />

        <YAxis
          domain={yDomain}
          ticks={yTicks}
          tickFormatter={yAxisTickFormatter}
          stroke='var(--text-muted)'
          tick={showYAxisLabelsEff ? { fontSize: 11 } : false}
          tickLine={false}
          axisLine={false}
          width={showYAxisLabelsEff ? 60 : 0}
          hide={!showYAxisEff}
          allowDataOverflow
          tickCount={yAxisConfig?.tickCount}
        />

        {(showTooltipEff || showCursorEff) && (
          <Tooltip
            content={renderTooltipContent}
            active={enableScrubbing ? undefined : false}
            cursor={
              showCursorEff
                ? {
                    stroke: 'var(--text-muted)',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                  }
                : false
            }
          />
        )}

        {referenceLines?.map((rl, i) =>
          (rl.axis ?? 'y') === 'x' ? (
            <ReferenceLine
              key={`ref-x-${i}`}
              x={rl.value}
              stroke={REFERENCE_LINE_STROKE}
              strokeDasharray={getRefLineStrokeDasharray(rl.style)}
              strokeWidth={getReferenceLineStrokeWidth(rl.style)}
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
                      fill: REFERENCE_LINE_STROKE,
                      fontSize: 12,
                      dy: 14,
                    }
                  : undefined
              }
            />
          ) : (
            <ReferenceLine
              key={`ref-y-${i}`}
              y={rl.value}
              stroke={REFERENCE_LINE_STROKE}
              strokeDasharray={getRefLineStrokeDasharray(rl.style)}
              strokeWidth={getReferenceLineStrokeWidth(rl.style)}
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
                      fill: REFERENCE_LINE_STROKE,
                      fontSize: 12,
                      dy: 14,
                    }
                  : undefined
              }
            />
          ),
        )}

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
          const lineType = getRechartsLineType(line.curve);
          const connectNulls = line.connectNulls ?? false;

          return line.showGradient ? (
            <Area
              key={`area-${line.id}`}
              name={getSeriesLabel(line)}
              type={lineType}
              dataKey={line.id}
              stroke={strokeColor}
              strokeWidth={line.width ?? 2}
              fill={fillColor}
              fillOpacity={1}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
              connectNulls={connectNulls}
            />
          ) : (
            <Line
              key={`line-${line.id}`}
              name={getSeriesLabel(line)}
              type={lineType}
              dataKey={line.id}
              stroke={strokeColor}
              strokeWidth={line.width ?? 2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
              connectNulls={connectNulls}
            />
          );
        })}

        {showCursorLabelEff &&
          activeIndex != null &&
          lines.map((ln) => {
            const entry = mergedData[activeIndex];
            if (!entry) return null;
            const val = entry[ln.id] as number | null | undefined;
            if (val == null) return null;
            const valueText = formatYLabel ? formatYLabel(val) : String(val);
            const label = `${getSeriesLabel(ln)}: ${valueText}`;
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

        {markers?.map((m, i) => {
          const isOutlined = m.variant === 'outlined';
          return (
            <ReferenceDot
              key={`marker-${i}`}
              x={m.timestamp}
              y={m.value}
              r={m.radius ?? 4}
              fill={
                isOutlined ? 'transparent' : (m.color ?? 'var(--text-base)')
              }
              stroke={isOutlined ? (m.color ?? 'var(--text-base)') : 'none'}
              strokeWidth={isOutlined ? 2 : 0}
            />
          );
        })}
      </ComposedChart>
    </div>
  );
};
