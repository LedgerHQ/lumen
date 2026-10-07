# @ledgerhq/lumen-lint-plugin

Predefined ESLint and oxlint configs for apps built with the Lumen design system:
better-tailwindcss and `@shadcn/lint`, with options that know Lumen. The package adds no
rules of its own, and both engines get the same rules.

> **The oxlint side is experimental.** It builds on oxlint's JS plugin API, which oxlint
> documents as alpha and outside its semver, so it may change in a minor release of this
> package.

## Quick start

```bash
npm install -D @ledgerhq/lumen-lint-plugin
```

Add `eslint` and/or `oxlint`, and `tailwindcss` v4. They are optional peers: a project
installs only the engine it runs.

Register a preset, then point better-tailwindcss at your Tailwind CSS entry (the file that
has `@import 'tailwindcss'`). Without it, Tailwind's default theme is used and Lumen
classes are reported as unknown.

**ESLint** (flat config)

```js
// eslint.config.mjs
import lumen from '@ledgerhq/lumen-lint-plugin/eslint';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended, // the presets do not set a parser
  lumen.configs.recommended, // or lumen.configs.strict
  {
    settings: {
      'better-tailwindcss': { entryPoint: 'src/global.css' },
    },
  },
];
```

**oxlint** with `.oxlintrc.json`

```json
{
  "extends": ["./node_modules/@ledgerhq/lumen-lint-plugin/oxlint/recommended.json"],
  "settings": {
    "better-tailwindcss": { "entryPoint": "src/global.css" }
  }
}
```

**oxlint** with `oxlint.config.ts` (Node 20.19+ or 22.18+)

```ts
import { defineConfig } from 'oxlint';
import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

export default defineConfig({
  extends: [lumen.configs.recommended],
  settings: {
    'better-tailwindcss': { entryPoint: 'src/global.css' },
  },
});
```

## Presets

`recommended` is better-tailwindcss' `correctness` config plus restyling a Lumen component
as a warning: every finding is a bug or breaks the design system's contract, so it is safe
to turn on in an existing codebase. `strict` is better-tailwindcss' `recommended` config as
errors, with restyling raised and two shadcn signals added.

| Rule                                                                                         | recommended | strict    | Flags                                                                         |
| -------------------------------------------------------------------------------------------- | ----------- | --------- | ----------------------------------------------------------------------------- |
| `better-tailwindcss/no-unknown-classes`, `no-conflicting-classes`, `no-concatenated-classes` | error       | error     | Classes Tailwind cannot generate, that cancel each other, or built at runtime |
| `shadcn/no-restyle`                                                                          | warn        | **error** | Anything but layout classes on a Lumen component                              |
| `better-tailwindcss`: class order, canonical, deprecated, duplicate, whitespace              | off         | **error** | Style findings, all fixed by `--fix`                                          |
| `shadcn/no-arbitrary-values`                                                                 | off         | **warn**  | `w-[13px]`-style classes (transitions, grid tracks and `calc()` are allowed)  |
| `shadcn/no-inline-styles`                                                                    | off         | **warn**  | `style={{ ... }}`                                                             |

- **Layout is always allowed.** Both presets let every layout class through on a Lumen
  component: margin, width and height, flex and grid placement, positioning, z-index and
  visibility. Padding, color, typography, shape, effects and motion are reported, because
  the component owns them.
- **Arbitrary values and inline styles are warnings**, even in `strict`: real apps need
  `h-[100dvh]` or a computed `style` now and then.
- **Classes are found with better-tailwindcss' default selectors**, which cover
  `className`, `cn`, `cva` (with `variants` and `compoundVariants`), `clsx`, `twMerge`,
  `tv` and more. The presets do not change them.

## Customize

The presets are plain config, so you override them the usual way.

- **ESLint:** add a config object after the preset. To scope a preset, spread it with your
  own `files`: `{ ...lumen.configs.strict, files: ['src/mvvm/**/*.tsx'] }`.
