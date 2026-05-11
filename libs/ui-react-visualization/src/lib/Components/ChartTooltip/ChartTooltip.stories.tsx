import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { LineChart } from '../LineChart';
import { Point } from '../Point';
import { Scrubber } from '../Scrubber';
import { ChartTooltip } from './ChartTooltip';

const sampleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
  },
];

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
  'Jan',
  'Feb',
];

const annotatedIndices = new Set([4, 9]);

const meta = {
  component: ChartTooltip,
  title: 'Visualization/ChartTooltip',
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
} satisfies Meta<typeof ChartTooltip>;

export default meta;
type Story = StoryObj<typeof ChartTooltip>;

export const Base: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} enableScrubbing showArea>
      <Scrubber />
      <ChartTooltip
        items={(i) => [
          { title: 'Date', value: dates[i] },
          { title: 'Price', value: `$${sampleSeries[0].data[i]}` },
        ]}
      />
    </LineChart>
  ),
};

export const TooltipOnPoints: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} enableScrubbing showArea>
      <Scrubber />
      <Point dataX={4} dataY={98} label='ATH' />
      <Point dataX={9} dataY={4} label='Low' labelPosition='bottom' />
      <ChartTooltip
        items={(i) => {
          if (!annotatedIndices.has(i)) return [];
          return [
            { title: 'Date', value: dates[i] },
            { title: 'Price', value: `$${sampleSeries[0].data[i]}` },
          ];
        }}
      />
    </LineChart>
  ),
};
