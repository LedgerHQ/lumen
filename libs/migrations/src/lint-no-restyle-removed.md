---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-lint-plugin/eslint#NO_RESTYLE_OPTIONS'
    signal: loud # the config fails to load
    detect:
      - { pattern: '\bNO_RESTYLE_OPTIONS\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-lint-plugin/oxlint#NO_RESTYLE_OPTIONS'
    signal: loud
    detect:
      - { pattern: '\bNO_RESTYLE_OPTIONS\b' }
pr: 942
---

## Before → after

```js before
import { NO_RESTYLE_OPTIONS } from '@ledgerhq/lumen-lint-plugin/eslint';

const rules = {
  'shadcn/no-restyle': ['warn', { ...NO_RESTYLE_OPTIONS, allow: ['layout', 'spacing'] }],
};
```

```js after
const rules = {};
```

## Decide

The presets no longer enable `shadcn/no-restyle`. Default: delete the
import and the `shadcn/no-restyle` entry built from it. Keep the rule only
if the team wants it, with its own options written inline.

## Verify

Zero `NO_RESTYLE_OPTIONS` hits. ESLint and oxlint run without a config
error.
