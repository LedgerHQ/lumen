import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { useMemo, useCallback, useState, useRef } from 'react';
import type { BarChartProps } from '../types';
import { GRID_LINE_STROKE, GRID_LINE_STROKE_DASHARRAY } from '../utils';

const MARGIN = { top: 16, right: 16, bottom: 40, left: 60 };

type TooltipState = {
  x: number;
  y: number;
  category: string;
  seriesId: string;
  value: number;
} | null;

export const BarChartD3 = (props: BarChartProps) => {
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

  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(
    () =>
      scaleBand()
        .domain(data.map((d) => d.category))
        .range([0, innerWidth])
        .padding(0.2),
    [data, innerWidth],
  );

  const seriesScale = useMemo(
    () =>
      scaleBand()
        .domain(series.map((s) => s.id))
        .range([0, xScale.bandwidth()])
        .padding(0.1),
    [series, xScale],
  );

  const colorScale = useMemo(
    () =>
      scaleOrdinal<string>()
        .domain(series.map((s) => s.id))
        .range(series.map((s) => s.color)),
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
      scaleLinear()
        .domain([0, yMax * 1.1])
        .range([innerHeight, 0])
        .nice(),
    [yMax, innerHeight],
  );

  const yTicks = yScale.ticks(5);

  const handleMouseMove = useCallback(
    (
      event: React.MouseEvent,
      category: string,
      seriesId: string,
      value: number,
    ) => {
      if (!showTooltip || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        category,
        seriesId,
        value,
      });
    },
    [showTooltip],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <svg ref={svgRef} width={width} height={height}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {showGrid &&
            yTicks.map((tick) => (
              <line
                key={`grid-${tick}`}
                x1={0}
                x2={innerWidth}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke={GRID_LINE_STROKE}
                strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
              />
            ))}

          {layout === 'grouped'
            ? data.map((d) => {
                const x0 = xScale(d.category) ?? 0;
                return series.map((s) => {
                  const barX = x0 + (seriesScale(s.id) ?? 0);
                  const barWidth = seriesScale.bandwidth();
                  const value = d.values[s.id] ?? 0;
                  const barY = yScale(value);
                  const barHeight = innerHeight - barY;
                  return (
                    <rect
                      key={`${d.category}-${s.id}`}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={colorScale(s.id)}
                      rx={4}
                      onMouseMove={(e) =>
                        handleMouseMove(e, d.category, s.id, value)
                      }
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                });
              })
            : data.map((d) => {
                const x0 = xScale(d.category) ?? 0;
                const barWidth = xScale.bandwidth();
                let cumY = 0;
                return series.map((s) => {
                  const value = d.values[s.id] ?? 0;
                  const barHeight = innerHeight - yScale(value);
                  cumY += barHeight;
                  const barY = innerHeight - cumY;
                  return (
                    <rect
                      key={`${d.category}-${s.id}`}
                      x={x0}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      fill={colorScale(s.id)}
                      onMouseMove={(e) =>
                        handleMouseMove(e, d.category, s.id, value)
                      }
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                });
              })}

          {/* X axis */}
          <line
            x1={0}
            x2={innerWidth}
            y1={innerHeight}
            y2={innerHeight}
            stroke='var(--border-muted)'
          />
          {showXLabels &&
            data.map((d) => {
              const x = (xScale(d.category) ?? 0) + xScale.bandwidth() / 2;
              return (
                <text
                  key={`xlabel-${d.category}`}
                  x={x}
                  y={innerHeight + 24}
                  textAnchor='middle'
                  fontSize={11}
                  fill='var(--text-muted)'
                >
                  {d.category}
                </text>
              );
            })}

          {/* Y axis */}
          {showYLabels &&
            yTicks.map((tick) => (
              <text
                key={`ylabel-${tick}`}
                x={-8}
                y={yScale(tick)}
                textAnchor='end'
                dominantBaseline='middle'
                fontSize={11}
                fill='var(--text-muted)'
              >
                {formatYLabel ? formatYLabel(tick) : tick}
              </text>
            ))}
        </g>
      </svg>

      {showTooltip && tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 12,
            top: tooltip.y - 12,
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
          <strong>{tooltip.category}</strong>
          <br />
          {series.find((s) => s.id === tooltip.seriesId)?.label ??
            tooltip.seriesId}
          :{' '}
          {formatYLabel ? formatYLabel(tooltip.value) : tooltip.value}
        </div>
      )}
    </div>
  );
};
