---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(DotIcon, DotSymbol): apply getDotSize mapper pattern

Helpers like `mediaImageDotIconSizeMap` and `spotDotSizeMap` have been replaced with `getDotIconProps` and `getDotSymbolProps` resolver functions.

This pattern will make it consistent with the `getDotIndicatorProps` resolver introduced a few patches ago which affected the Avatar component's composition.

If you previously overlaid dot indicators on components like Spot and MediaImage, you might need to take action! See below:

## Migration

```tsx
// Before
import { mediaImageDotIconSizeMap } from '@ledgerhq/lumen-ui-rnative';
<DotIcon size={mediaImageDotIconSizeMap[48]} />

// After
import { getDotIconProps } from '@ledgerhq/lumen-ui-rnative';
<DotIcon {...getDotIconProps('mediaImage', 48)} />
```

The same pattern applies to `getDotSymbolProps` for `DotSymbol`.
