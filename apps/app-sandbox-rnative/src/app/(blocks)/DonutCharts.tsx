import { Box, InteractiveIcon, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols';
import {
  DonutChart,
  DonutChartCenter,
  DonutChartDescription,
  DonutChartTitle,
  type DonutSegment,
} from '@ledgerhq/lumen-ui-rnative-visualization';
import { type ReactNode, useState } from 'react';
import { Pressable } from 'react-native';

export default function DonutCharts() {
  const { theme } = useTheme();
  const cryptoSegments = getCryptoSegments(theme.colors.crypto);
  const segmentPalette = getSegmentPalette(theme.colors.crypto);

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
      <WithCenter segments={cryptoSegments} />
      <WithCenterSmall segments={cryptoSegments} />
      <WithCenterClickable segments={cryptoSegments} />
      <Basic segments={cryptoSegments} />
      <Sizes segments={cryptoSegments} />
      <DefaultColors />
      <SegmentCounts palette={segmentPalette} />
      <TwoEqualHalves palette={segmentPalette} />
      <SingleSegment palette={segmentPalette} />
      <DominantSegment palette={segmentPalette} />
      <NoData />
      <Controlled segments={cryptoSegments} />
    </Box>
  );
}

const getCryptoSegments = (crypto: Record<string, string>): DonutSegment[] => [
  { id: 'bitcoin', label: 'Bitcoin', value: 45, color: crypto.bitcoin },
  { id: 'ethereum', label: 'Ethereum', value: 30, color: crypto.ethereum },
  { id: 'tether', label: 'Tether', value: 25, color: crypto.tetherUsdt },
];

const getSegmentPalette = (crypto: Record<string, string>): string[] => [
  crypto.bitcoin,
  crypto.ethereum,
  crypto.tetherUsdt,
  crypto.binance,
  crypto.sol,
  crypto.tron,
  crypto.usdc,
];

const buildSegments = (count: number, palette: string[]): DonutSegment[] =>
  Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    return {
      id: `segment-${n}`,
      label: `Segment ${n}`,
      value: 1,
      color: palette[index],
    };
  });

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

const WithCenter = ({ segments }: { segments: DonutSegment[] }) => (
  <Section title='With center (tap segment to crossfade)'>
    <DonutChart
      series={segments}
      defaultActiveId={null}
      renderCenter={({ series }) => (
        <DonutChartCenter>
          <DonutChartTitle>{series.length}</DonutChartTitle>
        </DonutChartCenter>
      )}
      renderCenterActive={({ activeSegment }) => (
        <DonutChartCenter>
          <DonutChartTitle size='sm'>{activeSegment.percent}%</DonutChartTitle>
          <DonutChartDescription>
            <Text
              typography='body3'
              lx={{ color: 'muted' }}
              style={{ flexShrink: 1, minWidth: 0 }}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {activeSegment.label}
            </Text>
            <InteractiveIcon
              iconType='stroked'
              icon={ChevronRight}
              size={16}
              accessibilityLabel={`View ${activeSegment.label} details`}
            />
          </DonutChartDescription>
        </DonutChartCenter>
      )}
    />
  </Section>
);

const WithCenterSmall = ({ segments }: { segments: DonutSegment[] }) => (
  <Section title='With center (sm ring)'>
    <DonutChart
      series={segments}
      size='sm'
      defaultActiveId='bitcoin'
      renderCenter={({ series }) => (
        <DonutChartCenter>
          <DonutChartTitle>{series.length}</DonutChartTitle>
        </DonutChartCenter>
      )}
      renderCenterActive={({ activeSegment }) => (
        <DonutChartCenter>
          <DonutChartTitle size='sm'>{activeSegment.percent}%</DonutChartTitle>
          <DonutChartDescription>{activeSegment.label}</DonutChartDescription>
        </DonutChartCenter>
      )}
    />
  </Section>
);

const WithCenterClickable = ({ segments }: { segments: DonutSegment[] }) => {
  const [lastClick, setLastClick] = useState<string | null>(null);

  return (
    <Section title='With clickable center'>
      <Box lx={{ gap: 's8', alignItems: 'center' }}>
        <DonutChart
          series={segments}
          defaultActiveId={null}
          renderCenter={({ series }) => (
            <DonutChartCenter>
              <DonutChartTitle>{series.length}</DonutChartTitle>
            </DonutChartCenter>
          )}
          renderCenterActive={({ activeSegment }) => (
            <Pressable
              accessibilityRole='button'
              accessibilityLabel={`View ${activeSegment.label} details`}
              onPress={() => setLastClick(activeSegment.label)}
            >
              <DonutChartCenter>
                <DonutChartTitle size='sm'>
                  {activeSegment.percent}%
                </DonutChartTitle>
                <DonutChartDescription>
                  <Text
                    typography='body3'
                    lx={{ color: 'muted' }}
                    style={{ flexShrink: 1, minWidth: 0 }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {activeSegment.label}
                  </Text>
                  <ChevronRight size={16} color='muted' />
                </DonutChartDescription>
              </DonutChartCenter>
            </Pressable>
          )}
        />
        {lastClick != null && (
          <Text typography='body3' lx={{ color: 'muted' }}>
            Clicked: {lastClick}
          </Text>
        )}
      </Box>
    </Section>
  );
};

const Basic = ({ segments }: { segments: DonutSegment[] }) => (
  <Section title='Basic donut'>
    <DonutChart series={segments} />
  </Section>
);

const Sizes = ({ segments }: { segments: DonutSegment[] }) => (
  <Section title='Sizes'>
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's32' }}>
      <DonutChart series={segments} size='md' />
      <DonutChart series={segments} size='sm' />
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

const SegmentCounts = ({ palette }: { palette: string[] }) => (
  <Section title='Segment counts'>
    <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's16' }}>
      {[1, 2, 3, 4, 5, 6, 7].map((count) => (
        <DonutChart
          key={count}
          series={buildSegments(count, palette)}
          size='sm'
        />
      ))}
    </Box>
  </Section>
);

const TwoEqualHalves = ({ palette }: { palette: string[] }) => (
  <Section title='Two equal halves (rounded corners on both)'>
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's32' }}>
      <DonutChart
        series={[
          { id: 'a', label: 'A', value: 1, color: palette[0] },
          { id: 'b', label: 'B', value: 1, color: palette[1] },
        ]}
        size='md'
      />
      <DonutChart
        series={[
          { id: 'a', label: 'A', value: 1, color: palette[0] },
          { id: 'b', label: 'B', value: 1, color: palette[1] },
        ]}
        size='sm'
      />
    </Box>
  </Section>
);

const SingleSegment = ({ palette }: { palette: string[] }) => (
  <Section title='Single segment (full ring)'>
    <DonutChart
      series={[{ id: 'a', label: 'A', value: 100, color: palette[2] }]}
    />
  </Section>
);

const DominantSegment = ({ palette }: { palette: string[] }) => (
  <Section title='Dominant segment'>
    <DonutChart
      series={[
        { id: 'a', label: 'A', value: 92, color: palette[0] },
        { id: 'b', label: 'B', value: 5, color: palette[1] },
        { id: 'c', label: 'C', value: 3, color: palette[2] },
      ]}
    />
  </Section>
);

const NoData = () => (
  <Section title='No data (empty ring)'>
    <DonutChart series={[]} />
  </Section>
);

const Controlled = ({ segments }: { segments: DonutSegment[] }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <Section title='Controlled (tap to select, tap again to deselect)'>
      <DonutChart
        series={segments}
        activeId={activeId}
        onActiveIdChange={setActiveId}
      />
    </Section>
  );
};
