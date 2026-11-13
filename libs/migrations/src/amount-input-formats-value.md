---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#AmountInput.value'
    signal: silent # the controlled value is now formatted before display
    detect:
      - { pattern: '<AmountInput\b(?:[^>]|=>)*?\bvalue=\{[^}]*(toLocaleString|NumberFormat|\.format\()' }
      - { pattern: '<AmountInput\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#AmountInput.value'
    signal: silent # the controlled value is now formatted before display
    detect:
      - { pattern: '<AmountInput\b(?:[^>]|=>)*?\bvalue=\{[^}]*(toLocaleString|NumberFormat|\.format\()' }
      - { pattern: '<AmountInput\b', expect: review }
pr: 744
---

## Before → after

```tsx before
<AmountInput value={amount.toLocaleString('en-US')} onChange={onChange} currencyText='USD' />
```

```tsx after
<AmountInput value={amountText} onChange={onChange} currencyText='USD' />
```

React Native:

```tsx before
<AmountInput value={amount.toLocaleString('en-US')} onChangeText={onChangeText} currencyText='USD' />
```

```tsx after
<AmountInput value={amountText} onChangeText={onChangeText} currencyText='USD' />
```

`amountText` is the plain decimal string the app holds, e.g. `'1234.5'`.

## Decide

`AmountInput` now runs `value` through the same formatter as typed input:
space-grouped thousands, `maxIntegerLength` and `maxDecimalLength` (both 9 by
default). A value set from code (a "Max" button, a prefilled amount) displays
formatted and, past those limits, truncated.

- `value` must be a plain, ungrouped, non-negative decimal string. Every
  character other than digits and dots is dropped, and only the first comma is
  read as a decimal point:
  - Pre-formatted (`toLocaleString`, `Intl.NumberFormat`): `1,234.5`
    displays as `1.2345`. Pass the raw string instead.
  - A JS number, or `String(n)` / `n.toString()`, below `1e-6` is in exponent
    form: `1e-8` displays as `18`. Keep the amount as a string (from state, or
    `BigNumber#toFixed()`), never convert a number.
  - A minus sign is dropped: `-5` displays as `5`.
- `allowDecimals={false}`: pass an integer. A fractional value loses its dot
  (`12.34` displays as `1234`).
- Values that can exceed 9 decimals or 9 integer digits (crypto amounts): set
  `maxDecimalLength` / `maxIntegerLength` to the asset's precision. Default:
  keep the limits.

## Verify

Zero hits for the first `detect` pattern, and each `review` hit passes a plain
decimal string. Set each `AmountInput` from code with a large, a
high-precision and a sub-`1e-6` value: the display matches the amount.
