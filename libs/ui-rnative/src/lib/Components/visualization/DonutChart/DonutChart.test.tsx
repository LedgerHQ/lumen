import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { RuntimeConstants } from '../../../utils';
import { ThemeProvider } from '../../core/ThemeProvider';

import { chartConfig, DONUT_GEOMETRY, type DonutGeometry } from '../config';
import { DonutChart } from './DonutChart';
import { DonutChartAnimatedCenter } from './DonutChartAnimatedCenter';
import { DonutChartCenter } from './DonutChartCenter';
import { DonutChartDescription } from './DonutChartDescription';
import { DonutChartTitle } from './DonutChartTitle';
import { DonutSizeProvider } from './donutSizeContext';
import type { DonutSegment, DonutSize, DonutTitleSize } from './types';
import {
  buildRingSegments,
  getCenterContentInset,
  getCenterMaxWidth,
} from './utils';

const sampleSeries: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 50 },
  { id: 'ethereum', label: 'Ethereum', value: 30 },
  { id: 'tether', label: 'Tether', value: 20 },
];

const placeholderCount = chartConfig.donut.placeholder.segmentValues.length;

const typographyTokens = ledgerLiveThemes.light.typographies.sm;
const typographies = {
  ...typographyTokens.heading,
  ...typographyTokens.body,
};

