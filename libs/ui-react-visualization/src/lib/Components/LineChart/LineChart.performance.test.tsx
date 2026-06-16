import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { Point } from '../Point';
import type { PointProps } from '../Point';
import { Scrubber } from '../Scrubber';

import { LineChart } from './LineChart';

// Deterministic render budgets: assert on counts, never time, so CI never flakes.
// A failing budget should be an intentional, reviewed change.

const POINT_COUNT = 24;
const NODES_PER_POINT = 2; // <g> + <circle>

const buildData = (length: number): number[] =>
  Array.from({ length }, (_, i) => (i % 9) + 1);

let pointRenders = 0;
const CountingPoint = (props: PointProps) => {
  pointRenders++;
  return <Point {...props} />;
};

beforeEach(() => {
  pointRenders = 0;
});

describe('LineChart performance budgets', () => {
  it('emits a bounded SVG node count per point', () => {
    const data = buildData(POINT_COUNT);
    const series = [{ id: 's', stroke: '#000', data }];

    const withoutPoints = render(
      <LineChart series={series} width={400} height={200} animate={false} />,
    );
    const baseNodeCount =
      withoutPoints.container.querySelectorAll('svg *').length;
    withoutPoints.unmount();

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
    const totalNodeCount = container.querySelectorAll('svg *').length;

    expect(circles).toHaveLength(groups.length);
    expect(arrows).toHaveLength(0);
    expect(totalNodeCount - baseNodeCount).toBe(
      groups.length * NODES_PER_POINT,
    );
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
          <CountingPoint key={index} magnetic dataX={index} dataY={value} />
        ))}
      </LineChart>,
    );

    expect(pointRenders).toBe(POINT_COUNT);
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
          <CountingPoint key={index} magnetic dataX={index} dataY={value} />
        ))}
        <Scrubber
          tooltip={(index) => ({
            items: [{ label: 'v', value: String(data[index]) }],
          })}
        />
      </LineChart>,
    );

    const svg = getByTestId('chart-svg');
    pointRenders = 0;

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
    await scrub(320);

    expect(pointRenders).toBe(0);
  });
});
