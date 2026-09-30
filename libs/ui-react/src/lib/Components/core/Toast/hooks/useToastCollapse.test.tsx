import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

import { useToastCollapse } from './useToastCollapse';

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  callback: ResizeObserverCallback;
  disconnected = false;
  private observed: Element | null = null;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed = target;
  }

  unobserve(): void {}

  disconnect(): void {
    this.disconnected = true;
  }

  emit(height: number): void {
    if (!this.observed) return;
    this.callback(
      [
        {
          target: this.observed,
          contentRect: { height } as DOMRectReadOnly,
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver,
    );
  }
}

const Harness = () => {
  const { contentRef, height } = useToastCollapse();
  return <div ref={contentRef} data-testid='slot' data-height={height} />;
};

describe('useToastCollapse', () => {
  const originalResizeObserver = global.ResizeObserver;

  afterEach(() => {
    global.ResizeObserver = originalResizeObserver;
    MockResizeObserver.instances = [];
  });

  it('should include the stack gap in the measured slot height', () => {
    global.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;

    render(<Harness />);
    expect(screen.getByTestId('slot')).not.toHaveAttribute('data-height');

    act(() => {
      MockResizeObserver.instances[0]?.emit(48);
    });

    expect(screen.getByTestId('slot')).toHaveAttribute('data-height', '56');
  });

  it('should disconnect the observer on unmount', () => {
    global.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;

    const { unmount } = render(<Harness />);
    unmount();

    expect(MockResizeObserver.instances[0]?.disconnected).toBe(true);
  });
});
