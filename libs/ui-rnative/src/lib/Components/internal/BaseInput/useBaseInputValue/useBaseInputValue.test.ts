import { describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useBaseInputValue } from './useBaseInputValue';

const createArgs = (
  overrides: Partial<Parameters<typeof useBaseInputValue>[0]> = {},
): Parameters<typeof useBaseInputValue>[0] => ({
  value: undefined,
  defaultValue: undefined,
  onChangeText: undefined,
  onClear: undefined,
  ref: undefined,
  ...overrides,
});

describe('useBaseInputValue', () => {
  it('starts empty when neither value nor defaultValue is given', () => {
    const { result } = renderHook(() => useBaseInputValue(createArgs()));

    expect(result.current.value).toBe('');
    expect(result.current.hasContent).toBe(false);
  });

  it('seeds the value from defaultValue when uncontrolled', () => {
    const { result } = renderHook(() =>
      useBaseInputValue(createArgs({ defaultValue: 'jane.doe' })),
    );

    expect(result.current.value).toBe('jane.doe');
    expect(result.current.hasContent).toBe(true);
  });

  it('tracks typing and forwards the text when uncontrolled', () => {
    const onChangeText = jest.fn();
    const { result } = renderHook(() =>
      useBaseInputValue(createArgs({ onChangeText })),
    );

    act(() => {
      result.current.handleChangeText('ledger');
    });

    expect(result.current.value).toBe('ledger');
    expect(onChangeText).toHaveBeenCalledTimes(1);
    expect(onChangeText).toHaveBeenCalledWith('ledger');
  });

  it('derives the value from the prop when controlled and ignores internal tracking', () => {
    const onChangeText = jest.fn();
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) =>
        useBaseInputValue(createArgs({ value, onChangeText })),
      { initialProps: { value: 'first' } },
    );

    expect(result.current.value).toBe('first');

    act(() => {
      result.current.handleChangeText('typed but not applied');
    });

    expect(result.current.value).toBe('first');
    expect(onChangeText).toHaveBeenCalledTimes(1);
    expect(onChangeText).toHaveBeenCalledWith('typed but not applied');

    rerender({ value: 'second' });

    expect(result.current.value).toBe('second');
  });

  it('clears the mirror and calls onChangeText when uncontrolled', () => {
    const onChangeText = jest.fn();
    const onClear = jest.fn();
    const { result } = renderHook(() =>
      useBaseInputValue(
        createArgs({ defaultValue: 'something', onChangeText, onClear }),
      ),
    );

    act(() => {
      result.current.handleClear();
    });

    expect(result.current.value).toBe('');
    expect(result.current.hasContent).toBe(false);
    expect(onChangeText).toHaveBeenCalledTimes(1);
    expect(onChangeText).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('calls onChangeText with an empty string on clear so controlled consumers react', () => {
    const onChangeText = jest.fn();
    const onClear = jest.fn();
    const { result } = renderHook(() =>
      useBaseInputValue(
        createArgs({ value: 'controlled', onChangeText, onClear }),
      ),
    );

    act(() => {
      result.current.handleClear();
    });

    expect(onChangeText).toHaveBeenCalledTimes(1);
    expect(onChangeText).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalledTimes(1);
    // The prop still drives the rendered value until the consumer updates it.
    expect(result.current.value).toBe('controlled');
  });
});
