import { scaleLinear, scaleTime } from 'd3-scale';
import { line, area } from 'd3-shape';
import { useMemo, useCallback, useId, useState, useRef } from 'react';
import { getD3Curve } from '../chartCurves';
import type { LineChartProps, DataPoint } from '../types';
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
  REFERENCE_LINE_STROKE,
  computeYDomain,
  computeXTimeDomainMs,
  resolveChartInset,
  effectiveShowXAxis,
  effectiveShowYAxis,
  lineDataRuns,
  nearestDefinedPointByTime,
  resolveGridVisibility,
  resolveSeries,
} from '../utils';

const DIM_COLOR = 'rgba(128, 128, 128, 0.4)';

export const LineChartD3 = (props: LineChartProps) => {
  const lines = resolveSeries(props);
  const {
    width,
    height,
    enableScrubbing = true,
    showTooltip: showTooltipProp = true,
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

  const showTooltipEff = showTooltipProp && enableScrubbing;
  const showCursorEff = showCursor && enableScrubbing;
  const showCursorLabelEff = showCursorLabel && enableScrubbing;
  const dimAfterCursorEff = enableScrubbing;
  const gridVisibility = resolveGridVisibility(props);
  const xAxisTickFormatter = xAxisConfig?.tickFormatter ?? formatXLabel;
  const yAxisTickFormatter = yAxisConfig?.tickFormatter ?? formatYLabel;

  const uid = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const lastSnapTsRef = useRef<number | null>(null);
  const lastActiveIndexRef = useRef<number | null>(null);

  const showXAxisEff = effectiveShowXAxis(props);
  const showYAxisEff = effectiveShowYAxis(props);

  const [tooltip, setTooltip] = useState<{
    entries: Array<{
      lineId: string;
      lineLabel: string;
      point: DataPoint;
      color: string;
    }>;
    left: number;
    top: number;
  } | null>(null);

  const hasNoAxes = !showXAxisEff && !showYAxisEff;
  const margin = useMemo(
    () =>
      resolveChartInset(
        inset,
        hasNoAxes
          ? { top: 16, right: 40, bottom: 24, left: 16 }
          : { top: 16, right: 16, bottom: 40, left: 60 },
      ),
    [inset, hasNoAxes],
  );

  const resolvedColors = useMemo(() => {
    const map: Record<string, string> = {};
    for (const l of lines) {
      map[l.id] = resolveCssColor(l.color);
    }
    return map;
  }, [lines]);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const xDomainMs = useMemo(
    () => computeXTimeDomainMs(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- xAxis.domain drives domain
    [lines, xAxisConfig?.domain],
  );

  const xDomainDates = useMemo(
    (): [Date, Date] => [new Date(xDomainMs[0]), new Date(xDomainMs[1])],
    [xDomainMs],
  );

  const xScale = useMemo(
    () => scaleTime().domain(xDomainDates).range([0, innerWidth]),
    [xDomainDates, innerWidth],
  );

  const yDomain = useMemo(
    () => computeYDomain(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular deps mirror computeYDomain inputs
    [lines, referenceLines, valueLabels, yAxisConfig?.domain],
  );

  const yScale = useMemo(
    () => scaleLinear().domain(yDomain).range([innerHeight, 0]),
    [yDomain, innerHeight],
  );

  const valueLabelEntries = useMemo(
    () => resolveValueLabels(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- granular deps mirror resolveValueLabels inputs
    [lines, valueLabels, formatYLabel],
  );

  const linePaths = useMemo(() => {
    return lines.map((l) => {
      const curve = getD3Curve(l.curve);
      const runs = lineDataRuns(l.data, l.connectNulls);
      const lg = line<DataPoint & { value: number }>()
        .x((d) => xScale(new Date(d.timestamp)))
        .y((d) => yScale(d.value))
        .curve(curve);
      const ag = area<DataPoint & { value: number }>()
        .x((d) => xScale(new Date(d.timestamp)))
        .y0(innerHeight)
        .y1((d) => yScale(d.value))
        .curve(curve);
      const segments = runs.map((run) => ({
        pathD: lg(run) ?? '',
        areaD: ag(run) ?? '',
      }));
      return {
        id: l.id,
        segments,
        showGradient: Boolean(l.showGradient),
        color: resolvedColors[l.id],
        sw: l.width ?? 2,
      };
    });
  }, [innerHeight, lines, resolvedColors, xScale, yScale]);

  const xTicks = useMemo(() => {
    const ticksMs = ensureDomainBoundaryTicks(
      xAxisConfig?.ticks ??
        buildEvenlySpacedTicks(xDomainMs, xAxisConfig?.tickCount ?? 6),
      xDomainMs,
    );
    return ticksMs.map((tick) => new Date(tick));
  }, [xAxisConfig?.ticks, xAxisConfig?.tickCount, xDomainMs]);
  const yTicks = useMemo(
    () =>
      ensureDomainBoundaryTicks(
        yAxisConfig?.ticks ??
          buildEvenlySpacedTicks(yDomain, yAxisConfig?.tickCount ?? 5),
        yDomain,
      ),
    [yAxisConfig?.ticks, yAxisConfig?.tickCount, yDomain],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const mouseX = event.clientX - rect.left - margin.left;
      const x0 = xScale.invert(mouseX);
      const xMs = x0.getTime();

      const entries: Array<{
        lineId: string;
        point: DataPoint;
        color: string;
      }> = [];

      for (const l of lines) {
        const closest = nearestDefinedPointByTime(l.data, xMs);
        if (!closest) continue;

        entries.push({
          lineId: l.id,
          lineLabel: getSeriesLabel(l),
          point: closest,
          color: resolvedColors[l.id],
        });
      }

      if (entries.length > 0) {
        const primary = entries[0].point;
        const snapTs = primary.timestamp;
        if (snapTs !== lastSnapTsRef.current) {
          lastSnapTsRef.current = snapTs;
          const py = primary.value;
          setTooltip({
            entries,
            left: xScale(new Date(snapTs)) + margin.left,
            top:
              py != null
                ? yScale(py) + margin.top
                : margin.top + innerHeight / 2,
          });
        }
        onPointHover?.(primary, entries[0].lineId);

        if (lines[0] && onActiveIndexChange) {
          const idx = lines[0].data.findIndex(
            (p) => p.timestamp === primary.timestamp,
          );
          const nextIdx = idx >= 0 ? idx : null;
          if (nextIdx !== lastActiveIndexRef.current) {
            lastActiveIndexRef.current = nextIdx;
            onActiveIndexChange(nextIdx);
          }
        }
      }

      const mouseY = event.clientY - rect.top - margin.top;
      const HIT_RADIUS = 12;
      let hitMarker: typeof markers extends (infer M)[] | undefined
        ? M | null
        : never = null;
      if (markers) {
        for (const m of markers) {
          const mx = xScale(new Date(m.timestamp));
          const my = yScale(m.value);
          const dist = Math.sqrt((mouseX - mx) ** 2 + (mouseY - my) ** 2);
          if (dist <= HIT_RADIUS) {
            hitMarker = m;
            break;
          }
        }
      }
      onMarkerHover?.(hitMarker);
    },
    [
      xScale,
      yScale,
      lines,
      resolvedColors,
      onPointHover,
      onMarkerHover,
      onActiveIndexChange,
      margin.left,
      margin.top,
      innerHeight,
      markers,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    lastSnapTsRef.current = null;
    lastActiveIndexRef.current = null;
    setTooltip(null);
    onActiveIndexChange?.(null);
    onPointHover?.(null, '');
    onMarkerHover?.(null);
  }, [onPointHover, onMarkerHover, onActiveIndexChange]);

  const cursorXPx =
    dimAfterCursorEff && tooltip ? tooltip.left - margin.left : null;

  const a11yLive =
    tooltip?.entries[0] && lines[0] && getPointA11yLabel
      ? getPointA11yLabel(tooltip.entries[0].point, lines[0].id)
      : null;

  if (width < 10 || height < 10) return null;

  return (
    <div
      className={className}
      style={{ position: 'relative' }}
      role={chartAccessibilityLabel ? 'img' : undefined}
      aria-label={chartAccessibilityLabel}
    >
      {a11yLive ? <span className='sr-only'>{a11yLive}</span> : null}
      <svg ref={svgRef} width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <defs>
            {lines
              .filter((l) => l.showGradient)
              .map((l) => {
                const color = resolvedColors[l.id];
                return (
                  <linearGradient
                    key={`grad-${l.id}`}
                    id={`${uid}-grad-${l.id}`}
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop offset='0%' stopColor={color} stopOpacity={0.3} />
                    <stop offset='100%' stopColor={color} stopOpacity={0} />
                  </linearGradient>
                );
              })}
            {cursorXPx != null && (
              <>
                <clipPath id={`${uid}-clip-before`}>
                  <rect x={0} y={0} width={cursorXPx} height={innerHeight} />
                </clipPath>
                <clipPath id={`${uid}-clip-after`}>
                  <rect
                    x={cursorXPx}
                    y={0}
                    width={innerWidth - cursorXPx}
                    height={innerHeight}
                  />
                </clipPath>
              </>
            )}
          </defs>

          {(gridVisibility.x || gridVisibility.y) && (
            <>
              {gridVisibility.y &&
                yTicks.map((tick) => (
                  <line
                    key={`grid-y-${tick}`}
                    x1={0}
                    y1={yScale(tick)}
                    x2={innerWidth}
                    y2={yScale(tick)}
                    stroke={GRID_LINE_STROKE}
                    strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
                  />
                ))}
              {gridVisibility.x &&
                xTicks.map((tick) => (
                  <line
                    key={`grid-x-${tick.getTime()}`}
                    x1={xScale(tick)}
                    y1={0}
                    x2={xScale(tick)}
                    y2={innerHeight}
                    stroke={GRID_LINE_STROKE}
                    strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
                  />
                ))}
            </>
          )}

          {referenceLines?.map((rl, i) =>
            (rl.axis ?? 'y') === 'x' ? (
              <g key={`ref-x-${i}`}>
                <line
                  x1={xScale(new Date(rl.value))}
                  y1={0}
                  x2={xScale(new Date(rl.value))}
                  y2={innerHeight}
                  stroke={REFERENCE_LINE_STROKE}
                  strokeWidth={getReferenceLineStrokeWidth(rl.style)}
                  strokeDasharray={getRefLineStrokeDasharray(rl.style)}
                />
                {rl.label && (
                  <text
                    x={xScale(new Date(rl.value)) + 4}
                    y={12}
                    fill={REFERENCE_LINE_STROKE}
                    fontSize={12}
                    textAnchor='start'
                  >
                    {rl.label}
                  </text>
                )}
              </g>
            ) : (
              <g key={`ref-y-${i}`}>
                <line
                  x1={0}
                  y1={yScale(rl.value)}
                  x2={innerWidth}
                  y2={yScale(rl.value)}
                  stroke={REFERENCE_LINE_STROKE}
                  strokeWidth={getReferenceLineStrokeWidth(rl.style)}
                  strokeDasharray={getRefLineStrokeDasharray(rl.style)}
                />
                {rl.label && (
                  <text
                    x={
                      rl.labelPosition === 'left'
                        ? 4
                        : rl.labelPosition === 'right'
                          ? innerWidth - 4
                          : innerWidth / 2
                    }
                    y={yScale(rl.value) + 16}
                    fill={REFERENCE_LINE_STROKE}
                    fontSize={12}
                    textAnchor={
                      rl.labelPosition === 'left'
                        ? 'start'
                        : rl.labelPosition === 'right'
                          ? 'end'
                          : 'middle'
                    }
                  >
                    {rl.label}
                  </text>
                )}
              </g>
            ),
          )}

          {valueLabelEntries.map((vl) => {
            const cx = xScale(new Date(vl.timestamp));
            const cy = yScale(vl.value);
            const dy = vl.placement === 'above' ? -12 : 18;
            return (
              <text
                key={`vl-${vl.value}-${vl.placement}`}
                x={cx}
                y={cy + dy}
                fill='rgba(255, 255, 255, 0.7)'
                fontSize={12}
                fontWeight={600}
                textAnchor='middle'
              >
                {vl.label}
              </text>
            );
          })}

          {linePaths.map((lp) => {
            if (cursorXPx != null) {
              return (
                <g key={lp.id}>
                  <g clipPath={`url(#${uid}-clip-before)`}>
                    {lp.segments.map((seg, si) => (
                      <g key={`${lp.id}-b-${si}`}>
                        {lp.showGradient && (
                          <path
                            d={seg.areaD}
                            fill={`url(#${uid}-grad-${lp.id})`}
                            stroke='none'
                          />
                        )}
                        <path
                          d={seg.pathD}
                          fill='none'
                          stroke={lp.color}
                          strokeWidth={lp.sw}
                        />
                      </g>
                    ))}
                  </g>
                  <g clipPath={`url(#${uid}-clip-after)`}>
                    {lp.segments.map((seg, si) => (
                      <path
                        key={`${lp.id}-dim-${si}`}
                        d={seg.pathD}
                        fill='none'
                        stroke={DIM_COLOR}
                        strokeWidth={lp.sw}
                      />
                    ))}
                  </g>
                </g>
              );
            }

            return (
              <g key={`area-${lp.id}`}>
                {lp.segments.map((seg, si) => (
                  <g key={`${lp.id}-s-${si}`}>
                    {lp.showGradient && (
                      <path
                        d={seg.areaD}
                        fill={`url(#${uid}-grad-${lp.id})`}
                        stroke='none'
                      />
                    )}
                    <path
                      d={seg.pathD}
                      fill='none'
                      stroke={lp.color}
                      strokeWidth={lp.sw}
                    />
                  </g>
                ))}
              </g>
            );
          })}

          {showCursorEff && tooltip && (
            <line
              x1={tooltip.left - margin.left}
              y1={0}
              x2={tooltip.left - margin.left}
              y2={innerHeight}
              stroke='var(--text-muted)'
              strokeWidth={1}
              strokeDasharray='4 4'
              pointerEvents='none'
            />
          )}

          {tooltip?.entries.map((entry) => {
            const cx = xScale(new Date(entry.point.timestamp));
            const val = entry.point.value;
            if (val == null) return null;
            const cy = yScale(val);
            const valueText = formatYLabel ? formatYLabel(val) : String(val);
            const label = `${entry.lineLabel}: ${valueText}`;
            return (
              <g key={entry.lineId} pointerEvents='none'>
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={entry.color}
                  stroke='var(--background-surface)'
                  strokeWidth={2}
                />
                {showCursorLabelEff && (
                  <text
                    x={cx + 10}
                    y={cy + 4}
                    fill='#fff'
                    fontSize={11}
                    fontWeight={600}
                    textAnchor='start'
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}

          {showXAxisEff && (
            <g transform={`translate(0,${innerHeight})`}>
              <line
                x1={0}
                y1={0}
                x2={innerWidth}
                y2={0}
                stroke='var(--border-muted)'
              />
              {xTicks.map((tick) => (
                <text
                  key={tick.getTime()}
                  x={xScale(tick)}
                  y={20}
                  fill='var(--text-muted)'
                  fontSize={11}
                  textAnchor='middle'
                >
                  {xAxisTickFormatter
                    ? xAxisTickFormatter(tick.getTime())
                    : tick.toLocaleDateString()}
                </text>
              ))}
            </g>
          )}

          {showYAxisEff && (
            <g>
              {yTicks.map((tick) => (
                <text
                  key={tick}
                  x={-4}
                  y={yScale(tick)}
                  fill='var(--text-muted)'
                  fontSize={11}
                  textAnchor='end'
                  dominantBaseline='middle'
                >
                  {yAxisTickFormatter ? yAxisTickFormatter(tick) : String(tick)}
                </text>
              ))}
            </g>
          )}

          <rect
            width={innerWidth}
            height={innerHeight}
            fill='transparent'
            onMouseMove={enableScrubbing ? handleMouseMove : undefined}
            onMouseLeave={enableScrubbing ? handleMouseLeave : undefined}
          />

          {markers?.map((m, i) => {
            const isOutlined = m.variant === 'outlined';
            return (
              <circle
                key={`marker-${i}`}
                cx={xScale(new Date(m.timestamp))}
                cy={yScale(m.value)}
                r={m.radius ?? 4}
                fill={isOutlined ? 'transparent' : (m.color ?? '#E87A2C')}
                stroke={isOutlined ? (m.color ?? '#E87A2C') : 'none'}
                strokeWidth={isOutlined ? 2 : 0}
                pointerEvents='none'
              />
            );
          })}
        </g>
      </svg>

      {showTooltipEff && tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.left,
            top: tooltip.top,
            transform: 'translate(-50%, -120%)',
            backgroundColor: 'var(--background-surface)',
            color: 'var(--text-base)',
            border: '1px solid var(--border-muted)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 13,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.entries.map((entry) => (
            <div key={entry.lineId}>
              <span style={{ color: entry.color, fontWeight: 600 }}>
                {entry.lineLabel}
              </span>
              :{' '}
              {entry.point.value == null
                ? '—'
                : formatYLabel
                  ? formatYLabel(entry.point.value)
                  : entry.point.value}
            </div>
          ))}
          <div style={{ opacity: 0.6, marginTop: 2 }}>
            {formatXLabel
              ? formatXLabel(tooltip.entries[0].point.timestamp)
              : new Date(
                  tooltip.entries[0].point.timestamp,
                ).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};
