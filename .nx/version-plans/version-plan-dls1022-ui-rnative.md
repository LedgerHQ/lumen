---
'@ledgerhq/lumen-ui-rnative': patch
---

Charts are now part of `@ledgerhq/lumen-ui-rnative`, exposed at the
`@ledgerhq/lumen-ui-rnative/visualization` subpath instead of the separate
`@ledgerhq/lumen-ui-rnative-visualization` package, which is retired.

**Migrating — two steps, in this order:**

1. **Swap the packages in a single install.** The retired package pins
   `@ledgerhq/lumen-ui-rnative` to an exact version as a peer, so upgrading
   while it is still in your `dependencies` leaves an unmet peer and npm fails
   the install with `ERESOLVE`. Remove it and upgrade in one command:

   ```bash
   npm uninstall @ledgerhq/lumen-ui-rnative-visualization
   npm install @ledgerhq/lumen-ui-rnative@latest
   ```

   Do this before rewriting imports: the `/visualization` subpath does not
   exist in earlier versions, so a rewrite on the old version fails at
   resolution time.
2. **Rewrite the specifier.** Every export keeps its name, so this is a
   specifier rename and nothing else:

   ```
   @ledgerhq/lumen-ui-rnative-visualization  →  @ledgerhq/lumen-ui-rnative/visualization
   ```

   ```bash
   grep -rl '@ledgerhq/lumen-ui-rnative-visualization' src \
     | xargs sed -i '' "s|@ledgerhq/lumen-ui-rnative-visualization|@ledgerhq/lumen-ui-rnative/visualization|g"
   ```
`react-native-gesture-handler` and `react-native-worklets` are now optional peer
dependencies — install them if you use charts.

The package now also ships its `ai-rules/` directory, matching
`@ledgerhq/lumen-ui-react`.
