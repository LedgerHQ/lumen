import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import { Circle } from 'react-native-svg';

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
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200} showArea />
      </LineChartWrapper>,
    );
    getByTestId('line-path');
    getByTestId('line-area');
  });

  it('does not render area fill when showArea is false', () => {
    const { queryAllByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200} />
      </LineChartWrapper>,
    );
    expect(queryAllByTestId('line-area')).toHaveLength(0);
  });

  it('renders with animate true by default', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200} />
      </LineChartWrapper>,
    );
    getByTestId('chart-svg');
  });

  it('renders with animate false', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          animate={false}
        />
      </LineChartWrapper>,
    );
    getByTestId('chart-svg');
  });

  it('renders a Path for each series when multiple series are provided', () => {
    const multipleSeries = [
      { id: 'a', stroke: '#000', data: [10, 20, 30, 40, 50] },
      { id: 'b', stroke: '#f00', data: [5, 15, 25, 35, 45] },
    ];
    const { getAllByTestId } = render(
      <LineChartWrapper>
        <LineChart series={multipleSeries} width={400} height={200} />
      </LineChartWrapper>,
    );
    expect(getAllByTestId('line-path')).toHaveLength(2);
  });

  it('renders an area fill for each series when showArea is true', () => {
    const multipleSeries = [
      { id: 'a', stroke: '#000', data: [10, 20, 30, 40, 50] },
      { id: 'b', stroke: '#f00', data: [5, 15, 25, 35, 45] },
    ];
    const { getAllByTestId } = render(
      <LineChartWrapper>
        <LineChart series={multipleSeries} width={400} height={200} showArea />
      </LineChartWrapper>,
    );
    expect(getAllByTestId('line-area')).toHaveLength(2);
  });

  it('renders custom children inside the chart', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} height={200}>
          <Circle testID='custom-child' cx={10} cy={10} r={5} />
        </LineChart>
      </LineChartWrapper>,
    );
    getByTestId('custom-child');
  });

  it('renders x-axis tick labels when showXAxis is true', () => {
    const { getByText } = render(
      <LineChartWrapper>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          showXAxis
          xAxis={{ ticks: [0, 2, 4] }}
        />
      </LineChartWrapper>,
    );
    getByText('0');
    getByText('2');
    getByText('4');
  });

  it('renders x-axis tick labels when positioned at the top', () => {
    const { getByText } = render(
      <LineChartWrapper>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          showXAxis
          xAxis={{ position: 'top', ticks: [0, 4] }}
        />
      </LineChartWrapper>,
    );
    getByText('0');
    getByText('4');
  });

  it('renders y-axis tick labels when showYAxis is true', () => {
    const { getByText } = render(
      <LineChartWrapper>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          showYAxis
          yAxis={{ ticks: [10, 50] }}
        />
      </LineChartWrapper>,
    );
    getByText('10');
    getByText('50');
  });

  it('renders y-axis tick labels when positioned at the end', () => {
    const { getByText } = render(
      <LineChartWrapper>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          showYAxis
          yAxis={{ position: 'end', ticks: [10, 50] }}
        />
      </LineChartWrapper>,
    );
    getByText('10');
    getByText('50');
  });

  it('does not render axis tick labels by default', () => {
    const { queryByText } = render(
      <LineChartWrapper>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          xAxis={{ ticks: [0, 2, 4] }}
        />
      </LineChartWrapper>,
    );
    expect(queryByText('0')).toBeNull();
    expect(queryByText('2')).toBeNull();
    expect(queryByText('4')).toBeNull();
  });

  it('renders with scrubbing enabled', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          enableScrubbing
        />
      </LineChartWrapper>,
    );
    getByTestId('chart-svg');
  });

  it('renders with a custom inset', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart
          series={sampleSeries}
          width={400}
          height={200}
          inset={{ top: 10, bottom: 10, left: 20, right: 20 }}
        />
      </LineChartWrapper>,
    );
    expect(getByTestId('line-path')).toBeTruthy();
  });

  it('uses the default height when none is provided', () => {
    const { getByTestId } = render(
      <LineChartWrapper>
        <LineChart series={sampleSeries} width={400} />
      </LineChartWrapper>,
    );
    getByTestId('chart-svg');
  });
});
