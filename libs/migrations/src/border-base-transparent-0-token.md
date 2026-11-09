---
changes:
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--border-muted-transparent-0'
    to: '@ledgerhq/lumen-design-core#--border-base-transparent-0'
    signal: silent # an unknown CSS variable or class compiles and drops the style
    detect:
      - { pattern: 'border-muted-transparent-0' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-border-muted-transparent-0'
    to: '@ledgerhq/lumen-design-core#--color-border-base-transparent-0'
    signal: silent
    detect:
      - { pattern: 'border-muted-transparent-0' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.border.mutedTransparent0'
    to: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.border.baseTransparent0'
    signal: loud
    detect:
      - { pattern: 'border\.mutedTransparent0\b' }
pr: 711
---

## Before → after

```tsx before
<div className='border border-muted-transparent-0' />
const color = theme.colors.border.mutedTransparent0;
```

```tsx after
<div className='border border-base-transparent-0' />
const color = theme.colors.border.baseTransparent0;
```

## Decide

Rename the border token everywhere it appears: the Tailwind class,
`--border-*` and `--color-border-*` variables, and the JS theme key
`colors.border.mutedTransparent0` in every brand and mode. Both tokens are
fully transparent, so only gradients or transitions from them can look
different. Leave background tokens such as `bg-muted-transparent-0` as they
are.

## Verify

Zero `detect` hits. Typecheck passes.
