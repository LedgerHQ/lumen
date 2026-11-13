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
  - change: renamed
    surface: module
    ref: '@ledgerhq/lumen-ui-react/TriggerButton'
    to: '@ledgerhq/lumen-ui-react/MediaButton'
    signal: loud
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#TriggerButton'
    to: '@ledgerhq/lumen-ui-rnative#MediaButton'
    signal: loud
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#TriggerButtonProps'
    to: '@ledgerhq/lumen-ui-rnative#MediaButtonProps'
    signal: loud
pr: 635
---

## Before → after

```tsx before
import { TriggerButton, type TriggerButtonProps } from '@ledgerhq/lumen-ui-react';

<TriggerButton icon={<Settings size={20} />} iconType='flat'>
  Network
</TriggerButton>;
```

```tsx after
import { MediaButton, type MediaButtonProps } from '@ledgerhq/lumen-ui-react';

<MediaButton icon={<Settings size={20} />} iconType='flat'>
  Network
</MediaButton>;
```

## Decide

Pure rename, props unchanged, in both `ui-react` and `ui-rnative`. Rename the
component and its props type everywhere, including imports and type
references. Deep imports from `@ledgerhq/lumen-ui-react/TriggerButton` move to
`/MediaButton`. Don't rename `SelectTriggerButton` to `SelectMediaButton`: it was
removed in the same release; follow `select-trigger-button-removed`.

## Verify

Zero `detect` hits. Typecheck passes.
