import type { ChangeEvent, RefObject } from 'react';
import { useEffect, useState } from 'react';

type UseCurrencyInputValueArgs<T> = {
  value: T;
  onChange: (value: T) => void;
  sanitize: (raw: string) => string;
  parse: (safe: string) => T;
  format: (value: T) => string;
  inputRef: RefObject<HTMLInputElement | null>;
};

type UseCurrencyInputValueReturn = {
  inputValue: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Drives the CurrencyInput value pipeline: sanitize -> parse -> format on every
 * keystroke. Emits the parsed value through `onChange`, keeps the displayed
 * text in sync with an externally controlled `value`, and pins the caret to the
 * end after each change.
 */
export const useCurrencyInputValue = <T>({
  value,
  onChange,
  sanitize,
  parse,
  format,
  inputRef,
}: UseCurrencyInputValueArgs<T>): UseCurrencyInputValueReturn => {
  const [inputValue, setInputValue] = useState<string>(() => format(value));

  useEffect(() => {
    setInputValue(format(value));
  }, [value, format]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const parsed = parse(sanitize(event.target.value));
    setInputValue(format(parsed));
    onChange(parsed);

    // Keep the caret at the end once React has applied the formatted value.
    const input = inputRef.current;
    if (input) {
      requestAnimationFrame(() => {
        const end = input.value.length;
        input.setSelectionRange(end, end);
      });
    }
  };

  return { inputValue, handleChange };
};
