# React Native styling (`libs/ui-rnative`)

`useStyleSheet` + the JS theme objects (themeJS) + the `lx` prop. There is **no
Tailwind here.** The shared principles live in the parent `SKILL.md`; this file
is the RN mechanism.

## Theme tokens (themeJS)

- Component visuals come from the **JS theme objects** in
  `libs/design-core/src/lib/themes/js/` (per brand × `dark`/`light`), consumed
  through `useStyleSheet`. Same token vocabulary as the web Tailwind tokens, JS
  object shape.
- `useStyleSheet` lives at `libs/ui-rnative/src/styles/hooks/useStyleSheet.ts`.

## Style system

- Build visuals with `useStyleSheet((t) => ({ ... }), [deps])`. The callback
  argument `t` exposes `t.colors`, `t.spacings`, `t.sizes`, `t.typographies`,
  `t.borderRadius`, `t.borderWidth`. Hardcoded colour/spacing/size literals that
  should be tokens are a `Consistency` bug.
- Use `StyleSheet.flatten([...])` to merge conditional styles (pressed, disabled,
  variant-specific).
- Reach for `useTheme()` only when you need a raw theme value **outside** a
  stylesheet (e.g. `selectionColor`, animated interpolations).

## Extract styles into `useXStyles` hooks

Wrap `useStyleSheet` in dedicated hooks (`useRootStyles`, `useSwitchStyles`,
`useHelperTextStyles`, …) instead of inlining a large stylesheet in the component
body — it keeps the component readable and the styles reusable. See
`BaseButton.tsx`, `Switch.tsx`, `BaseInput.tsx`.

## Variant composition

- Declare `Record<Variant, value>` maps **inside** `useStyleSheet` for appearance,
  size and state so they can read `t`.
- Use conditional spreading in `StyleSheet.flatten` for state-driven overrides:

```ts
StyleSheet.flatten([
  baseStyles,
  pressed && { backgroundColor: pressedBgColors[appearance] },
  disabled && { backgroundColor: t.colors.bg.disabled },
])
```

- Drive the `pressed` state with a render-prop child:

```tsx
<Pressable>{({ pressed }) => /* styles keyed by pressed */}</Pressable>
```

## Props drilling & merge order

- Forward `ref`, `lx`, `style`, and `...props` (including `testID`) to the
  outermost styled primitive. `ref` is a destructured prop (React 19 style) — no
  `forwardRef`.
- **Merge order: internal styles first, consumer `style` last, so the consumer
  wins.** This is the dominant convention (`BaseTag`, `Card`, `Switch`):

```ts
StyleSheet.flatten([styles.root, style])
```

  The reversed order (`[style, styles.root]`) silently prevents consumers from
  overriding — flag it.
- Use separate named style props (`containerStyle`, `inputStyle`, `labelStyle`)
  when multiple inner elements accept consumer overrides.

## lx prop

- `lx` is the token-based layout/spacing override for consumers, available on
  styled primitives (`Box`, `Pressable`, `Text`).
- Forward `lx` to the outermost styled primitive. Internal component visuals use
  `useStyleSheet`, not `lx`.

## Disabled state

A component with a `disabled` state inherits it via the shared disabled context —
see the `disabled-context` skill (this skill does not restate it).

## Visualization exception

Charts live in `src/lib/Components/visualization/` and are published only at the
`@ledgerhq/lumen-ui-rnative/visualization` subpath. They style **directly with
`useTheme()`** plus plain inline styles / geometry constants rather than
`useStyleSheet`/`lx`. The patterns above are written for the rest of the lib;
don't require `useStyleSheet` under `visualization/`.
