import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useToastTimer } from './useToastTimer';

describe('useToastTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('fires onExpire after durationMs', () => {
    const onExpire = vi.fn();
    renderHook(() =>
      useToastTimer({
        durationMs: 1000,
        paused: false,
        exiting: false,
        onExpire,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onExpire).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('never fires while paused', () => {
    const onExpire = vi.fn();
    renderHook(() =>
      useToastTimer({
        durationMs: 1000,
        paused: true,
        exiting: false,
        onExpire,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('resumes from the remaining time, not the full duration', () => {
    const onExpire = vi.fn();
    const { rerender } = renderHook((props) => useToastTimer(props), {
      initialProps: {
        durationMs: 1000,
        paused: false,
        exiting: false,
        onExpire,
      },
    });

    act(() => {
      vi.advanceTimersByTime(700); // 300ms left
    });

    rerender({ durationMs: 1000, paused: true, exiting: false, onExpire });
    act(() => {
      vi.advanceTimersByTime(10000); // paused: nothing should happen
    });
    expect(onExpire).not.toHaveBeenCalled();

    rerender({ durationMs: 1000, paused: false, exiting: false, onExpire });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(onExpire).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('accumulates the remaining time across multiple pause/resume cycles', () => {
    const onExpire = vi.fn();
    const { rerender } = renderHook((props) => useToastTimer(props), {
      initialProps: {
        durationMs: 900,
        paused: false,
        exiting: false,
        onExpire,
      },
    });

    act(() => vi.advanceTimersByTime(300)); // 600ms left
    rerender({ durationMs: 900, paused: true, exiting: false, onExpire });

    rerender({ durationMs: 900, paused: false, exiting: false, onExpire });
    act(() => vi.advanceTimersByTime(300)); // 300ms left
    rerender({ durationMs: 900, paused: true, exiting: false, onExpire });

    rerender({ durationMs: 900, paused: false, exiting: false, onExpire });
    act(() => vi.advanceTimersByTime(299));
    expect(onExpire).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('restarts at the full new duration when durationMs actually changes', () => {
    const onExpire = vi.fn();
    const { rerender } = renderHook((props) => useToastTimer(props), {
      initialProps: {
        durationMs: 1000,
        paused: false,
        exiting: false,
        onExpire,
      },
    });

    act(() => {
      vi.advanceTimersByTime(500); // consumed half of the old duration
    });

    rerender({ durationMs: 2000, paused: false, exiting: false, onExpire });
    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(onExpire).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('never fires once exiting, even if unpaused', () => {
    const onExpire = vi.fn();
    renderHook(() =>
      useToastTimer({
        durationMs: 1000,
        paused: false,
        exiting: true,
        onExpire,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(onExpire).not.toHaveBeenCalled();
  });
});
