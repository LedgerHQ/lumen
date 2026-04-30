import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CartesianChart } from '../../CartesianChart';

import type { XAxisProps } from './types';
import { XAxis } from './XAxis';

const sampleSeries = [
  { id: 'test', stroke: '#000', data: [10, 20, 30, 40, 50] },
];

const renderXAxis = (props: XAxisProps = {}) =>
  render(
    <CartesianChart series={sampleSeries} width={400} height={200}>
      <XAxis {...props} />
    </CartesianChart>,
  );

describe('XAxis', () => {
  it('renders the x-axis group', () => {
    const { getByTestId } = renderXAxis();
    getByTestId('x-axis');
  });

  it('renders tick labels for explicit ticks', () => {
    const { getByTestId } = renderXAxis({ ticks: [0, 2, 4] });
    const axis = getByTestId('x-axis');
    const labels = axis.querySelectorAll('text');
    expect(labels).toHaveLength(3);
    expect(labels[0].textContent).toBe('0');
    expect(labels[1].textContent).toBe('2');
    expect(labels[2].textContent).toBe('4');
  });

  it('renders axis line when showLine is true', () => {
    const { getByTestId } = renderXAxis({ showLine: true, ticks: [] });
    const axis = getByTestId('x-axis');
    expect(axis.querySelectorAll('line')).toHaveLength(1);
  });

  it('does not render axis line when showLine is false', () => {
    const { getByTestId } = renderXAxis({ showLine: false, ticks: [] });
    const axis = getByTestId('x-axis');
    expect(axis.querySelectorAll('line')).toHaveLength(0);
  });

  it('renders grid lines when showGrid is true', () => {
    const { getByTestId } = renderXAxis({ showGrid: true, ticks: [1, 2, 3] });
    const axis = getByTestId('x-axis');
    expect(axis.querySelectorAll('line')).toHaveLength(3);
  });

  it('renders tick marks when showTickMark is true', () => {
    const { getByTestId } = renderXAxis({
      showTickMark: true,
      ticks: [0, 2, 4],
    });
    const axis = getByTestId('x-axis');
    expect(axis.querySelectorAll('line')).toHaveLength(3);
  });

  it('renders all line elements when showGrid, showLine and showTickMark are true', () => {
    const { getByTestId } = renderXAxis({
      showGrid: true,
      showLine: true,
      showTickMark: true,
      ticks: [1, 3],
    });
    const axis = getByTestId('x-axis');
    // 2 grid lines + 1 axis line + 2 tick marks = 5
    expect(axis.querySelectorAll('line')).toHaveLength(5);
  });

  it('uses dashed grid lines by default', () => {
    const { getByTestId } = renderXAxis({ showGrid: true, ticks: [2] });
    const axis = getByTestId('x-axis');
    const line = axis.querySelector('line');
    expect(line?.getAttribute('stroke-dasharray')).toBe('3 3');
  });

  it('uses solid grid lines when gridLineStyle is solid', () => {
    const { getByTestId } = renderXAxis({
      showGrid: true,
      gridLineStyle: 'solid',
      ticks: [2],
    });
    const axis = getByTestId('x-axis');
    const line = axis.querySelector('line');
    expect(line?.getAttribute('stroke-dasharray')).toBeNull();
  });

  it('applies tickLabelFormatter', () => {
    const formatter = (value: number | string) => `v${value}`;
    const { getByTestId } = renderXAxis({
      ticks: [0, 4],
      tickLabelFormatter: formatter,
    });
    const axis = getByTestId('x-axis');
    const labels = axis.querySelectorAll('text');
    expect(labels[0].textContent).toBe('v0');
    expect(labels[1].textContent).toBe('v4');
  });

  it('returns null when drawing area width is 0', () => {
    const { queryByTestId } = render(
      <CartesianChart series={sampleSeries} width={0} height={200}>
        <XAxis />
      </CartesianChart>,
    );
    expect(queryByTestId('x-axis')).toBeNull();
  });
});
