---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#AmountInput'
    signal: visual # amount and currency render semi-bold (was medium weight)
    detect:
      - { pattern: '<AmountInput\b', expect: review }
pr: 726
---

## Before → after

```tsx before
<AmountInput value={amount} onChange={onChange} currencyText='USD' />
```

```tsx after
<AmountInput value={amount} onChange={onChange} currencyText='USD' />
```

## Decide

`AmountInput` text, currency included, now uses `heading-0-semi-bold` instead
of `heading-0`. Without `currencyText`, the input also reserves a little more
width. Leave usages as is (the default). Act only where a custom `className`
set the font weight or width to match the old look: remove it.

## Verify

Look at screens with an `AmountInput`, with and without a currency. The amount
is semi-bold, centered, and not clipped.
