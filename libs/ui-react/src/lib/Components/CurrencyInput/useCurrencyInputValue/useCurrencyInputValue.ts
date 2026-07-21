import { getSignificantCaretPosition } from '@ledgerhq/lumen-utils-shared';
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
 * text in sync with an externally controlled `value`, and restores the caret
 * after each change so mid-string edits stay put (append operations stay at the
 * end).
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
    const rawValue = event.target.value;
    const caret = event.target.selectionStart ?? rawValue.length;
    const wasAtEnd = caret >= rawValue.length;

    const parsed = parse(sanitize(rawValue));
    const formatted = format(parsed);
    setInputValue(formatted);
    onChange(parsed);

    // rAF so the caret is set after React commits the formatted value.
    const input = inputRef.current;
    if (input) {
      requestAnimationFrame(() => {
        const position = wasAtEnd
          ? input.value.length
          : getSignificantCaretPosition(rawValue, caret, input.value);
        input.setSelectionRange(position, position);
      });
    }
  };

  return { inputValue, handleChange };
};
