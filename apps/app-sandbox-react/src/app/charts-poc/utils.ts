import { bisector } from 'd3-array';
import type {
  ChartGridConfig,
  DataPoint,
  LineConfig,
  LineChartProps,
  ReferenceLineStyle,
  ValueLabelConfig,
} from './types';

const bisectTimestampLeft = bisector<DataPoint, number>(
  (d) => d.timestamp,
).left;

export function resolveCssColor(cssVar: string): string {
  if (!cssVar.startsWith('var(')) return cssVar;
  const varName = cssVar.slice(4, -1).trim();
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim() || cssVar
  );
}

export function resolveSeries(props: LineChartProps): LineConfig[] {
  const bySeries = props.series;
  if (bySeries && bySeries.length > 0) {
    return bySeries;
  }
  return props.lines ?? [];
}

export function getSeriesLabel(series: LineConfig): string {
  return series.label ?? series.id;
}

/** Shared dotted grid style used by all renderers. */
export const GRID_LINE_STROKE = 'rgba(148, 163, 184, 0.35)';
export const GRID_LINE_STROKE_DASHARRAY = '1 4';
export const GRID_LINE_STROKE_WIDTH = 1;

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
  const lines = resolveSeries(props);

  const numericPoints = lines
    .flatMap((l) => l.data)
    .filter((p): p is DataPoint & { value: number } => p.value != null);
  if (numericPoints.length === 0) return [];

  let minPt = numericPoints[0];
  let maxPt = numericPoints[0];
  for (const pt of numericPoints) {
    if (pt.value < minPt.value) minPt = pt;
    if (pt.value > maxPt.value) maxPt = pt;
  }

  const format = props.formatYLabel ?? String;

  return props.valueLabels.map((vl: ValueLabelConfig): ResolvedValueLabel => {
    let point: DataPoint & { value: number };
    if (vl.type === 'min') point = minPt;
    else if (vl.type === 'max') point = maxPt;
    else point = { timestamp: 0, value: vl.value ?? 0 };

    return {
      timestamp: point.timestamp,
      value: point.value,
      label: vl.label ?? format(point.value),
      placement: vl.type === 'max' ? 'above' : 'below',
    };
  });
}

/** Neutral grey for horizontal reference lines on dark chart backgrounds */
export const REFERENCE_LINE_STROKE = 'rgba(255, 255, 255, 0.42)';

export function getRefLineStrokeDasharray(style?: ReferenceLineStyle): string {
  switch (style) {
    case 'dotted':
      return '2 4';
    case 'dashed':
      return '6 4';
    case 'border':
      return 'none';
    default:
      return 'none';
  }
}

export function getReferenceLineStrokeWidth(
  style?: ReferenceLineStyle,
): number {
  return style === 'border' ? 2 : 1;
}

/** Labels for UI / legend */
export function getReferenceLineStyleCaption(
  style?: ReferenceLineStyle,
): string {
  switch (style) {
    case 'dashed':
      return 'Dashed';
    case 'dotted':
      return 'Dotted';
    case 'border':
      return 'Border (thick)';
    default:
      return 'Plain';
  }
}

export function findDataPointAtTimestamp(
  data: DataPoint[],
  timestamp: number,
): DataPoint | undefined {
  return data.find((d) => d.timestamp === timestamp);
}

/** Nearest point by x (ms), preferring defined `value` for tooltips. */
export function nearestDefinedPointByTime(
  data: DataPoint[],
  xMs: number,
): DataPoint | undefined {
  if (data.length === 0) return undefined;
  const idx = bisectTimestampLeft(data, xMs, 1);
  const d0 = data[idx - 1];
  const d1 = data[idx];
  const timePick =
    d1 && d0 && xMs - d0.timestamp > d1.timestamp - xMs ? d1 : (d0 ?? d1);
  if (timePick && timePick.value != null) return timePick;
  const withVal = [d0, d1].filter(
    (d): d is DataPoint & { value: number } => d != null && d.value != null,
  );
  if (withVal.length > 0) {
    return withVal.reduce((a, b) =>
      Math.abs(a.timestamp - xMs) <= Math.abs(b.timestamp - xMs) ? a : b,
    );
  }
  for (let i = idx - 1; i >= 0; i--) {
    if (data[i].value != null) return data[i];
  }
  for (let i = idx; i < data.length; i++) {
    if (data[i].value != null) return data[i];
  }
  return undefined;
}

