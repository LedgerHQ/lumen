import type { ChangeEvent } from 'react';
import type {
  CurrencyInputAlign,
  CurrencyInputSize,
  CurrencyInputVisualProps,
} from '../CurrencyInput/types';

export type AmountInputSize = CurrencyInputSize;

export type AmountInputAlign = CurrencyInputAlign;

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
   * Whether to use thousands separator (e.g. 1 000 for 1000)
   * @default true
   */
  thousandsSeparator?: boolean;
  /**
   * Character used to display the decimal separator (e.g. `1 234,5` vs `1 234.5`).
   * Typing always accepts both `,` and `.` regardless of this value, so it stays
   * compatible with any locale keyboard. The value returned by `onChange` uses
   * this separator.
   * @default '.'
   */
  decimalSeparator?: '.' | ',';
} & CurrencyInputVisualProps;
