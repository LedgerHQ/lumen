export type LibKey = 'recharts' | 'victory' | 'visx';
export type DatasetKey = 'single' | 'multi' | 'dense';
export type VariantKey = 'full' | 'wallet';

export const LIB_LABELS: Record<LibKey, string> = {
  recharts: 'Recharts v3',
  victory: 'Victory v37',
  visx: 'visx v3',
};

export const DATASET_LABELS: Record<DatasetKey, string> = {
  single: 'BTC 90d (gradient)',
  multi: 'BTC + ETH 90d',
  dense: 'BTC 30d hourly (~720pts)',
};

export const VARIANT_LABELS: Record<VariantKey, string> = {
  full: 'Full',
  wallet: 'Wallet 4.0',
};

export const CHART_WIDTH = 800;
export const CHART_HEIGHT = 400;
