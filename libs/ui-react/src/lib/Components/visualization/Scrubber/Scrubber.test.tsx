import { render, act, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CartesianChart } from '../CartesianChart';
import { Scrubber } from './Scrubber';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const sampleSeries = [
  { id: 's1', stroke: '#7B61FF', data: [10, 20, 30, 40, 50] },
  { id: 's2', stroke: '#44D7B6', data: [50, 40, 30, 20, 10] },
];

const renderScrubber = ({
  scrubberProps = {},
  children,
}: {
  scrubberProps?: React.ComponentProps<typeof Scrubber>;
  children?: ReactNode;
} = {}) => {
  const result = render(
    <CartesianChart
      series={sampleSeries}
      width={400}
      height={200}
      enableScrubbing
    >
      <Scrubber {...scrubberProps} />
      {children}
    </CartesianChart>,
  );

  // Mock getBoundingClientRect on the SVG
  const svg = result.getByTestId('chart-svg');
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    right: 400,
    bottom: 200,
    width: 400,
    height: 200,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });

  return result;
};

const activateScrubber = (svg: Element, clientX = 200) => {
  act(() => {
    fireEvent.mouseMove(svg, { clientX, clientY: 100 });
    vi.advanceTimersByTime(16);
  });
};

describe('Scrubber', () => {
  it('renders nothing when no scrubber position is active', () => {
    const { queryByTestId } = renderScrubber();
    expect(queryByTestId('scrubber')).toBeNull();
  });

  it('renders the scrubber group on mousemove', () => {
    const { getByTestId } = renderScrubber();
    activateScrubber(getByTestId('chart-svg'));
    expect(getByTestId('scrubber')).toBeTruthy();
  });

  it('renders the reference line by default', () => {
    const { getByTestId } = renderScrubber();
    activateScrubber(getByTestId('chart-svg'));
    expect(getByTestId('scrubber-line')).toBeTruthy();
  });

  it('hides the reference line when hideLine is true', () => {
    const { getByTestId, queryByTestId } = renderScrubber({
      scrubberProps: { hideLine: true },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(queryByTestId('scrubber-line')).toBeNull();
  });

  it('renders the overlay by default', () => {
    const { getByTestId } = renderScrubber();
    activateScrubber(getByTestId('chart-svg'));
    expect(getByTestId('scrubber-overlay')).toBeTruthy();
  });

  it('hides the overlay when hideOverlay is true', () => {
    const { getByTestId, queryByTestId } = renderScrubber({
      scrubberProps: { hideOverlay: true },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(queryByTestId('scrubber-overlay')).toBeNull();
  });

  it('does not render beacons by default', () => {
    const { getByTestId, queryAllByTestId } = renderScrubber();
    activateScrubber(getByTestId('chart-svg'));
    expect(queryAllByTestId(/scrubber-beacon-/)).toHaveLength(0);
  });

  it('renders one beacon per series when showBeacons is true', () => {
    const { getByTestId, getAllByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(getAllByTestId(/scrubber-beacon-/)).toHaveLength(2);
  });

  it('does not render beacon labels by default', () => {
    const { getByTestId, queryAllByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(queryAllByTestId(/scrubber-beacon-label-/)).toHaveLength(0);
  });

  it('renders a label per series and implies beacons when showBeaconLabel is true', () => {
    const { getByTestId, getAllByTestId } = renderScrubber({
      scrubberProps: { showBeaconLabel: true },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(getAllByTestId(/^scrubber-beacon-label-/)).toHaveLength(2);
    expect(getAllByTestId(/^scrubber-beacon-(?!label)/)).toHaveLength(2);
  });

  it('renders the custom beaconLabel content with series and value', () => {
    const { getByTestId, getByText } = renderScrubber({
      scrubberProps: {
        showBeaconLabel: true,
        beaconLabel: ({ series, value }) => (
          <text>{`${series.id}:${value}`}</text>
        ),
      },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(getByText(/^s1:/)).toBeTruthy();
    expect(getByText(/^s2:/)).toBeTruthy();
  });

  it('repositions a beacon label when its rendered size changes', () => {
    let bboxWidth = 10;
    const callbacks: ResizeObserverCallback[] = [];
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          callbacks.push(callback);
        }
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      },
    );
    Object.defineProperty(SVGElement.prototype, 'getBBox', {
      configurable: true,
      value: () => ({ x: 0, y: 0, width: bboxWidth, height: 24 }),
    });

    try {
      const { getByTestId } = renderScrubber({
        scrubberProps: { showBeaconLabel: true },
      });
      activateScrubber(getByTestId('chart-svg'), 300);
      const label = getByTestId('scrubber-beacon-label-s1');
      const before = label.getAttribute('transform');

      bboxWidth = 300;
      act(() => callbacks.forEach((cb) => cb([], {} as ResizeObserver)));

      expect(label.getAttribute('transform')).not.toBe(before);
    } finally {
      vi.unstubAllGlobals();
      delete (SVGElement.prototype as Partial<SVGGraphicsElement>).getBBox;
    }
  });

  it('does not render the line label by default', () => {
    const { getByTestId, queryByTestId } = renderScrubber();
    activateScrubber(getByTestId('chart-svg'));
    expect(queryByTestId('scrubber-line-label')).toBeNull();
  });

  it('renders the x-axis value above the line when showLineLabel is true', () => {
    const { getByTestId } = renderScrubber({
      scrubberProps: { showLineLabel: true },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(getByTestId('scrubber-line-label').textContent).toBe('2');
  });

  it('renders the custom lineLabel content with the line label context', () => {
    const { getByTestId, getByText } = renderScrubber({
      scrubberProps: {
        showLineLabel: true,
        lineLabel: ({ dataIndex, label }) => (
          <text>{`${dataIndex}:${label}`}</text>
        ),
      },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(getByText('2:2')).toBeTruthy();
  });

  it('rests beacons at the end of each line while idle', () => {
    const { getByTestId, queryByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
    });
    expect(getByTestId('scrubber-beacon-s1')).toBeTruthy();
    expect(getByTestId('scrubber-beacon-s2')).toBeTruthy();
    expect(queryByTestId('scrubber-line')).toBeNull();
    expect(queryByTestId('scrubber-overlay')).toBeNull();
    expect(getByTestId('scrubber-beacon-s1').getAttribute('cx')).toBe(
      getByTestId('scrubber-beacon-s2').getAttribute('cx'),
    );
  });

  it('follows the pointer, then returns to the end of the line', () => {
    const { getByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
    });
    const svg = getByTestId('chart-svg');
    const idleX = getByTestId('scrubber-beacon-s1').getAttribute('cx');

    activateScrubber(svg, 100);
    expect(getByTestId('scrubber-beacon-s1').getAttribute('cx')).not.toBe(
      idleX,
    );

    act(() => {
      fireEvent.mouseLeave(svg);
    });
    expect(getByTestId('scrubber-beacon-s1').getAttribute('cx')).toBe(idleX);
  });

  it('pulses only while idle and when idlePulse is true', () => {
    const { getByTestId, queryAllByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true, idlePulse: true },
    });
    expect(queryAllByTestId('scrubber-pulse')).toHaveLength(2);

    activateScrubber(getByTestId('chart-svg'));
    expect(queryAllByTestId('scrubber-pulse')).toHaveLength(0);
  });

  it('hides beacons while loading, then reveals them once loaded', () => {
    const renderChart = (loading: boolean) => (
      <CartesianChart
        series={sampleSeries}
        width={400}
        height={200}
        enableScrubbing
        ariaBusy={loading}
      >
        <Scrubber showBeacons idlePulse />
      </CartesianChart>
    );
    const { getByTestId, queryAllByTestId, rerender } = render(
      renderChart(true),
    );
    expect(queryAllByTestId(/scrubber-beacon-/)).toHaveLength(0);
    expect(queryAllByTestId('scrubber-pulse')).toHaveLength(0);

    rerender(renderChart(false));
    expect(queryAllByTestId(/scrubber-beacon-/)).toHaveLength(2);
    expect(
      getByTestId('scrubber-beacon-s1').parentElement?.style.animation,
    ).toContain('reveal-fade');
  });

  it('does not pulse by default', () => {
    const { queryAllByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
    });
    expect(queryAllByTestId('scrubber-pulse')).toHaveLength(0);
  });

  it('hides the scrubber group on mouseleave', () => {
    const { getByTestId, queryByTestId } = renderScrubber();
    const svg = getByTestId('chart-svg');
    activateScrubber(svg);
    expect(getByTestId('scrubber')).toBeTruthy();

    act(() => {
      fireEvent.mouseLeave(svg);
    });
    expect(queryByTestId('scrubber')).toBeNull();
  });

  it('renders line at a valid x position within drawing area', () => {
    const { getByTestId } = renderScrubber();
    activateScrubber(getByTestId('chart-svg'));
    const line = getByTestId('scrubber-line');
    const x1 = parseFloat(line.getAttribute('x1') ?? '0');
    expect(x1).toBeGreaterThanOrEqual(0);
    expect(x1).toBeLessThanOrEqual(400);
  });

  it('skips beacon for a series with null at the scrubbed index', () => {
    const seriesWithNull = [
      { id: 's1', stroke: '#7B61FF', data: [10, 20, 30, 40, 50] },
      { id: 's2', stroke: '#44D7B6', data: [50, null, 30, 20, 10] },
    ];

    const result = render(
      <CartesianChart
        series={seriesWithNull}
        width={400}
        height={200}
        enableScrubbing
      >
        <Scrubber showBeacons />
      </CartesianChart>,
    );

    const svg = result.getByTestId('chart-svg');
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 400,
      bottom: 200,
      width: 400,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    act(() => {
      fireEvent.mouseMove(svg, { clientX: 100, clientY: 100 });
      vi.advanceTimersByTime(16);
    });

    const beacons = result.queryAllByTestId(/scrubber-beacon-/);
    expect(beacons.length).toBeLessThanOrEqual(1);
  });

  it('renders chart tooltip when tooltip is set', () => {
    const { getByTestId, queryByTestId } = renderScrubber({
      scrubberProps: {
        tooltip: () => ({
          items: [{ label: 'L', value: 'V' }],
        }),
      },
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
    activateScrubber(getByTestId('chart-svg'));
    expect(getByTestId('chart-tooltip')).toBeTruthy();
  });
});
