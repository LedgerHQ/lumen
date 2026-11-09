---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Card.disabled'
    signal: silent # Lumen children of a disabled Card now read it as disabled
    detect:
      - { pattern: '<Card\b[^>]*\bdisabled\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Card.disabled'
    signal: silent # Lumen children of a disabled Card now read it as disabled
    detect:
      - { pattern: '<Card\b[^>]*\bdisabled\b', expect: review }
pr: 574
---

## Before → after

```tsx before
<Card disabled>
  <CardContent>…</CardContent>
  <Button onClick={retry}>Retry</Button>
</Card>
```

```tsx after
<>
  <Card disabled>
    <CardContent>…</CardContent>
  </Card>
  <Button onClick={retry}>Retry</Button>
</>
```

React Native:

```tsx before
<Card disabled onPress={open}>
  <CardContent>…</CardContent>
  <Button onPress={retry}>Retry</Button>
</Card>
```

```tsx after
<>
  <Card disabled onPress={open}>
    <CardContent>…</CardContent>
  </Card>
  <Button onPress={retry}>Retry</Button>
</>
```

## Decide

On web and React Native, a disabled `Card` now passes `disabled` to every Lumen
component inside it that reads the disabled context (buttons, inputs, `Spot`,
`Tag`, icons, `ListItem`…). For each hit, check whether a child must stay usable
while the card is disabled. If so, move it out of the `Card`: `disabled={false}`
on the child doesn't override the card. If the child was already disabled or
purely decorative, leave the code as is (the default).

A `Card` without `disabled` now resets the context to enabled, so one nested in
a disabled `ListItem`, `Tile` or web `MenuItem` no longer passes that state on.
`detect` can't find these: pass `disabled` to the inner `Card` if its children
must stay disabled.

## Verify

Review every `detect` hit. Typecheck passes. Open the screens with disabled
cards: their children look disabled and the ones that must work still respond.
