# @ledgerhq/lumen-lint-plugin

[better-tailwindcss](https://github.com/schoero/eslint-plugin-better-tailwindcss) and
[`@shadcn/lint`](https://github.com/shadcn-ui/lint), preconfigured for apps built with Lumen.
Same presets for ESLint and oxlint.

> The oxlint side is experimental: oxlint's JS plugin API is still alpha.

## Install

```bash
npm install -D @ledgerhq/lumen-lint-plugin
```

You also need `eslint` or `oxlint`, and `tailwindcss` v4.

## Usage

Pick a preset, then set your Tailwind CSS entry (the file with `@import 'tailwindcss'`).
Without it, every Lumen class is reported as unknown.

**Don't register better-tailwindcss or `@shadcn/lint` yourself** (`plugins`, `extends` or
oxlint `jsPlugins`): the presets do, and a second registration fails with "Cannot redefine
plugin". To use more of their rules, add them to `rules`.

**ESLint** (the presets set no parser, so keep your TypeScript setup)

```js
// eslint.config.mjs
import lumen from '@ledgerhq/lumen-lint-plugin/eslint';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended, // any TypeScript parser setup works
  lumen.configs.recommended, // or lumen.configs.strict
  { settings: { 'better-tailwindcss': { entryPoint: 'src/global.css' } } },
];
```

**oxlint**

```json
// .oxlintrc.json
{
  "extends": ["./node_modules/@ledgerhq/lumen-lint-plugin/oxlint/recommended.json"],
  "settings": { "better-tailwindcss": { "entryPoint": "src/global.css" } }
}
```

```ts
// oxlint.config.ts
import { defineConfig } from 'oxlint';
import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

export default defineConfig({
  extends: [lumen.configs.recommended],
  settings: { 'better-tailwindcss': { entryPoint: 'src/global.css' } },
});
```

## Rules

✅ error · ⚠️ warning · 🔧 fixable with `--fix` · empty: off

### better-tailwindcss

| Rule                                                                                                                                                                 | Recommended | Strict | 🔧  | Flags                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------: | :----: | :-: | --------------------------------------------------- |
| [`enforce-canonical-classes`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-canonical-classes.md)                         |             |   ✅   | 🔧  | Non-canonical class names                           |
| [`enforce-consistent-class-order`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-consistent-class-order.md)               |             |   ✅   | 🔧  | Classes out of order                                |
| [`enforce-consistent-important-position`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-consistent-important-position.md) |             |        | 🔧  | `!` on the wrong side of a class                    |
| [`enforce-consistent-line-wrapping`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-consistent-line-wrapping.md)           |             |        | 🔧  | Long class strings (conflicts with Prettier)        |
| [`enforce-consistent-variable-syntax`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-consistent-variable-syntax.md)       |             |        | 🔧  | Mixed CSS variable syntax                           |
| [`enforce-consistent-variant-order`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-consistent-variant-order.md)           |             |        | 🔧  | Variants out of order                               |
| [`enforce-logical-properties`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-logical-properties.md)                       |             |        | 🔧  | `ml-*` instead of `ms-*`                            |
| [`enforce-shorthand-classes`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-shorthand-classes.md)                         |             |        | 🔧  | `px-2 py-2` instead of `p-2`                        |
| [`no-concatenated-classes`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/no-concatenated-classes.md)                             |     ✅      |   ✅   |     | Classes built at runtime, like `` `text-${size}` `` |
| [`no-conflicting-classes`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/no-conflicting-classes.md)                               |     ✅      |   ✅   | 🔧  | Classes that cancel each other                      |
| [`no-deprecated-classes`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/no-deprecated-classes.md)                                 |             |   ✅   | 🔧  | Deprecated Tailwind classes                         |
| [`no-duplicate-classes`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/no-duplicate-classes.md)                                   |     ✅      |   ✅   | 🔧  | The same class twice                                |
| [`no-restricted-classes`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/no-restricted-classes.md)                                 |             |        | 🔧  | Classes you ban yourself                            |
| [`no-unknown-classes`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/no-unknown-classes.md)                                       |     ✅      |   ✅   | 🔧  | Classes your Tailwind setup cannot generate         |
| [`no-unnecessary-whitespace`](https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/no-unnecessary-whitespace.md)                         |             |   ✅   | 🔧  | Extra spaces between classes                        |

### shadcn

| Rule                                                                                                         | Recommended | Strict | 🔧  | Flags                                                            |
| ------------------------------------------------------------------------------------------------------------ | :---------: | :----: | :-: | ---------------------------------------------------------------- |
| [`no-arbitrary-values`](https://github.com/shadcn-ui/lint/blob/main/docs/rules/no-arbitrary-values.md)       |             |   ⚠️   |     | `w-[13px]` (transitions, grid tracks and `calc()` allowed)       |
| [`no-inline-styles`](https://github.com/shadcn-ui/lint/blob/main/docs/rules/no-inline-styles.md)             |             |   ⚠️   |     | `style={{ ... }}`                                                |
| [`no-raw-colors`](https://github.com/shadcn-ui/lint/blob/main/docs/rules/no-raw-colors.md)                   |             |        |     | Raw palette colors (already unknown classes with Lumen's preset) |
| [`no-restyle`](https://github.com/shadcn-ui/lint/blob/main/docs/rules/no-restyle.md)                         |     ⚠️      |   ✅   |     | Anything but layout classes on a Lumen component                 |
| [`no-unknown-classes`](https://github.com/shadcn-ui/lint/blob/main/docs/rules/no-unknown-classes.md)         |             |        |     | Unknown classes (use better-tailwindcss' rule instead)           |
| [`require-static-classes`](https://github.com/shadcn-ui/lint/blob/main/docs/rules/require-static-classes.md) |             |        |     | Dynamic `className` on a component                               |

## Customize

The presets are plain config objects.

- **Override a rule:** add your own `rules` after the preset (ESLint) or at the top level
  (oxlint).
- **Scope to some files:** the presets set no project-specific glob; you choose it.

  ```js
  // ESLint
  { ...lumen.configs.strict, files: ['src/**/*.web.tsx'] }
  ```

  ```ts
  // oxlint.config.ts (`.oxlintrc.json` cannot scope an extended preset)
  const { jsPlugins, rules } = lumen.configs.strict;

  export default defineConfig({
    jsPlugins,
    settings: { 'better-tailwindcss': { entryPoint: 'src/global.css' } },
    overrides: [{ files: ['src/**/*.web.tsx'], rules }],
  });
  ```

- **Keep Lumen's options when changing one:**

  ```js
  import { NO_RESTYLE_OPTIONS } from '@ledgerhq/lumen-lint-plugin/eslint';

  const rules = {
    'shadcn/no-restyle': ['warn', { ...NO_RESTYLE_OPTIONS, allow: ['layout', 'spacing'] }],
  };
  ```

## Notes

- `@shadcn/lint` reads component files with `oxc-parser` or `@typescript-eslint/parser`.
  If neither is installed, it warns once and `no-restyle` gives less precise hints.
- Using `prettier-plugin-tailwindcss`? Set its `tailwindStylesheet` to your `entryPoint`
  file, or Prettier and `strict`'s class order will disagree.

## Contributing

`src/rules.js` defines both presets. After changing it, run
`npx nx run @ledgerhq/lumen-lint-plugin:generate` and commit `oxlint/`. Tests check the
JSON presets, this table, and that ESLint and oxlint report the same diagnostics.
