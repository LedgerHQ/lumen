---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaBanner.className'
    signal: visual # className now styles an outer wrapper, ref stays on the banner
    detect:
      - { pattern: '<MediaBanner\b(?:[^>]|=>)*?\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#MediaBanner.lx'
    signal: visual # lx now styles an outer Box, style stays on the banner
    detect:
      - { pattern: '<MediaBanner\b(?:[^>]|=>)*?\blx=', expect: review }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#MediaBanner.disabled'
    signal: loud
pr: 806
---

## Before → after

React:

```tsx before
<MediaBanner onClose={() => setOpen(false)} className='mb-16 bg-muted' imageUrl={promo.image} onClick={openPromo}>
  <MediaBannerTitle>{promo.title}</MediaBannerTitle>
</MediaBanner>
```

```tsx after
// bg-muted dropped: className no longer reaches the banner surface
<MediaBanner onClose={() => setOpen(false)} className='mb-16' imageUrl={promo.image} onClick={openPromo}>
  <MediaBannerTitle>{promo.title}</MediaBannerTitle>
</MediaBanner>
```

React Native:

```tsx before
<MediaBanner lx={{ marginBottom: 's16', backgroundColor: 'muted' }} imageUrl={promo.image} disabled={!promo.active} onPress={openPromo}>
  <MediaBannerTitle>{promo.title}</MediaBannerTitle>
</MediaBanner>
```

```tsx after
// backgroundColor dropped: lx no longer reaches the banner surface
<MediaBanner lx={{ marginBottom: 's16' }} imageUrl={promo.image} onPress={promo.active ? openPromo : undefined}>
  <MediaBannerTitle>{promo.title}</MediaBannerTitle>
</MediaBanner>
```

## Decide

`MediaBanner` now renders an outer wrapper around the banner, so the close
button sits outside the pressable area. `className` (web) and `lx` (React
Native) now style that wrapper. Layout styles (margin, width, position, flex)
work as before: keep them (the default). Styles meant for the banner surface
(background, radius, height, padding) no longer reach it, and a parent can't
restyle it either: drop them. If an override is really needed, use `style`,
which still lands on the banner. `ref` (web) still points at the banner, not
the wrapper.

React Native: `disabled` is gone. Leave out `onPress` when the banner must not
be pressable.

## Verify

Every `detect` hit reviewed. Look at screens with media banners: same spacing
and look, and the close button still closes the banner. On web:

- The wrapper and banner are now `w-full`: a banner in a flex row or grid may
  stretch. Constrain it with a width class on `className`.
- The close button no longer stops propagation: inside a clickable ancestor
  (link, card `onClick`), closing must not trigger the ancestor. `onClose`
  is typed without an event, so make the ancestor ignore it or move the
  banner out.
- With `onClick`, the banner is now a button: focusable, Enter/Space activate
  it, and it shows hover and pressed overlays.

On React Native, with `onPress` the banner now gets `accessibilityRole='button'`
and a pressed overlay.
