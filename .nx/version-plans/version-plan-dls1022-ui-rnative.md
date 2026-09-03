---
'@ledgerhq/lumen-ui-rnative': patch
---

Charts are now part of `@ledgerhq/lumen-ui-rnative`, exposed at the
`@ledgerhq/lumen-ui-rnative/visualization` subpath instead of the separate
`@ledgerhq/lumen-ui-rnative-visualization` package, which is retired.

**Migrating — three steps, in this order:**

1. **Upgrade `@ledgerhq/lumen-ui-rnative` first.** The `/visualization` subpath
   does not exist in earlier versions, so rewriting imports before upgrading
   fails at resolution time.
2. **Rewrite the specifier.** Every export keeps its name, so this is a
   specifier rename and nothing else:

   ```
   @ledgerhq/lumen-ui-rnative-visualization  →  @ledgerhq/lumen-ui-rnative/visualization
   ```

   ```bash
   grep -rl '@ledgerhq/lumen-ui-rnative-visualization' src \
     | xargs sed -i '' "s|@ledgerhq/lumen-ui-rnative-visualization|@ledgerhq/lumen-ui-rnative/visualization|g"
   ```
3. **Drop the dependency** from your `package.json`.

`react-native-gesture-handler` and `react-native-worklets` are now optional peer
dependencies — install them if you use charts.
