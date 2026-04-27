import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';

import { CartesianChart } from '../../CartesianChart';

import { XAxis } from './XAxis';
import type { XAxisProps } from './types';

const sampleSeries = [
  { id: 'test', stroke: '#000', data: [10, 20, 30, 40, 50] },
];

const renderXAxis = (props: XAxisProps = {}) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      <CartesianChart series={sampleSeries} width={400} height={200}>
        <XAxis {...props} />
      </CartesianChart>
    </ThemeProvider>,
  );

describe('XAxis', () => {
  it('renders without crashing', () => {
    const { getByTestId } = renderXAxis();
    getByTestId('chart-svg');
  });

  it('renders tick labels for explicit ticks', () => {
    const { getByText } = renderXAxis({ ticks: [0, 2, 4] });
    getByText('0');
    getByText('2');
    getByText('4');
  });

  it('does not render tick labels for empty ticks', () => {
    const { queryByText } = renderXAxis({ ticks: [] });
    expect(queryByText('0')).toBeNull();
  });

  it('applies tickLabelFormatter', () => {
    const formatter = (value: number | string) => `v${value}`;
    const { getByText } = renderXAxis({
      ticks: [0, 4],
      tickLabelFormatter: formatter,
    });
    getByText('v0');
    getByText('v4');
  });

  it('renders with showGrid enabled', () => {
    const { toJSON } = renderXAxis({ showGrid: true, ticks: [0, 2] });
    expect(toJSON()).toBeTruthy();
  });

  it('renders with showLine enabled', () => {
    const { toJSON } = renderXAxis({ showLine: true, ticks: [] });
    expect(toJSON()).toBeTruthy();
  });

  it('renders with showTickMark enabled', () => {
    const { toJSON } = renderXAxis({ showTickMark: true, ticks: [0, 2] });
    expect(toJSON()).toBeTruthy();
  });

  it('renders with all visual options enabled', () => {
    const { getByText } = renderXAxis({
      showGrid: true,
      showLine: true,
      showTickMark: true,
      ticks: [0, 4],
    });
    getByText('0');
    getByText('4');
  });

  it('does not render axis when width is 0', () => {
    const { queryByText } = render(
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
        <CartesianChart series={sampleSeries} width={0} height={200}>
          <XAxis ticks={[0, 2, 4]} />
        </CartesianChart>
      </ThemeProvider>,
    );
    expect(queryByText('0')).toBeNull();
    expect(queryByText('2')).toBeNull();
  });
});
