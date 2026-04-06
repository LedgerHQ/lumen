import { Button } from '@ledgerhq/lumen-ui-react';
import {
  Profiler,
  useCallback,
  useRef,
  useState,
  type ComponentType,
  type ProfilerOnRenderCallback,
} from 'react';
import { flushSync } from 'react-dom';
import { CHART_HEIGHT, CHART_WIDTH, LIB_LABELS } from './constants';
import type { LibKey } from './constants';
import { LineChartD3 } from './d3';
import { generatePriceSeries, formatCurrency, formatDate } from './mockData';
import { LineChartRecharts } from './recharts';
import type { LineChartProps } from './types';
import { LineChartVictory } from './victory';
import { LineChartVisx } from './visx';

const CHART_MAP: Record<LibKey, ComponentType<LineChartProps>> = {
  recharts: LineChartRecharts,
  victory: LineChartVictory,
  visx: LineChartVisx,
  d3: LineChartD3,
};

const ITERATIONS = 5;
const HOVER_STEPS = 30;
/** Daily samples; with 1-day interval this equals the number of points in the series. */
const DATA_POINTS_LIGHT = 90;
const DATA_POINTS_HEAVY = 2000;

type BenchmarkPreset = 'light' | 'heavy';

type BenchmarkResult = {
  mountMs: number;
  hoverAvgMs: number;
  dataChangeMs: number;
  memoryKb: number | null;
};

type LibBenchmarkResults = {
  light?: BenchmarkResult;
  heavy?: BenchmarkResult;
};

type AllResults = Partial<Record<LibKey, LibBenchmarkResults>>;

type BenchmarkTask = { lib: LibKey; preset: BenchmarkPreset };

function generateLineConfig(
  seed: number,
  dataPointCount: number,
): LineChartProps['lines'] {
  return [
    {
      id: 'bench',
      data: generatePriceSeries(
        62_000,
        0.025,
        dataPointCount,
        86_400_000,
        seed,
      ),
      color: '#E87A2C',
      width: 2,
      showGradient: false,
    },
  ];
}

function getMemoryKb(): number | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mem = (performance as any).memory;
  return mem ? Math.round(mem.usedJSHeapSize / 1024) : null;
}

function BenchmarkHarness({
  lib,
  dataPointCount,
  onComplete,
}: {
  lib: LibKey;
  dataPointCount: number;
  onComplete: (result: BenchmarkResult) => void;
}) {
  const Chart = CHART_MAP[lib];
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTimesRef = useRef<number[]>([]);
  const phaseRef = useRef<'mount' | 'hover' | 'data-change' | 'done'>('mount');
  const [lines, setLines] = useState(() =>
    generateLineConfig(1, dataPointCount),
  );
  const [iteration, setIteration] = useState(0);
  const [mounted, setMounted] = useState(false);

  const mountTimesRef = useRef<number[]>([]);
  const hoverTimesRef = useRef<number[]>([]);
  const dataChangeTimesRef = useRef<number[]>([]);
  const memBeforeRef = useRef<number | null>(null);
  const memAfterRef = useRef<number | null>(null);

  const onRender: ProfilerOnRenderCallback = useCallback(
    (_id, phase, actualDuration) => {
      if (phaseRef.current === 'mount' && phase === 'mount') {
        mountTimesRef.current.push(actualDuration);
      }
      renderTimesRef.current.push(actualDuration);
    },
    [],
  );

  const runBenchmark = useCallback(async () => {
    const delay = (ms: number): Promise<void> =>
      new Promise((r) => setTimeout(r, ms));

    await delay(100);

    memBeforeRef.current = getMemoryKb();

    // --- Phase 1: Mount (already happened on first render) ---
    // Re-mount multiple times by toggling
    for (let i = 1; i < ITERATIONS; i++) {
      phaseRef.current = 'mount';
      flushSync(() => setMounted(false));
      await delay(16);
      flushSync(() => {
        setLines(generateLineConfig(i + 1, dataPointCount));
        setMounted(true);
      });
      await delay(50);
    }

    memAfterRef.current = getMemoryKb();

    // --- Phase 2: Hover ---
    phaseRef.current = 'hover';
    const svg = containerRef.current?.querySelector('svg');
    if (svg) {
      const rect = svg.getBoundingClientRect();
      for (let step = 0; step < HOVER_STEPS; step++) {
        const x = rect.left + (rect.width * step) / HOVER_STEPS;
        const y = rect.top + rect.height / 2;
        const start = performance.now();
        svg.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            bubbles: true,
          }),
        );
        await delay(0);
        hoverTimesRef.current.push(performance.now() - start);
      }
      svg.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }

    await delay(50);

    // --- Phase 3: Data change ---
    phaseRef.current = 'data-change';
    const dcTimes: number[] = [];
    for (let i = 0; i < ITERATIONS; i++) {
      const start = performance.now();
      flushSync(() => setLines(generateLineConfig(100 + i, dataPointCount)));
      dcTimes.push(performance.now() - start);
      await delay(16);
    }
    dataChangeTimesRef.current = dcTimes;

    phaseRef.current = 'done';

    const avg = (arr: number[]): number =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const memDelta =
      memBeforeRef.current != null && memAfterRef.current != null
        ? memAfterRef.current - memBeforeRef.current
        : null;

    onComplete({
      mountMs: Math.round(avg(mountTimesRef.current) * 100) / 100,
      hoverAvgMs: Math.round(avg(hoverTimesRef.current) * 100) / 100,
      dataChangeMs: Math.round(avg(dataChangeTimesRef.current) * 100) / 100,
      memoryKb: memDelta,
    });
  }, [dataPointCount, onComplete]);

  const hasStarted = useRef(false);
  if (!hasStarted.current) {
    hasStarted.current = true;
    setMounted(true);
    setIteration(1);
    setTimeout(runBenchmark, 200);
  }

  const chartProps: LineChartProps = {
    lines,
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    showGrid: false,
    xAxis: { show: false },
    yAxis: { show: false },
    showTooltip: false,
    showCursor: true,
    dimAfterCursor: true,
    formatXLabel: formatDate,
    formatYLabel: formatCurrency,
  };

  return (
    <div ref={containerRef} className='opacity-0 absolute pointer-events-none'>
      {mounted && (
        <Profiler id={`bench-${lib}-${iteration}`} onRender={onRender}>
          <Chart {...chartProps} />
        </Profiler>
      )}
    </div>
  );
}

