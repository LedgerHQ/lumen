# @ledgerhq/lumen-lint-plugin

ESLint and oxlint rules for apps built with the Lumen design system, behind one setup:
better-tailwindcss and `@shadcn/lint` preconfigured for Lumen, plus design-token rules.
Same rule ids on both engines.

> **The oxlint side is experimental.** It builds on oxlint's JS plugin API, which oxlint
> documents as alpha and outside its semver, so it may change in a minor release of this
> package.

## Quick start

```bash
npm install -D @ledgerhq/lumen-lint-plugin
```

Add `eslint` and/or `oxlint` (and `tailwindcss` v4 for web). They are optional peers: a
project installs only the engine it runs.

Point the preset at your Tailwind CSS entry, the file that has `@import 'tailwindcss'`.
It is required: without it Tailwind falls back to its default theme and every Lumen class
looks unknown, so the React preset throws a clear error instead.

**ESLint** (flat config)

```js
// eslint.config.mjs
import { react } from '@ledgerhq/lumen-lint-plugin/eslint';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended, // the presets do not set a parser
  ...react({ entryPoint: 'src/global.css' }),
];
```

**oxlint** with `oxlint.config.ts` (Node 20.19+ or 22.18+)

```ts
import { defineConfig } from 'oxlint';
import { react } from '@ledgerhq/lumen-lint-plugin/oxlint';

export default defineConfig({
  extends: [react({ entryPoint: 'src/global.css' })],
});
```

**oxlint** with `.oxlintrc.json` (any Node version)

```json
{
  "extends": ["./node_modules/@ledgerhq/lumen-lint-plugin/oxlint/react.json"],
  "settings": {
    "better-tailwindcss": { "entryPoint": "src/global.css" }
  }
}
```

React Native apps use `reactNative()` (or `oxlint/react-native.json`); it needs no
Tailwind entry.

## Presets

`recommended` (default) is the core: a violation is a bug or breaks the design system's
contract, and nothing here is a matter of taste. It is safe to turn on in an existing
codebase. `strict` adds a few more rules and raises the contract rule.

| Rule                                                                                         | recommended | strict    | Flags                                                                                                        |
| -------------------------------------------------------------------------------------------- | ----------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `better-tailwindcss/no-unknown-classes`, `no-conflicting-classes`, `no-concatenated-classes` | error       | error     | Classes Tailwind cannot generate, that cancel each other, or that are built at runtime                       |
| `lumen/no-hardcoded-colors` (React, React Native)                                            | error       | error     | Hex, `rgb()`, `hsl()` and named colors in style objects and color props                                      |
| `shadcn/no-restyle`                                                                          | warn        | **error** | Anything but layout classes on a Lumen component                                                             |
| `better-tailwindcss`: class order, canonical, deprecated, duplicate, whitespace              | off         | **error** | Style findings, all fixed by `--fix`                                                                         |
| `shadcn/no-arbitrary-values`                                                                 | off         | **warn**  | `w-[13px]`-style classes (transitions, grid tracks and `calc()` are allowed)                                 |
| `shadcn/no-inline-styles`                                                                    | off         | **warn**  | `style={{ ... }}`                                                                                            |
| `lumen/no-hardcoded-style-literals` (React Native)                                           | off         | **warn**  | Numeric or `%` size, spacing and radius values inside `useStyleSheet`, `StyleSheet.create` and `style` props |

Bold cells are what `strict` adds or raises. It stays moderate on purpose:

- **Layout is always allowed.** Both presets let every layout class through on a Lumen
  component: margin, width and height, flex and grid placement, positioning, z-index and
  visibility. Only padding, color, typography, shape, effects and motion are reported,
  because the component owns them.
- **Arbitrary values and inline styles are warnings**, not errors, even in `strict`: real
  apps need `h-[100dvh]` or a computed `style` now and then.
- **Style rules are fixable.** They fail in `strict`, and `--fix` clears them.

## Customize

Every rule can be tuned through the `rules` option, with the same shape on both engines
(`'off'`, `'warn'`, `'error'` or `[level, options]`):

```js
react({
  entryPoint: 'src/global.css',
  preset: 'strict',
  rules: {
    // A bare level keeps the preset's options.
    'shadcn/no-inline-styles': 'off',
    // An options object is merged over the preset's, so `message` and
    // `componentImports` are kept.
    'shadcn/no-restyle': ['warn', { allow: ['layout', 'spacing'] }],
    'lumen/no-hardcoded-colors': ['error', { allow: ['#0082FC'] }],
    // Any rule of the three plugins can be enabled, not only the preset's.
    'better-tailwindcss/enforce-logical-properties': 'warn',
  },
});
```

An id that does not exist throws and lists the valid ones. Other options:

| Option           | Meaning                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `preset`         | `'recommended'` (default) or `'strict'`                                                                        |
| `entryPoint`     | Your Tailwind v4 CSS entry, relative to where you run the linter. Required unless `tailwindConfig` is set      |
| `tailwindConfig` | A `tailwind.config.*` file. On its own it means Tailwind v3: the v4-only rules and `@shadcn/lint` are left out |
| `files`          | Globs that scope the preset, for example `['**/*.web.{ts,tsx}']`                                               |
| `rules`          | Overrides, see above                                                                                           |
| `shadcn`         | `false` leaves `@shadcn/lint` out (and so `no-restyle` and the two shadcn rules of `strict`)                   |

