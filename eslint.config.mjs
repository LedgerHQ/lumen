import nx from '@nx/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const allFilePatterns = ['**/*.{js,jsx,ts,tsx,cjs,cts,mjs,mts}'];
const prodFilePatterns = ['libs/src/**/*.{ts,tsx,js,jsx,cjs,cts,mjs,mts}'];
const devFilePatterns = [
  'eslint.config.mjs',
  '**/*.{ts,tsx}',
  '**/*.stories.{ts,tsx}',
  '**/*.figma.{ts,tsx}',
  '**/*.test.{ts,tsx}',
  '**/*.spec.{ts,tsx}',
  'apps/**/*.{ts,tsx}',
];

export default defineConfig(
  ...nx.configs['flat/base'],
  ...nx.configs['flat/react'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    plugins: {
      import: importPlugin,
    },
  },
  {
    ignores: [
      '**/dist',
      '**/storybook-static',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    name: 'all-files',
    files: allFilePatterns,
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      /**
       * import
       */
      'import/no-unused-modules': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      /**
       * typescript
       */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      /**
       * nx
       */
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'scope:react-native',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:react-native',
                'scope:ui-shared',
              ],
            },
            {
              sourceTag: 'scope:react',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:react',
                'scope:ui-shared',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'production-files',
    files: prodFilePatterns,
    ignores: devFilePatterns,
    rules: {
      'no-console': 'error',
      'no-restricted-imports': 'error',
      'import/no-extraneous-dependencies': ['error'],
    },
  },
  {
    name: 'development-files',
    files: devFilePatterns,
  },
  eslintPluginPrettierRecommended,
  globalIgnores(['**/out-tsc']),
);
