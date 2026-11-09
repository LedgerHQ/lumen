---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#ProgressBar.appearance'
    signal: visual # decorative-* fills use the darker strong tokens
    detect:
      - { pattern: '<ProgressBar\b[^>]*\bappearance=[''"{]*decorative-', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#ProgressBar.appearance'
    signal: visual
    detect:
      - { pattern: '<ProgressBar\b[^>]*\bappearance=[''"{]*decorative-', expect: review }
pr: 958
---

## Before → after

```tsx before
<ProgressBar value={40} appearance='decorative-blue' />
```

```tsx after
<ProgressBar value={40} appearance='decorative-blue' />
```

## Decide

Every `decorative-*` appearance now fills with its `bg-decorative-strong-*`
color, much darker than before. No code change by default. Act only where a
design relied on the light fill (e.g. text or icons drawn over the bar).

## Verify

Look at screens with decorative ProgressBars: the fill matches Figma and
stays legible.
