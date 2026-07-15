---
'@ledgerhq/lumen-ui-rnative-visualization': patch
---

refactor(charts): restructure charts internals

- Deduplicate shared types across chart components.
- Decouple geometry computation from rendering by extracting the
  `useReferenceLineGeometry` and `useScrubberGeometry` hooks.
- Introduce a `mergeDefaults` helper and tighten type safety.
