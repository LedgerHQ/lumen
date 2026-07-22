---
'@ledgerhq/lumen-utils-shared': patch
---

BREAKING_CHANGE(Avatar): add letter and background fallbacks + xs and 2xl sizes

### What changed

The `Avatar` component has been visually updated. It no longer renders a stroke/ring by default.

Instead of controlling the background color of the avatar container, the `appearance` prop now controls the width of the ring surrounding it:

- `thin` - 1px ring, using `border-icon` color
- `thick` - 2px ring, using `border-muted-subtle-transparent` color
- None - no ring

To make Avatar interactible (making use of press handlers and hover states) use the newly introduced `AvatarButton` component which spreads all necessary props from Avatar, including `appearance`.