const Y_PADDING_FACTOR = 0.05;

export function computeYDomain(props: LineChartProps): [number, number] {
  const lines = resolveSeries(props);
  if (props.yAxis?.domain) {
    return props.yAxis.domain;
  }

  const allValues = lines.flatMap((l) =>
    l.data.map((d) => d.value).filter((v): v is number => v != null),
  );

  const horizontalRefValues = (props.referenceLines ?? [])
    .filter((r) => (r.axis ?? 'y') === 'y')
    .map((r) => r.value);

  const vlValues = (props.valueLabels ?? [])
    .filter((vl) => vl.type === 'custom' && vl.value != null)
    .map((vl) => vl.value as number);

  const combined = [...allValues, ...horizontalRefValues, ...vlValues];
  if (combined.length === 0) {
    return [0, 1];
  }
  let rawMin = combined[0];
  let rawMax = combined[0];
  for (let i = 1; i < combined.length; i++) {
    const v = combined[i];
    if (v < rawMin) rawMin = v;
    if (v > rawMax) rawMax = v;
  }
  const range = rawMax - rawMin || 1;
  const padding = range * Y_PADDING_FACTOR;

  return [rawMin - padding, rawMax + padding];
}

/** X domain in epoch ms; respects `xAxis.domain` when set. */
export function computeXTimeDomainMs(props: LineChartProps): [number, number] {
  const lines = resolveSeries(props);
  if (props.xAxis?.domain) {
    return props.xAxis.domain;
  }

  const allPoints = lines.flatMap((l) => l.data);
  if (allPoints.length === 0) {
    const n = Date.now();
    return [n, n];
  }
  let min = allPoints[0].timestamp;
  let max = allPoints[0].timestamp;
  for (let i = 1; i < allPoints.length; i++) {
    const t = allPoints[i].timestamp;
    if (t < min) min = t;
    if (t > max) max = t;
  }
  return [min, max];
}

export function resolveChartInset(
  inset: LineChartProps['inset'],
  base: { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } {
  if (!inset) return base;
  return {
    top: inset.top ?? base.top,
    right: inset.right ?? base.right,
    bottom: inset.bottom ?? base.bottom,
    left: inset.left ?? base.left,
  };
}

export function effectiveShowXAxis(props: LineChartProps): boolean {
  return props.xAxis?.show ?? true;
}

export function effectiveShowYAxis(props: LineChartProps): boolean {
  return props.yAxis?.show ?? true;
}

function normalizeLegacyGrid(showGrid: ChartGridConfig | undefined): {
  x: boolean;
  y: boolean;
} {
  if (showGrid == null) {
    return { x: true, y: true };
  }
  if (typeof showGrid === 'boolean') {
    return { x: showGrid, y: showGrid };
  }
  return {
    x: showGrid.x ?? true,
    y: showGrid.y ?? true,
  };
}

export function resolveGridVisibility(props: LineChartProps): {
  x: boolean;
  y: boolean;
} {
  const legacy = normalizeLegacyGrid(props.showGrid);
  return {
    x: props.xAxis?.showGrid ?? legacy.x,
    y: props.yAxis?.showGrid ?? legacy.y,
  };
}

/**
 * Contiguous runs of points with numeric values. If `connectNulls`, returns
 * a single run of all defined points (simplified vs Recharts bridge semantics).
 */
export function lineDataRuns(
  data: DataPoint[],
  connectNulls: boolean | undefined,
): Array<Array<DataPoint & { value: number }>> {
  const cn = connectNulls ?? false;
  if (cn) {
    const defined = data.filter(
      (d): d is DataPoint & { value: number } => d.value != null,
    );
    return defined.length ? [defined] : [];
  }
  const runs: Array<Array<DataPoint & { value: number }>> = [];
  let run: Array<DataPoint & { value: number }> = [];
  for (const d of data) {
    if (d.value == null) {
      if (run.length) {
        runs.push(run);
        run = [];
      }
    } else {
      run.push({ ...d, value: d.value as number });
    }
  }
  if (run.length) runs.push(run);
  return runs;
}
