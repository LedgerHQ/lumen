---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#BaseButton'
    signal: loud
    detect:
      - { pattern: 'import\s[^;''"]*\bBaseButton(Props)?\b[^;''"]*from\s*[''"]@ledgerhq/lumen-ui-react' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#BaseInput'
    signal: loud
    detect:
      - { pattern: 'import\s[^;''"]*\bBaseInput(Props|CounterProps|HelperTextProps|Status)?\b[^;''"]*from\s*[''"]@ledgerhq/lumen-ui-react' }
  - change: removed
    surface: module
    ref: '@ledgerhq/lumen-ui-react/Icon'
    signal: loud
    detect:
      - { pattern: 'from\s*[''"]@ledgerhq/lumen-ui-react/Icon[''"]' }
  - change: removed
    surface: module
    ref: '@ledgerhq/lumen-ui-react/BaseTag'
    signal: loud
    detect:
      - { pattern: 'from\s*[''"]@ledgerhq/lumen-ui-react/BaseTag[''"]' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#Icon'
    signal: loud
    detect:
      - { pattern: 'import\s[^;''"]*\bIcon\b[^;''"]*from\s*[''"]@ledgerhq/lumen-ui-rnative[''"]' }
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

Web deep imports of `/Icon` and `/BaseTag`:

```tsx before
import { Icon } from '@ledgerhq/lumen-ui-react/Icon';
import { BaseTag } from '@ledgerhq/lumen-ui-react/BaseTag';

<Icon size={24} viewBox='0 0 24 24'>
  <path d={LOGO_PATH} stroke='currentColor' />
</Icon>
<BaseTag variant='tag' consumerName='Badge' label='New' />
```

```tsx after
import { Tag } from '@ledgerhq/lumen-ui-react';

<svg
  viewBox='0 0 24 24'
  fill='none'
  aria-hidden='true'
  className='inline-block shrink-0 icon-h-24 icon-w-24 icon-stroke-24'
>
  <path d={LOGO_PATH} stroke='currentColor' />
</svg>
<Tag label='New' />
```

React Native, a custom SVG drawn with `Icon`:

```tsx before
import { Icon } from '@ledgerhq/lumen-ui-rnative';
import { Path } from 'react-native-svg';

const Logo = () => (
  <Icon size={24} viewBox='0 0 24 24'>
    <Path d={LOGO_PATH} stroke='currentColor' />
  </Icon>
);
```

```tsx after
import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { Path, Svg } from 'react-native-svg';

const Logo = () => {
  const { theme } = useTheme();
  return (
    <Svg width={theme.icon.width.s24} height={theme.icon.height.s24} strokeWidth={theme.icon.borderWidth.s24} viewBox='0 0 24 24' color={theme.colors.text.base} fill='none' style={{ pointerEvents: 'none', flexShrink: 0 }}>
      <Path d={LOGO_PATH} stroke='currentColor' />
    </Svg>
  );
};
```

## Decide

`@ledgerhq/lumen-ui-react` no longer exports `BaseButton` or `BaseInput`
(root or `/Button`, `/BaseInput` subpaths), nor their types (`BaseButtonProps`,
`BaseInputProps`, `BaseInputCounterProps`, `BaseInputHelperTextProps`,
`BaseInputStatus`).

- `BaseButton` with text (with or without `icon`): use `Button`, which adds
  horizontal padding (`px-16`, except `lg`), semi-bold body typography and
  `gap-8`. It requires `children` and has no `xs` size: use `sm`.
- `BaseButton` with only an `icon`: use `IconButton`, which keeps `xs` and
  requires an `aria-label`.
- `MediaButton` only fits when the children render media plus a label: move
  the media to `leadingContent`, and pass `hideChevron` to drop the chevron.
- `BaseButtonProps`: use the props type of the chosen component.
- `BaseInput`: use `TextInput`, and `TextInputProps` for its types. A string
  `prefix` still renders; a non-string `prefix`, `labelClassName` and
  `inputClassName` no longer type-check: drop them, move what styling you can
  to `className` (root) or `containerClassName` (input frame), and report the
  visual difference.

The `/Icon` and `/BaseTag` deep imports no longer resolve (`./*` now maps to
public components only). `IconProps` and `IconSize` are exported from the root.

- `Icon`: prefer a ready-made icon from `@ledgerhq/lumen-ui-react/symbols`.
  For a custom SVG, render `<svg>` with the classes above (`icon-*-<size>`).
- `BaseTag`: use `Tag` for `variant='tag'`, `MediaTag` for `variant='media'`;
  drop `variant` and `consumerName`.

`@ledgerhq/lumen-ui-rnative` no longer exports the `Icon` component; `IconProps`
and `IconSize` stay. Prefer a ready-made icon from
`@ledgerhq/lumen-ui-rnative/symbols`. For a custom SVG, render
`react-native-svg`'s `Svg` with the theme's icon tokens, as above. `Icon` only
read the color from `color` or `lx.color`: pass `theme.colors.text.<token>` as
`color`, and drop the rest of `lx`, which it ignored.

## Verify

Zero `detect` hits. Typecheck passes. Open screens that used these components:
buttons swapped to `Button` take its padding and typography; report the visual
delta. Inputs, tags and icons look as before.
