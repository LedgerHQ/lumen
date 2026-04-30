import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text as SvgText } from 'react-native-svg';

import { CartesianChart } from '../CartesianChart';

import { Point } from './Point';

const sampleSeries = [{ id: 's1', stroke: '#000', data: [10, 20, 30, 40, 50] }];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
    {children}
  </ThemeProvider>
);

const renderInChart = (
  pointElement: React.ReactNode,
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
    expect(circle.props.r).toBe(5);
  });

  it('renders with custom color and size', () => {
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} color='#FF0000' size={16} />,
    );
    const circle = getByTestId('point-circle');
    expect(circle.props.fill).toBe('#FF0000');
    expect(circle.props.r).toBe(8);
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

  it('renders custom LabelComponent', () => {
    const CustomLabel = ({ x, y, children }: { x: number; y: number; children: string }) => (
      <SvgText testID='custom-label' x={x} y={y}>
        {children}
      </SvgText>
    );

    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} label='Peak' LabelComponent={CustomLabel} />,
    );

    expect(getByTestId('custom-label')).toBeTruthy();
  });

  it('does not render LabelComponent when label is absent', () => {
    const CustomLabel = ({ children }: { x: number; y: number; children: string }) => (
      <SvgText testID='custom-label'>{children}</SvgText>
    );

    const { queryByTestId } = renderInChart(
      <Point dataX={2} dataY={30} LabelComponent={CustomLabel} />,
    );

    expect(queryByTestId('custom-label')).toBeNull();
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
      <Point dataX={2} dataY={30} label='Peak' showLabelArrow={false} />,
    );
    expect(queryByTestId('point-arrow')).toBeNull();
  });
  it('calls onPress when the point is pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderInChart(
      <Point dataX={2} dataY={30} onPress={onPress} />,
    );
    fireEvent.press(getByTestId('point-group'));
    expect(onPress).toHaveBeenCalled();
  });
});
