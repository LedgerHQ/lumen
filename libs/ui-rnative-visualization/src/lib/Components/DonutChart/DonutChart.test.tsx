import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { DONUT_GEOMETRY, type DonutGeometry } from '../../config';
import { DonutChart } from './DonutChart';
import { DonutChartAnimatedCenter } from './DonutChartAnimatedCenter';
import { DonutChartCenter } from './DonutChartCenter';
import { DonutChartDescription } from './DonutChartDescription';
import { DonutChartTitle } from './DonutChartTitle';
import type { DonutSegment } from './types';
import { buildArcs } from './utils';

const sampleSeries: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 50 },
  { id: 'ethereum', label: 'Ethereum', value: 30 },
  { id: 'tether', label: 'Tether', value: 20 },
];

const renderDonut = (props: Partial<React.ComponentProps<typeof DonutChart>>) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      <DonutChart series={sampleSeries} {...props} />
    </ThemeProvider>,
  );

const toOverlayPoint = (
  local: { x: number; y: number },
  geometry: DonutGeometry,
): { x: number; y: number } => {
  const { box, activeOffset } = geometry;
  const scale = (box + 2 * activeOffset) / box;
  const center = box / 2;
  return {
    x: (local.x + activeOffset + center) / scale,
    y: (local.y + activeOffset + center) / scale,
  };
};

const pointForSegment = (
  series: DonutSegment[],
  id: string,
  geometry: DonutGeometry = DONUT_GEOMETRY.md,
): { x: number; y: number } => {
  const arc = buildArcs(series, geometry).find((a) => a.id === id);
  if (!arc) throw new Error(`No arc for segment "${id}"`);
  const midRadius = (geometry.innerRadius + geometry.outerRadius) / 2;
  return toOverlayPoint(
    {
      x: Math.sin(arc.midAngle) * midRadius,
      y: -Math.cos(arc.midAngle) * midRadius,
    },
    geometry,
  );
};

const tapSegment = (
  getByTestId: ReturnType<typeof render>['getByTestId'],
  series: DonutSegment[],
  id: string,
  geometry: DonutGeometry = DONUT_GEOMETRY.md,
): void => {
  fireEvent(
    getByTestId('donut-gesture-overlay'),
    'end',
    pointForSegment(series, id, geometry),
    true,
  );
};

