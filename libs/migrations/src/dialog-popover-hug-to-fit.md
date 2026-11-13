---
changes:
  - change: renamed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Dialog.height=hug'
    to: '@ledgerhq/lumen-ui-react#Dialog.height=fit'
    signal: loud
    detect:
      - { pattern: '\bheight=\{?["'']hug["'']' }
  - change: renamed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#PopoverContent.width=hug'
    to: '@ledgerhq/lumen-ui-react#PopoverContent.width=fit'
    signal: loud
    detect:
      - { pattern: '\bwidth=\{?["'']hug["'']' }
pr: 605
---

## Before → after

```tsx before
<Dialog height='hug'>…</Dialog>
<PopoverContent width='hug'>…</PopoverContent>
```

```tsx after
<Dialog height='fit'>…</Dialog>
<PopoverContent width='fit'>…</PopoverContent>
```

## Decide

Same behavior, new name. Also rename `'hug'` where it's typed as
`DialogHeight` or `PopoverWidth` (variables, maps, props passed through).
`fit` is the default, so you may drop the prop instead.

## Verify

Zero `detect` hits. Typecheck passes.
