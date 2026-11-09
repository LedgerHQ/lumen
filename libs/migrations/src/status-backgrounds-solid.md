---
changes:
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--background-error'
    signal: visual # error, warning and success backgrounds are now solid
    detect:
      - { pattern: '\bbg-(error|warning|success)(?![\w-])', expect: review }
      - { pattern: '--(color-)?background-(error|warning|success)\b(?!-)', expect: review }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--background-error-hover'
    to: '@ledgerhq/lumen-design-core#--background-error-transparent-hover'
    signal: silent # the old classes emit no CSS
    detect:
      - { pattern: '\b(bg|from|via|to|fill)-error-(hover|pressed)\b' }
      - { pattern: '--(color-)?background-error-(hover|pressed)\b' }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.errorTransparent'
    signal: visual # was fully transparent, now a 10% tint
    detect:
      - { pattern: '\bbg\.(error|success)Transparent\b', expect: review }
  - change: changed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.error'
    signal: visual
    detect:
      - { pattern: '\bbg\.(error|warning|success)\b', expect: review }
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
pr: 834
---

## Before → after

```tsx before
<div className='bg-error'>Payment failed</div>
<button className='bg-error hover:bg-error-hover active:bg-error-pressed'>Retry</button>
```

```tsx after
<div className='bg-error-transparent'>Payment failed</div>
<button className='bg-error-transparent hover:bg-error-transparent-hover active:bg-error-transparent-pressed'>Retry</button>
```

```css before
.alert {
  background: var(--background-warning);
  border-color: var(--color-light-decorative-blue);
}
.alert:hover {
  background: var(--background-error-hover);
}
```

```css after
.alert {
  background: var(--background-warning-transparent);
  border-color: var(--background-decorative-blue);
}
.alert:hover {
  background: var(--background-error-transparent-hover);
}
```

```ts before
const styles = {
  banner: { backgroundColor: theme.colors.bg.error },
  pressed: { backgroundColor: theme.colors.bg.errorHover },
  fade: { backgroundColor: theme.colors.bg.successTransparent },
  outline: { borderColor: theme.colors.border.whiteHover },
  tag: { backgroundColor: primitiveColorTokens.light.decorative.blue },
};
```

```ts after
const styles = {
  banner: { backgroundColor: theme.colors.bg.errorTransparent },
  pressed: { backgroundColor: theme.colors.bg.errorTransparentHover },
  fade: { backgroundColor: theme.colors.bg.successTransparent0 },
  outline: { borderColor: theme.colors.border.white },
  tag: { backgroundColor: theme.colors.bg.decorativeBlue },
};
```

## Decide

Applies to every theme (`ledgerLiveThemes`, `enterpriseThemes`,
`websitesThemes`, light and dark) and to the CSS variables behind the
Tailwind classes.

- **Solid status backgrounds.** `bg-error`, `bg-warning` and `bg-success`
  (`bg.error`, `bg.warning`, `bg.success`) are now solid colors; the old tint
  is `bg-*-transparent` (`bg.*Transparent`). Default: switch to the
  transparent token to keep the current look. Keep the solid one only where
  the design asks for it. `bg-error-transparent` and
  `bg-success-transparent` are new tokens here, not the earlier ones renamed
  to `-transparent-0`: leave those `-0` usages alone.
- **Error hover and pressed.** Rename `bg-error-hover` / `bg-error-pressed`
  to `bg-error-transparent-hover` / `-pressed` (`bg.errorHover` →
  `bg.errorTransparentHover`, same for `Pressed`). Border and text error
  tokens are unchanged.
- **`bg.errorTransparent` and `bg.successTransparent`** went from fully
  transparent to a 10% tint. Hits that existed before this upgrade (fades,
  gradient ends) move to `bg.*Transparent0`. Hits you just created by the
  switch above stay.
- **`border.whiteHover` / `whitePressed`** are gone. Use `border.white`.
- **Decorative primitives** (`--color-{light,dark}-decorative-*`,
  `primitiveColorTokens.*.decorative.*`) are now shade scales. Use the
  semantic token (`bg-decorative-blue`, `--background-decorative-blue`,
  `bg.decorativeBlue`). Default when only a primitive fits: the `-300` shade
  in light, `-400` in dark, which the semantic background uses.

## Verify

Zero hits for the non-review `detect` patterns, and every review hit has been
decided. Typecheck passes. Look at error, warning and success banners, alerts,
buttons and tags in light and dark: they keep the intended tint.
