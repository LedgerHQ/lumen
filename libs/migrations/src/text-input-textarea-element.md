---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.onChange'
    signal: loud
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#AddressInput.onChange'
    signal: loud
pr: 851
---

## Before → after

```tsx before
<TextInput label='Amount' onChange={(e) => setAmount(e.target.valueAsNumber)} />
```

```tsx after
<TextInput label='Amount' onChange={(e) => setAmount(Number(e.target.value))} />
```

## Decide

`TextInput` and `AddressInput` can now render a `textarea`, so their event
targets, `ref` and props types (`TextInputProps`, `AddressInputProps`) use
`HTMLInputElement | HTMLTextAreaElement`. Only code the typechecker flags
needs a change. Members both elements share (`value`, `focus()`, `select()`,
`selectionStart`) need nothing.

- Input-only members in handlers (`valueAsNumber`, `files`, `checked`,
  `showPicker()`): read `e.target.value` and parse it, or narrow with
  `e.target instanceof HTMLInputElement`.
- `TextInputProps` or its `ref` passed on to code typed for
  `HTMLInputElement`: widen that code to `HTMLInputElement |
  HTMLTextAreaElement`. If that isn't possible and the field never sets
  `multiline`, cast at that boundary.

`SearchInput` keeps its input-only types.

## Verify

Typecheck passes. Inputs with custom handlers still update as before.
