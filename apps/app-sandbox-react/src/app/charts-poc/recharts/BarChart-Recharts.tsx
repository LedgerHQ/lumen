import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import type { BarChartProps } from '../types';
import { GRID_LINE_STROKE, GRID_LINE_STROKE_DASHARRAY } from '../utils';

export const BarChartRecharts = (props: BarChartProps) => {
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

  const chartData = useMemo(
    () => data.map((d) => ({ category: d.category, ...d.values })),
    [data],
  );

  return (
    <div className={className}>
      <BarChart
        width={width}
        height={height}
        data={chartData}
        margin={{ top: 16, right: 16, bottom: 8, left: 16 }}
      >
        {showGrid && (
          <CartesianGrid
            stroke={GRID_LINE_STROKE}
            strokeDasharray={GRID_LINE_STROKE_DASHARRAY}
            vertical={false}
          />
        )}
        <XAxis
          dataKey='category'
          tick={
            showXLabels
              ? { fontSize: 11, fill: 'var(--text-muted)' }
              : false
          }
          axisLine={{ stroke: 'var(--border-muted)' }}
          tickLine={false}
        />
        <YAxis
          tick={
            showYLabels
              ? { fontSize: 11, fill: 'var(--text-muted)' }
              : false
          }
          tickFormatter={formatYLabel}
          axisLine={false}
          tickLine={false}
        />
        {showTooltip && (
          <Tooltip
            formatter={(value, name) => {
              const numVal = typeof value === 'number' ? value : Number(value);
              const strName = String(name);
              const label =
                series.find((s) => s.id === strName)?.label ?? strName;
              return [formatYLabel ? formatYLabel(numVal) : numVal, label];
            }}
            contentStyle={{
              background: 'var(--background-surface)',
              border: '1px solid var(--border-muted)',
              borderRadius: 8,
              fontSize: 11,
            }}
          />
        )}
        {series.map((s) => (
          <Bar
            key={s.id}
            dataKey={s.id}
            name={s.id}
            stackId={layout === 'stacked' ? 'stack' : undefined}
            radius={layout === 'stacked' ? 0 : [4, 4, 0, 0]}
          >
            {chartData.map((_, i) => (
              <Cell key={`${s.id}-${i}`} fill={s.color} />
            ))}
          </Bar>
        ))}
      </BarChart>
    </div>
  );
};