- **oxlint:** your own top-level `rules` beat the preset's. Scoped presets (below) apply
  through `overrides`, so override them with your own `overrides`.

```js
{
  rules: {
    'shadcn/no-inline-styles': 'off',
    'better-tailwindcss/enforce-logical-properties': 'warn',
  },
}
```

Replacing a rule's options replaces all of them. To keep Lumen's messages and component
detection while allowing more on Lumen components, spread the exported options:

```js
import { NO_RESTYLE_OPTIONS } from '@ledgerhq/lumen-lint-plugin/eslint';

const rules = {
  'shadcn/no-restyle': ['warn', { ...NO_RESTYLE_OPTIONS, allow: ['layout', 'spacing'] }],
};
```

## Monorepos with web and native files

Some repos keep both platforms in one package and tell them apart by file suffix
(`Card.web.tsx`, `Card.native.tsx`). Scope the preset to the web files:

```js
// ESLint
export default [{ ...lumen.configs.recommended, files: ['**/*.web.{ts,tsx}'] }, { settings: { 'better-tailwindcss': { entryPoint: '../../apps/web/src/global.css' } } }];
```

```json
// .oxlintrc.json: `recommended.web.json` and `strict.web.json` are scoped to *.web.{ts,tsx}
{
  "extends": ["./node_modules/@ledgerhq/lumen-lint-plugin/oxlint/recommended.web.json"],
  "settings": {
    "better-tailwindcss": { "entryPoint": "../../apps/web/src/global.css" }
  }
}
```

In a codebase that is only partly migrated, point the preset at the migrated folders and
widen it over time. Design tokens can be used anywhere, so there is no reliable per-file
signal to detect Lumen code from.

## Tailwind v3

The presets target Tailwind v4. A Tailwind v3 app sets
`settings["better-tailwindcss"].tailwindConfig` instead of `entryPoint`, and turns off the
`shadcn/*` rules and the v4-only `no-conflicting-classes`, `enforce-canonical-classes` and
`no-deprecated-classes`.

## Gotchas

- **Do not register better-tailwindcss or `@shadcn/lint` yourself.** The preset does. A
  second copy fails with "Cannot redefine plugin" in ESLint and "already registered" in
  oxlint. Remove your own better-tailwindcss setup and dependency when you adopt a preset.
- **oxlint ignores `settings` of an extended config**, so the entry point always goes in
  your own config, on both engines.
- **Tailwind rules are the slow part under oxlint.** Native oxlint rules are fast; JS-plugin
  rules run on a single thread, and better-tailwindcss reads your Tailwind setup per file.
  Scope the preset and measure with `oxlint --debug=timings`.
- **Editors:** the oxlint extension needs "Oxc: Restart Server" after you change a plugin or
  its config.

## Contributing

The package is plain ESM JavaScript with JSDoc types, so the repo lints itself with the
source: no build is needed, and editors, git hooks and cold CI behave the same.

```bash
npx nx run @ledgerhq/lumen-lint-plugin:test       # presets + conformance on both engines
npx nx run @ledgerhq/lumen-lint-plugin:typecheck
npx nx run @ledgerhq/lumen-lint-plugin:generate   # regenerates oxlint/*.json
npx nx run @ledgerhq/lumen-lint-plugin:build      # emits .d.ts for publishing
```

- `src/rules.js` holds the two presets as plain data. `src/eslint.js` and `src/oxlint.js`
  wrap them for each engine, and `scripts/generate-oxlint-json.js` writes the JSON presets
  from the same data. After changing it, run `generate` and commit `oxlint/`: a test fails
  if it is stale.
- `src/conformance.test.js` lints the files in `fixtures/` through ESLint, the `/oxlint`
  configs and the JSON presets, and requires identical diagnostics (rule, line, severity).
- `src/plugins/` holds two re-export files. oxlint resolves a bare plugin name from the
  consumer's folder, which fails under pnpm; going through a file of ours lets Node resolve
  the dependency from here instead.
- Lumen consumes this package like an app does, through `eslint.shared.mjs`, with the
  `strict` preset and one override.
