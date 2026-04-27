import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CartesianChart } from '../../CartesianChart';

import { YAxis } from './YAxis';
import type { YAxisProps } from './types';

const sampleSeries = [
  { id: 'test', stroke: '#000', data: [10, 20, 30, 40, 50] },
];

const renderYAxis = (props: YAxisProps = {}) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes}>
      <CartesianChart series={sampleSeries} width={400} height={200}>
        <YAxis {...props} />
      </CartesianChart>
    </ThemeProvider>,
  );

describe('YAxis', () => {
  it('renders the y-axis group', () => {
    const { getByTestId } = renderYAxis();
    getByTestId('y-axis');
  });

  it('renders tick labels for explicit ticks', () => {
    const { getByTestId } = renderYAxis({ ticks: [10, 30, 50] });
    const axis = getByTestId('y-axis');
    const labels = axis.querySelectorAll('text');
    expect(labels).toHaveLength(3);
    expect(labels[0].textContent).toBe('10');
    expect(labels[1].textContent).toBe('30');
    expect(labels[2].textContent).toBe('50');
  });

  it('renders axis line when showLine is true', () => {
    const { getByTestId } = renderYAxis({ showLine: true, ticks: [] });
    const axis = getByTestId('y-axis');
    expect(axis.querySelectorAll('line')).toHaveLength(1);
  });

  it('does not render axis line when showLine is false', () => {
    const { getByTestId } = renderYAxis({ showLine: false, ticks: [] });
    const axis = getByTestId('y-axis');
    expect(axis.querySelectorAll('line')).toHaveLength(0);
  });

  it('renders grid lines when showGrid is true', () => {
    const { getByTestId } = renderYAxis({
      showGrid: true,
      ticks: [10, 30, 50],
    });
    const axis = getByTestId('y-axis');
    expect(axis.querySelectorAll('line')).toHaveLength(3);
  });

  it('renders tick marks when showTickMark is true', () => {
    const { getByTestId } = renderYAxis({
      showTickMark: true,
      ticks: [10, 30, 50],
    });
    const axis = getByTestId('y-axis');
    expect(axis.querySelectorAll('line')).toHaveLength(3);
  });

  it('renders all line elements when showGrid, showLine and showTickMark are true', () => {
    const { getByTestId } = renderYAxis({
      showGrid: true,
      showLine: true,
      showTickMark: true,
      ticks: [10, 30],
    });
    const axis = getByTestId('y-axis');
    // 2 grid lines + 1 axis line + 2 tick marks = 5
    expect(axis.querySelectorAll('line')).toHaveLength(5);
  });

  it('uses dashed grid lines by default', () => {
    const { getByTestId } = renderYAxis({ showGrid: true, ticks: [10] });
    const axis = getByTestId('y-axis');
    const line = axis.querySelector('line');
    expect(line?.getAttribute('stroke-dasharray')).toBe('3 3');
  });

  it('uses solid grid lines when gridLineStyle is solid', () => {
    const { getByTestId } = renderYAxis({
      showGrid: true,
      gridLineStyle: 'solid',
      ticks: [10],
    });
    const axis = getByTestId('y-axis');
    const line = axis.querySelector('line');
    expect(line?.getAttribute('stroke-dasharray')).toBeNull();
  });

  it('applies tickLabelFormatter', () => {
    const formatter = (value: number | string) => `$${value}`;
    const { getByTestId } = renderYAxis({
      ticks: [10, 50],
      tickLabelFormatter: formatter,
    });
    const axis = getByTestId('y-axis');
    const labels = axis.querySelectorAll('text');
    expect(labels[0].textContent).toBe('$10');
    expect(labels[1].textContent).toBe('$50');
  });

  it('returns null when drawing area height is 0', () => {
    const { queryByTestId } = render(
      <ThemeProvider themes={ledgerLiveThemes}>
        <CartesianChart series={sampleSeries} width={400} height={0}>
          <YAxis />
        </CartesianChart>
      </ThemeProvider>,
    );
    expect(queryByTestId('y-axis')).toBeNull();
  });
});
