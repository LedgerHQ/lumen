---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectItemData'
    signal: loud # meta type moves to the second type argument
    detect:
      - { pattern: '\b(Select|SelectList|SelectItemData|SelectProps|SelectListProps)<(?![^>]*,)', expect: review }
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
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#OptionListItemData'
    signal: loud # meta type moves to the second type argument
    detect:
      - { pattern: '\b(OptionList|OptionListContent|OptionListItemData|OptionListItemGroup|OptionListProps|OptionListContentProps)<(?![^>]*,)', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#OptionListItemGroup'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#OptionListProps'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#OptionListContentProps'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#OptionList'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#OptionListContent'
    signal: loud
pr: 773
---

## Before → after

```tsx before
const items: SelectItemData<NetworkMeta>[] = networks;

<SelectList<NetworkMeta> renderItem={(item) => <NetworkItem item={item} />} />;
```

```tsx after
const items: SelectItemData<string, NetworkMeta>[] = networks;

<SelectList<string, NetworkMeta> renderItem={(item) => <NetworkItem item={item} />} />;
```

React Native:

```tsx before
const items: OptionListItemData<NetworkMeta>[] = networks;

<OptionListContent<NetworkMeta> renderItem={(item) => <NetworkItem item={item} />} />;
```

```tsx after
const items: OptionListItemData<string, NetworkMeta>[] = networks;

<OptionListContent<string, NetworkMeta> renderItem={(item) => <NetworkItem item={item} />} />;
```

## Decide

The `Select` (web) and `OptionList` (React Native) generics now take the value
type first, then the meta type. Move an explicit meta type argument to the
second slot and put `string` first. Use a value union instead of `string` only
where the app already has one. Usages without explicit type arguments need no
change.

## Verify

Typecheck passes; it is the authority, since `detect` misses meta types
containing a comma. Each `detect` hit passes a value type (not the meta type) as
its first argument.
