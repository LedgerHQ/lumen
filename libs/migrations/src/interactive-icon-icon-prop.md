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
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#InteractiveIcon.children'
    signal: loud
    detect:
      - { pattern: '</InteractiveIcon>' }
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#InteractiveIcon.icon'
    signal: loud
pr: 610
---

## Before → after

Web:

```tsx before
<InteractiveIcon iconType='stroked' aria-label='Close' onClick={onClose}>
  <Close size={16} />
</InteractiveIcon>
```

```tsx after
<InteractiveIcon iconType='stroked' icon={Close} size={16} aria-label='Close' onClick={onClose} />
```

React Native:

```tsx before
<InteractiveIcon iconType='stroked' accessibilityLabel='Close' onPress={onClose}>
  <Close size={16} />
</InteractiveIcon>
```

```tsx after
<InteractiveIcon iconType='stroked' icon={Close} size={16} accessibilityLabel='Close' onPress={onClose} />
```

## Decide

- Pass the icon component itself to `icon` (`icon={Close}`, not
  `icon={<Close />}`) and move its `size` to the `size` prop. With no size on
  the child, omit `size`: it defaults to 24, like the icon did.
- React Native: the default `hitSlop` now follows `size`. With no size on the
  child, it used the size-20 insets, so omitting `size` shrinks the touch
  area. To keep it, pass `hitSlop` explicitly: `comfortable` 12 on all sides,
  `compact-vertical` 10 top/bottom and 6 left/right, `compact-horizontal` 6
  top/bottom and 10 left/right.
- Props set on the child icon other than `size` (`className`, `style`,
  `color`) are dropped. On web, style the `InteractiveIcon` itself. On React
  Native, `style` and `lx` reach the pressable, not the icon: pass a
  component that applies them to the icon.
- A child that isn't a Lumen symbol must become a component that takes
  `size` (and the rest of `IconProps`).

## Verify

Zero `detect` hits. Typecheck passes. Icon buttons keep their icon, size and,
on React Native, touch area.
