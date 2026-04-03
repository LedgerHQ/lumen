import { AxisBottom, AxisLeft } from '@visx/axis';
import { curveNatural } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridRows, GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath, AreaClosed } from '@visx/shape';
import { useTooltip, TooltipWithBounds } from '@visx/tooltip';
import { bisector, extent } from 'd3-array';
import { useMemo, useCallback, useId } from 'react';
import type { LineChartProps, DataPoint } from '../types';
import {
  resolveCssColor,
  resolveValueLabels,
  getRefLineStrokeDasharray,
  computeYDomain,
} from '../utils';

const getTimestamp = (d: DataPoint): Date => new Date(d.timestamp);
const getValue = (d: DataPoint): number => d.value;
const bisectDate = bisector<DataPoint, Date>((d) => new Date(d.timestamp)).left;

type TooltipData = {
  lineId: string;
  point: DataPoint;
  color: string;
};

const DIM_COLOR = 'rgba(128, 128, 128, 0.4)';

export const LineChartVisx = (props: LineChartProps) => {
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

  const hasNoAxes = !showXAxis && !showYAxis;
  const margin = hasNoAxes
    ? { top: 16, right: 40, bottom: 24, left: 16 }
    : { top: 16, right: 16, bottom: 40, left: 60 };

  const resolvedColors = useMemo(() => {
    const map: Record<string, string> = {};
    for (const line of lines) {
      map[line.id] = resolveCssColor(line.color);
    }
    return map;
  }, [lines]);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const allPoints = useMemo(() => lines.flatMap((l) => l.data), [lines]);

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: extent(allPoints, (d) => new Date(d.timestamp)) as [Date, Date],
        range: [0, innerWidth],
      }),
    [allPoints, innerWidth],
  );

  const yDomain = useMemo(() => computeYDomain(props), [props]);

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: yDomain,
        range: [innerHeight, 0],
      }),
    [yDomain, innerHeight],
  );

  const valueLabelEntries = useMemo(() => resolveValueLabels(props), [props]);

  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<TooltipData[]>();

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      const coords = localPoint(event);
      if (!coords) return;

      const x0 = xScale.invert(coords.x - margin.left);
      const tooltipEntries: TooltipData[] = [];

      for (const line of lines) {
        const idx = bisectDate(line.data, x0, 1);
        const d0 = line.data[idx - 1];
        const d1 = line.data[idx];
        if (!d0) continue;

        const closest =
          d1 && x0.getTime() - d0.timestamp > d1.timestamp - x0.getTime()
            ? d1
            : d0;

        tooltipEntries.push({
          lineId: line.id,
          point: closest,
          color: resolvedColors[line.id],
        });
      }

      if (tooltipEntries.length > 0) {
        const primaryPoint = tooltipEntries[0].point;
        showTooltip({
          tooltipData: tooltipEntries,
          tooltipLeft: xScale(new Date(primaryPoint.timestamp)) + margin.left,
          tooltipTop: yScale(primaryPoint.value) + margin.top,
        });
        onPointHover?.(primaryPoint, tooltipEntries[0].lineId);
      }
    },
    [xScale, yScale, lines, resolvedColors, showTooltip, onPointHover, margin],
  );

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
    onPointHover?.(null, '');
  }, [hideTooltip, onPointHover]);

  if (width < 10 || height < 10) return null;

  return (
    <div className={className} style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {showGrid && (
            <>
              <GridRows
                scale={yScale}
                width={innerWidth}
                stroke='var(--border-muted)'
                strokeOpacity={0.5}
                strokeDasharray='4 4'
              />
              <GridColumns
                scale={xScale}
                height={innerHeight}
                stroke='var(--border-muted)'
                strokeOpacity={0.5}
                strokeDasharray='4 4'
              />
            </>
          )}

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

          {(() => {
            const cursorXPx =
              dimAfterCursor && tooltipData && tooltipLeft != null
                ? tooltipLeft - margin.left
                : null;

            return (
              <>
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

                {lines.map((line) => {
                  const xAccessor = (d: DataPoint): number =>
                    xScale(getTimestamp(d)) ?? 0;
                  const yAccessor = (d: DataPoint): number =>
                    yScale(getValue(d)) ?? 0;
                  const color = resolvedColors[line.id];
                  const sw = line.width ?? 2;

                  if (cursorXPx != null) {
                    return (
                      <g key={line.id}>
                        <g clipPath={`url(#${uid}-clip-before)`}>
                          {line.showGradient && (
                            <>
                              <LinearGradient
                                id={`${uid}-grad-${line.id}`}
                                from={color}
                                fromOpacity={0.3}
                                to={color}
                                toOpacity={0}
                              />
                              <AreaClosed
                                data={line.data}
                                x={xAccessor}
                                y={yAccessor}
                                yScale={yScale}
                                curve={curveNatural}
                                fill={`url(#${uid}-grad-${line.id})`}
                                stroke='none'
                              />
                            </>
                          )}
                          <LinePath
                            data={line.data}
                            x={xAccessor}
                            y={yAccessor}
                            curve={curveNatural}
                            stroke={color}
                            strokeWidth={sw}
                          />
                        </g>
                        <g clipPath={`url(#${uid}-clip-after)`}>
                          <LinePath
                            data={line.data}
                            x={xAccessor}
                            y={yAccessor}
                            curve={curveNatural}
                            stroke={DIM_COLOR}
                            strokeWidth={sw}
                          />
                        </g>
                      </g>
                    );
                  }

                  return (
                    <g key={`area-${line.id}`}>
                      {line.showGradient && (
                        <>
                          <LinearGradient
                            id={`${uid}-grad-${line.id}`}
                            from={color}
                            fromOpacity={0.3}
                            to={color}
                            toOpacity={0}
                          />
                          <AreaClosed
                            data={line.data}
                            x={xAccessor}
                            y={yAccessor}
                            yScale={yScale}
                            curve={curveNatural}
                            fill={`url(#${uid}-grad-${line.id})`}
                            stroke='none'
                          />
                        </>
                      )}
                      <LinePath
                        data={line.data}
                        x={xAccessor}
                        y={yAccessor}
                        curve={curveNatural}
                        stroke={color}
                        strokeWidth={sw}
                      />
                    </g>
                  );
                })}
              </>
            );
          })()}

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

          {showCursor && tooltipData && tooltipLeft != null && (
            <line
              x1={tooltipLeft - margin.left}
              y1={0}
              x2={tooltipLeft - margin.left}
              y2={innerHeight}
              stroke='var(--text-muted)'
              strokeWidth={1}
              strokeDasharray='4 4'
              pointerEvents='none'
            />
          )}

          {tooltipData?.map((entry) => {
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

          {showXAxis && (
            <AxisBottom
              top={innerHeight}
              scale={xScale}
              numTicks={6}
              tickFormat={(val) =>
                formatXLabel
                  ? formatXLabel((val as Date).getTime())
                  : (val as Date).toLocaleDateString()
              }
              stroke='var(--border-muted)'
              tickStroke='transparent'
              tickLabelProps={{
                fill: 'var(--text-muted)',
                fontSize: 11,
                textAnchor: 'middle',
              }}
            />
          )}

          {showYAxis && (
            <AxisLeft
              scale={yScale}
              numTicks={5}
              tickFormat={(val) =>
                formatYLabel ? formatYLabel(val as number) : String(val)
              }
              stroke='transparent'
              tickStroke='transparent'
              tickLabelProps={{
                fill: 'var(--text-muted)',
                fontSize: 11,
                textAnchor: 'end',
                dx: -4,
              }}
            />
          )}

          <rect
            width={innerWidth}
            height={innerHeight}
            fill='transparent'
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </Group>
      </svg>

      {showTooltipProp && tooltipData && (
        <TooltipWithBounds
          left={tooltipLeft}
          top={tooltipTop}
          style={{
            backgroundColor: 'var(--background-surface)',
            color: 'var(--text-base)',
            border: '1px solid var(--border-muted)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 13,
            pointerEvents: 'none',
            position: 'absolute',
          }}
        >
          {tooltipData.map((entry) => (
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
              ? formatXLabel(tooltipData[0].point.timestamp)
              : new Date(tooltipData[0].point.timestamp).toLocaleDateString()}
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
};
