import { arc, pie, type PieArcDatum } from 'd3-shape';

import type { DonutGeometry } from './constants';
import type { DonutSegment } from './types';

/** A segment ready to draw: its path is centered at the origin. */
export type DonutArc = {
  id: string;
  path: string;
  color?: string;
  percent: number;
};

/** Percent (0–100) of the total per segment. Negatives count as 0; a zero total yields all zeros. */
export const getSegmentPercents = (series: DonutSegment[]): number[] => {
  const total = series.reduce((sum, s) => sum + Math.max(s.value, 0), 0);
  if (total <= 0) {
    return series.map(() => 0);
  }
  return series.map((s) => (Math.max(s.value, 0) / total) * 100);
};

/** One arc per segment, in series order, clockwise from 12 o'clock. Empty when there is nothing to draw. */
export const buildArcs = (
  series: DonutSegment[],
  geometry: DonutGeometry,
): DonutArc[] => {
  const percents = getSegmentPercents(series);
  if (percents.every((percent) => percent === 0)) {
    return [];
  }

  const layout = pie<DonutSegment>()
    .value((segment) => Math.max(segment.value, 0))
    .sort(null)
    .sortValues(null)
    .padAngle(geometry.padAngle);

  const arcGenerator = arc<PieArcDatum<DonutSegment>>()
    .innerRadius(geometry.innerRadius)
    .outerRadius(geometry.outerRadius)
    .cornerRadius(geometry.cornerRadius);

  return layout(series).map((datum, index) => ({
    id: datum.data.id,
    path: arcGenerator(snapHalfCircle(datum)) ?? '',
    color: datum.data.color,
    percent: percents[index],
  }));
};

/**
 * Snap a near-half-circle slice to exactly `π`. d3-shape squares the corners of
 * a slice spanning a hair under `π` (its parallel edges never meet) but rounds
 * one landing exactly on `π`, so two equal slices end up mismatched. The nudge
 * is sub-pixel and never fires for real sub-half-circle slices.
 */
const HALF_CIRCLE_EPSILON = 1e-9;
const snapHalfCircle = (
  datum: PieArcDatum<DonutSegment>,
): PieArcDatum<DonutSegment> => {
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
