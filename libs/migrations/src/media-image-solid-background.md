---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MediaImage'
    signal: visual # background is now solid bg-muted, not translucent
    detect:
      - { pattern: '<MediaImage\b', expect: review }
pr: 606
---

## Before → after

```tsx before
<MediaImage src={logoUrl} alt='Bitcoin' size={40} />
```

```tsx after
<MediaImage src={logoUrl} alt='Bitcoin' size={40} />
```

## Decide

`MediaImage` now fills its shape with the opaque `bg-muted` instead of the
translucent `bg-muted-transparent`. It shows behind images with transparent
areas and behind the fallback. Leave usages as is (the default). Act only
where the image sits on a colored or image background and must blend with it:
override the background with `className`.

## Verify

Look at screens showing `MediaImage` with transparent images or the fallback,
on non-default backgrounds. Each looks right.
