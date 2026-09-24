---
'@ledgerhq/lumen-design-core': patch
---

refactor(design-core): move the Figma sync toolchain to internals/sync-figma

The package now ships only production code. `tools/`, `automations/` and
`tokens/` moved to the new dev-only `internals/sync-figma` project; the
published `symbols/` export is unchanged.
