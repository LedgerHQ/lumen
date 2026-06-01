---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(DotIndicator): update DotIndicator sizes

The `DotIndicator` size scale has been renamed and rescaled. The previous scale (`xs | sm | md | lg`) has been replaced by (`sm | md | lg | xl`), and the default size is now `md` instead of `sm`. The underlying token sizes have been reduced overall. The names did not simply shift down by one. Old `md` (`s14`) and old `lg` (`s16`) have no equivalent in the new scale.

### Migration

The new sizes map to the old as follows, matched by token size:

- `size="xs"` (`s10`) → `size="lg"` (`s10`)
- `size="sm"` (`s12`) → `size="xl"` (`s12`)
- `size="md"` (`s14`) → no exact equivalent
- `size="lg"` (`s16`) → no exact equivalent

If you were relying on the default (no `size` prop) and want to keep the previous rendered size, pass `size="xl"` explicitly. Consumers previously using `md` or `lg` will end up with a smaller dot! Please review whether that is desirable for the design.

The `Avatar` component's internal `dotSizeMap` has been updated to match. No consumer changes are required there, but note that `showNotification` is now only rendered on Avatar `sm` and `md` sizes (suppressed on `lg`/`xl`).
