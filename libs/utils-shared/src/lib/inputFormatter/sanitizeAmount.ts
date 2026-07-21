/**
 * Layer 1 safety-gate for amount inputs. Locale-agnostic: keeps only the
 * characters that can appear in a number field, dropping letters, symbols and
 * whitespace. Commas are treated as decimal separators so keyboards from any
 * locale stay compatible.
 *
 * @returns String containing only digits and a `.` decimal separator
 *
 * @example
 * sanitizeAmount('12a3$') // '123'
 * sanitizeAmount('1,5') // '1.5'
 * sanitizeAmount('€ 1 234,5') // '1234.5'
 */
export const sanitizeAmount = (
  /** The raw input value to sanitize */
  value: string,
): string => value.replaceAll(',', '.').replaceAll(/[^\d.]/g, '');
