---
changes:
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#icon-stroke-*'
    signal: visual # stroke is now divided by size / 16, for a 16-unit viewBox
    detect:
      - { pattern: '\bicon-stroke-\d+\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react/symbols#*.style'
    signal: visual # icon paths no longer hardcode stroke-width, so overrides apply
    detect:
      - { pattern: '\bstrokeWidth\b|stroke-width|(?<![\w-])stroke-\d', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative/symbols#*.strokeWidth'
    signal: visual # icon paths no longer hardcode strokeWidth, so the prop applies
    detect:
      - { pattern: '\bstrokeWidth\b', expect: review }
pr: 870
---

## Before → after

```tsx before
<svg viewBox='0 0 24 24' className='icon-w-24 icon-h-24 icon-stroke-24'>
  <path d='M4 12h16' stroke='currentColor' />
</svg>
```

```tsx after
<svg viewBox='0 0 24 24' className='icon-w-24 icon-h-24 [stroke-width:var(--icon-border-width-24)]'>
  <path d='M4 12h16' stroke='currentColor' />
</svg>
```

Web, a Lumen icon:

```tsx before
<Bell size={24} style={{ strokeWidth: 2 }} />
```

```tsx after
<Bell size={24} />
```

React Native, a Lumen icon:

```tsx before
<Bell size={24} strokeWidth={2} />
```

```tsx after
<Bell size={24} />
```

## Decide

`icon-stroke-<size>` used to set the token as is. It now sets
`token / (size / 16)`, whatever the `viewBox`: every hit renders thinner than
before above size 16 and thicker at 12. The painted stroke equals the token
only on a 16-unit-wide `viewBox`.

- Custom SVG with a 16-unit `viewBox`: change nothing (the default). It now
  matches Figma.
- Custom SVG with another `viewBox`: replace `icon-stroke-<size>` with
  `[stroke-width:var(--icon-border-width-<size>)]`, which renders as before.
- Paths that set their own `stroke-width`: change nothing, they ignore the
  utility.

Lumen icon paths used to hardcode a 1.3 stroke, which silently beat any
stroke width set on the icon. That attribute is gone, so a `strokeWidth`
prop (React Native), or an inline `style` or class stroke width that beats
`icon-stroke-*` (web), on a Lumen icon now applies. Drop it (the default) to
keep the Lumen weight; keep it only if you want that weight.

## Verify

Review every `detect` hit. Lumen icons now render a different stroke weight at
every size but 16 on both platforms (thinner above 16), so update visual
baselines even where no code changed.
