import {
  Box,
  SegmentedControl,
  SegmentedControlButton,
  Text,
} from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import {
  LineChart,
  Point,
  Scrubber,
} from '@ledgerhq/lumen-ui-rnative-visualization';
import { useCallback, useMemo, useState } from 'react';

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

const ScrubberWithLabel = () => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const displayIndex = activeIndex ?? sampleSeries[0].data.length - 1;

  return (
    <Box lx={{ gap: 's24' }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: theme.colors.text.base,
        }}
      >
        {months[displayIndex]} — ${sampleSeries[0].data[displayIndex]}
      </Text>
      <LineChart
        series={sampleSeries}
        width={320}
        height={200}
        showArea
        enableScrubbing
        onScrubberPositionChange={setActiveIndex}
      >
        <Scrubber label={(i) => months[i] ?? ''} />
      </LineChart>
    </Box>
  );
};

const RANGES = [
  { label: '1D', days: '1' },
  { label: '1W', days: '7' },
  { label: '1M', days: '30' },
  { label: '1Y', days: '365' },
  { label: 'All', days: 'max' },
] as const;

type RangeLabel = (typeof RANGES)[number]['label'];

type PriceEntry = { timestamp: number; price: number };

const generateFallbackData = (range: RangeLabel): PriceEntry[] => {
  const now = Date.now();
  const counts: Record<RangeLabel, number> = {
    '1D': 24,
    '1W': 7 * 4,
    '1M': 30,
    '1Y': 52,
    All: 120,
  };
  const spans: Record<RangeLabel, number> = {
    '1D': 24 * 60 * 60 * 1000,
    '1W': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
    '1Y': 365 * 24 * 60 * 60 * 1000,
    All: 5 * 365 * 24 * 60 * 60 * 1000,
  };
  const n = counts[range];
  const span = spans[range];
  const step = span / (n - 1);
  const base = 65_000;
  const amplitude = 30_000;
  const entries: PriceEntry[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const trend =
      Math.sin(t * Math.PI * 2.5) * 0.6 + Math.cos(t * Math.PI) * 0.4;
    const noise = (Math.sin(i * 17.3) * 0.5 + Math.sin(i * 7.1) * 0.3) * 0.15;
    entries.push({
      timestamp: now - span + step * i,
      price: base + amplitude * (trend + noise),
    });
  }
  return entries;
};

const FAKE_TRADES: Record<
  RangeLabel,
  { type: 'buy' | 'sell'; indexRatio: number }[]
> = {
  '1D': [
    { type: 'buy', indexRatio: 0.15 },
    { type: 'sell', indexRatio: 0.6 },
  ],
  '1W': [
    { type: 'buy', indexRatio: 0.1 },
    { type: 'sell', indexRatio: 0.45 },
    { type: 'buy', indexRatio: 0.75 },
  ],
  '1M': [
    { type: 'buy', indexRatio: 0.08 },
    { type: 'sell', indexRatio: 0.35 },
    { type: 'buy', indexRatio: 0.7 },
    { type: 'sell', indexRatio: 0.9 },
  ],
  '1Y': [
    { type: 'buy', indexRatio: 0.05 },
    { type: 'sell', indexRatio: 0.25 },
    { type: 'buy', indexRatio: 0.5 },
    { type: 'sell', indexRatio: 0.8 },
  ],
  All: [
    { type: 'buy', indexRatio: 0.02 },
    { type: 'sell', indexRatio: 0.2 },
    { type: 'buy', indexRatio: 0.45 },
    { type: 'sell', indexRatio: 0.65 },
    { type: 'buy', indexRatio: 0.85 },
  ],
};

const formatPrice = (value: number): string => {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
};

const formatDate = (timestamp: number, range: RangeLabel): string => {
  const date = new Date(timestamp);
  if (range === '1D') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (range === '1W' || range === '1M') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  });
};

const useBitcoinPrices = (range: RangeLabel): PriceEntry[] =>
  useMemo(() => generateFallbackData(range), [range]);

