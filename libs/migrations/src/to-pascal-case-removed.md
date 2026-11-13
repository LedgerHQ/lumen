---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-utils-shared#toPascalCase'
    signal: loud
    detect:
      - { pattern: '(?:import|export)\s*(?:type\s*)?\{[^}]*\btoPascalCase\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-utils-shared[''"]' }
pr: 856
---

## Before → after

```ts before
import { toPascalCase } from '@ledgerhq/lumen-utils-shared';
```

```ts after
export function toPascalCase(str: string): string {
  if (!str) return '';
  return str
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
```

## Decide

Lumen no longer exports `toPascalCase`. Copy the removed helper above into the
app (in an existing string utils file if there is one) and import it from there.

## Verify

Zero `detect` hits. Typecheck passes.
