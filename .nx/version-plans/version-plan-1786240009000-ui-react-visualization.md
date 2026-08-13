---
'@ledgerhq/lumen-ui-react-visualization': patch
---

fix(DonutChart): draw near-zero segments at a minimum arc instead of letting them vanish, and label a share too small to round as `<0.1%`
