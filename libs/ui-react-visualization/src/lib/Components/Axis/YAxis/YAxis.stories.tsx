import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { LineChart } from '../../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  sampleSeries,
} from '../../LineChart/__stories__/chartStoryFixtures';

import type { YAxisProps } from './types';
import { YAxis } from './YAxis';

/**
 * `YAxis` is configured through `LineChart`'s `yAxis` prop together with
 * `showYAxis` — it is not used as a standalone component. These stories drive
 * the `yAxis` config so each control maps directly to a `YAxisProps` field,
 * with a focus on the domain & scale mental model.
 */
const meta = {
  component: YAxis,
  title: 'Visualization/YAxis',
  tags: ['experimental'],
  args: {
    showLine: true,
  },
  render: (args: YAxisProps) => (
    <LineChart
      series={sampleSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      showYAxis
      yAxis={args}
    />
  ),
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <Story />
      </StoryDecorator>
    ),
  ],
} satisfies Meta<typeof YAxis>;

export default meta;
type Story = StoryObj<typeof YAxis>;

/** Base y-axis with labels and a baseline. */
export const Base: Story = {
  args: {
    showLine: true,
  },
};

/** `showLine` renders the axis baseline. */
export const ShowLine: Story = {
  args: {
    showLine: true,
  },
};

/** `showGrid` draws a horizontal grid line at each tick. */
export const ShowGrid: Story = {
  args: {
    showGrid: true,
  },
};

/** `tickLabelFormatter` maps each tick value to its display string. */
export const TickLabelFormatter: Story = {
  args: {
    tickLabelFormatter: (value) => `$${value}`,
  },
};

/**
 * `showLabels={false}` hides the tick text while keeping grid lines. Pair it
 * with `width: 0` to also reclaim the horizontal space the labels would use.
 */
export const HideLabels: Story = {
  args: {
    showGrid: true,
    showLabels: false,
    width: 0,
  },
};

/**
 * A fixed `domain` of `{ min, max }` pins the value range mapped onto the axis,
 * independent of the data's own extent.
 */
export const CustomDomain: Story = {
  args: {
    showGrid: true,
    domain: { min: -50, max: 150 },
  },
};

/**
 * Pass a function to `domain` to adjust the auto-computed bounds — here we add
 * headroom above and below the data.
 */
export const DomainFunction: Story = {
  args: {
    showGrid: true,
    domain: (bounds) => ({
      min: bounds.min * 0.8,
      max: bounds.max * 1.2,
    }),
  },
};

/**
 * `nice` rounds the domain outward to clean boundaries. Disable it to let the
 * data fill the plot area boundary-to-boundary.
 */
export const Nice: Story = {
  args: {
    showGrid: true,
    nice: false,
    domain: { min: 4, max: 98 },
  },
};

/** `position` moves the axis to the end (right) side of the drawing area. */
export const Position: Story = {
  args: {
    position: 'end',
    showGrid: true,
  },
};

/** `width` reserves horizontal space for the axis and its labels. */
export const Width: Story = {
  args: {
    width: 64,
    showLine: true,
    tickLabelFormatter: (value) => `$${value}`,
  },
};

/**
 * `scaleType='log'` maps values logarithmically. The domain must stay strictly
 * positive.
 */
export const LogScale: Story = {
  args: {
    scaleType: 'log',
    showGrid: true,
    nice: false,
    domain: { min: 1, max: 100 },
    ticks: [1, 10, 100],
  },
};
