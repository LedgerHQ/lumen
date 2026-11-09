---
changes:
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--background-error-transparent'
    to: '@ledgerhq/lumen-design-core#--background-error-transparent-0'
    signal: silent # an unknown CSS variable or class compiles and drops the style
    detect:
      - { pattern: '(?:\b(?:bg|from|via|to|fill)|background)-error-transparent(?![-\w])' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--background-success-transparent'
    to: '@ledgerhq/lumen-design-core#--background-success-transparent-0'
    signal: silent
    detect:
      - { pattern: '(?:\b(?:bg|from|via|to|fill)|background)-success-transparent(?![-\w])' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-background-error-transparent'
    to: '@ledgerhq/lumen-design-core#--color-background-error-transparent-0'
    signal: silent
    detect:
      - { pattern: '(?:\b(?:bg|from|via|to|fill)|background)-error-transparent(?![-\w])' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-background-success-transparent'
    to: '@ledgerhq/lumen-design-core#--color-background-success-transparent-0'
    signal: silent
    detect:
      - { pattern: '(?:\b(?:bg|from|via|to|fill)|background)-success-transparent(?![-\w])' }
pr: 684
---

## Before → after

```tsx before
<div className='bg-linear-to-b from-error-strong to-error-transparent' />
<div style={{ background: 'linear-gradient(var(--background-success-strong), var(--background-success-transparent))' }} />
```

```tsx after
<div className='bg-linear-to-b from-error-strong to-error-transparent-0' />
<div style={{ background: 'linear-gradient(var(--background-success-strong), var(--background-success-transparent-0))' }} />
```

## Decide

Append `-0` to every `error-transparent` and `success-transparent` background
token: the Tailwind classes (`bg-*`, `from-*`, `via-*`, `to-*`, `fill-*`),
`--background-*` and `--color-background-*`. The values are unchanged. Leave
`border-error-transparent` and `border-success-transparent` as they are: they
are new, different tokens. JS theme keys (`bg.errorTransparent`) are not
renamed here.

Apply this before `status-backgrounds-solid`, which brings back
`bg-error-transparent` / `bg-success-transparent` as new 10% tints. Hits that
update creates are intended: don't add `-0` to them.

## Verify

Zero `detect` hits, before `status-backgrounds-solid` runs. Look at screens using these tokens, usually gradients
fading to transparent: they render as before.
