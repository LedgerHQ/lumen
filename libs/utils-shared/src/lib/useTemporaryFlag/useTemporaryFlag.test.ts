import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTemporaryFlag } from './useTemporaryFlag';

describe('useTemporaryFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts inactive', () => {
    const { result } = renderHook(() => useTemporaryFlag(1000));
    expect(result.current[0]).toBe(false);
  });

  it('is active for the given duration after trigger', () => {
    const { result } = renderHook(() => useTemporaryFlag(1000));

    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);

    act(() => vi.advanceTimersByTime(999));
    expect(result.current[0]).toBe(true);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current[0]).toBe(false);
  });

  it('restarts the timer when triggered again', () => {
    const { result } = renderHook(() => useTemporaryFlag(1000));

    act(() => result.current[1]());
    act(() => vi.advanceTimersByTime(600));
    act(() => result.current[1]());
    act(() => vi.advanceTimersByTime(600));
    expect(result.current[0]).toBe(true);

    act(() => vi.advanceTimersByTime(400));
    expect(result.current[0]).toBe(false);
  });

  it('clears the pending timer on unmount', () => {
    const { result, unmount } = renderHook(() => useTemporaryFlag(1000));

    act(() => result.current[1]());
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
