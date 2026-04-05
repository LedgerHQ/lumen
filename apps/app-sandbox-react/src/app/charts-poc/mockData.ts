import type {
  DataPoint,
  LineConfig,
  LineChartProps,
  ReferenceLineConfig,
  ValueLabelConfig,
  MarkerConfig,
} from './types';

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

function seededRandom(seed: number): () => number {
  let s = seed;
  return (): number => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generatePriceSeries(
  basePrice: number,
  volatility: number,
  days: number,
  intervalMs: number,
  seed: number,
): DataPoint[] {
  const rand = seededRandom(seed);
  const points: DataPoint[] = [];
  const now = Date.now();
  const start = now - days * DAY_MS;
  const steps = Math.floor((days * DAY_MS) / intervalMs);
  let price = basePrice;

  for (let i = 0; i <= steps; i++) {
    const timestamp = start + i * intervalMs;
    const drift = 0.0001;
    const shock = volatility * (rand() - 0.5) * 2;
    price = price * (1 + drift + shock);
    price = Math.max(price * 0.1, price);
    points.push({ timestamp, value: Math.round(price * 100) / 100 });
  }

  return points;
}

export const btcDaily: DataPoint[] = generatePriceSeries(
  62_000,
  0.025,
  90,
  DAY_MS,
  42,
);

export const ethDaily: DataPoint[] = generatePriceSeries(
  3_200,
  0.03,
  90,
  DAY_MS,
  137,
);

export const btcHourly: DataPoint[] = generatePriceSeries(
  62_000,
  0.005,
  30,
  HOUR_MS,
  42,
);

export const ethHourly: DataPoint[] = generatePriceSeries(
  3_200,
  0.007,
  30,
  HOUR_MS,
  137,
);

export const portfolioDaily: DataPoint[] = btcDaily.map((pt, i) => ({
  timestamp: pt.timestamp,
  value:
    Math.round((pt.value * 1.5 + (ethDaily[i]?.value ?? 0) * 10) * 100) / 100,
}));

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const singleLineBtc: LineConfig[] = [
  {
    id: 'btc',
    data: btcDaily,
    color: 'var(--color-crypto-bitcoin)',
    width: 2,
    showGradient: true,
  },
];

export const multiLine: LineConfig[] = [
  {
    id: 'btc',
    data: btcDaily,
    color: 'var(--color-crypto-bitcoin)',
    width: 2,
    showGradient: false,
  },
  {
    id: 'eth',
    data: ethDaily,
    color: 'var(--color-crypto-ethereum)',
    width: 2,
    showGradient: false,
  },
];

export const highDensityBtc: LineConfig[] = [
  {
    id: 'btc-hourly',
    data: btcHourly,
    color: 'var(--color-crypto-bitcoin)',
    width: 1.5,
    showGradient: true,
  },
];

function findMinMax(data: DataPoint[]): { min: DataPoint; max: DataPoint } {
  let min = data[0];
  let max = data[0];
  for (const pt of data) {
    if (pt.value < min.value) min = pt;
    if (pt.value > max.value) max = pt;
  }
  return { min, max };
}

const walletBtcData = btcDaily;
const { min: btcMin } = findMinMax(walletBtcData);
const btcThreshold = Math.round(btcMin.value / 1000) * 1000;

export const walletLines: LineConfig[] = [
  {
    id: 'btc',
    data: walletBtcData,
    color: '#E87A2C',
    width: 2.5,
    showGradient: false,
  },
];

const allValues = walletBtcData.map((pt) => pt.value);
const dataMin = Math.min(...allValues);
const dataMax = Math.max(...allValues);
const dataRange = dataMax - dataMin;

export const walletReferenceLines: ReferenceLineConfig[] = [
  {
    value: btcThreshold,
    label: formatCurrency(btcThreshold),
    labelPosition: 'center',
    style: 'dotted',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  {
    value: dataMin + dataRange * 0.5,
    label: formatCurrency(dataMin + dataRange * 0.5),
    labelPosition: 'right',
    style: 'solid',
    color: 'rgba(74, 222, 128, 0.4)',
  },
  {
    value: dataMax - dataRange * 0.1,
    label: formatCurrency(dataMax - dataRange * 0.1),
    labelPosition: 'left',
    style: 'dashed',
    color: 'rgba(244, 114, 182, 0.4)',
  },
];

export const walletValueLabels: ValueLabelConfig[] = [
  { type: 'max', position: 'right' },
  { type: 'min', position: 'left' },
];

const MARKER_LABELS: { label: string; variant: 'filled' | 'outlined' }[] = [
  { label: 'Buy', variant: 'filled' },
  { label: 'Sell', variant: 'outlined' },
  { label: 'Buy', variant: 'filled' },
  { label: 'Swap', variant: 'outlined' },
  { label: 'Sell', variant: 'outlined' },
  { label: 'Buy', variant: 'filled' },
  { label: 'Stake', variant: 'filled' },
  { label: 'Sell', variant: 'outlined' },
  { label: 'Buy', variant: 'filled' },
  { label: 'Swap', variant: 'outlined' },
];

export const walletMarkers: MarkerConfig[] = MARKER_LABELS.map(
  ({ label, variant }, i) => {
    const idx = Math.round(((i + 1) / 11) * (walletBtcData.length - 1));
    const pt = walletBtcData[idx];
    return {
      timestamp: pt.timestamp,
      value: pt.value,
      color: '#E87A2C',
      radius: variant === 'filled' ? 4 : 5,
      variant,
      label,
    };
  },
);

export const walletVariant: Pick<
  LineChartProps,
  | 'lines'
  | 'referenceLines'
  | 'valueLabels'
  | 'markers'
  | 'showGrid'
  | 'showXAxis'
  | 'showYAxis'
  | 'showTooltip'
  | 'showCursor'
  | 'formatXLabel'
  | 'formatYLabel'
> = {
  lines: walletLines,
  referenceLines: walletReferenceLines,
  valueLabels: walletValueLabels,
  markers: walletMarkers,
  showGrid: false,
  showXAxis: false,
  showYAxis: false,
  showTooltip: false,
  showCursor: false,
  formatXLabel: formatDate,
  formatYLabel: formatCurrency,
};
