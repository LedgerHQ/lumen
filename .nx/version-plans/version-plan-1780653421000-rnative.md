---
'@ledgerhq/lumen-ui-rnative': patch
---

feat(BottomSheet): add onHeaderClosePressed callback

Add an `onHeaderClosePressed` prop to `BottomSheet` to react specifically to the header close button being pressed. This is distinct from `onClose` and `onDismiss`, which are still called on full sheet dismissal.
