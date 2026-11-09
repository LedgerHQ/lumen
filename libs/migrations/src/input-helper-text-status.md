---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.errorMessage'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SearchInput.errorMessage'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#AddressInput.errorMessage'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#BaseInput.errorMessage'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectSearch.errorMessage'
    signal: loud
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#BaseInput.aria-invalid'
    signal: visual # aria-invalid alone no longer draws the error ring
    detect:
      - { pattern: '<(TextInput|SearchInput|AddressInput|BaseInput|SelectSearch)\b(?:[^>]|=>)*?\baria-invalid\b', expect: review }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#TextInput.errorMessage'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#SearchInput.errorMessage'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#AddressInput.errorMessage'
    signal: loud
pr: 653
---

## Before → after

```tsx before
<TextInput label='Amount' errorMessage={error} />
<SearchInput aria-invalid={hasError} />
```

```tsx after
<TextInput
  label='Amount'
  helperText={error}
  status={error ? 'error' : undefined}
/>
<SearchInput status={hasError ? 'error' : undefined} />
```

## Decide

- `errorMessage={x}` → `helperText={x}` plus `status='error'` when `x` is set.
  Keep a conditional `status` when the message is optional. Same props on
  React and React Native.
- Web: the error ring now comes only from `status='error'`, which also sets
  `aria-invalid`. Where `aria-invalid` (or native `:invalid` validation) was
  meant to show the error state, pass `status='error'` instead. An explicit
  `aria-invalid` now wins over `status`, so `aria-invalid={false}` next to
  `status='error'` reports a red input as valid: drop it unless it must
  differ from the visual state.
- Without `status`, `helperText` renders as a neutral hint.

## Verify

Typecheck passes and every `aria-invalid` hit is reviewed. Open forms in their
error state: the red ring and error text show under each invalid input. An
input with both `label` and `placeholder` now keeps its label floated and shows
the placeholder.
