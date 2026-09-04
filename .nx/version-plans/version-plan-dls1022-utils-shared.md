---
'@ledgerhq/lumen-utils-shared': patch
---

The package now actually ships its `dist/` directory. It declared no `files`
field, so npm fell back to `.gitignore` — which ignores `dist` — and published
only `src/index.ts` while its `exports` pointed at `./dist/index.js`.
