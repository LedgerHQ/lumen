import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('trailing (default)', () => {
    it('invokes once after wait with the latest arguments', () => {
      const fn = vi.fn((value: number) => value * 2);
      const debounced = debounce(fn, 100);

      debounced(1);
      debounced(2);
      debounced(3);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(3);
    });

    it('restarts the wait on every call', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(60);
      debounced();
      vi.advanceTimersByTime(60);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(40);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('returns undefined before the first invocation, then the last result', () => {
      const fn = vi.fn((value: number) => value * 2);
      const debounced = debounce(fn, 100);

      expect(debounced(1)).toBeUndefined();
      vi.advanceTimersByTime(100);
      expect(debounced(5)).toBe(2);
    });

    it('preserves the calling context', () => {
      const contexts: unknown[] = [];
      const fn = vi.fn(function (this: unknown) {
        contexts.push(this);
      });
      const target = { debounced: debounce(fn, 100) };

      target.debounced();
      vi.advanceTimersByTime(100);

      expect(contexts).toEqual([target]);
    });

    it('invokes again for a new burst after the previous one settled', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('a');
      vi.advanceTimersByTime(100);
      debounced('b');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith('b');
    });
  });

  describe('leading', () => {
    it('invokes immediately and skips the trailing call for a single call', () => {
      const fn = vi.fn((value: string) => value);
      const debounced = debounce(fn, 100, { leading: true });

      expect(debounced('a')).toBe('a');
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('invokes on both edges when called again during the wait', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true });

      debounced('a');
      debounced('b');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith('a');

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith('b');
    });

    it('invokes only on the leading edge when trailing is disabled', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, trailing: false });

      debounced('a');
      debounced('b');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('a');
    });
  });

  it('never invokes when both edges are disabled', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, { leading: false, trailing: false });

    debounced();
    vi.advanceTimersByTime(500);

    expect(fn).not.toHaveBeenCalled();
    expect(debounced.pending()).toBe(false);
  });

  describe('maxWait', () => {
    it('forces an invocation once maxWait elapses under continuous calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { maxWait: 250 });

      for (let i = 0; i < 6; i++) {
        debounced(i);
        vi.advanceTimersByTime(50);
      }

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(4);
    });

    it('invokes inline when a call lands after maxWait has elapsed', () => {
      const fn = vi.fn((value: number) => value);
      const debounced = debounce(fn, 100, { maxWait: 150 });

      debounced(1);
      vi.advanceTimersByTime(90);
      debounced(2);
      vi.advanceTimersByTime(90);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith(2);

      vi.advanceTimersByTime(100);
      debounced(3);
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenLastCalledWith(3);
    });

    it('does not invoke from the max timer when there are no pending args', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true, maxWait: 200 });

      debounced('a');
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('invokes inline when the clock passed maxWait before the timers fired', () => {
      const fn = vi.fn((value: number) => value);
      const debounced = debounce(fn, 100, { maxWait: 200 });

      debounced(1);
      vi.setSystemTime(Date.now() + 250);

      expect(debounced(2)).toBe(2);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(2);
    });

    it('never waits less than wait when maxWait is smaller', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { maxWait: 20 });

      debounced();
      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancel', () => {
    it('drops the pending invocation', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { maxWait: 200 });

      debounced();
      debounced.cancel();
      vi.advanceTimersByTime(300);

      expect(fn).not.toHaveBeenCalled();
      expect(debounced.pending()).toBe(false);
    });

    it('is a no-op when nothing is pending', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      expect(() => debounced.cancel()).not.toThrow();
      expect(debounced.pending()).toBe(false);
    });

    it('lets the next call start a fresh leading edge', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { leading: true });

      debounced('a');
      debounced.cancel();
      debounced('b');

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith('b');
    });
  });

  describe('flush', () => {
    it('invokes the pending call immediately', () => {
      const fn = vi.fn((value: number) => value * 10);
      const debounced = debounce(fn, 100);

      debounced(4);
      expect(debounced.flush()).toBe(40);
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('returns the last result when nothing is pending', () => {
      const fn = vi.fn((value: number) => value);
      const debounced = debounce(fn, 100);

      expect(debounced.flush()).toBeUndefined();

      debounced(7);
      vi.advanceTimersByTime(100);
      expect(debounced.flush()).toBe(7);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('does not re-invoke when the leading call already consumed the args', () => {
      const fn = vi.fn((value: string) => value);
      const debounced = debounce(fn, 100, { leading: true });

      debounced('a');
      expect(debounced.flush()).toBe('a');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('pending', () => {
    it('reports whether an invocation is scheduled', () => {
      const debounced = debounce(vi.fn(), 100);

      expect(debounced.pending()).toBe(false);
      debounced();
      expect(debounced.pending()).toBe(true);
      vi.advanceTimersByTime(100);
      expect(debounced.pending()).toBe(false);
    });
  });
});
