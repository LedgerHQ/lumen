---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MediaImage'
    signal: visual # 1px inset outline, border-icon token (subtle grey)
    detect:
      - { pattern: '<MediaImage\b', expect: review }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIcon.size=20'
    signal: visual # icon 12px → 16px; 20 is the default size
    detect:
      - { pattern: '<DotIcon\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#dotIconSizeMap.20'
    signal: visual # 12 → 16
    detect:
      - { pattern: '\bdotIconSizeMap\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#MediaImage'
    signal: visual # 1px inset outline, border.icon token (subtle grey)
    detect:
      - { pattern: '<MediaImage\b', expect: review }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#DotIcon.size=20'
    signal: visual # icon 12px → 16px; 20 is the default size
    detect:
      - { pattern: '<DotIcon\b', expect: review }
pr: 675
---

## Before → after

Same JSX on web and React Native; `dotIconSizeMap` is exported on web only.

```tsx before
<DotIcon icon={Check} appearance='success'>
  <MediaImage src={logoUrl} alt='Bitcoin' size={40} />
</DotIcon>;

const iconSize = dotIconSizeMap[20]; // 12
```

```tsx after
<DotIcon icon={Check} appearance='success'>
  <MediaImage src={logoUrl} alt='Bitcoin' size={40} />
</DotIcon>;

const iconSize = dotIconSizeMap[20]; // 16
```

## Decide

No code change by default. `MediaImage` now draws a 1px inset outline using
the subtle `border-icon` token, and a `DotIcon` at size 20 (the default)
shows a 16px icon instead of 12px. On web, `dotIconSizeMap[20]` is now 16, so
code reading it to size its own icons grows too. Don't hide the outline with
`className` (web) or `lx`/`style` (React Native). Act only where design flags
a render.

## Verify

Look at screens with media images and dot icons, in light and dark: they
render as the design expects.
