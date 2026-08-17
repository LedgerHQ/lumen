import { arc, pie, type PieArcDatum } from 'd3-shape';

import { chartConfig } from '../../config';

import type {
  DonutGeometry,
  DonutPlaceholderSegment,
  DonutRingSegment,
  DonutSegment,
  DonutSize,
} from './types';

export const DONUT_GEOMETRY: Readonly<Record<DonutSize, DonutGeometry>> =
  chartConfig.donut.size;

export const resolveSegmentColor = (segment: DonutSegment): string =>
  segment.color ?? chartConfig.donut.defaultSegmentColor;

export const getDonutViewBox = (geometry: DonutGeometry): string => {
  const { box, hoverOffset } = geometry;
  const paddedBox = box + 2 * hoverOffset;
  return `-${hoverOffset} -${hoverOffset} ${paddedBox} ${paddedBox}`;
};

/**
 * Max width (px) for center content.
 */
export const getCenterMaxWidth = (geometry: DonutGeometry): number =>
  geometry.innerRadius * 2 - chartConfig.donut.centerContentInset;

/** Round a percent to at most 1 decimal. */
export const roundPercent = (percent: number): number =>
  Math.round(percent * 10) / 10;

/**
 * Display-ready percent, e.g. `7%`, `7.3%` or `<0.1%`. Rounding here keeps
 * float artifacts — `7 / 100 * 100` is `7.000000000000001` — out of labels
 * while leaving the exact `percent` intact for consumers who compute with it.
 */
export const formatPercentLabel = (percent: number): string => {
  const rounded = roundPercent(percent);
  if (rounded === 0 && percent > 0) {
    return '<0.1%';
  }
  return `${rounded}%`;
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
 * `minSegmentArc` as a share of the angle `pie` has left to hand out once
 * it reserves a `padAngle` gap per segment.
 */
const getMinSegmentShare = (geometry: DonutGeometry, count: number): number => {
  const midRadius = (geometry.innerRadius + geometry.outerRadius) / 2;
  const distributable = 2 * Math.PI - count * geometry.padAngle;
  if (distributable <= 0) {
    return 0;
  }
  return geometry.minSegmentArc / midRadius / distributable;
};

/**
 * Drawing weights summing to 1, none below `minShare`, so a value too small to
 * see still gets a visible sliver. The room comes out of the segments above the
 * minimum, which shrinks them and can push another under it — hence the loop.
 */
export const applyMinSegmentShare = (
  values: number[],
  minShare: number,
): number[] => {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    return values.map(() => 0);
  }

  const minVisibleShare = Math.min(minShare, 1 / values.length);
  let shares = values.map((value) => value / total);

  while (shares.some((share) => share < minVisibleShare)) {
    const visible = shares.map((share) => Math.max(share, minVisibleShare));
    const aboveMinimum = visible.filter((share) => share > minVisibleShare);
    const roomLeft =
      1 - (visible.length - aboveMinimum.length) * minVisibleShare;
    // NaN when nothing is above the minimum — no share uses it in that case.
    const shrinkFactor =
      roomLeft / aboveMinimum.reduce((sum, share) => sum + share, 0);
    shares = visible.map((share) =>
      share > minVisibleShare ? share * shrinkFactor : share,
    );
  }

  return shares;
};

/**
 * One ring segment per drawable series entry, in series order, clockwise from
 * 12 o'clock. Zero and negative segments are dropped so they don't emit
 * degenerate paths; percents are still computed against the full series total,
 * and what survives is drawn at `minSegmentArc` or wider.
 */
export const buildRingSegments = (
  series: DonutSegment[],
  geometry: DonutGeometry,
): DonutRingSegment[] => {
  const percents = getSegmentPercents(series);

  const drawable = series
    .map((segment, index) => ({ segment, percent: percents[index] }))
    .filter((entry) => entry.percent > 0);

  if (drawable.length === 0) {
    return [];
  }

  const weights = applyMinSegmentShare(
    drawable.map((entry) => entry.percent),
    getMinSegmentShare(geometry, drawable.length),
  );
  const data = drawable.map((entry, index) => ({
    ...entry,
    weight: weights[index],
  }));

  const layout = pie<(typeof data)[number]>()
    .value((entry) => entry.weight)
    .sort(null)
    .sortValues(null)
    .padAngle(geometry.padAngle);

  const arcGenerator = arc<PieArcDatum<(typeof data)[number]>>()
    .innerRadius(geometry.innerRadius)
    .outerRadius(geometry.outerRadius)
    .cornerRadius(geometry.cornerRadius);

  const hoverEnabled = drawable.length > 1;

  return layout(data).map((datum) => {
    const midAngle = (datum.startAngle + datum.endAngle) / 2;
    return {
      id: datum.data.segment.id,
      path: arcGenerator(snapHalfCircle(datum)) ?? '',
      color: resolveSegmentColor(datum.data.segment),
      percent: datum.data.percent,
      midAngle,
      hoverEnabled,
      hoverTranslate: hoverEnabled
        ? {
            x: Math.sin(midAngle) * geometry.hoverOffset,
            y: -Math.cos(midAngle) * geometry.hoverOffset,
          }
        : { x: 0, y: 0 },
    };
  });
};

/**
 * Snap a near-half-circle span to exactly `π`. d3-shape squares the corners of
 * a segment spanning a hair under `π` (its parallel edges never meet) but
 * rounds one landing exactly on `π`, so two equal halves end up mismatched.
 * The nudge is sub-pixel and never fires for real sub-half-circle segments.
 */
const HALF_CIRCLE_EPSILON = 1e-9;
const snapHalfCircle = <T>(datum: PieArcDatum<T>): PieArcDatum<T> => {
  const span = datum.endAngle - datum.startAngle;
  if (span < Math.PI && Math.PI - span < HALF_CIRCLE_EPSILON) {
    return { ...datum, endAngle: datum.startAngle + Math.PI };
  }
  return datum;
};

/**
 * Fixed placeholder segments shared by the empty ring and the loading wave: a
 * full ring (values sum to 100) of unequal segments separated only by the
 * same small `padAngle` gaps as real segments — no missing segment.
 */
export const buildPlaceholderSegments = (
  geometry: DonutGeometry,
): DonutPlaceholderSegment[] => {
  const { segmentValues } = chartConfig.donut.placeholder;

  type PlaceholderDatum = { id: string; value: number };

  const data: PlaceholderDatum[] = segmentValues.map((value, index) => ({
    id: `placeholder-${index}`,
    value,
  }));

  const layout = pie<PlaceholderDatum>()
    .value((entry) => entry.value)
    .sort(null)
    .sortValues(null)
    .padAngle(geometry.padAngle);

  const arcGenerator = arc<PieArcDatum<PlaceholderDatum>>()
    .innerRadius(geometry.innerRadius)
    .outerRadius(geometry.outerRadius)
    .cornerRadius(geometry.cornerRadius);

  return layout(data).map((datum) => {
    const midAngle = (datum.startAngle + datum.endAngle) / 2;
    return {
      id: datum.data.id,
      path: arcGenerator(snapHalfCircle(datum)) ?? '',
      midAngle,
    };
  });
};
