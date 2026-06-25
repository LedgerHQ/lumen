---
'@ledgerhq/lumen-utils-shared': patch
---

feat(textFormatter): add decimalSeparator option for localized decimal display

`textFormatter` now accepts a `decimalSeparator` option (`'.'` default or `','`) to localize the displayed decimal separator. Input parsing accepts both `,` and `.` regardless of the option.
