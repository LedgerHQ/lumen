import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useRef, useState } from 'react';

import { StoryDecorator } from '../../../../../.storybook/StoryDecorator';
import type { Series } from '../../../utils/types';
import { Point } from '../../Point';
import { Scrubber } from '../../Scrubber';

import { LineChart } from '../LineChart';
import { CHART_HEIGHT, CHART_WIDTH } from './chartStoryFixtures';

/**
 * Performance audit harness for `LineChart` (Goal 1: *audit the performance of
 * the charts*). This file is intentionally kept separate from the documentation
 * stories so it can grow stress-specific knobs without cluttering the public
 * examples, and so it never ships as "official" usage guidance.
 *
 * `LineChart` is an **SVG/DOM** chart (it renders real `<path>`, `<circle>`,
 * `<g>`, `<text>` nodes via d3-scale/d3-shape), so the cost lives in three
 * places you can actually measure:
 *
 * 1. **DOM node count + layout/paint** — the line is a single `<path>` per
 *    series (cheap, flat), but every `<Point>` emits a `<g>` + `<circle>`
 *    (+ optional `<polygon>`/`<text>`). Toggle `renderPoints` to make node
 *    count scale linearly with the data and watch layout/paint inflate.
 * 2. **Scripting / React re-renders** — scrubbing drives the `ScrubberProvider`
 *    and `MagneticPointsProvider`. Turn `enableScrubbing` on and profile a
 *    hover/drag with the React DevTools Profiler to catch re-render cascades.
 * 3. **Memory** — see the `MountUnmountStress` story for repeated
 *    create/destroy cycles to hunt detached nodes / leaks.
 *
 * ── How to run the audit (the pragmatic trio) ────────────────────────────────
 * • **Cold render & scaling**: pick `pointCount` 1k → 10k → 100k, hard-reload
 *   the story, and record a Chrome DevTools *Performance* trace. Read the FPS
 *   track + main-thread flame chart; for SVG also watch the Layout/Paint and
 *   the DOM node counter (enable `renderPoints` to stress it).
 * • **Interaction smoothness**: with `enableScrubbing` on, record while you
 *   scrub. Open the React DevTools Profiler and confirm a scrub re-renders the
 *   tooltip, *not* every `<Point>`/`<Line>`.
 * • **Memory**: use `MountUnmountStress`, take a heap snapshot before/after
 *   ~20 cycles, and look for detached nodes and heap growth.
 *
 * ⚠️ `pointCount: 100000` combined with `renderPoints` will intentionally
 * hammer the main thread (≈100k SVG groups) — that freeze *is* the signal.
 */

const STROKES = ['#7B61FF', '#44D7B6', '#FF8A65', '#4FC3F7'] as const;

/** mulberry32 PRNG, seeded so every render/run produces identical data. */
const createRng = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Deterministic random-walk series sized to `pointCount` × `seriesCount`.
 * Memoizable by callers so the data cost is excluded from render measurements.
 */
const buildPerfSeries = (pointCount: number, seriesCount: number): Series[] => {
  return Array.from({ length: seriesCount }, (_, s) => {
    const rng = createRng(20260601 + s * 9973);
    const data: number[] = new Array(pointCount);
    let value = 50 + s * 10;
    for (let i = 0; i < pointCount; i++) {
      const volatility = rng() < 0.1 ? 9 : 4;
      const shock = (rng() - 0.5) * 2 * volatility;
      const reversion = (50 - value) * 0.02;
      value = Math.max(10, value + shock + reversion);
      data[i] = Math.round(value * 100) / 100;
    }
    return {
      id: `series-${s}`,
      label: `Series ${s + 1}`,
      stroke: STROKES[s % STROKES.length],
      data,
    } satisfies Series;
  });
};

type PerfArgs = {
  pointCount: number;
  seriesCount: number;
  renderPoints: boolean;
  showArea: boolean;
  enableScrubbing: boolean;
  animate: boolean;
};

const meta = {
  title: 'Visualization/LineChart/Performance',
  component: LineChart,
  tags: ['experimental', '!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  argTypes: {
    pointCount: {
      control: 'select',
      options: [100, 1000, 10000, 100000],
      description: 'Data points per series (scaling axis: 1k → 100k).',
    },
    seriesCount: {
      control: 'select',
      options: [1, 2, 4],
      description: 'Number of lines sharing the scales.',
    },
    renderPoints: {
      control: 'boolean',
      description:
        'Render one <Point> per sample. Makes DOM node count scale with data — the SVG worst case.',
    },
    showArea: { control: 'boolean' },
    enableScrubbing: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => (
      <StoryDecorator context={context}>
        <Story />
      </StoryDecorator>
    ),
  ],
} satisfies Meta<PerfArgs>;

