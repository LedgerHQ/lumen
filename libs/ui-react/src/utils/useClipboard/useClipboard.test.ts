import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should write the value and set isCopied until the default 3000ms elapse', async () => {
    const onCopy = vi.fn();
    const { result } = renderHook(() => useClipboard({ onCopy }));

    await act(async () => {
      await expect(result.current.copy('Label')).resolves.toBe(true);
    });

    expect(writeText).toHaveBeenCalledWith('Label');
    expect(onCopy).toHaveBeenCalledWith('Label');
    expect(result.current.isCopied).toBe(true);

    act(() => vi.advanceTimersByTime(2999));
    expect(result.current.isCopied).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.isCopied).toBe(false);
  });

  it('should revert after resetDelay, counted from the most recent copy', async () => {
    const { result } = renderHook(() => useClipboard({ resetDelay: 1000 }));

    await act(async () => {
      await result.current.copy('A');
    });
    act(() => vi.advanceTimersByTime(800));
    await act(async () => {
      await result.current.copy('B');
    });
    act(() => vi.advanceTimersByTime(800));
    expect(result.current.isCopied).toBe(true);

    act(() => vi.advanceTimersByTime(200));
    expect(result.current.isCopied).toBe(false);
  });

  it('should resolve false and leave isCopied unchanged when the write fails', async () => {
    writeText.mockImplementation(() => Promise.reject(new Error('denied')));
    const onCopy = vi.fn();
    const { result } = renderHook(() => useClipboard({ onCopy }));

    await act(async () => {
      await expect(result.current.copy('Label')).resolves.toBe(false);
    });

    expect(onCopy).not.toHaveBeenCalled();
    expect(result.current.isCopied).toBe(false);
  });
});
