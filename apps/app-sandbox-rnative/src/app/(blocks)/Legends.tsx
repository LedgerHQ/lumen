import { Box, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import {
  DonutChart,
  Legend,
  type DonutSegment,
  type LegendItem,
} from '@ledgerhq/lumen-ui-rnative/visualization';
import type { ReactNode } from 'react';

export default function Legends() {
  const { theme } = useTheme();
  const cryptoItems = getCryptoItems(theme.colors.crypto);
  const cryptoSegments = getCryptoSegments(theme.colors.crypto);

  return (
    <Box
      lx={{
        flexDirection: 'column',
        gap: 's24',
        width: 'full',
        paddingHorizontal: 's16',
      }}
    >
      <Base items={cryptoItems} />
      <DefaultColors />
      <LongLabels items={cryptoItems} />
      <WithDonutChart segments={cryptoSegments} />
    </Box>
  );
}

const getCryptoItems = (crypto: Record<string, string>): LegendItem[] => [
  { id: 'bitcoin', label: 'Bitcoin', color: crypto.bitcoin },
  { id: 'ethereum', label: 'Ethereum', color: crypto.ethereum },
  { id: 'tether', label: 'Tether', color: crypto.tetherUsdt },
];

const getCryptoSegments = (crypto: Record<string, string>): DonutSegment[] => [
  { id: 'bitcoin', label: 'Bitcoin', value: 45, color: crypto.bitcoin },
  { id: 'ethereum', label: 'Ethereum', value: 30, color: crypto.ethereum },
  { id: 'tether', label: 'Tether', value: 25, color: crypto.tetherUsdt },
];

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Box lx={{ gap: 's16' }}>
    <Text
      style={{ fontSize: 10 }}
      lx={{ color: 'muted', textTransform: 'uppercase' }}
    >
      {title}
    </Text>
    <Box lx={{ padding: 's16' }}>{children}</Box>
  </Box>
);

const Base = ({ items }: { items: LegendItem[] }) => (
  <Section title='Base'>
    <Legend series={items} />
  </Section>
);

const DefaultColors = () => (
  <Section title='Default colors'>
    <Legend
      series={[
        { id: 'a', label: 'Segment A' },
        { id: 'b', label: 'Segment B' },
        { id: 'c', label: 'Segment C' },
      ]}
    />
  </Section>
);

const LongLabels = ({ items }: { items: LegendItem[] }) => (
  <Section title='Long labels'>
    <Legend
      lx={{ maxWidth: 's176' }}
      series={items.map((item, index) => ({
        ...item,
        label: index === 1 ? 'Wrapped Staked Ethereum Liquidity' : item.label,
      }))}
    />
  </Section>
);

const WithDonutChart = ({ segments }: { segments: DonutSegment[] }) => (
  <Section title='With DonutChart'>
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's24' }}>
      <DonutChart series={segments} />
      <Legend series={segments} lx={{ maxWidth: 's176', flexShrink: 1 }} />
    </Box>
  </Section>
);
