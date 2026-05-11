import { render, act, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { CartesianChart } from '../CartesianChart';
import { Scrubber } from './Scrubber';

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

  it('renders the label when a label function is provided', () => {
    const { getByTestId, getByText } = renderScrubber({
      scrubberProps: { label: (i: number) => `Index ${i}` },
    });
    activateScrubber(getByTestId('chart-svg'));
    expect(getByTestId('scrubber-label')).toBeTruthy();
    expect(getByText(/^Index \d+$/)).toBeTruthy();
  });

  it('does not render a label when no label function is provided', () => {
    const { getByTestId, queryByTestId } = renderScrubber();
    activateScrubber(getByTestId('chart-svg'));
    expect(queryByTestId('scrubber-label')).toBeNull();
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
    });

    const beacons = result.queryAllByTestId(/scrubber-beacon-/);
    expect(beacons.length).toBeLessThanOrEqual(1);
  });
});
