import { formatThousands } from './formatThousands';
import { parseAmount, type ParseAmountOptions } from './parseAmount';

export type FormatAmountOptions = {
  /** Whether to format with space-separated thousands */
  thousandsSeparator?: boolean;
  /**
   * Character used to display the decimal separator.
   * The canonical input always uses `.`.
   */
  decimalSeparator?: '.' | ',';
};

/**
 * Layer 3 format for amount inputs. Takes a canonical numeric string (see
 * {@link parseAmount}) and returns the display string with thousands grouping
 * and the requested decimal separator.
 *
 * @returns Display string
 *
 * @example
 * formatAmount('1234.5') // '1 234.5'
 * formatAmount('1234.5', { decimalSeparator: ',' }) // '1 234,5'
 * formatAmount('1234.5', { thousandsSeparator: false }) // '1234.5'
 */
export const formatAmount = (
  /** The canonical numeric string to format */
  canonical: string,
  options: FormatAmountOptions = {},
): string => {
  const { thousandsSeparator = true, decimalSeparator = '.' } = options;

  // formatThousands groups with spaces and keeps a single dot for the decimal,
  // so localizing the separator only ever touches that one dot.
  const grouped = thousandsSeparator ? formatThousands(canonical) : canonical;

  return decimalSeparator === '.'
    ? grouped
    : grouped.replaceAll('.', decimalSeparator);
};

/**
 * Builds a parser bound to the given options, suitable for the `parse` prop of
 * `CurrencyInput`.
 */
export const createAmountParser =
  (options?: ParseAmountOptions) =>
  (safe: string): string =>
    parseAmount(safe, options);

/**
 * Builds a formatter bound to the given options, suitable for the `format` prop
 * of `CurrencyInput`.
 */
export const createAmountFormatter =
  (options?: FormatAmountOptions) =>
  (canonical: string): string =>
    formatAmount(canonical, options);
