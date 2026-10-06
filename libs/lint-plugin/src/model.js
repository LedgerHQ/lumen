import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';

/**
 * @typedef {'lumen' | 'better-tailwindcss' | 'shadcn'} PluginName
 * @typedef {'error' | 'warn' | 'off'} Level
 * @typedef {Level | 0 | 1 | 2} LevelInput
 * @typedef {'recommended' | 'strict'} PresetName
 * @typedef {LevelInput | [LevelInput] | [LevelInput, Record<string, unknown>]} RuleSetting
 * @typedef {{ id: string, level: Level, options?: Record<string, unknown> }} RuleEntry
 * @typedef {{
 *   selectors: Record<string, unknown>[],
 *   entryPoint?: string,
 *   tailwindConfig?: string,
 * }} TailwindSettings
 * @typedef {{
 *   name: string,
 *   files: string[],
 *   scope?: string[],
 *   plugins: PluginName[],
 *   rules: RuleEntry[],
 *   tailwind?: TailwindSettings,
 * }} Preset
 * @typedef {{
 *   preset?: PresetName,
 *   entryPoint?: string,
 *   tailwindConfig?: string,
 *   shadcn?: boolean,
 *   files?: string[],
 *   rules?: Record<string, RuleSetting>,
 * }} PresetOptions
 * @typedef {{
 *   id: string,
 *   recommended: Level,
 *   strict: Level,
 *   options?: Record<string, unknown>,
 *   tailwindV4Only?: boolean,
 * }} RuleDefinition
 */

// Engine-neutral description of what Lumen enforces. The ESLint and oxlint
// entry points only translate this data, so both engines see the same rules.
// Everything here must stay JSON-serializable: oxlint rejects anything else.
//
// `recommended` holds the core: what is a bug or breaks the design system's
// contract. `strict` adds a few more rules and raises the contract rules.
// Neither ever narrows what a consumer may do: layout classes stay allowed on
// Lumen components in both.

const PACKAGE = '@ledgerhq/lumen-lint-plugin';

const PRESET_NAMES = ['recommended', 'strict'];

const SOURCE_FILES = ['**/*.{ts,tsx,js,jsx}'];

const LUMEN_COMPONENTS = ['^@ledgerhq/lumen-ui-react(/|$)'];

/**
 * Every rule a consumer may enable through `rules`. A test compares these
 * lists with the real plugins, so an upgrade that adds or removes a rule fails
 * loudly instead of silently changing what is available.
 * @type {Record<PluginName, string[]>}
 */
export const KNOWN_RULES = {
  lumen: ['no-hardcoded-colors', 'no-hardcoded-style-literals'],
  'better-tailwindcss': [
    'enforce-canonical-classes',
    'enforce-consistent-class-order',
    'enforce-consistent-important-position',
    'enforce-consistent-line-wrapping',
    'enforce-consistent-variant-order',
    'enforce-consistent-variable-syntax',
    'enforce-logical-properties',
    'enforce-shorthand-classes',
    'no-concatenated-classes',
    'no-conflicting-classes',
    'no-deprecated-classes',
    'no-duplicate-classes',
    'no-restricted-classes',
    'no-unnecessary-whitespace',
    'no-unknown-classes',
  ],
  shadcn: [
    'no-arbitrary-values',
    'no-inline-styles',
    'no-raw-colors',
    'no-restyle',
    'no-unknown-classes',
    'require-static-classes',
  ],
};

// Arbitrary utilities that describe mechanics, not values that belong on the
// design scale: transitions, grid tracks, centering, calc(). Everything else
// in brackets (`w-[13px]`, `text-[#0082FC]`) is reported.
const STRUCTURAL_ARBITRARY_CLASSES = [
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
];

// shadcn's default text for these categories points at the component's source
// file, which means nothing to a consumer. Spacing keeps its built-in hint
// ("use margin here or gap on the parent").
const APPEARANCE_OWNED_MESSAGE =
  '{{component}} owns its appearance. Use its props (such as appearance or size) and keep className for layout. If the design needs something else, ask the Lumen team for a variant.';
const RESTYLE_MESSAGE = {
  color: APPEARANCE_OWNED_MESSAGE,
  typography: APPEARANCE_OWNED_MESSAGE,
  shape: APPEARANCE_OWNED_MESSAGE,
  effects: APPEARANCE_OWNED_MESSAGE,
  motion: APPEARANCE_OWNED_MESSAGE,
};

const LUMEN_RECOGNITION = { componentImports: LUMEN_COMPONENTS };

