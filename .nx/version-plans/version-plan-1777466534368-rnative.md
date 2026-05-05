---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(ui-rnative): update Avatar + DotIndicator sizes

Avatar sizes have been updated and a new `xl` variant (64px) added. `sm` is now 32px, `md` 40px, and `lg` 48px — down from 40px, 48px, and 72px respectively. The notification dot scales with the avatar size.

- <DotIndicator size="md" />
+ <DotIndicator size="lg" />