export default meta;
type Story = StoryObj<PerfArgs>;

const PerfChart = ({
  pointCount,
  seriesCount,
  renderPoints,
  showArea,
  enableScrubbing,
  animate,
}: PerfArgs) => {
  const series = useMemo(
    () => buildPerfSeries(pointCount, seriesCount),
    [pointCount, seriesCount],
  );

  return (
    <div className='flex flex-col gap-12'>
      <span className='body-3 text-muted'>
        {seriesCount} series × {pointCount.toLocaleString()} pts
        {renderPoints
          ? ` · ${(seriesCount * pointCount).toLocaleString()} <Point> nodes`
          : ''}
      </span>
      <LineChart
        series={series}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        showArea={showArea}
        enableScrubbing={enableScrubbing}
        animate={animate}
      >
        {renderPoints &&
          series.map((s) =>
            (s.data ?? []).map((value, index) =>
              value == null ? null : (
                <Point
                  key={`${s.id}-${index}`}
                  dataX={index}
                  dataY={value}
                  color={s.stroke}
                  magnetic
                />
              ),
            ),
          )}
        {enableScrubbing && (
          <Scrubber
            tooltip={(dataIndex) => ({
              items: series.map((s) => ({
                label: s.label ?? s.id,
                value: String(s.data?.[dataIndex] ?? '—'),
              })),
            })}
          />
        )}
      </LineChart>
    </div>
  );
};

/**
 * Main scaling + interaction harness. Use the `pointCount` control to sweep
 * 1k → 10k → 100k and record a Performance trace per step. Keep `renderPoints`
 * off to measure the line/scripting path; turn it on to measure DOM-node /
 * layout-paint cost. Turn `enableScrubbing` on to profile interaction jank.
 */
export const Scaling: Story = {
  args: {
    pointCount: 100,
    seriesCount: 1,
    renderPoints: false,
    showArea: true,
    enableScrubbing: true,
    animate: false,
  },
  render: (args) => <PerfChart {...args} />,
};

/**
 * SVG DOM-node worst case: one `<Point>` per sample so node count scales with
 * the data. Watch the DevTools DOM node counter and the Layout/Paint track.
 * Bump `pointCount` carefully — 100k here will intentionally stall the main
 * thread.
 */
export const DomNodeStress: Story = {
  args: {
    pointCount: 10000,
    seriesCount: 1,
    renderPoints: true,
    showArea: false,
    enableScrubbing: false,
    animate: false,
  },
  render: (args) => <PerfChart {...args} />,
};

const MountUnmountHarness = ({
  pointCount,
  seriesCount,
  renderPoints,
  showArea,
  enableScrubbing,
  animate,
}: PerfArgs) => {
  const [mounted, setMounted] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [auto, setAuto] = useState(false);
  const targetCycles = 20;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!auto) return;
    intervalRef.current = setInterval(() => {
      setMounted((m) => !m);
      setCycles((c) => c + 1);
    }, 250);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [auto]);

  return (
    <div className='flex flex-col gap-12'>
      <div className='flex items-center gap-12'>
        <button
          type='button'
          className='rounded-8 border border-muted px-12 py-4 body-3 text-interactive'
          onClick={() => {
            setMounted((m) => !m);
            setCycles((c) => c + 1);
          }}
        >
          Toggle mount
        </button>
        <button
          type='button'
          className='rounded-8 border border-muted px-12 py-4 body-3 text-interactive'
          onClick={() => setAuto((a) => !a)}
        >
          {auto ? 'Stop auto-cycle' : `Auto-cycle (~${targetCycles})`}
        </button>
        <span className='body-3 text-muted'>cycles: {cycles}</span>
      </div>
      <span className='body-3 text-muted'>
        Take a heap snapshot, run ~{targetCycles} cycles, snapshot again, and
        diff for detached nodes / heap growth.
      </span>
      <div style={{ minHeight: CHART_HEIGHT }}>
        {mounted && (
          <PerfChart
            pointCount={pointCount}
            seriesCount={seriesCount}
            renderPoints={renderPoints}
            showArea={showArea}
            enableScrubbing={enableScrubbing}
            animate={animate}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Memory / leak harness: mount and unmount the chart repeatedly (manually or
 * via auto-cycle) while recording a heap allocation timeline. Detached DOM
 * nodes that survive cycles, or monotonic heap growth, indicate a leak —
 * especially relevant for SPAs that mount/unmount charts on navigation.
 */
export const MountUnmountStress: Story = {
  args: {
    pointCount: 1000,
    seriesCount: 1,
    renderPoints: false,
    showArea: true,
    enableScrubbing: true,
    animate: true,
  },
  render: (args) => <MountUnmountHarness {...args} />,
};
