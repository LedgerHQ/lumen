import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartD3 } from './d3';
import { barChartData, barChartSeries, formatCurrency } from './mockData';
import { BarChartRecharts } from './recharts';
import type { BarChartProps } from './types';
import { BarChartVictory } from './victory';
import { BarChartVisx } from './visx';

const CHART_WIDTH = 700;
const CHART_HEIGHT = 360;

const baseProps: BarChartProps = {
  data: barChartData,
  series: barChartSeries,
  width: CHART_WIDTH,
  height: CHART_HEIGHT,
  layout: 'grouped',
  formatYLabel: formatCurrency,
  showGrid: true,
  showTooltip: true,
  showXLabels: true,
  showYLabels: true,
};

const meta: Meta = {
  title: 'Charts POC/Bar Chart',
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
      <BarChartRecharts {...baseProps} />
    </div>
  ),
};

export const LibraryShowcase: Story = {
  render: () => {
    const libs = [
      { label: 'Recharts v3', Component: BarChartRecharts },
      { label: 'Victory v37', Component: BarChartVictory },
      { label: 'visx v3', Component: BarChartVisx },
      { label: 'D3.js v7', Component: BarChartD3 },
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
              showTooltip={false}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const LayoutShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
        <div
          style={{
            color: '#94a3b8',
            fontSize: 13,
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          Grouped
        </div>
        <BarChartRecharts
          {...baseProps}
          width={480}
          height={280}
          layout='grouped'
        />
      </div>
      <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
        <div
          style={{
            color: '#94a3b8',
            fontSize: 13,
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          Stacked
        </div>
        <BarChartRecharts
          {...baseProps}
          width={480}
          height={280}
          layout='stacked'
        />
      </div>
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
      <BarChartRecharts {...baseProps} layout='stacked' />
    </div>
  ),
};

export const WithoutGrid: Story = {
  render: () => (
    <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 24 }}>
      <BarChartRecharts {...baseProps} showGrid={false} />
    </div>
  ),
};
