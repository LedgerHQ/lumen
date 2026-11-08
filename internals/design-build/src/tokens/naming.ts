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

/** `bitcoin-cash` → `bitcoinCash`, `celo-2` → `celo2`; numeric steps such as `050-10` stay as they are. */
export const camelKey = (key: string): string => {
  const lower = key.toLowerCase();
  if (/^\d/.test(lower)) return lower;
  return lower.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
};

/** `16` → `s16`, `05` → `s05`; named steps (`md`, `full`) stay as they are. */
export const stepKey = (key: string): string =>
  /^\d/.test(key) ? `s${key}` : key;

/** `canvas-muted` → `canvasMuted`, `aion-0` → `aion0`: digits join the previous word. */
export const semanticKey = (rest: string): string =>
  rest
    .split('-')
    .reduce(
      (key, part, index) =>
        index === 0
          ? part
          : /^\d+$/.test(part)
            ? `${key}${part}`
            : `${key}${part[0].toUpperCase()}${part.slice(1)}`,
      '',
    );
