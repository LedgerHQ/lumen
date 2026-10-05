---
'@ledgerhq/lumen-ui-rnative': patch
---

fix(a11y): translate or drop the remaining hardcoded labels

- Translated: the chart empty, loading and default names, the Subheader info icon label and the selected donut segment label.
- Dropped: Legend's default "Legend" label, AmountInput's "Amount input" fallback (the displayed amount now names the control) and the "Donut chart" / "Loading donut chart" defaults in favour of the shared chart strings. Tests that query these labels need updating.
