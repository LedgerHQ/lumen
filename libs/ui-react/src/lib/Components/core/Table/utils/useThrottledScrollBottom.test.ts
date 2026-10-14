import { renderHook } from '@testing-library/react';
import type { UIEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useThrottledScrollBottom } from './useThrottledScrollBottom';

const createScrollEvent = (
  element: HTMLElement,
  scrollTop: number,
): UIEvent<HTMLElement> => {
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    value: scrollTop,
  });
  return { currentTarget: element } as unknown as UIEvent<HTMLElement>;
};

const createScrollContainer = (): HTMLElement => {
  const element = document.createElement('div');
  Object.defineProperty(element, 'scrollHeight', { value: 1000 });
  Object.defineProperty(element, 'clientHeight', { value: 400 });
  return element;
};

describe('useThrottledScrollBottom', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return undefined without onScrollBottom', () => {
    const { result } = renderHook(() => useThrottledScrollBottom({}));

    expect(result.current).toBeUndefined();
  });

  it('should call onScrollBottom when scrolled near the bottom', () => {
    const onScrollBottom = vi.fn();
    const { result } = renderHook(() =>
      useThrottledScrollBottom({ onScrollBottom }),
    );
    const element = createScrollContainer();

    result.current?.(createScrollEvent(element, 100));
    expect(onScrollBottom).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    result.current?.(createScrollEvent(element, 550));
    expect(onScrollBottom).toHaveBeenCalledTimes(1);
  });

  it('should not call onScrollBottom while loading', () => {
    const onScrollBottom = vi.fn();
    const { result } = renderHook(() =>
      useThrottledScrollBottom({ onScrollBottom, loading: true }),
    );

    result.current?.(createScrollEvent(createScrollContainer(), 600));

    expect(onScrollBottom).not.toHaveBeenCalled();
  });

  it('should ignore horizontal-only scrolls near the bottom', () => {
    const onScrollBottom = vi.fn();
    const { result } = renderHook(() =>
      useThrottledScrollBottom({ onScrollBottom }),
    );
    const element = createScrollContainer();

    result.current?.(createScrollEvent(element, 600));
    expect(onScrollBottom).toHaveBeenCalledTimes(1);

    // Same scrollTop: the user only scrolled sideways.
    result.current?.(createScrollEvent(element, 600));
    result.current?.(createScrollEvent(element, 600));
    vi.advanceTimersByTime(200);

    expect(onScrollBottom).toHaveBeenCalledTimes(1);
  });
});
