---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(DotIcon, DotSymbol): apply getDotSize mapper pattern

Helpers like `mediaImageDotIconSizeMap` and `spotDotSizeMap` have been replaced with `getDotIconProps` and `getDotSymbolProps` resolver functions.

This pattern will make it consistent with the `getDotIndicatorProps` resolver introduced a few patches ago which affected the Avatar component's composition.

If you previously overlayed dot indicators on components like Spot and MediaImage, you might need to take action! See below:

## Migration

```tsx
// Before
import { mediaImageDotIconSizeMap } from '@ledgerhq/lumen-ui-rnative';
<DotIcon {...mediaImageDotIconSizeMap[parentSize]} />

// After
import { getDotIconProps } from '@ledgerhq/lumen-ui-rnative';
<DotIcon {...getDotIconProps('mediaImage', parentSize)} />
```

The same pattern applies to `getDotSymbolProps` for `DotSymbol`.
