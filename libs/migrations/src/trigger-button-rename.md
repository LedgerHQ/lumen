---
changes:
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ButtonTrigger'
    to: '@ledgerhq/lumen-ui-react#TriggerButton'
    signal: loud
    detect:
      - { pattern: '\bButtonTrigger' }
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ButtonTriggerProps'
    to: '@ledgerhq/lumen-ui-react#TriggerButtonProps'
    signal: loud
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectButtonTrigger'
    to: '@ledgerhq/lumen-ui-react#SelectTriggerButton'
    signal: loud
    detect:
      - { pattern: '\bSelectButtonTrigger' }
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectButtonTriggerProps'
    to: '@ledgerhq/lumen-ui-react#SelectTriggerButtonProps'
    signal: loud
  - change: renamed
    surface: module
    ref: '@ledgerhq/lumen-ui-react/ButtonTrigger'
    to: '@ledgerhq/lumen-ui-react/TriggerButton'
    signal: loud
pr: 570
---

## Before → after

```tsx before
import { ButtonTrigger, SelectButtonTrigger } from '@ledgerhq/lumen-ui-react';

<ButtonTrigger icon={<Settings size={20} />}>Network</ButtonTrigger>
<SelectTrigger render={(props) => <SelectButtonTrigger {...props} label='Network' />} />
```

```tsx after
import { TriggerButton, SelectTriggerButton } from '@ledgerhq/lumen-ui-react';

<TriggerButton icon={<Settings size={20} />}>Network</TriggerButton>
<SelectTrigger render={(props) => <SelectTriggerButton {...props} label='Network' />} />
```

## Decide

Pure rename, props unchanged. Rename the components and their `…Props` types
everywhere, including imports and type references. Deep imports from
`@ledgerhq/lumen-ui-react/ButtonTrigger` move to `/TriggerButton`;
`SelectTriggerButton` stays in `/Select`.

## Verify

Zero `detect` hits. Typecheck passes.
