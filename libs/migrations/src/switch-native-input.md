---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Switch.ref'
    signal: loud # the ref now points to an HTMLInputElement
    detect:
      - { pattern: 'useRef<HTMLButtonElement>\([^)]*\)[\s\S]*<Switch\b', expect: review }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Switch.asChild'
    signal: loud
    detect:
      - { pattern: '<Switch\b[^>]*\basChild\b' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Switch.className'
    signal: visual # lands on a wrapper span; state variants stop applying
    detect:
      - { pattern: '<Switch\b[^>]*\bclassName=[^>]*data-(?:\[|disabled)' }
      - { pattern: '<Switch\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Switch'
    signal: silent # Enter no longer toggles; no aria-checked attribute
    detect:
      - { pattern: '\{Enter\}|aria-checked', expect: review }
pr: 902
---

## Before → after

```tsx before
const switchRef = useRef<HTMLButtonElement>(null);

<Switch
  ref={switchRef}
  selected={enabled}
  onChange={setEnabled}
  className='ml-8 data-[state=checked]:bg-success'
/>

await user.keyboard('{Enter}');
expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
```

```tsx after
const switchRef = useRef<HTMLInputElement>(null);

<Switch ref={switchRef} selected={enabled} onChange={setEnabled} className='ml-8' />

await user.keyboard(' ');
expect(screen.getByRole('switch')).toBeChecked();
```

```tsx before
<Switch asChild selected={enabled} onChange={setEnabled}>
  <button type='button' />
</Switch>
```

```tsx after
<Switch selected={enabled} onChange={setEnabled} />
```

## Decide

`Switch` now renders a hidden native `<input type="checkbox" role="switch">`
over the styled track, inside a wrapper `<span>`.

- `ref`: type it `HTMLInputElement`. Code that called button-only methods on
  it rarely exists; `focus()`, `click()` and `checked` work on the input.
- `asChild` and other Radix or `<button>` props are gone: remove them.
- `className` lands on the wrapper, not the control. Layout classes (margins,
  alignment) keep working. State variants (`data-[state=checked]:…`,
  `data-disabled:…`) and color overrides no longer reach the track. There is
  no supported replacement: drop them and accept the default style, or ask the
  Lumen team.
- Keyboard: only Space toggles. Update tests that press Enter; keep Enter
  handling in app code only if a product flow needs it.
- Tests: `getByRole('switch')` still works and keeps `data-state`. Replace
  `aria-checked` assertions on that element with `toBeChecked()`.
- `@radix-ui/react-switch` is no longer a peer of `@ledgerhq/lumen-ui-react`.
  Remove it from `package.json` files where nothing else imports it.

## Verify

Zero hits for the `asChild` and state-variant patterns; every review hit is
checked. Typecheck and tests pass. Toggle switches in settings screens with
the mouse and Space, and check their layout.
