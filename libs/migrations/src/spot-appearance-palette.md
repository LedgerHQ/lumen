---
changes:
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=icon'
    signal: loud
    detect:
      - { pattern: '<Spot\b[^>]*\bappearance=\{?[''"]icon[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=check'
    signal: loud
    detect:
      - { pattern: '<Spot\b[^>]*\bappearance=\{?[''"]check[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=info'
    signal: loud
    detect:
      - { pattern: '<Spot\b[^>]*\bappearance=\{?[''"]info[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=bluetooth'
    signal: loud
    detect:
      - { pattern: '<Spot\b[^>]*\bappearance=\{?[''"]bluetooth[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=loader'
    signal: loud
    detect:
      - { pattern: '<Spot\b[^>]*\bappearance=\{?[''"]loader[''"]' }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#Spot.appearance=number'
    signal: loud
    detect:
      - { pattern: '<Spot\b[^>]*\bappearance=\{?[''"]number[''"]' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Spot.number'
    signal: loud
    detect:
      - { pattern: '<Spot\b[^>]*\bnumber=' }
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Spot.icon'
    signal: loud
    detect:
      - { pattern: '<Spot\b(?![^>]*\bicon=)[^>]*>' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#DiscriminatedSpotProps'
    signal: loud
    detect:
      - { pattern: '\bDiscriminatedSpotProps\b' }
pr: 892
---

## Before → after

```tsx before
import { Spot, type DiscriminatedSpotProps } from '@ledgerhq/lumen-ui-react';

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

## Decide

`appearance` is now a color palette (`base` by default) and `icon` is always
required. Map each old appearance to the icon Spot used to draw:

| Before | After |
| --- | --- |
| `icon` | drop `appearance`, keep `icon` |
| `check` | `appearance='success' icon={CheckmarkCircleFill}` |
| `error` | `appearance='error' icon={DeleteCircleFill}` |
| `warning` | `appearance='warning' icon={WarningFill}` |
| `info` | `appearance='muted' icon={InformationFill}` |
| `bluetooth` | `icon={BluetoothCircleFill}` |
| `loader` | `icon={Spinner}` (`Spinner` from `@ledgerhq/lumen-ui-react`) |
| `number` + `number={n}` | `<SpotNumber value={n} />` |

- Apply the same mapping to appearance maps, ternaries and wrapper props, not
  only literal JSX. A wrapper typed with `DiscriminatedSpotProps` uses
  `SpotProps` (or `SpotNumberProps` for digits).
- Pass the icon component, not an element: `icon={Settings}`, never
  `icon={<Settings />}`.
- Keep the default `fill` (`transparent`); it matches the previous look. Use
  `fill='plain'` only when design asks for a solid circle.

## Verify

Zero `detect` hits. Typecheck passes. Look at screens with status spots
(success, error, warning, info), Bluetooth pairing, loading and numbered step
spots.
