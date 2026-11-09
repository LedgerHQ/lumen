---
changes:
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-background-accent-websites'
    signal: visual # websites accent, active and interactive colors move from orange to purple
    detect:
      - { pattern: '\bwebsites(Preset|Themes)\b|-websites\b', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-text-on-accent-websites'
    signal: visual # now black instead of white, in light and dark
    detect:
      - { pattern: '\bwebsites(Preset|Themes)\b|on-accent-websites\b', expect: review }
pr: 750
---

## Before → after

```ts before
export default {
  presets: [websitesPreset],
};
```

```ts after
export default {
  presets: [websitesPreset],
};
```

## Decide

The websites brand is now purple instead of orange: every `*-websites` accent,
active, interactive and border token, and the websites theme's `accent` and
`active` colors (CSS and JS). `text-on-accent` turns from white to black, in
both light and dark mode. Keep the new colors (the default). Act only where
the app hardcodes orange to match the old accent, or puts its own text or
icons on an accent surface: switch them to the theme tokens.

## Verify

Look at screens using the websites theme, light and dark: buttons, active
states, links and text on accent. No orange leftovers, and text on accent is
readable.
