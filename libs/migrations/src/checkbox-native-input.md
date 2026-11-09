---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Checkbox.ref'
    signal: loud # the ref now points to an HTMLInputElement
    detect:
      - { pattern: 'useRef<HTMLButtonElement>\([^)]*\)[\s\S]*<Checkbox\b', expect: review }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Checkbox.onChange'
    signal: loud # omitted from CheckboxProps; use onCheckedChange
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Checkbox.className'
    signal: visual # lands on a wrapper span; state variants stop applying
    detect:
      - { pattern: '<Checkbox\b(?:[^<>]|=>)*\bclassName=(?:[^<>]|=>)*(?:data-\[|disabled:|aria-checked:|enabled:)' }
      - { pattern: '<Checkbox\b(?:[^<>]|=>)*\bclassName=', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Checkbox'
    signal: silent # a native checkbox input, not a button: no aria-checked attribute
    detect:
      - { pattern: 'aria-checked', expect: review }
      - { pattern: 'button\[role=["'']?checkbox', expect: review }
pr: 908
---

## Before → after

```tsx before
const checkboxRef = useRef<HTMLButtonElement>(null);

<Checkbox
  ref={checkboxRef}
  checked={accepted}
  onCheckedChange={setAccepted}
  className='mt-4 data-[state=checked]:bg-success'
/>;

expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
expect(container.querySelector('button[role="checkbox"]')).toBeInTheDocument();
```

```tsx after
const checkboxRef = useRef<HTMLInputElement>(null);

<Checkbox ref={checkboxRef} checked={accepted} onCheckedChange={setAccepted} className='mt-4' />;

expect(screen.getByRole('checkbox')).toBeChecked();
expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
```

## Decide

`Checkbox` now renders a hidden native `<input type="checkbox">` over the
styled box, inside a wrapper `<span>`. `checked`, `defaultChecked` and
`onCheckedChange` are unchanged.

- `ref` and explicitly typed handlers (`MouseEvent<HTMLButtonElement>`, …):
  type them `HTMLInputElement`.
- `onChange` is no longer accepted: move the logic to
  `onCheckedChange(checked: boolean)`.
- `children`, `role`, `type`, `aria-checked` and `defaultValue` are no longer
  accepted: remove them. `value` must be a string.
- `className` lands on the wrapper, not the box. Layout classes keep working.
  State variants (`data-[state=checked]:…`, `disabled:…`, `aria-checked:…`) and
  color overrides no longer reach the box. There is no supported replacement:
  drop them and accept the default style, or ask the Lumen team.
- Tests: `getByRole('checkbox')` still works. Replace `aria-checked`
  assertions on that element with `toBeChecked()`, and selectors that expect a
  `<button>` with `input[type="checkbox"]`.
- `@radix-ui/react-checkbox` is no longer a peer of `@ledgerhq/lumen-ui-react`.
  Remove it from `package.json` files where nothing else imports it.

## Verify

Zero hits for the state-variant pattern; every review hit is checked.
Typecheck and tests pass. Look at forms with checkboxes: checked, unchecked
and disabled states, and their alignment with labels.
