import { prodConfig } from '../../eslint.config.mjs';
import {
  defineStorybookAddons,
  defineLumenReactRules,
} from '../../eslint.shared.mjs';

export default [
  ...prodConfig,
  defineStorybookAddons({ packageJsonLocation: '../../package.json' }),
  ...defineLumenReactRules({
    entryPoint: './src/styles.css',
    tailwindConfig: './tailwind.config.ts',
  }),
  {
    // `**/*.json` would also put the unformatted tsconfig/figma JSON under prettier.
    files: ['package.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/{vite,tailwind}.config.{js,ts,mjs,mts}',
            '{projectRoot}/babel.config.{js,cjs}',
            '{projectRoot}/.storybook/**/*',
            '{projectRoot}/src/test-setup.ts',
            '{projectRoot}/src/**/*.{test,stories,figma}.{ts,tsx}',
            // SVGR template read by `internals/sync-figma` codegen, never imported.
            '{projectRoot}/src/lib/Components/symbols/utils/icon-template.ts',
          ],
          // Types only: the public `NumericScale` / `CategoricalScale` in the
          // emitted `.d.ts` import from `d3-scale`, which ships no types.
          ignoredDependencies: ['@types/d3-scale'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
