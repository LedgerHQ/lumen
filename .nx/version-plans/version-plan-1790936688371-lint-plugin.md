---
'@ledgerhq/lumen-lint-plugin': minor
---

feat(lint-plugin): add ESLint and oxlint presets for better-tailwindcss and shadcn, preconfigured for Lumen

**Migrating from your own better-tailwindcss setup**

- Remove `eslint-plugin-better-tailwindcss` (dependency, config, any `lint:tailwind` script) and use `lumen.configs.recommended` or `strict` from `@ledgerhq/lumen-lint-plugin/eslint`. It registers better-tailwindcss and `@shadcn/lint`: don't register them again.
- Keep only `settings['better-tailwindcss'].entryPoint`, your Tailwind CSS file. Drop `callees`/`selectors` for `cn` and `cva`: the defaults cover them.
- Replace `prettier-plugin-tailwindcss` with the class-order rule: use `strict`, or add `'better-tailwindcss/enforce-consistent-class-order': 'error'`, then run `--fix`. If you keep the Prettier plugin, set its `tailwindStylesheet` to your `entryPoint` file.
- oxlint: remove better-tailwindcss from `jsPlugins`, extend `./node_modules/@ledgerhq/lumen-lint-plugin/oxlint/recommended.json`, and set `entryPoint` in your own `settings`.
- Rename better-tailwindcss v3 rules, for example `no-unregistered-classes` to `no-unknown-classes`.
- Requires ESLint 9.30+ with a flat config, or oxlint.
- Your own class names reported as unknown: add them to `ignore` in `better-tailwindcss/no-unknown-classes`.

Full setup: package README.
