---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#InteractiveIcon.children'
    signal: loud
    detect:
      - { pattern: '</InteractiveIcon>' }
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-react#InteractiveIcon.icon'
    signal: loud
pr: 610
---

## Before → after

```tsx before
<InteractiveIcon iconType='stroked' aria-label='Close' onClick={onClose}>
  <Close size={16} />
</InteractiveIcon>
```

```tsx after
<InteractiveIcon
  iconType='stroked'
  icon={Close}
  size={16}
  aria-label='Close'
  onClick={onClose}
/>
```

## Decide

- Pass the icon component itself to `icon` (`icon={Close}`, not
  `icon={<Close />}`) and move its `size` to the `size` prop. With no size on
  the child, omit `size`: it defaults to 24, like the icon did.
- Props set on the child icon other than `size` (e.g. `className`) have no
  equivalent: drop them, or style the `InteractiveIcon` itself.
- A child that isn't a Lumen symbol must become a component that takes
  `size` (and the rest of `IconProps`).

## Verify

Zero `detect` hits. Typecheck passes. Icon buttons keep their icon and size.
