---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TextInput.helperText'
    signal: visual # a helperText without status now has a leading info icon
    detect:
      - pattern: '<(TextInput|AddressInput|SearchInput|BaseInput)\b[^>]*\bhelperText='
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

A `helperText` with no `status` now renders an `InformationFill` icon before
the text, in every input built on `BaseInput` (`TextInput`, `AddressInput`,
`SearchInput`). Errors and successes are unchanged. Keep the code as is (the
default): the icon is the new design. Act only where the hint sits in a tight
layout that the icon breaks, or where the app already prepends its own info
icon to the text: remove the app's icon.

## Verify

Review every `detect` hit without a `status`. Look at forms with neutral
hints: one info icon each, the text still fits.
