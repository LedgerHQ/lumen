import { fireEvent, render } from '@testing-library/react';
import { Profiler } from 'react';
import type { ProfilerOnRenderCallback, ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../core/ThemeProvider';

import { chartConfig } from '../config';
import { DonutChart } from './DonutChart';
import type { DonutSegment } from './types';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

// Deterministic render budgets: assert on counts, never time, so CI never flakes.
// A failing budget should be an intentional, reviewed change.
//
// RingSegment is internal (unlike LineChart's public Point child), so commit
// budgets wrap DonutChart itself and the public renderCenter output.

const SEGMENT_COUNT = 8;
const PLACEHOLDER_COUNT = chartConfig.donut.placeholder.segmentValues.length;

const buildSeries = (length: number): DonutSegment[] =>
  Array.from({ length }, (_, i) => ({
    id: `s${i}`,
    label: `S${i}`,
    value: (i % 5) + 1,
  }));

let chartMountCommits = 0;
let chartUpdateCommits = 0;

const onChartRender: ProfilerOnRenderCallback = (_id, phase) => {
  if (phase === 'mount') {
    chartMountCommits++;
  } else {
    chartUpdateCommits++;
  }
};

let centerMountCommits = 0;
let centerUpdateCommits = 0;

const onCenterRender: ProfilerOnRenderCallback = (_id, phase) => {
  if (phase === 'mount') {
    centerMountCommits++;
  } else {
    centerUpdateCommits++;
  }
};

const RestingCenter = () => (
  <Profiler id='donut-center-resting' onRender={onCenterRender}>
    <span>resting</span>
  </Profiler>
);

const segmentPaths = (
  getAllByTestId: ReturnType<typeof render>['getAllByTestId'],
): string[] =>
  getAllByTestId('donut-segment').map((el) => el.getAttribute('d') ?? '');

const hoverSegment = (
  getAllByTestId: ReturnType<typeof render>['getAllByTestId'],
  id: string,
): void => {
  const segment = getAllByTestId('donut-segment').find(
    (el) => el.getAttribute('data-segment-id') === id,
  );
  if (!segment) throw new Error(`No segment "${id}"`);
  fireEvent.mouseEnter(segment);
};

beforeEach(() => {
  chartMountCommits = 0;
  chartUpdateCommits = 0;
  centerMountCommits = 0;
  centerUpdateCommits = 0;
});

describe('DonutChart performance budgets', () => {
  it('emits one ring node per series entry and no leftover placeholders', () => {
    const series = buildSeries(SEGMENT_COUNT);

    const { getAllByTestId, queryAllByTestId } = render(
      <DonutChart series={series} />,
      { wrapper },
    );

    expect(getAllByTestId('donut-segment')).toHaveLength(SEGMENT_COUNT);
    expect(queryAllByTestId('donut-placeholder')).toHaveLength(0);
  });

  it('emits a bounded placeholder node count while loading', () => {
    const { getAllByTestId, queryAllByTestId } = render(
      <DonutChart series={buildSeries(SEGMENT_COUNT)} loading />,
      { wrapper },
    );

    expect(getAllByTestId('donut-placeholder')).toHaveLength(PLACEHOLDER_COUNT);
    expect(queryAllByTestId('donut-segment')).toHaveLength(0);
  });

  it('renders the chart exactly once on mount', () => {
    render(
      <Profiler id='donut-chart' onRender={onChartRender}>
        <DonutChart series={buildSeries(SEGMENT_COUNT)} />
      </Profiler>,
      { wrapper },
    );

    expect(chartMountCommits).toBe(1);
    expect(chartUpdateCommits).toBe(0);
  });

  it('does not rebuild segment paths while hovering', () => {
    const series = buildSeries(SEGMENT_COUNT);
    const { getAllByTestId } = render(<DonutChart series={series} />, {
      wrapper,
    });

    const pathsBefore = segmentPaths(getAllByTestId);
    hoverSegment(getAllByTestId, 's1');
    hoverSegment(getAllByTestId, 's3');

    expect(getAllByTestId('donut-segment')).toHaveLength(SEGMENT_COUNT);
    expect(segmentPaths(getAllByTestId)).toEqual(pathsBefore);
  });

  it('commits the chart once per hover (no update cascade)', () => {
    const series = buildSeries(SEGMENT_COUNT);
    const { getAllByTestId, getByTestId } = render(
      <Profiler id='donut-chart' onRender={onChartRender}>
        <DonutChart series={series} />
      </Profiler>,
      { wrapper },
    );

    chartUpdateCommits = 0;

    hoverSegment(getAllByTestId, 's1');
    expect(chartUpdateCommits).toBe(1);

    hoverSegment(getAllByTestId, 's3');
    expect(chartUpdateCommits).toBe(2);

    fireEvent.mouseLeave(getByTestId('donut-chart'));
    expect(chartUpdateCommits).toBe(3);
  });

  it('does not remount resting center content when a segment activates', () => {
    const series = buildSeries(SEGMENT_COUNT);
    const { getAllByTestId } = render(
      <DonutChart
        series={series}
        renderCenter={() => <RestingCenter />}
        renderCenterActive={({ activeSegment }) => (
          <span>{activeSegment.label}</span>
        )}
      />,
      { wrapper },
    );

    expect(centerMountCommits).toBe(1);
    expect(centerUpdateCommits).toBe(0);

    hoverSegment(getAllByTestId, 's1');

    expect(centerMountCommits).toBe(1);
    expect(centerUpdateCommits).toBeGreaterThan(0);
  });
});
