import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import type { AmountInputSize } from '../types';
import { useAutoWidthInput } from './useAutoWidthInput';

type HookProps = {
  inputValue: string;
  currencyText: string | undefined;
  size: AmountInputSize;
};

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('useAutoWidthInput', () => {
  it('returns spanRef and inputRef', () => {
    const { result } = renderHook(() =>
      useAutoWidthInput({
        inputValue: '',
        currencyText: undefined,
        size: 'md',
      }),
    );

    expect(result.current.spanRef).toBeDefined();
    expect(result.current.inputRef).toBeDefined();
  });

  it('sets input width from mirror span measurements and padding', () => {
    const { result, rerender } = renderHook<
      ReturnType<typeof useAutoWidthInput>,
      HookProps
    >(
      ({ inputValue, currencyText, size }) =>
        useAutoWidthInput({ inputValue, currencyText, size }),
      {
        initialProps: {
          inputValue: '_',
          currencyText: 'USD',
          size: 'md',
        },
      },
    );

    const span = document.createElement('span');
    Object.defineProperty(span, 'scrollWidth', {
      value: 50,
      configurable: true,
    });
    Object.defineProperty(span, 'offsetWidth', {
      value: 48,
      configurable: true,
    });

    const input = document.createElement('input');
    result.current.spanRef.current = span;
    result.current.inputRef.current = input;

    rerender({
      inputValue: '1 000',
      currencyText: 'USD',
      size: 'md',
    });

    // mirror width ceil(max(50, 48)) = 50 + filled padding (8) = 58px
    expect(input.style.width).toBe('58px');
  });

  it('adds extra padding when currency is absent', () => {
    const { result, rerender } = renderHook<
      ReturnType<typeof useAutoWidthInput>,
      HookProps
    >(
      ({ inputValue, currencyText, size }) =>
        useAutoWidthInput({ inputValue, currencyText, size }),
      {
        initialProps: {
          inputValue: '_',
          currencyText: undefined,
          size: 'md',
        },
      },
    );

    const span = document.createElement('span');
    Object.defineProperty(span, 'scrollWidth', {
      value: 10,
      configurable: true,
    });
    Object.defineProperty(span, 'offsetWidth', {
      value: 10,
      configurable: true,
    });

    const input = document.createElement('input');
    result.current.spanRef.current = span;
    result.current.inputRef.current = input;

    rerender({
      inputValue: '',
      currencyText: undefined,
      size: 'md',
    });

    // mirror width ceil(max(10, 10)) = 10 + empty padding (33) + no-currency md (24) = 67px
    expect(input.style.width).toBe('67px');
  });
});
