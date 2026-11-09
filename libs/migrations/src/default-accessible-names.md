---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#Stepper'
    signal: silent # default name is "Step 2 of 4" instead of "2/4"
    detect:
      - { pattern: '(?:LabelText\(|name:\s*)[''"`]\d+/\d+[''"`]' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react/visualization#Legend.ariaLabel'
    signal: silent # no default "Legend" name
    detect:
      - { pattern: '(?:LabelText\(|name:\s*)[''"`]Legend[''"`]' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react/visualization#DonutChart.ariaLabel'
    signal: silent # defaults are "Chart" / "Loading chart"; selection is aria-pressed
    detect:
      - { pattern: '[''"`](?:Loading d|D)onut chart[''"`]' }
      - { pattern: ', selected[''"`]' }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SegmentedControl'
    signal: silent # scroll arrows have no name and are aria-hidden
    detect:
      - { pattern: 'Scroll (?:left|right)' }
pr: 893
---

## Before → after

```tsx before
expect(screen.getByLabelText('2/4')).toBeInTheDocument();
expect(screen.getByRole('list', { name: 'Legend' })).toBeInTheDocument();
expect(screen.getByRole('group', { name: 'Donut chart' })).toBeInTheDocument();
expect(screen.getByRole('img', { name: 'Loading donut chart' })).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: 'BTC, selected' }));
await user.click(screen.getByRole('button', { name: 'Scroll right' }));
```

```tsx after
expect(screen.getByLabelText('Step 2 of 4')).toBeInTheDocument();
expect(screen.getByRole('list', { name: 'Assets' })).toBeInTheDocument(); // with <Legend ariaLabel='Assets' />
expect(screen.getByRole('group', { name: 'Chart' })).toBeInTheDocument();
expect(screen.getByRole('img', { name: 'Loading chart' })).toBeInTheDocument();
expect(screen.getByRole('button', { name: 'BTC' })).toHaveAttribute('aria-pressed', 'true');
await user.click(screen.getByRole('radio', { name: 'Week' }));
```

## Decide

Lumen's strings now come from its own translations, rendered in the
`ThemeProvider` locale. Several default accessible names changed or were
dropped. App code rarely relies on them; tests and end-to-end selectors do.

- `Stepper`: the default name is "Step 2 of 4" (translated). The visible
  "2/4" text is unchanged. A custom `label` is still used as is.
- `Legend`: no default name. If a test or a screen needs the list named, pass
  `ariaLabel`; otherwise query the items by their text.
- `DonutChart`: defaults are "Chart" and "Loading chart". Pass `ariaLabel` to
  name what the chart shows (recommended). Selected segments no longer end
  in ", selected"; assert `aria-pressed="true"` instead.
- `SegmentedControl`: the scroll arrows are hidden from assistive technologies
  and have no name. Tests should select or focus a segment instead, which
  scrolls it into view.
- Outside a `ThemeProvider`, Lumen returns the translation key itself
  (`components.stepper.progressAriaLabel`). Default: render tests inside the
  same `ThemeProvider` as the app, then query the English text.

## Verify

Zero `detect` hits. Unit and end-to-end tests pass. Screen-reader names on
steppers, charts and legends read as expected.