const BitcoinChart = () => {
  const [range, setRange] = useState<RangeLabel>('1M');
  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  const data = useBitcoinPrices(range);

  const prices = useMemo(() => data.map((d) => d.price), [data]);

  const series = useMemo(
    () => [{ id: 'btc', stroke: '#F7931A', data: prices }],
    [prices],
  );

  const { athIdx, lowIdx } = useMemo(() => {
    if (prices.length === 0) return { athIdx: -1, lowIdx: -1 };
    let ath = 0;
    let low = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[ath]) ath = i;
      if (prices[i] < prices[low]) low = i;
    }
    return { athIdx: ath, lowIdx: low };
  }, [prices]);

  const trades = useMemo(() => {
    if (prices.length === 0) return [];
    return FAKE_TRADES[range].map((t) => ({
      type: t.type,
      index: Math.min(
        Math.round(t.indexRatio * (prices.length - 1)),
        prices.length - 1,
      ),
    }));
  }, [prices, range]);

  const displayIndex = activeIndex ?? prices.length - 1;

  const handleRangeChange = useCallback((value: string) => {
    setRange(value as RangeLabel);
    setActiveIndex(undefined);
  }, []);

  const scrubberLabel = useCallback(
    (i: number) => {
      if (!data[i]) return '';
      return formatDate(data[i].timestamp, range);
    },
    [data, range],
  );

  return (
    <Box lx={{ gap: 's24', width: 'full' }}>
      <Box lx={{ gap: 's12' }}>
        <Text typography='body4' lx={{ color: 'muted' }}>
          Bitcoin (BTC)
        </Text>
        {prices.length > 0 && (
          <>
            <Text typography='heading2SemiBold' lx={{ color: 'white' }}>
              {`$${prices[displayIndex]?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </Text>
            <Text typography='body4' lx={{ color: 'muted' }}>
              {data[displayIndex]
                ? formatDate(data[displayIndex].timestamp, range)
                : ''}
            </Text>
          </>
        )}
      </Box>

      <LineChart
        series={series}
        height={220}
        inset={{ top: 24, bottom: 24, left: 0, right: 0 }}
        showArea
        enableScrubbing
        onScrubberPositionChange={setActiveIndex}
      >
        <Scrubber label={scrubberLabel} />

        <Point
          dataX={athIdx}
          dataY={prices[athIdx]}
          hidePoint
          label={`ATH ${formatPrice(prices[athIdx])}`}
        />
        <Point
          dataX={lowIdx}
          dataY={prices[lowIdx]}
          hidePoint
          label={`Low ${formatPrice(prices[lowIdx])}`}
          labelPosition='bottom'
        />

        {trades.map((trade, i) => (
          <Point
            key={`${trade.type}-${i}`}
            dataX={trade.index}
            dataY={prices[trade.index]}
            color={trade.type === 'buy' ? '#44D7B6' : '#FF6B6B'}
          />
        ))}
      </LineChart>

      <SegmentedControl
        selectedValue={range}
        onSelectedChange={handleRangeChange}
        tabLayout='fixed'
        accessibilityLabel='Time range'
      >
        {RANGES.map((r) => (
          <SegmentedControlButton key={r.label} value={r.label}>
            {r.label}
          </SegmentedControlButton>
        ))}
      </SegmentedControl>
    </Box>
  );
};

export const LineCharts = () => {
  return (
    <Box lx={{ flexDirection: 'column', gap: 's16', width: 'full' }}>
      <Section title='Bitcoin – full experience'>
        <BitcoinChart />
      </Section>

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

      <Section title='Scrubber – basic'>
        <LineChart
          series={sampleSeries}
          width={320}
          height={200}
          showArea
          enableScrubbing
        >
          <Scrubber />
        </LineChart>
      </Section>

      <Section title='Scrubber – with label'>
        <ScrubberWithLabel />
      </Section>

      <Section title='Scrubber – multi-series with beacons'>
        <LineChart
          series={multiSeries}
          width={320}
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

      <Section title='Scrubber – with axes'>
        <LineChart
          series={sampleSeries}
          width={320}
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
          <Scrubber label={(i) => `$${sampleSeries[0].data[i]}`} showBeacons />
        </LineChart>
      </Section>
    </Box>
  );
};
