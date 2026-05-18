import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import React from 'react';

import { CartesianChart } from '../CartesianChart';

import { ReferenceLine } from './ReferenceLine';

const sampleSeries = [{ id: 's1', stroke: '#000', data: [10, 20, 30, 40, 50] }];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
    {children}
  </ThemeProvider>
);

const renderInChart = (
  children: React.ReactNode,
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
        {children}
      </CartesianChart>
    </Wrapper>,
  );

describe('ReferenceLine', () => {
  describe('horizontal line (dataY)', () => {
    it('renders a horizontal line at the correct y-pixel', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      const line = getByTestId('reference-line-line');
      expect(line).toBeTruthy();
      expect(line.props.y1).toBe(line.props.y2);
    });

    it('spans the full width of the drawing area', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      const line = getByTestId('reference-line-line');
      expect(line.props.x2).toBeGreaterThan(line.props.x1);
    });

    it('does not render when dataY is outside domain bounds', () => {
      const { queryByTestId } = renderInChart(<ReferenceLine dataY={999} />);
      expect(queryByTestId('reference-line')).toBeNull();
    });

    it('renders label with textAnchor end when labelPosition is right', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Target' labelPosition='right' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.textAnchor).toBe('end');
    });

    it('renders label with textAnchor start when labelPosition is left', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Target' labelPosition='left' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.textAnchor).toBe('start');
    });

    it('renders label with textAnchor middle when labelPosition is center', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Target' labelPosition='center' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.textAnchor).toBe('middle');
    });

    it('defaults labelPosition to right', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Target' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.textAnchor).toBe('end');
    });
  });

  describe('vertical line (dataX)', () => {
    it('renders a vertical line at the correct x-pixel', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataX={2} />);
      const line = getByTestId('reference-line-line');
      expect(line).toBeTruthy();
      expect(line.props.x1).toBe(line.props.x2);
    });

    it('spans the full height of the drawing area', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataX={2} />);
      const line = getByTestId('reference-line-line');
      expect(line.props.y2).toBeGreaterThan(line.props.y1);
    });

    it('does not render when dataX is outside domain bounds', () => {
      const { queryByTestId } = renderInChart(<ReferenceLine dataX={999} />);
      expect(queryByTestId('reference-line')).toBeNull();
    });

    it('defaults labelPosition to top with dominant-baseline hanging', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataX={2} label='Event' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.dominantBaseline).toBe('hanging');
    });

    it('works with band (categorical) x-axis scale', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataX={2} />, {
        xAxis: { scaleType: 'band' },
      });
      expect(getByTestId('reference-line-line')).toBeTruthy();
    });

    it('does not render when dataX is outside band scale domain', () => {
      const { queryByTestId } = renderInChart(<ReferenceLine dataX={999} />, {
        xAxis: { scaleType: 'band' },
      });
      expect(queryByTestId('reference-line')).toBeNull();
    });

    it('resolves dataX through numeric xAxis.data', () => {
      const numericXData = [100, 200, 300, 400, 500];
      const { getByTestId: getIdx0 } = renderInChart(
        <ReferenceLine dataX={0} />,
        { xAxis: { data: numericXData } },
      );
      const { getByTestId: getIdx2 } = renderInChart(
        <ReferenceLine dataX={2} />,
        { xAxis: { data: numericXData } },
      );
      const x1Idx0 = getIdx0('reference-line-line').props.x1;
      const x1Idx2 = getIdx2('reference-line-line').props.x1;

      expect(x1Idx2).toBeGreaterThan(x1Idx0);
    });

    it('does not render when dataX index is out of bounds for xAxis.data', () => {
      const { queryByTestId } = renderInChart(<ReferenceLine dataX={10} />, {
        xAxis: { data: [100, 200, 300] },
      });
      expect(queryByTestId('reference-line')).toBeNull();
    });
  });

  describe('label offsets', () => {
    it('applies labelDx offset to label x position', () => {
      const { getByTestId, unmount } = renderInChart(
        <ReferenceLine dataY={30} label='A' />,
      );
      const xWithoutOffset = getByTestId('reference-line-label').props.x;
      unmount();

      const { getByTestId: getWithOffset } = renderInChart(
        <ReferenceLine dataY={30} label='A' labelDx={10} />,
      );
      const xWithOffset = getWithOffset('reference-line-label').props.x;
      expect(xWithOffset).toBe(xWithoutOffset + 10);
    });

    it('applies labelDy offset to label y position', () => {
      const { getByTestId, unmount } = renderInChart(
        <ReferenceLine dataY={30} label='A' />,
      );
      const yWithoutOffset = getByTestId('reference-line-label').props.y;
      unmount();

      const { getByTestId: getWithOffset } = renderInChart(
        <ReferenceLine dataY={30} label='A' labelDy={-4} />,
      );
      const yWithOffset = getWithOffset('reference-line-label').props.y;
      expect(yWithOffset).toBe(yWithoutOffset - 4);
    });
  });

  describe('styling', () => {
    it('uses dashed line style by default', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      const line = getByTestId('reference-line-line');
      expect(line.props.strokeDasharray).toBe('0.1 6');
    });

    it('removes dasharray when lineStyle is solid', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} lineStyle='solid' />,
      );
      const line = getByTestId('reference-line-line');
      expect(line.props.strokeDasharray).toBeUndefined();
    });

    it('applies custom stroke color', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} stroke='#FF0000' />,
      );
      const line = getByTestId('reference-line-line');
      expect(line.props.stroke).toBe('#FF0000');
    });

    it('applies custom opacity', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} opacity={0.5} />,
      );
      const line = getByTestId('reference-line-line');
      expect(line.props.opacity).toBe(0.5);
    });

    it('applies opacity to label as well', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Test' opacity={0.5} />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.opacity).toBe(0.5);
    });

    it('has round linecap', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      const line = getByTestId('reference-line-line');
      expect(line.props.strokeLinecap).toBe('round');
    });
  });

  describe('label alignment overrides', () => {
    it('applies labelHorizontalAlignment=left on vertical line', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine
          dataX={2}
          label='Test'
          labelHorizontalAlignment='left'
        />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.textAnchor).toBe('start');
    });

    it('applies labelVerticalAlignment=top on horizontal line', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Test' labelVerticalAlignment='top' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.dominantBaseline).toBe('hanging');
    });

    it('applies labelVerticalAlignment=middle on horizontal line', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine
          dataY={30}
          label='Test'
          labelVerticalAlignment='middle'
        />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.props.dominantBaseline).toBe('central');
    });
  });

  describe('no label', () => {
    it('does not render label element when label is not provided', () => {
      const { queryByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      expect(queryByTestId('reference-line-label')).toBeNull();
    });
  });
});
