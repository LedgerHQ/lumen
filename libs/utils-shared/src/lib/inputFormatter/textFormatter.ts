import { formatThousands } from './formatThousands';

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

/** Keep only digits and dots; commas are treated as decimal separators. */
const sanitize = (value: string): string =>
  value.replaceAll(',', '.').replaceAll(/[^\d.]/g, '');

/** Drop leading zeros, keeping one when it precedes a dot or stands alone (e.g. "0", "0.5"). */
const stripLeadingZeros = (value: string): string =>
  value.replace(/^0+(?=\d)/, '');

/** Truncate to `max` characters. A `max` of 0 disables the limit. */
const limitIntegerLength = (value: string, max: number): string =>
  max > 0 ? value.slice(0, max) : value;

const formatIntegerOnly = (value: string, maxIntegerLength: number): string =>
  limitIntegerLength(value.replaceAll(/\D/g, ''), maxIntegerLength);

const formatDecimal = (
  value: string,
  maxIntegerLength: number,
  maxDecimalLength: number,
): string => {
  // A lone separator becomes "0." so the user can keep typing decimals.
  if (value === '.') return '0.';

  const firstDot = value.indexOf('.');
  if (firstDot === -1) return limitIntegerLength(value, maxIntegerLength);

  const integerPart =
    limitIntegerLength(value.slice(0, firstDot), maxIntegerLength) || '0';
  // Extra dots are ignored, e.g. the decimal part of "1.2.3" is "23".
  const decimalPart = value
    .slice(firstDot + 1)
    .replaceAll('.', '')
    .slice(0, maxDecimalLength);

  if (decimalPart.length > 0) return `${integerPart}.${decimalPart}`;
  // Preserve a trailing dot mid-typing (e.g. "12.").
  return value.endsWith('.') ? `${integerPart}.` : integerPart;
};

/**
 * Formats and validates numeric input text for amount inputs.
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

  const sanitized = stripLeadingZeros(sanitize(value));

  const cleaned = allowDecimals
    ? formatDecimal(sanitized, maxIntegerLength, maxDecimalLength)
    : formatIntegerOnly(sanitized, maxIntegerLength);

  const grouped = thousandsSeparator ? formatThousands(cleaned) : cleaned;

  // formatThousands groups with spaces and keeps a single dot for the decimal,
  // so localizing the separator only ever touches that one dot.
  return decimalSeparator === '.'
    ? grouped
    : grouped.replaceAll('.', decimalSeparator);
}
