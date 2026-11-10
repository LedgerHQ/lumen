---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SegmentedControl'
    signal: silent # rest props now land on a wrapper around the radiogroup
    detect:
      - { pattern: '(?:get|query|find)(?:All)?ByRole\(\s*[''"]radiogroup[''"]\s*,\s*\{[^}]*\bname', expect: review }
      - { pattern: '\[role=[''"]?radiogroup', expect: review }
      - { pattern: '<SegmentedControl\b[^>]*\b(?:data-testid|id)=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SegmentedControl.className'
    signal: visual # styles a block wrapper, no longer the flex row of segments
    detect:
      - { pattern: '<SegmentedControl\b[^>]*\b(?:className=[^>]*\b(?:gap|justify|items|h)-|style=)', expect: review }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#SegmentedControl.tabLayout=fit'
    signal: visual # the background no longer hugs the segments in a block parent
    detect:
      - { pattern: '\btabLayout=\{?[''"]fit', expect: review }
pr: 842
---

## Before → after

```tsx before
<SegmentedControl aria-label='Period' data-testid='period' className='period-switch h-48' tabLayout='fit' selectedValue={period} onSelectedChange={setPeriod}>
  <SegmentedControlButton value='week'>Week</SegmentedControlButton>
  <SegmentedControlButton value='month'>Month</SegmentedControlButton>
</SegmentedControl>;

await user.click(within(screen.getByRole('radiogroup', { name: 'Period' })).getByRole('radio', { name: 'Month' }));
cy.get('[role="radiogroup"].period-switch');
```

```tsx after
<SegmentedControl aria-label='Period' data-testid='period' className='period-switch w-fit max-w-full' tabLayout='fit' selectedValue={period} onSelectedChange={setPeriod}>
  <SegmentedControlButton value='week' className='h-48'>
    Week
  </SegmentedControlButton>
  <SegmentedControlButton value='month' className='h-48'>
    Month
  </SegmentedControlButton>
</SegmentedControl>;

await user.click(within(screen.getByLabelText('Period')).getByRole('radio', { name: 'Month' }));
cy.get('.period-switch [role="radiogroup"]');
```

## Decide

`SegmentedControl` now wraps its `role="radiogroup"` element in a block scroll
container. `className`, `style`, `aria-*`, `data-*`, `id` and event handlers
land on that wrapper, so the radiogroup loses its accessible name.

- Tests and e2e selectors that find the radiogroup by name, class, `id` or
  test id: scope through the wrapper (`within(getByLabelText(…))`,
  `getByTestId`, `.class [role="radiogroup"]`) or query the radios directly.
- Visual classes (background, radius, margin, width) still apply: leave them.
  Flex and height utilities (`gap-`, `justify-`, `items-`, `h-`) and `style`
  no longer reach the segment row. Move height onto each
  `SegmentedControlButton`; drop the rest or move it onto the buttons.
- `tabLayout='fit'`: the background used to hug the segments
  (`inline-flex`). It now stretches like a block, e.g. to a block parent's
  full width. Add `w-fit max-w-full` where it should hug; `max-w-full` keeps
  the overflow scroll.
- Web tests: it now uses `ResizeObserver` unguarded. If your jsdom setup
  lacks it, stub it in the test setup file.

## Verify

Review every `detect` hit. Tests rendering a `SegmentedControl` pass. `fit`
controls and controls with a custom height look as before.
