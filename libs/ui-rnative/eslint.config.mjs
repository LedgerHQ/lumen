import { prodConfig } from '../../eslint.config.mjs';

export default [
  ...prodConfig,
  {
    ignores: ['public', '.cache', 'node_modules'],
  },
  {
    // `**/*.json` would also put the unformatted tsconfig/figma JSON under prettier.
    files: ['package.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/jest.{config,setup}.ts',
            '{projectRoot}/babel.config{,.bob}.{js,cjs}',
            '{projectRoot}/.storybook/**/*',
            '{projectRoot}/src/**/*.{test,stories,figma}.{ts,tsx}',
            // SVGR template read by `internals/sync-figma` codegen, never imported.
            '{projectRoot}/src/lib/Components/symbols/utils/icon-template.ts',
          ],
          // Types only: the public `NumericScale` / `CategoricalScale` in the
          // emitted `.d.ts` import from `d3-scale`, which ships no types.
          // `@types/react` pins consumers to React 19 types, which the public
          // props rely on (`ref` is a plain prop, no `forwardRef`).
          // `expo` is never imported, but `expo-haptics` peers on it and v15
          // needs SDK 54+.
          ignoredDependencies: ['@types/d3-scale', '@types/react', 'expo'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
