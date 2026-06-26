---
'@ledgerhq/lumen-ui-rnative': patch
---

feat(AmountInput): add decimalSeparator prop for localized decimal display

`AmountInput` now accepts an optional `decimalSeparator` prop (`'.'` default or `','`) to display decimals with a comma (e.g. fr-FR). Typing still accepts both `,` and `.`, so it stays compatible with any locale keyboard.
