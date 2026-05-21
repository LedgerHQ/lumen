import { fireEvent, render, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CartesianChart } from '../CartesianChart';
import { useScrubberContext } from './context';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const sampleSeries = [{ id: 's1', stroke: '#000', data: [10, 20, 30, 40, 50] }];

const boundingRect: DOMRect = {
  left: 0,
  top: 0,
  right: 400,
  bottom: 200,
  width: 400,
  height: 200,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};

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

function ScrubberContextSetter({ index }: { index: number }) {
  const { onScrubberPositionChange } = useScrubberContext();
  return (
    <text
      data-testid='context-setter'
      onClick={() => onScrubberPositionChange(index)}
    />
  );
}

const renderWithScrubbing = ({
  onScrubberPositionChange,
  children,
  series = sampleSeries,
}: {
  onScrubberPositionChange?: (index: number | undefined) => void;
  children?: ReactNode;
  series?: typeof sampleSeries;
} = {}) => {
  const result = render(
    <CartesianChart
      series={series}
      width={400}
      height={200}
      enableScrubbing
      onScrubberPositionChange={onScrubberPositionChange}
    >
      <ScrubberPositionDisplay />
      {children}
    </CartesianChart>,
  );
  const svg = result.getByTestId('chart-svg');
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue(boundingRect);
  return result;
};

const activateScrubber = (svg: Element, clientX = 200): void => {
  act(() => {
    fireEvent.mouseMove(svg, { clientX, clientY: 100 });
    vi.advanceTimersByTime(16);
  });
};

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

    activateScrubber(svg);

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

    activateScrubber(svg, 100);
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

    activateScrubber(svg, 0);
    const initialIndex = onChange.mock.calls[0]?.[0] ?? 0;

    act(() => {
      fireEvent.keyDown(svg, { key: 'ArrowRight' });
    });

    const lastIndex = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastIndex).toBeGreaterThan(initialIndex);
  });

  it('decrements position on ArrowLeft key', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    activateScrubber(svg, 200);
    const initialIndex = onChange.mock.calls[0]?.[0] as number;

    act(() => {
      fireEvent.keyDown(svg, { key: 'ArrowLeft' });
    });

    const lastIndex = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastIndex).toBeLessThan(initialIndex);
  });

  it('jumps to first index on Home key', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    activateScrubber(svg, 200);

    act(() => {
      fireEvent.keyDown(svg, { key: 'Home' });
    });

    const lastIndex = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastIndex).toBe(0);
  });

  it('jumps to last index on End key', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    activateScrubber(svg, 0);

    act(() => {
      fireEvent.keyDown(svg, { key: 'End' });
    });

    const lastIndex = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastIndex).toBe(sampleSeries[0].data.length - 1);
  });

  it('uses a larger step with Shift key', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    act(() => {
      fireEvent.keyDown(svg, { key: 'Home' });
    });

    onChange.mockClear();
    act(() => {
      fireEvent.keyDown(svg, { key: 'ArrowRight', shiftKey: true });
    });

    const index = onChange.mock.calls[0]?.[0] as number;
    expect(index).toBeGreaterThanOrEqual(1);
  });

  it('ignores unrelated keys', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    activateScrubber(svg);
    onChange.mockClear();

    act(() => {
      fireEvent.keyDown(svg, { key: 'a' });
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('clears position on Escape key', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    activateScrubber(svg);
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

  it('updates position on touchstart', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    act(() => {
      fireEvent.touchStart(svg, {
        touches: [{ clientX: 200, clientY: 100 }],
      });
      vi.advanceTimersByTime(16);
    });

    expect(onChange).toHaveBeenCalled();
    expect(typeof onChange.mock.calls[0][0]).toBe('number');
  });

  it('updates position on touchmove', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    act(() => {
      fireEvent.touchStart(svg, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      vi.advanceTimersByTime(16);
    });

    onChange.mockClear();

    act(() => {
      fireEvent.touchMove(svg, {
        touches: [{ clientX: 300, clientY: 100 }],
      });
      vi.advanceTimersByTime(16);
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('clears position on touchend', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    act(() => {
      fireEvent.touchStart(svg, {
        touches: [{ clientX: 200, clientY: 100 }],
      });
      vi.advanceTimersByTime(16);
    });
    act(() => {
      fireEvent.touchEnd(svg);
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toBeUndefined();
  });

  it('clears position on blur', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    activateScrubber(svg);
    act(() => {
      fireEvent.blur(svg);
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[0]).toBeUndefined();
  });

  it('clamps out-of-range index set via context', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
      children: <ScrubberContextSetter index={999} />,
    });

    act(() => {
      fireEvent.click(getByTestId('context-setter'));
    });

    const calledWith = onChange.mock.calls[0][0];
    expect(calledWith).toBe(sampleSeries[0].data.length - 1);
  });

  it('fires external callback when child updates position via context', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
      children: <ScrubberContextSetter index={2} />,
    });

    act(() => {
      fireEvent.click(getByTestId('context-setter'));
    });

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('does not fire keyboard handler when dataLength is 0', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
      series: [{ id: 's1', stroke: '#000', data: [] }],
    });
    const svg = getByTestId('chart-svg');

    act(() => {
      fireEvent.keyDown(svg, { key: 'ArrowRight' });
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('coalesces rapid mousemove events into a single position update per frame', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithScrubbing({
      onScrubberPositionChange: onChange,
    });
    const svg = getByTestId('chart-svg');

    act(() => {
      fireEvent.mouseMove(svg, { clientX: 50, clientY: 100 });
      fireEvent.mouseMove(svg, { clientX: 150, clientY: 100 });
      fireEvent.mouseMove(svg, { clientX: 350, clientY: 100 });
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
