import { act, fireEvent, render } from '@testing-library/react';
import { Profiler } from 'react';
import type { ProfilerOnRenderCallback } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Point } from '../Point';
import { Scrubber } from '../Scrubber';

import { LineChart } from './LineChart';

// Deterministic render budgets: assert on counts, never time, so CI never flakes.
// A failing budget should be an intentional, reviewed change.

const POINT_COUNT = 24;
const NODES_PER_POINT = 2; // <g> + <circle>

const buildData = (length: number): number[] =>
  Array.from({ length }, (_, i) => (i % 9) + 1);

// Counts commits of the Point subtree itself (via React.Profiler) rather than a
// wrapper's renders. A wrapper counter sits above Point and never re-runs when a
// context Point consumes updates, so it would silently miss the exact re-render
// regressions (scrubbing, magnetic registration) these budgets guard against.
let pointMountCommits = 0;
let pointUpdateCommits = 0;

const onPointRender: ProfilerOnRenderCallback = (_id, phase) => {
  if (phase === 'mount') {
    pointMountCommits++;
  } else {
    pointUpdateCommits++;
  }
};

let didPolyfillRaf = false;

beforeEach(() => {
  didPolyfillRaf = false;

  // jsdom only provides requestAnimationFrame when "pretendToBeVisual" is enabled.
  // Provide a minimal fallback so this test remains deterministic across environments.
  if (typeof globalThis.requestAnimationFrame !== 'function') {
    didPolyfillRaf = true;
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
      setTimeout(() => cb(Date.now()), 0) as unknown as number;
    globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
  }
});

afterEach(() => {
  if (!didPolyfillRaf) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).requestAnimationFrame;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).cancelAnimationFrame;
});
describe('LineChart performance budgets', () => {
  it('emits a bounded SVG node count per point', () => {
    const data = buildData(POINT_COUNT);
    const series = [{ id: 's', stroke: '#000', data }];

    const { container } = render(
      <LineChart series={series} width={400} height={200} animate={false}>
        {data.map((value, index) => (
          <Point key={index} dataX={index} dataY={value} />
        ))}
      </LineChart>,
    );

    const groups = container.querySelectorAll('[data-testid="point-group"]');
    const circles = container.querySelectorAll('[data-testid="point-circle"]');
    const arrows = container.querySelectorAll('[data-testid="point-arrow"]');
    const pointNodeCount = container.querySelectorAll(
      '[data-testid="point-group"], [data-testid="point-circle"]',
    ).length;

    expect(groups.length).toBeGreaterThan(0);
    expect(circles).toHaveLength(groups.length);
    expect(arrows).toHaveLength(0);
    expect(pointNodeCount).toBe(groups.length * NODES_PER_POINT);
  });

  it('renders each magnetic point exactly once on mount (no version cascade)', () => {
    const data = buildData(POINT_COUNT);

    render(
      <LineChart
        series={[{ id: 's', stroke: '#000', data }]}
        width={400}
        height={200}
        animate={false}
        enableScrubbing
      >
        {data.map((value, index) => (
          <Profiler key={index} id={`point-${index}`} onRender={onPointRender}>
            <Point magnetic dataX={index} dataY={value} />
          </Profiler>
        ))}
      </LineChart>,
    );

    expect(pointMountCommits).toBe(POINT_COUNT);
    expect(pointUpdateCommits).toBe(0);
  });

  it('does not re-render points while scrubbing', async () => {
    const data = buildData(POINT_COUNT);

    const { getByTestId } = render(
      <LineChart
        series={[{ id: 's', stroke: '#000', data }]}
        width={400}
        height={200}
        animate={false}
        enableScrubbing
      >
        {data.map((value, index) => (
          <Profiler key={index} id={`point-${index}`} onRender={onPointRender}>
            <Point magnetic dataX={index} dataY={value} />
          </Profiler>
        ))}
        <Scrubber
          tooltip={(index) => ({
            items: [{ label: 'v', value: String(data[index]) }],
          })}
        />
      </LineChart>,
    );

    const svg = getByTestId('chart-svg');
    pointUpdateCommits = 0;

    const scrub = async (clientX: number) => {
      await act(async () => {
        fireEvent.mouseMove(svg, { clientX });
        // Flush the scrubber's requestAnimationFrame-coalesced update.
        await new Promise((resolve) =>
          requestAnimationFrame(() => resolve(null)),
        );
      });
    };

    await scrub(80);
    expect(getByTestId('scrubber')).toBeTruthy();
    await scrub(320);

    expect(pointUpdateCommits).toBe(0);
  });
});
