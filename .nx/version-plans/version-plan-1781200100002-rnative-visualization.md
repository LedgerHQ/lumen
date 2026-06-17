---
'@ledgerhq/lumen-ui-rnative-visualization': patch
---

test(LineChart): add deterministic render-budget performance guards
perf(LineChart): add Axis memoization to prevent unecessary recomputation
perf(LineChart): split magnetic provider in 2 providers, improving Point overall performances
