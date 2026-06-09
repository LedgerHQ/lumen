import { cssVar } from '@ledgerhq/lumen-design-core';
import {
  AmountDisplay,
  Button,
  SegmentedControl,
  SegmentedControlButton,
  Trend,
} from '@ledgerhq/lumen-ui-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { Point } from '../../Point';
import { ReferenceLine } from '../../ReferenceLine';
import { Scrubber } from '../../Scrubber';

import { LineChart } from '../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  monthLabels,
  multiSeries,
  sampleSeries,
} from './chartStoryFixtures';
import {
  ACTIONS,
  buildChartModel,
  createAxisDateFormatter,
  formatUsd,
  getMarkerColor,
  getMarkerTooltip,
  PERIODS,
  type Period,
  usdFormatter,
} from './cryptoChartData';

const meta = {
  component: LineChart,
  title: 'Visualization/LineChart',
  tags: ['experimental'],
  args: {
    series: sampleSeries,
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
  },
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <Story />
      </StoryDecorator>
    ),
  ],
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof LineChart>;

/**
 * The simplest chart: a single `series` rendered with default settings.
 * No axes, no overlays — just the line.
 */
export const Base: Story = {};

/**
 * A `Series` is the core data model. Each entry has a stable `id`, a `stroke`
 * color, an optional `label`, and a `data` array of numbers (use `null` for
 * gaps). Every `series` produces one `<Line>`.
 */
export const Series: Story = {
  args: {
    series: [
      {
        id: 'prices',
        label: 'BTC',
        stroke: '#7B61FF',
        data: sampleSeries[0].data,
      },
    ],
    showArea: true,
  },
};

/**
 * Pass multiple entries in `series` to draw several lines that share the same
 * x/y scales. Give each a distinct `stroke`.
 */
export const MultipleSeries: Story = {
  args: {
    series: multiSeries,
  },
};

/**
 * `null` entries in a series' `data` render as gaps in the line, so missing
 * samples don't get interpolated over.
 */
export const MissingData: Story = {
  args: {
    series: [
      {
        id: 'prices',
        stroke: '#7B61FF',
        data: [10, 22, 29, null, null, 45, 22, 52, 21, 4, 68, 20, 21, 58],
      },
    ],
    showArea: true,
  },
};

/**
 * `width` accepts a number (pixels) or a string like `'100%'` to fill the
 * container. `height` is always in pixels. All docs stories share
 * `CHART_WIDTH` / `CHART_HEIGHT` for visual consistency.
 */
export const WidthAndHeight: Story = {
  args: {
    width: CHART_WIDTH,
    height: 120,
  },
};

const insetExamples = [
  { label: 'inset={0}', inset: 0 },
  { label: 'inset={15}', inset: 15 },
  {
    label: 'inset={{ top: 30, bottom: 30, left: 40, right: 40 }}',
    inset: { top: 30, bottom: 30, left: 40, right: 40 },
  },
];

/**
 * `inset` reserves padding between the SVG edge (outlined here) and the drawing
 * area where the line is plotted. A number applies the same padding on every
 * side; a partial object overrides individual sides. Compare the gap between
 * the border and the line across the examples.
 */
