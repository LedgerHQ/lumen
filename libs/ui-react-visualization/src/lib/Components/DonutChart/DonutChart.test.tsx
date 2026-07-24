import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { chartConfig } from '../../config';

import { DonutChart } from './DonutChart';
import { DonutChartDescription } from './DonutChartDescription';
import { DonutChartTitle } from './DonutChartTitle';
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

  describe('renderCenter', () => {
    it('does not render a center slot when render props are omitted', () => {
      const { queryByTestId } = render(<DonutChart series={sampleSeries} />);
      expect(queryByTestId('donut-center')).toBeNull();
    });

    it('passes activeSegment=null and the full series when nothing is active', () => {
      const renderCenter = vi.fn(() => null);
      render(<DonutChart series={sampleSeries} renderCenter={renderCenter} />);

      expect(renderCenter).toHaveBeenCalledWith({
        activeSegment: null,
        series: sampleSeries,
      });
    });

    it('enriches activeSegment with its computed percent', () => {
      const renderCenter = vi.fn(() => null);
      render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId='ethereum'
          renderCenter={renderCenter}
        />,
      );

      expect(renderCenter).toHaveBeenCalledWith({
        activeSegment: { ...sampleSeries[1], percent: 30 },
        series: sampleSeries,
      });
    });

    it('renders the count by default and the percent/label when active', () => {
      const { getAllByTestId, getByText, queryByText } = render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId={null}
          renderCenter={({ activeSegment, series }) =>
            activeSegment ? (
              <>
                <DonutChartTitle>{activeSegment.percent}%</DonutChartTitle>
                <DonutChartDescription>
                  {activeSegment.label}
                </DonutChartDescription>
              </>
            ) : (
              <DonutChartTitle>{series.length}</DonutChartTitle>
            )
          }
        />,
      );

      getByText('3');
      expect(queryByText('Bitcoin')).toBeNull();

      const bitcoinSegment = getAllByTestId('donut-segment').find(
        (el) => el.getAttribute('data-segment-id') === 'bitcoin',
      )!;
      fireEvent.mouseEnter(bitcoinSegment);

      getByText('50%');
      getByText('Bitcoin');
      expect(queryByText('3')).toBeNull();
    });

    it('renders an interactive icon inside the center slot', () => {
      const { getByRole } = render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId='bitcoin'
          renderCenter={({ activeSegment }) => (
            <>
              <DonutChartTitle>{activeSegment?.percent}%</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment?.label}
                <button aria-label='Bitcoin details' />
              </DonutChartDescription>
            </>
          )}
        />,
      );

      getByRole('button', { name: 'Bitcoin details' });
    });
  });

  describe('renderCenterActive', () => {
    it('calls renderCenter with activeSegment=null for the resting slot', () => {
      const renderCenter = vi.fn(() => null);
      const renderCenterActive = vi.fn(() => null);
      render(
        <DonutChart
          series={sampleSeries}
          renderCenter={renderCenter}
          renderCenterActive={renderCenterActive}
        />,
      );

      expect(renderCenter).toHaveBeenCalledWith({
        activeSegment: null,
        series: sampleSeries,
      });
    });

    it('passes the enriched active segment to renderCenterActive', () => {
      const renderCenterActive = vi.fn(() => null);
      render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId='ethereum'
          renderCenter={() => null}
          renderCenterActive={renderCenterActive}
        />,
      );

      expect(renderCenterActive).toHaveBeenCalledWith({
        activeSegment: { ...sampleSeries[1], percent: 30 },
      });
    });

    it('shows resting content by default and percent/label on hover', () => {
      const { getAllByTestId, getByText, queryByText } = render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId={null}
          renderCenter={({ series }) => (
            <DonutChartTitle>{series.length}</DonutChartTitle>
          )}
          renderCenterActive={({ activeSegment }) => (
            <>
              <DonutChartTitle>{activeSegment.percent}%</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
              </DonutChartDescription>
            </>
          )}
        />,
      );

      getByText('3');
      expect(queryByText('Bitcoin')).toBeNull();

      const bitcoinSegment = getAllByTestId('donut-segment').find(
        (el) => el.getAttribute('data-segment-id') === 'bitcoin',
      )!;
      fireEvent.mouseEnter(bitcoinSegment);

      getByText('50%');
      getByText('Bitcoin');
    });

    it('renders an interactive icon inside the center slot', () => {
      const { getByRole } = render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId='bitcoin'
          renderCenter={() => null}
          renderCenterActive={({ activeSegment }) => (
            <>
              <DonutChartTitle>{activeSegment.percent}%</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
                <button aria-label='Bitcoin details' />
              </DonutChartDescription>
            </>
          )}
        />,
      );

      getByRole('button', { name: 'Bitcoin details' });
    });

    it('keeps both resting and active content mounted and toggles visibility', () => {
      const { getAllByTestId, getByTestId, getByText, queryByTestId } = render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId={null}
          renderCenter={({ series }) => (
            <DonutChartTitle data-testid='donut-center-resting'>
              {series.length}
            </DonutChartTitle>
          )}
          renderCenterActive={({ activeSegment }) => (
            <>
              <DonutChartTitle data-testid='donut-center-active'>
                {activeSegment.percent}%
              </DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
              </DonutChartDescription>
            </>
          )}
        />,
      );

      getByText('3');
      getByTestId('donut-center-resting');
      expect(queryByTestId('donut-center-active')).toBeNull();

      const bitcoinSegment = getAllByTestId('donut-segment').find(
        (el) => el.getAttribute('data-segment-id') === 'bitcoin',
      )!;
      fireEvent.mouseEnter(bitcoinSegment);

      getByText('50%');
      getByText('Bitcoin');
      getByTestId('donut-center-active');
    });

    it('shows resting content again after mouse leave', () => {
      const { getAllByTestId, getByTestId, getByText } = render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId={null}
          renderCenter={({ series }) => (
            <DonutChartTitle>{series.length}</DonutChartTitle>
          )}
          renderCenterActive={({ activeSegment }) => (
            <>
              <DonutChartTitle>{activeSegment.percent}%</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
              </DonutChartDescription>
            </>
          )}
        />,
      );

      const bitcoinSegment = getAllByTestId('donut-segment').find(
        (el) => el.getAttribute('data-segment-id') === 'bitcoin',
      )!;
      fireEvent.mouseEnter(bitcoinSegment);
      fireEvent.mouseLeave(getByTestId('donut-chart'));

      getByText('3');
    });
  });
});
