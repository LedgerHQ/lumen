---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItem'
    signal: silent # renders a div; only items with onClick are interactive
    detect:
      - { pattern: '<ListItem\b(?![^>]*\bonClick=)[^>]*>', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#ListItem.ref'
    signal: loud # HTMLDivElement, and onClick receives a div mouse event
    detect:
      - { pattern: 'HTMLButtonElement', expect: review }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemContextValue'
    signal: loud
    detect:
      - { pattern: '\bListItemContextValue\b' }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemTitle'
    signal: visual # no longer flex-1
    detect:
      - { pattern: '<ListItem(Title|Description)\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItemDescription'
    signal: visual # no longer flex-1
    detect:
      - { pattern: '<ListItem(Title|Description)\b', expect: review }
pr: 633
---

## Before → after

```tsx before
import type { ListItemContextValue } from '@ledgerhq/lumen-ui-react';

const ref = useRef<HTMLButtonElement>(null);

<Link href='/settings'>
  <ListItem>
    <ListItemLeading>
      <ListItemContent>
        <ListItemTitle>Settings</ListItemTitle>
      </ListItemContent>
    </ListItemLeading>
  </ListItem>
</Link>
<ListItem ref={ref} type='button' onClick={openDetails}>
  …
</ListItem>
```

```tsx after
const ref = useRef<HTMLDivElement>(null);

<ListItem onClick={() => navigate('/settings')}>
  <ListItemLeading>
    <ListItemContent>
      <ListItemTitle>Settings</ListItemTitle>
    </ListItemContent>
  </ListItemLeading>
</ListItem>
<ListItem ref={ref} onClick={openDetails}>
  …
</ListItem>
```

## Decide

- `ListItem` renders a `div`. With `onClick` it gets `role='button'`, focus,
  keyboard activation and hover/pressed styles. Without it, it is static.
- Review each `ListItem` without `onClick`. A display-only item stays as is
  (the default). An item made clickable by a wrapper (link, menu item,
  clickable parent) loses its hover and pressed styles: move the action to
  `onClick` on the `ListItem` when you can, otherwise accept static styling.
- Type refs and handlers for `ListItem` as `HTMLDivElement`. Drop
  button-only props (`type`, `form`, `name`, `value`). Only change the
  `HTMLButtonElement` hits that belong to a `ListItem`.
- Remove `ListItemContextValue` imports; it had no public use.
- `ListItemTitle` and `ListItemDescription` no longer stretch. If a layout
  relied on them filling the row (e.g. a sibling pushed to the end), add
  `className='flex-1'` to them.

## Verify

Zero `ListItemContextValue` hits; every other `detect` hit reviewed.
Typecheck passes. Open lists: clickable items still respond to click and
keyboard with hover styles, static items don't, and titles line up as before.
