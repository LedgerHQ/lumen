---
'@ledgerhq/lumen-ui-rnative': patch
---

feat(ui-rnative): add fit layout for SegmentedControl

Equal-width segments were already the default before `tabLayout` existed, and they still are (`tabLayout` defaults to `'fixed'`). **No migration** is needed to keep the same look and behavior. Use `tabLayout="fit"` only when you want each tab to size to its content instead.
