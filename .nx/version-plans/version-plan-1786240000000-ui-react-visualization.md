---
'@ledgerhq/lumen-ui-react-visualization': patch
---

fix(Axis): honour an explicit empty `ticks` array as "no ticks" instead of falling back to auto-computed ticks, matching the React Native library
