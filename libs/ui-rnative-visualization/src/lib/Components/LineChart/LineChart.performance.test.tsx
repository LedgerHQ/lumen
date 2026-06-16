import { beforeEach, describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import React from 'react';

import { Point } from '../Point';
import type { PointProps } from '../Point';

import { LineChart } from './LineChart';

// Deterministic render budgets: assert on counts, never time, so CI never flakes.
// Native scrubbing is gesture/worklet driven and not simulable here, so the
// scrub re-render guard lives only in the React lib.

const POINT_COUNT = 24;

const buildData = (length: number): number[] =>
  Array.from({ length }, (_, i) => (i % 9) + 1);

let pointRenders = 0;
const CountingPoint = (props: PointProps) => {
  pointRenders++;
  return <Point {...props} />;
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
    {children}
  </ThemeProvider>
);

beforeEach(() => {
  pointRenders = 0;
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
            <CountingPoint key={index} magnetic dataX={index} dataY={value} />
          ))}
        </LineChart>
      </Wrapper>,
    );

    expect(pointRenders).toBe(POINT_COUNT);
  });
});