describe('DonutChart', () => {
  it('renders the ring', () => {
    const { getByTestId } = renderDonut({});
    getByTestId('donut-ring');
  });

  it('renders one segment path per series entry', () => {
    const { getAllByTestId } = renderDonut({});
    expect(getAllByTestId('donut-segment')).toHaveLength(3);
  });

  it('renders segments in series order', () => {
    const { getAllByTestId } = renderDonut({});
    const ids = getAllByTestId('donut-segment').map((el) => el.props.id);
    expect(ids).toEqual(['bitcoin', 'ethereum', 'tether']);
  });

  it('defaults to the md ring (168px)', () => {
    const { getByTestId } = renderDonut({});
    expect(getByTestId('donut-ring').props.width).toBe(168);
  });

  it('renders the sm ring (80px)', () => {
    const { getByTestId } = renderDonut({ size: 'sm' });
    expect(getByTestId('donut-ring').props.width).toBe(80);
  });

  it('renders the tap gesture overlay', () => {
    const { getByTestId } = renderDonut({});
    getByTestId('donut-gesture-overlay');
  });

  it('skips zero-value segments and renders only the positive ones', () => {
    const { getAllByTestId } = renderDonut({
      series: [
        { id: 'bitcoin', label: 'Bitcoin', value: 60 },
        { id: 'empty', label: 'Empty', value: 0 },
        { id: 'ethereum', label: 'Ethereum', value: 40 },
      ],
    });
    const ids = getAllByTestId('donut-segment').map((el) => el.props.id);
    expect(ids).toEqual(['bitcoin', 'ethereum']);
  });

  it('renders the faint empty ring and no segments for an empty series', () => {
    const { getByTestId, queryByTestId } = renderDonut({ series: [] });
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });

  it('renders the empty ring when every value is zero', () => {
    const { getByTestId, queryByTestId } = renderDonut({
      series: [
        { id: 'a', label: 'A', value: 0 },
        { id: 'b', label: 'B', value: 0 },
      ],
    });
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });

  describe('interactivity', () => {
    const getSegment = (
      getAllByTestId: ReturnType<typeof render>['getAllByTestId'],
      id: string,
    ) => getAllByTestId('donut-segment').find((el) => el.props.id === id);

    it('activates a segment on tap and marks it selected', () => {
      const onActiveIdChange = jest.fn();
      const { getByTestId, getAllByTestId } = renderDonut({
        onActiveIdChange,
      });

      tapSegment(getByTestId, sampleSeries, 'ethereum');

      expect(onActiveIdChange).toHaveBeenCalledWith('ethereum');

      getAllByTestId('donut-segment').forEach((segment) => {
        const label = segment.props.accessibilityLabel;
        if (segment.props.id === 'ethereum') {
          expect(label).toBe('ethereum, selected');
        } else {
          expect(label).toBe(segment.props.id);
        }
      });
    });

    it('deselects the active segment when tapped again', () => {
      const onActiveIdChange = jest.fn();
      const { getByTestId, getAllByTestId } = renderDonut({
        onActiveIdChange,
      });

      tapSegment(getByTestId, sampleSeries, 'bitcoin');
      onActiveIdChange.mockClear();

      tapSegment(getByTestId, sampleSeries, 'bitcoin');

      expect(onActiveIdChange).toHaveBeenCalledWith(null);
      getAllByTestId('donut-segment').forEach((segment) => {
        expect(segment.props.accessibilityLabel).toBe(segment.props.id);
      });
    });

    it('ignores taps outside the ring band (the empty hole)', () => {
      const onActiveIdChange = jest.fn();
      const { getByTestId } = renderDonut({ onActiveIdChange });

      const { box } = DONUT_GEOMETRY.md;
      fireEvent(
        getByTestId('donut-gesture-overlay'),
        'end',
        { x: box / 2, y: box / 2 },
        true,
      );

      expect(onActiveIdChange).not.toHaveBeenCalled();
    });

    it('ignores a rejected/cancelled tap even over a segment', () => {
      const onActiveIdChange = jest.fn();
      const { getByTestId } = renderDonut({ onActiveIdChange });

      fireEvent(
        getByTestId('donut-gesture-overlay'),
        'end',
        pointForSegment(sampleSeries, 'ethereum'),
        false,
      );

      expect(onActiveIdChange).not.toHaveBeenCalled();
    });

    it('respects controlled activeId for selection state', () => {
      const { getAllByTestId } = renderDonut({ activeId: 'tether' });

      getAllByTestId('donut-segment').forEach((segment) => {
        const label = segment.props.accessibilityLabel;
        if (segment.props.id === 'tether') {
          expect(label).toBe('tether, selected');
        } else {
          expect(label).toBe(segment.props.id);
        }
      });
    });

    it('calls onActiveIdChange in controlled mode without self-updating', () => {
      const onActiveIdChange = jest.fn();
      const { getByTestId, getAllByTestId } = renderDonut({
        activeId: 'bitcoin',
        onActiveIdChange,
      });

      tapSegment(getByTestId, sampleSeries, 'ethereum');

      expect(onActiveIdChange).toHaveBeenCalledWith('ethereum');

      const bitcoin = getSegment(getAllByTestId, 'bitcoin')!;
      expect(bitcoin.props.accessibilityLabel).toBe('bitcoin, selected');
      expect(
        getSegment(getAllByTestId, 'ethereum')?.props.accessibilityLabel,
      ).toBe('ethereum');
    });

    it('renders with defaultActiveId in uncontrolled mode', () => {
      const { getAllByTestId } = renderDonut({
        defaultActiveId: 'ethereum',
      });

      const ethereum = getSegment(getAllByTestId, 'ethereum')!;
      expect(ethereum.props.accessibilityLabel).toBe('ethereum, selected');

      const bitcoin = getSegment(getAllByTestId, 'bitcoin')!;
      expect(bitcoin.props.accessibilityLabel).toBe('bitcoin');
    });

    it('still fires onActiveIdChange for a single segment', () => {
      const onActiveIdChange = jest.fn();
      const singleSeries: DonutSegment[] = [
        { id: 'bitcoin', label: 'Bitcoin', value: 100 },
      ];
      const { getByTestId, getAllByTestId } = renderDonut({
        series: singleSeries,
        onActiveIdChange,
      });

      tapSegment(getByTestId, singleSeries, 'bitcoin');

      expect(onActiveIdChange).toHaveBeenCalledWith('bitcoin');
      expect(getAllByTestId('donut-segment')[0].props.accessibilityLabel).toBe(
        'bitcoin, selected',
      );
    });
  });

  describe('DonutChartCenter', () => {
    const renderCenterComponent = (
      props: Partial<React.ComponentProps<typeof DonutChartCenter>>,
    ) =>
      render(
        <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
          <DonutChartCenter testID='center' {...props} />
        </ThemeProvider>,
      );

    it('applies the default centered layout', () => {
      const { getByTestId } = renderCenterComponent({});

      expect(getByTestId('center').props.style).toMatchObject({
        alignItems: 'center',
      });
    });

    it('lets consumers override alignment via lx', () => {
      const { getByTestId } = renderCenterComponent({
        lx: { alignItems: 'flex-start' },
      });

      expect(getByTestId('center').props.style).toMatchObject({
        alignItems: 'flex-start',
      });
    });
  });

  describe('renderCenter', () => {
    it('does not render a center slot when renderCenter is omitted', () => {
      const { queryByTestId } = renderDonut({});
      expect(queryByTestId('donut-center')).toBeNull();
    });

    it('passes activeSegment=null and the full series when nothing is active', () => {
      const renderCenter = jest.fn(() => null);
      renderDonut({ renderCenter });

      expect(renderCenter).toHaveBeenCalledWith({
        activeSegment: null,
        series: sampleSeries,
      });
    });

    it('enriches activeSegment with its computed percent', () => {
      const renderCenter = jest.fn(() => null);
      renderDonut({ defaultActiveId: 'ethereum', renderCenter });

      expect(renderCenter).toHaveBeenCalledWith({
        activeSegment: { ...sampleSeries[1], percent: 30 },
        series: sampleSeries,
      });
    });

    it('renders the count by default and the percent/label when active', () => {
      const { getByTestId, getByText, queryByText } = renderDonut({
        defaultActiveId: null,
        renderCenter: ({ activeSegment, series }) =>
          activeSegment ? (
            <DonutChartCenter>
              <DonutChartTitle>{activeSegment.percent}%</DonutChartTitle>
              <DonutChartDescription>
                {activeSegment.label}
              </DonutChartDescription>
            </DonutChartCenter>
          ) : (
            <DonutChartCenter>
              <DonutChartTitle>{series.length}</DonutChartTitle>
            </DonutChartCenter>
          ),
      });

      getByText('3');
      expect(queryByText('Bitcoin')).toBeNull();

      tapSegment(getByTestId, sampleSeries, 'bitcoin');

      getByText('50%');
      getByText('Bitcoin');
      expect(queryByText('3')).toBeNull();
    });
  });

  describe('renderCenterActive', () => {
    it('calls renderCenter with activeSegment=null for the resting slot', () => {
      const renderCenter = jest.fn(() => null);
      const renderCenterActive = jest.fn(() => null);
      renderDonut({ renderCenter, renderCenterActive });

      expect(renderCenter).toHaveBeenCalledWith({
        activeSegment: null,
        series: sampleSeries,
      });
    });

    it('passes the enriched active segment to renderCenterActive', () => {
      const renderCenterActive = jest.fn(() => null);
      renderDonut({
        defaultActiveId: 'ethereum',
        renderCenter: () => null,
        renderCenterActive,
      });

      expect(renderCenterActive).toHaveBeenCalledWith({
        activeSegment: { ...sampleSeries[1], percent: 30 },
      });
    });

    it('shows resting content by default and percent/label on tap', () => {
      const { getByTestId, getByText, queryByText } = renderDonut({
        defaultActiveId: null,
        renderCenter: ({ series }) => (
          <DonutChartCenter>
            <DonutChartTitle>{series.length}</DonutChartTitle>
          </DonutChartCenter>
        ),
        renderCenterActive: ({ activeSegment }) => (
          <DonutChartCenter>
            <DonutChartTitle>{activeSegment.percent}%</DonutChartTitle>
            <DonutChartDescription>{activeSegment.label}</DonutChartDescription>
          </DonutChartCenter>
        ),
      });

      getByText('3');
      expect(queryByText('Bitcoin')).toBeNull();

      tapSegment(getByTestId, sampleSeries, 'bitcoin');

      getByText('50%');
      getByText('Bitcoin');
    });

    it('keeps both resting and active content mounted and toggles visibility', () => {
      const { getByTestId, getByText, queryByTestId } = renderDonut({
        defaultActiveId: null,
        renderCenter: ({ series }) => (
          <DonutChartCenter>
            <DonutChartTitle testID='donut-center-resting'>
              {series.length}
            </DonutChartTitle>
          </DonutChartCenter>
        ),
        renderCenterActive: ({ activeSegment }) => (
          <DonutChartCenter>
            <DonutChartTitle testID='donut-center-active'>
              {activeSegment.percent}%
            </DonutChartTitle>
            <DonutChartDescription>{activeSegment.label}</DonutChartDescription>
          </DonutChartCenter>
        ),
      });

      getByText('3');
      getByTestId('donut-center-resting');
      expect(queryByTestId('donut-center-active')).toBeNull();

      tapSegment(getByTestId, sampleSeries, 'bitcoin');

      getByText('50%');
      getByText('Bitcoin');
      getByTestId('donut-center-active');
    });

    it('shows resting content again after deselecting', () => {
      const { getByTestId, getByText } = renderDonut({
        defaultActiveId: null,
        renderCenter: ({ series }) => (
          <DonutChartCenter>
            <DonutChartTitle>{series.length}</DonutChartTitle>
          </DonutChartCenter>
        ),
        renderCenterActive: ({ activeSegment }) => (
          <DonutChartCenter>
            <DonutChartTitle>{activeSegment.percent}%</DonutChartTitle>
            <DonutChartDescription>{activeSegment.label}</DonutChartDescription>
          </DonutChartCenter>
        ),
      });

      tapSegment(getByTestId, sampleSeries, 'bitcoin');
      getByText('50%');

      tapSegment(getByTestId, sampleSeries, 'bitcoin');

      getByText('3');
    });

    it('invokes each render callback once on mount', () => {
      const renderResting = jest.fn(() => <Text>rest</Text>);
      const renderActive = jest.fn(() => <Text>active</Text>);

      render(
        <DonutChartAnimatedCenter
          activeSegment={null}
          contentWidth={100}
          renderResting={renderResting}
          renderActive={renderActive}
        />,
      );

      expect(renderResting).toHaveBeenCalledTimes(1);
      expect(renderActive).not.toHaveBeenCalled();
    });
  });
});
