import { bisector, extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, area, curveNatural } from 'd3-shape';
import { useMemo, useCallback, useId, useState, useRef } from 'react';
import type { LineChartProps, DataPoint } from '../types';
import {
  resolveCssColor,
  resolveValueLabels,
  getRefLineStrokeDasharray,
  computeYDomain,
} from '../utils';

const DIM_COLOR = 'rgba(128, 128, 128, 0.4)';
const bisectDate = bisector<DataPoint, Date>((d) => new Date(d.timestamp)).left;

export const LineChartD3 = (props: LineChartProps) => {
  const {
    lines,
    width,
    height,
    showXAxis = true,
    showYAxis = true,
    showGrid = true,
    showTooltip: showTooltipProp = true,
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

  const uid = useId();
  const svgRef = useRef<SVGSVGElement>(null);

  const [tooltip, setTooltip] = useState<{
    entries: Array<{ lineId: string; point: DataPoint; color: string }>;
    left: number;
    top: number;
  } | null>(null);

  const hasNoAxes = !showXAxis && !showYAxis;
  const margin = useMemo(
    () =>
      hasNoAxes
        ? { top: 16, right: 40, bottom: 24, left: 16 }
        : { top: 16, right: 16, bottom: 40, left: 60 },
    [hasNoAxes],
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

  const allPoints = useMemo(() => lines.flatMap((l) => l.data), [lines]);

  const xScale = useMemo(
    () =>
      scaleTime()
        .domain(extent(allPoints, (d) => new Date(d.timestamp)) as [Date, Date])
        .range([0, innerWidth]),
    [allPoints, innerWidth],
  );

  const yDomain = useMemo(() => computeYDomain(props), [props]);

  const yScale = useMemo(
    () => scaleLinear().domain(yDomain).range([innerHeight, 0]),
    [yDomain, innerHeight],
  );

  const valueLabelEntries = useMemo(() => resolveValueLabels(props), [props]);

  const lineGenerator = useMemo(
    () =>
      line<DataPoint>()
        .x((d) => xScale(new Date(d.timestamp)))
        .y((d) => yScale(d.value))
        .curve(curveNatural),
    [xScale, yScale],
  );

  const areaGenerator = useMemo(
    () =>
      area<DataPoint>()
        .x((d) => xScale(new Date(d.timestamp)))
        .y0(innerHeight)
        .y1((d) => yScale(d.value))
        .curve(curveNatural),
    [xScale, yScale, innerHeight],
  );

  const xTicks = useMemo(() => xScale.ticks(6), [xScale]);
  const yTicks = useMemo(() => yScale.ticks(5), [yScale]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const mouseX = event.clientX - rect.left - margin.left;
      const x0 = xScale.invert(mouseX);

      const entries: Array<{
        lineId: string;
        point: DataPoint;
        color: string;
      }> = [];

      for (const l of lines) {
        const idx = bisectDate(l.data, x0, 1);
        const d0 = l.data[idx - 1];
        const d1 = l.data[idx];
        if (!d0) continue;

        const closest =
          d1 && x0.getTime() - d0.timestamp > d1.timestamp - x0.getTime()
            ? d1
            : d0;

        entries.push({
          lineId: l.id,
          point: closest,
          color: resolvedColors[l.id],
        });
      }

      if (entries.length > 0) {
        const primary = entries[0].point;
        setTooltip({
          entries,
          left: xScale(new Date(primary.timestamp)) + margin.left,
          top: yScale(primary.value) + margin.top,
        });
        onPointHover?.(primary, entries[0].lineId);
      }
    },
    [xScale, yScale, lines, resolvedColors, onPointHover, margin],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    onPointHover?.(null, '');
  }, [onPointHover]);

  if (width < 10 || height < 10) return null;

  const cursorXPx =
    dimAfterCursor && tooltip ? tooltip.left - margin.left : null;

  return (
    <div className={className} style={{ position: 'relative' }}>
      <svg ref={svgRef} width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid */}
          {showGrid && (
            <>
              {yTicks.map((tick) => (
                <line
                  key={`grid-y-${tick}`}
                  x1={0}
                  y1={yScale(tick)}
                  x2={innerWidth}
                  y2={yScale(tick)}
                  stroke='var(--border-muted)'
                  strokeOpacity={0.5}
                  strokeDasharray='4 4'
                />
              ))}
              {xTicks.map((tick) => (
                <line
                  key={`grid-x-${tick.getTime()}`}
                  x1={xScale(tick)}
                  y1={0}
                  x2={xScale(tick)}
                  y2={innerHeight}
                  stroke='var(--border-muted)'
                  strokeOpacity={0.5}
                  strokeDasharray='4 4'
                />
              ))}
            </>
          )}

          {/* Reference lines */}
          {referenceLines?.map((rl, i) => {
            const y = yScale(rl.value);
            return (
              <g key={`ref-${i}`}>
                <line
                  x1={0}
                  y1={y}
                  x2={innerWidth}
                  y2={y}
                  stroke={rl.color ?? 'var(--text-muted)'}
                  strokeWidth={1}
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
                    y={y + 16}
                    fill={rl.color ?? 'var(--text-muted)'}
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
            );
          })}

          {/* Value labels */}
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

          {/* Clip paths for dim-after-cursor */}
          {cursorXPx != null && (
            <defs>
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
            </defs>
          )}

          {/* Lines */}
          {lines.map((l) => {
            const color = resolvedColors[l.id];
            const sw = l.width ?? 2;
            const pathD = lineGenerator(l.data) ?? '';
            const areaD = areaGenerator(l.data) ?? '';

            if (cursorXPx != null) {
              return (
                <g key={l.id}>
                  <g clipPath={`url(#${uid}-clip-before)`}>
                    {l.showGradient && (
                      <>
                        <defs>
                          <linearGradient
                            id={`${uid}-grad-${l.id}`}
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='0%'
                              stopColor={color}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset='100%'
                              stopColor={color}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d={areaD}
                          fill={`url(#${uid}-grad-${l.id})`}
                          stroke='none'
                        />
                      </>
                    )}
                    <path
                      d={pathD}
                      fill='none'
                      stroke={color}
                      strokeWidth={sw}
                    />
                  </g>
                  <g clipPath={`url(#${uid}-clip-after)`}>
                    <path
                      d={pathD}
                      fill='none'
                      stroke={DIM_COLOR}
                      strokeWidth={sw}
                    />
                  </g>
                </g>
              );
            }

            return (
              <g key={`area-${l.id}`}>
                {l.showGradient && (
                  <>
                    <defs>
                      <linearGradient
                        id={`${uid}-grad-${l.id}`}
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop offset='0%' stopColor={color} stopOpacity={0.3} />
                        <stop offset='100%' stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <path
                      d={areaD}
                      fill={`url(#${uid}-grad-${l.id})`}
                      stroke='none'
                    />
                  </>
                )}
                <path d={pathD} fill='none' stroke={color} strokeWidth={sw} />
              </g>
            );
          })}

          {/* Markers */}
          {markers?.map((m, i) => (
            <circle
              key={`marker-${i}`}
              cx={xScale(new Date(m.timestamp))}
              cy={yScale(m.value)}
              r={m.radius ?? 4}
              fill={m.color ?? 'var(--text-base)'}
              stroke='none'
            />
          ))}

          {/* Cursor line */}
          {showCursor && tooltip && (
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

          {/* Active dots + cursor label */}
          {tooltip?.entries.map((entry) => {
            const cx = xScale(new Date(entry.point.timestamp));
            const cy = yScale(entry.point.value);
            const label = formatYLabel
              ? formatYLabel(entry.point.value)
              : String(entry.point.value);
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
                {showCursorLabel && (
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

          {/* X Axis */}
          {showXAxis && (
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
                  {formatXLabel
                    ? formatXLabel(tick.getTime())
                    : tick.toLocaleDateString()}
                </text>
              ))}
            </g>
          )}

          {/* Y Axis */}
          {showYAxis && (
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
                  {formatYLabel ? formatYLabel(tick) : String(tick)}
                </text>
              ))}
            </g>
          )}

          {/* Interaction overlay */}
          <rect
            width={innerWidth}
            height={innerHeight}
            fill='transparent'
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </g>
      </svg>

      {/* Tooltip */}
      {showTooltipProp && tooltip && (
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
                {entry.lineId}
              </span>
              :{' '}
              {formatYLabel
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
