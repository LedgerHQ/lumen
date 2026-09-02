---
name: component-architecture
description: >-
  Use when designing or changing a component's public API, its composition, or
  its state model in libs/ui-react or libs/ui-rnative — layering (core vs internal
  vs primitives), BaseProps/Props splits, converting a component to compound /
  changing its composition with createSafeContext, controlled/uncontrolled state,
  prop-naming conventions, and cross-platform API parity. Load this before shaping
  a new component, changing its props, or refactoring its composition.
paths: libs/ui-react/src/lib/Components/**/*.tsx, libs/ui-rnative/src/lib/Components/**/*.tsx, libs/ui-react/src/lib/Components/**/types.ts, libs/ui-rnative/src/lib/Components/**/types.ts
---

# Component architecture & API design

How Lumen components are shaped, layered and composed. This is the authoring
counterpart to `component-anatomy` (which covers *where files live*) — this skill
covers *what the component's API and internals look like*. The styling mechanics
live in `component-styling`.

## Layering: `core/` vs `internal/` vs `primitives/`

Components sit in one of a few layers; put new code in the right one.

- **`core/`** — the public components that ship from the package root
  (`Button`, `Card`, `Switch`, …).
- **`internal/`** — shared building blocks that are **not** public API. Reach for
  a `Base*` wrapper when several public components share the same chrome, variants
  or behaviour: `BaseButton` backs `Button`, `IconButton`, `CardButton`,
  `MediaButton`, `TileButton`; `BaseInput` backs `TextInput`, `SearchInput`,
  `AddressInput`; `BaseTag` backs the tag family. Add one only when a second
  consumer appears — don't pre-abstract.
- **`primitives/`** (React Native only) — token-constrained styled wrappers
  (`Box`, `Text`, `Pressable`) that core RN components build on. Web has no
  primitive layer; it composes semantic HTML + Tailwind + Radix/Base UI `Slot`.
- **`symbols/`** — the icon registry and generated icon components.

## BaseProps vs Props

When a `Base*` wrapper exists, split the types: the `Base*Props` carries the
shared surface, and each public component narrows it.

```ts
// internal/BaseButton/types.ts — the shared surface
export type BaseButtonProps = {
  appearance?: 'base' | 'gray' | 'accent' | 'transparent' | 'no-background' | 'red';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isFull?: boolean;
  loading?: boolean;
  asChild?: boolean;
  icon?: ComponentType<{ size?: IconSize; className?: string }>;
} & ComponentPropsWithRef<'button'>;

// core/Button/types.ts — narrows and constrains it
export type ButtonProps = {
  /** @required */
  children: ReactNode;
  /** @default md */
  size?: 'sm' | 'md' | 'lg'; // Button drops the 'xs' size
} & Omit<BaseButtonProps, 'children' | 'size'>;
```

Both types live in the component's `types.ts` (see `component-anatomy`). Prefer
`Omit`/`Pick` over redefining shared props.

## Compound components + `createSafeContext`

A component with distinct parts (`Card` + `CardHeader` + `CardContent` + `CardFooter`,
`Dialog` + `DialogTrigger` + `DialogContent`, `ListItem`, `BottomSheet`) exports
each sub-part from its folder barrel and shares state through a context built with
`createSafeContext` from `@ledgerhq/lumen-utils-shared` — **not** a hand-rolled
`createContext`.

```ts
// createSafeContext<CtxValue>(rootComponentName, defaultContext?)
//   → [Provider, useSafeContext]
const [CardProvider, useCardContext] = createSafeContext<CardContextValue>('Card');

// In a sub-part: throws `${consumerName} must be used within Card` when the
// provider is missing and the context is required.
const ctx = useCardContext({ consumerName: 'CardHeader', contextRequired: true });
```

- Set `contextRequired: false` for a sub-part that may render standalone (returns
  a partial/default context instead of throwing).
- If the component owns a `disabled` state, provide it through the shared
  disabled context rather than a second provider — see `disabled-context`. `Card`
  is the reference (`CardProvider` + `DisabledProvider`).

## Controlled / uncontrolled state

For any stateful, user-driven value (selection, open/checked, text), support both
controlled and uncontrolled use through `useControllableState` rather than
hand-rolling the fallback:

