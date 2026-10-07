---
'@ledgerhq/lumen-lint-plugin': minor
---

feat(lint-plugin): add ESLint and oxlint presets for better-tailwindcss and shadcn, preconfigured for Lumen

If you sort classes with `prettier-plugin-tailwindcss`, set its `tailwindStylesheet` option to the same CSS file as the presets' `entryPoint`. Without it, Prettier doesn't know your theme's classes and orders them differently from the `strict` preset's class-order rule.
