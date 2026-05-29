import type { ChangeEvent, ComponentPropsWithRef } from 'react';

export type AmountInputSize = 'md' | 'sm';

export type AmountInputAlign = 'center' | 'start' | 'end';

export type AmountInputProps = {
  /**
   * The controlled value of the input
   * @required
   */
  value: string | number;
  /**
   * Change handler
   * @required
   */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Visual size of the amount input.
   * @default 'md'
   */
  size?: AmountInputSize;
  /**
   * Horizontal alignment of the amount and currency.
   * @default 'center'
   */
  align?: AmountInputAlign;
  /**
   * The currency text (e.g. USD, EUR)
   */
  currencyText?: string;
  /**
   * Position of the currency text.
   * @default 'left'
   */
  currencyPosition?: 'left' | 'right';
  /**
   * Maximum length for integer part (before decimal)
   * @default 9
   */
  maxIntegerLength?: number;
  /**
   * Maximum length for decimal part (after decimal)
   * @default 9
   */
  maxDecimalLength?: number;
  /**
   * Allow decimal values
   * @default true
   */
  allowDecimals?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Whether to use thousands separator (e.g. 1 000 for 1000)
   * @default true
   */
  thousandsSeparator?: boolean;
} & Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'prefix' | 'value' | 'onChange'
>;
