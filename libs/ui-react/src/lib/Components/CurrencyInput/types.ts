import type { ComponentPropsWithRef } from 'react';

export type CurrencyInputSize = 'md' | 'sm';

export type CurrencyInputAlign = 'center' | 'start' | 'end';

export type CurrencyPosition = 'left' | 'right';

/** Visual props shared by CurrencyInput and AmountInput. */
export type CurrencyInputVisualProps = {
  /**
   * Visual size of the input.
   * @default 'md'
   */
  size?: CurrencyInputSize;
  /**
   * Horizontal alignment of the amount and currency.
   * @default 'center'
   */
  align?: CurrencyInputAlign;
  /**
   * The currency text (e.g. USD, EUR)
   */
  currencyText?: string;
  /**
   * Position of the currency text.
   * @default 'left'
   */
  currencyPosition?: CurrencyPosition;
} & Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'prefix' | 'value' | 'onChange'
>;

/**
 * When the value type is a string, `parse`/`format` are optional and default to
 * the built-in canonical-string helpers. For any other value type both must be
 * provided, since the defaults can only produce a string.
 */
type ConverterProps<T> = [T] extends [string]
  ? {
      /** Layer 1 safety-gate. Defaults to `sanitizeAmount`. */
      sanitize?: (raw: string) => string;
      /** Layer 2 parse: safety-gated string to value. Defaults to `parseAmount`. */
      parse?: (safe: string) => T;
      /** Layer 3 format: value to display string. Defaults to `formatAmount`. */
      format?: (value: T) => string;
    }
  : {
      /** Layer 1 safety-gate. Defaults to `sanitizeAmount`. */
      sanitize?: (raw: string) => string;
      /** Layer 2 parse: safety-gated string to value. */
      parse: (safe: string) => T;
      /** Layer 3 format: value to display string. */
      format: (value: T) => string;
    };

export type CurrencyInputProps<T = string> = {
  /**
   * The controlled value of the input.
   * @required
   */
  value: T;
  /**
   * Change handler receiving the parsed value.
   * @required
   */
  onChange: (value: T) => void;
} & ConverterProps<T> &
  CurrencyInputVisualProps;
