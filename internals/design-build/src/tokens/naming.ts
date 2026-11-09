/**
 * The CSS custom property a token builds to. Figma names are normalized here,
 * once, for every output: lowercase, spaces to dashes, and the trailing `%` of
 * opacity steps and the `default` leaf dropped — `color.dark.crypto.Zcash-0%`
 * → `--color-dark-crypto-zcash-0`, `border-width.default` → `--border-width`.
 */
export const cssVariableName = (path: readonly string[]): string => {
  let name = path.join('-').toLowerCase().replace(/ /g, '-');
  if (name.endsWith('%')) name = name.slice(0, -1);
  if (name.endsWith('-default')) name = name.slice(0, -'-default'.length);
  return `--${name}`;
};

/** `{font.size.64}` → `var(--font-size-64)`. */
export const cssReference = (reference: string): string =>
  `var(${cssVariableName(reference.split('.'))})`;
