---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemSpot'
    signal: loud
    detect:
      - { pattern: '\bListItemSpot\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemIcon'
    signal: loud
    detect:
      - { pattern: '\bListItemIcon\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemTruncate'
    signal: loud
    detect:
      - { pattern: '\bListItemTruncate\b' }
pr: 595
---

## Before → after

```tsx before
<ListItem>
  <ListItemLeading>
    <ListItemSpot appearance='icon' icon={Wallet} />
    <ListItemContent>
      <ListItemTitle className='flex gap-6'>
        <ListItemTruncate>Balance</ListItemTruncate>
        <Tag size='sm' label='New' appearance='base' />
      </ListItemTitle>
    </ListItemContent>
  </ListItemLeading>
  <ListItemTrailing>
    <ListItemIcon className='text-muted' icon={ChevronRight} />
  </ListItemTrailing>
</ListItem>
```

```tsx after
<ListItem>
  <ListItemLeading>
    <Spot size={48} appearance='icon' icon={Wallet} />
    <ListItemContent>
      <ListItemContentRow>
        <ListItemTitle>Balance</ListItemTitle>
        <Tag size='sm' label='New' appearance='base' />
      </ListItemContentRow>
    </ListItemContent>
  </ListItemLeading>
  <ListItemTrailing>
    <ChevronRight size={24} className='text-muted' />
  </ListItemTrailing>
</ListItem>
```

## Decide

- `ListItemSpot` → `Spot` with the same props and `size={48}`. It still
  inherits `disabled` from the `ListItem`.
- `ListItemIcon icon={X}` → `<X size={24} />`, keeping `className`. Icons
  inherit `disabled` too.
- `ListItemTruncate` inside a `ListItemTitle` or `ListItemDescription` →
  `ListItemContentRow` wrapping that title or description (with the truncated
  text as its child) next to the inline elements. Drop the layout classes
  (`flex gap-*`) the old wrapper needed. A `ListItemTruncate` with no sibling
  just goes away: titles and descriptions truncate by themselves.

## Verify

Zero `detect` hits. Typecheck passes. List items with a spot, an icon or an
inline tag look the same, and long titles still truncate.
