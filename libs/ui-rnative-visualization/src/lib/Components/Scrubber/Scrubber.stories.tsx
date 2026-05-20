import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator.tsx';
import { LineChart } from '../LineChart';
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
    <LineChart series={singleSeries} height={200} showArea enableScrubbing>
      <Scrubber {...args} />
    </LineChart>
  ),
  args: {},
};

export const WithLabel: Story = {
  render: (args: ScrubberProps) => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>();
    const displayIndex = activeIndex ?? singleSeries[0].data.length - 1;
    return (
      <View>
        <Text style={{ marginBottom: 8, fontSize: 14 }}>
          {dates[displayIndex]} — ${singleSeries[0].data[displayIndex]}
        </Text>
        <LineChart
          series={singleSeries}
          height={200}
          showArea
          enableScrubbing
          onScrubberPositionChange={setActiveIndex}
        >
          <Scrubber {...args} label={(i: number) => dates[i] ?? ''} />
        </LineChart>
      </View>
    );
  },
  args: {},
};

export const MultiSeries: Story = {
  render: (args: ScrubberProps) => (
    <LineChart series={multiSeries} height={200} enableScrubbing>
      <Scrubber {...args} label={(i: number) => dates[i] ?? ''} showBeacons />
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
