import { arc, pie, type PieArcDatum } from 'd3-shape';

import { chartConfig } from '../../config';

import type { DonutArc, DonutGeometry, DonutSegment, DonutSize } from './types';

export const DONUT_GEOMETRY: Readonly<Record<DonutSize, DonutGeometry>> =
  chartConfig.donut.size;

export const resolveSegmentColor = (segment: DonutSegment): string =>
  segment.color ?? chartConfig.donut.defaultSegmentColor;

/** Percent (0–100) of the total per segment. Negatives count as 0; a zero total yields all zeros. */
export const getSegmentPercents = (series: DonutSegment[]): number[] => {
  const total = series.reduce((sum, s) => sum + Math.max(s.value, 0), 0);
  if (total <= 0) {
    return series.map(() => 0);
  }
  return series.map((s) => (Math.max(s.value, 0) / total) * 100);
};

/**
 * One arc per drawable segment, in series order, clockwise from 12 o'clock.
 * Zero and negative segments are dropped so they don't emit degenerate paths;
 * percents are still computed against the full series total. Empty when there
 * is nothing to draw.
 */
export const buildArcs = (
  series: DonutSegment[],
  geometry: DonutGeometry,
): DonutArc[] => {
  const percents = getSegmentPercents(series);

  const drawable = series
    .map((segment, index) => ({ segment, percent: percents[index] }))
    .filter((entry) => entry.percent > 0);

  if (drawable.length === 0) {
    return [];
  }

  const layout = pie<(typeof drawable)[number]>()
    .value((entry) => entry.segment.value)
    .sort(null)
    .sortValues(null)
    .padAngle(geometry.padAngle);

  const arcGenerator = arc<PieArcDatum<(typeof drawable)[number]>>()
    .innerRadius(geometry.innerRadius)
    .outerRadius(geometry.outerRadius)
    .cornerRadius(geometry.cornerRadius);

  return layout(drawable).map((datum) => ({
    id: datum.data.segment.id,
    path: arcGenerator(snapHalfCircle(datum)) ?? '',
    color: resolveSegmentColor(datum.data.segment),
    percent: datum.data.percent,
  }));
};

/**
 * Snap a near-half-circle slice to exactly `π`. d3-shape squares the corners of
 * a slice spanning a hair under `π` (its parallel edges never meet) but rounds
 * one landing exactly on `π`, so two equal slices end up mismatched. The nudge
 * is sub-pixel and never fires for real sub-half-circle slices.
 */
const HALF_CIRCLE_EPSILON = 1e-9;
const snapHalfCircle = <T>(datum: PieArcDatum<T>): PieArcDatum<T> => {
  const span = datum.endAngle - datum.startAngle;
  if (span < Math.PI && Math.PI - span < HALF_CIRCLE_EPSILON) {
    return { ...datum, endAngle: datum.startAngle + Math.PI };
  }
  return datum;
};

/** Full, gapless ring path used for the empty ring. */
export const buildEmptyRingPath = (geometry: DonutGeometry): string => {
  const emptyRingArc = arc<unknown>()
    .innerRadius(geometry.innerRadius)
    .outerRadius(geometry.outerRadius)
    .startAngle(0)
    .endAngle(2 * Math.PI);
  return emptyRingArc(null) ?? '';
};
