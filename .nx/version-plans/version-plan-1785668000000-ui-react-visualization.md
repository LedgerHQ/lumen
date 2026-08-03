---
'@ledgerhq/lumen-ui-react-visualization': patch
---

feat(DonutChart): export `useDonutSeries` and its pure `prepareDonutSeries` counterpart, keep a single-segment tail as-is instead of folding it into `other`, sort the series even when grouping is disabled, and let the `other` slice inherit the chart's neutral segment color instead of baking one in
