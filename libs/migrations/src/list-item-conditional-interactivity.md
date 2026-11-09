---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#ListItem'
    signal: silent # renders a div; only items with onClick are interactive
    detect:
      - { pattern: '<ListItem\b(?![^>]*\bon(Click|Press|LongPress)=)[^>]*>', expect: review }
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
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#ListItem'
    signal: silent # renders a static Box unless onPress or onLongPress is set
    detect:
      - { pattern: '<ListItem\b(?![^>]*\bon(Click|Press|LongPress)=)[^>]*>', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#ListItemProps'
    signal: loud # View props instead of Pressable props
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#ListItemContextValue'
    signal: loud
    detect:
      - { pattern: '\bListItemContextValue\b' }
pr: 633
---

## Before → after

Web (`@ledgerhq/lumen-ui-react`):

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
<div onClick={selectAccount}>
  <ListItem>…</ListItem>
</div>
<ListItem ref={ref} type='button' onClick={openDetails}>
  …
</ListItem>
```

```tsx after
const ref = useRef<HTMLDivElement>(null);

<Link href='/settings'>
  <ListItem>
    <ListItemLeading>
      <ListItemContent>
        <ListItemTitle>Settings</ListItemTitle>
      </ListItemContent>
    </ListItemLeading>
  </ListItem>
</Link>
<ListItem onClick={selectAccount}>…</ListItem>
<ListItem ref={ref} onClick={openDetails}>
  …
</ListItem>
```

React Native (`@ledgerhq/lumen-ui-rnative`):

```tsx before
import type { ListItemContextValue } from '@ledgerhq/lumen-ui-rnative';

<ListItem onPress={openDetails} hapticFeedback>
  …
</ListItem>;
```

```tsx after
import { triggerHapticFeedback } from '@ledgerhq/lumen-ui-rnative';

<ListItem
  onPress={() => {
    triggerHapticFeedback('medium');
    openDetails();
  }}
>
  …
</ListItem>;
```

## Decide

Apply web guidance to `@ledgerhq/lumen-ui-react` imports and RN guidance to
`@ledgerhq/lumen-ui-rnative` imports.

Web:

- `ListItem` renders a `div`. With `onClick` it gets `role='button'`, focus,
  Enter/Space activation and hover/pressed styles. Without it, it is static.
- Review each `ListItem` without `onClick`. A display-only item stays as is
  (the default). A navigation item keeps its link wrapper (an `onClick` item
  is not a link) and accepts static styling. An item made clickable by a
  button-like parent (menu item, clickable `div`) loses its hover and pressed
  styles: move the action to `onClick` on the `ListItem`.
- If a `ListItem` with `onClick` also passes `onKeyDown`, it replaces the
  built-in Enter/Space handler: call the action there too. On keyboard
  activation `onClick` gets a keyboard event, so don't read mouse-only fields
  (`clientX`, `button`).
- Type refs and handlers for `ListItem` as `HTMLDivElement`. Drop
  button-only props (`type`, `form`, `name`, `value`). Only change the
  `HTMLButtonElement` hits that belong to a `ListItem`.
- `ListItemTitle` and `ListItemDescription` no longer stretch. If a layout
  relied on them filling the row (e.g. a sibling pushed to the end), add
  `className='flex-1'` to them.

React Native:

- `ListItem` renders a `Pressable` with `accessibilityRole='button'` and
  pressed styles only with `onPress` or `onLongPress`. Without them it is a
  static `Box`. Review each `ListItem` without them: a display-only item stays
  as is; an item driven only by other press handlers needs `onPress` or
  `onLongPress`.
- `ListItemProps` extends View props, so Pressable-only props (`onPressIn`,
  `onPressOut`, `delayLongPress`, `hapticFeedback`, `android_ripple`, a
  function `style`) no longer typecheck. Move their logic into `onPress` or
  `onLongPress`, or drop them.

Both:

- Remove `ListItemContextValue` imports; it had no public use.

## Verify

Zero `ListItemContextValue` hits; every other `detect` hit reviewed.
Typecheck passes. Open lists: clickable items still respond to click, press
and keyboard with hover/pressed styles, static items don't, titles line up
as before, and rows with tall leading or trailing content still fit (the
root lost its vertical padding).
