---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(Avatar): use compose pattern for notification dot

The `showNotification` prop has been removed from `Avatar`. To show a notification
dot, wrap the `Avatar` in a `DotIndicator` and derive the dot props from the avatar
size with the new `getDotIndicatorProps` helper.

```tsx
// before
import { Avatar } from '@ledgerhq/lumen-ui-react';

<Avatar src="https://example.com/photo.jpg" size="md" showNotification />;

// after
import { Avatar, DotIndicator, getDotIndicatorProps } from '@ledgerhq/lumen-ui-react';

<DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
  <Avatar src="https://example.com/photo.jpg" size="md" />
</DotIndicator>;
```