/** @type {RuleDefinition[]} */
const REACT_RULES = [
  { id: 'lumen/no-hardcoded-colors', recommended: 'error', strict: 'error' },
  // Classes Tailwind cannot generate, or that cancel each other: always bugs.
  {
    id: 'better-tailwindcss/no-unknown-classes',
    recommended: 'error',
    strict: 'error',
  },
  {
    id: 'better-tailwindcss/no-conflicting-classes',
    recommended: 'error',
    strict: 'error',
    tailwindV4Only: true,
  },
  {
    id: 'better-tailwindcss/no-concatenated-classes',
    recommended: 'error',
    strict: 'error',
  },
  // The design system's contract: className on a Lumen component is for layout.
  {
    id: 'shadcn/no-restyle',
    recommended: 'warn',
    strict: 'error',
    options: {
      allow: ['layout'],
      message: RESTYLE_MESSAGE,
      ...LUMEN_RECOGNITION,
    },
  },
  // Style consistency: autofixable, so an error in `strict` costs one `--fix`.
  {
    id: 'better-tailwindcss/enforce-consistent-class-order',
    recommended: 'off',
    strict: 'error',
  },
  {
    id: 'better-tailwindcss/enforce-canonical-classes',
    recommended: 'off',
    strict: 'error',
    tailwindV4Only: true,
  },
  {
    id: 'better-tailwindcss/no-deprecated-classes',
    recommended: 'off',
    strict: 'error',
    tailwindV4Only: true,
  },
  {
    id: 'better-tailwindcss/no-duplicate-classes',
    recommended: 'off',
    strict: 'error',
  },
  {
    id: 'better-tailwindcss/no-unnecessary-whitespace',
    recommended: 'off',
    strict: 'error',
  },
  // Signals, not gates: real apps need `h-[100dvh]` or a computed `style`.
  {
    id: 'shadcn/no-arbitrary-values',
    recommended: 'off',
    strict: 'warn',
    options: { allow: STRUCTURAL_ARBITRARY_CLASSES, ...LUMEN_RECOGNITION },
  },
  { id: 'shadcn/no-inline-styles', recommended: 'off', strict: 'warn' },
];

/** @type {RuleDefinition[]} */
const NATIVE_RULES = [
  { id: 'lumen/no-hardcoded-colors', recommended: 'error', strict: 'error' },
  {
    id: 'lumen/no-hardcoded-style-literals',
    recommended: 'off',
    strict: 'warn',
  },
];

const TAILWIND = 'better-tailwindcss';

/**
 * Default selectors already cover `cn` and `cva` (strings, `variants`,
 * `compoundVariants`); Lumen components also take `containerClassName`-style props.
 * @returns {Record<string, unknown>[]}
 */
function buildSelectors() {
  return [
    ...getDefaultSelectors(),
    {
      kind: 'attribute',
      name: '^[a-z]\\w*ClassName$',
      match: [{ type: 'strings' }],
    },
  ];
}

/** @type {Map<unknown, Level>} */
const LEVELS = new Map(
  /** @type {[unknown, Level][]} */ ([
    ['off', 'off'],
    ['warn', 'warn'],
    ['error', 'error'],
    [0, 'off'],
    [1, 'warn'],
    [2, 'error'],
  ]),
);

/**
 * @param {string} id
 * @param {unknown} input
 * @returns {Level}
 */
function toLevel(id, input) {
  const level = LEVELS.get(input);
  if (level === undefined) {
    throw new Error(
      `${PACKAGE}: invalid level ${JSON.stringify(input)} for "${id}". Use "off", "warn" or "error".`,
    );
  }
  return level;
}

/**
 * @param {string} id
 * @param {PluginName[]} plugins plugins the preset registers
 */
function assertKnownRule(id, plugins) {
  const separator = id.indexOf('/');
  const namespace = id.slice(0, separator);
  const name = id.slice(separator + 1);
  if (separator === -1 || !Object.hasOwn(KNOWN_RULES, namespace)) {
    throw new Error(
      `${PACKAGE}: unknown rule "${id}". Rule ids start with ${Object.keys(
        KNOWN_RULES,
      )
        .map((known) => `"${known}/"`)
        .join(', ')}.`,
    );
  }
  const pluginName = /** @type {PluginName} */ (namespace);
  if (!KNOWN_RULES[pluginName].includes(name)) {
    throw new Error(
      `${PACKAGE}: unknown rule "${id}". Rules in "${namespace}": ${KNOWN_RULES[pluginName].join(', ')}.`,
    );
  }
  if (!plugins.includes(pluginName)) {
    throw new Error(
      `${PACKAGE}: "${id}" needs the "${namespace}" plugin, which this preset does not register.`,
    );
  }
}

/**
 * Applies a consumer's `rules` on top of the preset: a bare level keeps the
 * preset's options, an options object is shallow-merged over them, and any
 * known rule of a registered plugin may be enabled. A rule the consumer sets
 * explicitly is always emitted (even `off`) so it also wins over earlier configs.
 * @param {RuleEntry[]} defaults every rule of the preset, including `off` ones
 * @param {Record<string, RuleSetting> | undefined} overrides
 * @param {PluginName[]} plugins
 * @returns {RuleEntry[]}
 */
