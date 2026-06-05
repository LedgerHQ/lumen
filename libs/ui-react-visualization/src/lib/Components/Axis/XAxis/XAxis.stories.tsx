import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { LineChart } from '../../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  monthLabels,
  sampleSeries,
} from '../../LineChart/__stories__/chartStoryFixtures';

import type { XAxisProps } from './types';
import { XAxis } from './XAxis';

/**
 * `XAxis` is configured through `LineChart`'s `xAxis` prop together with
 * `showXAxis` — it is not used as a standalone component. These stories drive
 * the `xAxis` config so each control maps directly to an `XAxisProps` field.
 */
const meta = {
  component: XAxis,
  title: 'Visualization/XAxis',
  tags: ['experimental'],
  args: {
    showLine: true,
  },
  render: (args: XAxisProps) => (
    <LineChart
      series={sampleSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      showXAxis
      xAxis={args}
    />
  ),
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <Story />
      </StoryDecorator>
    ),
  ],
} satisfies Meta<typeof XAxis>;

export default meta;
type Story = StoryObj<typeof XAxis>;

/** Numeric, index-based axis with no decorations beyond labels. */
export const Base: Story = {
  args: {
    showLine: true,
  },
};

/**
 * `showGrid` draws a grid line at each tick. `gridLineStyle` switches between
 * `'dashed'` and `'solid'`.
 */
export const ShowGrid: Story = {
  args: {
    showGrid: true,
    gridLineStyle: 'dashed',
  },
};

/** `showTickMark` draws a small tick at each label. */
export const ShowTickMark: Story = {
  args: {
    showTickMark: true,
  },
};

/**
 * Provide `data` (string labels) to display categories at each index instead
 * of the raw numeric index.
 */
export const StringLabels: Story = {
  args: {
    data: monthLabels,
    showGrid: true,
  },
};

/** `tickLabelFormatter` maps each tick value to its display string. */
export const TickLabelFormatter: Story = {
  args: {
    data: monthLabels,
    tickLabelFormatter: (value) => `${String(value).slice(0, 1)}`,
  },
};

/** `ticks` pins explicit positions instead of the auto-computed set. */
export const CustomTicks: Story = {
  args: {
    showGrid: true,
    ticks: [0, 3, 6, 9, 13],
  },
};

/** `position` moves the axis to the top of the drawing area. */
export const Position: Story = {
  args: {
    position: 'top',
    showGrid: true,
  },
};

/**
 * `scaleType='band'` distributes categories evenly across the axis, ideal for
 * discrete labels supplied via `data`.
 */
export const ScaleType: Story = {
  args: {
    scaleType: 'band',
    data: monthLabels,
    showTickMark: true,
  },
};
