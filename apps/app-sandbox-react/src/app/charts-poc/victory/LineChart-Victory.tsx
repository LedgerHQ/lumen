import { useMemo, useId, useState, useRef } from 'react';
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
import { getVictoryInterpolation } from '../chartCurves';
import type { LineChartProps } from '../types';
import {
  buildEvenlySpacedTicks,
  ensureDomainBoundaryTicks,
  getSeriesLabel,
  resolveCssColor,
  resolveValueLabels,
  getRefLineStrokeDasharray,
  getReferenceLineStrokeWidth,
  GRID_LINE_STROKE,
  GRID_LINE_STROKE_DASHARRAY,
  GRID_LINE_STROKE_WIDTH,
  REFERENCE_LINE_STROKE,
  computeYDomain,
  computeXTimeDomainMs,
  resolveChartInset,
  effectiveShowXAxis,
  effectiveShowXAxisLabels,
  effectiveShowYAxis,
  effectiveShowYAxisLabels,
  lineDataRuns,
  resolveGridVisibility,
  resolveSeries,
} from '../utils';

const DIM_COLOR = 'rgba(128, 128, 128, 0.4)';

export const LineChartVictory = (props: LineChartProps) => {
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

  const gradientId = useId();
  const lastActiveIndexRef = useRef<number | null>(null);
  const [cursorX, setCursorX] = useState<number | null>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);

  const showXAxisEff = effectiveShowXAxis(props);
  const showYAxisEff = effectiveShowYAxis(props);
  const showXAxisLabelsEff = effectiveShowXAxisLabels(props);
  const showYAxisLabelsEff = effectiveShowYAxisLabels(props);

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
        label: getSeriesLabel(line),
        runs: lineDataRuns(line.data, line.connectNulls).map((run) =>
          run.map((pt) => ({
            x: pt.timestamp,
            y: pt.value,
            lineId: line.id,
            lineLabel: getSeriesLabel(line),
          })),
        ),
        color: resolvedColors[line.id],
        width: line.width ?? 2,
        showGradient: line.showGradient ?? false,
        curve: line.curve,
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
  const xMin = xDomainMs[0];
  const xMax = xDomainMs[1];

  const hasNoAxes = !showXAxisEff && !showYAxisEff;
  const padding = useMemo(
    () =>
      resolveChartInset(
        inset,
        hasNoAxes
          ? { top: 16, right: 40, bottom: 24, left: 16 }
          : { top: 16, right: 16, bottom: 40, left: 60 },
      ),
    [inset, hasNoAxes],
  );

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const isDimming =
    dimAfterCursorEff && cursorX != null && xMax > xMin && innerWidth > 0;

  let clipBeforeW = 0;
  let clipAfterX = 0;
  let clipAfterW = 0;
  if (dimAfterCursorEff && cursorX != null && xMax > xMin && innerWidth > 0) {
    const t = (cursorX - xMin) / (xMax - xMin);
    const clampedT = Math.min(1, Math.max(0, t));
    const cursorClipPx = padding.left + clampedT * innerWidth;
    clipBeforeW = Math.max(0, cursorClipPx - padding.left);
    clipAfterX = cursorClipPx;
    clipAfterW = Math.max(0, width - padding.right - cursorClipPx);
  }

  const gridStyleX = gridVisibility.x
    ? {
        stroke: GRID_LINE_STROKE,
        strokeWidth: GRID_LINE_STROKE_WIDTH,
        strokeDasharray: GRID_LINE_STROKE_DASHARRAY,
      }
    : { stroke: 'transparent' };

  const gridStyleY = gridVisibility.y
    ? {
        stroke: GRID_LINE_STROKE,
        strokeWidth: GRID_LINE_STROKE_WIDTH,
        strokeDasharray: GRID_LINE_STROKE_DASHARRAY,
      }
    : { stroke: 'transparent' };

  const axisStyle = {
    axis: { stroke: showXAxisLabelsEff ? 'var(--border-muted)' : 'transparent' },
    tickLabels: {
      fontSize: 11,
      fill: showXAxisLabelsEff ? 'var(--text-muted)' : 'transparent',
      padding: 5,
    },
    grid: gridStyleX,
  };

  const dependentAxisStyle = {
    axis: { stroke: 'transparent' },
    tickLabels: {
      fontSize: 11,
      fill: showYAxisLabelsEff ? 'var(--text-muted)' : 'transparent',
      padding: 5,
    },
    grid: gridStyleY,
  };

  const clipBeforeId = `${gradientId}-clip-before`;
  const clipAfterId = `${gradientId}-clip-after`;

  const a11yLive = useMemo(() => {
    if (cursorX == null || !lines[0] || !getPointA11yLabel) return null;
    const pt = lines[0].data.find((p) => p.timestamp === cursorX);
    if (!pt) return null;
    return getPointA11yLabel(pt, lines[0].id);
  }, [cursorX, lines, getPointA11yLabel]);

  return (
    <div
      className={className}
      role={chartAccessibilityLabel ? 'img' : undefined}
      aria-label={chartAccessibilityLabel}
    >
      {a11yLive ? <span className='sr-only'>{a11yLive}</span> : null}
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
          {isDimming && (
            <>
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
            </>
          )}
        </defs>
      </svg>

      <VictoryChart
        animate={false}
        width={width}
        height={height}
        padding={padding}
        domain={{
          x: [xMin, xMax],
          y: yDomain,
        }}
        containerComponent={
          showTooltipEff || showCursorEff ? (
            <VictoryVoronoiContainer
              voronoiDimension='x'
              labels={({
                datum,
              }: {
                datum: { x: number; y: number; lineLabel?: string };
              }) => {
                if (!showTooltipEff) return ' ';
                const yLabel =
                  datum.y == null || Number.isNaN(datum.y)
                    ? '—'
                    : formatYLabel
                      ? formatYLabel(datum.y)
                      : String(datum.y);
                const xLabel = formatXLabel
                  ? formatXLabel(datum.x)
                  : String(datum.x);
                return `${datum.lineLabel ?? 'Series'}\n${xLabel}\n${yLabel}`;
              }}
              labelComponent={
                showTooltipEff ? (
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
                  const ts = points[0].x;
                  const primaryPt = lines[0]?.data.find(
                    (p) => p.timestamp === ts,
                  );
                  setCursorX(ts);
                  setCursorY(
                    primaryPt && primaryPt.value != null
                      ? primaryPt.value
                      : null,
                  );
                  onPointHover?.(
                    { timestamp: ts, value: primaryPt?.value ?? null },
                    lines[0]?.id ?? '',
                  );

                  if (lines[0] && onActiveIndexChange) {
                    const idx = lines[0].data.findIndex(
                      (p) => p.timestamp === ts,
                    );
                    const nextIdx = idx >= 0 ? idx : null;
                    if (nextIdx !== lastActiveIndexRef.current) {
                      lastActiveIndexRef.current = nextIdx;
                      onActiveIndexChange(nextIdx);
                    }
                  }

                  if (markers) {
                    const totalRange = xMax - xMin;
                    const hit = markers.find(
                      (m) => Math.abs(m.timestamp - ts) < totalRange * 0.015,
                    );
                    onMarkerHover?.(hit ?? null);
                  }
                }
              }}
              onDeactivated={() => {
                setCursorX(null);
                setCursorY(null);
                lastActiveIndexRef.current = null;
                onActiveIndexChange?.(null);
                onPointHover?.(null, '');
                onMarkerHover?.(null);
              }}
            />
          ) : undefined
        }
      >
        {showXAxisEff ? (
          <VictoryAxis
            animate={false}
            tickFormat={
              showXAxisLabelsEff ? xAxisTickFormatter : (): string => ''
            }
            style={axisStyle}
            tickValues={xTicks}
            tickCount={xAxisConfig?.tickCount ?? 6}
          />
        ) : (
          <VictoryAxis
            animate={false}
            tickValues={xTicks}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: 'transparent' },
              grid: axisStyle.grid,
            }}
          />
        )}

        {showYAxisEff ? (
          <VictoryAxis
            animate={false}
            dependentAxis
            tickFormat={
              showYAxisLabelsEff ? yAxisTickFormatter : (): string => ''
            }
            style={dependentAxisStyle}
            tickValues={yTicks}
            tickCount={yAxisConfig?.tickCount ?? 5}
          />
        ) : (
          <VictoryAxis
            animate={false}
            dependentAxis
            tickValues={yTicks}
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: 'transparent' },
              grid: dependentAxisStyle.grid,
            }}
          />
        )}

        {referenceLines?.map((rl, i) =>
          (rl.axis ?? 'y') === 'x' ? (
            <VictoryLine
              key={`ref-x-${i}`}
              animate={false}
              data={[
                { x: rl.value, y: yDomain[0] },
                { x: rl.value, y: yDomain[1] },
              ]}
              style={{
                data: {
                  stroke: REFERENCE_LINE_STROKE,
                  strokeWidth: getReferenceLineStrokeWidth(rl.style),
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
                    fill: REFERENCE_LINE_STROKE,
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
          ) : (
            <VictoryLine
              key={`ref-y-${i}`}
              animate={false}
              data={[
                { x: xMin, y: rl.value },
                { x: xMax, y: rl.value },
              ]}
              style={{
                data: {
                  stroke: REFERENCE_LINE_STROKE,
                  strokeWidth: getReferenceLineStrokeWidth(rl.style),
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
                    fill: REFERENCE_LINE_STROKE,
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
          ),
        )}

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

        {victoryData.flatMap((d) => {
          const interp = getVictoryInterpolation(d.curve);
          if (isDimming) {
            return [
              ...d.runs.map((run, ri) =>
                d.showGradient ? (
                  <VictoryArea
                    key={`${d.id}-b-${ri}`}
                    animate={false}
                    data={run}
                    interpolation={interp}
                    groupComponent={
                      <g clipPath={`url(#${clipBeforeId})`} />
                    }
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
                    key={`${d.id}-b-${ri}`}
                    animate={false}
                    data={run}
                    interpolation={interp}
                    groupComponent={
                      <g clipPath={`url(#${clipBeforeId})`} />
                    }
                    style={{
                      data: {
                        stroke: d.color,
                        strokeWidth: d.width,
                      },
                    }}
                  />
                ),
              ),
              ...d.runs.map((run, ri) => (
                <VictoryLine
                  key={`${d.id}-dim-${ri}`}
                  animate={false}
                  data={run}
                  interpolation={interp}
                  groupComponent={
                    <g clipPath={`url(#${clipAfterId})`} />
                  }
                  style={{
                    data: {
                      stroke: DIM_COLOR,
                      strokeWidth: d.width,
                    },
                  }}
                />
              )),
            ];
          }

          return d.runs.map((run, ri) =>
            d.showGradient ? (
              <VictoryArea
                key={`${d.id}-a-${ri}`}
                animate={false}
                data={run}
                interpolation={interp}
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
                key={`${d.id}-l-${ri}`}
                animate={false}
                data={run}
                interpolation={interp}
                style={{
                  data: {
                    stroke: d.color,
                    strokeWidth: d.width,
                  },
                }}
              />
            ),
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

        {showCursorEff && cursorX != null && (
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

        {showCursorLabelEff && cursorX != null && cursorY != null && (
          <VictoryScatter
            animate={false}
            data={[{ x: cursorX, y: cursorY }]}
            size={0}
            style={{ data: { fill: 'transparent' } }}
            labels={[
              `${lines[0] ? getSeriesLabel(lines[0]) : 'Series'}: ${
                formatYLabel ? formatYLabel(cursorY) : String(cursorY)
              }`,
            ]}
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
