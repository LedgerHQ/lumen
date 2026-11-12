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

/**
 * Keeps `enforce-logical-properties` on the inline axis, the one RTL flips.
 * The block axis only moves in vertical writing modes, and sizes (`w-*`,
 * `size-*`) do not change with direction, so on Tailwind 4.2+ rewriting them
 * to `inline-*`/`block-*` is churn. `left-1/2` centers with
 * `-translate-x-1/2`, which a logical start would push off-center in RTL.
 */
export const LOGICAL_PROPERTIES_OPTIONS = deepFreeze({
  ignore: [
    '^(?:.*:)?!?-?(?:(?:scroll-)?[mp][tb]|top|bottom|border-[tb]|(?:min-|max-)?[wh]|size)(?:-|$)',
    String.raw`^(?:.*:)?!?-?left-(?:1/2|\[50%\])$`,
  ],
});

/**
 * `left-*`/`right-*` until Tailwind 4.2: `enforce-logical-properties` fixes
 * them to `inset-s-*`/`inset-e-*`, which 4.1 cannot generate, so it skips them
 * silently. `start-*`/`end-*` exist on every Tailwind 4. `left-1/2` centering
 * stays, as in {@link LOGICAL_PROPERTIES_OPTIONS}.
 */
export const NO_RESTRICTED_CLASSES_OPTIONS = deepFreeze({
  restrict: [
    {
      pattern: String.raw`^((?:.*:)?!?-?)left-(?!(?:1/2|\[50%\])$)(.+)$`,
      fix: '$1start-$2',
      message:
        '"$0" stays on the left in right-to-left locales: use "$1start-$2".',
    },
    {
      pattern: '^((?:.*:)?!?-?)right-(.+)$',
      fix: '$1end-$2',
      message:
        '"$0" stays on the right in right-to-left locales: use "$1end-$2".',
    },
  ],
});

/** @typedef {'recommended' | 'strict' | 'react-native-strict'} PresetName */
/** @typedef {'better-tailwindcss' | 'shadcn' | 'lumen'} PluginName */

/** @type {Record<PresetName, PluginName[]>} */
export const PLUGINS = {
  recommended: ['better-tailwindcss', 'shadcn'],
  strict: ['better-tailwindcss', 'shadcn'],
  'react-native-strict': ['lumen'],
};

/** @type {Record<PresetName, Record<string, unknown>>} */
export const RULES = {
  // The core: classes Tailwind cannot generate or that cancel each other,
  // and duplicates.
  recommended: {
    ...betterTailwindcss.configs.correctness.rules,
    // Explicit: stays even if better-tailwindcss moves it out of `correctness`.
    'better-tailwindcss/no-concatenated-classes': 'error',
    // Never a valid choice, and `--fix` removes it.
    'better-tailwindcss/no-duplicate-classes': 'error',
    'no-restricted-imports': ['error', NO_RESTRICTED_IMPORTS_OPTIONS],
  },
  // Adds better-tailwindcss' stylistic rules (autofixable, so an error costs
  // one `--fix`), and arbitrary values and inline styles as signals.
  strict: {
    ...betterTailwindcss.configs['recommended-error'].rules,
    // Conflicts with Prettier, which owns line breaks.
    'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    // `ms-*` over `ml-*`: the layout mirrors itself in right-to-left locales.
    'better-tailwindcss/enforce-logical-properties': [
      'error',
      LOGICAL_PROPERTIES_OPTIONS,
    ],
    'better-tailwindcss/no-restricted-classes': [
      'error',
      NO_RESTRICTED_CLASSES_OPTIONS,
    ],
    'shadcn/no-arbitrary-values': ['warn', NO_ARBITRARY_VALUES_OPTIONS],
    'shadcn/no-inline-styles': 'warn',
    'no-restricted-imports': ['error', NO_RESTRICTED_IMPORTS_OPTIONS],
  },
  'react-native-strict': {
    'lumen/enforce-logical-properties': 'error',
  },
};
