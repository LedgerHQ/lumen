---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MediaImage'
    signal: visual # 1px inset outline in the icon color
    detect:
      - { pattern: '<MediaImage\b', expect: review }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIcon.size=20'
    signal: visual # icon 12px → 16px; 20 is the default size
    detect:
      - { pattern: '<DotIcon\b', expect: review }
pr: 675
---

## Before → after

```tsx before
<DotIcon icon={Check} appearance='success'>
  <MediaImage src={logoUrl} alt='Bitcoin' size={40} />
</DotIcon>
```

```tsx after
<DotIcon icon={Check} appearance='success'>
  <MediaImage src={logoUrl} alt='Bitcoin' size={40} />
</DotIcon>
```

## Decide

No code change by default. `MediaImage` now draws a 1px inset outline, and
a `DotIcon` at size 20 (the default) shows a 16px icon instead of 12px.
Don't hide the outline with `className`. Act only where design flags a
render.

## Verify

Look at screens with media images and dot icons, in light and dark: they
render as the design expects.
