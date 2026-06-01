---
'@ledgerhq/lumen-ui-react-visualization': patch
---

feat(charts): add `nice` opt-out on `AxisConfigProps` for d3's `.nice()`

`AxisConfigProps` now accepts a `nice` boolean (default `true` on both axes).
Set `nice: false` to keep the domain exactly as provided and have data fill
the plot area boundary-to-boundary — typically combined with a full
`domain: { min, max }` override. Default behavior is unchanged; this is a
pure additive opt-out.

fix(charts): respect `xAxis.data` as the source of truth for tick values

When `xAxis.data` is provided without explicit `ticks`, `buildTicksData` now
derives ticks from the data itself (numeric values for numeric data, indices
for string data) instead of falling back to `scale.ticks()`. This removes
d3-invented intermediate ticks (e.g. `1, 3` for `[0, 2, 4]`, or `0.5, 1.5`
between `'Jan', 'Feb', 'Mar'`).

Also exports `getTickValues`, `getTickPosition`, and `getTickLabel` so the
existing test suite — which was importing them — actually exercises them.

fix(LineChart): clip the line/area to the X axis when series has more points than axis labels

When `xAxis.data` is provided (e.g. month labels), the X domain is sized to
`data.length - 1`. Series points beyond that length used to be projected past
the right edge of the drawing area, so a 14-point series on an 8-month axis
would leak past the last label.

`toScaledPoints` now caps iteration at `xData.length` when axis data is
provided, treating the axis as authoritative for the X domain. Series with
the same length as the axis are unchanged.
