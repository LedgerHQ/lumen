import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { CartesianChart } from '../CartesianChart';

import { Point } from './Point';

const sampleSeries = [{ id: 's1', stroke: '#000', data: [10, 20, 30, 40, 50] }];

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes}>{children}</ThemeProvider>
);

const renderInChart = (
  pointElement: ReactNode,
  {
    width = 400,
    height = 200,
    xAxis,
    yAxis,
  }: {
    width?: number;
    height?: number;
    xAxis?: Parameters<typeof CartesianChart>[0]['xAxis'];
    yAxis?: Parameters<typeof CartesianChart>[0]['yAxis'];
  } = {},
) =>
  render(
    <Wrapper>
      <CartesianChart
        series={sampleSeries}
        width={width}
        height={height}
        xAxis={xAxis}
        yAxis={yAxis}
      >
        {pointElement}
      </CartesianChart>
    </Wrapper>,
  );

describe('Point', () => {
  it('renders a circle at the projected position', () => {
    const { getByTestId } = renderInChart(<Point dataX={2} dataY={30} />);
    const circle = getByTestId('point-circle');
    expect(circle).toBeTruthy();
    expect(circle.getAttribute('r')).toBe('5');
  });

  it('renders with custom color and size', () => {
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} color='#FF0000' size={16} />,
    );
    const circle = getByTestId('point-circle');
    expect(circle.getAttribute('fill')).toBe('#FF0000');
    expect(circle.getAttribute('r')).toBe('8');
  });

  it('renders a string label', () => {
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} label='Peak' />,
    );
    const label = getByTestId('point-label');
    expect(label).toBeTruthy();
    expect(label.textContent).toBe('Peak');
  });

  it('renders a label via function', () => {
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} label={(i) => `#${i}`} />,
    );
    const label = getByTestId('point-label');
    expect(label.textContent).toBe('#2');
  });

  it('renders labelComponent when provided', () => {
    const { getByTestId, queryByTestId } = renderInChart(
      <Point
        dataX={2}
        dataY={30}
        label='ignored'
        labelComponent={<text data-testid='custom-label'>Custom</text>}
      />,
    );
    expect(getByTestId('custom-label')).toBeTruthy();
    expect(queryByTestId('point-label')).toBeNull();
  });

  it('wraps labelComponent in a positioned group', () => {
    const { getByTestId } = renderInChart(
      <Point
        dataX={2}
        dataY={30}
        labelComponent={<text data-testid='custom-label'>Custom</text>}
      />,
    );
    const wrapper = getByTestId('custom-label').parentElement;
    expect(wrapper?.tagName.toLowerCase()).toBe('g');
    expect(wrapper?.getAttribute('transform')).toMatch(
      /^translate\(\d+(\.\d+)?,\d+(\.\d+)?\)$/,
    );
  });

  it('hides the circle when hidePoint is true but shows label', () => {
    const { queryByTestId, getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} hidePoint label='Still here' />,
    );
    expect(queryByTestId('point-circle')).toBeNull();
    expect(getByTestId('point-label')).toBeTruthy();
  });

  it('returns null when point is outside drawing area', () => {
    const { queryByTestId } = renderInChart(
      <Point dataX={-100} dataY={-100} />,
    );
    expect(queryByTestId('point-group')).toBeNull();
  });

  it('works with band (categorical) x-axis scale', () => {
    const { getByTestId } = renderInChart(<Point dataX={1} dataY={30} />, {
      xAxis: { scaleType: 'band' },
    });
    const circle = getByTestId('point-circle');
    expect(circle).toBeTruthy();
  });

  it('renders arrow when label is present and showArrow is true', () => {
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} label='Peak' />,
    );
    expect(getByTestId('point-arrow')).toBeTruthy();
  });

  it('does not render arrow when no label is present', () => {
    const { queryByTestId } = renderInChart(<Point dataX={2} dataY={30} />);
    expect(queryByTestId('point-arrow')).toBeNull();
  });

  it('does not render arrow when showArrow is false', () => {
    const { queryByTestId } = renderInChart(
      <Point dataX={2} dataY={30} label='Peak' showArrow={false} />,
    );
    expect(queryByTestId('point-arrow')).toBeNull();
  });

  it('calls onClick when the point is clicked', () => {
    const onClick = vi.fn();
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} onClick={onClick} />,
    );
    userEvent.click(getByTestId('point-group'));
    expect(onClick).toHaveBeenCalled();
  });

  it('sets cursor pointer when onClick is provided', () => {
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} onClick={vi.fn()} />,
    );
    const group = getByTestId('point-group');
    expect(group.style.cursor).toBe('pointer');
  });
});
