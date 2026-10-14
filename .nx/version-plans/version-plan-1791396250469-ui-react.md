---
'@ledgerhq/lumen-ui-react': patch
---

refactor(Switch): replace @radix-ui/react-switch with a native input

`Switch` now renders a native `input type="checkbox"` with `role="switch"` as the accessible control, laid invisibly over the styled track, so semantics, keyboard and form participation come from the browser. Its styles are unchanged. `ref`, `id`, `name`, `value`, `required`, `form` and the `aria-*` attributes are forwarded to the input, while `className` is applied to the wrapper. Enter no longer toggles the switch (Space still does). `SwitchProps` no longer extends the Radix root props. `@radix-ui/react-switch` is no longer a peer dependency of `@ledgerhq/lumen-ui-react`.
