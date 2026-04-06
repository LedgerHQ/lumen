import { bisector } from 'd3-array';
import type {
  ChartGridConfig,
  DataPoint,
  LineChartProps,
  LineConfig,
  ReferenceLineStyle,
  ValueLabelConfig,
} from './types';

const bisectTimestampLeft = bisector<DataPoint, number>(
  (d) => d.timestamp,
).left;

export const GRID_LINE_STROKE = 'rgba(148, 163, 184, 0.35)';
export const GRID_LINE_STROKE_DASHARRAY = '1 4';
export const GRID_LINE_STROKE_WIDTH = 1;
export const REFERENCE_LINE_STROKE = 'rgba(255, 255, 255, 0.42)';

export const resolveSeries = (props: LineChartProps): LineConfig[] => {
  const bySeries = props.series;
  if (bySeries && bySeries.length > 0) {
    return bySeries;
  }
  return props.lines ?? [];
};

export const getSeriesLabel = (series: LineConfig): string => {
  return series.label ?? series.id;
};

export const buildEvenlySpacedTicks = (
  domain: [number, number],
  tickCount: number,
): number[] => {
  const start = domain[0];
  const end = domain[1];
  if (!Number.isFinite(start) || !Number.isFinite(end)) return [];
  if (start === end) return [start];
  const safeCount = Math.max(2, Math.floor(tickCount));
  const step = (end - start) / (safeCount - 1);
  const ticks: number[] = [];
  for (let i = 0; i < safeCount; i++) {
    ticks.push(start + step * i);
  }
  return ticks;
};

export const ensureDomainBoundaryTicks = (
  ticks: number[] | undefined,
  domain: [number, number],
): number[] => {
  const start = domain[0];
  const end = domain[1];
  const base = ticks ?? [];
  const merged = [...base, start, end].filter((v) => Number.isFinite(v));
  const unique = Array.from(new Set(merged)).sort((a, b) => a - b);
  if (unique.length === 0) return [start, end];
  return unique;
};

export type ResolvedValueLabel = {
  timestamp: number;
  value: number;
  label: string;
  placement: 'above' | 'below';
};

export const resolveValueLabels = (
  props: LineChartProps,
): ResolvedValueLabel[] => {
  if (!props.valueLabels?.length) return [];
  const lines = resolveSeries(props);

  const numericPoints = lines
    .flatMap((line) => line.data)
    .filter(
      (point): point is DataPoint & { value: number } => point.value != null,
    );
  if (numericPoints.length === 0) return [];

  let minPoint = numericPoints[0];
  let maxPoint = numericPoints[0];
  for (const point of numericPoints) {
    if (point.value < minPoint.value) minPoint = point;
    if (point.value > maxPoint.value) maxPoint = point;
  }

  const format = props.formatYLabel ?? String;

  return props.valueLabels.map(
    (valueLabel: ValueLabelConfig): ResolvedValueLabel => {
      let point: DataPoint & { value: number };
      if (valueLabel.type === 'min') point = minPoint;
      else if (valueLabel.type === 'max') point = maxPoint;
      else point = { timestamp: 0, value: valueLabel.value ?? 0 };

      return {
        timestamp: point.timestamp,
        value: point.value,
        label: valueLabel.label ?? format(point.value),
        placement: valueLabel.type === 'max' ? 'above' : 'below',
      };
    },
  );
};

export const getRefLineStrokeDasharray = (
  style?: ReferenceLineStyle,
): string => {
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
};

export const getReferenceLineStrokeWidth = (
  style?: ReferenceLineStyle,
): number => {
  return style === 'border' ? 2 : 1;
};

