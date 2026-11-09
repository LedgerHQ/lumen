---
changes:
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=icon'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]icon[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=check'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]check[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=info'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]info[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=bluetooth'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]bluetooth[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=loader'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]loader[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=number'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]number[''"]' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Spot.number'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bnumber=' }
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Spot.icon'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?!(?:[^>]|=>)*\bicon=)(?:[^>]|=>)*>', expect: review }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Spot.children'
    signal: loud
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#DiscriminatedSpotProps'
    signal: loud
    detect:
      - { pattern: '\bDiscriminatedSpotProps\b' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#Spot.appearance=icon'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]icon[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#Spot.appearance=check'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]check[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#Spot.appearance=info'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]info[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#Spot.appearance=bluetooth'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]bluetooth[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#Spot.appearance=loader'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]loader[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#Spot.appearance=number'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bappearance=\{?[''"]number[''"]' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Spot.number'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bnumber=' }
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Spot.icon'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?!(?:[^>]|=>)*\bicon=)(?:[^>]|=>)*>', expect: review }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Spot.children'
    signal: loud
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#DiscriminatedSpotProps'
    signal: loud
    detect:
      - { pattern: '\bDiscriminatedSpotProps\b' }
pr: 892
---

## Before → after

```tsx before
import { Spot, type DiscriminatedSpotProps } from '@ledgerhq/lumen-ui-react';
import { Settings } from '@ledgerhq/lumen-ui-react/symbols';

<Spot appearance='icon' icon={Settings} />
<Spot appearance='check' />
<Spot appearance='error' />
<Spot appearance='warning' />
<Spot appearance='info' />
<Spot appearance='bluetooth' size={48} />
<Spot appearance='loader' size={48} />
<Spot appearance='number' number={3} />
```

```tsx after
import { Spot, SpotNumber, Spinner, type SpotProps } from '@ledgerhq/lumen-ui-react';
import {
  BluetoothCircleFill,
  CheckmarkCircleFill,
  DeleteCircleFill,
  InformationFill,
  Settings,
  WarningFill,
} from '@ledgerhq/lumen-ui-react/symbols';

<Spot icon={Settings} />
<Spot appearance='success' icon={CheckmarkCircleFill} />
<Spot appearance='error' icon={DeleteCircleFill} />
<Spot appearance='warning' icon={WarningFill} />
<Spot appearance='muted' icon={InformationFill} />
<Spot icon={BluetoothCircleFill} size={48} />
<Spot icon={Spinner} size={48} />
<SpotNumber value={3} />
```

React Native takes the same props, imported from `@ledgerhq/lumen-ui-rnative`.

## Decide

`appearance` is now a color palette (`base` by default) and `icon` is always
required. Map each old appearance to the icon Spot used to draw:

| Before                  | After                                              |
| ----------------------- | -------------------------------------------------- |
| `icon`                  | drop `appearance`, keep `icon`                     |
| `check`                 | `appearance='success' icon={CheckmarkCircleFill}`  |
| `error`                 | `appearance='error' icon={DeleteCircleFill}`       |
| `warning`               | `appearance='warning' icon={WarningFill}`          |
| `info`                  | `appearance='muted' icon={InformationFill}`        |
| `bluetooth`             | `icon={BluetoothCircleFill}`, see below            |
| `loader`                | `icon={Spinner}` (`Spinner` from the package root) |
| `number` + `number={n}` | `<SpotNumber value={n} />`                         |

- `bluetooth` has no replacement. Its icon was drawn in a hard-coded blue
  (`#0082FC`) that no palette reproduces; `icon={BluetoothCircleFill}` renders
  it in the base text color. Ask design whether that is fine or whether a
  palette such as `appearance='decorative-blue'` fits.
- Apply the same mapping to appearance maps, ternaries and wrapper props, not
  only literal JSX. A wrapper typed with `DiscriminatedSpotProps` uses
  `SpotProps` (or `SpotNumberProps` for digits).
- Pass the icon component, not an element: `icon={Settings}`, never
  `icon={<Settings />}`.
- Drop any `children` passed to `Spot`; they were never rendered.
- Keep the default `fill` (`transparent`); it matches the previous look. Use
  `fill='plain'` only when design asks for a solid circle.

## Verify

Typecheck passes; it catches the cases `detect` misses (ternaries, maps,
wrappers). Zero `detect` hits, except the missing-`icon` pattern: its hits are
for review, since a `Spot` that gets `icon` through a spread is correct. Look at
screens with status spots (success, error, warning, info), Bluetooth pairing
(the icon is no longer blue), loading and numbered step spots. On web, a
disabled loading spot's spinner now turns gray instead of staying base-colored.
