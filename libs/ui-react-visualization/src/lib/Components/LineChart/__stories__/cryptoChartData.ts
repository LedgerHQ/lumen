import { cssVar } from '@ledgerhq/lumen-design-core';
import type { FormattedValue } from '@ledgerhq/lumen-ui-react';
import {
  ArrowDown,
  ArrowUp,
  Minus,
  Plus,
} from '@ledgerhq/lumen-ui-react/symbols';

import type {
  ChartTooltipItemData,
  ScrubberTooltipContent,
} from '../../Scrubber';

/**
 * Deterministic fixtures and helpers backing the interactive LineChart story.
 *
 * This lives outside the story's render on purpose: composing the chart with
 * design-system components is what the story demonstrates, while generating
 * realistic market data is an app concern that consumers own themselves.
 */

export type Period = '24H' | '1W' | '1M' | '6M' | '1Y' | '5Y' | 'All';

export type TransactionType = 'buy' | 'sell';

export type Transaction = {
  type: TransactionType;
  value: number;
};

/**
 * A single trade in the canonical ledger. Unlike a displayed {@link Transaction},
 * a trade has a fixed timestamp and an intrinsic amount that never changes, so
 * every timeframe renders a consistent filtered view of the same history.
 */
type Trade = {
  timestamp: number;
  type: TransactionType;
  amount: number;
};

export type ChartMarker = {
  index: number;
  /**
   * A single entry is a standalone transaction; multiple entries are a cluster
   * of transactions that sit too close together to display individually.
   */
  transactions: Transaction[];
};

export type ChartModel = {
  data: number[];
  markers: ChartMarker[];
  markerByIndex: Map<number, ChartMarker>;
  average: number;
  isPositive: boolean;
  highIndex: number;
  lowIndex: number;
  yDomain: { min: number; max: number };
  xTicks: number[];
  yTicks: number[];
};

type PeriodConfig = {
  points: number;
  label: string;
  spanDays: number;
  seed: number;
  dateFormat: Intl.DateTimeFormatOptions;
};

export const PERIODS: Record<Period, PeriodConfig> = {
  '24H': {
    points: 288,
    label: 'Today',
    spanDays: 1,
    seed: 11,
    dateFormat: { hour: 'numeric' },
  },
  '1W': {
    points: 168,
    label: 'Last week',
    spanDays: 7,
    seed: 27,
    dateFormat: { weekday: 'short' },
  },
  '1M': {
    points: 200,
    label: 'Last month',
    spanDays: 30,
    seed: 43,
    dateFormat: { month: 'short', day: 'numeric' },
  },
  '6M': {
    points: 240,
    label: 'Last 6 months',
    spanDays: 182,
    seed: 61,
    dateFormat: { month: 'short' },
  },
  '1Y': {
    points: 365,
    label: 'Last year',
    spanDays: 365,
    seed: 89,
    dateFormat: { month: 'short' },
  },
  '5Y': {
    points: 300,
    label: 'Last 5 years',
    spanDays: 1826,
    seed: 113,
    dateFormat: { year: 'numeric' },
  },
  All: {
    points: 320,
    label: 'All time',
    spanDays: 2922,
    seed: 151,
    dateFormat: { year: 'numeric' },
  },
};

export const ACTIONS = [
  { label: 'Receive', appearance: 'base', icon: ArrowDown },
  { label: 'Buy', appearance: 'gray', icon: Plus },
  { label: 'Sell', appearance: 'gray', icon: Minus },
  { label: 'Send', appearance: 'gray', icon: ArrowUp },
] as const;

const BASE_VALUE = 42156.78;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Fixed "now" so generated dates (and axis labels) stay deterministic. */
const REFERENCE_DATE = new Date('2026-06-01T00:00:00');

/** Deterministic PRNG (mulberry32) so the story renders identically each time. */
const createRng = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const generateDenseData = (period: Period): number[] => {
  const { points, seed } = PERIODS[period];
  const rng = createRng(seed);
  const volatility = BASE_VALUE * 0.012;
  const floor = BASE_VALUE * 0.35;
  const data: number[] = [];

  let value = BASE_VALUE * (0.7 + rng() * 0.25);
  for (let i = 0; i < points; i++) {
    const drift = (rng() - 0.47) * volatility;
    value = Math.max(value + drift, floor);
    data.push(Math.round(value * 100) / 100);
  }
  return data;
};

const LEDGER_SEED = 20260601;
const LEDGER_SIZE = 120;
const RECENCY_BIAS = 2.2;

/**
 * One canonical, deterministic list of trades spanning the widest timeframe.
 * Every period renders a filtered view of this ledger, so a trade keeps the
 * same amount across timeframes and cluster totals stay consistent.
 */
const LEDGER: Trade[] = (() => {
  const rng = createRng(LEDGER_SEED);
  const maxSpanMs = PERIODS.All.spanDays * DAY_MS;
  return Array.from({ length: LEDGER_SIZE }, () => {
    const timestamp =
      REFERENCE_DATE.getTime() - Math.pow(rng(), RECENCY_BIAS) * maxSpanMs;
    const type: TransactionType = rng() < 0.55 ? 'buy' : 'sell';
    const amount = Math.round((250 + rng() * 4750) * 100) / 100;
    return { timestamp, type, amount };
  }).sort((a, b) => a.timestamp - b.timestamp);
})();

