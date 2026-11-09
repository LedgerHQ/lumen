---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.onChange'
    signal: loud
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.ref'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#TextInputProps'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.prefix'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.size'
    signal: loud
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#AddressInput.onChange'
    signal: loud
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#AddressInput.ref'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#AddressInputProps'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SearchInputProps'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SearchInput.prefix'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SearchInput.size'
    signal: loud
pr: 851
---

## Before → after

```tsx before
<TextInput label='Amount' type='number' onChange={(e) => setAmount(e.target.valueAsNumber)} />
```

```tsx after
<TextInput label='Amount' type='number' onChange={(e) => setAmount(e.target instanceof HTMLInputElement ? e.target.valueAsNumber : NaN)} />
```

```tsx before
<TextInput label='Name' size={20} />
```

```tsx after
<TextInput label='Name' />
```

## Decide

`TextInput` and `AddressInput` can now render a `textarea`, so the targets of
all their event handlers (`onChange`, `onKeyDown`, `onBlur`…), their `ref`
and their props types (`TextInputProps`, `AddressInputProps`) use
`HTMLInputElement | HTMLTextAreaElement`. `SearchInput` keeps input-only types
for `ref` and `onChange`; its other handlers are widened the same way. Only
code the typechecker flags needs a change. Members both elements share
(`value`, `focus()`, `select()`, `selectionStart`) need nothing.

- Input-only members in handlers (`valueAsNumber`, `files`, `checked`,
  `showPicker()`): narrow with `e.target instanceof HTMLInputElement`. If you
  parse `e.target.value` instead, keep empty values distinct: `Number('')` is
  `0`, where `valueAsNumber` was `NaN`.
- `TextInputProps` or its `ref` passed on to code typed for
  `HTMLInputElement`: widen that code to `HTMLInputElement |
  HTMLTextAreaElement`. If that isn't possible and the field never sets
  `multiline`, cast at that boundary.
- `size` on `TextInput` or `SearchInput`: remove it. The input already fills
  its container, so it had no visible effect.
- A string `prefix` on `TextInput` (rendered before the input): for an
  address field with no label, use `AddressInput`. Otherwise drop it and
  report the visual difference.
- A `prefix` on `SearchInput` (it replaced the search icon): remove it, and
  report that the search icon shows again.

## Verify

Typecheck passes. Inputs with custom handlers still update as before.
