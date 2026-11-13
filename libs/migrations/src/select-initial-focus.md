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
<SelectContent autoFocusSearch>
  <SelectSearch />
  <SelectList renderItem={renderNetwork} />
</SelectContent>
```

```tsx after
<SelectContent>
  <SelectSearch />
  <SelectList renderItem={renderNetwork} />
</SelectContent>
```

```tsx before
interface NetworkMeta {
  chainId: number;
}
type NetworkItem = SelectItemData<NetworkMeta>;
```

```tsx after
type NetworkMeta = {
  chainId: number;
};
type NetworkItem = SelectItemData<NetworkMeta>;
```

## Decide

- `autoFocusSearch` → `initialFocus`. Since `true` is now the default, drop `autoFocusSearch` /
  `autoFocusSearch={true}`, and turn `autoFocusSearch={false}` into
  `initialFocus={false}`. One difference: on touch, the old prop focused the
  popup to keep the virtual keyboard closed, while `true` focuses the search
  input. Where that matters, pass `initialFocus={false}`.
- Every `SelectContent` without the prop now moves focus on open, to the
  first tabbable element in the content (normally `SelectSearch`), or to the
  popup itself when there is none. Keep that (the default). Pass
  `initialFocus={false}` only where focus must stay on the trigger, for
  example a test that asserts it.
- The meta type passed to `SelectItemData<…>` must extend
  `Record<string, unknown>`. Turn an `interface` into a `type` alias, and
  wrap a primitive or `unknown` meta in an object type.

## Verify

Zero `autoFocusSearch` hits. Typecheck passes. Open each select with a
`SelectSearch` from the keyboard: focus lands in the search, and arrow keys
and Enter select an item.
