---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Avatar.showNotification'
    signal: loud
    detect:
      - { pattern: '<Avatar\b(?:=>|[^>])*\bshowNotification\b' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Avatar.showNotification'
    signal: loud
    detect:
      - { pattern: '<Avatar\b(?:=>|[^>])*\bshowNotification\b' }
pr: 783
---

## Before → after

```tsx before
<Avatar src={user.photo} alt={user.name} size='md' showNotification={hasUnread} />
```

```tsx after
import { Avatar, DotIndicator, getDotIndicatorProps } from '@ledgerhq/lumen-ui-react';

{hasUnread ? (
  <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
    <Avatar src={user.photo} alt={`${user.name}, Has notification`} size='md' />
  </DotIndicator>
) : (
  <Avatar src={user.photo} alt={user.name} size='md' />
)}
```

React Native also moved `testID` onto the dot wrapper while the dot showed:

```tsx before
import { Avatar } from '@ledgerhq/lumen-ui-rnative';

<Avatar src={user.photo} alt={user.name} showNotification={hasUnread} testID='user-avatar' />;
```

```tsx after
import { Avatar, DotIndicator, getDotIndicatorProps } from '@ledgerhq/lumen-ui-rnative';

{hasUnread ? (
  <DotIndicator {...getDotIndicatorProps('avatar', 'md')} testID='user-avatar'>
    <Avatar src={user.photo} alt={`${user.name}, Has notification`} />
  </DotIndicator>
) : (
  <Avatar src={user.photo} alt={user.name} testID='user-avatar' />
)}
```

## Decide

`Avatar` no longer draws the dot. Wrap it in `DotIndicator` and spread
`getDotIndicatorProps('avatar', size)`, with the avatar's own `size`.

- No `size`: the default is `md`, so pass `'md'`.
- Avatar size `lg` or `xl`: the old prop drew nothing there. Drop the prop and
  don't wrap.
- Dynamic `size`: the helper only accepts `'sm' | 'md'`. Wrap only when
  `size === 'sm' || size === 'md'`.
- `showNotification` always `true`: wrap unconditionally.
- A boolean expression: render the wrapper only when it's true, as above.
- The avatar's accessible name no longer gets the ", Has notification" suffix.
  Default: append the app's own localized notification copy to `alt` while the
  dot shows, as above.
- React Native `testID`: the Avatar now always keeps it. If tests expect the
  wrapper while the dot shows, pass it to `DotIndicator` instead, as above.

## Verify

Zero `detect` hits. Typecheck passes. Screens with notification avatars still
show the red dot, at the same size.
