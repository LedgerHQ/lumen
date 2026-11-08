---
'@ledgerhq/lumen-design-core': patch
---

refactor(tokens): the Tailwind preset reads its typography classes, shadows and animation durations from generated token maps, and `duration-<token>` classes map to the motion tokens; the generated CSS is unchanged
