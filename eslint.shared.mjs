/** @import { Linter } from 'eslint' */
import { globalIgnores } from 'eslint/config';

const extensions = '{js,jsx,ts,tsx,cjs,cts,mjs,mts}';
const allFilePatterns = [`**/*.${extensions}`];
const prodFilePatterns = [`libs/src/**/*.${extensions}`];

const devFilePatterns = [
  /** configs & tooling */
  `eslint.config.${extensions}`,
  `jest.setup.${extensions}`,

  /** specific files pattern */
  `**/*.stories.${extensions}`,
  `**/*.figma.${extensions}`,
  `**/*.test.${extensions}`,
  `**/*.spec.${extensions}`,

  /** specific folders considered as dev */
  `apps/**/*.${extensions}`,
];

const globalIgnorePatterns = [
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
    ...prodFilePatterns,
    ...globalIgnorePatterns,
    ...(config.ignores ?? []),
  ],
});
