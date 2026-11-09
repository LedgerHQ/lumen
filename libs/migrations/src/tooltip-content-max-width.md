---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#TooltipContent'
    signal: visual # content wider than 224px now wraps
    detect:
      - { pattern: '<TooltipContent\b', expect: review }
pr: 861
---

## Before → after

```tsx before
<TooltipContent>
  Fees are paid to the network, not to Ledger, and vary with demand.
</TooltipContent>
```

```tsx after
<TooltipContent className='max-w-320'>
  Fees are paid to the network, not to Ledger, and vary with demand.
</TooltipContent>
```

## Decide

`TooltipContent` now caps its width at 224px (`max-w-224`) and wraps longer
text. Short tooltips are unaffected: leave them as is (the default). Where a
tooltip must stay wider (a table, a long code or address), pass a `max-w-*`
class. A `className` that already sets `max-w-*` keeps winning.

## Verify

Review every `detect` hit. Hover the tooltips with long or translated text:
each wraps cleanly or has been given a wider `max-w-*`.
