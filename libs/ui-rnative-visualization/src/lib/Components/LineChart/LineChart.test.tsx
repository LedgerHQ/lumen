import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';

import { LineChart } from './LineChart';

const sampleSeries = [
  {
    id: 'test',
    stroke: '#000',
    data: [10, 20, 30, 40, 50],
  },
];

const LineChartWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      {children}
    </ThemeProvider>
  );
};

describe('LineChart', () => {
  it('renders the chart container', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200} />
      </LineChartWrapper>,
    );
    getByTestId('chart-container');
  });

  it('renders an Svg element', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200} />
      </LineChartWrapper>,
    );
    getByTestId('chart-svg');
  });

  it('renders a Path for each series', () => {
    const { getAllByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200} />
      </LineChartWrapper>,
    );
    expect(getAllByTestId('line-path')).toHaveLength(1);
  });

  it('renders with no series', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart width={400} height={200} />
      </LineChartWrapper>,
    );
    getByTestId('chart-container');
  });

  it('renders area fill when showArea is true', () => {
    const { getAllByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200} showArea />
      </LineChartWrapper>,
    );
    expect(getAllByTestId('line-path')).toHaveLength(1);
    expect(getAllByTestId('line-area')).toHaveLength(1);
    expect(getAllByTestId('line-gradient')).toHaveLength(1);
  });

  it('does not render area fill when showArea is false', () => {
    const { queryAllByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200} />
      </LineChartWrapper>,
    );
    expect(queryAllByTestId('line-gradient')).toHaveLength(0);
  });
});
