---
'@ledgerhq/lumen-ui-react': patch
---

fix(visualization): ignore non-finite values when computing the chart domain

A single `NaN` in `series[].data` (or in numeric `xAxis.data`) used to
collapse the whole computed domain, which made d3 map every point to a `NaN`
coordinate — the chart rendered blank with no error. Non-finite values, `NaN`
and `±Infinity` alike, are now skipped; a series with no finite value at all
still falls back to `{ min: 0, max: 1 }`.

`computeXDomain` and `computeYDomain` also delegate their min/max scans to
small top-level helpers, which keeps the scan allocation-free for large series.
