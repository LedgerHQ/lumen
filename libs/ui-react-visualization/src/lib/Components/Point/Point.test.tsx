import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { CartesianChart } from '../CartesianChart';

import { Point } from './Point';
import type { PointLabelProps } from './types';

const sampleSeries = [{ id: 's1', stroke: '#000', data: [10, 20, 30, 40, 50] }];

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
    <CartesianChart
      series={sampleSeries}
      width={width}
      height={height}
      xAxis={xAxis}
      yAxis={yAxis}
    >
      {pointElement}
    </CartesianChart>,
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
    expect(circle.style.fill).toBe('#FF0000');
    expect(circle.getAttribute('r')).toBe('8');
  });

  it('renders a string label', () => {
    const { getByText } = renderInChart(
      <Point dataX={2} dataY={30} label='Peak' />,
    );
    expect(getByText('Peak')).toBeTruthy();
  });

  it('renders a label via function', () => {
    const { getByText } = renderInChart(
      <Point dataX={2} dataY={30} label={(i) => `#${i}`} />,
    );
    expect(getByText('#2')).toBeTruthy();
  });

  it('passes props to custom LabelComponent', () => {
    const labelSpy = vi.fn(({ x, y, children }: PointLabelProps) => (
      <text data-testid='custom-label' x={x} y={y}>
        {children}
      </text>
    ));

    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} label='Peak' LabelComponent={labelSpy} />,
    );

    expect(getByTestId('custom-label')).toBeTruthy();
    expect(labelSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        children: 'Peak',
      }),
      undefined,
    );
  });

  it('does not render LabelComponent when label is absent', () => {
    const labelSpy = vi.fn(() => <text>should not appear</text>);

    renderInChart(<Point dataX={2} dataY={30} LabelComponent={labelSpy} />);

    expect(labelSpy).not.toHaveBeenCalled();
  });

  it('hides the circle when hidePoint is true but shows label', () => {
    const { queryByTestId, getByText } = renderInChart(
      <Point dataX={2} dataY={30} hidePoint label='Still here' />,
    );
    expect(queryByTestId('point-circle')).toBeNull();
    expect(getByText('Still here')).toBeTruthy();
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

  it('renders arrow when label is present and showLabelArrow is true', () => {
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} label='Peak' />,
    );
    expect(getByTestId('point-arrow')).toBeTruthy();
  });

  it('does not render arrow when no label is present', () => {
    const { queryByTestId } = renderInChart(<Point dataX={2} dataY={30} />);
    expect(queryByTestId('point-arrow')).toBeNull();
  });

  it('renders label below the point when labelPosition is bottom', () => {
    const topSpy = vi.fn(({ y }: PointLabelProps) => <text>{y}</text>);
    const bottomSpy = vi.fn(({ y }: PointLabelProps) => <text>{y}</text>);

    renderInChart(
      <Point dataX={2} dataY={30} label='T' LabelComponent={topSpy} />,
    );
    renderInChart(
      <Point
        dataX={2}
        dataY={30}
        label='B'
        labelPosition='bottom'
        LabelComponent={bottomSpy}
      />,
    );

    const topY = topSpy.mock.calls[0][0].y;
    const bottomY = bottomSpy.mock.calls[0][0].y;
    expect(bottomY).toBeGreaterThan(topY);
  });

  it('does not render arrow when showLabelArrow is false', () => {
    const { queryByTestId } = renderInChart(
      <Point dataX={2} dataY={30} label='Peak' showLabelArrow={false} />,
    );
    expect(queryByTestId('point-arrow')).toBeNull();
  });

  it('calls onClick when the point is clicked', async () => {
    const onClick = vi.fn();
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} onClick={onClick} />,
    );
    await userEvent.click(getByTestId('point-group'));
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
