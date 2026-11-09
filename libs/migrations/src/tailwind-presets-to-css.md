---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-design-core#*Preset'
    signal: loud # importing a preset fails the build
    detect:
      - { pattern: '\b(ledgerLive|enterprise|websites|allBrands)Preset\b' }
      - { pattern: '@config\s', expect: review }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#primitivesTheme.:root.@media*theme("screens.*'
    to: '@ledgerhq/lumen-design-core#primitivesTheme.:root.@media*px).*'
    signal: silent # reading the old key gives undefined
    detect:
      - { pattern: 'theme\(["'']screens\.' }
  - change: removed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--tw-shadow-color'
    signal: silent # the shadow-* classes still read it, with their default color
    detect:
      - { pattern: '--tw-shadow-color', expect: review }
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

```ts before
const md = primitivesTheme[':root']['@media (min-width: theme("screens.md"))'];
```

```css after
@import 'tailwindcss';
@import '@ledgerhq/lumen-design-core/tailwind/ledger-live.css';
@import '@ledgerhq/lumen-ui-react/tailwind.css';
```

```ts after
const md = primitivesTheme[':root']['@media (min-width: 768px)'];
```

## Decide

The Tailwind JS presets and their plugins are gone: the theme ships as
Tailwind v4 CSS, with the same classes and token values, so nothing changes on
screen.

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
- Code that reads the typography layers of `primitivesTheme` by key: the media
  queries now hold Lumen's pixel widths (`sm` 640px, `md` 768px, `lg` 1024px,
  `xl` 1280px) instead of `theme("screens.*")`, which only a Tailwind preset
  could resolve.
- Lumen no longer declares `--tw-shadow-color`. The presets never shipped a
  shadow color, so the `shadow-*` classes keep their default color. Review code
  that sets the variable by hand.

## Verify

The app builds, and a page using Lumen classes (`bg-base`, `heading-0`,
`text-muted`) renders as before, in light and dark. Zero `detect` hits for the
preset names and `theme("screens.`; each remaining `@config` is reviewed.
