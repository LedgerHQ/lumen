---
changes:
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--background-error'
    signal: visual # error, warning and success backgrounds are now solid
    detect:
      - { pattern: '\b(bg|from|via|to|fill|shadow|accent)-(error|warning|success)(?![\w-])', expect: review }
      - { pattern: '--(color-)?background-(error|warning|success)\b(?!-)', expect: review }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--background-error-hover'
    to: '@ledgerhq/lumen-design-core#--background-error-transparent-hover'
    signal: silent # the old classes emit no CSS
    detect:
      - { pattern: '\b(bg|from|via|to|fill|shadow|accent)-error-(hover|pressed)\b' }
      - { pattern: '--(color-)?background-error-(hover|pressed)\b' }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.errorTransparent'
    signal: visual # was fully transparent, now a 10% tint (15% in dark)
    detect:
      - { pattern: '\bbg\.(error|success)Transparent\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Box.lx'
    signal: visual # every lx backgroundColor resolves through colors.bg
    detect:
      - { pattern: '\bbackgroundColor:\s*[''"](error|success)Transparent[''"]', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.error'
    signal: visual
    detect:
      - { pattern: '\bbg\.(error|warning|success)\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Box.lx'
    signal: visual
    detect:
      - { pattern: '\bbackgroundColor:\s*[''"](error|warning|success)[''"]', expect: review }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.errorHover'
    to: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.errorTransparentHover'
    signal: loud
    detect:
      - { pattern: '\bbg\.error(Hover|Pressed)\b' }
  - change: removed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.border.whiteHover'
    signal: loud
    detect:
      - { pattern: '\bborder\.white(Hover|Pressed)\b' }
  - change: removed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-light-decorative-blue'
    signal: silent # the variable is undefined, so the color drops
    detect:
      - { pattern: '--color-(light|dark)-decorative-(orange|green|blue|purple|red|yellow|turquoise|pink)\b(?!-)' }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#primitiveColorTokens.light.decorative.blue'
    signal: loud # each color is now a record of shades
    detect:
      - { pattern: 'primitiveColorTokens\.(light|dark)\.decorative\.\w+(?![\w\[])' }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--background-decorative-blue'
    signal: visual # dark themes: was the pastel, now the darker -400 shade
    detect:
      - { pattern: '\b(bg|from|via|to|fill|shadow|accent)-decorative-(orange|green|blue|purple|red|yellow|turquoise|pink)\b', expect: review }
      - { pattern: '--(color-)?background-decorative-', expect: review }
      - { pattern: '\b(bg\.|backgroundColor:\s*[''"])decorative[A-Z]', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.gradient100'
    signal: visual # JS light themes only: dark grey-950 base is now white grey-050, as in CSS
    detect:
      - { pattern: '\b(bg\.|backgroundColor:\s*[''"])gradient(100|80|70|0)\b', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.surfaceTransparentHover'
    signal: visual # JS light themes only: 10% → 5% (Pressed 20% → 10%), as in CSS
    detect:
      - { pattern: '\b(bg\.|backgroundColor:\s*[''"])surfaceTransparent(Hover|Pressed)\b', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#enterpriseThemes.light.colors.border.activeHover'
    signal: visual # enterprise JS only: blue-700 → 800 (dark 500 → 600)
    detect:
      - { pattern: '\b(border\.|borderColor:\s*[''"])activeHover\b', expect: review }
pr: 834
---

## Before → after

```tsx before
<div className='bg-error'>Payment failed</div>
<button className='bg-error hover:bg-error-hover active:bg-error-pressed'>Retry</button>
<span className='bg-decorative-blue'>New</span>
```

```tsx after
<div className='bg-error-transparent'>Payment failed</div>
<button className='bg-error-transparent hover:bg-error-transparent-hover active:bg-error-transparent-pressed'>Retry</button>
<span className='bg-decorative-blue'>New</span>
```

```css before
.alert {
  background: var(--background-warning);
  border-color: var(--color-light-decorative-blue);
}
.alert:hover {
  background: var(--background-error-hover);
}
.badge {
  background: var(--background-decorative-blue);
}
```

```css after
.alert {
  background: var(--background-warning-transparent);
  border-color: var(--color-light-decorative-blue-300);
}
.alert:hover {
  background: var(--background-error-transparent-hover);
}
.badge {
  background: var(--background-decorative-blue);
}
```

```ts before
const styles = {
  banner: { backgroundColor: theme.colors.bg.error },
  pressed: { backgroundColor: theme.colors.bg.errorHover },
  fade: { backgroundColor: theme.colors.bg.successTransparent },
  outline: { borderColor: theme.colors.border.whiteHover },
  tag: { backgroundColor: primitiveColorTokens.light.decorative.blue },
  chip: { backgroundColor: theme.colors.bg.decorativeBlue },
  scrim: { backgroundColor: theme.colors.bg.gradient80 },
  row: { backgroundColor: theme.colors.bg.surfaceTransparentHover },
  focus: { borderColor: theme.colors.border.activeHover },
};
```

```ts after
const styles = {
  banner: { backgroundColor: theme.colors.bg.errorTransparent },
  pressed: { backgroundColor: theme.colors.bg.errorTransparentHover },
  fade: { backgroundColor: theme.colors.bg.successTransparent0 },
  outline: { borderColor: theme.colors.border.white },
  tag: { backgroundColor: primitiveColorTokens.light.decorative.blue['300'] },
  chip: { backgroundColor: theme.colors.bg.decorativeBlue },
  scrim: { backgroundColor: theme.colors.bg.gradient80 },
  row: { backgroundColor: theme.colors.bg.surfaceTransparentHover },
  focus: { borderColor: theme.colors.border.activeHover },
};
```

React Native `lx` takes the same `colors.bg` keys as strings:

```tsx before
<Box lx={{ backgroundColor: 'error' }} />
<Box lx={{ backgroundColor: 'successTransparent' }} />
```

```tsx after
<Box lx={{ backgroundColor: 'errorTransparent' }} />
<Box lx={{ backgroundColor: 'successTransparent0' }} />
```

## Decide

Applies to every theme (`ledgerLiveThemes`, `enterpriseThemes`,
`websitesThemes`, light and dark) and to the CSS variables behind the
Tailwind classes, unless noted.

- **Solid status backgrounds.** `bg-error`, `bg-warning` and `bg-success`
  (`bg.error`, `bg.warning`, `bg.success`, `lx` `backgroundColor: 'error'`)
  are now solid colors; the old tint is `bg-*-transparent`
  (`bg.*Transparent`). The same applies to the `from-`, `via-`, `to-`,
  `fill-`, `shadow-` and `accent-` utilities. Default: switch
  to the transparent token to keep the current look. Keep the solid one only
  where the design asks for it. `bg-error-transparent` and
  `bg-success-transparent` are new tokens here, not the earlier ones renamed
  to `-transparent-0`: leave those `-0` usages alone.
- **Error hover and pressed.** Rename `bg-error-hover` / `bg-error-pressed`
  to `bg-error-transparent-hover` / `-pressed` (`bg.errorHover` →
  `bg.errorTransparentHover`, same for `Pressed`). Border and text error
  tokens keep their names; their red and green primitives shifted slightly.
- **`bg.errorTransparent` and `bg.successTransparent`** (and their `lx`
  strings) went from fully transparent to a 10% tint (15% in dark). Hits
  that existed before this upgrade (fades, gradient ends) move to
  `*Transparent0`. Hits you just created by the switch above stay. Apply
  this step before the solid switch.
- **`border.whiteHover` / `whitePressed`** are gone. Use `border.white`.
- **Decorative primitives** (`--color-{light,dark}-decorative-*`,
  `primitiveColorTokens.*.decorative.*`) are now shade scales. The old
  pastel was the same in light and dark; its equivalent is the light `-300`
  shade (`--color-light-decorative-*-300`,
  `primitiveColorTokens.light.decorative.*['300']`) in any theme, the dark
  `-700`. Orange, green, yellow and turquoise shifted slightly. Moving to the
  semantic token (`bg-decorative-blue`, `bg.decorativeBlue`) or the dark
  `-400` changes the color in dark themes: do it only if the design wants
  it.
- **Semantic decorative backgrounds** (`bg-decorative-*`,
  `--background-decorative-*`, `bg.decorative*`) keep their light color
  (bar the slight shifts above) but now use the darker `-400` shade in dark
  themes. Keep them unless the old
  pastel is required; then use the light `-300` primitive.
- **JS themes only** (RN, and any web code reading the JS themes), aligned
  with CSS: light `bg.gradient100`, `80`, `70` and `0` flipped from a dark
  to a white base; light `bg.surfaceTransparentHover` / `Pressed` are
  lighter; enterprise `border.activeHover` is one shade darker. No rename:
  check each hit renders as intended.

## Verify

Zero hits for the non-review `detect` patterns, and every review hit has been
decided. Typecheck passes. Look at error, warning and success banners, alerts,
buttons and tags, decorative tags and avatars, and JS-themed gradients and
hover states in light and dark: they keep the intended colors.
