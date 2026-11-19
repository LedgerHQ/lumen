---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-design-core#primitivesTheme'
    signal: loud # importing it fails the build
    detect:
      - { pattern: '\bprimitivesTheme\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-design-core#*CSSTheme'
    signal: loud
    detect:
      - { pattern: '\b(ledgerLive|enterprise|websites|allBrands)CSSTheme\b' }
---

## Before → after

```ts before
// tailwind.config.ts
import plugin from 'tailwindcss/plugin';
import { ledgerLiveCSSTheme, primitivesTheme } from '@ledgerhq/lumen-design-core';

export default {
  plugins: [
    plugin(({ addBase }) => {
      addBase(primitivesTheme);
      addBase(ledgerLiveCSSTheme);
    }),
  ],
};

const gap = primitivesTheme[':root']['--spacing-16'];
```

```css after
/* The app's main stylesheet */
@import '@ledgerhq/lumen-design-core/themes/css/ledger-live.css';
```

```ts after
import { cssVar } from '@ledgerhq/lumen-design-core';

const gap = cssVar('var(--spacing-16)');
```

## Decide

The JS objects holding Lumen's CSS variables are no longer exported. The same
variables ship as plain CSS files, with the same names and values:
`themes/css/ledger-live.css`, `enterprise.css` and `websites.css` (light on
`:root`, dark under `.dark`), and `all-brands.css` (brand picked by a
`.ledger-live`, `.enterprise` or `.websites` class on a parent). They have no
Tailwind directive, so they work with or without Tailwind.

- Code that injects the objects as CSS (`addBase`, a global style, a
  CSS-in-JS `createGlobalStyle`): remove it and import the matching file at the
  top of the app's main stylesheet. `primitivesTheme` plus
  `ledgerLiveCSSTheme` → `ledger-live.css`; `allBrandsCSSTheme` →
  `all-brands.css`. If the app already uses a Lumen Tailwind preset, the
  preset injects the variables: drop the injection without adding an import.
- Code that reads one variable to use it in CSS (`style`, SVG `fill`): use
  `cssVar('var(--…)')`, which type-checks the name.
- Code that needs a raw value in JS (canvas, a third-party API): read it from
  the JS theme for the brand, such as `ledgerLiveThemes[colorScheme]`, or with
  `getComputedStyle(element).getPropertyValue('--…')`. Default: `cssVar`, and
  keep the value a CSS variable.

## Verify

Zero `detect` hits. Typecheck and the build pass. A page using Lumen's
variables (backgrounds, text colors) renders as before, in light and dark.
