---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(Avatar): make fallback color resolver reactive to theme

`resolveAvatarColor` is renamed to `useResolveAvatarColor` and is now a hook. Please update the import name and only call it inside a React component.
