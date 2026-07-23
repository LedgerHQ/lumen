/** Digits and decimal separators survive sanitization, so they anchor the caret. */
const SIGNIFICANT_CHAR = /[\d.,]/;

const countSignificantChars = (value: string): number => {
  let count = 0;
  for (const char of value) {
    if (SIGNIFICANT_CHAR.test(char)) count++;
  }
  return count;
};

/**
 * Maps a caret position from a raw (pre-format) value onto the formatted value.
 *
 * Formatting shifts separators, so raw and formatted indices don't line up. We
 * anchor on the count of significant characters left of the caret instead.
 *
 * @example
 * getSignificantCaretPosition('1234', 2, '1 234') // 3
 */
export const getSignificantCaretPosition = (
  rawValue: string,
  caret: number,
  formattedValue: string,
): number => {
  const target = countSignificantChars(rawValue.slice(0, caret));
  if (target <= 0) return 0;

  let seen = 0;
  for (let i = 0; i < formattedValue.length; i++) {
    if (SIGNIFICANT_CHAR.test(formattedValue[i])) {
      seen++;
      if (seen === target) return i + 1;
    }
  }
  return formattedValue.length;
};
