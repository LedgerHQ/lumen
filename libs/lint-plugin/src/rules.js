import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

// The presets are better-tailwindcss' own configs plus shadcn's rules, with
// options that know Lumen. Both engines read these same objects, so they must
// stay JSON-serializable: oxlint rejects anything else.

const LUMEN_COMPONENTS = ['^@ledgerhq/lumen-ui-react(/|$)'];

/**
 * The exported options are shared by both presets and by every consumer that
 * spreads them, so a mutation anywhere would change them for everyone.
 * @template T
 * @param {T} value
 * @returns {T}
 */
function deepFreeze(value) {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

// shadcn's default text for these categories points at the component's source
// file, which means nothing to a consumer. Spacing keeps its built-in hint
// ("use margin here or gap on the parent").
const APPEARANCE_OWNED_MESSAGE =
  '{{component}} owns its appearance. Use its props (such as appearance or size) and keep className for layout. If the design needs something else, ask the Lumen team for a variant.';

/** className on a Lumen component is for layout; everything else is its job. */
export const NO_RESTYLE_OPTIONS = deepFreeze({
  allow: ['layout'],
  message: {
    color: APPEARANCE_OWNED_MESSAGE,
    typography: APPEARANCE_OWNED_MESSAGE,
    shape: APPEARANCE_OWNED_MESSAGE,
    effects: APPEARANCE_OWNED_MESSAGE,
    motion: APPEARANCE_OWNED_MESSAGE,
  },
  componentImports: LUMEN_COMPONENTS,
});

/**
 * Arbitrary utilities that describe mechanics, not values that belong on the
 * design scale. Everything else in brackets (`w-[13px]`) is reported.
 */
export const NO_ARBITRARY_VALUES_OPTIONS = deepFreeze({
  allow: [
    'transition-*',
    'grid-rows-*',
    'grid-cols-*',
    'translate-*',
    'bg-linear-*',
    'top-[50%]',
    'left-[50%]',
    'rounded-[inherit]',
    'max-w-[calc(*',
    'w-[calc(*',
    '[-webkit-mask-clip:no-clip]',
  ],
  componentImports: LUMEN_COMPONENTS,
});

const USE_LUMEN_CN_MESSAGE =
  "Use cn from '@ledgerhq/lumen-design-core/cn': it joins classes like clsx and resolves conflicts between Lumen classes, which plain tailwind-merge misreads.";

/**
 * Pushes class composition to Lumen's `cn`. A consumer who sets their own
 * `no-restricted-imports` replaces this whole entry, so they spread these
 * options to keep ours.
 */
export const NO_RESTRICTED_IMPORTS_OPTIONS = deepFreeze({
  paths: ['tailwind-merge', 'clsx', 'classnames'].map((name) => ({
    name,
    message: USE_LUMEN_CN_MESSAGE,
  })),
});

/** @typedef {'recommended' | 'strict'} PresetName */

/** @type {Record<PresetName, Record<string, unknown>>} */
export const RULES = {
  // The core: classes Tailwind cannot generate or that cancel each other,
  // duplicates, and restyling a Lumen component.
  recommended: {
    ...betterTailwindcss.configs.correctness.rules,
    // Explicit: stays even if better-tailwindcss moves it out of `correctness`.
    'better-tailwindcss/no-concatenated-classes': 'error',
    // Never a valid choice, and `--fix` removes it.
    'better-tailwindcss/no-duplicate-classes': 'error',
    'shadcn/no-restyle': ['warn', NO_RESTYLE_OPTIONS],
    'no-restricted-imports': ['warn', NO_RESTRICTED_IMPORTS_OPTIONS],
  },
  // Adds better-tailwindcss' stylistic rules (autofixable, so an error costs
  // one `--fix`), and arbitrary values and inline styles as signals.
  strict: {
    ...betterTailwindcss.configs['recommended-error'].rules,
    // Conflicts with Prettier, which owns line breaks.
    'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    'shadcn/no-restyle': ['error', NO_RESTYLE_OPTIONS],
    'shadcn/no-arbitrary-values': ['warn', NO_ARBITRARY_VALUES_OPTIONS],
    'shadcn/no-inline-styles': 'warn',
    'no-restricted-imports': ['error', NO_RESTRICTED_IMPORTS_OPTIONS],
  },
};
