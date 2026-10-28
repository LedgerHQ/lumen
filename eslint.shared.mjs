/** @import { Linter } from 'eslint' */
import lumen from '@ledgerhq/lumen-lint-plugin/eslint';
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults';
import storybook from 'eslint-plugin-storybook';
import { globalIgnores } from 'eslint/config';
import * as jsoncParser from 'jsonc-eslint-parser';

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
  ignores: [...globalIgnorePatterns, ...(config.ignores ?? [])],
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

/** Files no consumer loads, so their imports never need declaring. */
const devOnlyFiles = [
  '{projectRoot}/eslint.config.{js,cjs,mjs}',
  '{projectRoot}/{vite,vitest,tailwind}.config.{js,ts,mjs,mts}',
  '{projectRoot}/jest.{config,setup}.{js,ts}',
  '{projectRoot}/babel.config{,.bob}.{js,cjs}',
  '{projectRoot}/.storybook/**/*',
  '{projectRoot}/src/test-setup.{js,ts}',
  '{projectRoot}/src/**/*.{test,spec,stories,figma}.{js,jsx,ts,tsx}',
];

/**
 * `@nx/dependency-checks` for a published lib. Rule options are not merged
 * across configs, so a lib passes its extras here rather than overriding the
 * rule, which would drop `devOnlyFiles`.
 * @param {{ ignoredFiles?: string[], ignoredDependencies?: string[] }} [options]
 * @returns {Linter.Config}
 */
export const defineDependencyChecks = ({
  ignoredFiles = [],
  ignoredDependencies = [],
} = {}) => ({
  name: 'dependency-checks',
  // `**/*.json` would also put the unformatted tsconfig/figma JSON under prettier.
  files: ['package.json'],
  languageOptions: { parser: jsoncParser },
  rules: {
    '@nx/dependency-checks': [
      'error',
      {
        ignoredFiles: [...devOnlyFiles, ...ignoredFiles],
        ignoredDependencies,
      },
    ],
  },
});

/** Token rules that stories, docs and icon artwork break on purpose. */
const TOKEN_RULES_OFF = {
  'shadcn/no-arbitrary-values': 'off',
  'shadcn/no-inline-styles': 'off',
  'shadcn/no-restyle': 'off',
};

/** Where those rules do not apply: dev files, Storybook docs, icon artwork. */
const defineTokenRulesExemptions = () =>
  defineDevRules({
    name: 'lumen-token-rules-exemptions',
    files: ['**/.storybook/**', '**/Components/symbols/**'],
    rules: TOKEN_RULES_OFF,
  });

/**
 * Lumen's own React web rules: the `strict` preset that consumers can pick,
 * plus what only the design system itself needs.
 * @param {{ entryPoint: string, tailwindConfig: string }} options
 * @returns {Linter.Config[]}
 */
export const defineLumenReactRules = ({ entryPoint, tailwindConfig }) => [
  lumen.configs.strict,
  {
    name: 'lumen-react-rules',
    files: tsJsFilePatterns,
    settings: {
      'better-tailwindcss': {
        entryPoint,
        tailwindConfig,
        // Lumen components take `containerClassName`-style props. Setting
        // selectors replaces the defaults, so they are spread first.
        selectors: [
          ...getDefaultSelectors(),
          {
            kind: 'attribute',
            name: '^[a-z]\\w*ClassName$',
            match: [{ type: 'strings' }],
          },
        ],
      },
    },
    rules: {
      // A component library sets dynamic styles by design; the rule targets apps.
      'shadcn/no-inline-styles': 'off',
    },
  },
  defineTokenRulesExemptions(),
];
