import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { DonutChart } from '../../DonutChart';
import type { DonutSegment } from '../../DonutChart/types';
import { Legend } from '../Legend';

const cryptoItems = [
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    color: cssVar('var(--color-crypto-bitcoin)'),
  },
  {
    id: 'ethereum',
    label: 'Ethereum',
    color: cssVar('var(--color-crypto-ethereum)'),
  },
  {
    id: 'tether',
    label: 'Tether',
    color: cssVar('var(--color-crypto-tether-usdt)'),
  },
];

const cryptoSegments: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 45, color: cryptoItems[0].color },
  { id: 'ethereum', label: 'Ethereum', value: 30, color: cryptoItems[1].color },
  { id: 'tether', label: 'Tether', value: 25, color: cryptoItems[2].color },
];

const meta = {
  component: Legend,
  id: 'react-legend',
  title: 'Visualization/Legend',
  tags: ['experimental'],
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
  args: {
    items: cryptoItems,
  },
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <Story />
      </StoryDecorator>
    ),
  ],
} satisfies Meta<typeof Legend>;

export default meta;
type Story = StoryObj<typeof Legend>;

export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
};

export const DefaultColors: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    items: [
      { id: 'a', label: 'Segment A' },
      { id: 'b', label: 'Segment B' },
      { id: 'c', label: 'Segment C' },
    ],
  },
};

/**
 * The legend sits beside the ring and wraps within the width it is given, so a
 * narrow column breaks the items across several lines.
 */
export const WithDonutChart: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => (
    <div className='flex items-center gap-24'>
      <DonutChart series={cryptoSegments} />
      <Legend items={cryptoSegments} className='max-w-176' />
    </div>
  ),
};
