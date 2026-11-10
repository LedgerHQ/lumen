---
changes:
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-background-accent-websites'
    signal: visual # websites accent, active and interactive colors move from orange to purple
    detect:
      - { pattern: '\bwebsites(Preset|Themes|CSSTheme)\b|-websites\b|-subtle-website\b', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-text-on-accent-websites'
    signal: visual # now black instead of white, in light and dark
    detect:
      - { pattern: '\bwebsites(Preset|Themes|CSSTheme)\b|on-accent-websites\b', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-background-error-strong'
    signal: visual # status colors shift one shade, in every brand theme
    detect:
      - { pattern: '\b(error|warning|success)Strong\b|light-yellow-700\b|#(47883a|ae731a)\b', expect: review }
pr: 750
---

## Before → after

```css before
.cta {
  background: var(--color-background-accent-websites);
  color: #fff;
}
.link {
  color: #b23a00;
}
.badge {
  background: #47883a;
}
```

```css after
.cta {
  background: var(--color-background-accent-websites);
  color: var(--color-text-on-accent-websites);
}
.link {
  color: var(--color-text-interactive-websites);
}
.badge {
  background: var(--color-background-success-strong);
}
```

```ts before
const cta = {
  backgroundColor: websitesThemes.light.colors.bg.accent,
  color: '#fff',
};
```

```ts after
const cta = {
  backgroundColor: websitesThemes.light.colors.bg.accent,
  color: websitesThemes.light.colors.text.onAccent,
};
```

## Decide

- **Websites accent.** The websites brand is now purple instead of orange:
  the `*-websites` accent, active and interactive tokens, the
  `*-active-subtle-website` tokens, and the websites theme's `accent` and
  `active` colors (CSS and JS). Active borders (`border-active-websites`,
  `border.active`) turn purple in light mode only. The focus ring
  (`border-focus-websites`, `border.focus`) and dark active borders stay
  orange. `text-on-accent` turns from white to black, in light and dark mode.
- **Status colors**, in every brand theme. Light: error, warning and success
  strong backgrounds, borders and success text move one shade darker (600 →
  700; error border hover and pressed to 800 and 900), and `bg.successStrong`
  is no longer the hardcoded `#47883a`. Dark: error and warning text move
  700 → 600. The CSS `--color-light-yellow-700` primitive is now `#9b6109`.

Keep the new colors (the default). Act only where the app hardcodes the old
values (orange `#ff5300` / `#b23a00`, `#47883a`, `#ae731a`) to match a token,
or puts its own text or icons on an accent surface: switch them to the theme
tokens.

## Verify

Look at screens using the websites theme, light and dark: buttons, active
states, links and text on accent. No orange left except the focus ring and
dark active borders, and text on accent is readable. In every theme, error, warning and success
banners, badges and borders keep readable contrast.
