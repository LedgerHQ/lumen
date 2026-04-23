import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StoryDecorator } from '../../../../.storybook/StoryDecorator.tsx';

import { LineChart } from './LineChart';

const meta = {
  component: LineChart,
  title: 'Visualization/LineChart',
  tags: ['experimental'],
  decorators: [
    (Story, context) => {
      return (
        <StoryDecorator context={context}>
          <View style={{ width: 600, padding: 16 }}>
            <Story />
          </View>
        </StoryDecorator>
      );
    },
  ],
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof LineChart>;

const sampleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 22, 29, 45, 98, 45, 22, 52, 21, 4, 68, 20, 21, 58],
  },
];

const multiSeries = [
  {
    id: 'lineA',
    label: 'Line A',
    stroke: '#7B61FF',
    data: [5, 15, 10, 90, 85, 70, 30, 25, 25],
  },
  {
    id: 'lineB',
    label: 'Line B',
    stroke: '#44D7B6',
    data: [90, 85, 70, 25, 23, 40, 45, 40, 50],
  },
];

export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
  },
};

export const WithXAxis: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
  },
};

export const WithStringLabels: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      data: [
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
      ],
      showLine: true,
      showGrid: true,
    },
  },
};

export const WithCustomTicks: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
      ticks: [0, 3, 6, 9, 13],
    },
  },
};

export const WithTickFormatter: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      data: [
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
      ],
      showLine: true,
      tickLabelFormatter: (value) => `${String(value).slice(0, 1)}`,
    },
  },
};

export const XAxisTop: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      position: 'top',
      showLine: true,
      showGrid: true,
    },
  },
};

export const MultipleSeries: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: multiSeries,
    width: 400,
    height: 300,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
  },
};

export const CustomDomain: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
    yAxis: {
      domain: { min: 0, max: 100 },
    },
  },
};

export const WithBothAxes: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showXAxis: true,
    showYAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
    yAxis: {
      showLine: true,
      showGrid: true,
      tickLabelFormatter: (value) => `$${value}`,
    },
  },
};

export const WithBothAxesMultipleSeries: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: multiSeries,
    width: 400,
    height: 300,
    showXAxis: true,
    showYAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
    yAxis: {
      showLine: true,
      domain: { min: 0, max: 100 },
    },
  },
};

export const WithArea: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: sampleSeries,
    width: 400,
    height: 250,
    showArea: true,
    showXAxis: true,
    xAxis: {
      showLine: true,
    },
  },
};

export const WithAreaMultipleSeries: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    series: multiSeries,
    width: 400,
    height: 300,
    showArea: true,
    showXAxis: true,
    showYAxis: true,
    xAxis: {
      showLine: true,
    },
    yAxis: {
      showLine: true,
      domain: { min: 0, max: 100 },
    },
  },
};
