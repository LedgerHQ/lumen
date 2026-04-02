---
'@ledgerhq/lumen-ui-react': patch
---

refactor(Dialog): rename 'hug' variant to 'fit' in Popover and Dialog

**BREAKING CHANGE**: The `hug` value for `Dialog`'s `height` prop has been renamed to `fit`.

### Migration

- `<Dialog height="hug">` → `<Dialog height="fit">`

