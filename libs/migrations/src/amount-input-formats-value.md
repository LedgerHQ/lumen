---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#AmountInput.value'
    signal: silent # the controlled value is now formatted before display
    detect:
      - { pattern: '<AmountInput\b[^>]*\bvalue=\{[^}]*(toLocaleString|NumberFormat)' }
      - { pattern: '<AmountInput\b', expect: review }
pr: 744
---

## Before → after

```tsx before
<AmountInput
  value={amount.toLocaleString('en-US')}
  onChange={onChange}
  currencyText='USD'
/>
```

```tsx after
<AmountInput
  value={amount.toString()}
  onChange={onChange}
  currencyText='USD'
/>
```

## Decide

`AmountInput` now runs `value` through the same formatter as typed input:
thousands separators, `maxIntegerLength` and `maxDecimalLength` (both 9 by
default). A value set from code (a "Max" button, a prefilled amount) displays
formatted and, past those limits, truncated.

- Value pre-formatted by the app: pass the raw number string instead. A comma
  is read as a decimal point, so `1,234.5` would display as `1.2345`.
- Values that can exceed 9 decimals or 9 integer digits (crypto amounts): set
  `maxDecimalLength` / `maxIntegerLength` to the asset's precision. Default:
  keep the limits.

## Verify

Zero hits for the first `detect` pattern. Set each `AmountInput` from code with
a large and a high-precision value: the display matches the amount.
