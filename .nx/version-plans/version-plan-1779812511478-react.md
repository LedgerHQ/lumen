---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(ui-react): rename "icon" prop to "leadingContent" in NavBar/MediaButton

`MediaButton` and `NavBarCoinCapsule` no longer accept an `icon` prop. The slot has been renamed to `leadingContent` to reflect that consumers can pass any node there, not just an icon. On `MediaButton`, the companion prop `iconType` has been renamed to `leadingContentShape` (same `'flat' | 'rounded'` values, same default of `'flat'`).

To migrate, rename the props at each call site:

```diff
- <MediaButton icon={<MyIcon />} iconType="rounded" />
+ <MediaButton leadingContent={<MyIcon />} leadingContentShape="rounded" />

- <NavBarCoinCapsule ticker="BTC" icon={<BitcoinIcon />} />
+ <NavBarCoinCapsule ticker="BTC" leadingContent={<BitcoinIcon />} />
```

Behavior, sizing expectations, and padding semantics are unchanged — this is a pure rename.
