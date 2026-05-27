import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator.tsx';
import { LineChart } from '../LineChart';
import { Point } from '../Point';
import { Scrubber } from './Scrubber';
import type { ScrubberProps } from './types';

const meta = {
  component: Scrubber,
  title: 'Visualization/Scrubber',
  tags: ['experimental'],
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <Story />
      </StoryDecorator>
    ),
  ],
} satisfies Meta<typeof Scrubber>;

export default meta;
type Story = StoryObj<typeof Scrubber>;

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
  render: (args: ScrubberProps) => (
    <LineChart series={singleSeries} height={200} showArea enableScrubbing>
      <Scrubber {...args} />
    </LineChart>
  ),
  args: {},
};

export const MultiSeries: Story = {
  render: (args: ScrubberProps) => (
    <LineChart series={multiSeries} height={200} enableScrubbing>
      <Scrubber {...args} showBeacons />
    </LineChart>
  ),
  args: {},
};

export const HiddenLine: Story = {
  render: (args: ScrubberProps) => (
    <LineChart series={singleSeries} height={200} showArea enableScrubbing>
      <Scrubber {...args} hideLine />
    </LineChart>
  ),
  args: {},
};

export const HiddenOverlay: Story = {
  render: (args: ScrubberProps) => (
    <LineChart series={singleSeries} height={200} showArea enableScrubbing>
      <Scrubber {...args} hideOverlay />
    </LineChart>
  ),
  args: {},
};

const tooltipSampleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
  },
];

const tooltipDates = [
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
  'Jan',
  'Feb',
];

const tooltipAnnotatedIndices = new Set([4, 9]);

export const WithBaseTooltip: Story = {
  render: () => (
    <LineChart
      series={tooltipSampleSeries}
      height={250}
      enableScrubbing
      showArea
    >
      <Scrubber
        tooltip={(dataIndex) => ({
          items: [
            { label: 'Date', value: tooltipDates[dataIndex] },
            {
              label: 'Price',
              value: `$${tooltipSampleSeries[0].data[dataIndex]}`,
            },
          ],
        })}
      />
    </LineChart>
  ),
};

export const WithTooltipTitle: Story = {
  render: () => (
    <LineChart
      series={tooltipSampleSeries}
      height={250}
      enableScrubbing
      showArea
    >
      <Scrubber
        tooltip={(dataIndex) => ({
          title: `${tooltipSampleSeries[0].data[dataIndex]} Transactions`,
          items: [
            { label: 'Date', value: tooltipDates[dataIndex] },
            {
              label: 'Price',
              value: `$${tooltipSampleSeries[0].data[dataIndex]}`,
            },
          ],
        })}
      />
    </LineChart>
  ),
};

export const WithTooltipOnPoints: Story = {
  render: () => (
    <LineChart
      series={tooltipSampleSeries}
      height={250}
      enableScrubbing
      showArea
    >
      <Scrubber
        tooltip={(dataIndex) => {
          if (!tooltipAnnotatedIndices.has(dataIndex)) return { items: [] };
          return {
            items: [
              { label: 'Date', value: tooltipDates[dataIndex] },
              {
                label: 'Price',
                value: `$${tooltipSampleSeries[0].data[dataIndex]}`,
              },
            ],
          };
        }}
      />
      <Point dataX={4} dataY={98} label='ATH' />
      <Point dataX={9} dataY={4} label='Low' labelPosition='bottom' />
    </LineChart>
  ),
};
