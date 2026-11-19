---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#BottomSheetHeader.sticky'
    signal: silent # it compiles; the header now stays pinned while the content scrolls
    detect:
      - { pattern: '<BottomSheetScrollView\b', expect: review }
---

## Before → after

```tsx before
<BottomSheetScrollView>
  <BottomSheetHeader title='Title' />
  {items}
</BottomSheetScrollView>
```

```tsx after
<BottomSheetScrollView>
  <BottomSheetHeader title='Title' sticky={false} />
  {items}
</BottomSheetScrollView>
```

## Decide

A `BottomSheetHeader` that is a direct child of a `BottomSheetScrollView` now
stays pinned to the top while the content scrolls, on an opaque sheet
background. A header placed next to the scroll view, or nested in another
element inside it, is unchanged. Indices you pass in `stickyHeaderIndices` are
merged with the header's.

Keep the new default: it is the intended pattern. Add `sticky={false}` only
where the header must scroll away with the content, for example when the
sheet's custom `backgroundComponent` must show through the header.

## Verify

Each sheet with a header inside a `BottomSheetScrollView` keeps its title and
close button visible while scrolling, or has `sticky={false}`. Typecheck passes.
