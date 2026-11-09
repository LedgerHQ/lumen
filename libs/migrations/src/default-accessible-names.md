---
changes:
  - change: removed
    surface: dependency
    ref: 'i18next'
    signal: silent # still resolves when hoisted from another package
    detect:
      - { pattern: 'from\s*[''"]i18next[''"]', expect: review }
  - change: removed
    surface: dependency
    ref: 'react-i18next'
    signal: silent # still resolves when hoisted from another package
    detect:
      - { pattern: 'from\s*[''"]react-i18next[''"]', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Stepper'
    signal: silent # default name is "Step 2 of 4" instead of "2/4"
    detect:
      - { pattern: '(?:LabelText\(|name:\s*)[''"`]\d+/\d+[''"`]' }
      - { pattern: '(?:getByLabel\(|aria-label[''"]?\s*[,=]\s*)[''"`]\d+/\d+[''"`]', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react/visualization#Legend.ariaLabel'
    signal: silent # no default "Legend" name
    detect:
      - { pattern: '(?:LabelText\(|name:\s*)[''"`]Legend[''"`]' }
      - { pattern: '(?:getByLabel\(|aria-label[''"]?\s*[,=]\s*)[''"`]Legend[''"`]', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react/visualization#DonutChart.ariaLabel'
    signal: silent # defaults are "Chart" / "Loading chart"; selection is aria-pressed
    detect:
      - { pattern: '[''"`](?:Loading d|D)onut chart[''"`]' }
      - { pattern: ', selected[''"`]', expect: review } # still the RN segment name
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SegmentedControl'
    signal: silent # scroll arrows have no name and are aria-hidden
    detect:
      - { pattern: 'Scroll (?:left|right)' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative/visualization#Legend.accessibilityLabel'
    signal: silent # no default "Legend" label
    detect:
      - { pattern: '(?:LabelText\(|name:\s*)[''"`]Legend[''"`]' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative/visualization#DonutChart.accessibilityLabel'
    signal: silent # defaults are "Chart" / "Loading chart"
    detect:
      - { pattern: '[''"`](?:Loading d|D)onut chart[''"`]' }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#AmountInput'
    signal: silent # no default "Amount input" label
    detect:
      - { pattern: '[''"`]Amount input[''"`]' }
pr: 893
---

## Before → after

Web:

```tsx before
expect(screen.getByLabelText('2/4')).toBeInTheDocument();
expect(stepper).toHaveAttribute('aria-label', '2/4');
expect(screen.getByRole('list', { name: 'Legend' })).toBeInTheDocument();
await expect(page.getByLabel('Legend')).toBeVisible();
expect(screen.getByRole('group', { name: 'Donut chart' })).toBeInTheDocument();
expect(screen.getByRole('img', { name: 'Loading donut chart' })).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: 'BTC, selected' }));
await user.click(screen.getByRole('button', { name: 'Scroll right' }));
```

```tsx after
expect(screen.getByLabelText('Step 2 of 4')).toBeInTheDocument();
expect(stepper).toHaveAttribute('aria-label', 'Step 2 of 4');
expect(screen.getByRole('list', { name: 'Assets' })).toBeInTheDocument(); // with <Legend ariaLabel='Assets' />
await expect(page.getByLabel('Assets')).toBeVisible();
expect(screen.getByRole('group', { name: 'Chart' })).toBeInTheDocument();
expect(screen.getByRole('img', { name: 'Loading chart' })).toBeInTheDocument();
expect(screen.getByRole('button', { name: 'BTC' })).toHaveAttribute('aria-pressed', 'true');
await user.click(screen.getByRole('radio', { name: 'Week' }));
```

React Native:

```tsx before
<Legend series={series} />
<AmountInput value={amount} onChangeText={setAmount} />

expect(screen.getByLabelText('Legend')).toBeTruthy();
expect(screen.getByLabelText('Donut chart')).toBeTruthy();
expect(screen.getByLabelText('Loading donut chart')).toBeTruthy();
fireEvent.press(screen.getByLabelText('Amount input'));
```

```tsx after
<Legend series={series} accessibilityLabel='Assets' />
<AmountInput value={amount} onChangeText={setAmount} accessibilityLabel='Amount' />

expect(screen.getByLabelText('Assets')).toBeTruthy();
expect(screen.getByLabelText('Chart')).toBeTruthy();
expect(screen.getByLabelText('Loading chart')).toBeTruthy();
fireEvent.press(screen.getAllByLabelText('Amount')[1]); // [0] is the hidden TextInput
```

```tsx before
import i18next from 'i18next'; // declare both in package.json
import { useTranslation } from 'react-i18next';
```

## Decide

Lumen's strings now come from its own translations, rendered in the
`ThemeProvider` locale. Several default accessible names changed or were
dropped. App code rarely relies on them; tests and end-to-end selectors do.

- `Stepper` (web): the default name is "Step 2 of 4" (translated). The
  visible "2/4" text is unchanged. A custom `label` is still used as is.
- `Legend`: no default name (`ariaLabel` on web, `accessibilityLabel` on
  React Native). If a test or a screen needs the list named, pass it;
  otherwise query the items by their text.
- `DonutChart`: defaults are "Chart" and "Loading chart" on both platforms.
  Pass `ariaLabel` (web) or `accessibilityLabel` (React Native) to name what
  the chart shows (recommended). Web only: selected segments no longer end in
  ", selected"; assert `aria-pressed="true"` instead. React Native segments
  keep the "BTC, selected" name, so leave those hits as they are.
- `SegmentedControl` (web): the scroll arrows are hidden from assistive
  technologies and have no name. Tests should select or focus a segment
  instead, which scrolls it into view.
- `AmountInput` (React Native): no default "Amount input" label. Pass
  `accessibilityLabel`; it also lands on the hidden `TextInput`, so tests
  query with `getAllByLabelText` or by `testID`.
- Outside a `ThemeProvider`, every Lumen string renders as its translation key
  (`components.stepper.progressAriaLabel`). That now includes strings that
  used to be hardcoded English: the chart labels above, web `Select` search
  placeholder "Search", web `Link` "(opens in a new tab)", and `Subheader`
  "More information". Default: render tests inside the same `ThemeProvider`
  as the app, then query the English text. A non-English `locale` now applies
  from the first render.
- Lumen no longer depends on `i18next` / `react-i18next` nor provides an
  `I18nextProvider`. If the app uses them, declare them and set up its own
  provider.

## Verify

Zero `detect` hits, except `review` ones, which are checked by hand. Unit and
end-to-end tests pass. Screen-reader names on steppers, charts, legends and
amount inputs read as expected.
