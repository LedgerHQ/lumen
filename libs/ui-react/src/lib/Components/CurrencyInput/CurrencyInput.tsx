import {
  formatAmount,
  parseAmount,
  sanitizeAmount,
  useDisabledContext,
  useMergedRef,
} from '@ledgerhq/lumen-utils-shared';
import { useRef } from 'react';
import { CurrencyInputBase } from './CurrencyInputBase';
import type { CurrencyInputProps } from './types';
import { useCurrencyInputValue } from './useCurrencyInputValue/useCurrencyInputValue';

/**
 * CurrencyInput is a controlled numeric input built on a 3-layer pipeline:
 * `sanitize` (safety-gate), `parse` (safe string to value) and `format` (value
 * to display string). It formats on every change and keeps the caret at the end.
 *
 * The value is generic: by default it is the canonical string (e.g. `"1234.56"`)
 * and `parse`/`format` fall back to the built-in helpers. For any other value
 * type, provide both `parse` and `format`.
 */
export function CurrencyInput<T = string>({
  ref,
  value,
  onChange,
  sanitize,
  parse,
  format,
  size = 'md',
  align = 'center',
  currencyText,
  currencyPosition = 'left',
  disabled: disabledProp,
  className,
  ...props
}: CurrencyInputProps<T>) {
  const disabled = useDisabledContext({
    consumerName: 'CurrencyInput',
    mergeWith: { disabled: disabledProp },
  });

  // Defaults produce/consume the canonical string, so they only apply when
  // T is string (enforced by the props type for other value types).
  const resolvedSanitize = sanitize ?? sanitizeAmount;
  const resolvedParse =
    parse ?? (parseAmount as unknown as (safe: string) => T);
  const resolvedFormat =
    format ?? (formatAmount as unknown as (value: T) => string);

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(ref, inputRef);

  const { inputValue, handleChange } = useCurrencyInputValue<T>({
    value,
    onChange,
    sanitize: resolvedSanitize,
    parse: resolvedParse,
    format: resolvedFormat,
    inputRef,
  });

  return (
    <CurrencyInputBase
      ref={mergedRef}
      inputValue={inputValue}
      onChange={handleChange}
      size={size}
      align={align}
      currencyText={currencyText}
      currencyPosition={currencyPosition}
      disabled={disabled}
      className={className}
      {...props}
    />
  );
}
