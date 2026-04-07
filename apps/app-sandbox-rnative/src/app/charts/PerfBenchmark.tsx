import { Box, Button, Text } from '@ledgerhq/lumen-ui-rnative';
import {
  Profiler,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ProfilerOnRenderCallback,
} from 'react';
import { View } from 'react-native';
import { LineChartD3RNative } from './LineChart-D3-RNative';
import { LineChartVictoryNativeXL } from './LineChart-VictoryNativeXL';
import type { DataPoint, LineChartProps, LineConfig } from './types';

type RNLibKey = 'd3' | 'victoryNativeXL';

const LIB_LABELS: Record<RNLibKey, string> = {
  d3: 'D3 (SVG)',
  victoryNativeXL: 'Victory Native XL',
};

const CHART_MAP: Record<RNLibKey, ComponentType<LineChartProps>> = {
  d3: LineChartD3RNative,
  victoryNativeXL: LineChartVictoryNativeXL,
};

const ITERATIONS = 5;
const DATA_POINTS_LIGHT = 90;
const DATA_POINTS_HEAVY = 2000;
const CHART_WIDTH = 320;
const CHART_HEIGHT = 200;
const DAY_MS = 86_400_000;

type BenchmarkPreset = 'light' | 'heavy';

type BenchmarkResult = {
  mountMs: number;
  dataChangeMs: number;
};

type LibBenchmarkResults = {
  light?: BenchmarkResult;
  heavy?: BenchmarkResult;
};

type AllResults = Partial<Record<RNLibKey, LibBenchmarkResults>>;

type BenchmarkTask = { lib: RNLibKey; preset: BenchmarkPreset };

const seededRandom = (seed: number): (() => number) => {
  let s = seed;
  return (): number => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const generatePriceSeries = (
  basePrice: number,
  volatility: number,
  days: number,
  intervalMs: number,
  seed: number,
): DataPoint[] => {
  const rand = seededRandom(seed);
  const points: DataPoint[] = [];
  const now = Date.now();
  const start = now - days * DAY_MS;
  const steps = Math.floor((days * DAY_MS) / intervalMs);
  let price = basePrice;

  for (let i = 0; i <= steps; i++) {
    const timestamp = start + i * intervalMs;
    const drift = 0.0001;
    const shock = volatility * (rand() - 0.5) * 2;
    price = price * (1 + drift + shock);
    price = Math.max(price * 0.1, price);
    points.push({ timestamp, value: Math.round(price * 100) / 100 });
  }

  return points;
};

const generateLineConfig = (
  seed: number,
  dataPointCount: number,
): LineConfig[] => {
  return [
    {
      id: 'bench',
      data: generatePriceSeries(62_000, 0.025, dataPointCount, DAY_MS, seed),
      color: '#E87A2C',
      width: 2,
      showGradient: false,
    },
  ];
};

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const delay = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

const avg = (arr: number[]): number =>
  arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const BenchmarkHarness = ({
  lib,
  dataPointCount,
  onComplete,
}: {
  lib: RNLibKey;
  dataPointCount: number;
  onComplete: (result: BenchmarkResult) => void;
}) => {
  const Chart = CHART_MAP[lib];
  const mountTimesRef = useRef<number[]>([]);
  const phaseRef = useRef<'mount' | 'data-change' | 'done'>('mount');
  const [lines, setLines] = useState(() =>
    generateLineConfig(1, dataPointCount),
  );
  const [iteration, setIteration] = useState(0);
  const [mounted, setMounted] = useState(false);
  const hasStarted = useRef(false);

  const onRender: ProfilerOnRenderCallback = useCallback(
    (_id, phase, actualDuration) => {
      if (phaseRef.current === 'mount' && phase === 'mount') {
        mountTimesRef.current.push(actualDuration);
      }
    },
    [],
  );

  const runBenchmark = useCallback(async () => {
    await delay(150);

    for (let i = 1; i < ITERATIONS; i++) {
      phaseRef.current = 'mount';
      setMounted(false);
      await delay(32);
      setLines(generateLineConfig(i + 1, dataPointCount));
      setMounted(true);
      await delay(80);
    }

    await delay(80);

    phaseRef.current = 'data-change';
    const dcTimes: number[] = [];
    for (let i = 0; i < ITERATIONS; i++) {
      const start = performance.now();
      setLines(generateLineConfig(100 + i, dataPointCount));
      await delay(0);
      dcTimes.push(performance.now() - start);
      await delay(32);
    }

    phaseRef.current = 'done';

    onComplete({
      mountMs: Math.round(avg(mountTimesRef.current) * 100) / 100,
      dataChangeMs: Math.round(avg(dcTimes) * 100) / 100,
    });
  }, [dataPointCount, onComplete]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    setMounted(true);
    setIteration(1);
    setTimeout(runBenchmark, 300);
  }, [runBenchmark]);

  const chartProps: LineChartProps = {
    lines,
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    xAxis: { show: false, showGrid: false },
    yAxis: { show: false, showGrid: false },
    showTooltip: false,
    enableScrubbing: false,
    showCursor: false,
    formatXLabel: formatDate,
    formatYLabel: formatCurrency,
  };

  return (
    <View style={{ opacity: 0, position: 'absolute', left: -9999 }}>
      {mounted && (
        <Profiler id={`bench-${lib}-${iteration}`} onRender={onRender}>
          <Chart {...chartProps} />
        </Profiler>
      )}
    </View>
  );
};

