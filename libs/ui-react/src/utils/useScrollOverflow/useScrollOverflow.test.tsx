import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import { useScrollOverflow } from './useScrollOverflow';

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  callback: ResizeObserverCallback;
  disconnected = false;
  observed: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(target: Element): void {
    this.observed = this.observed.filter((element) => element !== target);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  emit(): void {
    this.callback([], this as unknown as ResizeObserver);
  }
}

const Harness = ({ loading = false }: { loading?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight } = useScrollOverflow(ref);

  return (
    <div
      ref={ref}
      data-testid='scroller'
      data-left={String(canScrollLeft)}
      data-right={String(canScrollRight)}
    >
      {loading ? <div data-testid='skeleton' /> : <table />}
    </div>
  );
};

const setScrollMetrics = (
  el: HTMLElement,
  metrics: { scrollWidth: number; clientWidth: number; scrollLeft: number },
): void => {
  Object.entries(metrics).forEach(([key, value]) => {
    Object.defineProperty(el, key, { configurable: true, value });
  });
};

const expectOverflow = (left: boolean, right: boolean): void => {
  const scroller = screen.getByTestId('scroller');
  expect(scroller).toHaveAttribute('data-left', String(left));
  expect(scroller).toHaveAttribute('data-right', String(right));
};

describe('useScrollOverflow', () => {
  const originalResizeObserver = global.ResizeObserver;

  afterEach(() => {
    global.ResizeObserver = originalResizeObserver;
    MockResizeObserver.instances = [];
  });

  it('should report no overflow when content fits', () => {
    render(<Harness />);
    expectOverflow(false, false);
  });

  it('should report the hidden side in LTR', () => {
    render(<Harness />);
    const scroller = screen.getByTestId('scroller');

    setScrollMetrics(scroller, {
      scrollWidth: 500,
      clientWidth: 300,
      scrollLeft: 0,
    });
    fireEvent.scroll(scroller);

    expectOverflow(false, true);
  });

  it('should map RTL overflow to physical sides, even after a direction change', () => {
    render(<Harness />);
    const scroller = screen.getByTestId('scroller');

    setScrollMetrics(scroller, {
      scrollWidth: 500,
      clientWidth: 300,
      scrollLeft: 0,
    });
    scroller.style.direction = 'rtl';
    fireEvent.scroll(scroller);

    expectOverflow(true, false);
  });

  it('should update when the container or its content resizes', () => {
    global.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;
    render(<Harness />);
    const scroller = screen.getByTestId('scroller');

    expect(MockResizeObserver.instances[0]?.observed).toEqual([
      scroller,
      scroller.firstElementChild,
    ]);

    setScrollMetrics(scroller, {
      scrollWidth: 500,
      clientWidth: 300,
      scrollLeft: 0,
    });
    act(() => {
      MockResizeObserver.instances[0]?.emit();
    });

    expectOverflow(false, true);
  });

  it('should follow content swapped after mount', async () => {
    global.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;
    const { rerender } = render(<Harness loading />);
    const scroller = screen.getByTestId('scroller');
    const skeleton = screen.getByTestId('skeleton');

    setScrollMetrics(scroller, {
      scrollWidth: 500,
      clientWidth: 300,
      scrollLeft: 0,
    });
    rerender(<Harness />);
    // MutationObserver callbacks run as a microtask.
    await act(async () => {});

    const observer = MockResizeObserver.instances[0];
    expect(observer?.observed).toContain(scroller.firstElementChild);
    expect(observer?.observed).not.toContain(skeleton);
    expectOverflow(false, true);
  });

  it('should disconnect the observer on unmount', () => {
    global.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;
    const { unmount } = render(<Harness />);

    unmount();

    expect(MockResizeObserver.instances[0]?.disconnected).toBe(true);
  });
});
