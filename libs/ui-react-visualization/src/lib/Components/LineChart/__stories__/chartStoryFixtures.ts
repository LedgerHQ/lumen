import type { Series } from '../../../utils/types';

/**
 * Shared fixtures for the Visualization Storybook stories.
 *
 * Every chart story renders through `<LineChart>` (never `<CartesianChart>`)
 * and, where it makes sense, reuses the same dimensions and series so the
 * examples stay visually consistent across the main component and its
 * sub-components.
 */

/** Standard chart width (px) shared by every story. */
export const CHART_WIDTH = '100%';

/** Standard chart height (px) shared by every story. */
export const CHART_HEIGHT = 250;

/**
 * Canonical single-series dataset reused across stories. Declared with
 * `satisfies` so `data` stays a concrete `number[]` (handy for index lookups
 * in tooltip/label stories) while remaining assignable to `Series[]`.
 */
export const sampleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
  },
] satisfies Series[];

/** Canonical two-series dataset for multi-line examples. */
export const multiSeries = [
  {
    id: 'lineA',
    label: 'Line A',
    stroke: '#7B61FF',
    data: [5, 15, 10, 90, 85, 70, 30, 25, 25, 40, 60, 80, 70, 95],
  },
  {
    id: 'lineB',
    label: 'Line B',
    stroke: '#44D7B6',
    data: [90, 85, 70, 25, 23, 40, 45, 40, 50, 30, 20, 10, 35, 55],
  },
] satisfies Series[];

/**
 * Dense, deterministic single-series dataset (160 points) shaped like a real
 * price series: a seeded random walk with mild mean reversion and occasional
 * larger moves. Deterministic so stories (and visual snapshots) render
 * identically every time. Useful for features that need many data points to
 * read clearly, such as the magnetic scrubber: the scrubber glides over the
 * many ordinary points but snaps onto the few magnetic ones.
 */
export const denseData = ((): number[] => {
  // mulberry32 PRNG, seeded for stable output across renders/builds.
  let state = 20260601;
  const random = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const points: number[] = [];
  let value = 50;
  for (let i = 0; i < 160; i++) {
    // Occasional larger jumps make the line feel less uniform.
    const volatility = random() < 0.1 ? 9 : 4;
    const shock = (random() - 0.5) * 2 * volatility;
    const reversion = (50 - value) * 0.02;
    value = Math.max(10, value + shock + reversion);
    points.push(Math.round(value * 100) / 100);
  }
  return points;
})();

export const denseSeries = [
  { id: 'prices', stroke: '#7B61FF', data: denseData },
] satisfies Series[];

/** Month labels aligned to the 14-point `sampleSeries`, for axis/scrubber stories. */
export const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
];
