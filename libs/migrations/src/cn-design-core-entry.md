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
    signal: visual # a className override now replaces the component's class
    detect:
      - { pattern: 'className=[^>]*\b(?:heading-\d|body-\d|responsive-display-\d|bg-gradient|rounded-xxs)', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-lint-plugin/eslint#configs'
    signal: silent # lint, not the build, now errors on clsx, tailwind-merge and classnames imports
    detect:
      - { pattern: 'from\s*[''"]classnames[''"]', expect: review }
  - change: changed
    surface: module
    ref: '@ledgerhq/lumen-lint-plugin/oxlint/recommended.json'
    signal: silent
    detect:
      - { pattern: 'from\s*[''"]classnames[''"]', expect: review }
  - change: changed
    surface: module
    ref: '@ledgerhq/lumen-lint-plugin/oxlint/strict.json'
    signal: silent
    detect:
      - { pattern: 'from\s*[''"]classnames[''"]', expect: review }
  - change: required
    surface: dependency
    ref: '@ledgerhq/lumen-design-core'
    signal: silent # new peer of the lint plugin; npm installs it when missing
    detect:
      - { pattern: '"@ledgerhq/lumen-lint-plugin"', in: manifests, expect: review }
pr: 909
---

## Before → after

```tsx before
import { cn } from '@ledgerhq/lumen-utils-shared';
import classNames from 'classnames';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

<Link className={cn('w-full', compact && 'body-3')} href={href} />
<div className={clsx('flex', isOpen && 'gap-8')} />
<div className={classNames('flex', { hidden: !visible })} />
<div className={twMerge('p-8', className)} />
```

```tsx after
import { cn } from '@ledgerhq/lumen-design-core/cn';

<Link className={cn('w-full', compact && 'body-3')} href={href} />
<div className={cn('flex', isOpen && 'gap-8')} />
<div className={cn('flex', { hidden: !visible })} />
<div className={cn('p-8', className)} />
```

## Decide

- Import `cn` from `@ledgerhq/lumen-design-core/cn`. Each package doing so
  needs `@ledgerhq/lumen-design-core` in its own `dependencies` (web apps
  already have it as a `@ledgerhq/lumen-ui-react` peer). The subpath exists
  only in `exports`, so TypeScript needs `moduleResolution` `bundler`,
  `node16` or `nodenext`.
- `@ledgerhq/lumen-ui-react` no longer requires `clsx` and `tailwind-merge`
  as peers; `@ledgerhq/lumen-design-core` now depends on them, with
  `tailwind-merge` v3. Default: replace direct `clsx`, `twMerge` and
  `classnames` calls with `cn`. Keep one only where its API is needed (e.g. a
  custom `extendTailwindMerge`, checked against the v3 API): keep it in that
  package's `package.json` and add
  `// eslint-disable-next-line no-restricted-imports` above the import.
- The lint plugin now has `@ledgerhq/lumen-design-core` as a peer; add it
  where the plugin is installed without it. A project with its own
  `no-restricted-imports` entry replaces the presets' one: spread
  `NO_RESTRICTED_IMPORTS_OPTIONS.paths` (from `/eslint` or `/oxlint`) into it.
- `cn` now knows Lumen classes, so these `className` overrides replace the
  component's class instead of depending on CSS order: `body-*`, `heading-*`
  and `responsive-display-*` typography; `text-base`, now a text color, so a
  `text-<color>` override wins over it; `rounded-xxs` against other radii. A
  `bg-gradient-*` next to a `bg-<color>` is now kept instead of dropped. Keep
  the override if it is intended; drop it if it was dead code that never
  applied.

## Verify

No `cn` import from `@ledgerhq/lumen-utils-shared` remains. Every `clsx`,
`tailwind-merge` or `classnames` import is replaced, or declared and
lint-disabled. Typecheck and lint pass. Look at screens where Lumen
components get typography, text color, radius or gradients through
`className`.
