---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.errorMessage'
    signal: loud
    detect:
      - { pattern: '\berrorMessage=' }
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
      - { pattern: '<(TextInput|SearchInput|AddressInput|BaseInput|SelectSearch)\b[^>]*\baria-invalid', expect: review }
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
  Keep a conditional `status` when the message is optional.
- The error ring now comes only from `status='error'`, which also sets
  `aria-invalid`. Where `aria-invalid` (or native `:invalid` validation) was
  meant to show the error state, pass `status='error'` and drop
  `aria-invalid` if it only mirrored that state. Keep it only to decouple
  accessibility from the visual state.
- Without `status`, `helperText` renders as a neutral hint.

## Verify

Zero `errorMessage=` hits on Lumen inputs and every `aria-invalid` hit
reviewed. Typecheck passes. Open forms in their error state: the red ring and
error text show under each invalid input.
