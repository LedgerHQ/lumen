const FONT_SIZE_BY_SIZE = {
  md: { max: 48, min: 17, scale: 2 },
  sm: { max: 28, min: 17, scale: 1 },
} as const;

export type AmountInputFontSizeSize = keyof typeof FONT_SIZE_BY_SIZE;

/**
 * Calculates the font size based on the number of digits in the input value.
 * Scales from max to min as digit count increases.
 * - md: 48px (heading-0) down to 17px
 * - sm: 28px (heading-2-semi-bold) down to 17px (1px per digit)
 */
export function getFontSize(
  value: string,
  size: AmountInputFontSizeSize = 'md',
): number {
  const { max, min, scale } = FONT_SIZE_BY_SIZE[size];
  const digits = value.replace(/\D/g, '').length;
  const fontSize = Math.max(min, max - digits * scale);
  return fontSize;
}
