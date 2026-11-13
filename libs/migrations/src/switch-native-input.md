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
      - { pattern: '<Switch\b(?:[^>]|=>)*?\basChild\b' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Switch.className'
    signal: visual # lands on an inline-flex wrapper span; state variants stop applying
    detect:
      - { pattern: '<Switch\b(?:[^>]|=>)*?\bclassName=(?:\{[^}]*|[''"][^''"]*)(?:data-|aria-checked:|\bdisabled:|focus(?:-visible)?:)' }
      - { pattern: '<Switch\b(?:[^>]|=>)*?\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Switch.style'
    signal: visual # lands on the invisible input
    detect:
      - { pattern: '<Switch\b(?:[^>]|=>)*?\bstyle=', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Switch'
    signal: silent # Enter no longer toggles; no aria-checked attribute
    detect:
      - { pattern: '\{Enter\}|key:\s*[''"]Enter[''"]|aria-checked', expect: review }
pr: 902
---

## Before → after

```tsx before
const switchRef = useRef<HTMLButtonElement>(null);

<Switch ref={switchRef} selected={enabled} onChange={setEnabled} className='data-[state=checked]:bg-success' style={{ marginLeft: 'auto' }} />;

await user.keyboard('{Enter}');
expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
```

```tsx after
const switchRef = useRef<HTMLInputElement>(null);

<Switch ref={switchRef} selected={enabled} onChange={setEnabled} className='flex ml-auto' />;

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
over the styled track, inside an `inline-flex` wrapper `<span>`. It used to be
a block-level `flex` `<button>`.

- `ref`: type it `HTMLInputElement`, and retype event handlers and callback
  refs from `HTMLButtonElement` to `HTMLInputElement`. `focus()`, `click()`
  and `checked` work on the input.
- `asChild`, `children`, `type` and other Radix props are gone: remove them.
- `className` lands on the wrapper, not the control. Margins and alignment
  keep working. Where a Switch sat in a non-flex, non-grid parent, it now flows
  inline with its siblings: add `flex` to `className` to restore the old layout.
  State variants (`data-[state=checked]:…`, `[&[data-state=…]]:…`,
  `data-disabled:…`, `aria-checked:…`, `disabled:…`, `focus-visible:…`) and
  color overrides no longer reach the track. There is no supported
  replacement: drop them and accept the default style, or ask the Lumen team.
- `style` lands on the invisible input, so it has no visible effect. Move
  layout styles to `className` or a wrapper element; drop visual ones.
- Keyboard: only Space toggles. Update tests that press Enter; keep Enter
  handling in app code only if a product flow needs it.
- Tests: `getByRole('switch')` and `data-testid` still target the control,
  which keeps `data-state`. Replace `aria-checked` assertions on it with
  `toBeChecked()`. Class assertions now target its `parentElement`.
- `@radix-ui/react-switch` is no longer a peer of
  `@ledgerhq/lumen-ui-react`. Remove it from `package.json` files where
  nothing else imports it.

## Verify

Zero hits for the `asChild` and state-variant patterns; every review hit is
checked. Typecheck and tests pass. Toggle switches in settings screens with
the mouse and Space, and check they sit where they did.
