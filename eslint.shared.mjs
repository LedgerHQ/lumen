/** @import { Linter } from 'eslint' */
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import storybook from 'eslint-plugin-storybook';
import { globalIgnores } from 'eslint/config';

const ext = '{js,jsx,ts,tsx,cjs,cts,mjs,mts}';
const allFilePatterns = [`**/*.${ext}`];
const prodFilePatterns = [`src/**/*.${ext}`];

/** TS/JS source files that may contain Tailwind classes or Storybook config. */
const tsJsFilePatterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];

const devFilePatterns = [
  /** configs & tooling */
  `**/eslint.config.${ext}`,
  `**/test-setup.${ext}`,
  `**/jest.setup.${ext}`,

  /** specific files pattern */
  `**/*.stories.${ext}`,
  `**/*.figma.${ext}`,
  `**/*.test.${ext}`,
  `**/*.spec.${ext}`,

  /** specific folders considered as dev */
  `apps/**/*.${ext}`,
];

const globalIgnorePatterns = [
  'dist/**',
  '**/dist',
  '**/out-tsc',
  'node_modules',
  '**/storybook-static',
  '**/vite.config.*.timestamp*',
  '**/vitest.config.*.timestamp*',
];

export const definedGlobalIgnores = globalIgnores(globalIgnorePatterns);

/**
 * Define rules for all js/ts files
 * @param {Linter.Config} config
 * @returns {Linter.Config}
 */
export const defineGlobalRules = (config) => ({
  name: 'all-files-rules',
  ...config,
  files: allFilePatterns,
  ignores: globalIgnorePatterns,
});

/**
 * Define rules for production js/ts files
 * Production files should always be exposed in src/*
 * @param {Linter.Config} config
 * @returns {Linter.Config}
 */
export const defineProdRules = (config) => ({
  name: 'production-files-only-rules',
  ...config,
  files: [...prodFilePatterns, ...(config.files ?? [])],
  ignores: [
    ...devFilePatterns,
    ...globalIgnorePatterns,
    ...(config.ignores ?? []),
  ],
});

/**
 * Define rules for development js/ts files (tooling, tests, configs, etc.)
 * @param {Linter.Config} config
 * @returns {Linter.Config}
 */
export const defineDevRules = (config) => ({
  name: 'development-files-only-rules',
  ...config,
  files: [...devFilePatterns, ...(config.files ?? [])],
  ignores: [
    ...globalIgnorePatterns,
    ...(config.ignores ?? []),
  ],
});

/**
 * Storybook addon validation. Registers the Storybook plugin in scope so the
 * `no-uninstalled-addons` rule resolves, checking declared addons against the
 * given package.json.
 * @param {{ packageJsonLocation: string }} options
 * @returns {Linter.Config}
 */
export const defineStorybookAddons = ({ packageJsonLocation }) => ({
  name: 'storybook-addons-rules',
  files: tsJsFilePatterns,
  plugins: { storybook },
  rules: {
    'storybook/no-uninstalled-addons': ['error', { packageJsonLocation }],
  },
});

/**
 * Better Tailwind CSS rules and settings for a project's class utilities.
 * @param {{ entryPoint: string, tailwindConfig: string }} options
 * @returns {Linter.Config}
 */
export const defineTailwindRules = ({ entryPoint, tailwindConfig }) => ({
  name: 'better-tailwindcss-rules',
  files: tsJsFilePatterns,
  plugins: { 'better-tailwindcss': betterTailwindcss },
  rules: {
    ...betterTailwindcss.configs['recommended-warn'].rules,
    ...betterTailwindcss.configs['recommended-error'].rules,
    'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
  },
  settings: {
    'better-tailwindcss': {
      callees: [
        ['cn', [{ match: 'strings' }]],
        [
          'cva',
          [
            { match: 'strings' },
            {
              match: 'objectValues',
              pathPattern: '^compoundVariants\\[\\d+\\]\\.(?:className|class)$',
            },
          ],
        ],
      ],
      entryPoint,
      tailwindConfig,
    },
  },
});
