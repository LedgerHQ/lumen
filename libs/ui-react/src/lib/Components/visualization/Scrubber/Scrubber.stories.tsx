import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { Button } from '../../core/Button';
import { LineChart } from '../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  denseData,
  denseSeries,
  monthLabels,
  multiSeries as stepMultiSeries,
  sampleSeries,
} from '../LineChart/__stories__/chartStoryFixtures';

import { Point } from '../Point/Point';
import type { Series } from '../utils/types';
import { DefaultBeaconLabel } from './BeaconLabel/BeaconLabel';
import { Scrubber } from './Scrubber';
import type { ScrubberProps } from './types';

const meta = {
  parameters: { docs: { source: { type: 'code' } } },
  component: Scrubber,
  id: 'react-scrubber',
  title: 'Visualization/Scrubber',
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

const multiSeries = stepMultiSeries.map((s) => ({
  ...s,
  curve: 'bump' as const,
}));

const reversedMultiSeries = multiSeries.map((s) => ({
  ...s,
  data: [...s.data].reverse(),
}));

/**
 * The simplest setup: `enableScrubbing` on the chart and a bare `<Scrubber>`
 * child. Hover, touch or use the keyboard to move the scrubber line; the area
 * past the cursor is dimmed.
 */
export const Base: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
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
  args: {
    hideLine: false,
    hideOverlay: false,
    showBeacons: false,
  },
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

export const WithBeaconLabels: Story = {
  render: () => (
    <LineChart
      series={multiSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      enableScrubbing
      inset={{ top: 20 }}
    >
      <Scrubber showBeaconLabel />
    </LineChart>
  ),
};

export const WithCustomBeaconLabel: Story = {
  render: () => (
    <LineChart
      series={multiSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      enableScrubbing
      inset={{ top: 20 }}
    >
      <Scrubber
        showBeaconLabel
        beaconLabel={({ series, value }) => (
          <DefaultBeaconLabel
            label={`${series.label}: $${value}`}
            background={series.stroke}
            color={cssVar('var(--text-white)')}
          />
        )}
      />
    </LineChart>
  ),
};

export const WithFullyCustomBeaconLabel: Story = {
  render: () => (
    <LineChart
      series={multiSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      enableScrubbing
      inset={{ top: 20 }}
    >
      <Scrubber
        showBeaconLabel
        beaconLabel={({ series, value }) => (
          <text y={12} dominantBaseline='central' paintOrder='stroke'>
            <tspan fontSize={16} fontWeight={700} fill={series.stroke}>
              {`$${value}`}
            </tspan>
            <tspan
              dx={6}
              fontSize={10}
              fontWeight={600}
              fill={cssVar('var(--text-muted)')}
            >
              {series.label?.toUpperCase()}
            </tspan>
          </text>
        )}
      />
    </LineChart>
  ),
};

export const WithIdlePulse: Story = {
  render: (args: ScrubberProps) => (
    <LineChart
      series={multiSeries}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      enableScrubbing
      inset={{ top: 20, right: 20 }}
    >
      <Scrubber {...args} showBeacons idlePulse />
    </LineChart>
  ),
  args: {},
};

export const WithLoading: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState<Series[]>([]);

    useEffect(() => {
      if (!loading) {
        return;
      }
      const timeout = setTimeout(() => {
        setSeries((current) =>
          current === multiSeries ? reversedMultiSeries : multiSeries,
        );
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }, [loading]);

    return (
      <div className='flex w-full flex-col items-center gap-16'>
        <LineChart
          series={series}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          loading={loading}
          enableScrubbing
          inset={{ top: 20, right: 20 }}
        >
          <Scrubber showBeacons idlePulse />
        </LineChart>
        <Button
          appearance='gray'
          size='sm'
          loading={loading}
          onClick={() => setLoading(true)}
        >
          Reload
        </Button>
      </div>
    );
  },
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
