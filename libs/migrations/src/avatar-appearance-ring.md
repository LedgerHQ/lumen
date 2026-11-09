---
changes:
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Avatar.appearance=gray'
    signal: loud
    detect:
      - { pattern: '<Avatar\b[^>]*\bappearance=\{?[''"](gray|transparent)[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Avatar.appearance=transparent'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Avatar'
    signal: visual # no padding, new background, image fills the circle
    detect:
      - { pattern: '<Avatar\b', expect: review }
pr: 795
---

## Before → after

```tsx before
<Avatar src={user.photo} size='md' appearance='gray' />
```

```tsx after
<Avatar src={user.photo} size='md' />
```

## Decide

`appearance` no longer sets the background: every avatar now has the same one.
It now draws an optional ring, `thin` (1px) or `thick` (2px).

- `appearance='transparent'` (the old default) or `'gray'`: remove the prop.
  Default: no ring. Add `thin` or `thick` only when design asks for a ring.
- A dynamic `appearance`: remove it, and the variable if nothing else uses it.

Every avatar also lost its 4px inner padding: the image now fills the circle
edge to edge, at the same outer size. Leave layouts as they are unless a
screen relied on that inset.

## Verify

Zero hits for the `appearance` pattern. Typecheck passes. Look at screens with
avatars, with and without an image: same outer size, image edge to edge,
fallback icon centered.
