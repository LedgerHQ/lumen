---
'@ledgerhq/lumen-utils-shared': patch
---

BREAKING_CHANGE(Stepper): update UI with segmented progress and success appearance

`getStepperCalculations` no longer returns `arcPercentage`, `trackArcLength`, `trackDashArray` and `showMinimalDot`. It now returns `progressDashArray`, `progressMaskDashArray`, `progressDashOffset` and `dashPatternOffset`, which drive a segmented track revealed by a mask circle. Consumers of the util should migrate to the new fields.
