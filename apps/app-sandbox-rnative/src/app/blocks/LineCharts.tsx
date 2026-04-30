import { Box, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { LineChart, Point } from '@ledgerhq/lumen-ui-rnative-visualization';

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

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const { theme } = useTheme();
  return (
    <Box lx={{ gap: 's8' }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: theme.colors.text.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
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

const PointMinMax = () => {
  const data = sampleSeries[0].data;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const minIdx = data.indexOf(min);
  const maxIdx = data.indexOf(max);

  return (
    <LineChart series={sampleSeries} width={320} height={200} showArea>
      <Point dataX={maxIdx} dataY={max} color='#47883A' label={`$${max}`} />
      <Point
        dataX={minIdx}
        dataY={min}
        color='#C24244'
        label={`$${min}`}
        labelPosition='bottom'
      />
    </LineChart>
  );
};

const months = [
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

const PointLabelFunction = () => (
  <LineChart series={sampleSeries} width={320} height={200}>
    <Point
      dataX={4}
      dataY={98}
      color='#47883A'
      label={(i) => `${months[i]}: $${sampleSeries[0].data[i]}`}
    />
    <Point
      dataX={9}
      dataY={4}
      color='#C24244'
      label={(i) => `${months[i]}: $${sampleSeries[0].data[i]}`}
      labelPosition='bottom'
    />
  </LineChart>
);

export const LineCharts = () => {
  return (
    <Box lx={{ flexDirection: 'column', gap: 's16', width: 'full' }}>
      <Section title='Basic line'>
        <LineChart series={sampleSeries} width={320} height={160} />
      </Section>

      <Section title='With area fill'>
        <LineChart series={sampleSeries} width={320} height={160} showArea />
      </Section>

      <Section title='With X axis'>
        <LineChart
          series={sampleSeries}
          width={320}
          height={200}
          showXAxis
          xAxis={{
            gridLineStyle: 'solid',
            showLine: true,
            showGrid: true,
          }}
        />
      </Section>

      <Section title='With both axes'>
        <LineChart
          series={sampleSeries}
          width={320}
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

      <Section title='With string labels'>
        <LineChart
          series={sampleSeries}
          width={320}
          height={200}
          showXAxis
          xAxis={{
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
          }}
        />
      </Section>

      <Section title='Multiple series'>
        <LineChart
          series={multiSeries}
          width={320}
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

      <Section title='Multiple series with area'>
        <LineChart
          series={multiSeries}
          width={320}
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

      <Section title='Custom domain (0–100)'>
        <LineChart
          series={sampleSeries}
          width={320}
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

      <Section title='Point – min/max highlights'>
        <PointMinMax />
      </Section>

      <Section title='Point – all data points'>
        <LineChart series={sampleSeries} width={320} height={200} showArea>
          {sampleSeries[0].data.map((value, i) => (
            <Point key={i} dataX={i} dataY={value} size={8} />
          ))}
        </LineChart>
      </Section>

      <Section title='Point – label function'>
        <PointLabelFunction />
      </Section>

      <Section title='Point – hidden point (label only)'>
        <LineChart series={sampleSeries} width={320} height={200} showArea>
          <Point dataX={4} dataY={98} hidePoint label='Peak' />
          <Point
            dataX={9}
            dataY={4}
            hidePoint
            label='Low'
            labelPosition='bottom'
          />
        </LineChart>
      </Section>

      <Section title='Point – with axes'>
        <LineChart
          series={sampleSeries}
          width={320}
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
          <Point dataX={4} dataY={98} color='#47883A' label='$98' />
          <Point
            dataX={9}
            dataY={4}
            color='#C24244'
            label='$4'
            labelPosition='bottom'
          />
        </LineChart>
      </Section>
    </Box>
  );
};
