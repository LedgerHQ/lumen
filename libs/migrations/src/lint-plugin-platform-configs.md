---
changes:
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-lint-plugin/eslint#*configs.recommended*'
    to: '@ledgerhq/lumen-lint-plugin/eslint#configs.react.recommended'
    signal: silent # spreading the old preset yields an empty config
    detect:
      - { pattern: '\b\w*[Ll]umen\w*\.configs\.recommended\b' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-lint-plugin/eslint#*configs.strict*'
    to: '@ledgerhq/lumen-lint-plugin/eslint#configs.react.strict'
    signal: silent
    detect:
      - { pattern: '\b\w*[Ll]umen\w*\.configs\.strict\b' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-lint-plugin/oxlint#*configs.recommended*'
    to: '@ledgerhq/lumen-lint-plugin/oxlint#configs.react.recommended'
    signal: silent
    detect:
      - { pattern: '\b\w*[Ll]umen\w*\.configs\.recommended\b' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-lint-plugin/oxlint#*configs.strict*'
    to: '@ledgerhq/lumen-lint-plugin/oxlint#configs.react.strict'
    signal: silent
    detect:
      - { pattern: '\b\w*[Ll]umen\w*\.configs\.strict\b' }
---

## Before → after

```js before
// eslint.config.mjs
import lumen from '@ledgerhq/lumen-lint-plugin/eslint';

export default [lumen.configs.recommended, { ...lumen.configs.strict, files: ['src/**/*.web.tsx'] }];
```

```js after
// eslint.config.mjs
import lumen from '@ledgerhq/lumen-lint-plugin/eslint';

export default [lumen.configs.react.recommended, { ...lumen.configs.react.strict, files: ['src/**/*.web.tsx'] }];
```

```ts before
// oxlint.config.ts
import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

const { jsPlugins, rules } = lumen.configs.strict;

export default defineConfig({
  extends: [lumen.configs.recommended],
  jsPlugins,
  overrides: [{ files: ['src/**/*.web.tsx'], rules }],
});
```

```ts after
// oxlint.config.ts
import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

const { jsPlugins, rules } = lumen.configs.react.strict;

export default defineConfig({
  extends: [lumen.configs.react.recommended],
  jsPlugins,
  overrides: [{ files: ['src/**/*.web.tsx'], rules }],
});
```

## Decide

The presets are grouped by platform: `configs.react.recommended`,
`configs.react.strict`, and new `configs.reactnative.recommended` and
`configs.reactnative.strict`, the same on the `/eslint` and `/oxlint` entries.
The old names are gone: a direct reference fails the config, a spread
(`{ ...lumen.configs.strict }`) silently lints nothing. The `oxlint/*.json`
paths are unchanged. Other plugins' presets (`js.configs.recommended`,
`tseslint.configs.strict`) are not Lumen's: leave them as they are.

`detect` matches the Lumen import by a binding named like `lumen`. If the
plugin is imported under another name, search that binding's `configs.*` too.

- Web apps: rename every `configs.recommended` / `configs.strict` to
  `configs.react.*`. Default: keep the same level.
- React Native apps (or `.native.tsx` files): add
  `lumen.configs.reactnative.recommended` (or `.strict`), scoped to the native
  files. It needs no Tailwind `settings`. With `.oxlintrc.json`, extend
  `@ledgerhq/lumen-lint-plugin/oxlint/react-native-recommended.json`. Default:
  add `recommended`.

Both web presets now report physical left/right classes
(`better-tailwindcss/enforce-logical-properties`,
`better-tailwindcss/no-restricted-classes`), and the React Native presets
physical style keys (`lumen/enforce-logical-properties`): warnings in
`recommended`, errors in `strict`. All autofix with `--fix`. Default: run
`--fix`, then review classes that must stay physical (a `translateX`-driven
position, a scroll-direction arrow) and disable the rule on that line with a
comment saying why.

## Verify

No Lumen `configs.recommended` / `configs.strict` reference left, only
`configs.react.*` and `configs.reactnative.*`. ESLint and oxlint load without a config error and
report on a file with `ml-4` (web) or `marginLeft` (React Native).
