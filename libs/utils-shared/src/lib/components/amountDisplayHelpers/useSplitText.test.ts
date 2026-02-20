import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { FormattedValue } from './types';
import { useSplitText } from './useSplitText';

const createValue = (
  overrides: Partial<FormattedValue> = {},
): FormattedValue => ({
  integerPart: '1234',
  decimalPart: '56',
  currencyText: 'USD',
  decimalSeparator: '.',
  currencyPosition: 'start',
  ...overrides,
});

describe('useSplitText', () => {
  it('splits integer part into individual digit characters', () => {
    const { result } = renderHook(() => useSplitText(createValue()));

    expect(result.current.integerPart).toEqual([
      { value: '1', type: 'digit' },
      { value: '2', type: 'digit' },
      { value: '3', type: 'digit' },
      { value: '4', type: 'digit' },
    ]);
  });

  it('splits decimal part into individual digit characters', () => {
    const { result } = renderHook(() => useSplitText(createValue()));

    expect(result.current.decimalPart).toEqual([
      { value: '5', type: 'digit' },
      { value: '6', type: 'digit' },
    ]);
  });

  it('returns empty decimal part when decimalPart is undefined', () => {
    const { result } = renderHook(() =>
      useSplitText(createValue({ decimalPart: undefined })),
    );

    expect(result.current.decimalPart).toEqual([]);
  });

  it('classifies group separators in integer part', () => {
    const { result } = renderHook(() =>
      useSplitText(createValue({ integerPart: '1,234,567' })),
    );

    expect(result.current.integerPart).toEqual([
      { value: '1', type: 'digit' },
      { value: ',', type: 'separator' },
      { value: '2', type: 'digit' },
      { value: '3', type: 'digit' },
      { value: '4', type: 'digit' },
      { value: ',', type: 'separator' },
      { value: '5', type: 'digit' },
      { value: '6', type: 'digit' },
      { value: '7', type: 'digit' },
    ]);
  });

  it('classifies space separators in integer part', () => {
    const { result } = renderHook(() =>
      useSplitText(createValue({ integerPart: '1 234 567' })),
    );

    expect(result.current.integerPart).toEqual([
      { value: '1', type: 'digit' },
      { value: ' ', type: 'separator' },
      { value: '2', type: 'digit' },
      { value: '3', type: 'digit' },
      { value: '4', type: 'digit' },
      { value: ' ', type: 'separator' },
      { value: '5', type: 'digit' },
      { value: '6', type: 'digit' },
      { value: '7', type: 'digit' },
    ]);
  });

  it('handles single digit integer part', () => {
    const { result } = renderHook(() =>
      useSplitText(createValue({ integerPart: '0' })),
    );

    expect(result.current.integerPart).toEqual([{ value: '0', type: 'digit' }]);
  });

  it('handles long decimal part', () => {
    const { result } = renderHook(() =>
      useSplitText(createValue({ decimalPart: '00123456' })),
    );

    expect(result.current.decimalPart).toHaveLength(8);
    expect(result.current.decimalPart.every((c) => c.type === 'digit')).toBe(
      true,
    );
  });
});
