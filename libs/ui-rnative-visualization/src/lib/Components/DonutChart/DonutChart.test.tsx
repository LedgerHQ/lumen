import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { fireEvent, render } from '@testing-library/react-native';

import { DonutChart } from './DonutChart';
import type { DonutSegment } from './types';

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

    it('activates a segment on press and marks it selected', () => {
      const onActiveIdChange = jest.fn();
      const { getAllByTestId } = renderDonut({ onActiveIdChange });

      fireEvent.press(getSegment(getAllByTestId, 'ethereum')!);

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

    it('deselects the active segment when pressed again', () => {
      const onActiveIdChange = jest.fn();
      const { getAllByTestId } = renderDonut({ onActiveIdChange });

      fireEvent.press(getSegment(getAllByTestId, 'bitcoin')!);
      onActiveIdChange.mockClear();

      fireEvent.press(getSegment(getAllByTestId, 'bitcoin')!);

      expect(onActiveIdChange).toHaveBeenCalledWith(null);
      getAllByTestId('donut-segment').forEach((segment) => {
        expect(segment.props.accessibilityLabel).toBe(segment.props.id);
      });
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
      const { getAllByTestId } = renderDonut({
        activeId: 'bitcoin',
        onActiveIdChange,
      });

      fireEvent.press(getSegment(getAllByTestId, 'ethereum')!);

      expect(onActiveIdChange).toHaveBeenCalledWith('ethereum');

      const bitcoin = getSegment(getAllByTestId, 'bitcoin')!;
      expect(bitcoin.props.accessibilityLabel).toBe('bitcoin, selected');
      expect(
        getSegment(getAllByTestId, 'ethereum')!.props.accessibilityLabel,
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
      const { getAllByTestId } = renderDonut({
        series: [{ id: 'bitcoin', label: 'Bitcoin', value: 100 }],
        onActiveIdChange,
      });

      fireEvent.press(getAllByTestId('donut-segment')[0]);

      expect(onActiveIdChange).toHaveBeenCalledWith('bitcoin');
      expect(getAllByTestId('donut-segment')[0].props.accessibilityLabel).toBe(
        'bitcoin, selected',
      );
    });
  });
});
