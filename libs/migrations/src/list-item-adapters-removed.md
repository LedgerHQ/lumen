---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemSpot'
    signal: loud
    detect:
      - { pattern: '\bListItemSpot(Props)?\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemIcon'
    signal: loud
    detect:
      - { pattern: '\bListItemIcon(Props)?\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemTruncate'
    signal: loud
    detect:
      - { pattern: '\bListItemTruncate(Props)?\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemSpotProps'
    signal: loud
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemIconProps'
    signal: loud
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemTruncateProps'
    signal: loud
pr: 595
---

## Before → after

```tsx before
<ListItem>
  <ListItemLeading>
    <ListItemSpot appearance='icon' icon={Wallet} />
    <ListItemContent>
      <ListItemTitle className='flex gap-8'>
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
  inherits `disabled` from the `ListItem`. `ListItemSpotProps` → `SpotProps`.
- `ListItemIcon icon={X}` → `<X size={24} />`, keeping `className` (it now
  lands on the icon, not a wrapper `div`). Icons take the disabled color from
  the `ListItem`. `ListItemIconProps` has no replacement.
- `ListItemTruncate` inside a `ListItemTitle` or `ListItemDescription` →
  `ListItemContentRow` wrapping that title or description (with the truncated
  text as its child) next to the inline elements. Drop `flex` from the old
  wrapper; the row has `gap-8` built in, so keep a `gap-*` class on the row only
  for a different spacing. A `ListItemTruncate` with no sibling just goes away:
  titles and descriptions truncate by themselves. `ListItemTruncateProps` has
  no replacement.
- Inside `ListItemTrailing`, the row isn't right-aligned like the old title or
  description was. Add `className='justify-end'` to the row, and
  `className='flex-initial'` to a title or description that follows an inline
  element, so both stay against the right edge.

## Verify

Zero `detect` hits outside React Native code. Typecheck passes. List items
with a spot, an icon or an inline tag look the same, and long titles still
truncate.
