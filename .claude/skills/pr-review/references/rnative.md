# React Native review checklist (`libs/ui-rnative`, `libs/ui-rnative-visualization`)

Load this when the PR touches `libs/ui-rnative/**` or
`libs/ui-rnative-visualization/**`. Authoritative rules live in the
`rnative-styling` and `rnative-testing` skills — the items below are the
review-checkable violations. Do not restate the skills.

There is **no Tailwind here.** Visuals come from the JS theme objects in
`libs/design-core/src/lib/themes/js/` consumed through `useStyleSheet` — the RN
equivalent of the web design tokens (same vocabulary, object shape). Never flag
a missing className or apply Tailwind rules.

## Styling (`useStyleSheet` + theme + `lx`)

- **Build visuals with `useStyleSheet((t) => ({ ... }), [deps])`**, where `t`
  exposes `t.colors`, `t.spacings`, `t.sizes`, `t.typographies`,
  `t.borderRadius`, `t.borderWidth`. Flag hardcoded color/spacing/size literals
  that should be theme tokens under `Consistency`.
- **Extract styles into dedicated `useXStyles` hooks** (`useRootStyles`,
  `useSwitchStyles`, …) rather than inlining a large stylesheet in the component
  body.
- **Variant composition**: `Record<Variant, value>` maps declared inside
  `useStyleSheet` for appearance/size/state; conditional spreading via
  `StyleSheet.flatten([...])` for state-driven overrides.
- **Pressed state via render-prop child**:
  `<Pressable>{({ pressed }) => /* styles keyed by pressed */}</Pressable>`.
- `useTheme()` only for raw values needed outside a stylesheet (e.g.
  `selectionColor`, animated interpolations).

## Props drilling & merge order

- Forward `ref`, `lx`, `style`, and `...props` (including `testID`) to the
  outermost styled primitive. `ref` is a destructured prop (no `forwardRef`).
- **Merge order: internal styles first, consumer `style` last, so the consumer
  wins** — `StyleSheet.flatten([styles.root, style])` /
  `[styles.root, style]`. Flag the reversed order.
- `lx` is the token-based layout/spacing override for consumers; internal
  visuals use `useStyleSheet`. Forward `lx` to the outermost primitive.
- Multiple overridable inner elements get separate named style props
  (`containerStyle`, `inputStyle`, `labelStyle`).
- Disabled state → `useDisabledContext({ consumerName, mergeWith: { disabled } })`
  from `@ledgerhq/lumen-utils-shared` (see `disabled-context`).

## Tests (Jest + React Native Testing Library)

- Runner is **Jest**: `import { describe, it, expect, jest } from '@jest/globals'`.
  `jest.fn()`, not `vi.fn()`.
- `render`, `fireEvent`, `screen`, `waitFor` from
  `@testing-library/react-native`.
- **A `ThemeProvider` wrapper is required** — an unwrapped render throws. Expect
  a `TestWrapper` using `ledgerLiveThemes`:
  ```tsx
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
  ```
  Flag any test that renders without it.
- Target root via `testID`; text when `testID` doesn't fit; `getByRole` for
  switches. Interactions: `fireEvent.press`, `fireEvent.changeText`, low-level
  `fireEvent(el, '<eventName>')` for `longPress`/`onError`. `waitFor` for async.
- Structure: top-level `describe('<ComponentName>')` with nested `Rendering`,
  `Appearances`, `Sizes`, `Interactions`, `States`, `Styling`; `it.each([...])`
  for variant/size matrices.

## Component addition checklist (`libs/ui-rnative`)

```
ComponentName/
- [ ] ComponentName.tsx            implementation
- [ ] types.ts                     prop types with JSDoc
- [ ] ComponentName.test.tsx       Jest coverage, wrapped in ThemeProvider
- [ ] ComponentName.stories.tsx    Base + {Property}Showcase + With{Feature}
- [ ] ComponentName.mdx            Overview + Implementation tabs
- [ ] ComponentName.figma.tsx      Code Connect (if the component is in Figma)
- [ ] index.ts                     barrel: export * and export type *
- [ ] parent index.ts              component re-exported from Components barrel
```

- Stories `id` prefix is `rnative-*`; `Base` render is usually explicit
  (`render: (args) => <Component {...args} />`).

**Visualization exception** (`libs/ui-rnative-visualization`): styles directly
with `useTheme()` + plain inline styles / geometry constants rather than
`useStyleSheet`/`lx`. Stories live in `__stories__/`; there is **no** `.mdx` or
`.figma.tsx`. Don't flag their absence, and don't require `useStyleSheet`.

## API parity (when web is also touched)

If the same component is changed in `libs/ui-react`, prop names, defaults, and
variant vocabulary should match the RN implementation unless there's a platform
reason. Flag divergences under `Parity`.
