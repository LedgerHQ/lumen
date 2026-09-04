import nx from '@nx/eslint-plugin';
import storybook from 'eslint-plugin-storybook';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import {
  definedGlobalIgnores,
  defineGlobalRules,
  defineProdRules,
  defineDevRules,
} from './eslint.shared.mjs';

export const sharedConfig = defineConfig(
  ...nx.configs['flat/base'],
  ...nx.configs['flat/react'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...storybook.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      ...importPlugin.flatConfigs.typescript.settings,
      'import/ignore': ['node_modules'],
    },
  },
  defineGlobalRules({
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
      'import/no-cycle': ['error', { ignoreExternal: true }],
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
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
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
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      /**
       * Others
       */
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'default-param-last': 'error',
      'no-negated-condition': 'error',
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
            {
              name: 'react',
              importNames: ['ElementRef'],
              message: 'ElementRef is deprecated. Use ComponentRef<T> instead.',
            },
            {
              name: 'react',
              importNames: ['MutableRefObject'],
              message: 'MutableRefObject is deprecated. Use RefObject instead.',
            },
            {
              name: '@base-ui/react',
              message:
                'Use path import "@base-ui/react/<component-name>" instead.',
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

export const prodConfig = defineConfig(
  ...sharedConfig,
  defineProdRules({
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      'react/display-name': 'error',
      'no-console': 'error',
      'import/no-extraneous-dependencies': ['error'],
      'import/no-default-export': 'error',

      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-require-imports': 'error',
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
            /**
             * `internals/*` is dev-only tooling that never ships. Nothing
             * published may import it — that direction is already blocked by
             * the constraints above, none of which allow `scope:internal`.
             * `scope:shared` is allowed inbound so tooling can reuse
             * platform-agnostic helpers from `utils-shared`.
             */
            {
              sourceTag: 'scope:internal',
              onlyDependOnLibsWithTags: ['scope:internal', 'scope:shared'],
            },
          ],
        },
      ],
    },
  }),
);