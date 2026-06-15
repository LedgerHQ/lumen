import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Series } from '../../../utils/types';

/**
 * Shared fixtures for the Visualization Storybook stories.
 *
 * Every chart story renders through `<LineChart>` (never `<CartesianChart>`)
 * and, where it makes sense, reuses the same dimensions and series so the
 * examples stay visually consistent across the main component and its
 * sub-components.
 */

/** Standard chart width (CSS length) shared by every story. */
export const CHART_WIDTH = '100%';

/** Standard chart height (px) shared by every story. */
export const CHART_HEIGHT = 250;

export const STORIES_STROKE_COLOR = cssVar('var(--background-success-strong)');
/**
 * Canonical single-series dataset reused across stories. Declared with
 * `satisfies` so `data` stays a concrete `number[]` (handy for index lookups
 * in tooltip/label stories) while remaining assignable to `Series[]`.
 */
export const sampleSeries = [
  {
    id: 'prices',
    stroke: STORIES_STROKE_COLOR,
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
  },
] satisfies Series[];

/**
 * Multi-line dataset for the "customizing a line" example: every series carries
 * its own Lumen `stroke` color and a different `curve`, demonstrating that each
 * line can be styled independently. More per-line options will land here over
 * time (dashes, gradients, custom areas, …).
 */
export const curveSeries = [
  {
    id: 'top',
    label: 'Linear',
    stroke: cssVar('var(--background-success-strong)'),
    curve: 'linear',
    data: [15, 28, 32, 44, 46, 36, 40, 45, 48, 38],
  },
  {
    id: 'upperMiddle',
    label: 'Bump',
    stroke: cssVar('var(--background-error-strong)'),
    curve: 'bump',
    data: [12, 23, 21, 29, 34, 28, 31, 38, 42, 35],
  },
  {
    id: 'lowerMiddle',
    label: 'Natural',
    stroke: cssVar('var(--background-warning-strong)'),
    curve: 'natural',
    data: [8, 15, 14, 25, 20, 18, 22, 28, 24, 30],
  },
  {
    id: 'bottom',
    label: 'Step',
    stroke: cssVar('var(--background-accent)'),
    curve: 'step',
    data: [4, 8, 11, 15, 16, 14, 16, 10, 12, 14],
  },
] satisfies Series[];

/** Canonical two-series dataset for multi-line examples. */
export const multiSeries = [
  {
    id: 'lineA',
    label: 'Line A',
    curve: 'step',
    stroke: STORIES_STROKE_COLOR,
    data: [5, 15, 10, 90, 85, 70, 30, 25, 25, 40, 60, 80, 70, 95],
  },
  {
    id: 'lineB',
    label: 'Line B',
    curve: 'step',
    stroke: cssVar('var(--background-error-strong)'),
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
  { id: 'prices', stroke: STORIES_STROKE_COLOR, data: denseData },
] satisfies Series[];

/**
 * Two-series dataset with a shared `null` index, for the missing-data /
 * `connectNulls` story: `pageViews` opts into `connectNulls` (bridges the gap)
 * while `uniqueVisitors` keeps the default (breaks at the null). Declared with
 * `satisfies` so `data` stays `(number | null)[]` for tooltip index lookups.
 */
export const missingDataPages = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export const missingDataSeries = [
  {
    id: 'pageViews',
    label: 'Page Views',
    stroke: cssVar('var(--background-success-strong)'),
    data: [2400, 1398, null, 3908, 4800, 3800, 4300],
    connectNulls: true,
  },
  {
    id: 'uniqueVisitors',
    label: 'Unique Visitors',
    stroke: cssVar('var(--background-accent)'),
    data: [4000, 3000, null, 2780, 1890, 2390, 3490],
  },
] satisfies Series[];

/** Formats a (possibly null) scrubber value, rendering an em-dash for gaps. */
const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

export const formatScrubberValue = (value: number | null): string =>
  value === null ? '—' : integerFormatter.format(value);

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
