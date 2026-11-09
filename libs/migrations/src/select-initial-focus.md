---
changes:
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.autoFocusSearch'
    to: '@ledgerhq/lumen-ui-react#SelectContent.initialFocus'
    signal: loud
    detect:
      - { pattern: '\bautoFocusSearch\b' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.initialFocus'
    signal: silent # focus now moves into the content on open by default
    detect:
      - { pattern: '<SelectContent\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectItemData'
    signal: loud # the meta type must extend Record<string, unknown>
    detect:
      - { pattern: '\bSelectItemData<', expect: review }
pr: 648
---

## Before → after

```tsx before
interface NetworkMeta {
  chainId: number;
}
const items: SelectItemData<NetworkMeta>[] = networks;

<Select items={items}>
  <SelectTrigger label='Network' />
  <SelectContent autoFocusSearch>
    <SelectSearch />
    <SelectList renderItem={renderNetwork} />
  </SelectContent>
</Select>
```

```tsx after
type NetworkMeta = {
  chainId: number;
};
const items: SelectItemData<NetworkMeta>[] = networks;

<Select items={items}>
  <SelectTrigger label='Network' />
  <SelectContent>
    <SelectSearch />
    <SelectList renderItem={renderNetwork} />
  </SelectContent>
</Select>
```

## Decide

- `autoFocusSearch` → `initialFocus`. Since `true` is now the default, drop
  `autoFocusSearch` / `autoFocusSearch={true}`, and turn
  `autoFocusSearch={false}` into `initialFocus={false}`.
- Every `SelectContent` without the prop now moves focus on open, to the
  search input or the first item. Keep that (the default). Pass
  `initialFocus={false}` only where focus must stay on the trigger, for
  example a test that asserts it.
- The type passed to `SelectItemData<…>` (and `Select`, `SelectList`) must
  extend `Record<string, unknown>`. An `interface` doesn't: turn it into a
  `type` alias. Only interfaces used as a `SelectItemData` meta type need it.

## Verify

Zero `autoFocusSearch` hits. Typecheck passes. Open each select with the
keyboard: focus lands in the search or list, and arrow keys and Enter select
an item.
