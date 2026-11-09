---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectItemData'
    signal: loud # meta type moves to the second type argument
    detect:
      - { pattern: '\b(Select|SelectList|SelectItemData|SelectProps|SelectListProps)<\s*[A-Z]\w*\s*>', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectProps'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectListProps'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Select'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectList'
    signal: loud
pr: 773
---

## Before → after

```tsx before
const items: SelectItemData<NetworkMeta>[] = networks;

<SelectList<NetworkMeta> renderItem={(item) => <NetworkItem item={item} />} />
```

```tsx after
const items: SelectItemData<string, NetworkMeta>[] = networks;

<SelectList<string, NetworkMeta> renderItem={(item) => <NetworkItem item={item} />} />
```

## Decide

The `Select` generics now take the value type first, then the meta type. Move
an explicit meta type argument to the second slot and put `string` first. Use
a value union instead of `string` only where the app already has one. Usages
without explicit type arguments need no change.

## Verify

Typecheck passes. Each `detect` hit passes a value type (not the meta type) as
its first argument.
