/** @import { Linter } from 'eslint' */
import { globalIgnores } from 'eslint/config';

const ext = '{js,jsx,ts,tsx,cjs,cts,mjs,mts}';
const allFilePatterns = [`**/*.${ext}`];
const prodFilePatterns = [`src/**/*.${ext}`];

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

const tsParserOptions = {
  parserOptions: {
    projectService: true,
    tsconfigRootDir: import.meta.dirname,
  },
};

export const definedGlobalIgnores = globalIgnores(globalIgnorePatterns);

/**
 * Define rules for all js/ts files
 * @param {Linter.Config} config
 * @returns {Linter.Config}
 */
export const defineGlobalRules = (config) => ({
  name: 'all-files-rules',
  languageOptions: {
    ...config.languageOptions,
    ...tsParserOptions,
  },
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
  languageOptions: {
    ...config.languageOptions,
    ...tsParserOptions,
  },
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
  languageOptions: {
    ...config.languageOptions,
    ...tsParserOptions,
  },
  files: [...devFilePatterns, ...(config.files ?? [])],
  ignores: [
    ...globalIgnorePatterns,
    ...(config.ignores ?? []),
  ],
});
