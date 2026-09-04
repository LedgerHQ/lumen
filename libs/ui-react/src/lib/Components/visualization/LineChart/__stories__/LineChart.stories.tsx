import { cssVar } from '@ledgerhq/lumen-design-core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { StoryDecorator } from '../../../../../../.storybook/StoryDecorator';
import { AmountDisplay } from '../../../core/AmountDisplay';
import { Button } from '../../../core/Button';
import {
  SegmentedControl,
  SegmentedControlButton,
} from '../../../core/SegmentedControl';
import { Trend } from '../../../core/Trend';

import { Legend } from '../../Legend';
import { Point } from '../../Point';
import { ReferenceLine } from '../../ReferenceLine';
import { Scrubber } from '../../Scrubber';

import { LineChart } from '../LineChart';
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  curveSeries,
  formatScrubberValue,
  missingDataPages,
  missingDataSeries,
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

const meta = {
  component: LineChart,
  id: 'react-linechart',
  title: 'Visualization/LineChart',
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

export const Base: Story = {};

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

export const MultipleSeries: Story = {
  args: {
    series: multiSeries,
  },
};

export const CustomLine: Story = {
  args: {
    series: curveSeries,
  },
};

export const MissingData: Story = {
  args: {
    series: missingDataSeries,
    enableScrubbing: true,
    showArea: true,
    showXAxis: true,
    showYAxis: true,
    xAxis: { data: missingDataPages },
    yAxis: { showGrid: true, showLabels: false },
  },
  render: (args) => (
    <LineChart {...args}>
      <Scrubber
        showBeacons
        tooltip={(dataIndex) => ({
          title: missingDataPages[dataIndex],
          items: missingDataSeries.map((series) => ({
            label: series.label,
            value: formatScrubberValue(series.data[dataIndex]),
          })),
        })}
      />
    </LineChart>
  ),
};

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

export const Area: Story = {
  args: {
    showArea: true,
  },
};

export const Empty: Story = {
  args: {
    series: [],
    emptyLabel: 'No data available',
  },
};

export const Loading: Story = {
  render: () => (
    <div className='flex flex-wrap gap-24'>
      <div className='flex w-full flex-col gap-8'>
        <LineChart series={[]} height={150} loading />
        <span className='body-3 text-muted'>Without data</span>
      </div>
      <div className='flex w-full flex-col gap-8'>
        <LineChart series={sampleSeries} height={150} loading />
        <span className='body-3 text-muted'>With data</span>
      </div>
    </div>
  ),
};

export const WithXAxis: Story = {
  args: {
    showXAxis: true,
    xAxis: {
      showLine: true,
      showGrid: true,
    },
  },
};

export const WithYAxis: Story = {
  args: {
    showYAxis: true,
    yAxis: {
      showLine: true,
      tickLabelFormatter: (value) => `$${value}`,
    },
  },
};

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

const legendItems = multiSeries.map(({ id, label, stroke }) => ({
  id,
  label,
  color: stroke,
}));

export const WithLegend: Story = {
  args: {
    series: multiSeries,
    showArea: true,
  },
  render: (args) => (
    <div className='flex flex-col gap-16'>
      <LineChart {...args} />
      <Legend series={legendItems} />
    </div>
  ),
};

const INITIAL_FETCH_DELAY_IN_MS = 1200;
const TRANSITION_FETCH_DELAY_IN_MS = 2000;

const lightContrastSeries = [
  {
    id: 'alpha',
    stroke: '#f0f7ff',
    data: [10, 22, 18, 35, 42, 38, 51, 45, 60, 55],
  },
  {
    id: 'beta',
    stroke: '#fff5e6',
    data: [40, 35, 45, 30, 25, 38, 28, 42, 30, 45],
  },
];

const darkContrastSeries = [
  {
    id: 'gamma',
    stroke: '#0d1117',
    data: [10, 22, 18, 35, 42, 38, 51, 45, 60, 55],
  },
  {
    id: 'delta',
    stroke: '#0f0d17',
    data: [40, 35, 45, 30, 25, 38, 28, 42, 30, 45],
  },
];

export const WithColorContrast: Story = {
  render: () => (
    <div className='flex flex-col gap-24'>
      <div className='flex items-end gap-32'>
        <div className='flex flex-col items-center gap-8'>
          <LineChart series={lightContrastSeries} width={280} height={120} />
          <span className='body-3 text-muted'>original</span>
        </div>
        <div className='flex flex-col items-center gap-8'>
          <LineChart
            series={lightContrastSeries}
            enableColorContrast
            width={280}
            height={120}
          />
          <span className='body-3 text-muted'>contrast-safe</span>
        </div>
      </div>
      <div className='flex items-end gap-32'>
        <div className='flex flex-col items-center gap-8'>
          <LineChart series={darkContrastSeries} width={280} height={120} />
          <span className='body-3 text-muted'>original</span>
        </div>
        <div className='flex flex-col items-center gap-8'>
          <LineChart
            series={darkContrastSeries}
            enableColorContrast
            width={280}
            height={120}
          />
          <span className='body-3 text-muted'>contrast-safe</span>
        </div>
      </div>
    </div>
  ),
};

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
