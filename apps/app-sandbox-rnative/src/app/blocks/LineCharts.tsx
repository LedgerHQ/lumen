import { Box, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import {
  LineChart,
  Point,
  Scrubber,
} from '@ledgerhq/lumen-ui-rnative-visualization';
import { useEffect, useState } from 'react';

export const LineCharts = () => (
  <Box lx={{ flexDirection: 'column', gap: 's24', width: 'full' }}>
    <BasicLine />
    <WithAreaFill />
    <WithXAxis />
    <WithBothAxes />
    <WithStringLabels />
    <MultipleSeries />
    <MultipleSeriesWithArea />
    <CustomDomain />
    <PointMinMax />
    <PointAllDataPoints />
    <PointLabelFunction />
    <PointHiddenPoint />
    <PointWithAxes />
    <ScrubberBasic />
    <ScrubberWithLabel />
    <ScrubberMultiSeriesWithBeacons />
    <ScrubberWithAxes />
    <RandomAutoUpdate />
  </Box>
);

const sampleSeries = [
  {
    id: 'prices',
    stroke: '#7B61FF',
    data: [10, 45, 98, 45, 22, 52, 21, 20, 37],
  },
];

const multiSeries = [
  {
    id: 'lineA',
    label: 'Line A',
    stroke: '#7B61FF',
    data: [24, 13, 98, 39, 48, 38, 43],
  },
  {
    id: 'lineB',
    label: 'Line B',
    stroke: '#44D7B6',
    data: [40, 30, 20, 27, 18, 23, 34],
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { theme } = useTheme();
  return (
    <Box lx={{ gap: 's16' }}>
      <Text
        style={{
          fontSize: 10,
          color: theme.colors.text.muted,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      <Box
        lx={{
          padding: 's16',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const BasicLine = () => (
  <Section title='Basic line'>
    <LineChart series={sampleSeries} width={400} height={200} />
  </Section>
);

const WithAreaFill = () => (
  <Section title='With area fill'>
    <LineChart series={sampleSeries} width={400} height={200} showArea />
  </Section>
);

const WithXAxis = () => (
  <Section title='With X axis'>
    <LineChart
      series={sampleSeries}
      width={400}
      height={200}
      showXAxis
      xAxis={{
        gridLineStyle: 'solid',
        showLine: true,
        showGrid: true,
      }}
    />
  </Section>
);

const WithBothAxes = () => (
  <Section title='With both axes'>
    <LineChart
      series={sampleSeries}
      width={400}
      height={200}
      showXAxis
      showYAxis
      xAxis={{
        showLine: true,
        showGrid: true,
      }}
      yAxis={{
        showLine: true,
        showGrid: true,
        tickLabelFormatter: (value) => `$${value}`,
      }}
    />
  </Section>
);

const WithStringLabels = () => (
  <Section title='With string labels'>
    <LineChart
      series={sampleSeries}
      width={400}
      height={200}
      showXAxis
      xAxis={{
        data: months,
        showLine: true,
      }}
    />
  </Section>
);

const MultipleSeries = () => (
  <Section title='Multiple series'>
    <LineChart
      series={multiSeries}
      width={400}
      height={200}
      showXAxis
      showYAxis
      xAxis={{
        showLine: true,
        showGrid: true,
      }}
      yAxis={{
        showLine: true,
        domain: { min: 0, max: 100 },
      }}
    />
  </Section>
);

const MultipleSeriesWithArea = () => (
  <Section title='Multiple series with area'>
    <LineChart
      series={multiSeries}
      width={400}
      height={200}
      showArea
      showXAxis
      showYAxis
      xAxis={{
        showLine: true,
      }}
      yAxis={{
        showLine: true,
        domain: { min: 0, max: 100 },
      }}
    />
  </Section>
);

const CustomDomain = () => (
  <Section title='Custom domain (0–1)'>
    <LineChart
      series={sampleSeries}
      width={400}
      height={200}
      showXAxis
      showYAxis
      xAxis={{
        showLine: true,
        showGrid: true,
      }}
      yAxis={{
        showLine: true,
        showGrid: true,
        domain: { min: 0, max: 100 },
      }}
    />
  </Section>
);

const PointMinMax = () => {
  const data = sampleSeries[0].data;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const minIdx = data.indexOf(min);
  const maxIdx = data.indexOf(max);

  return (
    <Section title='Point – min/max highlights'>
      <LineChart series={sampleSeries} width={400} height={200} showArea>
        <Point dataX={maxIdx} dataY={max} color='#47883A' label={`$${max}`} />
        <Point
          dataX={minIdx}
          dataY={min}
          color='#C24244'
          label={`$${min}`}
          labelPosition='bottom'
        />
      </LineChart>
    </Section>
  );
};

const PointAllDataPoints = () => (
  <Section title='Point – all data points'>
    <LineChart series={sampleSeries} width={400} height={200} showArea>
      {sampleSeries[0].data.map((value, i) => (
        <Point key={i} dataX={i} dataY={value} size={8} />
      ))}
    </LineChart>
  </Section>
);

const PointLabelFunction = () => (
  <Section title='Point – label function'>
    <LineChart series={sampleSeries} width={400} height={200}>
      <Point
        dataX={2}
        dataY={98}
        color='#47883A'
        label={(i) => `${months[i]}: $${sampleSeries[0].data[i]}`}
      />
      <Point
        dataX={7}
        dataY={20}
        color='#C24244'
        label={(i) => `${months[i]}: $${sampleSeries[0].data[i]}`}
        labelPosition='bottom'
      />
    </LineChart>
  </Section>
);

const PointHiddenPoint = () => (
  <Section title='Point – hidden point (label only)'>
    <LineChart series={sampleSeries} width={400} height={200} showArea>
      <Point dataX={2} dataY={98} hidePoint label='Peak' />
      <Point
        dataX={0}
        dataY={10}
        hidePoint
        label='Low'
        labelPosition='bottom'
      />
    </LineChart>
  </Section>
);

const PointWithAxes = () => (
  <Section title='Point – with axes'>
    <LineChart
      series={sampleSeries}
      width={400}
      height={220}
      showArea
      showXAxis
      showYAxis
      xAxis={{ showLine: true, showGrid: true }}
      yAxis={{
        showLine: true,
        showGrid: true,
        tickLabelFormatter: (v) => `$${v}`,
      }}
    >
      <Point dataX={2} dataY={98} color='#47883A' label='$98' />
      <Point
        dataX={0}
        dataY={10}
        color='#C24244'
        label='$10'
        labelPosition='bottom'
      />
    </LineChart>
  </Section>
);

const ScrubberBasic = () => (
  <Section title='Scrubber – basic'>
    <LineChart
      series={sampleSeries}
      width={400}
      height={200}
      showArea
      enableScrubbing
      showYAxis
      yAxis={{
        domain: (bounds) => ({
          min: bounds.min - 10,
          max: bounds.max * 1.2,
        }),
      }}
    >
      <Scrubber />
    </LineChart>
  </Section>
);

const ScrubberWithLabel = () => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const displayIndex = activeIndex ?? sampleSeries[0].data.length - 1;

  return (
    <Section title='Scrubber – with label'>
      <Box lx={{ gap: 's24' }}>
        <Text
          style={{
            fontSize: 16,
            color: theme.colors.text.base,
          }}
        >
          {months[displayIndex]} — ${sampleSeries[0].data[displayIndex]}
        </Text>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          showArea
          enableScrubbing
          onScrubberPositionChange={setActiveIndex}
        >
          <Scrubber label={(i) => months[i] ?? ''} />
        </LineChart>
      </Box>
    </Section>
  );
};

const ScrubberMultiSeriesWithBeacons = () => (
  <Section title='Scrubber – multi-series with beacons'>
    <LineChart
      series={multiSeries}
      width={400}
      height={200}
      enableScrubbing
      showYAxis
      yAxis={{
        domain: (bounds) => ({
          min: bounds.min - 10,
          max: bounds.max,
        }),
        position: 'end',
        showGrid: true,
        tickLabelFormatter: (v) => `$${v}`,
      }}
    >
      <Scrubber showBeacons />
    </LineChart>
  </Section>
);

const ScrubberWithAxes = () => (
  <Section title='Scrubber – with axes'>
    <LineChart
      series={sampleSeries}
      width={400}
      height={220}
      showArea
      showYAxis
      enableScrubbing
      yAxis={{
        domain: (bounds) => ({
          min: bounds.min - 10,
          max: bounds.max,
        }),
        showGrid: true,
        tickLabelFormatter: (v) => `$${v}`,
      }}
    >
      <Scrubber />
    </LineChart>
  </Section>
);

const RANDOM_SERIES_LENGTH = 14;

const generateRandomSeries = (): number[] =>
  Array.from({ length: RANDOM_SERIES_LENGTH }, () =>
    Math.round(Math.random() * 90 + 5),
  );

const RandomAutoUpdate = () => {
  const [series, setSeries] = useState(() => [
    { id: 'random', stroke: '#7B61FF', data: generateRandomSeries() },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setSeries([
        { id: 'random', stroke: '#7B61FF', data: generateRandomSeries() },
      ]);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <Section title='Random series (auto-updates every 3s)'>
      <LineChart
        series={series}
        width={400}
        height={200}
        showArea
        showYAxis
        yAxis={{
          showGrid: true,
          domain: { min: 0, max: 100 },
          tickLabelFormatter: (v) => `$${v}`,
        }}
      />
    </Section>
  );
};
