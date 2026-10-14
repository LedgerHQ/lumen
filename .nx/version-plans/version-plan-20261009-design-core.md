---
'@ledgerhq/lumen-design-core': patch
---

feat(responsive): export `breakpoints`, `Breakpoint` and `ResponsiveValue`

`breakpoints` exposes the breakpoint min-widths (px) from the layout primitives, and the
Tailwind screens plugin is now derived from it.

```ts
import { breakpoints, type Breakpoint, type ResponsiveValue } from '@ledgerhq/lumen-design-core';

breakpoints.md; // 768
```