const renderWithTheme = (children: React.ReactNode) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      {children}
    </ThemeProvider>,
  );

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
  const segment = buildRingSegments(series, geometry).find((s) => s.id === id);
  if (!segment) throw new Error(`No segment "${id}"`);
  const midRadius = (geometry.innerRadius + geometry.outerRadius) / 2;
  return toOverlayPoint(
    {
      x: Math.sin(segment.midAngle) * midRadius,
      y: -Math.cos(segment.midAngle) * midRadius,
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

  describe('loading', () => {
    it('renders the animated placeholder instead of real segments', () => {
      const { getByTestId, queryByTestId } = renderDonut({ loading: true });

      getByTestId('donut-loading');
      expect(queryByTestId('donut-segment')).toBeNull();
      expect(queryByTestId('donut-empty')).toBeNull();
    });

    it('renders one placeholder path per configured placeholder segment', () => {
      const { getAllByTestId } = renderDonut({ loading: true });

      expect(getAllByTestId('donut-placeholder')).toHaveLength(
        placeholderCount,
      );
    });

    it('animates the placeholder paths while loading', () => {
      const { getAllByTestId } = renderDonut({ loading: true });

      getAllByTestId('donut-placeholder').forEach((segment) => {
        expect(segment.props.animatedProps).toBeDefined();
      });
    });

    it('leaves the empty-ring placeholder static when not loading', () => {
      const { getAllByTestId } = renderDonut({ series: [] });

      getAllByTestId('donut-placeholder').forEach((segment) => {
        expect(segment.props.animatedProps).toBeUndefined();
      });
    });

    it('marks the ring busy and swaps in the loading label', () => {
      const { getByTestId } = renderDonut({
        loading: true,
        accessibilityLabel: 'Portfolio breakdown',
      });

      const ring = getByTestId('donut-ring');
      expect(ring.props.accessibilityState).toEqual({ busy: true });
      expect(ring.props.accessibilityLabel).toBe(
        chartConfig.donut.loading.ariaLabel,
      );
    });

    it('ignores taps while loading', () => {
      const onActiveIdChange = jest.fn();
      const { getByTestId } = renderDonut({ loading: true, onActiveIdChange });

      tapSegment(getByTestId, sampleSeries, 'ethereum');

      expect(onActiveIdChange).not.toHaveBeenCalled();
    });

    it('keeps rendering the center content, left to the consumer', () => {
      const renderCenter = jest.fn(() => null);
      const { getByTestId } = renderDonut({
        loading: true,
        renderCenter,
      });

      getByTestId('donut-center');
      expect(renderCenter).toHaveBeenCalled();
    });
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

      expect(
        getSegment(getAllByTestId, 'bitcoin')?.props.accessibilityLabel,
      ).toBe('bitcoin, selected');
      expect(
        getSegment(getAllByTestId, 'ethereum')?.props.accessibilityLabel,
      ).toBe('ethereum');
    });

    it('renders with defaultActiveId in uncontrolled mode', () => {
      const { getAllByTestId } = renderDonut({
        defaultActiveId: 'ethereum',
      });

      expect(
        getSegment(getAllByTestId, 'ethereum')?.props.accessibilityLabel,
      ).toBe('ethereum, selected');
      expect(
        getSegment(getAllByTestId, 'bitcoin')?.props.accessibilityLabel,
      ).toBe('bitcoin');
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

  describe('DonutRing', () => {
    it('uses the default mark fill color when a segment has no color override', () => {
      const { getAllByTestId } = renderDonut({});
      getAllByTestId('donut-segment').forEach((segment) => {
        expect(segment.props.fill).toBe(
          ledgerLiveThemes.light.colors.bg.mutedStrong,
        );
      });
    });

    it("uses the segment's color override instead of the default fill", () => {
      const { getByTestId } = renderDonut({
        series: [
          { id: 'bitcoin', label: 'Bitcoin', value: 100, color: '#f7931a' },
        ],
      });
      expect(getByTestId('donut-segment').props.fill).toBe('#f7931a');
    });

    it('fills the empty ring with the muted surface color', () => {
      const { getAllByTestId } = renderDonut({ series: [] });
      getAllByTestId('donut-placeholder').forEach((segment) => {
        expect(segment.props.fill).toBe(ledgerLiveThemes.light.colors.bg.muted);
      });
    });

    it('forwards the accessibility label to the underlying svg', () => {
      const { getByTestId } = renderDonut({
        accessibilityLabel: 'Portfolio breakdown',
      });
      expect(getByTestId('donut-ring').props.accessibilityLabel).toBe(
        'Portfolio breakdown',
      );
    });

    describe('reveal animation', () => {
      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('renders without errors when reduced motion is preferred', () => {
        const Reanimated = jest.requireMock('react-native-reanimated') as {
          useReducedMotion: () => boolean;
        };
        jest.spyOn(Reanimated, 'useReducedMotion').mockReturnValue(true);
        const { getByTestId } = renderDonut({});
        getByTestId('donut-ring');
      });

      it('renders without errors on Android', () => {
        jest.spyOn(RuntimeConstants, 'isAndroid', 'get').mockReturnValue(true);
        const { getByTestId } = renderDonut({});
        getByTestId('donut-ring');
      });
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

  describe('DonutChartTitle', () => {
    const renderTitle = (
      donutSize: DonutSize,
      props: Partial<React.ComponentProps<typeof DonutChartTitle>> = {},
    ) =>
      renderWithTheme(
        <DonutSizeProvider value={{ size: donutSize }}>
          <DonutChartTitle {...props}>42</DonutChartTitle>
        </DonutSizeProvider>,
      );

    it.each<[DonutSize, DonutTitleSize | undefined, keyof typeof typographies]>(
      [
        ['md', undefined, 'heading1SemiBold'],
        ['md', 'sm', 'heading2SemiBold'],
        ['sm', undefined, 'heading4SemiBold'],
        ['sm', 'sm', 'body2SemiBold'],
      ],
    )(
      'applies %s ring / %s title typography',
      (donutSize, titleSize, expectedKey) => {
        const { getByText } = renderTitle(
          donutSize,
          titleSize ? { size: titleSize } : {},
        );
        const style = getByText('42').props.style;
        const expected = typographies[expectedKey];
        expect(style.fontSize).toBe(expected.fontSize);
        expect(style.fontWeight).toBe(expected.fontWeight);
      },
    );

    it.each(['md', 'sm'] as const)(
      'applies %s-ring horizontal padding from contentInset',
      (donutSize) => {
        const { getByText } = renderTitle(donutSize);
        expect(getByText('42').props.style.paddingHorizontal).toBe(
          getCenterContentInset(donutSize),
        );
      },
    );

    it('defaults to md ring sizing without a DonutSizeProvider ancestor', () => {
      const { getByText } = renderWithTheme(
        <DonutChartTitle>42</DonutChartTitle>,
      );

      const style = getByText('42').props.style;
      expect(style.fontSize).toBe(typographies.heading1SemiBold.fontSize);
    });

    it('truncates to a single line with a tail ellipsis by default', () => {
      const { getByText } = renderTitle('md');

      const title = getByText('42');
      expect(title.props.numberOfLines).toBe(1);
      expect(title.props.ellipsizeMode).toBe('tail');
    });

    it('lets consumers override numberOfLines and ellipsizeMode', () => {
      const { getByText } = renderTitle('md', {
        numberOfLines: 2,
        ellipsizeMode: 'head',
      });

      const title = getByText('42');
      expect(title.props.numberOfLines).toBe(2);
      expect(title.props.ellipsizeMode).toBe('head');
    });

    it('merges a custom style with the computed max width and centering', () => {
      const { getByText } = renderTitle('md', {
        style: { fontStyle: 'italic' },
      });

      const style = getByText('42').props.style;
      expect(style.fontStyle).toBe('italic');
      expect(style.textAlign).toBe('center');
      expect(style.maxWidth).toBe(getCenterMaxWidth('md'));
    });
  });

  describe('DonutChartDescription', () => {
    const renderDescription = (
      donutSize: DonutSize,
      children: React.ReactNode,
      props: Partial<React.ComponentProps<typeof DonutChartDescription>> = {},
    ) =>
      renderWithTheme(
        <DonutSizeProvider value={{ size: donutSize }}>
          <DonutChartDescription {...props}>{children}</DonutChartDescription>
        </DonutSizeProvider>,
      );

    it.each<[DonutSize, keyof typeof typographies]>([
      ['md', 'body3'],
      ['sm', 'body4'],
    ])(
      'applies the %s ring typography for text children',
      (donutSize, expectedKey) => {
        const { getByText } = renderDescription(donutSize, 'Bitcoin');

        const style = getByText('Bitcoin').props.style;
        const expected = typographies[expectedKey];
        expect(style.fontSize).toBe(expected.fontSize);
        expect(style.fontWeight).toBe(expected.fontWeight);
      },
    );

    it.each(['md', 'sm'] as const)(
      'applies %s-ring horizontal padding from contentInset',
      (donutSize) => {
        const { getByText } = renderDescription(donutSize, 'Bitcoin');
        expect(getByText('Bitcoin').props.style.paddingHorizontal).toBe(
          getCenterContentInset(donutSize),
        );
      },
    );

    it('renders text children as a single truncated, centered, muted line', () => {
      const { getByText } = renderDescription('md', 'Bitcoin');

      const text = getByText('Bitcoin');
      expect(text.props.numberOfLines).toBe(1);
      expect(text.props.ellipsizeMode).toBe('tail');
      expect(text.props.style.textAlign).toBe('center');
      expect(text.props.style.color).toBe(
        ledgerLiveThemes.light.colors.text.muted,
      );
    });

    it('defaults to md ring sizing without a DonutSizeProvider ancestor', () => {
      const { getByText } = renderWithTheme(
        <DonutChartDescription>Bitcoin</DonutChartDescription>,
      );

      expect(getByText('Bitcoin').props.style.fontSize).toBe(
        typographies.body3.fontSize,
      );
    });

    it('renders non-text children as a row container instead of truncated text', () => {
      const { getByTestId, getByText } = renderDescription(
        'md',
        <>
          <Text testID='description-icon'>●</Text>
          <Text>Bitcoin</Text>
        </>,
      );

      getByTestId('description-icon');
      getByText('Bitcoin');
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
        activeSegment: { ...sampleSeries[1], percent: 30, percentLabel: '30%' },
        series: sampleSeries,
      });
    });

    it('renders the count by default and the percent/label when active', () => {
      const { getByTestId, getByText, queryByText } = renderDonut({
        defaultActiveId: null,
        renderCenter: ({ activeSegment, series }) =>
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
        activeSegment: { ...sampleSeries[1], percent: 30, percentLabel: '30%' },
      });
    });

    it('keeps percent exact while percentLabel stays display-ready', () => {
      const renderCenterActive = jest.fn(() => null);
      renderDonut({
        series: [
          { id: 'sol', label: 'Solana', value: 7 },
          { id: 'rest', label: 'Rest', value: 93 },
        ],
        defaultActiveId: 'sol',
        renderCenter: () => null,
        renderCenterActive,
      });

      expect(renderCenterActive).toHaveBeenCalledWith({
        activeSegment: expect.objectContaining({
          percent: (7 / 100) * 100,
          percentLabel: '7%',
        }),
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
            <DonutChartTitle>{activeSegment.percentLabel}</DonutChartTitle>
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
              {activeSegment.percentLabel}
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
            <DonutChartTitle>{activeSegment.percentLabel}</DonutChartTitle>
            <DonutChartDescription>{activeSegment.label}</DonutChartDescription>
          </DonutChartCenter>
        ),
      });

      tapSegment(getByTestId, sampleSeries, 'bitcoin');
      getByText('50%');

      tapSegment(getByTestId, sampleSeries, 'bitcoin');

      getByText('3');
    });
  });

  describe('DonutChartAnimatedCenter', () => {
    const activeSegment = {
      ...sampleSeries[0],
      percent: 50,
      percentLabel: '50%',
    };

    const renderAnimatedCenter = (
      props: Partial<
        React.ComponentProps<typeof DonutChartAnimatedCenter>
      > = {},
    ) => {
      const renderResting = jest.fn(() => <Text testID='resting'>rest</Text>);
      const renderActive = jest.fn((segment: DonutSegment) => (
        <Text testID='active'>{segment.label}</Text>
      ));
      const utils = render(
        <DonutChartAnimatedCenter
          activeSegment={null}
          contentWidth={100}
          renderResting={renderResting}
          renderActive={renderActive}
          {...props}
        />,
      );
      return { ...utils, renderResting, renderActive };
    };

    it('renders only the resting content on mount when nothing is active', () => {
      const { getByTestId, queryByTestId, renderResting, renderActive } =
        renderAnimatedCenter();

      getByTestId('resting');
      expect(queryByTestId('active')).toBeNull();
      expect(renderResting).toHaveBeenCalledTimes(1);
      expect(renderActive).not.toHaveBeenCalled();
    });

    it('renders both panes immediately when mounted with an already-active segment', () => {
      const { getByTestId, renderActive } = renderAnimatedCenter({
        activeSegment,
      });

      getByTestId('resting', { includeHiddenElements: true });
      getByTestId('active');
      expect(renderActive).toHaveBeenCalledWith(activeSegment);
    });

    it('keeps the active pane mounted after the segment is deactivated', () => {
      const { getByTestId, queryByTestId, rerender } = render(
        <DonutChartAnimatedCenter
          activeSegment={activeSegment}
          contentWidth={100}
          renderResting={() => <Text testID='resting'>rest</Text>}
          renderActive={(segment) => (
            <Text testID='active'>{segment.label}</Text>
          )}
        />,
      );
      getByTestId('active');

      rerender(
        <DonutChartAnimatedCenter
          activeSegment={null}
          contentWidth={100}
          renderResting={() => <Text testID='resting'>rest</Text>}
          renderActive={(segment) => (
            <Text testID='active'>{segment.label}</Text>
          )}
        />,
      );

      expect(
        queryByTestId('active', { includeHiddenElements: true }),
      ).not.toBeNull();
    });

    it('hides the resting pane from accessibility while the active pane is shown', () => {
      const { getByTestId, rerender } = renderAnimatedCenter();

      expect(getByTestId('resting').parent?.parent?.props).toMatchObject({
        accessibilityElementsHidden: false,
        pointerEvents: 'auto',
      });

      rerender(
        <DonutChartAnimatedCenter
          activeSegment={activeSegment}
          contentWidth={100}
          renderResting={() => <Text testID='resting'>rest</Text>}
          renderActive={() => <Text testID='active'>active</Text>}
        />,
      );

      expect(
        getByTestId('resting', { includeHiddenElements: true }).parent?.parent
          ?.props,
      ).toMatchObject({
        accessibilityElementsHidden: true,
        pointerEvents: 'none',
      });
      expect(getByTestId('active').parent?.parent?.props).toMatchObject({
        accessibilityElementsHidden: false,
        pointerEvents: 'auto',
      });
    });
  });
});
