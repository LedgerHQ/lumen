import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { LineChartD3RNative } from './LineChart-D3-RNative';
import type { DataPoint, LineChartProps, LineConfig } from './types';

const DAY_MS = 86_400_000;

function seededRandom(seed: number): () => number {
  let s = seed;
  return (): number => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const generatePriceSeries = (
  basePrice: number,
  volatility: number,
  days: number,
  seed: number,
): DataPoint[] => {
  const rand = seededRandom(seed);
  const points: DataPoint[] = [];
  const now = Date.now();
  const start = now - days * DAY_MS;
  const steps = days;
  let price = basePrice;

  for (let i = 0; i <= steps; i++) {
    const drift = 0.0001;
    const shock = volatility * (rand() - 0.5) * 2;
    price = price * (1 + drift + shock);
    points.push({
      timestamp: start + i * DAY_MS,
      value: Math.round(price * 100) / 100,
    });
  }
  return points;
};

const btcData = generatePriceSeries(62_000, 0.025, 90, 42);
const ethData = generatePriceSeries(3_200, 0.03, 90, 137);

const btcLine: LineConfig = {
  id: 'btc',
  label: 'Bitcoin',
  data: btcData,
  color: '#E87A2C',
  width: 2.5,
  showGradient: false,
};

const ethLine: LineConfig = {
  id: 'eth',
  label: 'Ethereum',
  data: ethData,
  color: '#627EEA',
  width: 2,
  showGradient: false,
};

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const CHART_WIDTH = 380;
const CHART_HEIGHT = 280;

const baseProps: LineChartProps = {
  lines: [btcLine],
  width: CHART_WIDTH,
  height: CHART_HEIGHT,
  xAxis: { show: true, showGrid: true },
  yAxis: { show: true, showGrid: true },
  enableScrubbing: false,
  showCursor: false,
  formatXLabel: formatDate,
  formatYLabel: formatCurrency,
};

const meta: Meta = {
  title: 'Charts POC RN/Line Chart',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
};

export default meta;
type Story = StoryObj;

const ChartWrapper = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: '#1a1a2e',
      borderRadius: 12,
      padding: 24,
    }}
  >
    {children}
  </View>
);

export const Base: Story = {
  render: () => (
    <ChartWrapper>
      <LineChartD3RNative {...baseProps} />
    </ChartWrapper>
  ),
};

export const WithGradient: Story = {
  render: () => (
    <ChartWrapper>
      <LineChartD3RNative
        {...baseProps}
        lines={[{ ...btcLine, showGradient: true }]}
      />
    </ChartWrapper>
  ),
};

export const WithMultipleSeries: Story = {
  render: () => (
    <ChartWrapper>
      <LineChartD3RNative {...baseProps} lines={[btcLine, ethLine]} />
    </ChartWrapper>
  ),
};

export const WithReferenceLines: Story = {
  render: () => {
    const values = btcData
      .map((p) => p.value)
      .filter((v): v is number => v != null);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    return (
      <ChartWrapper>
        <LineChartD3RNative
          {...baseProps}
          referenceLines={[
            {
              value: min + range * 0.5,
              label: formatCurrency(min + range * 0.5),
              style: 'dashed',
              labelPosition: 'right',
            },
            {
              value: max - range * 0.1,
              label: formatCurrency(max - range * 0.1),
              style: 'dotted',
              labelPosition: 'left',
            },
          ]}
          valueLabels={[
            { type: 'max', position: 'right' },
            { type: 'min', position: 'left' },
          ]}
        />
      </ChartWrapper>
    );
  },
};

export const WithMarkers: Story = {
  render: () => {
    const markerIndices = [10, 25, 40, 55, 70];
    const markers = markerIndices.map((idx, i) => {
      const pt = btcData[idx];
      return {
        timestamp: pt.timestamp,
        value: pt.value ?? 0,
        color: '#E87A2C',
        radius: 4,
        variant: (i % 2 === 0 ? 'filled' : 'outlined') as
          | 'filled'
          | 'outlined',
        label: i % 2 === 0 ? 'Buy' : 'Sell',
      };
    });

    return (
      <ChartWrapper>
        <LineChartD3RNative {...baseProps} markers={markers} />
      </ChartWrapper>
    );
  },
};

export const WithAllOverlays: Story = {
  render: () => {
    const values = btcData
      .map((p) => p.value)
      .filter((v): v is number => v != null);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    const markerIndices = [10, 30, 50, 70];
    const markers = markerIndices.map((idx, i) => {
      const pt = btcData[idx];
      return {
        timestamp: pt.timestamp,
        value: pt.value ?? 0,
        color: '#E87A2C',
        radius: 4,
        variant: (i % 2 === 0 ? 'filled' : 'outlined') as
          | 'filled'
          | 'outlined',
        label: i % 2 === 0 ? 'Buy' : 'Sell',
      };
    });

    return (
      <ChartWrapper>
        <LineChartD3RNative
          {...baseProps}
          lines={[{ ...btcLine, showGradient: true }]}
          referenceLines={[
            {
              value: min + range * 0.5,
              label: formatCurrency(min + range * 0.5),
              style: 'dashed',
              labelPosition: 'right',
            },
          ]}
          valueLabels={[
            { type: 'max', position: 'right' },
            { type: 'min', position: 'left' },
          ]}
          markers={markers}
        />
      </ChartWrapper>
    );
  },
};
