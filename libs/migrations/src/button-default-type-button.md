---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Button.type'
    signal: silent # inside a form, a click no longer submits it
    detect:
      - { pattern: '<Button\b(?!(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\btype=)', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#IconButton.type'
    signal: silent
    detect:
      - { pattern: '<IconButton\b(?!(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\btype=)', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaButton.type'
    signal: silent
    detect:
      - { pattern: '<MediaButton\b(?!(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\btype=)', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#CardButton.type'
    signal: silent
    detect:
      - { pattern: '<CardButton\b(?!(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\btype=)', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#BaseButton.type'
    signal: silent
    detect:
      - { pattern: '<BaseButton\b(?!(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\btype=)', expect: review }
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
`asChild`), so clicking them no longer submits a form, and Enter in a field
no longer triggers them. A hit matters if the button can submit a form: it
sits inside a `<form>` or a `<Form>` wrapper (also when that form is in a
parent component), or its `form` attribute points at a form by id. Also check
aliased imports and local wrappers around these components, which the
patterns miss.

Add `type='submit'` when the button is how the form gets submitted: through
its `onSubmit`, its `action` or the button's own `formAction`. Leave a button
whose `onClick` does the work on its own, and every other hit, as is: the new
default is what they wanted.

## Verify

Every button that can submit a form is either its submit button, now with
`type='submit'`, or a button that must not submit. Typecheck passes. Submit
each form by clicking its button and by pressing Enter in a field.