function buildTaskQueue(): BenchmarkTask[] {
  const libs: LibKey[] = ['recharts', 'victory', 'visx', 'd3'];
  const q: BenchmarkTask[] = [];
  for (const lib of libs) {
    q.push({ lib, preset: 'light' });
    q.push({ lib, preset: 'heavy' });
  }
  return q;
}

export const PerfBenchmark = () => {
  const [results, setResults] = useState<AllResults>({});
  const [running, setRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<BenchmarkTask | null>(null);
  const queueRef = useRef<BenchmarkTask[]>([]);

  const handleComplete = useCallback(
    (lib: LibKey, preset: BenchmarkPreset, result: BenchmarkResult) => {
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
    if (!first) {
      setRunning(false);
    }
  }, []);

  const libs: LibKey[] = ['recharts', 'victory', 'visx', 'd3'];

  const statusLabel =
    currentTask &&
    `${LIB_LABELS[currentTask.lib]} (${currentTask.preset === 'light' ? 'light' : 'heavy'})`;

  return (
    <div className='mt-48'>
      <div className='flex items-center gap-16 mb-16'>
        <h2 className='heading-3'>Performance Benchmark</h2>
        <Button
          appearance='accent'
          size='sm'
          onClick={startBenchmark}
          disabled={running}
          loading={running}
        >
          {running && statusLabel ? `Running ${statusLabel}…` : 'Run Benchmark'}
        </Button>
      </div>
      <p className='text-muted body-3 mb-16'>
        Each library runs twice:{' '}
        <span className='font-semibold text-base'>light</span> (
        {DATA_POINTS_LIGHT.toLocaleString()} points) and{' '}
        <span className='font-semibold text-base'>heavy</span> (
        {DATA_POINTS_HEAVY.toLocaleString()} points). {ITERATIONS} iterations
        per metric; charts offscreen at {CHART_WIDTH}×{CHART_HEIGHT}. Memory
        uses Chrome’s <code className='text-base'>performance.memory</code>{' '}
        only.
      </p>
      <p className='text-muted body-4 mb-16'>
        <span className='font-semibold text-base'>Memory delta:</span> KB change
        in reported used JS heap size after the mount/remount loop, compared to
        just before that loop. It approximates how much extra heap the library
        retains from mounting (libraries, caches, DOM); GC timing can shift the
        number, so use it as a rough comparison between implementations, not an
        absolute footprint.
      </p>

      <div className='rounded-lg overflow-hidden border border-muted max-w-[960px]'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-muted'>
              <th className='px-16 py-12 text-left body-3 font-bold text-base'>
                Metric
              </th>
              {libs.map((lib) => (
                <th
                  key={lib}
                  className='px-16 py-12 text-left body-3 font-bold text-base'
                >
                  <div>{LIB_LABELS[lib]}</div>
                  <div className='body-4 font-normal text-muted mt-4'>
                    light / heavy
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <BenchmarkRow
              label='Mount render'
              unit='ms'
              libs={libs}
              results={results}
              getValue={(r) => r.mountMs}
              running={running}
              currentTask={currentTask}
            />
            <BenchmarkRow
              label='Hover (avg per move)'
              unit='ms'
              libs={libs}
              results={results}
              getValue={(r) => r.hoverAvgMs}
              running={running}
              currentTask={currentTask}
              lowerIsBetter
            />
            <BenchmarkRow
              label='Data change'
              unit='ms'
              libs={libs}
              results={results}
              getValue={(r) => r.dataChangeMs}
              running={running}
              currentTask={currentTask}
            />
            <BenchmarkRow
              label='Memory delta'
              description='Heap after mount stress minus heap before (Chrome only).'
              unit='KB'
              libs={libs}
              results={results}
              getValue={(r) => r.memoryKb}
              running={running}
              currentTask={currentTask}
            />
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

function BenchmarkRow({
  label,
  description,
  unit,
  libs,
  results,
  getValue,
  running,
  currentTask,
  lowerIsBetter = true,
}: {
  label: string;
  description?: string;
  unit: string;
  libs: LibKey[];
  results: AllResults;
  getValue: (r: BenchmarkResult) => number | null;
  running: boolean;
  currentTask: BenchmarkTask | null;
  lowerIsBetter?: boolean;
}) {
  const pairs = libs.map((lib) => {
    const lr = results[lib];
    const light = lr?.light ? getValue(lr.light) : null;
    const heavy = lr?.heavy ? getValue(lr.heavy) : null;
    return { light, heavy };
  });

  const numericForBest = (v: number | null): v is number =>
    v != null && Number.isFinite(v);

  const lightVals = pairs.map((p) => p.light).filter(numericForBest);
  const heavyVals = pairs.map((p) => p.heavy).filter(numericForBest);

  const bestLight =
    lightVals.length > 0
      ? lowerIsBetter
        ? Math.min(...lightVals)
        : Math.max(...lightVals)
      : null;
  const bestHeavy =
    heavyVals.length > 0
      ? lowerIsBetter
        ? Math.min(...heavyVals)
        : Math.max(...heavyVals)
      : null;

  return (
    <tr className='border-t border-muted'>
      <td className='px-16 py-10 align-top'>
        <div className='body-3 text-base font-semibold'>{label}</div>
        {description ? (
          <div className='body-4 text-muted mt-4 max-w-320'>{description}</div>
        ) : null}
      </td>
      {libs.map((lib, i) => {
        const { light, heavy } = pairs[i];
        const lr = results[lib];
        const measuringLight =
          running && currentTask?.lib === lib && currentTask.preset === 'light';
        const measuringHeavy =
          running && currentTask?.lib === lib && currentTask.preset === 'heavy';

        const isLightBest =
          light != null &&
          bestLight != null &&
          light === bestLight &&
          lightVals.length > 1;
        const isHeavyBest =
          heavy != null &&
          bestHeavy != null &&
          heavy === bestHeavy &&
          heavyVals.length > 1;

        const formatVal = (v: number | null): string =>
          v != null && Number.isFinite(v) ? `${v.toFixed(2)} ${unit}` : '—';

        return (
          <td key={lib} className='px-16 py-10 body-3 text-muted align-top'>
            <div className='flex flex-col gap-4'>
              <div>
                <span className='body-4 text-muted mr-8'>L</span>
                {measuringLight ? (
                  <span className='animate-pulse'>measuring…</span>
                ) : light != null ? (
                  <span
                    className={isLightBest ? 'text-accent font-semibold' : ''}
                  >
                    {formatVal(light)}
                  </span>
                ) : lr?.light ? (
                  <span className='opacity-40'>n/a</span>
                ) : (
                  <span className='opacity-20'>—</span>
                )}
              </div>
              <div>
                <span className='body-4 text-muted mr-8'>H</span>
                {measuringHeavy ? (
                  <span className='animate-pulse'>measuring…</span>
                ) : heavy != null ? (
                  <span
                    className={isHeavyBest ? 'text-accent font-semibold' : ''}
                  >
                    {formatVal(heavy)}
                  </span>
                ) : lr?.heavy ? (
                  <span className='opacity-40'>n/a</span>
                ) : (
                  <span className='opacity-20'>—</span>
                )}
              </div>
            </div>
          </td>
        );
      })}
    </tr>
  );
}
