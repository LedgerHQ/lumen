---
'@ledgerhq/lumen-ui-react': patch
---

refactor(Switch): replace @radix-ui/react-switch with an inline implementation

`Switch` is now a plain `button` with `role="switch"`. Its props, attributes and styles are unchanged, including the form props (`name`, `value`, `required`, `form`): when `name` is set, a visually hidden input mirrors the state for native form submission. A new `inputRef` prop exposes that input to form libraries. `@radix-ui/react-switch` is no longer a peer dependency of `@ledgerhq/lumen-ui-react`.
