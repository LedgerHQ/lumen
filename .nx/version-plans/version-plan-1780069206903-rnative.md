---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(ui-rnative): update DotIndicator sizes

The `DotIndicator` size scale has shifted by one step. The previous scale (`xs | sm | md | lg`) has been replaced by (`sm | md | lg | xl`), and the default size is now `md` instead of `sm`. The underlying pixel sizes have also been reduced: the new `sm` is smaller than the old `sm`, so consumers that previously relied on the default will see a smaller dot unless they migrate.

### Migration

Rename `size` values one step down the scale to preserve the previous visual size:

- `size="xs"` → `size="sm"`
- `size="sm"` → `size="md"` (also the new default, it can be omitted)
- `size="md"` → `size="lg"`
- `size="lg"` → `size="xl"`

If you were relying on the default (no `size` prop) and want to keep the previous rendered size, pass `size="sm"` explicitly. The `Avatar` component now uses `DotIndicator` internally for its notification dot. No consumer changes are required there, but note that `showNotification` is now only rendered on Avatar `sm` and `md` sizes (suppressed on `lg`/`xl`).
