---
'@ledgerhq/lumen-utils-shared': patch
---

refactor: move cn to @ledgerhq/lumen-design-core/cn

**BREAKING CHANGE:** `cn` is no longer exported from `@ledgerhq/lumen-utils-shared`, and `clsx` and `tailwind-merge` are no longer its dependencies. Import `cn` from `@ledgerhq/lumen-design-core/cn` instead:

```ts
// Before
import { cn } from '@ledgerhq/lumen-utils-shared';

// After
import { cn } from '@ledgerhq/lumen-design-core/cn';
```

The new `cn` also merges Lumen classes correctly (text colors, typography, gradients), so a `className` override now wins where it used to depend on CSS order. If your code imports `clsx` or `tailwind-merge` directly, add them to your own dependencies.
