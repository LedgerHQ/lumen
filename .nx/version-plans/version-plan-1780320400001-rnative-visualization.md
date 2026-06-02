---
'@ledgerhq/lumen-ui-rnative-visualization': patch
---

fix(charts): respect `xAxis.data` as the source of truth for tick values

When `xAxis.data` is provided without explicit `ticks`, `buildTicksData` now
derives ticks from the data itself (numeric values for numeric data, indices
for string data) instead of falling back to `scale.ticks()`. This removes
d3-invented intermediate ticks (e.g. `1, 3` for `[0, 2, 4]`, or `0.5, 1.5`
between `'Jan', 'Feb', 'Mar'`).

The existing `ticks: []` short-circuit (passing an empty array to render no
labels) is preserved.

refactor(charts): align axis API with react-visualization

Consolidate axis configuration onto a single `BaseAxisProps` type (merging the
former `AxisConfigProps` fields: `scaleType`, `data`, `domain`), add a `nice`
opt-out on numeric scales (default `true`; set `false` to keep the domain
exactly as provided), and cap `toScaledPoints` iteration at `xData.length` so a
series with more points than the axis has labels no longer overflows the right
edge of the chart.