```ts
const [value, setValue] = useControllableState({
  prop: valueProp,        // controlled value (undefined ⇒ uncontrolled)
  defaultProp,            // initial value when uncontrolled
  onChange,               // fired on change (prop-wins by default)
});
```

- Expose the trio on the public API: `value` + `defaultValue` + `onChange`
  (named per the component's domain, e.g. `checked`/`defaultChecked`/`onCheckedChange`).
- **Known debt**: `useControllableState` currently lives per-lib
  (`libs/ui-react/src/utils/…`, `libs/ui-rnative/src/lib/utils/…`) rather than in
  `utils-shared`. Use the one in your lib; don't add a third copy.

## API design rules

- **Prop names follow established vocabulary**: `onOpenChange` not `onToggle`,
  `appearance` not `variant`. Match the name an existing component already uses
  for the same concept.
- **Booleans are positive**: `isFull`, `overlay`, `loading` — never `noOverlay`.
- **Keep the public surface minimal and self-explanatory.** Every public prop
  carries JSDoc with intent and an `@default` (or `@required`) tag.
- **JSDoc describes behaviour, not the type.** Do not enumerate union/literal
  values already on the TypeScript type (`'auto'` / `'none'`, `'plain'`, …).
  That makes JSDoc a second API that can drift. Keep the behavioural
  description; let the type (and JSDoc parsers) surface the literals.
- **Shared logic goes in `utils-shared`**, not copied across components.
- **A hook that manages state *and* derives data *and* subscribes to events is
  doing too much** — split it.
- A wrapper that spreads `ComponentPropsWithRef<'el'>` must actually forward those
  props and `ref` (and `testID`/`...props` on RN) — don't silently drop `onClick`.

## Cross-platform API parity

The same component ships on web and native and should keep **matching prop names,
defaults and variant vocabulary** — an app author moving between platforms should
not relearn the API. `Button` is the reference: `appearance` / `size` / `isFull`
/ `loading` / `icon` are identical on both.

Divergence is allowed **only when a platform idiom demands it**, and it should be
deliberate. The tolerated example is `Switch`: web uses
`selected` / `defaultSelected` / `onChange`; native uses
`checked` / `defaultChecked` / `onCheckedChange` (aligning with the native
primitive). When you change a component on one platform, check the other's
`types.ts` and keep them in step unless there's such a reason.

## Memoization

Lumen does **not** blanket-memoize. `React.memo` is reserved for components with a
measured re-render cost (essentially only `AmountDisplay`); `useMemo`/`useCallback`
are used where there's real work (layout math, throttled scroll, expensive derived
styles), not by default. Add memoization when you can point to the reason, not
reflexively.

## Reference components to imitate

- **`Button` / `BaseButton`** — `internal/` layering, `Base*Props` → public props,
  variant vocabulary.
- **`Card`** — compound parts + `createSafeContext` + disabled context.
- **`Select`** (web) — controlled/uncontrolled + compound architecture.
- **`Switch`** — controlled state and the tolerated cross-platform divergence.

## Review checks

Rules verifiable from a diff.

| Check | Applies to | Detect | Skip |
| --- | --- | --- | --- |
| Prop name off the established vocabulary | both | `onToggle`/`variant`-style names for existing concepts | genuinely new concept |
| Negative boolean prop | both | `no*`/`disable*`-phrased boolean props | — |
| Shared component family not split into `Base*Props` → public props | both | duplicated prop surface across sibling components | single-use component |
| Compound sub-part uses hand-rolled `createContext` instead of `createSafeContext` | both | `createContext(` in a component folder | genuinely global/app context |
| Controlled component hand-rolls the controlled/uncontrolled fallback | both | `value ?? internalState` logic instead of `useControllableState` | Radix/Base UI-delegated state (web) |
| Cross-platform prop divergence without a stated reason | both | prop names/defaults differ from the other platform's `types.ts` | documented platform-idiom divergence (e.g. `Switch`) |
| Reflexive memoization with no measured need | both | `memo`/`useMemo`/`useCallback` around trivial work | measured hot paths |
| Public prop missing JSDoc intent / `@default` | both | undocumented prop in `types.ts` | internal `Base*Props` |
| JSDoc enumerates union/literal values already on the type | both | JSDoc lists `'foo' \\| 'bar'` or bullet-lists the same literals as the type | restating a default with `@default` |
| Logic duplicated across components that belongs in `utils-shared` | both | copy-pasted helper in two component folders | — |
