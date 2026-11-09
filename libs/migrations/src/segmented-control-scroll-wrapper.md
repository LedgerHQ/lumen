---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SegmentedControl.aria-label'
    signal: silent # rest props now land on a wrapper around the radiogroup
    detect:
      - { pattern: 'getByRole\(\s*[''"]radiogroup[''"]\s*,\s*\{\s*name', expect: review }
      - { pattern: '\[role=[''"]?radiogroup', expect: review }
pr: 842
---

## Before → after

```tsx before
<SegmentedControl aria-label='Period' selectedValue={period} onSelectedChange={setPeriod}>
  <SegmentedControlButton value='week'>Week</SegmentedControlButton>
  <SegmentedControlButton value='month'>Month</SegmentedControlButton>
</SegmentedControl>;

await user.click(
  within(screen.getByRole('radiogroup', { name: 'Period' })).getByRole('radio', { name: 'Month' }),
);
cy.get('[role="radiogroup"].period-switch');
```

```tsx after
<SegmentedControl aria-label='Period' selectedValue={period} onSelectedChange={setPeriod}>
  <SegmentedControlButton value='week'>Week</SegmentedControlButton>
  <SegmentedControlButton value='month'>Month</SegmentedControlButton>
</SegmentedControl>;

await user.click(screen.getByRole('radio', { name: 'Month' }));
cy.get('.period-switch [role="radio"]');
```

## Decide

`SegmentedControl` now wraps its `role="radiogroup"` element in a scroll
container. `className`, `aria-*`, `data-*`, `id` and event handlers land on
that wrapper, so the radiogroup loses its accessible name. Keep the props in
the code as is. Fix only what relied on them sitting on the radiogroup: tests
or e2e selectors that find the radiogroup by name, class, `id` or test id.
Query the radios directly, or scope through the wrapper (`getByTestId`,
`.class [role="radio"]`). CSS on `className` now styles the outer box, which
is the visible one, so leave it.

## Verify

Review every `detect` hit, plus tests and e2e selectors that target a
`SegmentedControl` by `className`, `id` or `data-testid`. Tests pass.
