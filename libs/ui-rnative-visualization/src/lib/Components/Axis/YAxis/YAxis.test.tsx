import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';

import { CartesianChart } from '../../CartesianChart';

import type { YAxisProps } from './types';
import { YAxis } from './YAxis';

const sampleSeries = [
  { id: 'test', stroke: '#000', data: [10, 20, 30, 40, 50] },
];

const renderYAxis = (props: YAxisProps = {}) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      <CartesianChart series={sampleSeries} width={400} height={200}>
        <YAxis {...props} />
      </CartesianChart>
    </ThemeProvider>,
  );

describe('YAxis', () => {
  it('renders without crashing', () => {
    const { getByTestId } = renderYAxis();
    getByTestId('chart-svg');
  });

  it('renders tick labels for explicit ticks', () => {
    const { getByText } = renderYAxis({ ticks: [10, 30, 50] });
    getByText('10');
    getByText('30');
    getByText('50');
  });

  it('does not render tick labels for empty ticks', () => {
    const { queryByText } = renderYAxis({ ticks: [] });
    expect(queryByText('10')).toBeNull();
  });

  it('applies tickLabelFormatter', () => {
    const formatter = (value: number | string) => `$${value}`;
    const { getByText } = renderYAxis({
      ticks: [10, 50],
      tickLabelFormatter: formatter,
    });
    getByText('$10');
    getByText('$50');
  });

  it('renders with showGrid enabled', () => {
    const { toJSON } = renderYAxis({ showGrid: true, ticks: [10, 30] });
    expect(toJSON()).toBeTruthy();
  });

  it('renders with showLine enabled', () => {
    const { toJSON } = renderYAxis({ showLine: true, ticks: [] });
    expect(toJSON()).toBeTruthy();
  });

  it('renders with showTickMark enabled', () => {
    const { toJSON } = renderYAxis({ showTickMark: true, ticks: [10, 30] });
    expect(toJSON()).toBeTruthy();
  });

  it('renders with all visual options enabled', () => {
    const { getByText } = renderYAxis({
      showGrid: true,
      showLine: true,
      showTickMark: true,
      ticks: [10, 50],
    });
    getByText('10');
    getByText('50');
  });

  it('does not render axis when height is 0', () => {
    const { queryByText } = render(
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
        <CartesianChart series={sampleSeries} width={400} height={0}>
          <YAxis ticks={[10, 30, 50]} />
        </CartesianChart>
      </ThemeProvider>,
    );
    expect(queryByText('10')).toBeNull();
    expect(queryByText('30')).toBeNull();
  });
});
