import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LineChart } from './LineChart';
import type { LineChartProps } from './types';

const sampleSeries = [
  {
    id: 'test',
    stroke: '#000',
    data: [10, 20, 30, 40, 50],
  },
];

const LineChartWrapper = (props: LineChartProps) => {
  return <LineChart {...props} />;
};

describe('LineChart', () => {
  it('renders an svg element', () => {
    const { getByTestId } = render(
      <LineChartWrapper series={sampleSeries} width={400} height={200} />,
    );
    getByTestId('chart-svg');
  });

  it('renders a path for each series', () => {
    const { getAllByTestId } = render(
      <LineChartWrapper series={sampleSeries} width={400} height={200} />,
    );
    expect(getAllByTestId('line-path')).toHaveLength(1);
  });

  it('renders XAxis when showXAxis is true', () => {
    const { getByTestId } = render(
      <LineChartWrapper
        series={sampleSeries}
        width={400}
        height={200}
        showXAxis
        xAxis={{ showLine: true }}
      />,
    );
    getByTestId('x-axis');
  });

  it('does not render XAxis when showXAxis is false', () => {
    const { queryByTestId } = render(
      <LineChartWrapper series={sampleSeries} width={400} height={200} />,
    );
    expect(queryByTestId('x-axis')).toBeNull();
  });

  it('renders with no series', () => {
    const { getByTestId } = render(
      <LineChartWrapper width={400} height={200} />,
    );
    getByTestId('chart-svg');
  });

  it('renders area fill when showArea is true', () => {
    const { getAllByTestId } = render(
      <LineChartWrapper
        series={sampleSeries}
        width={400}
        height={200}
        showArea
      />,
    );
    expect(getAllByTestId('line-path')).toHaveLength(1);
    expect(getAllByTestId('line-area')).toHaveLength(1);
    expect(getAllByTestId('line-gradient')).toHaveLength(1);
  });

  it('does not render area fill when showArea is false', () => {
    const { queryAllByTestId } = render(
      <LineChartWrapper series={sampleSeries} width={400} height={200} />,
    );
    expect(queryAllByTestId('line-gradient')).toHaveLength(0);
  });

  it('renders clip-path animation wrapper by default', () => {
    const { container } = render(
      <LineChartWrapper series={sampleSeries} width={400} height={200} />,
    );
    const clipPathEl = container.querySelector('clipPath');
    expect(clipPathEl).not.toBeNull();
  });

  it('does not render clip-path when animate is false', () => {
    const { container } = render(
      <LineChartWrapper
        series={sampleSeries}
        width={400}
        height={200}
        animate={false}
      />,
    );
    const clipPathEl = container.querySelector('clipPath');
    expect(clipPathEl).toBeNull();
  });

  describe('loading and empty states', () => {
    it('renders the shimmering placeholder with no data while loading (state 1)', () => {
      const { getByTestId, queryByTestId } = render(
        <LineChartWrapper width={400} height={200} loading />,
      );

      const emptyState = getByTestId('chart-empty-state');
      expect(emptyState.querySelector('style')).not.toBeNull();
      expect(queryByTestId('line-path')).toBeNull();
      expect(queryByTestId('chart-empty-label')).toBeNull();
    });

    it('renders the placeholder with the empty label when there is no data and not loading (state 2)', () => {
      const { getByTestId, queryByTestId } = render(
        <LineChartWrapper width={400} height={200} emptyLabel='Nothing here' />,
      );

      const emptyState = getByTestId('chart-empty-state');
      expect(emptyState.querySelector('style')).toBeNull();
      expect(getByTestId('chart-empty-label').textContent).toBe('Nothing here');
      expect(queryByTestId('line-path')).toBeNull();
    });

    it('defaults the empty label to "No data"', () => {
      const { getByTestId } = render(
        <LineChartWrapper width={400} height={200} />,
      );

      expect(getByTestId('chart-empty-label').textContent).toBe('No data');
    });

    it('keeps rendering the real line and axes during a transition load (state 3)', () => {
      const { getByTestId, queryByTestId } = render(
        <LineChartWrapper
          series={sampleSeries}
          width={400}
          height={200}
          showXAxis
          loading
        />,
      );

      getByTestId('line-path');
      getByTestId('x-axis');
      expect(queryByTestId('chart-empty-state')).toBeNull();
      expect(queryByTestId('chart-empty-label')).toBeNull();
    });

    it('renders the normal chart when idle with data (state 4)', () => {
      const { getByTestId, queryByTestId } = render(
        <LineChartWrapper series={sampleSeries} width={400} height={200} />,
      );

      getByTestId('line-path');
      expect(queryByTestId('chart-empty-state')).toBeNull();
      expect(queryByTestId('chart-empty-label')).toBeNull();
    });
  });
});
