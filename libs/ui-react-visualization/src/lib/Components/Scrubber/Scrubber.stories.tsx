import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { StoryDecorator } from '../../../../.storybook/StoryDecorator';
import { LineChart } from '../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  denseData,
  denseSeries,
  monthLabels,
  multiSeries,
  sampleSeries,
} from '../LineChart/__stories__/chartStoryFixtures';

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

const annotatedIndices = new Set([4, 9]);

const magneticIndices = [20, 60, 100, 140];

/**
 * The simplest setup: `enableScrubbing` on the chart and a bare `<Scrubber>`
 * child. Hover, touch or use the keyboard to move the scrubber line; the area
 * past the cursor is dimmed.
 */
export const Base: Story = {
  render: (args: ScrubberProps) => (
    <LineChart
      series={sampleSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      showArea
      enableScrubbing
    >
      <Scrubber {...args} />
    </LineChart>
  ),
  args: {},
};

/**
 * Pass a `tooltip` callback to surface the value at the scrubbed index.
 * This is the most common scrubber configuration.
 */
export const WithTooltip: Story = {
  render: () => (
    <LineChart
      series={sampleSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      enableScrubbing
      showArea
    >
      <Scrubber
        tooltip={(dataIndex) => ({
          title: `${sampleSeries[0].data[dataIndex]} Transactions`,
          items: [
            { label: 'Date', value: monthLabels[dataIndex] },
            {
              label: 'Price',
              value: `$${sampleSeries[0].data[dataIndex]}`,
            },
          ],
        })}
      />
    </LineChart>
  ),
};

/**
 * `showBeacons` draws a dot on every series at the active index. The scrubber
 * tracks the same index across all series in a multi-line chart.
 */
export const WithBeacons: Story = {
  render: (args: ScrubberProps) => (
    <LineChart
      series={multiSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
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
  ),
  args: {},
};

/**
 * Return `{ items: [] }` from the `tooltip` callback to hide the tooltip at an
 * index — here it only appears on annotated `Point`s.
 */
export const WithTooltipOnPoints: Story = {
  render: () => (
    <LineChart
      series={sampleSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      enableScrubbing
      showArea
    >
      <Point dataX={4} dataY={98} label='ATH' />
      <Point dataX={9} dataY={4} label='Low' labelPosition='bottom' />
      <Scrubber
        tooltip={(dataIndex) => {
          if (!annotatedIndices.has(dataIndex)) return { items: [] };
          return {
            items: [
              { label: 'Date', value: monthLabels[dataIndex] },
              {
                label: 'Price',
                value: `$${sampleSeries[0].data[dataIndex]}`,
              },
            ],
          };
        }}
      />
    </LineChart>
  ),
};

/**
 * With `magnetic` `<Point>`s and a `magnetRadius`, the scrubber snaps onto those
 * points as it nears them. Across a dense series with only a few magnetic
 * points, scrubbing visibly latches onto them.
 */
export const MagneticPoints: Story = {
  render: () => (
    <LineChart
      series={denseSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      showArea
      enableScrubbing
      magnetRadius={16}
    >
      {magneticIndices.map((index) => (
        <Point
          key={index}
          magnetic
          dataX={index}
          dataY={denseData[index]}
          color={cssVar('var(--background-success-strong)')}
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
