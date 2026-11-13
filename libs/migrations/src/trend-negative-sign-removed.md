---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Trend.value'
    signal: visual # negative values render without the minus sign
    detect:
      - { pattern: '<Trend\b', expect: review }
      - { pattern: '-\d+\.\d{2}%', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Trend.value'
    signal: visual # negative values render without the minus sign
    detect:
      - { pattern: '<Trend\b', expect: review }
      - { pattern: '-\d+\.\d{2}%', expect: review }
pr: 838
---

## Before → after

```tsx before
render(<Trend value={-2.5} />);
expect(screen.getByText('-2.50%')).toBeVisible();
```

```tsx after
render(<Trend value={-2.5} />);
expect(screen.getByText('2.50%')).toBeVisible();
```

## Decide

`Trend` now renders the absolute value (`2.50%`, not `-2.50%`): the down
arrow and the error color carry the direction. Keep passing the signed
`value`. Update tests and snapshots that expect the minus sign. If a screen
puts the `Trend` next to copy or a label that depended on the sign, report it
rather than adding a sign back. Same on React Native.

## Verify

Review every `detect` hit. Tests pass; review snapshot diffs before updating
them. Open screens with a negative `Trend`: it shows the down arrow and no
minus sign.
