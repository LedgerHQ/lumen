import { cssVar } from '@ledgerhq/lumen-design-core';
import {
  AmountDisplay,
  Button,
  SegmentedControl,
  SegmentedControlButton,
  Trend,
} from '@ledgerhq/lumen-ui-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import { Point } from '../../Point';
import { ReferenceLine } from '../../ReferenceLine';
import { Scrubber } from '../../Scrubber';

import { LineChart } from '../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  curveSeries,
  monthLabels,
  multiSeries,
  sampleSeries,
  STORIES_STROKE_COLOR,
} from './chartStoryFixtures';
import {
  ACTIONS,
  buildChartModel,
  createAxisDateFormatter,
  formatUsd,
  getMarkerColor,
  getMarkerTooltip,
  PERIODS,
  type ChartModel,
  type Period,
  usdFormatter,
} from './cryptoChartData';

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const formatScrubberValue = (value: number | null): string =>
  value === null ? '—' : integerFormatter.format(value);

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
        stroke: STORIES_STROKE_COLOR,
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
 * Each line can be customized independently through its `series` entry. Today
 * that means a per-line `stroke` color and `curve`; more options will follow.
 * Here every line uses a different Lumen color and a different `curve`.
 */
export const CustomLine: Story = {
  args: {
    series: curveSeries,
  },
};

/**
 * Null handling end-to-end. `null` entries in a series' `data` create gaps in
 * the line (and area) by default, so missing samples are not interpolated over
 * — see "Unique Visitors". Setting `connectNulls` on a series skips its nulls
 * and draws a continuous line across the gap instead — see "Page Views".
 *
 * `connectNulls` can also be set chart-wide on `<LineChart>` to override every
 * series at once. Either way, scrubber beacons only land on non-null values, so
 * the missing index shows no beacon for the broken series.
 */
