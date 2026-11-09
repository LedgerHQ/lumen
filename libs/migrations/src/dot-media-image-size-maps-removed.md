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
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#mediaImageDotIconSizeMap'
    signal: loud
    detect:
      - { pattern: '\bmediaImageDotIconSizeMap\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#mediaImageDotSizeMap'
    signal: loud
    detect:
      - { pattern: '\bmediaImageDotSizeMap\b' }
  - change: changed
    surface: dependency
    ref: '@ledgerhq/crypto-icons'
    signal: silent # below 2.0.6 it imports the removed maps; CJS and Metro get undefined and crash at render
    detect:
      - { pattern: '"@ledgerhq/crypto-icons":\s*"[~^]?2\.0\.[0-5]\b', in: manifests }
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

```json before
"dependencies": {
  "@ledgerhq/crypto-icons": "^2.0.4"
}
```

```json after
"dependencies": {
  "@ledgerhq/crypto-icons": "^2.0.6"
}
```

## Decide

Replace each map lookup with the resolver for the same context and size,
spread on the dot. The second argument must be a size the resolver knows:
type a variable size as `MediaImageSize` for `getDotSymbolProps`.
`getDotIconProps('mediaImage', …)` only knows 40, 48, 56, 64 and 72, like
the old map: narrow the size to those, and keep the dot off smaller images.

React Native is the same code, imported from `@ledgerhq/lumen-ui-rnative`.

If you depend on `@ledgerhq/crypto-icons`, bump it to `^2.0.6` in the same
upgrade: older versions import the removed maps, and their peer range still
accepts the new Lumen.

## Verify

Zero `detect` hits. Typecheck and build pass. Dots on media images keep their
size.
