---
changes:
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Avatar.appearance=gray'
    signal: loud
    detect:
      - { pattern: '<Avatar\b[^>]*\bappearance=\{?[''"](gray|transparent)[''"]' }
      - { pattern: '<Avatar\b[^>]*\bappearance=\{(?![''"](thin|thick)[''"])', expect: review }
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
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#Avatar.appearance=gray'
    signal: loud
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#Avatar.appearance=transparent'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#Avatar'
    signal: visual # same as web
    detect:
      - { pattern: '<Avatar\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Avatar.alt'
    signal: silent # default accessibilityLabel is the translated 'User avatar', not 'avatar'
    detect:
      - { pattern: '(?:LabelText\(|name:\s*)[''"`]avatar[''"`]' }
pr: 795
---

## Before → after

Same on web and React Native.

```tsx before
<Avatar src={user.photo} size='md' appearance='gray' />
<Avatar src={user.photo} appearance={isDark ? 'gray' : 'transparent'} />
```

```tsx after
<Avatar src={user.photo} size='md' />
<Avatar src={user.photo} />
```

React Native tests:

```tsx before
screen.getByLabelText('avatar');
```

```tsx after
screen.getByLabelText('User avatar');
```

## Decide

`appearance` no longer sets the background: every avatar now has the same
translucent one (`base-transparent-hover`). It now draws an optional ring,
`thin` (1px) or `thick` (2px).

- `appearance='transparent'` (the old default) or `'gray'`: remove the prop.
  Default: no ring. Add `thin` or `thick` only when design asks for a ring.
- A dynamic `appearance`: remove it, and the variable if nothing else uses it.

Every avatar also lost its 4px inner padding: the image now fills the circle
edge to edge, at the same outer size. Leave layouts as they are unless a
screen relied on that inset.

React Native: without `alt`, the label is now the translated `User avatar`
instead of `avatar`. Update tests that query the old label.

## Verify

Zero hits for the literal `appearance` pattern. Typecheck passes (it also
catches values the patterns miss). Look at screens with avatars, with and
without an image: same outer size, image edge to edge, fallback icon centered.
