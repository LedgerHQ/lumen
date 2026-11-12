/** Whitespace-insensitive CSS, so formatting never changes a comparison. */
export const normalizeCss = (css: string): string =>
  // Whitespace is collapsed first, so the later patterns match one space at
  // most and never backtrack.
  css
    .replace(/\s+/g, ' ')
    .replaceAll('( ', '(')
    .replaceAll(' )', ')')
    .replace(/; ?}/g, ' }')
    .trim();

const CUSTOM_PROPERTY_NAME = /^--[\w-]+$/;

/** `--x: 1px` → `['--x', '1px']`; anything else → `undefined`. */
const declarationOf = (text: string): [string, string] | undefined => {
  const colon = text.indexOf(':');
  if (colon < 0) return undefined;
  const name = text.slice(0, colon).trim();
  const value = text.slice(colon + 1).trim();
  return CUSTOM_PROPERTY_NAME.test(name) && value ? [name, value] : undefined;
};

/** Code-unit order, so the list is the same on every machine and locale. */
const byCodeUnit = (a: string, b: string): number =>
  a < b ? -1 : Number(a > b);

/**
 * Every `--name: value` declaration with its selector and at-rule chain
 * (`@layer base > @media (min-width: 640px) > :root | --x: 1px`), sorted. At-rules
 * come first, as `:root { @media … }` and `@media … { :root }` are the same
 * rule. Two stylesheets with the same list set the same variables at the same
 * widths.
 */
export const customProperties = (css: string): string[] => {
  const context: string[] = [];
  const found: string[] = [];
  let buffer = '';
  for (const char of css) {
    if (char === '{') {
      context.push(normalizeCss(buffer));
      buffer = '';
    } else if (char === '}' || char === ';') {
      const declaration = declarationOf(buffer);
      if (declaration) {
        found.push(
          `${[
            ...context.filter((part) => part.startsWith('@')),
            ...context.filter((part) => !part.startsWith('@')),
          ].join(' > ')} | ${declaration[0]}: ${normalizeCss(declaration[1])}`,
        );
      }
      buffer = '';
      if (char === '}') context.pop();
    } else {
      buffer += char;
    }
  }
  return found.sort(byCodeUnit);
};
