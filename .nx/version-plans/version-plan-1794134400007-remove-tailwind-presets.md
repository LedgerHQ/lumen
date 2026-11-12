---
'@ledgerhq/lumen-design-core': patch
---

feat(tailwind)!: BREAKING — the Tailwind JS presets (`ledgerLivePreset`, `enterprisePreset`, `websitesPreset`, `allBrandsPreset`) and their plugins are removed; the theme ships only as Tailwind v4 CSS. Replace `@config '…/tailwind.config.ts'` with `@import '@ledgerhq/lumen-design-core/tailwind/<brand>.css';` after `@import 'tailwindcss'` (same classes and token values, so nothing changes on screen) — migration steps in the package README. `tailwindcss` moves from `dependencies` to an optional peer dependency: web apps already install it, and React Native apps, which only read the JS theme, don't need it.
