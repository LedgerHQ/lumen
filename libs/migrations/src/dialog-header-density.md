---
changes:
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#DialogHeader.appearance'
    to: '@ledgerhq/lumen-ui-react#DialogHeader.density'
    signal: loud
    detect:
      - { pattern: '<DialogHeader\b(?:[^>]|=>)*\bappearance=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#NavBar.appearance'
    to: '@ledgerhq/lumen-ui-rnative#NavBar.density'
    signal: loud
    detect:
      - { pattern: '<NavBar\b(?:[^>]|=>)*\bappearance=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#BottomSheetHeader.appearance'
    to: '@ledgerhq/lumen-ui-rnative#BottomSheetHeader.density'
    signal: loud
    detect:
      - { pattern: '<BottomSheetHeader\b(?:[^>]|=>)*\bappearance=' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#NavBarAppearance'
    signal: loud
pr: 630
---

## Before → after

```tsx before
<DialogHeader appearance='expanded' title='Settings' onClose={onClose} />
```

```tsx after
<DialogHeader density='expanded' title='Settings' onClose={onClose} />
```

React Native:

```tsx before
<NavBar appearance='compact'>…</NavBar>
```

```tsx after
<NavBar density='compact'>…</NavBar>
```

```tsx before
<BottomSheetHeader appearance='expanded' title='Settings' />
```

```tsx after
<BottomSheetHeader density='expanded' title='Settings' />
```

## Decide

Same values (`'compact'`, `'expanded'`), new name. Also rename it where
`DialogHeaderProps`, `NavBarProps` or `BottomSheetHeaderProps` objects are
built or spread. Neither UI package exports a `Density` type: replace
`NavBarAppearance` with `NavBarProps['density']`, and type other variables
with `DialogHeaderProps['density']` or `BottomSheetHeaderProps['density']`.

## Verify

Zero `detect` hits. Typecheck passes.
