import { beforeEach, describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import React, { Profiler } from 'react';
import type { ProfilerOnRenderCallback } from 'react';

import { Point } from '../Point';

import { LineChart } from './LineChart';

// Deterministic render budgets: assert on counts, never time, so CI never flakes.
// Native scrubbing is gesture/worklet driven and not simulable here, so the
// scrub re-render guard lives only in the React lib.

const POINT_COUNT = 24;

const buildData = (length: number): number[] =>
  Array.from({ length }, (_, i) => (i % 9) + 1);

// Counts commits of the Point subtree itself (via React.Profiler) rather than a
// wrapper's renders. A wrapper counter sits above Point and never re-runs when a
// context Point consumes updates, so it would silently miss the version-cascade
// regression this budget guards against.
let pointMountCommits = 0;
let pointUpdateCommits = 0;
const onPointRender: ProfilerOnRenderCallback = (_id, phase) => {
  if (phase === 'mount') {
    pointMountCommits++;
  } else {
    pointUpdateCommits++;
  }
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
    {children}
  </ThemeProvider>
);

beforeEach(() => {
  pointMountCommits = 0;
  pointUpdateCommits = 0;
});

describe('LineChart performance budgets', () => {
  it('emits a bounded node count per point', () => {
    const data = buildData(POINT_COUNT);

    const { queryAllByTestId } = render(
      <Wrapper>
        <LineChart
          series={[{ id: 's', stroke: '#000', data }]}
          width={400}
          height={200}
          animate={false}
        >
          {data.map((value, index) => (
            <Point key={index} dataX={index} dataY={value} />
          ))}
        </LineChart>
      </Wrapper>,
    );

    const groups = queryAllByTestId('point-group');
    const circles = queryAllByTestId('point-circle');
    const arrows = queryAllByTestId('point-arrow');

    expect(circles).toHaveLength(groups.length);
    expect(arrows).toHaveLength(0);
    expect(groups.length).toBeGreaterThan(0);
  });

  it('renders each magnetic point exactly once on mount (no version cascade)', () => {
    const data = buildData(POINT_COUNT);

    render(
      <Wrapper>
        <LineChart
          series={[{ id: 's', stroke: '#000', data }]}
          width={400}
          height={200}
          animate={false}
        >
          {data.map((value, index) => (
            <Profiler
              key={index}
              id={`point-${index}`}
              onRender={onPointRender}
            >
              <Point magnetic dataX={index} dataY={value} />
            </Profiler>
          ))}
        </LineChart>
      </Wrapper>,
    );

    expect(pointMountCommits).toBe(POINT_COUNT);
    expect(pointUpdateCommits).toBe(0);
  });
});
