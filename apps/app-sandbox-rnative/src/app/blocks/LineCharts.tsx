import { Box, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { LineChart } from '@ledgerhq/lumen-ui-rnative-visualization';

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
    </Box>
  );
};
