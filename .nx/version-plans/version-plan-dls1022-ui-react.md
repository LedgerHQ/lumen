---
'@ledgerhq/lumen-ui-react': patch
---

Charts are now part of `@ledgerhq/lumen-ui-react`, exposed at the
`@ledgerhq/lumen-ui-react/visualization` subpath instead of the separate
`@ledgerhq/lumen-ui-react-visualization` package, which is retired.

**Migrating — three steps, in this order:**

1. **Upgrade `@ledgerhq/lumen-ui-react` first.** The `/visualization` subpath
   does not exist in earlier versions, so rewriting imports before upgrading
   fails with `ERR_MODULE_NOT_FOUND`.
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
3. **Drop the leftovers.** Remove
   `@import '@ledgerhq/lumen-ui-react-visualization/tailwind.css';` from your
   stylesheet — `@ledgerhq/lumen-ui-react/tailwind.css` already covers charts —
   and remove the package from your `dependencies`.

The undocumented `./*` wildcard export is removed. Every path it exposed
(`@ledgerhq/lumen-ui-react/Button` and friends) already failed to resolve,
because the per-component barrels were never emitted.
