---
'@ledgerhq/lumen-ui-react': patch
---

fix(a11y): translate or drop the remaining hardcoded labels

- Translated: the chart empty, loading and default names, the Select search placeholder and the Subheader info icon label. Link's "(opens in a new tab)" and Stepper's default label now use their translations; Stepper announces "Step 2 of 4" instead of "2/4".
- Dropped: Legend's default "Legend" label, the SegmentedControl scroll-arrow labels (the arrows are now hidden from assistive technologies), the "Donut chart" / "Loading donut chart" defaults in favour of the shared chart strings, and the ", selected" suffix on donut segments, now exposed as `aria-pressed`. Tests that query these labels need updating.
