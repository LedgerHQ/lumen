import { beforeEach, describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { fireEvent, render } from '@testing-library/react-native';
import React, { Profiler } from 'react';
import type { ProfilerOnRenderCallback } from 'react';
import { Text } from 'react-native';

import { chartConfig, DONUT_GEOMETRY, type DonutGeometry } from '../../config';
import { DonutChart } from './DonutChart';
import type { DonutSegment } from './types';
import { buildRingSegments } from './utils';

// Deterministic render budgets: assert on counts, never time, so CI never flakes.
// A failing budget should be an intentional, reviewed change.
//
// RingSegment is internal (unlike LineChart's public Point child), so commit
// budgets wrap DonutChart itself and the public renderCenter output. Reanimated
// opacity/translate frames are UI-thread work and invisible to Profiler.

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
    <Text>resting</Text>
  </Profiler>
);

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
    {children}
  </ThemeProvider>
);

const segmentPaths = (
  getAllByTestId: ReturnType<typeof render>['getAllByTestId'],
): string[] => getAllByTestId('donut-segment').map((el) => el.props.d);

const toOverlayPoint = (
  local: { x: number; y: number },
  geometry: DonutGeometry,
): { x: number; y: number } => {
  const { box, activeOffset } = geometry;
  const scale = (box + 2 * activeOffset) / box;
  const center = box / 2;
  return {
    x: (local.x + activeOffset + center) / scale,
    y: (local.y + activeOffset + center) / scale,
  };
};

const pointForSegment = (
  series: DonutSegment[],
  id: string,
  geometry: DonutGeometry = DONUT_GEOMETRY.md,
): { x: number; y: number } => {
  const segment = buildRingSegments(series, geometry).find((s) => s.id === id);
  if (!segment) throw new Error(`No segment "${id}"`);
  const midRadius = (geometry.innerRadius + geometry.outerRadius) / 2;
  return toOverlayPoint(
    {
      x: Math.sin(segment.midAngle) * midRadius,
      y: -Math.cos(segment.midAngle) * midRadius,
    },
    geometry,
  );
};

const tapSegment = (
  getByTestId: ReturnType<typeof render>['getByTestId'],
  series: DonutSegment[],
  id: string,
  geometry: DonutGeometry = DONUT_GEOMETRY.md,
): void => {
  fireEvent(
    getByTestId('donut-gesture-overlay'),
    'end',
    pointForSegment(series, id, geometry),
    true,
  );
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
      <Wrapper>
        <DonutChart series={series} />
      </Wrapper>,
    );

    expect(getAllByTestId('donut-segment')).toHaveLength(SEGMENT_COUNT);
    expect(queryAllByTestId('donut-placeholder')).toHaveLength(0);
  });

  it('emits a bounded placeholder node count while loading', () => {
    const { getAllByTestId, queryAllByTestId } = render(
      <Wrapper>
        <DonutChart series={buildSeries(SEGMENT_COUNT)} loading />
      </Wrapper>,
    );

    expect(getAllByTestId('donut-placeholder')).toHaveLength(PLACEHOLDER_COUNT);
    expect(queryAllByTestId('donut-segment')).toHaveLength(0);
  });

  it('renders the chart exactly once on mount', () => {
    render(
      <Wrapper>
        <Profiler id='donut-chart' onRender={onChartRender}>
          <DonutChart series={buildSeries(SEGMENT_COUNT)} />
        </Profiler>
      </Wrapper>,
    );

    expect(chartMountCommits).toBe(1);
    expect(chartUpdateCommits).toBe(0);
  });

  it('does not rebuild segment paths while tapping', () => {
    const series = buildSeries(SEGMENT_COUNT);
    const { getAllByTestId, getByTestId } = render(
      <Wrapper>
        <DonutChart series={series} />
      </Wrapper>,
    );

    const pathsBefore = segmentPaths(getAllByTestId);
    tapSegment(getByTestId, series, 's1');
    tapSegment(getByTestId, series, 's3');

    expect(getAllByTestId('donut-segment')).toHaveLength(SEGMENT_COUNT);
    expect(segmentPaths(getAllByTestId)).toEqual(pathsBefore);
  });

  it('commits the chart once per tap (no update cascade)', () => {
    const series = buildSeries(SEGMENT_COUNT);
    const { getByTestId } = render(
      <Wrapper>
        <Profiler id='donut-chart' onRender={onChartRender}>
          <DonutChart series={series} />
        </Profiler>
      </Wrapper>,
    );

    chartUpdateCommits = 0;

    tapSegment(getByTestId, series, 's1');
    expect(chartUpdateCommits).toBe(1);

    tapSegment(getByTestId, series, 's3');
    expect(chartUpdateCommits).toBe(2);

    tapSegment(getByTestId, series, 's3');
    expect(chartUpdateCommits).toBe(3);
  });

  it('does not remount resting center content when a segment activates', () => {
    const series = buildSeries(SEGMENT_COUNT);
    const { getByTestId } = render(
      <Wrapper>
        <DonutChart
          series={series}
          renderCenter={() => <RestingCenter />}
          renderCenterActive={({ activeSegment }) => (
            <Text>{activeSegment.label}</Text>
          )}
        />
      </Wrapper>,
    );

    expect(centerMountCommits).toBe(1);
    expect(centerUpdateCommits).toBe(0);

    tapSegment(getByTestId, series, 's1');

    expect(centerMountCommits).toBe(1);
    expect(centerUpdateCommits).toBeGreaterThan(0);
  });
});
