---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#ThemeProvider.themes'
    signal: loud
    detect:
      - { pattern: '<ThemeProvider\b[^>]*\bthemes=' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#LumenThemes'
    signal: loud
    detect:
      - { pattern: '\bLumenThemes\b[^;''"]*from\s*[''"]@ledgerhq/lumen-ui-react[''"]' } # ui-rnative still exports it
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#useTheme.theme'
    signal: silent # still typed, but always undefined at runtime
    detect:
      - { pattern: 'useTheme\(\)\.theme\b|\{[^}]*\btheme\b[^}]*\}\s*=\s*useTheme\(' }
      - { pattern: '\buseTheme\(', expect: review } # reads through a variable
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-design-core#primitivesTheme'
    signal: loud # typed as its literal keys, no longer Record<string, …>
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-design-core#allBrandsCSSTheme'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-design-core#ledgerLiveCSSTheme'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-design-core#enterpriseCSSTheme'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-design-core#websitesCSSTheme'
    signal: loud
pr: 661
---

## Before → after

```tsx before
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider, useTheme } from '@ledgerhq/lumen-ui-react';
import type { LumenThemes } from '@ledgerhq/lumen-ui-react';

const themes: LumenThemes = ledgerLiveThemes;

<ThemeProvider themes={themes} colorScheme='system'>
  <App />
</ThemeProvider>;

const Chart = () => {
  const { theme } = useTheme();
  return <Line stroke={theme.colors.border.base} />;
};
```

```tsx after
import { cssVar } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-react';

<ThemeProvider colorScheme='system'>
  <App />
</ThemeProvider>;

const Chart = () => <Line stroke={cssVar('var(--color-border-base)')} />;
```

## Decide

Only files importing from `@ledgerhq/lumen-ui-react` are in scope. In
`@ledgerhq/lumen-ui-rnative`, `ThemeProvider` still requires `themes` and
`useTheme().theme` still works: leave them.

- Drop `themes` from `ThemeProvider`. Replace the `LumenThemes` type with
  `LedgerLiveThemes` from `@ledgerhq/lumen-design-core`.
- `useTheme().theme` is now `undefined`, including reads through a variable
  (`const ctx = useTheme(); ctx.theme`). For each read:
  - A value that ends up in CSS (`style`, SVG `fill`/`stroke`): use the CSS
    variable through `cssVar('var(--…)')`, typed against Lumen's tokens.
    It follows the brand and color scheme without a re-render (the default).
  - A raw value that can't be a CSS variable (canvas, a third-party API):
    read the object the app passed to `themes`, indexed by the color scheme:
    `const { colorScheme } = useTheme(); const theme = ledgerLiveThemes[colorScheme];`.
- `primitivesTheme`, `allBrandsCSSTheme` and the `*CSSTheme` objects are
  now typed by their exact keys and literal values. Indexing with a known
  literal key works as before. Where code indexes with a `string`, type the
  key as `keyof typeof …`, or cast the object to
  `Record<string, Record<string, string>>` when the key is truly dynamic.

## Verify

Zero `detect` hits in web files, and no `useTheme` hit still reads `theme`.
Typecheck passes, which also catches a `themes` prop on an aliased
`ThemeProvider`. Screens that read theme values (charts,
canvases) render with the right colors in light and dark.
