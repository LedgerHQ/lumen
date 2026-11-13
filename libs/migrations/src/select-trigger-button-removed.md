---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectTriggerButton'
    signal: loud
    detect:
      - { pattern: '\bSelectTriggerButton' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectTriggerButtonProps'
    signal: loud
pr: 641
---

## Before → after

```tsx before
import { SelectTrigger, SelectTriggerButton } from '@ledgerhq/lumen-ui-react';

<SelectTrigger
  render={(props) => (
    <SelectTriggerButton {...props} size='sm' label='All accounts' />
  )}
/>
```

```tsx after
import { SelectTrigger, MediaButton } from '@ledgerhq/lumen-ui-react';

<SelectTrigger
  render={({ selectedValue, selectedContent }) => (
    <MediaButton size='sm'>
      {selectedValue ? selectedContent : 'All accounts'}
    </MediaButton>
  )}
/>
```

## Decide

- Render `MediaButton` in the `render` function. Its children replace
  `label`: the selected content when `selectedValue` is set, the old `label`
  otherwise. Keep the other props (`size`, `appearance`, `icon`, `iconType`…)
  on `MediaButton`. Don't spread the render props into it.
- Where `SelectTriggerButtonProps` typed a wrapper that keeps `label`, use
  `Omit<MediaButtonProps, 'children'> & { label: string }`, plus
  `SelectTriggerRenderProps` if it takes `selectedValue` and
  `selectedContent`.

## Verify

Zero `detect` hits. Typecheck passes. Each select trigger shows its
placeholder, then the selected item after a pick.
