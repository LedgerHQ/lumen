import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { Point, PointLabel } from '../Point/Point';
import { LineChart } from './LineChart';

const meta: Meta<typeof LineChart> = {
  component: LineChart,
  title: 'Visualization/LineChart',
  tags: ['experimental'],
  decorators: [
    (Story, context) => {
      return (
        <StoryDecorator context={context}>
          <div style={{ width: 600, padding: 16 }}>
            <Story />
          </div>
        </StoryDecorator>
      );
    },
  ],
};

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

export const Basic: Story = {
  args: {
    series: sampleSeries,
    height: 250,
  },
};

export const WithXAxis: Story = {
  args: {
    series: sampleSeries,
    height: 250,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
  },
};

export const WithStringLabels: Story = {
  args: {
    series: sampleSeries,
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
  args: {
    series: sampleSeries,
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
  args: {
    series: sampleSeries,
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
  args: {
    series: sampleSeries,
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
  args: {
    series: multiSeries,
    height: 300,
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
  },
};

export const CustomDomain: Story = {
  args: {
    series: sampleSeries,
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
  args: {
    series: sampleSeries,
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
  args: {
    series: multiSeries,
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
  args: {
    series: sampleSeries,
    height: 250,
    showArea: true,
    showXAxis: true,
    xAxis: {
      showLine: true,
    },
  },
};

export const WithAreaMultipleSeries: Story = {
  args: {
    series: multiSeries,
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

export const WithPoints: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <Point
        dataX={9}
        dataY={4}
        label='$4.00'
        color='#C24244'
        labelPosition='bottom'
      />
      <Point
        dataX={4}
        dataY={98}
        label='$98.00'
        color='#47883A'
        labelPosition='top'
      />
    </LineChart>
  ),
};

export const WithCustomLabelComponent: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={250} showArea>
      <Point
        dataX={9}
        dataY={4}
        label='$4.00'
        color='#C24244'
        labelPosition='bottom'
        LabelComponent={({ children, ...props }) => (
          <PointLabel {...props}>{children}</PointLabel>
        )}
      />
      <Point
        dataX={4}
        dataY={98}
        label='$98'
        color='#47883A'
        labelPosition='top'
        showLabelArrow={false}
        LabelComponent={({ x, y, children }) => (
          <g>
            <rect
              x={x - 28}
              y={y - 14}
              width={56}
              height={20}
              rx={4}
              fill='#47883A'
            />
            <PointLabel
              x={x}
              y={y}
              style={{ fill: '#fff', fontSize: 11, fontWeight: 500 }}
            >
              {children}
            </PointLabel>
          </g>
        )}
      />
      <Point
        dataX={12}
        dataY={21}
        label='Low'
        color='#C24244'
        labelPosition='bottom'
        showLabelArrow={false}
        LabelComponent={({ x, y, children }) => (
          <g>
            <rect
              x={x - 24}
              y={y}
              width={48}
              height={22}
              rx={6}
              fill='#C24244'
            />
            <polygon
              points={`${x - 4},${y} ${x},${y - 5} ${x + 4},${y}`}
              fill='#C24244'
            />
            <PointLabel
              x={x}
              y={y + 14}
              style={{ fill: '#fff', fontSize: 11, fontWeight: 600 }}
            >
              {children}
            </PointLabel>
          </g>
        )}
      />
    </LineChart>
  ),
};
