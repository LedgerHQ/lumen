import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useBaseInputValue } from './useBaseInputValue';

const createArgs = (
  overrides: Partial<Parameters<typeof useBaseInputValue>[0]> = {},
): Parameters<typeof useBaseInputValue>[0] => ({
  value: undefined,
  defaultValue: undefined,
  onChange: undefined,
  onClear: undefined,
  ref: undefined,
  ...overrides,
});

const createChangeEvent = (value: string): ChangeEvent<HTMLInputElement> =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

/** Attaches a real input so handleClear has something to write to and focus. */
const attachInput = (inputRef: {
  current: HTMLInputElement | null;
}): HTMLInputElement => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  inputRef.current = input;
  return input;
};

describe('useBaseInputValue', () => {
  it('starts empty when neither value nor defaultValue is given', () => {
    const { result } = renderHook(() => useBaseInputValue(createArgs()));

    expect(result.current.currentValue).toBe('');
    expect(result.current.hasContent).toBe(false);
  });

  it('seeds the mirror from defaultValue when uncontrolled', () => {
    const { result } = renderHook(() =>
      useBaseInputValue(createArgs({ defaultValue: 'jane.doe' })),
    );

    expect(result.current.currentValue).toBe('jane.doe');
    expect(result.current.hasContent).toBe(true);
  });

  it('tracks typing and forwards the event when uncontrolled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useBaseInputValue(createArgs({ onChange })),
    );

    act(() => {
      result.current.handleChange(createChangeEvent('ledger'));
    });

    expect(result.current.currentValue).toBe('ledger');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('derives the value from the prop when controlled and ignores internal tracking', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useBaseInputValue(createArgs({ value, onChange })),
      { initialProps: { value: 'first' } },
    );

    expect(result.current.currentValue).toBe('first');

    act(() => {
      result.current.handleChange(createChangeEvent('typed but not applied'));
    });

    expect(result.current.currentValue).toBe('first');
    expect(onChange).toHaveBeenCalledTimes(1);

    rerender({ value: 'second' });

    expect(result.current.currentValue).toBe('second');
  });

  it('coerces a numeric controlled value to a string', () => {
    const { result } = renderHook(() =>
      useBaseInputValue(createArgs({ value: 42 })),
    );

    expect(result.current.currentValue).toBe('42');
  });

  it('clears the mirror, dispatches input and calls onClear when uncontrolled', () => {
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      useBaseInputValue(createArgs({ defaultValue: 'something', onClear })),
    );

    const input = attachInput(result.current.inputRef);
    input.value = 'something';
    const listener = vi.fn();
    input.addEventListener('input', listener);

    act(() => {
      result.current.handleClear();
    });

    expect(result.current.currentValue).toBe('');
    expect(result.current.hasContent).toBe(false);
    expect(input.value).toBe('');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('resets the node and dispatches a bubbling input event on clear when controlled', () => {
    const { result } = renderHook(() =>
      useBaseInputValue(createArgs({ value: 'controlled' })),
    );

    const input = attachInput(result.current.inputRef);
    input.value = 'controlled';
    const listener = vi.fn();
    input.addEventListener('input', listener);

    act(() => {
      result.current.handleClear();
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].bubbles).toBe(true);
    expect(input.value).toBe('');
    // The prop still drives the rendered value until the consumer updates it.
    expect(result.current.currentValue).toBe('controlled');
  });

  it('does nothing on clear when no input is mounted', () => {
    const onClear = vi.fn();
    const { result } = renderHook(() =>
      useBaseInputValue(createArgs({ onClear })),
    );

    act(() => {
      result.current.handleClear();
    });

    expect(onClear).not.toHaveBeenCalled();
  });
});
