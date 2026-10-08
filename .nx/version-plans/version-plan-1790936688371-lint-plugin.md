---
'@ledgerhq/lumen-lint-plugin': minor
---

feat(lint-plugin): add ESLint and oxlint presets for better-tailwindcss and shadcn, preconfigured for Lumen

**How to migrate**

- **Replace your own better-tailwindcss setup with a Lumen preset.** Remove `eslint-plugin-better-tailwindcss` from your dependencies and from your config: its `plugins` entry, its `configs.*`, and any separate Tailwind-only lint config or `lint:tailwind` script. Then extend `lumen.configs.recommended` (or `strict`) from `@ledgerhq/lumen-lint-plugin/eslint`. The presets register better-tailwindcss and `@shadcn/lint` themselves; registering them a second time fails with "Cannot redefine plugin".
- **Keep only your Tailwind entry in the settings.** Set `settings['better-tailwindcss'].entryPoint` to your Tailwind CSS file. Drop `callees` or `selectors` that only list `cn` and `cva`: the defaults already cover them (including `variants` and `compoundVariants`), plus `clsx`, `twMerge` and `tv`.
- **Sort classes with the Lumen preset instead of `prettier-plugin-tailwindcss`.** Remove the Prettier plugin and its `tailwind*` options, then use `lumen.configs.strict`, or add `'better-tailwindcss/enforce-consistent-class-order': 'error'` on top of `recommended`. `--fix` sorts the classes. If you keep the Prettier plugin, set its `tailwindStylesheet` to your `entryPoint` file, or Prettier and the lint rule will order classes differently.
- **oxlint:** remove better-tailwindcss from `jsPlugins`, extend `./node_modules/@ledgerhq/lumen-lint-plugin/oxlint/recommended.json` (or `strict.json`) in `.oxlintrc.json`, and set `entryPoint` in your own `settings`, since oxlint doesn't inherit the `settings` of an extended file.
- **Rename better-tailwindcss v3 rule ids** in your own rules, for example `no-unregistered-classes` becomes `no-unknown-classes`.
- **ESLint 8 and `.eslintrc`:** the presets are flat configs for ESLint 9.30 or later. Upgrade ESLint, or run the presets through oxlint.
- **Your own class names** (JS hooks, third-party classes) reported as unknown: list them in the `ignore` option of `better-tailwindcss/no-unknown-classes`.

The package README has the full setup.
