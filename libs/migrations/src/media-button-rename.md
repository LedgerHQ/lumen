---
changes:
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#TriggerButton'
    to: '@ledgerhq/lumen-ui-react#MediaButton'
    signal: loud
    detect:
      - { pattern: '\bTriggerButton' }
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#TriggerButtonProps'
    to: '@ledgerhq/lumen-ui-react#MediaButtonProps'
    signal: loud
pr: 635
---

## Before → after

```tsx before
import { TriggerButton, type TriggerButtonProps } from '@ledgerhq/lumen-ui-react';

<TriggerButton icon={<Settings size={20} />} iconType='flat'>
  Network
</TriggerButton>
```

```tsx after
import { MediaButton, type MediaButtonProps } from '@ledgerhq/lumen-ui-react';

<MediaButton icon={<Settings size={20} />} iconType='flat'>
  Network
</MediaButton>
```

## Decide

Pure rename, props unchanged. Rename the component and its props type
everywhere, including imports and type references. `SelectTriggerButton` is a
separate change: leave it to its own migration.

## Verify

Zero `detect` hits. Typecheck passes.
