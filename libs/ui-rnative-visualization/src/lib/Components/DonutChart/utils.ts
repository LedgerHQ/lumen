import { arc, pie, type PieArcDatum } from 'd3-shape';

import type { DonutGeometry } from './constants';
import type { DonutSegment } from './types';

/** A segment ready to draw: its path is centered at the origin. */
export type DonutArc = {
  id: string;
  path: string;
  color?: string;
  percent: number;
  midAngle: number;
  /** Angular span (radians, clockwise from 12 o'clock), used for tap hit-testing. */
  startAngle: number;
  endAngle: number;
  activeEnabled: boolean;
  activeTranslate: { x: number; y: number };
};

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

  const activeEnabled = drawable.length > 1;

  return layout(drawable).map((datum) => {
    const midAngle = (datum.startAngle + datum.endAngle) / 2;
    return {
      id: datum.data.segment.id,
      path: arcGenerator(snapHalfCircle(datum)) ?? '',
      color: datum.data.segment.color,
      percent: datum.data.percent,
      midAngle,
      startAngle: datum.startAngle,
      endAngle: datum.endAngle,
      activeEnabled,
      activeTranslate: activeEnabled
        ? {
            x: Math.sin(midAngle) * geometry.activeOffset,
            y: -Math.cos(midAngle) * geometry.activeOffset,
          }
        : { x: 0, y: 0 },
    };
  });
};

/**
 * Resolves which arc (if any) contains a point in the same origin-centered
 * coordinate space as `segment.path`. A single gesture-capture overlay hit-tests
 * taps this way instead of attaching a handler per segment, since per-shape
 * touch handlers on SVG/Reanimated nodes are unreliable on Android
 * (react-native-svg#1321, reanimated#2995).
 */
export const findSegmentIdAtPoint = (
  arcs: DonutArc[],
  point: { x: number; y: number },
  geometry: DonutGeometry,
): string | null => {
  const radius = Math.hypot(point.x, point.y);
  if (radius < geometry.innerRadius || radius > geometry.outerRadius) {
    return null;
  }

  const angle = normalizeAngle(Math.atan2(point.x, -point.y));
  const hit = arcs.find(
    (arc) => angle >= arc.startAngle && angle < arc.endAngle,
  );
  return hit?.id ?? null;
};

const normalizeAngle = (angle: number): number =>
  angle < 0 ? angle + 2 * Math.PI : angle;

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
