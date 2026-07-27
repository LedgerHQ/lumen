import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { chartConfig } from '../../config';

import { DonutChart } from './DonutChart';
import type { DonutSegment } from './types';

const sampleSeries: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 50 },
  { id: 'ethereum', label: 'Ethereum', value: 30 },
  { id: 'tether', label: 'Tether', value: 20 },
];

describe('DonutChart', () => {
  it('renders the ring', () => {
    const { getByTestId } = render(<DonutChart series={sampleSeries} />);
    getByTestId('donut-ring');
  });

  it('renders one segment path per series entry', () => {
    const { getAllByTestId } = render(<DonutChart series={sampleSeries} />);
    expect(getAllByTestId('donut-segment')).toHaveLength(3);
  });

  it('renders segments in series order', () => {
    const { getAllByTestId } = render(<DonutChart series={sampleSeries} />);
    const ids = getAllByTestId('donut-segment').map((el) =>
      el.getAttribute('data-segment-id'),
    );
    expect(ids).toEqual(['bitcoin', 'ethereum', 'tether']);
  });

  it('defaults to the md ring (168px)', () => {
    const { getByTestId } = render(<DonutChart series={sampleSeries} />);
    expect(getByTestId('donut-ring').getAttribute('width')).toBe('168');
  });

  it('renders the sm ring (80px)', () => {
    const { getByTestId } = render(
      <DonutChart series={sampleSeries} size='sm' />,
    );
    expect(getByTestId('donut-ring').getAttribute('width')).toBe('80');
  });

  it('skips zero-value segments and renders only the positive ones', () => {
    const { getAllByTestId } = render(
      <DonutChart
        series={[
          { id: 'bitcoin', label: 'Bitcoin', value: 60 },
          { id: 'empty', label: 'Empty', value: 0 },
          { id: 'ethereum', label: 'Ethereum', value: 40 },
        ]}
      />,
    );
    const ids = getAllByTestId('donut-segment').map((el) =>
      el.getAttribute('data-segment-id'),
    );
    expect(ids).toEqual(['bitcoin', 'ethereum']);
  });

  it('renders the faint empty ring and no segments for an empty series', () => {
    const { getByTestId, queryByTestId } = render(<DonutChart series={[]} />);
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });

  it('renders the empty ring when every value is zero', () => {
    const { getByTestId, queryByTestId } = render(
      <DonutChart
        series={[
          { id: 'a', label: 'A', value: 0 },
          { id: 'b', label: 'B', value: 0 },
        ]}
      />,
    );
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });

  describe('interactivity', () => {
    const getSegment = (
      getAllByTestId: ReturnType<typeof render>['getAllByTestId'],
      id: string,
    ) =>
      getAllByTestId('donut-segment').find(
        (el) => el.getAttribute('data-segment-id') === id,
      );

    it('activates a segment on hover and dims the others', () => {
      const onActiveIdChange = vi.fn();
      const { getAllByTestId } = render(
        <DonutChart
          series={sampleSeries}
          onActiveIdChange={onActiveIdChange}
        />,
      );

      fireEvent.mouseEnter(getSegment(getAllByTestId, 'ethereum')!);

      expect(onActiveIdChange).toHaveBeenCalledWith('ethereum');

      const segments = getAllByTestId('donut-segment');
      segments.forEach((segment) => {
        const id = segment.getAttribute('data-segment-id');
        const opacity = Number(segment.style.opacity);
        if (id === 'ethereum') {
          expect(opacity).toBe(1);
          expect(segment.style.transform).not.toBe('translate(0px, 0px)');
        } else {
          expect(opacity).toBe(chartConfig.donut.hover.dimOpacity);
          expect(segment.style.transform).toBe('translate(0px, 0px)');
        }
      });
    });

    it('resets activeId on mouseleave of the container', () => {
      const onActiveIdChange = vi.fn();
      const { getByTestId, getAllByTestId } = render(
        <DonutChart
          series={sampleSeries}
          onActiveIdChange={onActiveIdChange}
        />,
      );

      fireEvent.mouseEnter(getSegment(getAllByTestId, 'bitcoin')!);
      onActiveIdChange.mockClear();

      fireEvent.mouseLeave(getByTestId('donut-chart'));

      expect(onActiveIdChange).toHaveBeenCalledWith(null);
    });

    it('respects controlled activeId for dimming', () => {
      const { getAllByTestId } = render(
        <DonutChart series={sampleSeries} activeId='tether' />,
      );

      const segments = getAllByTestId('donut-segment');
      segments.forEach((segment) => {
        const id = segment.getAttribute('data-segment-id');
        const opacity = Number(segment.style.opacity);
        if (id === 'tether') {
          expect(opacity).toBe(1);
          expect(segment.style.transform).not.toBe('translate(0px, 0px)');
        } else {
          expect(opacity).toBe(chartConfig.donut.hover.dimOpacity);
        }
      });
    });

    it('calls onActiveIdChange in controlled mode without self-updating', () => {
      const onActiveIdChange = vi.fn();
      const { getAllByTestId } = render(
        <DonutChart
          series={sampleSeries}
          activeId='bitcoin'
          onActiveIdChange={onActiveIdChange}
        />,
      );

      fireEvent.mouseEnter(getSegment(getAllByTestId, 'ethereum')!);

      expect(onActiveIdChange).toHaveBeenCalledWith('ethereum');

      const bitcoin = getSegment(getAllByTestId, 'bitcoin')!;
      expect(Number(bitcoin.style.opacity)).toBe(1);
      expect(
        Number(getSegment(getAllByTestId, 'ethereum')!.style.opacity),
      ).toBe(chartConfig.donut.hover.dimOpacity);
    });

    it('renders with defaultActiveId in uncontrolled mode', () => {
      const { getAllByTestId } = render(
        <DonutChart series={sampleSeries} defaultActiveId='ethereum' />,
      );

      const ethereum = getSegment(getAllByTestId, 'ethereum')!;
      expect(Number(ethereum.style.opacity)).toBe(1);
      expect(ethereum.style.transform).not.toBe('translate(0px, 0px)');

      const bitcoin = getSegment(getAllByTestId, 'bitcoin')!;
      expect(Number(bitcoin.style.opacity)).toBe(
        chartConfig.donut.hover.dimOpacity,
      );
    });

    it('uses a pointer cursor on segments', () => {
      const { getAllByTestId } = render(<DonutChart series={sampleSeries} />);
      getAllByTestId('donut-segment').forEach((segment) => {
        expect(segment.style.cursor).toBe('pointer');
      });
    });

    it('does not animate hover for a single segment', () => {
      const onActiveIdChange = vi.fn();
      const { getAllByTestId } = render(
        <DonutChart
          series={[{ id: 'bitcoin', label: 'Bitcoin', value: 100 }]}
          onActiveIdChange={onActiveIdChange}
        />,
      );

      const segment = getAllByTestId('donut-segment')[0];
      fireEvent.mouseEnter(segment);

      expect(onActiveIdChange).toHaveBeenCalledWith('bitcoin');
      expect(segment.style.transform).toBe('translate(0px, 0px)');
      expect(segment.style.transition).toBe('');
      expect(Number(segment.style.opacity)).toBe(1);
    });
  });
});
