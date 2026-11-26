import type { Token } from '@lumen/design-sources';

/**
 * Every group reaches the web outputs (CSS and Tailwind). React Native reads
 * the ones without `webOnly`.
 */
export type Group = {
  /** Why React Native doesn't read the group. */
  webOnly?: string;
  /** Tailwind theme namespaces the group's CSS variables fill. */
  tailwind?: string[];
  /** Prepended to the Tailwind key, so groups can share a namespace (`crypto-bitcoin`). */
  tailwindPrefix?: string;
  /** Where the React Native theme puts the group, from `t`. */
  reactNative?: string;
};

const THEME_LAYER =
  'the theme layer; React Native reads the brand layer that aliases it';

const SIZE_NAMESPACES = [
  '--width',
  '--height',
  '--size',
  '--min-width',
  '--min-height',
  '--max-height',
  '--columns',
];
const BACKGROUND_NAMESPACES = [
  '--background-color',
  '--accent-color',
  '--fill',
];
const TEXT_NAMESPACES = [
  '--text-color',
  '--caret-color',
  '--placeholder-color',
];
const BORDER_NAMESPACES = [
  '--border-color',
  '--stroke',
  '--ring-color',
  '--outline-color',
  '--ring-offset-color',
  '--text-decoration-color',
];

/**
 * Every token group the outputs build, keyed by token path prefix: the
 * longest matching key wins, and `collection:` narrows a key to one
 * collection. A token no row matches fails the build, so a new Figma group
 * can't silently skip an output. Rows are in output order.
 */
export const GROUPS: Record<string, Group> = {
  // Layout
  spacing: { tailwind: ['--spacing'], reactNative: 'spacings' },
  'icon-width': { reactNative: 'icon.width' },
  'icon-height': { reactNative: 'icon.height' },
  'icon-border-width': { reactNative: 'icon.borderWidth' },
  'spot-width': { reactNative: 'spot.width' },
  'spot-height': { reactNative: 'spot.height' },
  'spinner-border-width': { reactNative: 'spinner.borderWidth' },
  size: { tailwind: SIZE_NAMESPACES, reactNative: 'sizes' },
  'border-radius': { tailwind: ['--radius'], reactNative: 'borderRadius' },
  stroke: { reactNative: 'stroke' },
  'border-width': { reactNative: 'borderWidth' },
  'brand:border-width': {
    webOnly: 'Tailwind border defaults; React Native has borderWidth steps',
  },
  'backdrop-blur': { tailwind: ['--backdrop-blur'], reactNative: 'blur' },
  screen: { reactNative: 'breakpoints' },
  shadow: { tailwind: ['--shadow'], reactNative: 'shadows' },

  // Colors
  'color.light': { reactNative: 'primitiveColors' },
  'color.dark': { reactNative: 'primitiveColors' },
  'color.crypto': {
    tailwind: BACKGROUND_NAMESPACES,
    tailwindPrefix: 'crypto-',
    reactNative: 'colors.crypto',
  },
  'color.discover': {
    tailwind: BACKGROUND_NAMESPACES,
    tailwindPrefix: 'discover-',
    reactNative: 'colors.discover',
  },
  background: { tailwind: BACKGROUND_NAMESPACES, reactNative: 'colors.bg' },
  text: { tailwind: TEXT_NAMESPACES, reactNative: 'colors.text' },
  border: { tailwind: BORDER_NAMESPACES, reactNative: 'colors.border' },
  'color.background': { webOnly: THEME_LAYER },
  'color.text': { webOnly: THEME_LAYER },
  'color.border': { webOnly: THEME_LAYER },

  // Typography
  font: {
    webOnly:
      'the raw scale; React Native reads it through the typography styles',
  },
  'font-family': { reactNative: 'fontFamilies' },
  'font-style': { reactNative: 'typographies' },
  'font-style.heading.3.size 2': {
    webOnly: 'a duplicate Figma variable (`size 2`), flagged by validation',
  },

  // Motion
  duration: { reactNative: 'motion.durations' },
  delay: { reactNative: 'motion.delays' },
  easing: { reactNative: 'motion.easings' },
};

/** `brand:border-width` → `{ collection: 'brand', prefix: ['border-width'] }`. */
export const parseGroupKey = (
  key: string,
): { collection: string | null; prefix: string[] } => {
  const [collection, prefix] = key.includes(':') ? key.split(':') : [null, key];
  return { collection, prefix: prefix.split('.') };
};

/** The row a token belongs to, with its key; throws when none matches. */
export const groupOf = (token: Token): { key: string; group: Group } => {
  const path = token.path.join('.');
  const matches = Object.keys(GROUPS).filter((key) => {
    const { collection, prefix } = parseGroupKey(key);
    if (collection && collection !== token.source.collection) return false;
    const joined = prefix.join('.');
    return path === joined || path.startsWith(`${joined}.`);
  });
  if (!matches.length) {
    throw new Error(
      `No group for ${token.source.collection}:${path}: add it to GROUPS in design-build/src/tokens/groups.ts`,
    );
  }
  // Most specific first: a collection-narrowed key, then the longest prefix.
  const [key] = matches.sort(
    (a, b) =>
      Number(b.includes(':')) - Number(a.includes(':')) || b.length - a.length,
  );
  return { key, group: GROUPS[key] };
};
