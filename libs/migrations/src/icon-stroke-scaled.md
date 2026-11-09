---
changes:
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#icon-stroke-*'
    signal: visual # stroke is now divided by size / 16, for a 16px viewBox
    detect:
      - { pattern: '\bicon-stroke-\d+\b', expect: review }
pr: 870
---

## Before → after

```tsx before
<svg viewBox='0 0 24 24' className='icon-w-24 icon-h-24 icon-stroke-24'>
  <path d='M4 12h16' stroke='currentColor' />
</svg>
```

```tsx after
<svg viewBox='0 0 16 16' className='icon-w-24 icon-h-24 icon-stroke-24'>
  <path d='M3 8h10' stroke='currentColor' />
</svg>
```

## Decide

`icon-stroke-<size>` now assumes a 16×16 `viewBox`, like Lumen icons: it
divides the stroke token by `size / 16` so the painted stroke matches Figma.
On an SVG with a 16×16 `viewBox`, or inside a Lumen `Icon`, change nothing
(the default). On a custom SVG with another `viewBox`, the stroke now renders
thinner or thicker: redraw it at 16×16, or drop the utility and set
`strokeWidth` on the paths yourself.

## Verify

Review every `detect` hit. Compare custom SVG icons next to Lumen icons of
the same size: their stroke weights match.
