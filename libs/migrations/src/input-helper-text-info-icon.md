---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.helperText'
    signal: visual # a helperText without status now has a leading info icon
    detect:
      - pattern: '<(TextInput|AddressInput|SearchInput|BaseInput)\b(?:[^>]|=>)*?\bhelperText='
        expect: review
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#TextInput.helperText'
    signal: visual # same leading info icon on React Native
    detect:
      - pattern: '<(TextInput|AddressInput|SearchInput)\b(?:[^>]|=>)*?\bhelperText='
        expect: review
pr: 794
---

## Before → after

```tsx before
<TextInput label='Account name' helperText='Visible only to you' />
```

```tsx after
<TextInput label='Account name' helperText='Visible only to you' />
```

## Decide

A `helperText` whose `status` is unset now renders an `InformationFill` icon
before the text, on web (`TextInput`, `AddressInput`, `SearchInput`,
`BaseInput`) and React Native (`TextInput`, `AddressInput`, `SearchInput`).
`status` only takes `'error'` or `'success'`, so a conditional status such as
`status={invalid ? 'error' : undefined}` also shows the icon when it resolves
to `undefined`. Errors and successes are unchanged. Keep the code as is (the
default): the icon is the new design. Act only where the hint sits in a tight
layout that the icon breaks, or where the app already prepends its own info
icon to the text: remove the app's icon.

## Verify

Review every `detect` hit whose `status` can be unset at runtime, and inputs
that get `helperText` through a spread or a props object, which `detect`
misses. Look at forms with neutral hints: one info icon each, the text still
fits.
