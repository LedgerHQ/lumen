import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { LineChart } from '../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  denseData,
  denseSeries,
  sampleSeries,
} from '../LineChart/__stories__/chartStoryFixtures';
import { Scrubber } from '../Scrubber';
import { Point, PointLabel } from './Point';

const meta = {
  component: Point,
  title: 'Visualization/Point',
  tags: ['experimental'],
  decorators: [
    (Story, context) => {
      return (
        <StoryDecorator context={context}>
          <div style={{ width: CHART_WIDTH, padding: 16 }}>
            <Story />
          </div>
        </StoryDecorator>
      );
    },
  ],
} satisfies Meta<typeof Point>;

export default meta;
type Story = StoryObj<typeof Point>;

const magneticPoints = [
  { index: 20, color: cssVar('var(--background-success-strong)') },
  { index: 60, color: cssVar('var(--background-error-strong)') },
  { index: 100, color: cssVar('var(--background-success-strong)') },
  { index: 140, color: cssVar('var(--background-error-strong)') },
];

export const Base: Story = {
  args: {
    dataX: 4,
    dataY: 98,
    label: '$98.00',
    labelPosition: 'top',
    color: cssVar('var(--background-success-strong)'),
  },
  render: (args) => (
    <LineChart series={sampleSeries} height={CHART_HEIGHT} showArea>
      <Point {...args} />
    </LineChart>
  ),
};

export const NoPoint: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={CHART_HEIGHT} showArea>
      <Point
        dataX={4}
        dataY={98}
        label='ATH'
        hidePoint
        showLabelArrow={false}
      />
      <Point
        dataX={9}
        dataY={4}
        label='Low'
        hidePoint
        showLabelArrow={false}
        labelPosition='bottom'
      />
    </LineChart>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <LineChart series={sampleSeries} height={CHART_HEIGHT} showArea>
      <Point
        dataX={4}
        dataY={98}
        size={16}
        label={(i) => `Index ${i}`}
        color={cssVar('var(--background-success-strong)')}
      />
      <Point
        dataX={9}
        dataY={4}
        size={6}
        label='$4.00'
        color={cssVar('var(--background-error-strong)')}
        labelPosition='bottom'
      />
    </LineChart>
  ),
};

export const WithCustomLabelComponent: Story = {
  render: () => (
    <LineChart
      series={sampleSeries}
      height={CHART_HEIGHT}
      inset={{ top: 20 }}
      showArea
    >
      <Point
        dataX={9}
        dataY={4}
        label='$4.00'
        color={cssVar('var(--background-error-strong)')}
        labelPosition='bottom'
        LabelComponent={({ children, ...props }) => (
          <PointLabel {...props}>{children}</PointLabel>
        )}
      />
      <Point
        dataX={4}
        dataY={98}
        label='$98.00'
        color={cssVar('var(--background-success-strong)')}
        labelPosition='top'
        LabelComponent={({ x, y, children }) => (
          <g>
            <PointLabel x={x} y={y - 16}>
              {children}
            </PointLabel>
            <PointLabel
              x={x}
              y={y}
              style={{
                fontSize: 10,
                fill: cssVar('var(--text-success)'),
              }}
            >
              +5.2%
            </PointLabel>
          </g>
        )}
      />
    </LineChart>
  ),
};

/**
 * With `magnetic` and the chart's `enableScrubbing`, the scrubber snaps to a
 * point when it comes within the chart's `magnetRadius`. Across a dense series
 * with only a few magnetic points, scrubbing visibly latches onto them.
 */
export const MagneticPoints: Story = {
  render: () => (
    <LineChart
      series={denseSeries}
      height={CHART_HEIGHT}
      showArea
      enableScrubbing
      magnetRadius={16}
    >
      {magneticPoints.map(({ index, color }) => (
        <Point
          key={index}
          magnetic
          dataX={index}
          dataY={denseData[index]}
          color={color}
        />
      ))}
      <Scrubber
        tooltip={(dataIndex) => ({
          items: [{ label: 'Value', value: `${denseData[dataIndex]}` }],
        })}
      />
    </LineChart>
  ),
};
