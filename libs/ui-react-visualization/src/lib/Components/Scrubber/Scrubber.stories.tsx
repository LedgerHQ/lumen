import { cssVar } from '@ledgerhq/lumen-design-core';
import {
  Button,
  SegmentedControl,
  SegmentedControlButton,
} from '@ledgerhq/lumen-ui-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useState } from 'react';

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
        <Scrubber {...args} label={(i: number) => dates[i] ?? ''} showBeacons />
      </LineChart>
    </div>
  ),
  args: {},
};

const TIMELINES = {
  '1D': { days: 1, dateFormat: { hour: 'numeric', minute: '2-digit' } },
  '1W': { days: 7, dateFormat: { weekday: 'short', hour: 'numeric' } },
  '1M': { days: 30, dateFormat: { month: 'short', day: 'numeric' } },
  '1Y': {
    days: 365,
    dateFormat: { month: 'short', day: 'numeric', year: 'numeric' },
  },
} as const;

type TimelineKey = keyof typeof TIMELINES;

const buildCoingeckoUrl = (days: number): string =>
  `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`;

const formatBtcPrice = (v: number | string): string => {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

function BitcoinChartStory(props: ScrubberProps) {
  const [chartData, setChartData] = useState<{
    prices: number[];
    dates: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scrubberIndex, setScrubberIndex] = useState<number | undefined>();
  const [showPoints, setShowPoints] = useState(true);
  const [timeline, setTimeline] = useState<TimelineKey>('1Y');

  useEffect(() => {
    setChartData(null);
    setError(null);
    setScrubberIndex(undefined);

    const { days, dateFormat } = TIMELINES[timeline];

    fetch(buildCoingeckoUrl(days))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: { prices: [number, number][] }) => {
        setChartData({
          prices: json.prices.map(([, price]) => Math.round(price)),
          dates: json.prices.map(([ts]) =>
            new Date(ts).toLocaleDateString(
              'en-US',
              dateFormat as Intl.DateTimeFormatOptions,
            ),
          ),
        });
      })
      .catch((err: Error) => setError(err.message));
  }, [timeline]);

  const extrema = useMemo(() => {
    if (!chartData) return { highIndex: 0, lowIndex: 0, localExtrema: [] };

    let hi = 0;
    let lo = 0;
    for (let i = 1; i < chartData.prices.length; i++) {
      if (chartData.prices[i] > chartData.prices[hi]) hi = i;
      if (chartData.prices[i] < chartData.prices[lo]) lo = i;
    }

    const window = 10;
    const candidates: { index: number; type: 'peak' | 'trough' }[] = [];
    for (let i = window; i < chartData.prices.length - window; i++) {
      const slice = chartData.prices.slice(i - window, i + window + 1);
      const val = chartData.prices[i];
      if (val === Math.max(...slice) && i !== hi) {
        candidates.push({ index: i, type: 'peak' });
      } else if (val === Math.min(...slice) && i !== lo) {
        candidates.push({ index: i, type: 'trough' });
      }
    }

    const minSpacing = 15;
    const spaced: typeof candidates = [];
    for (const c of candidates) {
      if (spaced.every((s) => Math.abs(s.index - c.index) >= minSpacing)) {
        spaced.push(c);
      }
    }

    return { highIndex: hi, lowIndex: lo, localExtrema: spaced.slice(0, 20) };
  }, [chartData]);

  const { highIndex, lowIndex, localExtrema } = extrema;

  const yTicks = useMemo((): number[] => {
    if (!chartData) return [];
    const min = Math.min(...chartData.prices);
    const max = Math.max(...chartData.prices);
    const mid = Math.round((min + max) / 2);
    return [min, mid, max];
  }, [chartData]);

  if (error) return <div>Failed to fetch BTC data: {error}</div>;
  if (!chartData) return <div>Loading Bitcoin price data…</div>;

  const series = [
    {
      id: 'btc',
      stroke: cssVar('var(--border-success)'),
      data: chartData.prices,
    },
  ];
  const displayIndex = scrubberIndex ?? chartData.prices.length - 1;

  return (
    <div className='flex flex-col items-start gap-40 p-16'>
      <div className='inline-flex flex-col items-start gap-24'>
        <h1 className='heading-1-semi-bold text-base'>Bitcoin Price</h1>
        <p className='text-base'>
          {chartData.dates[displayIndex]} —{' '}
          {formatBtcPrice(chartData.prices[displayIndex])}
        </p>

        <SegmentedControl
          selectedValue={timeline}
          onSelectedChange={(v) => setTimeline(v as TimelineKey)}
          tabLayout='fit'
        >
          {Object.keys(TIMELINES).map((key) => (
            <SegmentedControlButton key={key} value={key}>
              {key}
            </SegmentedControlButton>
          ))}
        </SegmentedControl>

        <div className='flex items-center gap-8'>
          <Button size='sm' appearance='accent'>
            Buy
          </Button>
          <Button size='sm' appearance='red'>
            Sell
          </Button>
          <Button size='sm' appearance='gray'>
            Reset
          </Button>
          <Button
            size='sm'
            appearance='transparent'
            onClick={() => setShowPoints((v) => !v)}
          >
            {showPoints ? 'Hide points' : 'Show points'}
          </Button>
        </div>
      </div>
      <div className='size-full bg-base p-16'>
        <LineChart
          series={series}
          height={400}
          enableScrubbing
          showArea
          inset={{ top: 20, left: 15 }}
          showYAxis
          yAxis={{
            gridLineStyle: 'solid',
            showGrid: true,
            ticks: yTicks,
            tickLabelFormatter: formatBtcPrice,
          }}
          onScrubberPositionChange={setScrubberIndex}
        >
          <Scrubber {...props} />
          {showPoints && (
            <>
              <Point
                dataX={highIndex}
                dataY={chartData.prices[highIndex]}
                label={formatBtcPrice(chartData.prices[highIndex])}
                labelPosition='top'
                hidePoint
              />
              <Point
                dataX={lowIndex}
                dataY={chartData.prices[lowIndex]}
                label={formatBtcPrice(chartData.prices[lowIndex])}
                labelPosition='bottom'
                hidePoint
              />
              {localExtrema.map((e) => (
                <Point
                  key={e.index}
                  dataX={e.index}
                  dataY={chartData.prices[e.index]}
                  color={cssVar(
                    e.type === 'peak'
                      ? 'var(--background-success-strong)'
                      : 'var(--background-error-strong)',
                  )}
                />
              ))}
            </>
          )}
        </LineChart>
      </div>
    </div>
  );
}

export const BitcoinChart: Story = {
  render: (args: ScrubberProps) => <BitcoinChartStory {...args} />,
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
