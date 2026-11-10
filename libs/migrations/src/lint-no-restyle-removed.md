---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-lint-plugin/eslint#NO_RESTYLE_OPTIONS'
    signal: loud # a named import fails to load the config
    detect:
      - { pattern: '\bNO_RESTYLE_OPTIONS\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-lint-plugin/oxlint#NO_RESTYLE_OPTIONS'
    signal: loud
    detect:
      - { pattern: '\bNO_RESTYLE_OPTIONS\b' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-lint-plugin/eslint#configs.recommended'
    signal: silent # shadcn/no-restyle is no longer enabled
    detect:
      - { pattern: 'shadcn/no-restyle', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-lint-plugin/eslint#configs.strict'
    signal: silent
    detect:
      - { pattern: 'shadcn/no-restyle', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-lint-plugin/oxlint#configs.recommended'
    signal: silent
    detect:
      - { pattern: 'shadcn/no-restyle', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-lint-plugin/oxlint#configs.strict'
    signal: silent
    detect:
      - { pattern: 'shadcn/no-restyle', expect: review }
  - change: changed
    surface: module
    ref: '@ledgerhq/lumen-lint-plugin/oxlint/recommended.json'
    signal: silent
    detect:
      - { pattern: 'shadcn/no-restyle', expect: review }
  - change: changed
    surface: module
    ref: '@ledgerhq/lumen-lint-plugin/oxlint/strict.json'
    signal: silent
    detect:
      - { pattern: 'shadcn/no-restyle', expect: review }
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

```tsx before
<>
  {/* eslint-disable-next-line shadcn/no-restyle */}
  <Button className='bg-error-strong'>Delete</Button>
</>
```

```tsx after
<>
  <Button className='bg-error-strong'>Delete</Button>
</>
```

## Decide

The presets no longer enable `shadcn/no-restyle`. Default: delete the
`NO_RESTYLE_OPTIONS` import, the `shadcn/no-restyle` entry, and every
`eslint-disable` / `oxlint-disable` directive for it, which are now unused.

Keep the rule only if the team wants it. Then keep the directives and inline
the options you used; without `componentImports`, the rule no longer targets
Lumen components. The old `message` overrides only changed the report text.

```js
const rules = {
  'shadcn/no-restyle': ['warn', { allow: ['layout', 'spacing'], componentImports: ['^@ledgerhq/lumen-ui-react(/|$)'] }],
};
```

## Verify

Zero `NO_RESTYLE_OPTIONS` hits. Each `shadcn/no-restyle` hit is a rule the
team chose to keep, or a directive for it. ESLint and oxlint run without a
config error or unused-directive report.
