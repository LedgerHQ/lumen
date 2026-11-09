---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#spotDotIconSizeMap'
    signal: loud
    detect:
      - { pattern: '\bspotDotIconSizeMap\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#spotDotSizeMap'
    signal: loud
    detect:
      - { pattern: '\bspotDotSizeMap\b' }
pr: 860
---

## Before → after

```tsx before
import { DotIcon, DotSymbol, spotDotIconSizeMap, spotDotSizeMap } from '@ledgerhq/lumen-ui-react';

<DotIcon size={spotDotIconSizeMap[48]} appearance='success' icon={Check} />
<DotSymbol size={spotDotSizeMap[48]} src={network} />
```

```tsx after
import { DotIcon, DotSymbol, getDotIconProps, getDotSymbolProps } from '@ledgerhq/lumen-ui-react';

<DotIcon {...getDotIconProps('spot', 48)} appearance='success' icon={Check} />
<DotSymbol {...getDotSymbolProps('spot', 48)} src={network} />
```

## Decide

Replace each map lookup with the resolver for the same context and size,
spread on the dot. The second argument must be a size the resolver knows:
type a variable size as `SpotSize` for `getDotSymbolProps`.
`getDotIconProps('spot', …)` has no entry for 32, like the old map: exclude
32 from the size type and keep the dot off 32px spots.

## Verify

Zero `detect` hits. Typecheck passes. Dots on spots keep their size.
