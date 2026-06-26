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

  describe('loading and empty states', () => {
    it('renders the placeholder with no data while loading (state 1)', () => {
      const { getByTestId, queryByTestId } = render(
        <LineChartWrapper>
          <LineChart width={400} height={200} loading />
        </LineChartWrapper>,
      );

      getByTestId('chart-empty-state');
      expect(queryByTestId('line-path')).toBeNull();
      expect(queryByTestId('chart-empty-label')).toBeNull();
    });

    it('renders the placeholder with the empty label when there is no data and not loading (state 2)', () => {
      const { getByTestId, queryByTestId } = render(
        <LineChartWrapper>
          <LineChart width={400} height={200} emptyLabel='Nothing here' />
        </LineChartWrapper>,
      );

      getByTestId('chart-empty-state');
      expect(
        getByTestId('chart-empty-label', { includeHiddenElements: true }),
      ).toHaveTextContent('Nothing here');
      expect(queryByTestId('line-path')).toBeNull();
    });

    it('defaults the empty label to "No data"', () => {
      const { getByTestId } = render(
        <LineChartWrapper>
          <LineChart width={400} height={200} />
        </LineChartWrapper>,
      );

      expect(
        getByTestId('chart-empty-label', { includeHiddenElements: true }),
      ).toHaveTextContent('No data');
    });

    it('keeps rendering the real line during a transition load (state 3)', () => {
      const { getByTestId, queryByTestId } = render(
        <LineChartWrapper>
          <LineChart series={sampleSeries} width={400} height={200} loading />
        </LineChartWrapper>,
      );

      getByTestId('line-path');
      expect(queryByTestId('chart-empty-state')).toBeNull();
      expect(queryByTestId('chart-empty-label')).toBeNull();
    });

    it('renders the normal chart when idle with data (state 4)', () => {
      const { getByTestId, queryByTestId } = render(
        <LineChartWrapper>
          <LineChart series={sampleSeries} width={400} height={200} />
        </LineChartWrapper>,
      );

      getByTestId('line-path');
      expect(queryByTestId('chart-empty-state')).toBeNull();
      expect(queryByTestId('chart-empty-label')).toBeNull();
    });
  });

  describe('null gaps and connectNulls', () => {
    const gappedSeries = [
      {
        id: 'gapped',
        stroke: '#000',
        data: [10, 20, null, 40, 50],
        curve: 'linear' as const,
      },
    ];

    const countMoves = (d: string): number => d.match(/M/g)?.length ?? 0;

    it('breaks the line into segments at null values by default', () => {
      const { getByTestId } = render(
        <LineChartWrapper>
          <LineChart series={gappedSeries} width={400} height={200} />
        </LineChartWrapper>,
      );

      const d = getByTestId('line-path').props.d as string;
      expect(countMoves(d)).toBe(2);
    });

    it('connects across nulls when connectNulls is set on the chart', () => {
      const { getByTestId } = render(
        <LineChartWrapper>
          <LineChart
            series={gappedSeries}
            width={400}
            height={200}
            connectNulls
          />
        </LineChartWrapper>,
      );

      const d = getByTestId('line-path').props.d as string;
      expect(countMoves(d)).toBe(1);
    });

    it('honours connectNulls set per-series', () => {
      const { getByTestId } = render(
        <LineChartWrapper>
          <LineChart
            series={[{ ...gappedSeries[0], connectNulls: true }]}
            width={400}
            height={200}
          />
        </LineChartWrapper>,
      );

      const d = getByTestId('line-path').props.d as string;
      expect(countMoves(d)).toBe(1);
    });

    it('lets the chart-level prop override the per-series value', () => {
      const { getByTestId } = render(
        <LineChartWrapper>
          <LineChart
            series={[{ ...gappedSeries[0], connectNulls: true }]}
            width={400}
            height={200}
            connectNulls={false}
          />
        </LineChartWrapper>,
      );

      const d = getByTestId('line-path').props.d as string;
      expect(countMoves(d)).toBe(2);
    });
  });
});
