export type ParseAmountOptions = {
  /** Whether to allow decimal values */
  allowDecimals?: boolean;
  /** Maximum length for integer part (before decimal) */
  maxIntegerLength?: number;
  /** Maximum length for decimal part (after decimal) */
  maxDecimalLength?: number;
};

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
 * Layer 2 parse for amount inputs. Takes a safety-gated string (see
 * {@link sanitizeAmount}) and returns the canonical numeric string with a `.`
 * decimal separator and no thousands grouping (e.g. `"1234.56"`, `"12."`).
 *
 * Mid-typing states are preserved so the value can round-trip through an input:
 * a trailing dot stays and a lone separator becomes `"0."`.
 *
 * @returns Canonical numeric string
 *
 * @example
 * parseAmount('01') // '1'
 * parseAmount('.5') // '0.5'
 * parseAmount('1.2.3') // '1.23'
 * parseAmount('123.123456', { maxDecimalLength: 2 }) // '123.12'
 * parseAmount('1.5', { allowDecimals: false }) // '15'
 */
export const parseAmount = (
  /** The sanitized input value to parse */
  sanitized: string,
  options: ParseAmountOptions = {},
): string => {
  const {
    allowDecimals = true,
    maxIntegerLength = 9,
    maxDecimalLength = 9,
  } = options;

  const stripped = stripLeadingZeros(sanitized);

  return allowDecimals
    ? formatDecimal(stripped, maxIntegerLength, maxDecimalLength)
    : formatIntegerOnly(stripped, maxIntegerLength);
};
