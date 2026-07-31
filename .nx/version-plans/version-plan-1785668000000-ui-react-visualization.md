---
'@ledgerhq/lumen-ui-react-visualization': patch
---

feat(DonutChart): export `useDonutSeries` and its pure `prepareDonutSeries` counterpart, keep a single-segment tail as-is instead of folding it into `other`, and sort the series even when grouping is disabled
