import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { DonutChart } from '../DonutChart';
import type { DonutSegment } from '../types';

const cryptoSegments: DonutSegment[] = [
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    value: 45,
    color: cssVar('var(--color-crypto-bitcoin)'),
  },
  {
    id: 'ethereum',
    label: 'Ethereum',
    value: 30,
    color: cssVar('var(--color-crypto-ethereum)'),
  },
  {
    id: 'tether',
    label: 'Tether',
    value: 25,
    color: cssVar('var(--color-crypto-tether-usdt)'),
  },
];

const meta = {
  component: DonutChart,
  id: 'react-donutchart',
  title: 'Visualization/DonutChart',
  tags: ['experimental'],
  args: {
    series: cryptoSegments,
    size: 'md',
  },
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <Story />
      </StoryDecorator>
    ),
  ],
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof DonutChart>;

/**
 * The simplest chart: a `series` of `DonutSegment`s rendered as a ring. Each
 * segment's angle is its share of the summed `value`; `color` overrides the
 * neutral default.
 */
export const Base: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-center gap-32'>
      <div className='flex flex-col items-center gap-8'>
        <DonutChart {...args} size='md' />
        <span className='body-3 text-muted'>md — 168px</span>
      </div>
      <div className='flex flex-col items-center gap-8'>
        <DonutChart {...args} size='sm' />
        <span className='body-3 text-muted'>sm — 80px</span>
      </div>
    </div>
  ),
};

/**
 * Without a `color` override, segments fall back to the neutral default grey.
 */
export const DefaultColors: Story = {
  args: {
    series: [
      { id: 'a', label: 'A', value: 45 },
      { id: 'b', label: 'B', value: 30 },
      { id: 'c', label: 'C', value: 25 },
    ],
  },
};

const segmentPalette = [
  cssVar('var(--color-crypto-bitcoin)'),
  cssVar('var(--color-crypto-ethereum)'),
  cssVar('var(--color-crypto-tether-usdt)'),
  cssVar('var(--color-crypto-binance)'),
  cssVar('var(--color-crypto-sol)'),
  cssVar('var(--color-crypto-tron)'),
  cssVar('var(--color-crypto-usdc)'),
];

const buildSegments = (count: number): DonutSegment[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `segment-${index + 1}`,
    label: `Segment ${index + 1}`,
    value: 1,
    color: segmentPalette[index % segmentPalette.length],
  }));

/**
 * The ring adapts to any number of segments, rendered in series order,
 * clockwise from 12 o'clock, with rounded caps and gaps between slices.
 */
export const SegmentCounts: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-32'>
      {[1, 2, 3, 4, 5, 6, 7].map((count) => (
        <div key={count} className='flex flex-col items-center gap-8'>
          <DonutChart series={buildSegments(count)} />
          <span className='body-3 text-muted'>{count} segments</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * With no data (empty or all-zero series), the ring renders the faint empty
 * ring.
 */
export const NoData: Story = {
  args: {
    series: [],
  },
};