export const nearestDefinedPointByTime = (
  data: DataPoint[],
  xMs: number,
): DataPoint | undefined => {
  if (data.length === 0) return undefined;
  const idx = bisectTimestampLeft(data, xMs, 1);
  const d0 = data[idx - 1];
  const d1 = data[idx];
  const timePick =
    d1 && d0 && xMs - d0.timestamp > d1.timestamp - xMs ? d1 : (d0 ?? d1);
  if (timePick && timePick.value != null) return timePick;

  const withValue = [d0, d1].filter(
    (datum): datum is DataPoint & { value: number } =>
      datum != null && datum.value != null,
  );
  if (withValue.length > 0) {
    return withValue.reduce((a, b) =>
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
};

const Y_PADDING_FACTOR = 0.05;

export const computeYDomain = (props: LineChartProps): [number, number] => {
  const lines = resolveSeries(props);
  if (props.yAxis?.domain) {
    return props.yAxis.domain;
  }

  const allValues = lines.flatMap((line) =>
    line.data.map((point) => point.value).filter((v): v is number => v != null),
  );

  const horizontalRefValues = (props.referenceLines ?? [])
    .filter((referenceLine) => (referenceLine.axis ?? 'y') === 'y')
    .map((referenceLine) => referenceLine.value);

  const valueLabelValues = (props.valueLabels ?? [])
    .filter(
      (valueLabel) => valueLabel.type === 'custom' && valueLabel.value != null,
    )
    .map((valueLabel) => valueLabel.value as number);

  const combined = [...allValues, ...horizontalRefValues, ...valueLabelValues];
  if (combined.length === 0) {
    return [0, 1];
  }

  let rawMin = combined[0];
  let rawMax = combined[0];
  for (let i = 1; i < combined.length; i++) {
    const value = combined[i];
    if (value < rawMin) rawMin = value;
    if (value > rawMax) rawMax = value;
  }

  const range = rawMax - rawMin || 1;
  const padding = range * Y_PADDING_FACTOR;
  return [rawMin - padding, rawMax + padding];
};

/** X domain in epoch ms; respects `xAxis.domain` when set. */
export const computeXTimeDomainMs = (
  props: LineChartProps,
): [number, number] => {
  const lines = resolveSeries(props);
  if (props.xAxis?.domain) {
    return props.xAxis.domain;
  }

  const allPoints = lines.flatMap((line) => line.data);
  if (allPoints.length === 0) {
    const now = Date.now();
    return [now, now];
  }

  let min = allPoints[0].timestamp;
  let max = allPoints[0].timestamp;
  for (let i = 1; i < allPoints.length; i++) {
    const timestamp = allPoints[i].timestamp;
    if (timestamp < min) min = timestamp;
    if (timestamp > max) max = timestamp;
  }
  return [min, max];
};

export const resolveChartInset = (
  inset: LineChartProps['inset'],
  base: { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } => {
  if (!inset) return base;
  return {
    top: inset.top ?? base.top,
    right: inset.right ?? base.right,
    bottom: inset.bottom ?? base.bottom,
    left: inset.left ?? base.left,
  };
};

export const effectiveShowXAxis = (props: LineChartProps): boolean => {
  return props.xAxis?.show ?? true;
};

export const effectiveShowYAxis = (props: LineChartProps): boolean => {
  return props.yAxis?.show ?? true;
};

const normalizeLegacyGrid = (
  showGrid: ChartGridConfig | undefined,
): {
  x: boolean;
  y: boolean;
} => {
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
};

export const resolveGridVisibility = (
  props: LineChartProps,
): {
  x: boolean;
  y: boolean;
} => {
  const legacy = normalizeLegacyGrid(props.showGrid);
  return {
    x: props.xAxis?.showGrid ?? legacy.x,
    y: props.yAxis?.showGrid ?? legacy.y,
  };
};

/**
 * Contiguous runs of points with numeric values. If `connectNulls`, returns
 * a single run of all defined points.
 */
export const lineDataRuns = (
  data: DataPoint[],
  connectNulls: boolean | undefined,
): Array<Array<DataPoint & { value: number }>> => {
  const shouldConnectNulls = connectNulls ?? false;
  if (shouldConnectNulls) {
    const defined = data.filter(
      (datum): datum is DataPoint & { value: number } => datum.value != null,
    );
    return defined.length ? [defined] : [];
  }

  const runs: Array<Array<DataPoint & { value: number }>> = [];
  let run: Array<DataPoint & { value: number }> = [];
  for (const datum of data) {
    if (datum.value == null) {
      if (run.length) {
        runs.push(run);
        run = [];
      }
    } else {
      run.push({ ...datum, value: datum.value });
    }
  }
  if (run.length) runs.push(run);
  return runs;
};
