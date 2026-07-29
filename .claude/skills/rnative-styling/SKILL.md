---
name: rnative-styling
description: >-
  Use when building or styling a React Native component in libs/ui-rnative —
  useStyleSheet + themeJS tokens, the `lx` prop, variant composition,
  props-drilling, and shared styling best-practices.
paths: libs/ui-rnative/**/*.ts, libs/ui-rnative/**/*.tsx, libs/ui-rnative-visualization/**/*.ts, libs/ui-rnative-visualization/**/*.tsx
---

# React Native styling (`libs/ui-rnative`)

The RN counterpart of the `react-styling` skill. The cross-platform principles —
props-drilling to the top-level element, variant composition, never hiding
behaviour — are shared; see `react-styling` for those. This skill covers the
RN-specific mechanics.

## Theme tokens (themeJS)

- Component visuals come from the **JS theme objects** in
  `libs/design-core/src/lib/themes/js/` (per brand × `dark`/`light`), consumed
  through `useStyleSheet`. This is the RN equivalent of the Tailwind design
  tokens used on the web — same token vocabulary, JS object shape.
- `useStyleSheet` lives at `libs/ui-rnative/src/styles/hooks/useStyleSheet.ts`.

## Style system

- Build visuals with `useStyleSheet((t) => ({ ... }), [deps])`.
- The callback argument `t` provides `t.colors`, `t.spacings`, `t.sizes`,
  `t.typographies`, `t.borderRadius`, and `t.borderWidth`.
- Use `StyleSheet.flatten([...])` to merge conditional styles (pressed, disabled,
  variant-specific).
- Reach for `useTheme()` only when you need raw theme values outside a stylesheet
  (e.g. `selectionColor`, animated interpolations).
- **Extract styles into dedicated `useXStyles` hooks** that wrap `useStyleSheet`
  (e.g. `useRootStyles`, `useSwitchStyles`, `useHelperTextStyles`) instead of
  inlining the whole stylesheet in the component body — it keeps the component
  readable and the styles reusable. See `BaseButton.tsx`, `Switch.tsx`,
  `BaseInput.tsx`.

## lx prop

- `lx` is the token-based style prop on styled primitives (`Box`, `Pressable`,
  `Text`).
- Forward `lx` from component props to the outermost styled primitive.
- `lx` is for layout/spacing overrides by consumers — internal component visuals
  use `useStyleSheet`.

## Variant composition

- Define `Record<Variant, value>` maps inside `useStyleSheet` for appearance,
  size, and state variants, co-located in the callback so they can read `t`.
- Use conditional spreading in `StyleSheet.flatten` for state-driven overrides:
```ts
StyleSheet.flatten([
  baseStyles,
  pressed && { backgroundColor: pressedBgColors[appearance] },
  disabled && { backgroundColor: t.colors.bg.disabled },
])
```
- **Drive the `pressed` state with a render-prop child**, feeding the flag into
  the variant styles:
```tsx
<Pressable>{({ pressed }) => /* styles keyed by pressed */}</Pressable>
```

## Props drilling

- Forward `ref`, `lx`, `style`, and `...props` (including `testID`) to the
  outermost primitive. `ref` is a destructured prop (React 19 style) — no
  `forwardRef`.
- **Merge order: internal styles first, consumer `style` last, so the consumer
  wins.** This is the dominant convention (`BaseTag`, `Card`, `Switch`):
```ts
StyleSheet.flatten([styles.root, style])
```
- Use separate named style props (`containerStyle`, `inputStyle`, `labelStyle`)
  when multiple inner elements accept consumer overrides.

## Disabled state

- Any component with a `disabled` state inherits it via the shared disabled
  context: `useDisabledContext({ consumerName, mergeWith: { disabled } })`
  (imported from the `@ledgerhq/lumen-utils-shared` barrel). See the
  `disabled-context` skill for the provider/consumer details.

## Visualization components

`libs/ui-rnative-visualization` largely styles **directly with `useTheme(...)`**
(plus plain inline styles / geometry constants) rather than `useStyleSheet`/`lx`
— the patterns above are written for `libs/ui-rnative`.
