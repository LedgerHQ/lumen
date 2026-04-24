import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-react';
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
  return (
    <ThemeProvider themes={ledgerLiveThemes}>
      <LineChart {...props} />
    </ThemeProvider>
  );
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
});
