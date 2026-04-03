import type { DataPoint, LineChartProps, ValueLabelConfig } from './types';

export function resolveCssColor(cssVar: string): string {
  if (!cssVar.startsWith('var(')) return cssVar;
  const varName = cssVar.slice(4, -1).trim();
  return (
    getComputedStyle(document.documentElement).getPropertyValue(varName).trim() ||
    cssVar
  );
}

export type ResolvedValueLabel = {
  timestamp: number;
  value: number;
  label: string;
  placement: 'above' | 'below';
};

export function resolveValueLabels(
  props: LineChartProps,
): ResolvedValueLabel[] {
  if (!props.valueLabels?.length) return [];

  const allPoints = props.lines.flatMap((l) => l.data);
  let minPt = allPoints[0];
  let maxPt = allPoints[0];
  for (const pt of allPoints) {
    if (pt.value < minPt.value) minPt = pt;
    if (pt.value > maxPt.value) maxPt = pt;
  }

  const format = props.formatYLabel ?? String;

  return props.valueLabels.map(
    (vl: ValueLabelConfig): ResolvedValueLabel => {
      let point: DataPoint;
      if (vl.type === 'min') point = minPt;
      else if (vl.type === 'max') point = maxPt;
      else point = { timestamp: 0, value: vl.value ?? 0 };

      return {
        timestamp: point.timestamp,
        value: point.value,
        label: vl.label ?? format(point.value),
        placement: vl.type === 'max' ? 'above' : 'below',
      };
    },
  );
}

export function getRefLineStrokeDasharray(
  style?: 'solid' | 'dashed' | 'dotted',
): string {
  switch (style) {
    case 'dotted':
      return '2 4';
    case 'dashed':
      return '6 4';
    default:
      return 'none';
  }
}

export function findDataPointAtTimestamp(
  data: DataPoint[],
  timestamp: number,
): DataPoint | undefined {
  return data.find((d) => d.timestamp === timestamp);
}

const Y_PADDING_FACTOR = 0.05;

export function computeYDomain(props: LineChartProps): [number, number] {
  const allValues = props.lines.flatMap((l) => l.data.map((d) => d.value));
  const refValues = (props.referenceLines ?? []).map((r) => r.value);
  const vlValues = (props.valueLabels ?? [])
    .filter((vl) => vl.type === 'custom' && vl.value != null)
    .map((vl) => vl.value as number);

  const combined = [...allValues, ...refValues, ...vlValues];
  const rawMin = Math.min(...combined);
  const rawMax = Math.max(...combined);
  const range = rawMax - rawMin || 1;
  const padding = range * Y_PADDING_FACTOR;

  return [rawMin - padding, rawMax + padding];
}
