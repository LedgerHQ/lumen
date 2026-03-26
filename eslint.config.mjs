import nx from '@nx/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import {
  definedGlobalIgnores,
  defineGlobalRules,
  defineProdRules,
  defineDevRules,
} from './eslint.shared.mjs';

export default defineConfig(
  ...nx.configs['flat/base'],
  ...nx.configs['flat/react'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
  },
  defineGlobalRules({
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      /**
       * React
       */
      'react/self-closing-comp': ['error', { component: true, html: true }],
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
       * Others
       */
      'no-unused-vars': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['forwardRef'],
              message: 'Use ref as a regular prop instead (React 19 pattern).',
            },
            {
              name: 'react-native',
              importNames: ['TouchableOpacity'],
              message: 'Prefer usage of `Pressable`.',
            },
            {
              name: 'react-native',
              importNames: ['Animated', 'Easing', 'LayoutAnimation'],
              message: 'Prefer react-native-reanimated for animations.',
            },
          ],
        },
      ],
    },
  }),
  defineProdRules({
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      'no-console': 'error',
      'no-restricted-imports': 'error',
      'import/no-extraneous-dependencies': ['error'],
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
  }),
  defineDevRules({
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
    },
  }),
  eslintPluginPrettierRecommended,
  definedGlobalIgnores,
);
