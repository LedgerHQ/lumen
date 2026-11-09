---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaBanner.className'
    signal: silent # className now styles an outer wrapper, ref stays on the banner
    detect:
      - { pattern: '<MediaBanner\b[^>]*\bclassName=', expect: review }
pr: 806
---

## Before → after

```tsx before
<MediaBanner className='mb-16 bg-muted' imageUrl={promo.image} onClick={openPromo}>
  <MediaBannerTitle>{promo.title}</MediaBannerTitle>
</MediaBanner>
```

```tsx after
<MediaBanner className='mb-16' imageUrl={promo.image} onClick={openPromo}>
  <MediaBannerTitle>{promo.title}</MediaBannerTitle>
</MediaBanner>
```

## Decide

`MediaBanner` now renders an outer wrapper around the banner, so the close
button sits outside the clickable area. `className` now styles that wrapper.
Layout classes (margin, width, position) work as before: keep them (the
default). Classes meant for the banner itself (background, radius, height,
padding) no longer reach it: remove them, or move them to a parent. `ref`
still points at the inner banner, not the element `className` styles.

## Verify

Every `detect` hit reviewed. Look at screens with media banners: same spacing
and look, and the close button still closes the banner.
