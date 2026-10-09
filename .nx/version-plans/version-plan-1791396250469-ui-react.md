---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(Switch): replace @radix-ui/react-switch with an inline implementation

`Switch` is now a plain `button` with `role="switch"`. Its props, attributes and styles are mostly unchanged. However, form-related props are no longer supported (e.g. `name`, `required`, `value`, `form`). `@radix-ui/react-switch` is no longer a peer dependency of `@ledgerhq/lumen-ui-react`.
