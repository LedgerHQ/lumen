/**
 * Converts a camelCase theme key into the kebab-case fragment used by the CSS
 * variable / theme-path documentation strings. Handles camelCase, letter->digit
 * and digit->letter boundaries (e.g. `mutedTransparent0` -> `muted-transparent-0`,
 * `heading0SemiBold` -> `heading-0-semi-bold`). Used only to render readable
 * documentation labels (CSS variable names, Tailwind utility names shown as
 * text); never to build a `className` applied to an element.
 */
export const toKebab = (key: string): string =>
  key
    .replace(/(\d)([a-zA-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

export const humanize = (key: string): string =>
  toKebab(key)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** Strips the `s` prefix from spacing/size keys (e.g. `s16` -> `16`). */
export const stripSizePrefix = (key: string): string => key.replace(/^s/, '');
