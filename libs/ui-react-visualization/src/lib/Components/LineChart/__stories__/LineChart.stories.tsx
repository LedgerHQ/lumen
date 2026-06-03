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
    width: 728,
  },
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <div className='w-fit' style={{ padding: 16 }}>
          <Story />
        </div>
      </StoryDecorator>
    ),
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
  args: {
    series: sampleSeries,
    height: 250,
  },
};

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
      <div className='flex w-fit flex-col gap-24'>
        <ChartHeader
          value={activeValue}
          changePercent={changePercent}
          periodLabel={PERIODS[period].label}
          showMarkers={showMarkers}
          onToggleMarkers={() => setShowMarkers((value) => !value)}
        />

        <LineChart
          series={[{ id: 'price', stroke: lineColor, data }]}
          width={728}
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