export const MissingData: Story = {
  render: () => {
    const pages = [
      'Page A',
      'Page B',
      'Page C',
      'Page D',
      'Page E',
      'Page F',
      'Page G',
    ];
    const pageViews = [2400, 1398, null, 3908, 4800, 3800, 4300];
    const uniqueVisitors = [4000, 3000, null, 2780, 1890, 2390, 3490];

    return (
      <LineChart
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        enableScrubbing
        showArea
        showXAxis
        showYAxis
        series={[
          {
            id: 'pageViews',
            label: 'Page Views',
            stroke: cssVar('var(--background-success-strong)'),
            data: pageViews,
            connectNulls: true,
          },
          {
            id: 'uniqueVisitors',
            label: 'Unique Visitors',
            stroke: cssVar('var(--background-accent)'),
            data: uniqueVisitors,
          },
        ]}
        xAxis={{ data: pages }}
        yAxis={{ showGrid: true, showLabels: false }}
      >
        <Scrubber
          showBeacons
          tooltip={(dataIndex) => ({
            title: pages[dataIndex],
            items: [
              {
                label: 'Page Views',
                value: formatScrubberValue(pageViews[dataIndex]),
              },
              {
                label: 'Unique Visitors',
                value: formatScrubberValue(uniqueVisitors[dataIndex]),
              },
            ],
          })}
        />
      </LineChart>
    );
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
 * When there is no drawable data and the chart is not `loading`, it renders an
 * empty placeholder with the `emptyLabel` text centred in the chart.
 */
export const Empty: Story = {
  args: {
    series: [],
    emptyLabel: 'No data available',
  },
};

/**
 * `loading` signals that new data is being fetched, with two placeholders:
 * without a series it shows an animated shimmer line (initial fetch); with a
 * series it fades the current line to a muted grey and animates it until a new
 * `series` is provided (refreshing existing data).
 */
export const Loading: Story = {
  render: () => (
    <div className='flex flex-wrap gap-24'>
      <div className='flex w-400 flex-col gap-8'>
        <LineChart series={[]} width={CHART_WIDTH} height={150} loading />
        <span className='body-3 text-muted'>Without data</span>
      </div>
      <div className='flex w-400 flex-col gap-8'>
        <LineChart
          series={sampleSeries}
          width={CHART_WIDTH}
          height={150}
          loading
        />
        <span className='body-3 text-muted'>With data</span>
      </div>
    </div>
  ),
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
const INITIAL_FETCH_DELAY_IN_MS = 1200;
const TRANSITION_FETCH_DELAY_IN_MS = 2000;

export const Interactive: Story = {
  render: () => {
    const [period, setPeriod] = useState<Period>('1Y');
    const [scrubberIndex, setScrubberIndex] = useState<number | undefined>();
    const [showMarkers, setShowMarkers] = useState(true);
    const [loading, setLoading] = useState(true);
    const [model, setModel] = useState<ChartModel | null>(null);
    const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );

    const scheduleFetch = (callback: () => void, delay: number) => {
      if (fetchTimeoutRef.current !== undefined) {
        clearTimeout(fetchTimeoutRef.current);
      }
      fetchTimeoutRef.current = setTimeout(callback, delay);
    };

    useEffect(() => {
      setLoading(true);
      setShowMarkers(false);
      const delay = model
        ? TRANSITION_FETCH_DELAY_IN_MS
        : INITIAL_FETCH_DELAY_IN_MS;
      scheduleFetch(() => {
        setModel(buildChartModel(period));
        setLoading(false);
        setShowMarkers(true);
      }, delay);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    useEffect(
      () => () => {
        if (fetchTimeoutRef.current !== undefined) {
          clearTimeout(fetchTimeoutRef.current);
        }
      },
      [],
    );

    const data = model?.data ?? [];
    const activeValue = data.length
      ? (data[scrubberIndex ?? data.length - 1] ?? 0)
      : 0;
    const changePercent =
      data.length && data[0] ? ((activeValue - data[0]) / data[0]) * 100 : 0;
    const lineColor = cssVar(
      (model?.isPositive ?? true)
        ? 'var(--border-success)'
        : 'var(--border-error)',
    );

    return (
      <div className='flex flex-col gap-24'>
        <ChartHeader
          value={activeValue}
          changePercent={changePercent}
          periodLabel={PERIODS[period].label}
          showMarkers={showMarkers}
          onToggleMarkers={() => setShowMarkers((value) => !value)}
          onSimulateEmpty={() => {
            setLoading(true);
            setShowMarkers(false);
            scheduleFetch(() => {
              setModel(null);
              setLoading(false);
            }, INITIAL_FETCH_DELAY_IN_MS);
          }}
        />

        <LineChart
          series={[{ id: 'price', stroke: lineColor, data }]}
          width={CHART_WIDTH}
          height={340}
          loading={loading}
          showArea
          enableScrubbing
          inset={{ top: 20, bottom: 8 }}
          showXAxis
          showYAxis
          xAxis={{
            ticks: model?.xTicks,
            tickLabelFormatter: createAxisDateFormatter(period, data.length),
          }}
          yAxis={{
            domain: model?.yDomain,
            ticks: model?.yTicks,
            showTickMark: false,
            showGrid: true,
            showLabels: false,
            width: 0,
          }}
          onScrubberPositionChange={setScrubberIndex}
        >
          {model && (
            <>
              {showMarkers &&
                model.markers.map((marker) => (
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
                dataX={model.highIndex}
                dataY={data[model.highIndex]}
                labelPosition='top'
                label={formatUsd(data[model.highIndex])}
              />
              <Point
                hidePoint
                dataX={model.lowIndex}
                dataY={data[model.lowIndex]}
                labelPosition='bottom'
                label={formatUsd(data[model.lowIndex])}
              />
              <ReferenceLine
                dataY={model.average}
                labelDy={-4}
                labelHorizontalAlignment='start'
                labelVerticalAlignment='start'
                label='Avg. buy in'
              />
              <Scrubber
                tooltip={(dataIndex) => {
                  const marker = model.markerByIndex.get(dataIndex);
                  return marker ? getMarkerTooltip(marker) : { items: [] };
                }}
              />
            </>
          )}
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
  onSimulateEmpty,
}: {
  value: number;
  changePercent: number;
  periodLabel: string;
  showMarkers: boolean;
  onToggleMarkers: () => void;
  onSimulateEmpty: () => void;
}) => (
  <div className='flex flex-col gap-12'>
    <div className='flex justify-end gap-8'>
      <Button appearance='gray' size='sm' onClick={onSimulateEmpty}>
        Simulate empty
      </Button>
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