function applyRuleOverrides(defaults, overrides, plugins) {
  const byId = new Map(defaults.map((entry) => [entry.id, entry]));
  const explicit = new Set();

  for (const [id, setting] of Object.entries(overrides ?? {})) {
    assertKnownRule(id, plugins);
    const [levelInput, userOptions] = Array.isArray(setting)
      ? setting
      : [setting];
    if (
      userOptions !== undefined &&
      (typeof userOptions !== 'object' ||
        userOptions === null ||
        Array.isArray(userOptions))
    ) {
      throw new Error(
        `${PACKAGE}: the options of "${id}" must be an object, for example ["warn", { ... }].`,
      );
    }
    const existing = byId.get(id);
    const options =
      userOptions === undefined
        ? existing?.options
        : { ...existing?.options, ...userOptions };
    byId.set(id, {
      id,
      level: toLevel(id, levelInput),
      ...(options && { options }),
    });
    explicit.add(id);
  }

  return [...byId.values()].filter(
    ({ id, level }) => level !== 'off' || explicit.has(id),
  );
}

/**
 * @param {RuleDefinition[]} definitions
 * @param {PresetName} presetName
 * @returns {RuleEntry[]}
 */
function toEntries(definitions, presetName) {
  return definitions.map((definition) => ({
    id: definition.id,
    level: definition[presetName],
    ...(definition.options && { options: definition.options }),
  }));
}

/**
 * @param {string[] | undefined} files
 * @returns {string[] | undefined}
 */
function validateFiles(files) {
  if (
    files !== undefined &&
    (!Array.isArray(files) ||
      files.length === 0 ||
      files.some((glob) => typeof glob !== 'string'))
  ) {
    throw new Error(
      `${PACKAGE}: "files" must be a non-empty array of glob strings, for example ["**/*.web.{ts,tsx}"].`,
    );
  }
  return files;
}

/**
 * @param {PresetOptions} options
 * @param {PresetName} presetName
 * @returns {Preset}
 */
function buildReactPreset(options, presetName) {
  const { entryPoint, tailwindConfig } = options;
  if (entryPoint === undefined && tailwindConfig === undefined) {
    // Without it Tailwind falls back to its default theme and every Lumen
    // class looks unknown, so fail here rather than report false positives.
    throw new Error(
      `${PACKAGE}: the React preset needs your Tailwind CSS entry. Pass { entryPoint: 'src/global.css' } (Tailwind v4) or { tailwindConfig: './tailwind.config.js' } (Tailwind v3).`,
    );
  }
  const files = validateFiles(options.files);
  const isTailwindV3 = tailwindConfig !== undefined && entryPoint === undefined;
  const withShadcn = options.shadcn ?? !isTailwindV3;
  /** @type {PluginName[]} */
  const plugins = withShadcn
    ? ['lumen', TAILWIND, 'shadcn']
    : ['lumen', TAILWIND];

  const applicable = REACT_RULES.filter(
    ({ id, tailwindV4Only }) =>
      (withShadcn || !id.startsWith('shadcn/')) &&
      !(tailwindV4Only && isTailwindV3),
  );

  return {
    name: `lumen/react/${presetName}`,
    files: files ?? SOURCE_FILES,
    ...(files && { scope: files }),
    plugins,
    rules: applyRuleOverrides(
      toEntries(applicable, presetName),
      options.rules,
      plugins,
    ),
    tailwind: {
      selectors: buildSelectors(),
      ...(entryPoint !== undefined && { entryPoint }),
      ...(tailwindConfig !== undefined && { tailwindConfig }),
    },
  };
}

/**
 * @param {PresetOptions} options
 * @param {PresetName} presetName
 * @returns {Preset}
 */
function buildReactNativePreset(options, presetName) {
  const files = validateFiles(options.files);
  /** @type {PluginName[]} */
  const plugins = ['lumen'];
  return {
    name: `lumen/react-native/${presetName}`,
    files: files ?? SOURCE_FILES,
    ...(files && { scope: files }),
    plugins,
    rules: applyRuleOverrides(
      toEntries(NATIVE_RULES, presetName),
      options.rules,
      plugins,
    ),
  };
}

/**
 * Both engines spell a configured rule `[level, options]` and a bare one `level`.
 * @param {Level} level
 * @param {Record<string, unknown> | undefined} options
 * @returns {Level | [Level, Record<string, unknown>]}
 */
export function toRuleValue(level, options) {
  return options === undefined ? level : [level, options];
}

/**
 * @param {'react' | 'react-native'} platform
 * @param {PresetOptions} [options]
 * @returns {Preset}
 */
export function buildPreset(platform, options = {}) {
  const presetName = options.preset ?? 'recommended';
  if (!PRESET_NAMES.includes(presetName)) {
    throw new Error(
      `${PACKAGE}: unknown preset "${presetName}". Use "recommended" or "strict".`,
    );
  }
  return platform === 'react'
    ? buildReactPreset(options, presetName)
    : buildReactNativePreset(options, presetName);
}
