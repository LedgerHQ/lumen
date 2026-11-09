---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Avatar.showNotification'
    signal: loud
    detect:
      - { pattern: '<Avatar\b[^>]*\bshowNotification\b' }
pr: 783
---

## Before → after

```tsx before
<Avatar src={user.photo} size='md' showNotification={hasUnread} />
```

```tsx after
import { Avatar, DotIndicator, getDotIndicatorProps } from '@ledgerhq/lumen-ui-react';

{hasUnread ? (
  <DotIndicator {...getDotIndicatorProps('avatar', 'md')} aria-label='New notifications'>
    <Avatar src={user.photo} size='md' />
  </DotIndicator>
) : (
  <Avatar src={user.photo} size='md' />
)}
```

## Decide

`Avatar` no longer draws the dot. Wrap it in `DotIndicator` and spread
`getDotIndicatorProps('avatar', size)`, with the avatar's own `size`.

- `showNotification` always `true`: wrap unconditionally.
- A boolean expression: render the wrapper only when it's true, as above.
- Avatar size `lg` or `xl`: the old prop drew nothing there. Drop the prop and
  don't wrap.
- The avatar's accessible name no longer mentions notifications. When the dot
  conveys state, pass an `aria-label` to `DotIndicator`, reusing the app's
  existing copy. Default: add one.

## Verify

Zero `detect` hits. Typecheck passes. Screens with notification avatars still
show the red dot, at the same size.
