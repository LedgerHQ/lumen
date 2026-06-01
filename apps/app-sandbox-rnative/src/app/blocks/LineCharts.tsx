import { Box, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import {
  LineChart,
  Point,
  ReferenceLine,
  Scrubber,
} from '@ledgerhq/lumen-ui-rnative-visualization';
import type { ReactNode } from 'react';
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
    <ScrubberMultiSeriesWithBeacons />
    <ScrubberWithAxes />
    <ReferenceLineBasic />
    <RandomAutoUpdate />
    <MagnetizedPoint />
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
  children: ReactNode;
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

const ReferenceLineBasic = () => {
  return (
    <Section title='Reference line'>
      <LineChart series={sampleSeries} width={320} height={200}>
        <ReferenceLine
          dataY={98}
          labelDy={-4}
          label='Peak'
          labelPosition='end'
          labelVerticalAlignment='end'
        />
        <ReferenceLine
          dataY={4}
          labelDy={-4}
          label='Low'
          labelPosition='start'
          labelVerticalAlignment='start'
        />
      </LineChart>
    </Section>
  );
};

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

const magneticSeries = [
  {
    id: 'btc',
    stroke: '#7B61FF',
    data: [
      111560.36, 107216.67, 107831.36, 108861.81, 109377.72, 109068.46,
      107838.18, 105745.42, 104010.92, 104687.51, 105710.01, 105884.74,
      105434.48, 104812.92, 101650.74, 104409.75, 105681.45, 105692.25,
      110261.57, 110212.73, 108679.98, 105979.23, 106045.56, 105482.91,
      105554.49, 106951.27, 104683.42, 104722.7, 104690.65, 103290.11,
      101532.57, 100852.58, 105511.62, 105976.07, 107238.53, 106984.01,
      107078.92, 107331.59, 108396.62, 107132.8, 105613.4, 108824.44, 109602.2,
      108040.89, 108217.47, 109215.2, 108300.72, 108953.19, 111327.53,
      115879.65, 117571.03, 117418.96, 119117.56, 119833.67, 117678.19,
      118748.16, 119445.37, 117988.95, 117901.63, 117256.92, 117482.47,
      119955.8, 118629.06, 118354.44, 117540.81, 117959.54, 119418.91, 118003.3,
      117853.31, 117833.24, 115700.0, 113234.61, 112554.9, 114199.11, 115138.69,
      114128.35, 115022.1, 117463.47, 116688.37, 116510.08, 119266.93, 118773.8,
      120202.53, 123560.99, 118405.6, 117339.79, 117501.22, 117542.84,
      116256.41, 112778.34, 114252.4, 112414.4, 116834.25, 115359.98, 113399.55,
      110185.35, 111842.71, 111216.08, 112525.6, 108480.31, 108781.96,
      108253.36, 109162.69, 111190.18, 111711.52, 110724.74, 110662.18,
      110209.19, 111131.99, 112025.13, 111547.44, 113975.32, 115503.17,
      116160.14, 115970.58, 115373.56, 115397.25, 116762.85, 116455.95,
      117145.5, 115655.81, 115715.52, 115304.48, 112696.74, 112022.17,
      113320.57, 108963.53, 109710.21, 109654.81, 112142.57, 114309.15,
      114024.23, 118503.24, 120611.72, 122250.15, 122380.94, 123506.19,
      124773.51, 121518.76, 123352.5, 121698.03, 113201.74, 110853.12,
      115189.57, 115222.28, 113156.57, 110708.67, 108076.73, 106443.61,
      107156.0, 108621.13, 110608.57, 108486.1, 107618.43, 110048.52, 110997.8,
      111620.31, 114476.01, 114182.79, 112950.35, 110046.67, 108240.77,
      109573.91, 110014.14, 110650.21, 106521.09, 101635.27, 103877.96,
      101322.64, 103396.08, 102290.14, 104709.68, 105909.07, 102960.78,
      101521.71, 99730.45, 94456.39, 95508.31, 94411.33, 92036.73, 92819.76,
      91363.28, 86649.97, 85051.8, 84682.62, 86783.85, 88229.36, 87310.33,
      90474.23, 91279.06, 90950.38, 90841.45, 90406.28, 86281.5, 91344.73,
      93619.44, 92140.7, 89307.09, 89244.76, 90162.91, 90618.05, 92723.21,
      92005.14, 92494.18, 90307.26, 90257.43, 88230.77, 86413.92, 87821.89,
      86064.95, 85450.33, 88103.86, 88347.94, 88577.42, 88491.12, 87406.44,
      87642.61, 87229.78, 87305.96, 87807.0, 87822.91, 87156.56, 88414.63,
      87520.18, 88727.67, 89926.28, 90593.85, 91373.22, 93926.8, 93666.86,
      91257.16, 90983.52, 90504.9, 90442.02, 90819.37, 91134.97, 95260.44,
      97007.78, 95584.83, 95516.08, 95099.53, 93752.71, 92558.46, 88312.84,
      89354.34, 89443.4, 89412.4, 89170.87, 86548.32, 88307.86, 89204.22,
      89162.1, 84570.41, 84141.78, 78725.86, 76937.06, 78767.66, 75638.96,
      73172.29, 62853.69, 70523.95, 69296.81, 70542.37, 70096.41, 68779.91,
      66937.58, 66184.58, 68838.87, 69765.6, 68716.58, 68907.78, 67489.46,
      66456.35, 66918.68, 67970.29, 67977.91, 67585.12, 64577.55, 64074.11,
      67947.39, 67469.06, 65883.99, 67008.45, 65713.5, 68864.04, 68321.62,
      72669.77, 70874.99, 68148.28, 67271.19, 66036.16, 68459.32, 69883.01,
      70226.82, 70544.43, 70965.28, 71217.1, 72681.91, 74858.15, 73926.28,
      71255.86, 69871.45, 70552.63, 68733.55, 67848.88, 70892.83, 70524.51,
      71309.26, 68791.11, 66321.02, 66321.07, 65970.43, 66699.27, 68231.83,
      68089.06, 66891.66, 66939.69, 67304.25, 68985.53, 68864.23, 71975.62,
      71117.08, 71770.75, 72972.71, 73053.89, 70756.75, 74514.63, 74181.11,
      74833.51, 75149.19, 77128.44, 75728.46, 73856.06, 75874.55, 76350.25,
      78194.78, 78260.62, 77444.8, 77619.14, 78645.13, 77361.3, 76345.23,
      75774.89, 76286.58, 78172.07, 78655.35, 78562.55, 79823.89, 80925.09,
      81425.0, 80022.04, 80189.07, 80678.03, 82145.66, 81725.21, 80480.89,
      79277.8, 81051.98, 79068.82, 78135.01, 77425.72, 76952.21, 76808.81,
      77459.94, 77546.34, 76739.28,
    ],
  },
];

const MagnetizedPoint = () => (
  <Section title='Magnetized point'>
    <LineChart
      series={magneticSeries}
      width={400}
      height={200}
      enableScrubbing
      showArea
    >
      <Scrubber />
      <Point
        dataX={137}
        dataY={124773.51}
        color='#47883A'
        label='ATH $125K'
        magnetic
      />
      <Point
        dataX={259}
        dataY={62853.69}
        color='#C24244'
        label='$63K'
        magnetic
        labelPosition='bottom'
      />
      <Point
        dataX={83}
        dataY={123560.99}
        color='#47883A'
        label='$124K'
        magnetic
      />
      <Point
        dataX={181}
        dataY={99730.45}
        color='#C24244'
        label='$100K'
        magnetic
        labelPosition='bottom'
      />
      <Point
        dataX={0}
        dataY={111560.36}
        color='#7B61FF'
        label='Start $112K'
        magnetic
      />
      <Point
        dataX={365}
        dataY={76739.28}
        color='#C24244'
        label='Now $77K'
        magnetic
        labelPosition='bottom'
      />
    </LineChart>
  </Section>
);
