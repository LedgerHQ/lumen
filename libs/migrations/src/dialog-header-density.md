---
changes:
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#DialogHeader.appearance'
    to: '@ledgerhq/lumen-ui-react#DialogHeader.density'
    signal: loud
    detect:
      - { pattern: '<DialogHeader\b[^>]*\bappearance=' }
pr: 630
---

## Before → after

```tsx before
<DialogHeader appearance='expanded' title='Settings' onClose={onClose} />
```

```tsx after
<DialogHeader density='expanded' title='Settings' onClose={onClose} />
```

## Decide

Same values (`'compact'`, `'expanded'`), new name. Also rename it where
`DialogHeaderProps` objects are built or spread. To type a variable, use
`DialogHeaderProps['density']`.

## Verify

Zero `detect` hits. Typecheck passes.
