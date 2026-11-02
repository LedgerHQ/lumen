import { prodConfig } from '../../eslint.config.mjs';
import {
  defineDependencyChecks,
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
  defineDependencyChecks({
    ignoredFiles: [
      // SVGR template read by `internals/sync-figma` codegen, never imported.
      '{projectRoot}/src/lib/Components/symbols/utils/icon-template.ts',
    ],
    // Types only: the public `NumericScale` / `CategoricalScale` in the
    // emitted `.d.ts` import from `d3-scale`, which ships no types.
    // `@types/d3-shape` is not in the public types, but dropping it from
    // `dependencies` would change the published manifest.
    ignoredDependencies: ['@types/d3-scale', '@types/d3-shape'],
  }),
];
