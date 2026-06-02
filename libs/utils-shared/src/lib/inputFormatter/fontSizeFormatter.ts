const FONT_SIZE_BY_SIZE = {
  md: { max: 48, min: 17, scale: 2, startAt: 0 },
  sm: { max: 28, min: 12, scale: 1.5, startAt: 6 },
} as const;

export type AmountInputFontSizeSize = keyof typeof FONT_SIZE_BY_SIZE;

/**
 * Calculates the font size based on the number of digits in the input value.
 * Scales from max to min as digit count increases.
 * - md: 48px (heading-0-semi-bold) down to 17px, shrinks from the first digit
 * - sm: 28px (heading-2-semi-bold) down to 14px, shrinks after 6 digits
 */
export function getFontSize(
  value: string,
  size: AmountInputFontSizeSize = 'md',
): number {
  const { max, min, scale, startAt } = FONT_SIZE_BY_SIZE[size];
  const digits = value.replace(/\D/g, '').length;
  const fontSize = Math.max(min, max - Math.max(0, digits - startAt) * scale);
  return fontSize;
}