export const Inset: Story = {
  render: () => (
    <div className='flex flex-wrap gap-24'>
      {insetExamples.map(({ label, inset }) => (
        <div key={label} className='flex w-256 flex-col gap-8'>
          <div className='border border-muted'>
            <LineChart
              series={sampleSeries}
              width={CHART_WIDTH}
              height={150}
              inset={inset}
              showArea
            />
          </div>
          <span className='body-3 text-muted'>{label}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Enable hover/touch/keyboard interaction with `enableScrubbing` and render a
 * `<Scrubber>` child. See the **Scrubber** page for tooltips, beacons and
 * magnetic points.
 */
export const Scrubbing: Story = {
  args: {
    showArea: true,
    enableScrubbing: true,
  },
  render: (args) => (
    <LineChart {...args}>
      <Scrubber
        tooltip={(dataIndex) => ({
          items: [
            { label: 'Month', value: monthLabels[dataIndex] },
            { label: 'Price', value: `$${sampleSeries[0].data[dataIndex]}` },
          ],
        })}
      />
    </LineChart>
  ),
};

/**
 * `showArea` fills the region under each line. `areaType='gradient'` (the
 * default) fades from the stroke color to transparent.
 */
export const Area: Story = {
  args: {
    showArea: true,
  },
};

/**
 * Basic x-axis. Toggle it with `showXAxis` and configure it through `xAxis`.
 * See the **XAxis** page for the full set of options (ticks, labels, scale,
 * position, grid).
 */
export const WithXAxis: Story = {
  args: {
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
  },
};

/**
 * Basic y-axis. Toggle it with `showYAxis` and configure it through `yAxis`.
 * See the **YAxis** page for the full set of options (domain, scale, width,
 * position, formatting).
 */
export const WithYAxis: Story = {
  args: {
    showYAxis: true,
    yAxis: {
      showLine: true,
      tickLabelFormatter: (value) => `$${value}`,
    },
  },
};

/**
 * Combine y-axis and x-axis with grid lines and tick marks.
 */
export const WithBothAxis: Story = {
  args: {
    showYAxis: true,
    showXAxis: true,
    yAxis: {
      showGrid: true,
      showTickMark: true,
      showLine: true,
      tickLabelFormatter: (value) => `$${value}`,
    },
    xAxis: {
      showLine: true,
      showGrid: true,
      showTickMark: true,
    },
  },
};

/**
 * Annotate specific data coordinates with `<Point>` children. See the
 * **Point** page for labels, colors, sizes and magnetic snapping.
 */
export const WithPoint: Story = {
  args: {
    showArea: true,
  },
  render: (args) => (
    <LineChart {...args}>
      <Point
        dataX={4}
        dataY={98}
        label='ATH'
        color={cssVar('var(--background-success-strong)')}
      />
      <Point
        dataX={9}
        dataY={4}
        label='Low'
        labelPosition='bottom'
        color={cssVar('var(--background-error-strong)')}
      />
    </LineChart>
  ),
};

/**
 * Draw a threshold or baseline with `<ReferenceLine>`. See the
 * **ReferenceLine** page for vertical lines and label alignment.
 */
export const WithReferenceLine: Story = {
  args: {
    showArea: true,
  },
  render: (args) => (
    <LineChart {...args}>
      <ReferenceLine
        dataY={50}
        label='Target'
        labelDy={-4}
        labelVerticalAlignment='start'
        labelHorizontalAlignment='start'
      />
    </LineChart>
  ),
};

/**
 * Putting it all together: a realistic, interactive portfolio chart composing
 * axes, points, a reference line and a scrubber with design-system components.
 */
export const Interactive: Story = {
  render: () => {
    const [period, setPeriod] = useState<Period>('1Y');
    const [scrubberIndex, setScrubberIndex] = useState<number | undefined>();
    const [showMarkers, setShowMarkers] = useState(true);

    const model = useMemo(() => buildChartModel(period), [period]);
    const {
      data,
      markers,
      markerByIndex,
      average,
      isPositive,
      highIndex,
      lowIndex,
      yDomain,
      xTicks,
      yTicks,
    } = model;

    const activeValue = data[scrubberIndex ?? data.length - 1];
    const changePercent = ((activeValue - data[0]) / data[0]) * 100;
    const lineColor = cssVar(
      isPositive ? 'var(--border-success)' : 'var(--border-error)',
    );

    return (
      <div className='flex flex-col gap-24'>
        <ChartHeader
          value={activeValue}
          changePercent={changePercent}
          periodLabel={PERIODS[period].label}
          showMarkers={showMarkers}
          onToggleMarkers={() => setShowMarkers((value) => !value)}
        />

        <LineChart
          series={[{ id: 'price', stroke: lineColor, data }]}
          width={CHART_WIDTH}
          height={340}
          showArea
          enableScrubbing
          inset={{ top: 20, bottom: 8 }}
          showXAxis
          showYAxis
          xAxis={{
            ticks: xTicks,
            tickLabelFormatter: createAxisDateFormatter(period, data.length),
          }}
          yAxis={{
            domain: yDomain,
            ticks: yTicks,
            showTickMark: false,
            showGrid: true,
            // Below is a hack to hide the y-axis labels. A showLabels prop is coming soon.
            width: 0,
            tickLabelFormatter: () => '',
          }}
          onScrubberPositionChange={setScrubberIndex}
        >
          <ReferenceLine
            dataY={average}
            labelDy={-4}
            labelHorizontalAlignment='start'
            labelVerticalAlignment='start'
            label='Avg. buy in'
          />
          {showMarkers &&
            markers.map((marker) => (
              <Point
                key={marker.index}
                magnetic
                dataX={marker.index}
                dataY={data[marker.index]}
                color={getMarkerColor(marker)}
              />
            ))}

          <Point
            hidePoint
            dataX={highIndex}
            dataY={data[highIndex]}
            labelPosition='top'
            label={formatUsd(data[highIndex])}
          />
          <Point
            hidePoint
            dataX={lowIndex}
            dataY={data[lowIndex]}
            labelPosition='bottom'
            label={formatUsd(data[lowIndex])}
          />
          <Scrubber
            tooltip={(dataIndex) => {
              const marker = markerByIndex.get(dataIndex);
              return marker ? getMarkerTooltip(marker) : { items: [] };
            }}
          />
        </LineChart>

        <SegmentedControl
          selectedValue={period}
          onSelectedChange={(value) => setPeriod(value as Period)}
          tabLayout='fixed'
        >
          {(Object.keys(PERIODS) as Period[]).map((key) => (
            <SegmentedControlButton key={key} value={key}>
              {key}
            </SegmentedControlButton>
          ))}
        </SegmentedControl>
      </div>
    );
  },
};

const ChartHeader = ({
  value,
  changePercent,
  periodLabel,
  showMarkers,
  onToggleMarkers,
}: {
  value: number;
  changePercent: number;
  periodLabel: string;
  showMarkers: boolean;
  onToggleMarkers: () => void;
}) => (
  <div className='flex flex-col gap-12'>
    <div className='flex justify-end'>
      <Button appearance='gray' size='sm' onClick={onToggleMarkers}>
        {showMarkers ? 'Hide transactions' : 'Show transactions'}
      </Button>
    </div>
    <AmountDisplay value={value} formatter={usdFormatter} animate={false} />
    <div className='flex items-center gap-8'>
      <Trend value={changePercent} />
      <span className='body-2 text-muted'>· {periodLabel}</span>
    </div>
    <div className='flex items-center gap-8'>
      {ACTIONS.map((action) => (
        <Button
          key={action.label}
          appearance={action.appearance}
          size='sm'
          icon={action.icon}
        >
          {action.label}
        </Button>
      ))}
    </div>
  </div>
);
