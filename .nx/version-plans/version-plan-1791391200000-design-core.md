---
'@ledgerhq/lumen-design-core': patch
---

fix(design-core): emit Node-compatible ES modules

Relative imports in the built output now carry their `.js` extension, so `dist` loads with plain Node (for example from a `tailwind.config.ts` read by a linter), not only through bundlers.
