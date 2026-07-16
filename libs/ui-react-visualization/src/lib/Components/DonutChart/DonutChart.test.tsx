import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DonutChart } from './DonutChart';
import type { DonutSegment } from './types';

const sampleSeries: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 50 },
  { id: 'ethereum', label: 'Ethereum', value: 30 },
  { id: 'tether', label: 'Tether', value: 20 },
];

describe('DonutChart', () => {
  it('renders the ring', () => {
    const { getByTestId } = render(<DonutChart series={sampleSeries} />);
    getByTestId('donut-ring');
  });

  it('renders one segment path per series entry', () => {
    const { getAllByTestId } = render(<DonutChart series={sampleSeries} />);
    expect(getAllByTestId('donut-segment')).toHaveLength(3);
  });

  it('renders segments in series order', () => {
    const { getAllByTestId } = render(<DonutChart series={sampleSeries} />);
    const ids = getAllByTestId('donut-segment').map((el) =>
      el.getAttribute('data-segment-id'),
    );
    expect(ids).toEqual(['bitcoin', 'ethereum', 'tether']);
  });

  it('defaults to the md ring (168px)', () => {
    const { getByTestId } = render(<DonutChart series={sampleSeries} />);
    expect(getByTestId('donut-ring').getAttribute('width')).toBe('168');
  });

  it('renders the sm ring (80px)', () => {
    const { getByTestId } = render(
      <DonutChart series={sampleSeries} size='sm' />,
    );
    expect(getByTestId('donut-ring').getAttribute('width')).toBe('80');
  });

  it('renders the faint empty ring and no segments for an empty series', () => {
    const { getByTestId, queryByTestId } = render(<DonutChart series={[]} />);
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });

  it('renders the empty ring when every value is zero', () => {
    const { getByTestId, queryByTestId } = render(
      <DonutChart
        series={[
          { id: 'a', label: 'A', value: 0 },
          { id: 'b', label: 'B', value: 0 },
        ]}
      />,
    );
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });
});
