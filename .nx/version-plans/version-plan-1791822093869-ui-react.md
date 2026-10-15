---
'@ledgerhq/lumen-ui-react': patch
---

refactor(Checkbox): replace @radix-ui/react-checkbox with a native input

`Checkbox` now renders a native `input type="checkbox"` as the accessible control, laid invisibly over the styled box, so semantics, keyboard and form participation come from the browser. Its styles and behavior are unchanged. `ref`, `id`, `name`, `value`, `required`, `form` and the `aria-*` attributes are forwarded to the input, while `className` is applied to the wrapper. `CheckboxProps` no longer extends the Radix root props. `@radix-ui/react-checkbox` is no longer a peer dependency of `@ledgerhq/lumen-ui-react`.
