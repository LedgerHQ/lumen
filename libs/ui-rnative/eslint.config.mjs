import { prodConfig } from '../../eslint.config.mjs';
import { defineDependencyChecks } from '../../eslint.shared.mjs';

export default [
  ...prodConfig,
  {
    ignores: ['public', '.cache', 'node_modules'],
  },
  defineDependencyChecks({
    ignoredFiles: [
      // SVGR template read by `internals/sync-figma` codegen, never imported.
      '{projectRoot}/src/lib/Components/symbols/utils/icon-template.ts',
    ],
    // Types only: the public `NumericScale` / `CategoricalScale` in the
    // emitted `.d.ts` import from `d3-scale`, which ships no types.
    // `@types/d3-shape` is not in the public types, but dropping it from
    // `dependencies` would change the published manifest.
    // `@types/react` pins consumers to React 19 types, which the public
    // props rely on (`ref` is a plain prop, no `forwardRef`).
    // `expo` is never imported, but `expo-haptics` peers on it and v15
    // needs SDK 54+.
    ignoredDependencies: [
      '@types/d3-scale',
      '@types/d3-shape',
      '@types/react',
      'expo',
    ],
  }),
];
