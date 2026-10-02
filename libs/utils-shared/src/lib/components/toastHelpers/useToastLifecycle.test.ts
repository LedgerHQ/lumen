import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EXIT_ANIMATION_MS, useToastLifecycle } from './useToastLifecycle';

describe('useToastLifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('dismisses once when the countdown runs out, then again after the exit animation', () => {
    const onDismiss = vi.fn();
    const { rerender } = renderHook(
      ({ exiting }) =>
        useToastLifecycle({
          durationMs: 1000,
          paused: false,
          exiting,
          onDismiss,
        }),
      { initialProps: { exiting: false } },
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);

    rerender({ exiting: true });
    act(() => {
      vi.advanceTimersByTime(EXIT_ANIMATION_MS - 1);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it('cancels the pending removal when the toast unmounts mid-exit', () => {
    const onDismiss = vi.fn();
    const { unmount } = renderHook(() =>
      useToastLifecycle({
        durationMs: Infinity,
        paused: false,
        exiting: true,
        onDismiss,
      }),
    );

    unmount();
    act(() => {
      vi.advanceTimersByTime(EXIT_ANIMATION_MS);
    });
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
