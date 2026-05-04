import { fireEvent, render, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { CartesianChart } from '../CartesianChart';
import { useScrubberContext } from './context';

const sampleSeries = [{ id: 's1', stroke: '#000', data: [10, 20, 30, 40, 50] }];

/**
 * Renders a CartesianChart with scrubbing enabled. A child component reads the
 * scrubber context and exposes the current position via a test-id attribute so
 * assertions can inspect it without coupling to visual output.
 */
function ScrubberPositionDisplay() {
  const { scrubberPosition } = useScrubberContext();
  return (
    <text
      data-testid='scrubber-position'
      data-value={scrubberPosition ?? 'undefined'}
    />
  );
}

const renderWithScrubbing = ({
  onScrubberPositionChange,
  children,
}: {
  onScrubberPositionChange?: (index: number | undefined) => void;
  children?: ReactNode;
} = {}) =>
  render(
    <CartesianChart
      series={sampleSeries}
      width={400}
      height={200}
      enableScrubbing
      onScrubberPositionChange={onScrubberPositionChange}
    >
      <ScrubberPositionDisplay />
      {children}
    </CartesianChart>,
  );

describe('ScrubberProvider', () => {
  it('renders children without error', () => {
    const { getByTestId } = renderWithScrubbing();
    expect(getByTestId('scrubber-position')).toBeTruthy();
  });

  it('starts with no scrubber position (undefined)', () => {
    const { getByTestId } = renderWithScrubbing();
    expect(getByTestId('scrubber-position').dataset.value).toBe('undefined');
  });

  it('updates position on mousemove', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    // Mock getBoundingClientRect so the pixel offset is predictable
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
      fireEvent.mouseMove(svg, { clientX: 200, clientY: 100 });
    });

    expect(onChange).toHaveBeenCalled();
    const calledWith = onChange.mock.calls[0][0];
    expect(typeof calledWith).toBe('number');
  });

  it('clears position on mouseleave', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

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
    act(() => {
      fireEvent.mouseLeave(svg);
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toBeUndefined();
  });

  it('does not update position when enableScrubbing is false', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <CartesianChart
        series={sampleSeries}
        width={400}
        height={200}
        enableScrubbing={false}
        onScrubberPositionChange={onChange}
      />,
    );
    const svg = getByTestId('chart-svg');

    // No ScrubberProvider is mounted, so no listeners → onChange never called
    act(() => {
      fireEvent.mouseMove(svg, { clientX: 200, clientY: 100 });
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('updates position on ArrowRight key', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

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

    // First move to set an initial position
    act(() => {
      fireEvent.mouseMove(svg, { clientX: 0, clientY: 0 });
    });

    const initialIndex = onChange.mock.calls[0]?.[0] ?? 0;

    act(() => {
      fireEvent.keyDown(svg, { key: 'ArrowRight' });
    });

    const lastIndex = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastIndex).toBeGreaterThan(initialIndex);
  });

  it('clears position on Escape key', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

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
      fireEvent.mouseMove(svg, { clientX: 200, clientY: 100 });
    });
    act(() => {
      fireEvent.keyDown(svg, { key: 'Escape' });
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toBeUndefined();
  });

  it('makes the SVG focusable when enableScrubbing is true', () => {
    const { getByTestId } = renderWithScrubbing();
    const svg = getByTestId('chart-svg');
    expect(svg.getAttribute('tabindex')).toBe('0');
  });

  it('does not set tabIndex when enableScrubbing is false', () => {
    const { getByTestId } = render(
      <CartesianChart series={sampleSeries} width={400} height={200} />,
    );
    const svg = getByTestId('chart-svg');
    expect(svg.getAttribute('tabindex')).toBeNull();
  });
});
