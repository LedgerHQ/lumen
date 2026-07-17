import { Box, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import {
  DonutChart,
  type DonutSegment,
} from '@ledgerhq/lumen-ui-rnative-visualization';
import type { ReactNode } from 'react';

export default function DonutCharts() {
  return (
    <Box
      lx={{
        flexDirection: 'column',
        gap: 's24',
        width: 'full',
        paddingLeft: 's16',
        paddingRight: 's16',
      }}
    >
      <Basic />
      <Sizes />
      <DefaultColors />
      <SegmentCounts />
      <TwoEqualHalves />
      <SingleSegment />
      <DominantSegment />
      <NoData />
    </Box>
  );
}

const cryptoSegments: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 45, color: '#f7931a' },
  { id: 'ethereum', label: 'Ethereum', value: 30, color: '#454a75' },
  { id: 'tether', label: 'Tether', value: 25, color: '#00a478' },
];

const segmentPalette = [
  '#f7931a',
  '#454a75',
  '#00a478',
  '#f5bc00',
  '#9945ff',
  '#ff060a',
  '#2775ca',
];

const buildSegments = (count: number): DonutSegment[] =>
  Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    return {
      id: `segment-${n}`,
      label: `Segment ${n}`,
      value: 1,
      color: segmentPalette[index],
    };
  });

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
      <Box lx={{ padding: 's16' }}>{children}</Box>
    </Box>
  );
};

const Basic = () => (
  <Section title='Basic donut'>
    <DonutChart series={cryptoSegments} />
  </Section>
);

const Sizes = () => (
  <Section title='Sizes'>
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's32' }}>
      <DonutChart series={cryptoSegments} size='md' />
      <DonutChart series={cryptoSegments} size='sm' />
    </Box>
  </Section>
);

const DefaultColors = () => (
  <Section title='Default colors (neutral grey)'>
    <DonutChart
      series={[
        { id: 'a', label: 'A', value: 45 },
        { id: 'b', label: 'B', value: 30 },
        { id: 'c', label: 'C', value: 25 },
      ]}
    />
  </Section>
);

const SegmentCounts = () => (
  <Section title='Segment counts'>
    <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's16' }}>
      {[1, 2, 3, 4, 5, 6, 7].map((count) => (
        <DonutChart key={count} series={buildSegments(count)} size='sm' />
      ))}
    </Box>
  </Section>
);

const TwoEqualHalves = () => (
  <Section title='Two equal halves (rounded corners on both)'>
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's32' }}>
      <DonutChart
        series={[
          { id: 'a', label: 'A', value: 1, color: '#f7931a' },
          { id: 'b', label: 'B', value: 1, color: '#454a75' },
        ]}
        size='md'
      />
      <DonutChart
        series={[
          { id: 'a', label: 'A', value: 1, color: '#f7931a' },
          { id: 'b', label: 'B', value: 1, color: '#454a75' },
        ]}
        size='sm'
      />
    </Box>
  </Section>
);

const SingleSegment = () => (
  <Section title='Single segment (full ring)'>
    <DonutChart
      series={[{ id: 'a', label: 'A', value: 100, color: '#00a478' }]}
    />
  </Section>
);

const DominantSegment = () => (
  <Section title='Dominant segment'>
    <DonutChart
      series={[
        { id: 'a', label: 'A', value: 92, color: '#f7931a' },
        { id: 'b', label: 'B', value: 5, color: '#454a75' },
        { id: 'c', label: 'C', value: 3, color: '#00a478' },
      ]}
    />
  </Section>
);

const NoData = () => (
  <Section title='No data (empty ring)'>
    <DonutChart series={[]} />
  </Section>
);
