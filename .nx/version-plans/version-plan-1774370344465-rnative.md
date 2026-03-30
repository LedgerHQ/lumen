---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(ui-rnative): add fit layout for SegmentedControl

The default `tabLayout` is now `'fixed'` (segments share the container width equally). If you relied on the previous default behavior—tabs sizing to their content—pass `tabLayout="fit"` explicitly on `SegmentedControl`. No change is required if equal-width segments match your design.
