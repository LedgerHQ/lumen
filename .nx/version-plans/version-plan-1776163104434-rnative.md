---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(ui-rnative): rename `TriggerButton` to `MediaButton`

The `TriggerButton` component has been renamed to `MediaButton`. If you make use of it, you must update its name and respective import.

```diff
- import { TriggerButton } from '@ledgerhq/lumen-ui-rnative';
+ import { MediaButton } from '@ledgerhq/lumen-ui-rnative';

- <TriggerButton size='sm' icon={<Star size={20} />} iconType='flat'>
-   Small
- </TriggerButton>
+ <MediaButton size='sm' icon={<Star size={20} />} iconType='flat'>
+   Small
+ </MediaButton>
```

Additionally, the `hideChevron` prop is now available, referring to hiding the icon at the very end of the component.
