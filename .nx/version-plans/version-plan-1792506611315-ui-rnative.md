---
'@ledgerhq/lumen-ui-rnative': patch
---

fix(exports): list the `types` condition first so TypeScript resolves the published `.d.ts` instead of `src` when a consumer enables the `react-native` condition
