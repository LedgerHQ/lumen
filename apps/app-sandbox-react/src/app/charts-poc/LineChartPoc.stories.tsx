import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChartD3 } from './d3';
import {
  btcDaily,
  ethDaily,
  formatCurrency,
  formatDate,
  walletLines,
  walletMarkers,
  walletReferenceLines,
  walletValueLabels,
} from './mockData';
import { LineChartRecharts } from './recharts';
import type { LineChartProps } from './types';
import { LineChartVictory } from './victory';
import { LineChartVisx } from './visx';

const CHART_WIDTH = 700;
const CHART_HEIGHT = 360;

const baseProps: LineChartProps = {
  lines: walletLines,
  width: CHART_WIDTH,
  height: CHART_HEIGHT,
  xAxis: { show: true, showGrid: true, showLabels: true },
  yAxis: { show: true, showGrid: true, showLabels: true },
  enableScrubbing: true,
  showCursor: true,
  showCursorLabel: true,
  formatXLabel: formatDate,
  formatYLabel: formatCurrency,
};

const meta: Meta = {
  title: 'Charts POC/Line Chart',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
};

export default meta;
type Story = StoryObj;

export const Base: Story = {
  render: () => (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
      <LineChartRecharts {...baseProps} />
    </div>
  ),
};

export const LibraryShowcase: Story = {
  render: () => {
    const libs = [
      { label: 'Recharts v3', Component: LineChartRecharts },
      { label: 'Victory v37', Component: LineChartVictory },
      { label: 'visx v3', Component: LineChartVisx },
      { label: 'D3.js v7', Component: LineChartD3 },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
        }}
      >
        {libs.map(({ label, Component }) => (
          <div
            key={label}
            style={{
              background: '#1a1a2e',
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div
              style={{
                color: '#94a3b8',
                fontSize: 13,
                marginBottom: 12,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
            <Component
              {...baseProps}
              width={480}
              height={280}
              enableScrubbing={false}
              showCursor={false}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const WithGradient: Story = {
  render: () => (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
      <LineChartRecharts
        {...baseProps}
        lines={walletLines.map((l) => ({ ...l, showGradient: true }))}
      />
    </div>
  ),
};

export const WithMultipleSeries: Story = {
  render: () => {
    const btcBase = btcDaily[0]?.value ?? 1;
    const ethBase = ethDaily[0]?.value ?? 1;
    const ethNormalized = btcDaily.map((pt, i) => ({
      timestamp: pt.timestamp,
      value:
        ethDaily[i]?.value != null
          ? Math.round(((ethDaily[i].value! / ethBase) * btcBase * 0.94) * 100) /
            100
          : null,
    }));

    return (
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
        <LineChartRecharts
          {...baseProps}
          lines={[
            ...walletLines,
            {
              id: 'eth',
              label: 'Ethereum',
              data: ethNormalized,
              color: 'var(--color-crypto-ethereum)',
              width: 2,
              showGradient: false,
            },
          ]}
        />
      </div>
    );
  },
};

export const WithReferenceLines: Story = {
  render: () => (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
      <LineChartRecharts
        {...baseProps}
        referenceLines={walletReferenceLines}
        valueLabels={walletValueLabels}
      />
    </div>
  ),
};

export const WithMarkers: Story = {
  render: () => (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
      <LineChartRecharts {...baseProps} markers={walletMarkers} />
    </div>
  ),
};

export const WithAllOverlays: Story = {
  render: () => (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
      <LineChartRecharts
        {...baseProps}
        lines={walletLines.map((l) => ({ ...l, showGradient: true }))}
        referenceLines={walletReferenceLines}
        valueLabels={walletValueLabels}
        markers={walletMarkers}
      />
    </div>
  ),
};
