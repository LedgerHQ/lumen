---
'@ledgerhq/lumen-ui-react': patch
---

Charts are now part of `@ledgerhq/lumen-ui-react`, exposed at the
`@ledgerhq/lumen-ui-react/visualization` subpath instead of the separate
`@ledgerhq/lumen-ui-react-visualization` package. Import the components from the
subpath and drop the second `@import` of the visualization stylesheet — the
existing `@ledgerhq/lumen-ui-react/tailwind.css` now covers charts.

The undocumented `./*` wildcard export is removed. Every path it exposed
(`@ledgerhq/lumen-ui-react/Button` and friends) already failed to resolve,
because the per-component barrels were never emitted.
