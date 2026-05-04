import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { LineChart } from '../LineChart';

import { Scrubber } from './Scrubber';

const meta = {
  component: Scrubber,
  title: 'Visualization/Scrubber',
  tags: ['experimental'],
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <div style={{ width: 600, padding: 16 }}>
          <Story />
        </div>
      </StoryDecorator>
    ),
  ],
} satisfies Meta<typeof Scrubber>;

export default meta;
type Story = StoryObj<typeof Scrubber>;

const dates = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const singleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20],
  },
];

const multiSeries = [
  {
    id: 'lineA',
    label: 'Line A',
    stroke: '#7B61FF',
    data: [5, 15, 10, 90, 85, 70, 30, 25, 25, 40, 60, 80],
  },
  {
    id: 'lineB',
    label: 'Line B',
    stroke: '#44D7B6',
    data: [90, 85, 70, 25, 23, 40, 45, 40, 50, 30, 20, 10],
  },
];

export const Base: Story = {
  render: (args) => (
    <LineChart series={singleSeries} height={250} showArea enableScrubbing>
      <Scrubber {...args} />
    </LineChart>
  ),
  args: {},
};

export const WithLabel: Story = {
  render: (args) => (
    <LineChart
      series={singleSeries}
      height={250}
      enableScrubbing
      inset={{ top: 20 }}
    >
      <Scrubber {...args} label={(i) => dates[i] ?? ''} />
    </LineChart>
  ),
  args: {},
};

export const MultiSeries: Story = {
  render: (args) => (
    <LineChart
      series={multiSeries}
      height={250}
      enableScrubbing
      inset={{ top: 20 }}
    >
      <Scrubber {...args} label={(i) => dates[i] ?? ''} />
    </LineChart>
  ),
  args: {},
};

export const WithAxes: Story = {
  render: (args) => (
    <LineChart
      series={singleSeries}
      height={250}
      enableScrubbing
      inset={{ top: 20 }}
      showXAxis
      showYAxis
      xAxis={{
        data: dates,
        showLine: true,
        showGrid: true,
      }}
      yAxis={{
        showLine: true,
        tickLabelFormatter: (v) => `$${v}`,
      }}
    >
      <Scrubber {...args} label={(i) => dates[i] ?? ''} />
    </LineChart>
  ),
  args: {},
};
