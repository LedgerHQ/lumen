---
'@ledgerhq/lumen-ui-react': patch
---

refactor(Switch): replace @radix-ui/react-switch with an inline implementation

`Switch` is now a plain `button` with `role="switch"`. Its props, attributes and styles are unchanged. `@radix-ui/react-switch` is no longer a peer dependency of `@ledgerhq/lumen-ui-react`.
