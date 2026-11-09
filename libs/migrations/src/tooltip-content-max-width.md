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
<TooltipContent className='w-320'>
  <AddressTable />
</TooltipContent>
```

```tsx after
<TooltipContent className='w-320 max-w-320'>
  <AddressTable />
</TooltipContent>
```

## Decide

`TooltipContent` now caps its width at 224px (`max-w-224`) and wraps longer
text. Plain text, short or long, takes the new default: leave it as is.

Content that must stay wider (a table, a long code or address) needs a wider
`max-w-*` class, or `max-w-none`. A `className` that already sets `max-w-*`
keeps winning, but a fixed `w-*` alone is now clamped to 224px: add a matching
`max-w-*`. Unbroken strings (addresses, hashes) don't wrap and overflow the
bubble: widen it or add `break-all`.

## Verify

Review every `detect` hit. Hover tooltips with long, translated or unbroken
content: each wraps inside the bubble or has a wider `max-w-*`.
