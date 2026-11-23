import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import * as ExpoClipboard from 'expo-clipboard';
import { useClipboard } from './useClipboard';

const setStringAsync = jest.mocked(ExpoClipboard.setStringAsync);

describe('useClipboard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setStringAsync.mockClear();
    setStringAsync.mockImplementation(() => Promise.resolve(true));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should write the value and set isCopied until the default 3000ms elapse', async () => {
    const onCopy = jest.fn();
    const { result } = renderHook(() => useClipboard({ onCopy }));

    await act(async () => {
      await expect(result.current.copy('Label')).resolves.toBe(true);
    });

    expect(setStringAsync).toHaveBeenCalledWith('Label');
    expect(onCopy).toHaveBeenCalledWith('Label');
    expect(result.current.isCopied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(result.current.isCopied).toBe(true);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.isCopied).toBe(false);
  });

  it('should revert after resetDelay, counted from the most recent copy', async () => {
    const { result } = renderHook(() => useClipboard({ resetDelay: 1000 }));

    await act(async () => {
      await result.current.copy('A');
    });
    act(() => {
      jest.advanceTimersByTime(800);
    });
    await act(async () => {
      await result.current.copy('B');
    });
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(result.current.isCopied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current.isCopied).toBe(false);
  });

  it('should resolve false and leave isCopied unchanged when the write fails', async () => {
    setStringAsync.mockImplementation(() =>
      Promise.reject(new Error('denied')),
    );
    const onCopy = jest.fn();
    const { result } = renderHook(() => useClipboard({ onCopy }));

    await act(async () => {
      await expect(result.current.copy('Label')).resolves.toBe(false);
    });

    expect(onCopy).not.toHaveBeenCalled();
    expect(result.current.isCopied).toBe(false);
  });

  it('should resolve false when the write resolves false', async () => {
    setStringAsync.mockImplementation(() => Promise.resolve(false));
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await expect(result.current.copy('Label')).resolves.toBe(false);
    });

    expect(result.current.isCopied).toBe(false);
  });
});
