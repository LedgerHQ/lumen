import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { fireEvent, render } from '@testing-library/react-native';

import { DONUT_GEOMETRY, type DonutGeometry } from './constants';
import { DonutChart } from './DonutChart';
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

// Inverse of `toRingLocalPoint`: maps an arc-space point back to the gesture
// overlay's screen-pixel space, so tests can drive the same tap-to-segment
// path the real gesture callback uses.
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
});
