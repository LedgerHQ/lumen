---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#BaseButton'
    signal: loud
    detect:
      - { pattern: '\bBaseButton(Props)?\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#BaseInput'
    signal: loud
    detect:
      - { pattern: '\bBaseInput(Props|CounterProps|HelperTextProps|Status)?\b' }
pr: 825
---

## Before → after

```tsx before
import { BaseButton, BaseInput, type BaseInputProps } from '@ledgerhq/lumen-ui-react';

const AmountField = (props: BaseInputProps) => <BaseInput {...props} />;

<BaseButton appearance='accent' onClick={send}>Send</BaseButton>
<BaseInput label='Amount' value={amount} onChange={onAmountChange} />
```

```tsx after
import { Button, TextInput, type TextInputProps } from '@ledgerhq/lumen-ui-react';

const AmountField = (props: TextInputProps) => <TextInput {...props} />;

<Button appearance='accent' onClick={send}>Send</Button>
<TextInput label='Amount' value={amount} onChange={onAmountChange} />
```

## Decide

`@ledgerhq/lumen-ui-react` no longer exports `BaseButton` or `BaseInput`, nor
their types (`BaseButtonProps`, `BaseInputProps`, `BaseInputCounterProps`,
`BaseInputHelperTextProps`, `BaseInputStatus`).

- `BaseButton`: use `Button`, or `IconButton` when it renders only an icon,
  or `MediaButton` when it has leading media. Same for `BaseButtonProps`
  (`ButtonProps`, `IconButtonProps`, `MediaButtonProps`).
- `BaseInput`: use `TextInput`, and `TextInputProps` for its types. If the
  code relied on `prefix`, `labelClassName` or `inputClassName`, which
  `TextInput` doesn't take, use `AmountInput` or `AddressInput` when one fits,
  otherwise drop the prop and report the visual difference.

## Verify

Zero `detect` hits. Typecheck passes. Open screens that used these components:
buttons and inputs look and behave as before.
