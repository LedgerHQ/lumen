---
changes:
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=xs'
    signal: loud
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=[''"]xs[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=sm'
    signal: visual # 12px → 6px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=[''"]sm[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=md'
    signal: visual # 14px → 8px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=[''"]md[''"]' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=lg'
    signal: visual # 16px → 10px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=[''"]lg[''"]', expect: review }
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
<DotIndicator size='xl' appearance='red'>
  <Avatar src={src} alt='' size='lg' />
</DotIndicator>
```

## Decide

The scale moved from `xs | sm | md | lg` (10–16px) to `sm | md | lg | xl`
(6–12px). Map each usage once, from its old value:

- `xs` → `lg`, `sm` → `xl` (same sizes as before).
- No `size` (old default `sm`, 12px) → `size='xl'` to keep the look.
- Old `md` and `lg` have no equivalent: use `xl` (the largest), or a smaller
  size if design agrees.
- `lg` hits are ambiguous after the update: only change those that predate
  it (old 16px).

`Avatar showNotification` now draws its dot only on `sm` and `md` avatars. For
`lg` and `xl`, wrap the avatar in a `DotIndicator` if the dot must stay, or
accept it gone (the default).

## Verify

Zero `detect` hits except reviewed `lg` and `showNotification` ones.
Typecheck passes. Look at screens with notification dots and badges: their
size matches the previous release.