If you configure by hand instead, later wins on ESLint (add one more config object), and
on oxlint your own top-level `rules` beat the preset's. When a preset is scoped with
`files`, oxlint applies it through `overrides`, so override it with your own `overrides`.

## Monorepos with web and native files

Many repos keep both platforms in one package and tell them apart by file suffix
(`Card.web.tsx`, `Card.native.tsx`). Scope one preset to each:

```js
// ESLint
export default [...react({ entryPoint: '../../apps/web/src/global.css', files: ['**/*.web.{ts,tsx}'] }), ...reactNative({ files: ['**/*.native.{ts,tsx}'] })];
```

```json
// .oxlintrc.json: the scoped presets are generated for exactly this convention
{
  "extends": ["./node_modules/@ledgerhq/lumen-lint-plugin/oxlint/react.web.json", "./node_modules/@ledgerhq/lumen-lint-plugin/oxlint/react-native.native.json"],
  "settings": {
    "better-tailwindcss": { "entryPoint": "../../apps/web/src/global.css" }
  }
}
```

Files that match neither pattern (hooks, types, logic) are left alone. In a codebase that
is only partly migrated, point the preset at the migrated folders and widen it over time;
design tokens can be used anywhere, so there is no reliable per-file signal to detect Lumen
code from.

## JSON presets

For `.oxlintrc.json` users, `oxlint/` ships generated presets:
`react`, `react-strict`, `react-native`, `react-native-strict` (apply everywhere), and
`react.web`, `react-strict.web`, `react-native.native`, `react-native-strict.native`
(scoped to `*.web.{ts,tsx}` / `*.native.{ts,tsx}`).

- They carry the plugins and rules but **not** your Tailwind entry: oxlint does not
  inherit `settings` from an extended file, so set
  `settings["better-tailwindcss"].entryPoint` in your own config.
- They are Tailwind v4 only. Tailwind v3 apps use the factory with `tailwindConfig`.
- The plugin paths inside are relative to the preset, so they resolve under pnpm's strict
  layout too.
- To tune one, add your own `rules` (unscoped presets) or `overrides` (scoped ones).

## Migrating from a hand-written better-tailwindcss config

Remove your own `eslint-plugin-better-tailwindcss` setup (a separate ESLint pass for
Tailwind, `callees`/`attributes` lists, the dependency itself) and replace it with the
preset: it already lints `cn`, `cva` (with `variants` and `compoundVariants`), `clsx`,
`twMerge` and `*ClassName` props. Do not keep two copies of the plugin.

## Gotchas

- **Do not register better-tailwindcss or `@shadcn/lint` yourself.** The preset does. A
  second copy fails with "Cannot redefine plugin" in ESLint and "already registered" in oxlint.
- **oxlint drops `settings` of an extended config.** The factory therefore also passes the
  Tailwind options to every rule, so `extends` works; only the JSON presets need your own
  `settings`.
- **Tailwind rules are the slow part under oxlint.** Native oxlint rules are fast; JS-plugin
  rules run on a single thread, and better-tailwindcss reads your Tailwind setup per file.
  Scope the preset with `files` and measure with `oxlint --debug=timings`.
- **Editors:** the oxlint extension needs "Oxc: Restart Server" after you change a plugin or
  its config.

## Contributing

The package is plain ESM JavaScript with JSDoc types, so the repo lints itself with the
source: no build is needed, and editors, git hooks and cold CI behave the same.

```bash
npx nx run @ledgerhq/lumen-lint-plugin:test       # rules on both engines + conformance
npx nx run @ledgerhq/lumen-lint-plugin:typecheck
npx nx run @ledgerhq/lumen-lint-plugin:generate   # regenerates oxlint/*.json
npx nx run @ledgerhq/lumen-lint-plugin:build      # emits .d.ts for publishing
```

- `src/model.js` describes the presets as data. `src/eslint.js` and `src/oxlint.js` only
  translate it, and `scripts/generate-oxlint-json.js` writes the JSON presets from the same
  data, so every setup sees the same rules. After changing the model, run `generate` and
  commit `oxlint/`: a test fails if it is stale.
- Rules use the ESLint `create(context)` API with no parser services, which is what lets
  oxlint load them. `*.cases.js` files hold one case table run by both rule testers.
- `src/conformance.test.js` lints the files in `fixtures/` through ESLint, the `/oxlint`
  factory and the JSON presets, and requires identical diagnostics (rule, line, severity).
- `src/plugins/` holds two re-export files. oxlint resolves a bare plugin name from the
  consumer's folder, which fails under pnpm; going through a file of ours lets Node resolve
  the dependency from here instead.
- Lumen consumes this package like an app does, through `eslint.shared.mjs`, with the
  `strict` preset and a few `rules` overrides.
