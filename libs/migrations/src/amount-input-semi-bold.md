---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#AmountInput'
    signal: visual # semi-bold text (was medium weight); the root now fills its parent's width
    detect:
      - { pattern: '<AmountInput\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#AmountInput'
    signal: visual # the root now fills its parent's width
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

Leave usages as is (the default), except where noted:

- Web only: text, currency included, now uses `heading-0-semi-bold` instead of
  `heading-0`. Without `currencyText`, the input reserves more width
  automatically. Where a `className` forced a font weight (e.g.
  `font-semibold`) to emulate the bold look, remove it.
- Web and React Native: the root now fills its parent's width. In a row, or a
  parent that centers or shrinks to its content, it stretches instead of
  sizing to its content. Where the old layout matters, wrap it in a container
  with an explicit width on web (`className` styles the inner `input`, not
  the root); on React Native, `lx` reaches the root, so set its `width` there.
- Web tests: it now uses `ResizeObserver`. If your jsdom setup lacks it, stub
  it in the test setup file.

## Verify

Look at screens with an `AmountInput`, with and without a currency. On web
the amount is semi-bold; on both platforms it is centered, not clipped, and
rows or centered layouts holding it are not stretched.
