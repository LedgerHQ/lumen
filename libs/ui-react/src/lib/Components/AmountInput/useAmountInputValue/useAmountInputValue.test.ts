import { renderHook, act } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { useAmountInputValue } from './useAmountInputValue';

const defaultFormatOptions = {
  allowDecimals: true,
  thousandsSeparator: true,
  maxIntegerLength: 9,
  maxDecimalLength: 9,
};

const createChangeEvent = (value: string): ChangeEvent<HTMLInputElement> =>
  ({
    target: { value },
  }) as ChangeEvent<HTMLInputElement>;

describe('useAmountInputValue', () => {
  it('formats the initial value', () => {
    const { result } = renderHook(() =>
      useAmountInputValue({
        value: '1000',
        onChange: vi.fn(),
        formatOptions: defaultFormatOptions,
      }),
    );

    expect(result.current.inputValue).toBe('1 000');
  });

  it('syncs inputValue when the value prop changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        useAmountInputValue({
          value,
          onChange: vi.fn(),
          formatOptions: defaultFormatOptions,
        }),
      { initialProps: { value: '100' } },
    );

    expect(result.current.inputValue).toBe('100');

    rerender({ value: '2000' });

    expect(result.current.inputValue).toBe('2 000');
  });

  it('formats user input and calls onChange with the cleaned value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useAmountInputValue({
        value: '',
        onChange,
        formatOptions: defaultFormatOptions,
      }),
    );

    act(() => {
      result.current.handleChange(createChangeEvent('1000'));
    });

    expect(result.current.inputValue).toBe('1 000');
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '1 000' }),
      }),
    );
  });

  it('sets isChanging when the formatted value changes', () => {
    const { result } = renderHook(() =>
      useAmountInputValue({
        value: '',
        onChange: vi.fn(),
        formatOptions: defaultFormatOptions,
      }),
    );

    act(() => {
      result.current.handleChange(createChangeEvent('1'));
    });

    expect(result.current.isChanging).toBe(true);
  });
});
