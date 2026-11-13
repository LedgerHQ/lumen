---
changes:
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--border-muted-transparent-0'
    to: '@ledgerhq/lumen-design-core#--border-base-transparent-0'
    signal: silent # an unknown CSS variable or class compiles and drops the style
    detect:
      - { pattern: '\b(border(-[xytrblse])?|divide|ring(-offset)?|outline|stroke|decoration)-muted-transparent-0\b' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-border-muted-transparent-0'
    to: '@ledgerhq/lumen-design-core#--color-border-base-transparent-0'
    signal: silent
    detect:
      - { pattern: '--color-border-muted-transparent-0\b' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.border.mutedTransparent0'
    to: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.border.baseTransparent0'
    signal: loud
    detect:
      - { pattern: 'border\.mutedTransparent0\b' }
      - { pattern: 'border\w*Color:\s*[''"]mutedTransparent0[''"]' }
pr: 711
---

## Before → after

```tsx before
<div className='border border-muted-transparent-0 ring-muted-transparent-0' />
<div style={{ borderColor: 'var(--color-border-muted-transparent-0)' }} />
const color = theme.colors.border.mutedTransparent0;
<Box lx={{ borderColor: 'mutedTransparent0' }} />
```

```tsx after
<div className='border border-base-transparent-0 ring-base-transparent-0' />
<div style={{ borderColor: 'var(--color-border-base-transparent-0)' }} />
const color = theme.colors.border.baseTransparent0;
<Box lx={{ borderColor: 'baseTransparent0' }} />
```

## Decide

Rename the border token everywhere it appears: Tailwind `border-*` (including
sides such as `border-t-*`), `divide-*`, `ring-*`, `ring-offset-*`, `outline-*`,
`stroke-*` and `decoration-*` classes, the `--border-*` and `--color-border-*`
variables, the JS theme key `colors.border.mutedTransparent0` in every brand and
mode, and React Native `lx` border color props (`borderColor`, `borderTopColor`,
…). Both tokens are fully transparent, so only gradients or transitions from
them can look different. Leave background tokens such as
`bg-muted-transparent-0` as they are.

## Verify

Zero `detect` hits. Typecheck passes.
