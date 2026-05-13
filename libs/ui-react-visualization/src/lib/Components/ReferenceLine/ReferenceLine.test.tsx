import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { CartesianChart } from '../CartesianChart';

import { ReferenceLine } from './ReferenceLine';

const sampleSeries = [{ id: 's1', stroke: '#000', data: [10, 20, 30, 40, 50] }];

const renderInChart = (
  children: ReactNode,
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
      {children}
    </CartesianChart>,
  );

describe('ReferenceLine', () => {
  describe('horizontal line (dataY)', () => {
    it('renders a horizontal line at the correct y-pixel', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      const line = getByTestId('reference-line-line');
      expect(line).toBeTruthy();
      expect(line.getAttribute('y1')).toBe(line.getAttribute('y2'));
    });

    it('spans the full width of the drawing area', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      const line = getByTestId('reference-line-line');
      const x1 = Number(line.getAttribute('x1'));
      const x2 = Number(line.getAttribute('x2'));
      expect(x2).toBeGreaterThan(x1);
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
      expect(label.getAttribute('text-anchor')).toBe('end');
    });

    it('renders label with textAnchor start when labelPosition is left', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Target' labelPosition='left' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.getAttribute('text-anchor')).toBe('start');
    });

    it('renders label with textAnchor middle when labelPosition is center', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Target' labelPosition='center' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.getAttribute('text-anchor')).toBe('middle');
    });

    it('defaults labelPosition to right', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Target' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.getAttribute('text-anchor')).toBe('end');
    });
  });

  describe('vertical line (dataX)', () => {
    it('renders a vertical line at the correct x-pixel', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataX={2} />);
      const line = getByTestId('reference-line-line');
      expect(line).toBeTruthy();
      expect(line.getAttribute('x1')).toBe(line.getAttribute('x2'));
    });

    it('spans the full height of the drawing area', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataX={2} />);
      const line = getByTestId('reference-line-line');
      const y1 = Number(line.getAttribute('y1'));
      const y2 = Number(line.getAttribute('y2'));
      expect(y2).toBeGreaterThan(y1);
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
      expect(label.getAttribute('dominant-baseline')).toBe('hanging');
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
      const { getByTestId: getWithData } = renderInChart(
        <ReferenceLine dataX={2} />,
        { xAxis: { data: numericXData } },
      );
      const lineWithData = getWithData('reference-line-line');
      const x1WithData = Number(lineWithData.getAttribute('x1'));

      const { getByTestId: getWithoutData } = renderInChart(
        <ReferenceLine dataX={300} />,
      );
      const lineWithoutData = getWithoutData('reference-line-line');
      const x1WithoutData = Number(lineWithoutData.getAttribute('x1'));

      expect(x1WithData).toBeCloseTo(x1WithoutData, 0);
    });
  });

  describe('label offsets', () => {
    it('applies labelDx offset to label x position', () => {
      const { getByTestId, unmount } = renderInChart(
        <ReferenceLine dataY={30} label='A' />,
      );
      const xWithoutOffset = Number(
        getByTestId('reference-line-label').getAttribute('x'),
      );
      unmount();

      const { getByTestId: getWithOffset } = renderInChart(
        <ReferenceLine dataY={30} label='A' labelDx={10} />,
      );
      const xWithOffset = Number(
        getWithOffset('reference-line-label').getAttribute('x'),
      );
      expect(xWithOffset).toBe(xWithoutOffset + 10);
    });

    it('applies labelDy offset to label y position', () => {
      const { getByTestId, unmount } = renderInChart(
        <ReferenceLine dataY={30} label='A' />,
      );
      const yWithoutOffset = Number(
        getByTestId('reference-line-label').getAttribute('y'),
      );
      unmount();

      const { getByTestId: getWithOffset } = renderInChart(
        <ReferenceLine dataY={30} label='A' labelDy={-4} />,
      );
      const yWithOffset = Number(
        getWithOffset('reference-line-label').getAttribute('y'),
      );
      expect(yWithOffset).toBe(yWithoutOffset - 4);
    });
  });

  describe('styling', () => {
    it('uses dashed line style by default', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      const line = getByTestId('reference-line-line');
      expect(line.getAttribute('stroke-dasharray')).toBe('0.1 6');
    });

    it('removes dasharray when lineStyle is solid', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} lineStyle='solid' />,
      );
      const line = getByTestId('reference-line-line');
      expect(line.getAttribute('stroke-dasharray')).toBeNull();
    });

    it('applies custom stroke color', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} stroke='#FF0000' />,
      );
      const line = getByTestId('reference-line-line');
      expect(line.getAttribute('stroke')).toBe('#FF0000');
    });

    it('applies custom opacity', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} opacity={0.5} />,
      );
      const line = getByTestId('reference-line-line');
      expect(line.getAttribute('opacity')).toBe('0.5');
    });

    it('applies opacity to label as well', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Test' opacity={0.5} />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.getAttribute('opacity')).toBe('0.5');
    });

    it('has round linecap', () => {
      const { getByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      const line = getByTestId('reference-line-line');
      expect(line.getAttribute('stroke-linecap')).toBe('round');
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
      expect(label.getAttribute('text-anchor')).toBe('start');
    });

    it('applies labelVerticalAlignment=top on horizontal line', () => {
      const { getByTestId } = renderInChart(
        <ReferenceLine dataY={30} label='Test' labelVerticalAlignment='top' />,
      );
      const label = getByTestId('reference-line-label');
      expect(label.getAttribute('dominant-baseline')).toBe('hanging');
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
      expect(label.getAttribute('dominant-baseline')).toBe('central');
    });
  });

  describe('no label', () => {
    it('does not render label element when label is not provided', () => {
      const { queryByTestId } = renderInChart(<ReferenceLine dataY={30} />);
      expect(queryByTestId('reference-line-label')).toBeNull();
    });
  });
});
