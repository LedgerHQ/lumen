---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-utils-shared#toPascalCase'
    signal: loud
    detect:
      - { pattern: '\btoPascalCase\b[^;]*from\s*[''"]@ledgerhq/lumen-utils-shared[''"]' }
pr: 856
---

## Before → after

```ts before
import { toPascalCase } from '@ledgerhq/lumen-utils-shared';
```

```ts after
export function toPascalCase(str: string): string {
  return str
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
```

## Decide

Lumen no longer exports `toPascalCase`. Define the helper above in the app
(in an existing string utils file if there is one) and import it from there.

## Verify

Zero `detect` hits. Typecheck passes.
