import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { LineChart } from '../LineChart';

import { Point } from '../Point/Point';
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
  render: (args: ScrubberProps) => (
    <div className='flex flex-col gap-40 p-16'>
      <div className='flex flex-col gap-10'>
        <h1 className='heading-1-semi-bold text-base'>Single Series</h1>
        <p className='text-base'>This is a single-series chart with a line.</p>
      </div>
      <LineChart
        series={singleSeries}
        height={400}
        showArea
        yAxis={{
          domain: (bounds) => ({
            min: bounds.min * 0.8,
            max: bounds.max * 1.2,
          }),
        }}
        enableScrubbing
      >
        <Scrubber {...args} />
        <Point
          dataX={1}
          dataY={22}
          label='$98.00'
          showLabelArrow={false}
          labelPosition='top'
          color={cssVar('var(--background-success-strong)')}
        />
        <Point
          dataX={2}
          dataY={29}
          label='$98.00'
          showLabelArrow={false}
          labelPosition='top'
          color={cssVar('var(--background-error-strong)')}
        />
        <Point
          dataX={3}
          dataY={45}
          label='$98.00'
          showLabelArrow={false}
          labelPosition='top'
          color={cssVar('var(--background-success-strong)')}
        />
        <Point
          dataX={5}
          dataY={45}
          label='$98.00'
          showLabelArrow={false}
          labelPosition='top'
          color={cssVar('var(--background-error-strong)')}
        />
      </LineChart>
    </div>
  ),
  args: {},
};

export const MultiSeries: Story = {
  render: (args: ScrubberProps) => (
    <div className='flex flex-col gap-40 p-16'>
      <div className='flex flex-col gap-10'>
        <h1 className='heading-1-semi-bold text-base'>Multi Series</h1>
        <p className='text-base'>
          This is a multi-series chart with two lines.
        </p>
      </div>
      <LineChart
        series={multiSeries}
        height={400}
        enableScrubbing
        inset={{ top: 20 }}
        showYAxis
        yAxis={{
          showLine: false,
          showGrid: true,
          position: 'end',
          domain: (bounds) => ({
            min: bounds.min * 0.5,
            max: bounds.max * 1.2,
          }),
          tickLabelFormatter: (v) => `$${v}`,
        }}
      >
        <Scrubber {...args} showBeacons />
      </LineChart>
    </div>
  ),
  args: {},
};

export const WithAxes: Story = {
  render: (args: ScrubberProps) => (
    <LineChart
      series={singleSeries}
      height={400}
      enableScrubbing
      inset={{ top: 20 }}
      showArea
      showXAxis
      showYAxis
      xAxis={{
        data: dates,
        showGrid: true,
      }}
      yAxis={{
        showLine: true,
        domain: (bounds) => ({
          min: bounds.min * 0.5,
          max: bounds.max * 1.2,
        }),
        tickLabelFormatter: (v) => `$${v}`,
      }}
    >
      <Scrubber {...args} />
      <Point
        dataX={4}
        dataY={98}
        label='$98.00'
        showLabelArrow={false}
        labelPosition='top'
        color={cssVar('var(--background-error-strong)')}
      />
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
