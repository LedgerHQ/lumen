import { ThemeProvider } from '@ledgerhq/lumen-ui-react';
import { fireEvent, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { chartConfig } from '../../config';

import { DonutChart } from './DonutChart';
import { DonutChartCenter } from './DonutChartCenter';
import { DonutChartDescription } from './DonutChartDescription';
import { DonutChartTitle } from './DonutChartTitle';
import type { DonutSegment } from './types';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const sampleSeries: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 50 },
  { id: 'ethereum', label: 'Ethereum', value: 30 },
  { id: 'tether', label: 'Tether', value: 20 },
];

describe('DonutChart', () => {
  it('renders the ring', () => {
    const { getByTestId } = render(<DonutChart series={sampleSeries} />, {
      wrapper,
    });
    getByTestId('donut-ring');
  });

  it('renders one segment path per series entry', () => {
    const { getAllByTestId } = render(<DonutChart series={sampleSeries} />, {
      wrapper,
    });
    expect(getAllByTestId('donut-segment')).toHaveLength(3);
  });

  it('renders segments in series order', () => {
    const { getAllByTestId } = render(<DonutChart series={sampleSeries} />, {
      wrapper,
    });
    const ids = getAllByTestId('donut-segment').map((el) =>
      el.getAttribute('data-segment-id'),
    );
    expect(ids).toEqual(['bitcoin', 'ethereum', 'tether']);
  });

  it('defaults to the md ring (168px)', () => {
    const { getByTestId } = render(<DonutChart series={sampleSeries} />, {
      wrapper,
    });
    expect(getByTestId('donut-ring').getAttribute('width')).toBe('168');
  });

  it('renders the sm ring (80px)', () => {
    const { getByTestId } = render(
      <DonutChart series={sampleSeries} size='sm' />,
      { wrapper },
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
      { wrapper },
    );
    const ids = getAllByTestId('donut-segment').map((el) =>
      el.getAttribute('data-segment-id'),
    );
    expect(ids).toEqual(['bitcoin', 'ethereum']);
  });

  it('renders the faint empty ring and no segments for an empty series', () => {
    const { getByTestId, queryByTestId } = render(<DonutChart series={[]} />, {
      wrapper,
    });
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
      { wrapper },
    );
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });

  describe('interactivity', () => {
    it('activates a segment on hover and dims the others', () => {
      const onActiveIdChange = vi.fn();
      const { getAllByTestId } = render(
        <DonutChart
          series={sampleSeries}
          onActiveIdChange={onActiveIdChange}
        />,
        { wrapper },
      );

      fireEvent.mouseEnter(
        getAllByTestId('donut-segment').find(
          (el) => el.getAttribute('data-segment-id') === 'ethereum',
        )!,
      );

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
        { wrapper },
      );

      fireEvent.mouseEnter(
        getAllByTestId('donut-segment').find(
          (el) => el.getAttribute('data-segment-id') === 'bitcoin',
        )!,
      );
      onActiveIdChange.mockClear();

      fireEvent.mouseLeave(getByTestId('donut-chart'));

      expect(onActiveIdChange).toHaveBeenCalledWith(null);
    });

    it('respects controlled activeId for dimming', () => {
      const { getAllByTestId } = render(
        <DonutChart series={sampleSeries} activeId='tether' />,
        { wrapper },
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
        { wrapper },
      );

      fireEvent.mouseEnter(
        getAllByTestId('donut-segment').find(
          (el) => el.getAttribute('data-segment-id') === 'ethereum',
        )!,
      );

      expect(onActiveIdChange).toHaveBeenCalledWith('ethereum');

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const bitcoin = getAllByTestId('donut-segment').find(
        (el) => el.getAttribute('data-segment-id') === 'bitcoin',
      )!;
      expect(Number(bitcoin.style.opacity)).toBe(1);

      expect(
        Number(
          getAllByTestId('donut-segment').find(
            (el) => el.getAttribute('data-segment-id') === 'ethereum',
          )!.style.opacity,
        ),
      ).toBe(chartConfig.donut.hover.dimOpacity);
    });

    it('renders with defaultActiveId in uncontrolled mode', () => {
      const { getAllByTestId } = render(
        <DonutChart series={sampleSeries} defaultActiveId='ethereum' />,
        { wrapper },
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ethereum = getAllByTestId('donut-segment').find(
        (el) => el.getAttribute('data-segment-id') === 'ethereum',
      )!;
      expect(Number(ethereum.style.opacity)).toBe(1);
      expect(ethereum.style.transform).not.toBe('translate(0px, 0px)');

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const bitcoin = getAllByTestId('donut-segment').find(
        (el) => el.getAttribute('data-segment-id') === 'bitcoin',
      )!;
      expect(Number(bitcoin.style.opacity)).toBe(
        chartConfig.donut.hover.dimOpacity,
      );
    });

    it('uses a pointer cursor on segments', () => {
      const { getAllByTestId } = render(<DonutChart series={sampleSeries} />, {
        wrapper,
      });
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
        { wrapper },
      );

      const segment = getAllByTestId('donut-segment')[0];
      fireEvent.mouseEnter(segment);

      expect(onActiveIdChange).toHaveBeenCalledWith('bitcoin');
      expect(segment.style.transform).toBe('translate(0px, 0px)');
      expect(segment.style.transition).toBe('');
      expect(Number(segment.style.opacity)).toBe(1);
    });
  });

  describe('DonutChartCenter', () => {
    it('applies the default layout classes', () => {
      const { getByTestId } = render(
        <DonutChartCenter data-testid='center' />,
        { wrapper },
      );

      expect(getByTestId('center').className).toContain(
        'pointer-events-auto flex flex-col items-center',
      );
    });

    it('lets consumers add spacing and override alignment via className', () => {
      const { getByTestId } = render(
        <DonutChartCenter
          data-testid='center'
          className='items-start gap-4 p-8'
        />,
        { wrapper },
      );

      const className = getByTestId('center').className;
      expect(className).toContain('gap-4');
      expect(className).toContain('p-8');
      expect(className).toContain('items-start');
      expect(className).not.toContain('items-center');
    });
  });

  describe('renderCenter', () => {
    it('does not render a center slot when render props are omitted', () => {
      const { queryByTestId } = render(<DonutChart series={sampleSeries} />, {
        wrapper,
      });
      expect(queryByTestId('donut-center')).toBeNull();
    });

    it('passes activeSegment=null and the full series when nothing is active', () => {
      const renderCenter = vi.fn(() => null);
      render(<DonutChart series={sampleSeries} renderCenter={renderCenter} />, {
        wrapper,
      });

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
        { wrapper },
      );

      expect(renderCenter).toHaveBeenCalledWith({
        activeSegment: { ...sampleSeries[1], percent: 30, percentLabel: '30%' },
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
              <DonutChartCenter>
                <DonutChartTitle>{activeSegment.percentLabel}</DonutChartTitle>
                <DonutChartDescription>
                  {activeSegment.label}
                </DonutChartDescription>
              </DonutChartCenter>
            ) : (
              <DonutChartCenter>
                <DonutChartTitle>{series.length}</DonutChartTitle>
              </DonutChartCenter>
            )
          }
        />,
        { wrapper },
      );

      getByText('3');
      expect(queryByText('Bitcoin')).toBeNull();

      fireEvent.mouseEnter(
        getAllByTestId('donut-segment').find(
          (el) => el.getAttribute('data-segment-id') === 'bitcoin',
        )!,
      );

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
            <DonutChartCenter>
              <DonutChartTitle>{activeSegment?.percentLabel}</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment?.label}
                <button aria-label='Bitcoin details' />
              </DonutChartDescription>
            </DonutChartCenter>
          )}
        />,
        { wrapper },
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
        { wrapper },
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
        { wrapper },
      );

      expect(renderCenterActive).toHaveBeenCalledWith({
        activeSegment: { ...sampleSeries[1], percent: 30, percentLabel: '30%' },
      });
    });

    it('keeps percent exact while percentLabel stays display-ready', () => {
      const renderCenterActive = vi.fn(() => null);
      render(
        <DonutChart
          series={[
            { id: 'sol', label: 'Solana', value: 7 },
            { id: 'rest', label: 'Rest', value: 93 },
          ]}
          defaultActiveId='sol'
          renderCenter={() => null}
          renderCenterActive={renderCenterActive}
        />,
        { wrapper },
      );

      expect(renderCenterActive).toHaveBeenCalledWith({
        activeSegment: expect.objectContaining({
          percent: (7 / 100) * 100,
          percentLabel: '7%',
        }),
      });
    });

    it('shows resting content by default and percent/label on hover', () => {
      const { getAllByTestId, getByText, queryByText } = render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId={null}
          renderCenter={({ series }) => (
            <DonutChartCenter>
              <DonutChartTitle>{series.length}</DonutChartTitle>
            </DonutChartCenter>
          )}
          renderCenterActive={({ activeSegment }) => (
            <DonutChartCenter>
              <DonutChartTitle>{activeSegment.percentLabel}</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
              </DonutChartDescription>
            </DonutChartCenter>
          )}
        />,
        { wrapper },
      );

      getByText('3');
      expect(queryByText('Bitcoin')).toBeNull();

      fireEvent.mouseEnter(
        getAllByTestId('donut-segment').find(
          (el) => el.getAttribute('data-segment-id') === 'bitcoin',
        )!,
      );

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
            <DonutChartCenter>
              <DonutChartTitle>{activeSegment.percentLabel}</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
                <button aria-label='Bitcoin details' />
              </DonutChartDescription>
            </DonutChartCenter>
          )}
        />,
        { wrapper },
      );

      getByRole('button', { name: 'Bitcoin details' });
    });

    it('keeps both resting and active content mounted and toggles visibility', () => {
      const { getAllByTestId, getByTestId, getByText, queryByTestId } = render(
        <DonutChart
          series={sampleSeries}
          defaultActiveId={null}
          renderCenter={({ series }) => (
            <DonutChartCenter>
              <DonutChartTitle data-testid='donut-center-resting'>
                {series.length}
              </DonutChartTitle>
            </DonutChartCenter>
          )}
          renderCenterActive={({ activeSegment }) => (
            <DonutChartCenter>
              <DonutChartTitle data-testid='donut-center-active'>
                {activeSegment.percentLabel}
              </DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
              </DonutChartDescription>
            </DonutChartCenter>
          )}
        />,
        { wrapper },
      );

      getByText('3');
      getByTestId('donut-center-resting');
      expect(queryByTestId('donut-center-active')).toBeNull();

      fireEvent.mouseEnter(
        getAllByTestId('donut-segment').find(
          (el) => el.getAttribute('data-segment-id') === 'bitcoin',
        )!,
      );

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
            <DonutChartCenter>
              <DonutChartTitle>{series.length}</DonutChartTitle>
            </DonutChartCenter>
          )}
          renderCenterActive={({ activeSegment }) => (
            <DonutChartCenter>
              <DonutChartTitle>{activeSegment.percentLabel}</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
              </DonutChartDescription>
            </DonutChartCenter>
          )}
        />,
        { wrapper },
      );

      fireEvent.mouseEnter(
        getAllByTestId('donut-segment').find(
          (el) => el.getAttribute('data-segment-id') === 'bitcoin',
        )!,
      );
      fireEvent.mouseLeave(getByTestId('donut-chart'));

      getByText('3');
    });
  });
});
