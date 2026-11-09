import reactNativeA11y from 'eslint-plugin-react-native-a11y';
import { prodConfig } from '../../eslint.config.mjs';
import {
  defineDependencyChecks,
  defineProdRules,
} from '../../eslint.shared.mjs';

export default [
  ...prodConfig,
  {
    ignores: ['public', '.cache', 'node_modules'],
  },
  // `jsx-a11y` only knows DOM elements; this covers the RN primitives.
  defineProdRules({
    name: 'react-native-a11y-rules',
    plugins: { 'react-native-a11y': reactNativeA11y },
    rules: {
      ...reactNativeA11y.configs.all.rules,
      // Demands a hint wherever there is a label; hints are for non-obvious
      // outcomes only, so a blanket requirement adds screen-reader noise.
      'react-native-a11y/has-accessibility-hint': 'off',
    },
  }),
  // The RN twin of better-tailwindcss' `enforce-logical-properties`: start/end
  // keys mirror in RTL whatever `I18nManager.swapLeftAndRightInRTL` says.
  // `src/styles` is the `lx` API, which keeps the physical keys for consumers.
  // Charts plot on physical x coordinates, so their insets stay left/right.
  defineProdRules({
    name: 'react-native-logical-properties',
    ignores: ['src/styles/**', 'src/lib/Components/visualization/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'Property > Identifier.key[name=/^(margin|padding)(Left|Right)$|^border(Left|Right)(Width|Color)$|^border(Top|Bottom)(Left|Right)Radius$/]',
          message:
            'Use the logical key (marginStart, paddingEnd, borderStartWidth, borderTopStartRadius…) so the layout mirrors in right-to-left locales.',
        },
        {
          selector:
            "ObjectExpression:not(:has(> Property[key.name='right'])) > Property > Identifier.key[name='left']",
          message:
            'Use `start` so the element sits on the leading side in right-to-left locales.',
        },
        {
          selector:
            "ObjectExpression:not(:has(> Property[key.name='left'])) > Property > Identifier.key[name='right']",
          message:
            'Use `end` so the element sits on the trailing side in right-to-left locales.',
        },
      ],
    },
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
