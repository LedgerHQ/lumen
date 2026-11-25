---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-design-core#*Preset'
    signal: loud # importing a preset fails the build
    detect:
      - { pattern: '\b(ledgerLive|enterprise|websites|allBrands)Preset\b' }
      - { pattern: '@config\s', expect: review }
      - { pattern: '"tailwindcss":\s*"[~^]?3\.', in: manifests, expect: review }
  - change: removed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--tw-shadow*'
    signal: silent # Tailwind's shadow-* set --tw-shadow now; they no longer read --tw-shadow-color
    detect:
      - { pattern: '--tw-shadow-color', expect: review }
      - { pattern: '\bshadow-(current|inherit|transparent)\b', expect: review }
---

## Before → after

```ts before
// tailwind.config.ts
import { ledgerLivePreset } from '@ledgerhq/lumen-design-core';

export default { presets: [ledgerLivePreset], content: ['./src/**/*.tsx'] };
```

```css before
@import 'tailwindcss';
@config '../tailwind.config.ts';
@import '@ledgerhq/lumen-ui-react/tailwind.css';
```

```css before
.card {
  --tw-shadow-color: var(--background-muted);
}
```

```tsx before
<div className='shadow-lg shadow-current' />
```

```css after
@import 'tailwindcss';
@import '@ledgerhq/lumen-design-core/themes/tailwind/ledger-live.css';
@import '@ledgerhq/lumen-ui-react/tailwind.css';
```

## Decide

The Tailwind JS presets and their plugins are gone: the theme ships as
Tailwind v4 CSS, with the same classes and token values, so nothing changes on
screen.

- The theme needs Tailwind v4. A project still on Tailwind 3 upgrades it first
  (`npx @tailwindcss/upgrade`), then applies the steps below.

- In the main stylesheet, replace the `@config` line with an import of the
  matching brand file, right after `@import 'tailwindcss'`:
  `ledgerLivePreset` → `ledger-live.css`, `enterprisePreset` →
  `enterprise.css`, `websitesPreset` → `websites.css`, `allBrandsPreset` →
  `all-brands.css` (brands switched by a class on a parent). Keep
  `@ledgerhq/lumen-ui-react/tailwind.css` after it.
- Remove the preset from `tailwind.config.ts`, and delete the file when nothing
  is left. Keep `@config` only for settings of your own.
- Point the Prettier Tailwind plugin (`tailwindStylesheet`) and
  `eslint-plugin-better-tailwindcss` (`entryPoint`) at the stylesheet instead
  of the config.
- `tailwindcss` is now an optional peer of `@ledgerhq/lumen-design-core`: web
  apps already install it, React Native apps don't need it.
- The `shadow-*` classes now use the shadow tokens as they are, so
  `--tw-shadow-color` and the `shadow-current`, `shadow-inherit` and
  `shadow-transparent` classes no longer change their color. Review each use:
  drop it, or write the colored shadow in your own CSS.

## Verify

The app builds, and a page using Lumen classes (`bg-base`, `heading-0`,
`text-muted`) renders as before, in light and dark. Zero `detect` hits for the
preset names; each remaining `@config` and shadow-color hit is reviewed.