/** Inverse of {@link indexToDate}: maps a timestamp onto a period's data index. */
const dateToIndex = (
  timestamp: number,
  period: Period,
  dataLength: number,
): number => {
  const spanMs = PERIODS[period].spanDays * DAY_MS;
  const fraction = 1 - (REFERENCE_DATE.getTime() - timestamp) / spanMs;
  return Math.round(fraction * (dataLength - 1));
};

/**
 * Builds the markers for a period by filtering the canonical ledger to the
 * visible window, mapping each trade onto the series, and merging trades whose
 * markers would overlap into a single cluster.
 */
const buildMarkers = (data: number[], period: Period): ChartMarker[] => {
  const windowStart =
    REFERENCE_DATE.getTime() - PERIODS[period].spanDays * DAY_MS;
  const lastIndex = data.length - 1;
  // Trades closer than this many indices collapse into one cluster.
  const clusterWindow = Math.max(2, Math.round(data.length * 0.03));

  const buckets = new Map<
    number,
    { indices: number[]; transactions: Transaction[] }
  >();

  for (const trade of LEDGER) {
    if (trade.timestamp < windowStart) continue;
    const index = Math.min(
      lastIndex - 1,
      Math.max(1, dateToIndex(trade.timestamp, period, data.length)),
    );
    const bucket = Math.floor(index / clusterWindow);
    const group = buckets.get(bucket) ?? { indices: [], transactions: [] };
    group.indices.push(index);
    group.transactions.push({ type: trade.type, value: trade.amount });
    buckets.set(bucket, group);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, group]) => ({
      index: Math.round(
        group.indices.reduce((sum, i) => sum + i, 0) / group.indices.length,
      ),
      transactions: group.transactions,
    }));
};

/** Maps a data index to its date based on the period's time span. */
const indexToDate = (
  index: number,
  period: Period,
  dataLength: number,
): Date => {
  const fraction = dataLength <= 1 ? 1 : index / (dataLength - 1);
  const spanMs = PERIODS[period].spanDays * 24 * 60 * 60 * 1000;
  return new Date(REFERENCE_DATE.getTime() - (1 - fraction) * spanMs);
};

const sumByType = (
  transactions: Transaction[],
  type: TransactionType,
): number =>
  transactions
    .filter((tx) => tx.type === type)
    .reduce((sum, tx) => sum + tx.value, 0);

export const usdFormatter = (value: number): FormattedValue => {
  const [integerPart, decimalPart] = value.toFixed(2).split('.');
  return {
    integerPart,
    decimalPart,
    currencyText: '$',
    decimalSeparator: '.',
    currencyPosition: 'start',
  };
};

export const formatUsd = (value: number): string =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const getMarkerColor = (marker: ChartMarker): string => {
  if (marker.transactions.length > 1) {
    return cssVar('var(--background-muted-strong)');
  }
  return cssVar(
    marker.transactions[0].type === 'buy'
      ? 'var(--background-success-strong)'
      : 'var(--background-error-strong)',
  );
};

export const getMarkerTooltip = (
  marker: ChartMarker,
): ScrubberTooltipContent => {
  if (marker.transactions.length === 1) {
    const [tx] = marker.transactions;
    return {
      items: [
        {
          label: tx.type === 'buy' ? 'Received' : 'Sent',
          value: formatUsd(tx.value),
        },
      ],
    };
  }

  const bought = sumByType(marker.transactions, 'buy');
  const received = sumByType(marker.transactions, 'sell');
  const items: ChartTooltipItemData[] = [];
  if (bought > 0) items.push({ label: 'Received', value: formatUsd(bought) });
  if (received > 0) {
    items.push({ label: 'Received', value: formatUsd(received) });
  }

  return {
    title: `${marker.transactions.length} transactions`,
    items,
  };
};

/** Builds the full deterministic dataset (series, markers, ticks) for a period. */
export const buildChartModel = (period: Period): ChartModel => {
  const data = generateDenseData(period);
  const markers = buildMarkers(data, period);
  const lastIndex = data.length - 1;

  let min = data[0];
  let max = data[0];
  let lowIndex = 0;
  let highIndex = 0;
  data.forEach((value, index) => {
    if (value > max) {
      max = value;
      highIndex = index;
    }
    if (value < min) {
      min = value;
      lowIndex = index;
    }
  });

  const markerByIndex = new Map<number, ChartMarker>();
  for (const marker of markers) markerByIndex.set(marker.index, marker);

  return {
    data,
    markers,
    markerByIndex,
    average: data.reduce((sum, value) => sum + value, 0) / data.length,
    isPositive: data[lastIndex] >= data[0],
    highIndex,
    lowIndex,
    yDomain: { min: min - 100, max: max + 100 },
    xTicks: Array.from({ length: 5 }, (_, i) =>
      Math.round((i / 4) * lastIndex),
    ),
    yTicks: [0.25, 0.5, 0.75].map((fraction) => min + fraction * (max - min)),
  };
};

/** Builds an x-axis tick formatter that renders dates for the given period. */
export const createAxisDateFormatter = (
  period: Period,
  dataLength: number,
): ((value: number | string) => string) => {
  const format = new Intl.DateTimeFormat('en-US', PERIODS[period].dateFormat);
  return (value) =>
    format.format(
      indexToDate(
        typeof value === 'number' ? value : Number(value),
        period,
        dataLength,
      ),
    );
};
