---
'@ledgerhq/lumen-ui-react': patch
---

Charts are now part of `@ledgerhq/lumen-ui-react`, exposed at the
`@ledgerhq/lumen-ui-react/visualization` subpath instead of the separate
`@ledgerhq/lumen-ui-react-visualization` package, which is retired.

**Migrating — two steps, in this order:**

1. **Swap the packages in a single install.** The retired package pins
   `@ledgerhq/lumen-ui-react` to an exact version as a peer, so upgrading while
   it is still in your `dependencies` leaves an unmet peer and npm fails the
   install with `ERESOLVE`. Remove it and upgrade in one command:

   ```bash
   npm uninstall @ledgerhq/lumen-ui-react-visualization
   npm install @ledgerhq/lumen-ui-react@latest
   ```

   Do this before rewriting imports: the `/visualization` subpath does not
   exist in earlier versions, so a rewrite on the old version fails with
   `ERR_MODULE_NOT_FOUND`.
2. **Rewrite the specifier.** Every export keeps its name — including the chart
   types (`Series`, `DrawingArea`, `ChartScaleFunction`, …) — so this is a
   specifier rename and nothing else:

   ```
   @ledgerhq/lumen-ui-react-visualization  →  @ledgerhq/lumen-ui-react/visualization
   ```

   ```bash
   grep -rl '@ledgerhq/lumen-ui-react-visualization' src \
     | xargs sed -i '' "s|@ledgerhq/lumen-ui-react-visualization|@ledgerhq/lumen-ui-react/visualization|g"
   ```
   Finally, remove
   `@import '@ledgerhq/lumen-ui-react-visualization/tailwind.css';` from your
   stylesheet — `@ledgerhq/lumen-ui-react/tailwind.css` already covers charts.

The undocumented `./*` wildcard export is removed. Every path it exposed
(`@ledgerhq/lumen-ui-react/Button` and friends) already failed to resolve,
because the per-component barrels were never emitted.
