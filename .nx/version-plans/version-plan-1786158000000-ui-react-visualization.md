---
'@ledgerhq/lumen-ui-react-visualization': patch
---

refactor(DonutChart)!: rename the `useDonutSeries`/`prepareDonutSeries` option `minShare` to `groupBelowShare`, so the name states what happens to the segments below it while keeping the unit (a fraction of the total, `0.04` for 4%) explicit
