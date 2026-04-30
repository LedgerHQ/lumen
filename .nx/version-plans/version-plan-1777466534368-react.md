---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(ui-react): update Avatar + DotIndicator sizes

Avatar sizes have been updated and a new `xl` variant (64px) added. `sm` is now 32px, `md` 40px, and `lg` 48px — down from 40px, 48px, and 72px respectively. The notification dot scales with the avatar size.

DotIndicator gains a new `lg` size (16px). The existing `md` shrinks from 16px to 14px — if you relied on `md` for a 16px dot, switch to `lg`.
