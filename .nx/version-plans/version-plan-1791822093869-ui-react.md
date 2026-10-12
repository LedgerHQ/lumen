---
'@ledgerhq/lumen-ui-react': patch
---

refactor(Checkbox): replace @radix-ui/react-checkbox with an inline implementation

`Checkbox` is now a plain `button` with `role="checkbox"`. Its styles and behavior are unchanged, including the form props (`name`, `value`, `required`, `form`): when `name` is set, a visually hidden input mirrors the state for native form submission. A new `inputRef` prop exposes that input to form libraries. `CheckboxProps` no longer extends the Radix root props and now accepts only `ref`, `id`, `tabIndex` and the `aria-label`, `aria-labelledby`, `aria-describedby` and `aria-hidden` attributes. `@radix-ui/react-checkbox` is no longer a peer dependency of `@ledgerhq/lumen-ui-react`.
