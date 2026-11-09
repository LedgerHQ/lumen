---
changes:
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-utils-shared#cn'
    to: '@ledgerhq/lumen-design-core/cn#cn'
    signal: loud
    detect:
      - { pattern: 'import\s*\{[^}]*\bcn\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-utils-shared[''"]' }
  - change: removed
    surface: dependency
    ref: 'clsx'
    signal: silent # still resolves through design-core when hoisted
    detect:
      - { pattern: 'from\s*[''"]clsx[''"]', expect: review }
  - change: removed
    surface: dependency
    ref: 'tailwind-merge'
    signal: silent # may now resolve to v3, hoisted from design-core
    detect:
      - { pattern: 'from\s*[''"]tailwind-merge[''"]', expect: review }
  - change: changed
    surface: module
    ref: '@ledgerhq/lumen-ui-react'
    signal: visual # a className override of Lumen typography now wins
    detect:
      - { pattern: 'className=[^>]*\b(?:heading|body|responsive-display)-\d', expect: review }
pr: 909
---

## Before → after

```tsx before
import { cn } from '@ledgerhq/lumen-utils-shared';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

<Link className={cn('w-full', compact && 'body-3')} href={href} />
<div className={clsx('flex', isOpen && 'gap-8')} />
<div className={twMerge('p-8', className)} />
```

```tsx after
import { cn } from '@ledgerhq/lumen-design-core/cn';

<Link className={cn('w-full', compact && 'body-3')} href={href} />
<div className={cn('flex', isOpen && 'gap-8')} />
<div className={cn('p-8', className)} />
```

## Decide

- Import `cn` from `@ledgerhq/lumen-design-core/cn`. Each package doing so
  needs `@ledgerhq/lumen-design-core` in its own `dependencies` (web apps
  already have it as a `@ledgerhq/lumen-ui-react` peer).
- Lumen no longer brings `clsx` or `tailwind-merge` (`tailwind-merge` there
  is now v3). Default: replace direct `clsx`, `twMerge` and `classnames`
  calls with `cn`. Keep one only where its API is needed (e.g. a custom
  `extendTailwindMerge`), and declare it in that package's `package.json`.
- `cn` now knows Lumen classes: a `body-*`, `heading-*` or `text-*` size
  passed in `className` replaces the component's own typography instead of
  depending on CSS order. Keep the override if it is intended; drop it if it
  was dead code that never applied.

## Verify

No `cn` import from `@ledgerhq/lumen-utils-shared` remains. Every `clsx` or
`tailwind-merge` import is replaced or declared. Typecheck and lint pass.
Look at screens where Lumen components get typography through `className`.
