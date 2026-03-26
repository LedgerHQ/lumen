import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import storybook from 'eslint-plugin-storybook';

import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      storybook,
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      'storybook/no-uninstalled-addons': [
        'error',
        {
          packageJsonLocation: '../../package.json',
        },
      ],
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
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
                pathPattern:
                  '^compoundVariants\\[\\d+\\]\\.(?:className|class)$',
              },
            ],
          ],
        ],
        entryPoint: './src/styles.css',
        tailwindConfig: './tailwind.config.ts',
      },
    },
  },
  ...storybook.configs['flat/recommended'],
];
