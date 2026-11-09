---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Button.type'
    signal: silent # inside a form, a click no longer submits it
    detect:
      - { pattern: '<Button\b(?![^>]*\btype=)', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#IconButton.type'
    signal: silent
    detect:
      - { pattern: '<IconButton\b(?![^>]*\btype=)', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaButton.type'
    signal: silent
    detect:
      - { pattern: '<MediaButton\b(?![^>]*\btype=)', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#CardButton.type'
    signal: silent
    detect:
      - { pattern: '<CardButton\b(?![^>]*\btype=)', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#BaseButton.type'
    signal: silent
    detect:
      - { pattern: '<BaseButton\b(?![^>]*\btype=)', expect: review }
pr: 826
---

## Before → after

```tsx before
<form onSubmit={save}>
  <TextInput label='Name' />
  <IconButton icon={Close} aria-label='Clear' onClick={clear} />
  <MediaButton leadingContent={<CryptoIcon ledgerId='bitcoin' />}>Bitcoin</MediaButton>
  <CardButton title='Ledger Nano X' onClick={pickDevice} />
  <BaseButton onClick={reset}>Reset</BaseButton>
  <Button>Save</Button>
</form>
```

```tsx after
<form onSubmit={save}>
  <TextInput label='Name' />
  <IconButton icon={Close} aria-label='Clear' onClick={clear} />
  <MediaButton leadingContent={<CryptoIcon ledgerId='bitcoin' />}>Bitcoin</MediaButton>
  <CardButton title='Ledger Nano X' onClick={pickDevice} />
  <BaseButton onClick={reset}>Reset</BaseButton>
  <Button type='submit'>Save</Button>
</form>
```

## Decide

These buttons now render `type="button"` unless you pass `type` (or use
`asChild`), so a click inside a `<form>` no longer submits it, and Enter in a
field no longer triggers them. Only hits inside a `<form>` matter. For each,
add `type='submit'` if the button is meant to submit the form (its click or
the form's `onSubmit` does the saving). Leave the others as is: the new default
is what they wanted. Outside a form, change nothing.

## Verify

Every `detect` hit inside a `<form>` is either the submit button, now with
`type='submit'`, or a button that must not submit. Typecheck passes. Submit
each form by clicking its button and by pressing Enter in a field.
