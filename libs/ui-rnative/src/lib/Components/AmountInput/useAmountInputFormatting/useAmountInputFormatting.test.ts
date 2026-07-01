import { describe, it, expect, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react-native';
import { useAmountInputFormatting } from './useAmountInputFormatting';

const defaultFormatOptions = {
  allowDecimals: true,
  thousandsSeparator: true,
  maxIntegerLength: 9,
  maxDecimalLength: 9,
  decimalSeparator: '.' as const,
};

describe('useAmountInputFormatting', () => {
  it('formats the value prop', () => {
    const { result } = renderHook(() =>
      useAmountInputFormatting({
        value: '1000',
        onChangeText: jest.fn(),
        formatOptions: defaultFormatOptions,
      }),
    );

    expect(result.current.formattedValue).toBe('1 000');
  });

  it('updates formattedValue when the value prop changes', () => {
    const { result, rerender } = renderHook<
      ReturnType<typeof useAmountInputFormatting>,
      { value: string }
    >(
      ({ value }) =>
        useAmountInputFormatting({
          value,
          onChangeText: jest.fn(),
          formatOptions: defaultFormatOptions,
        }),
      { initialProps: { value: '100' } },
    );

    expect(result.current.formattedValue).toBe('100');

    rerender({ value: '2000' });

    expect(result.current.formattedValue).toBe('2 000');
  });

  it('formats user input and calls onChangeText with the cleaned value', () => {
    const onChangeText = jest.fn();
    const { result } = renderHook(() =>
      useAmountInputFormatting({
        value: '',
        onChangeText,
        formatOptions: defaultFormatOptions,
      }),
    );

    act(() => {
      result.current.handleChangeText('1000');
    });

    expect(onChangeText).toHaveBeenCalledWith('1 000');
  });

  it('displays and emits the configured decimal separator', () => {
    const onChangeText = jest.fn();
    const { result } = renderHook(() =>
      useAmountInputFormatting({
        value: '1234.5',
        onChangeText,
        formatOptions: { ...defaultFormatOptions, decimalSeparator: ',' },
      }),
    );

    expect(result.current.formattedValue).toBe('1 234,5');

    act(() => {
      result.current.handleChangeText('12,5');
    });

    expect(onChangeText).toHaveBeenCalledWith('12,5');
  });
});
