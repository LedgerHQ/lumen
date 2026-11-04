import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { throttle } from './throttle';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes on the leading edge and once more on the trailing edge', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('a');
    throttled('b');
    throttled('c');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith('a');

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('c');
  });

  it('invokes at most once per wait under continuous calls', () => {
    const start = Date.now();
    const invokedAt: number[] = [];
    const throttled = throttle(() => {
      invokedAt.push(Date.now() - start);
    }, 100);

    for (let i = 0; i < 25; i++) {
      throttled();
      vi.advanceTimersByTime(20);
    }

    expect(invokedAt).toEqual([0, 100, 200, 300, 400, 500]);
  });

  it('skips the leading call when leading is false', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { leading: false });

    throttled('a');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('ignores calls during the wait when trailing is false', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { trailing: false });

    throttled('a');
    throttled('b');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('exposes cancel, flush and pending', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('a');
    throttled('b');
    expect(throttled.pending()).toBe(true);

    throttled.flush();
    expect(fn).toHaveBeenLastCalledWith('b');

    throttled.cancel();
    expect(throttled.pending()).toBe(false);
  });
});
