import { formatAmount } from './formatAmount';
import { parseAmount } from './parseAmount';
import { sanitizeAmount } from './sanitizeAmount';

export type TextFormatterOptions = {
  /** Whether to allow decimal values */
  allowDecimals?: boolean;
  /** Whether to format with space-separated thousands */
  thousandsSeparator?: boolean;
  /** Maximum length for integer part (before decimal) */
  maxIntegerLength?: number;
  /** Maximum length for decimal part (after decimal) */
  maxDecimalLength?: number;
  /**
   * Character used to display the decimal separator.
   * Input parsing always accepts both `.` and `,` regardless of this value.
   */
  decimalSeparator?: '.' | ',';
};

/**
 * Formats and validates numeric input text for amount inputs.
 *
 * Composes the three formatting layers: {@link sanitizeAmount} (safety-gate),
 * {@link parseAmount} (canonical numeric string) and {@link formatAmount}
 * (display string).
 *
 * Parsing is always lenient: both `.` and `,` are accepted as the decimal
 * separator on input, so the result stays correct regardless of the locale
 * keyboard. The `decimalSeparator` option only controls how the result is
 * displayed.
 *
 * @returns Formatted and cleaned numeric string
 *
 * @example
 * textFormatter('01') // '1'
 * textFormatter('.5') // '0.5'
 * textFormatter('1.2.3') // '1.23'
 * textFormatter('1,5') // '1.5'
 * textFormatter('1,5', { decimalSeparator: ',' }) // '1,5'
 * textFormatter('abc123') // '123'
 * textFormatter('1000000', { thousandsSeparator: true }) // '1 000 000'
 * textFormatter('1234.5678', { thousandsSeparator: true }) // '1 234.5678'
 * textFormatter('1234.5', { decimalSeparator: ',' }) // '1 234,5'
 * textFormatter('123456789012', { maxIntegerLength: 9 }) // '123456789'
 * textFormatter('123.123456', { maxDecimalLength: 2 }) // '123.12'
 */
export function textFormatter(
  /** The input value to format */
  value: string,
  options: TextFormatterOptions = {},
): string {
  const {
    allowDecimals = true,
    thousandsSeparator = true,
    maxIntegerLength = 9,
    maxDecimalLength = 9,
    decimalSeparator = '.',
  } = options;

  const canonical = parseAmount(sanitizeAmount(value), {
    allowDecimals,
    maxIntegerLength,
    maxDecimalLength,
  });

  return formatAmount(canonical, { thousandsSeparator, decimalSeparator });
}
