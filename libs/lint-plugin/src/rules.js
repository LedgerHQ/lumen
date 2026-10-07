import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

// The presets are better-tailwindcss' own configs plus shadcn's rules, with
// options that know Lumen. Both engines read these same objects, so they must
// stay JSON-serializable: oxlint rejects anything else.

const LUMEN_COMPONENTS = ['^@ledgerhq/lumen-ui-react(/|$)'];

// shadcn's default text for these categories points at the component's source
// file, which means nothing to a consumer. Spacing keeps its built-in hint
// ("use margin here or gap on the parent").
const APPEARANCE_OWNED_MESSAGE =
  '{{component}} owns its appearance. Use its props (such as appearance or size) and keep className for layout. If the design needs something else, ask the Lumen team for a variant.';

/** className on a Lumen component is for layout; everything else is its job. */
export const NO_RESTYLE_OPTIONS = {
  allow: ['layout'],
  message: {
    color: APPEARANCE_OWNED_MESSAGE,
    typography: APPEARANCE_OWNED_MESSAGE,
    shape: APPEARANCE_OWNED_MESSAGE,
    effects: APPEARANCE_OWNED_MESSAGE,
    motion: APPEARANCE_OWNED_MESSAGE,
  },
  componentImports: LUMEN_COMPONENTS,
};

/**
 * Arbitrary utilities that describe mechanics, not values that belong on the
 * design scale. Everything else in brackets (`w-[13px]`) is reported.
 */
export const NO_ARBITRARY_VALUES_OPTIONS = {
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
};

/** @typedef {'recommended' | 'strict'} PresetName */

/** @type {Record<PresetName, Record<string, unknown>>} */
export const RULES = {
  // The core: classes Tailwind cannot generate or that cancel each other, and
  // restyling a Lumen component.
  recommended: {
    ...betterTailwindcss.configs.correctness.rules,
    // Explicit: stays even if better-tailwindcss moves it out of `correctness`.
    'better-tailwindcss/no-concatenated-classes': 'error',
    'shadcn/no-restyle': ['warn', NO_RESTYLE_OPTIONS],
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
  },
};
