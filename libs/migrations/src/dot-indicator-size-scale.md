---
changes:
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=xs'
    signal: loud
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=\{?[''"]xs[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=sm'
    signal: visual # 12px → 6px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=\{?[''"]sm[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=md'
    signal: visual # 14px → 8px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=\{?[''"]md[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=lg'
    signal: visual # 16px → 10px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=\{?[''"]lg[''"]', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size'
    signal: visual # default sm (12px) → md (8px)
    detect:
      - { pattern: '<DotIndicator\b(?![^>]*\bsize=)' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Avatar.showNotification'
    signal: visual # no dot on lg and xl avatars
    detect:
      - { pattern: '<Avatar\b[^>]*\bshowNotification', expect: review }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#DotIndicator.size=xs'
    signal: loud
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=\{?[''"]xs[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#DotIndicator.size=sm'
    signal: visual # 12px → 6px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=\{?[''"]sm[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#DotIndicator.size=md'
    signal: visual # 14px → 8px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=\{?[''"]md[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#DotIndicator.size=lg'
    signal: visual # 16px → 10px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=\{?[''"]lg[''"]', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#DotIndicator.size'
    signal: visual # default sm (12px) → md (8px)
    detect:
      - { pattern: '<DotIndicator\b(?![^>]*\bsize=)' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Avatar.showNotification'
    signal: visual # no dot on lg and xl avatars
    detect:
      - { pattern: '<Avatar\b[^>]*\bshowNotification', expect: review }
pr: 727
---

## Before → after

```tsx before
<DotIndicator appearance='red'>
  <Avatar src={src} alt='' size='sm' />
</DotIndicator>
<DotIndicator size='xs' appearance='red'>{icon}</DotIndicator>
<DotIndicator size='sm' appearance='red'>{icon}</DotIndicator>
<DotIndicator size='md' appearance='red'>{icon}</DotIndicator>
<DotIndicator size='lg' appearance='red'>{icon}</DotIndicator>
<Avatar src={src} alt='' size='lg' showNotification />
```

```tsx after
<DotIndicator size='xl' appearance='red'>
  <Avatar src={src} alt='' size='sm' />
</DotIndicator>
<DotIndicator size='lg' appearance='red'>{icon}</DotIndicator>
<DotIndicator size='xl' appearance='red'>{icon}</DotIndicator>
<DotIndicator size='xl' appearance='red'>{icon}</DotIndicator>
<DotIndicator size='xl' appearance='red'>{icon}</DotIndicator>
<Avatar src={src} alt='' size='lg' />
```

## Decide

Same change on both platforms. The scale moved from `xs | sm | md | lg`
(10–16px) to `sm | md | lg | xl` (6–12px). Map each usage once, from its old
value:

- `xs` → `lg`, `sm` → `xl` (same sizes as before).
- No `size` (old default `sm`, 12px) → `size='xl'` to keep the look.
- Old `md` and `lg` have no equivalent: use `xl` (the largest), or a smaller
  size if design agrees.
- `lg` hits are ambiguous after the update: only change those that predate
  it (old 16px).
- A `size` passed through a variable isn't detected: check it by hand.

`Avatar showNotification` now draws its dot only on `sm` and `md` avatars, at
the same size as before. On `lg` and `xl` it draws nothing and the accessible
name loses its notification suffix (on React Native, `testID` moves back from
the dot wrapper to the avatar): drop the prop (the default). If design wants
the dot kept, wrap the avatar in `<DotIndicator size='xl' appearance='red'>`
only while `showNotification` is true; it's 12px, smaller than the old 14–16px
dot.

On web, an `sm` or `md` Avatar with the dot now renders inside the
`DotIndicator` wrapper `div`; `className`, `ref` and other props stay on the
inner avatar. Check styles or selectors that expect the Avatar as the outer
element.

## Verify

Zero `detect` hits except reviewed `lg` and `showNotification` ones.
Typecheck passes. Dots that used old `xs`, `sm` or the default keep their size;
old `md`/`lg` dots and dropped `lg`/`xl` Avatar dots are reviewed with design.
