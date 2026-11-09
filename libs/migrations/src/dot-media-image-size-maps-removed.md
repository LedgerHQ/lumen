---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#mediaImageDotIconSizeMap'
    signal: loud
    detect:
      - { pattern: '\bmediaImageDotIconSizeMap\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#mediaImageDotSizeMap'
    signal: loud
    detect:
      - { pattern: '\bmediaImageDotSizeMap\b' }
pr: 868
---

## Before → after

```tsx before
import { DotIcon, DotSymbol, mediaImageDotIconSizeMap, mediaImageDotSizeMap } from '@ledgerhq/lumen-ui-react';

<DotIcon size={mediaImageDotIconSizeMap[48]} appearance='success' icon={Check} />
<DotSymbol size={mediaImageDotSizeMap[48]} src={network} />
```

```tsx after
import { DotIcon, DotSymbol, getDotIconProps, getDotSymbolProps } from '@ledgerhq/lumen-ui-react';

<DotIcon {...getDotIconProps('mediaImage', 48)} appearance='success' icon={Check} />
<DotSymbol {...getDotSymbolProps('mediaImage', 48)} src={network} />
```

## Decide

Replace each map lookup with the resolver for the same context and size,
spread on the dot. The second argument must be a size the resolver knows:
type a variable size as `MediaImageSize` for `getDotSymbolProps`.
`getDotIconProps('mediaImage', …)` only knows 40, 48, 56, 64 and 72, like
the old map: narrow the size to those, and keep the dot off smaller images.

## Verify

Zero `detect` hits. Typecheck passes. Dots on media images keep their size.
