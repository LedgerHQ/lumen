---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#ProgressBar.appearance'
    signal: visual # decorative-* fills use the bg-decorative-strong-* tokens
    detect:
      - { pattern: '<ProgressBar\b(?:[^>]|=>)*\bappearance=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#ProgressBar.appearance'
    signal: visual
    detect:
      - { pattern: '<ProgressBar\b(?:[^>]|=>)*\bappearance=', expect: review }
pr: 958
---

## Before → after

```tsx before
<ProgressBar value={40} appearance='decorative-blue' aria-label='Upload progress' />
```

```tsx after
<ProgressBar value={40} appearance='decorative-blue' aria-label='Upload progress' />
```

## Decide

Every `decorative-*` appearance now fills with its stronger
`bg-decorative-strong-*` color: darker in light themes, brighter in dark
themes. No code change by default. Act only where a design relied on the old
fill (e.g. text or icons drawn over or beside the bar). The pattern flags every
explicit `appearance`; only `decorative-*` values, including ones set through a
variable or condition, are affected.

## Verify

Look at screens with decorative ProgressBars in light and dark themes: the
fill matches Figma and stays legible.
