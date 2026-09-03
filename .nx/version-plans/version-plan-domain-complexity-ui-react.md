---
'@ledgerhq/lumen-ui-react': patch
---

refactor(visualization): flatten chart domain computation

`computeXDomain` and `computeYDomain` now delegate their min/max scans to
small top-level helpers instead of nesting loops inside conditionals. Behaviour
is unchanged.
