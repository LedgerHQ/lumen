---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#spotDotIconSizeMap'
    signal: visual # the dot for a size-72 Spot grows from 24px to 32px
    detect:
      - { pattern: '\bspotDotIconSizeMap\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#spotDotSizeMap'
    signal: visual # the dot for a size-72 Spot grows from 24px to 32px
    detect:
      - { pattern: '\bspotDotSizeMap\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#spotDotIconSizeMap'
    signal: visual # the dot for a size-72 Spot grows from 24px to 32px
    detect:
      - { pattern: '\bspotDotIconSizeMap\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#spotDotSizeMap'
    signal: visual # the dot for a size-72 Spot grows from 24px to 32px
    detect:
      - { pattern: '\bspotDotSizeMap\b', expect: review }
pr: 729
---

## Before → after

Same code on web and React Native.

```tsx before
<DotIcon icon={Check} appearance='success' size={spotDotIconSizeMap[72]} pin='bottom-end'>
  <Spot appearance='icon' icon={Wallet} size={72} />
</DotIcon>
```

```tsx before
<DotSymbol src={networkLogo} size={spotDotSizeMap[72]} pin='bottom-end'>
  <Spot appearance='icon' icon={Wallet} size={72} />
</DotSymbol>
```

Default, no code change (the dot is now 32px):

```tsx after
<DotIcon icon={Check} appearance='success' size={spotDotIconSizeMap[72]} pin='bottom-end'>
  <Spot appearance='icon' icon={Wallet} size={72} />
</DotIcon>
```

Only where design still needs the 24px dot:

```tsx after
<DotSymbol src={networkLogo} size={24} pin='bottom-end'>
  <Spot appearance='icon' icon={Wallet} size={72} />
</DotSymbol>
```

## Decide

`spotDotIconSizeMap[72]` and `spotDotSizeMap[72]` now return `32` instead of
`24`, so the `DotIcon` or `DotSymbol` pinned on a size-72 `Spot` is larger.
Other sizes are unchanged. Keep the new size (the default). Only where a
design still needs the smaller dot, pass `size={24}` directly.

## Verify

Look at screens with a size-72 `Spot` carrying a dot. The dot is 32px and sits
correctly on the corner. A `DotIcon` glyph grows from 16px to 20px, and square
dots use a 10px radius instead of 8px.
