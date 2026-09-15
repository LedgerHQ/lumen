---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(DotIcon, DotSymbol): remove mediaImage size-map shims

`mediaImageDotIconSizeMap` and `mediaImageDotSizeMap` were temporary re-exports for `@ledgerhq/crypto-icons`. That package now uses `getDotIconProps` / `getDotSymbolProps`, so the shims are gone.

Use the resolvers instead:

```tsx
import { getDotIconProps } from '@ledgerhq/lumen-ui-react';
<DotIcon {...getDotIconProps('mediaImage', parentSize)} />
```

The same pattern applies to `getDotSymbolProps` for `DotSymbol`.
