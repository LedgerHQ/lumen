import type { Series } from '../../../utils';

type LineChartProps = {
  series: Series[];
  width?: number;
  height?: number;
};

export function LineChart({
  series,
  width = 400,
  height = 300,
}: LineChartProps) {
  return (
    <svg width={width} height={height} role='img' aria-label='Line chart'>
      <title>{`Line chart with ${series.length} series`}</title>
      <rect width={width} height={height} rx={8} fill='#F3F0FA' />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor='middle'
        dominantBaseline='central'
        fill='#7e4ea5'
        fontSize={14}
        fontFamily='Inter, sans-serif'
      >
        LineChart placeholder
      </text>
    </svg>
  );
}