const buildTaskQueue = (): BenchmarkTask[] => {
  const libs: RNLibKey[] = ['d3', 'victoryNativeXL'];
  const q: BenchmarkTask[] = [];
  for (const lib of libs) {
    q.push({ lib, preset: 'light' });
    q.push({ lib, preset: 'heavy' });
  }
  return q;
};

const formatVal = (v: number | null | undefined, unit: string): string =>
  v != null && Number.isFinite(v) ? `${v.toFixed(2)} ${unit}` : '—';

export const PerfBenchmark = () => {
  const [results, setResults] = useState<AllResults>({});
  const [running, setRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<BenchmarkTask | null>(null);
  const queueRef = useRef<BenchmarkTask[]>([]);

  const handleComplete = useCallback(
    (lib: RNLibKey, preset: BenchmarkPreset, result: BenchmarkResult) => {
      setResults((prev) => ({
        ...prev,
        [lib]: {
          ...prev[lib],
          [preset]: result,
        },
      }));

      const next = queueRef.current.shift();
      if (next) {
        setCurrentTask(next);
      } else {
        setCurrentTask(null);
        setRunning(false);
      }
    },
    [],
  );

  const startBenchmark = useCallback(() => {
    setResults({});
    setRunning(true);
    queueRef.current = buildTaskQueue();
    const first = queueRef.current.shift();
    setCurrentTask(first ?? null);
    if (!first) setRunning(false);
  }, []);

  const libs: RNLibKey[] = ['d3', 'victoryNativeXL'];

  const statusLabel = currentTask
    ? `${LIB_LABELS[currentTask.lib]} (${currentTask.preset})`
    : '';

  return (
    <Box lx={{ gap: 's12' }}>
      <Text typography='body2SemiBold'>Performance Benchmark</Text>

      <Text typography='body4' lx={{ color: 'muted' }}>
        Each library runs twice: light ({DATA_POINTS_LIGHT} pts) and heavy (
        {DATA_POINTS_HEAVY} pts). {ITERATIONS} iterations per metric; charts
        rendered offscreen at {CHART_WIDTH}x{CHART_HEIGHT}.
      </Text>

      <Button
        appearance='accent'
        size='sm'
        onPress={startBenchmark}
        disabled={running}
        loading={running}
      >
        {running ? `Running ${statusLabel}…` : 'Run Benchmark'}
      </Button>

      <Box lx={{ gap: 's8' }}>
        <HeaderRow libs={libs} />
        <MetricRow
          label='Initial mount'
          description={`Avg time to mount the chart component from scratch (${ITERATIONS} iterations).`}
          unit='ms'
          libs={libs}
          results={results}
          getValue={(r) => r.mountMs}
          running={running}
          currentTask={currentTask}
        />
        <MetricRow
          label='Data swap'
          description={`Avg time to replace the entire dataset and re-render (${ITERATIONS} iterations).`}
          unit='ms'
          libs={libs}
          results={results}
          getValue={(r) => r.dataChangeMs}
          running={running}
          currentTask={currentTask}
        />
      </Box>

      {currentTask && (
        <BenchmarkHarness
          key={`${currentTask.lib}-${currentTask.preset}`}
          lib={currentTask.lib}
          dataPointCount={
            currentTask.preset === 'light'
              ? DATA_POINTS_LIGHT
              : DATA_POINTS_HEAVY
          }
          onComplete={(result) =>
            handleComplete(currentTask.lib, currentTask.preset, result)
          }
        />
      )}
    </Box>
  );
};

const HeaderRow = ({ libs }: { libs: RNLibKey[] }) => (
  <Box
    lx={{
      flexDirection: 'row',
      gap: 's8',
      paddingVertical: 's4',
    }}
  >
    <Box lx={{ width: 's96' }}>
      <Text typography='body4SemiBold'>Metric</Text>
    </Box>
    {libs.map((lib) => (
      <Box key={lib} lx={{ flex: 1 }}>
        <Text typography='body4SemiBold'>{LIB_LABELS[lib]}</Text>
      </Box>
    ))}
  </Box>
);

const MetricRow = ({
  label,
  description,
  unit,
  libs,
  results,
  getValue,
  running,
  currentTask,
}: {
  label: string;
  description: string;
  unit: string;
  libs: RNLibKey[];
  results: AllResults;
  getValue: (r: BenchmarkResult) => number | null;
  running: boolean;
  currentTask: BenchmarkTask | null;
}) => {
  const pairs = libs.map((lib) => {
    const lr = results[lib];
    const light = lr?.light ? getValue(lr.light) : null;
    const heavy = lr?.heavy ? getValue(lr.heavy) : null;
    return { light, heavy };
  });

  const numericVals = (v: number | null): v is number =>
    v != null && Number.isFinite(v);

  const lightVals = pairs.map((p) => p.light).filter(numericVals);
  const heavyVals = pairs.map((p) => p.heavy).filter(numericVals);

  const bestLight =
    lightVals.length > 1 ? Math.min(...lightVals) : null;
  const bestHeavy =
    heavyVals.length > 1 ? Math.min(...heavyVals) : null;

  return (
    <Box
      lx={{
        flexDirection: 'row',
        gap: 's8',
        paddingVertical: 's4',
        borderColor: 'muted',
      }}
    >
      <Box lx={{ width: 's96', justifyContent: 'center' }}>
        <Text typography='body4SemiBold'>{label}</Text>
        <Text typography='body4' lx={{ color: 'muted' }}>
          {description}
        </Text>
      </Box>
      {libs.map((lib, i) => {
        const { light, heavy } = pairs[i];
        const measuringLight =
          running && currentTask?.lib === lib && currentTask.preset === 'light';
        const measuringHeavy =
          running && currentTask?.lib === lib && currentTask.preset === 'heavy';

        const isLightBest = light != null && bestLight != null && light === bestLight;
        const isHeavyBest = heavy != null && bestHeavy != null && heavy === bestHeavy;

        return (
          <Box key={lib} lx={{ flex: 1 }}>
            <Text typography='body4SemiBold' lx={{ color: 'base' }}>
              {LIB_LABELS[lib]}
            </Text>
            <Text
              typography='body4'
              lx={{ color: isLightBest ? 'active' : 'muted' }}
            >
              {DATA_POINTS_LIGHT} pts:{' '}
              {measuringLight
                ? 'measuring…'
                : light != null
                  ? formatVal(light, unit)
                  : '—'}
            </Text>
            <Text
              typography='body4'
              lx={{ color: isHeavyBest ? 'active' : 'muted' }}
            >
              {DATA_POINTS_HEAVY} pts:{' '}
              {measuringHeavy
                ? 'measuring…'
                : heavy != null
                  ? formatVal(heavy, unit)
                  : '—'}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};
