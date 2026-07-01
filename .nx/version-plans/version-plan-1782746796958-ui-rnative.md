---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(Avatar): use compose pattern for notification dot

The `showNotification` prop has been removed from `Avatar`. To show a notification
dot, wrap the `Avatar` in a `DotIndicator` and derive the dot props from the avatar
size with the new `getDotConfig` helper.

```tsx
// before
import { Avatar } from '@ledgerhq/lumen-ui-rnative';

<Avatar src="https://example.com/photo.jpg" size="md" showNotification />;

// after
import { Avatar, DotIndicator, getDotConfig } from '@ledgerhq/lumen-ui-rnative';

<DotIndicator {...getDotConfig('avatar', 'md')}>
  <Avatar src="https://example.com/photo.jpg" size="md" />
</DotIndicator>;
```
