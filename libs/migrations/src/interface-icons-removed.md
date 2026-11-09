---
changes:
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react/symbols#Apex'
    to: '@ledgerhq/lumen-ui-react/symbols#NanoGen5'
    signal: loud
    detect:
      - { pattern: '\bApex\b' }
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react/symbols#Charon'
    to: '@ledgerhq/lumen-ui-react/symbols#RecoveryKey'
    signal: loud
    detect:
      - { pattern: '\bCharon\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react/symbols#BellNotification'
    signal: loud
    detect:
      - { pattern: '\bBellNotification\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react/symbols#ShieldCheckNotification'
    signal: loud
    detect:
      - { pattern: '\bShieldCheckNotification\b' }
  - change: renamed
    surface: module
    ref: '@ledgerhq/lumen-design-core/symbols/apex.svg'
    to: '@ledgerhq/lumen-design-core/symbols/nano-gen5.svg'
    signal: loud
    detect:
      - { pattern: 'symbols/apex\.svg' }
  - change: renamed
    surface: module
    ref: '@ledgerhq/lumen-design-core/symbols/charon.svg'
    to: '@ledgerhq/lumen-design-core/symbols/recovery-key.svg'
    signal: loud
    detect:
      - { pattern: 'symbols/charon\.svg' }
  - change: removed
    surface: module
    ref: '@ledgerhq/lumen-design-core/symbols/bell-notification.svg'
    signal: loud
    detect:
      - { pattern: 'symbols/bell-notification\.svg' }
  - change: removed
    surface: module
    ref: '@ledgerhq/lumen-design-core/symbols/shield-check-notification.svg'
    signal: loud
    detect:
      - { pattern: 'symbols/shield-check-notification\.svg' }
pr: 913
---

## Before → after

```tsx before
import { Apex, BellNotification, Charon } from '@ledgerhq/lumen-ui-react/symbols';
import apexUrl from '@ledgerhq/lumen-design-core/symbols/apex.svg';
import charonUrl from '@ledgerhq/lumen-design-core/symbols/charon.svg';

<Spot icon={Apex} />
<Charon size={20} />
<IconButton icon={BellNotification} aria-label='Notifications' />
```

```tsx after
import { DotIndicator } from '@ledgerhq/lumen-ui-react';
import { Bell, NanoGen5, RecoveryKey } from '@ledgerhq/lumen-ui-react/symbols';
import type { IconSize } from '@ledgerhq/lumen-ui-react';
import nanoGen5Url from '@ledgerhq/lumen-design-core/symbols/nano-gen5.svg';
import recoveryKeyUrl from '@ledgerhq/lumen-design-core/symbols/recovery-key.svg';

const BellWithDot = ({ size, className }: { size?: IconSize; className?: string }) => (
  <DotIndicator appearance='red' size='md'>
    <Bell size={size} className={className} />
  </DotIndicator>
);

<Spot icon={NanoGen5} />
<RecoveryKey size={20} />
<IconButton icon={BellWithDot} aria-label='Notifications' />
```

```tsx before
import { ShieldCheckNotification } from '@ledgerhq/lumen-ui-react/symbols';
import bellUrl from '@ledgerhq/lumen-design-core/symbols/bell-notification.svg';
import shieldUrl from '@ledgerhq/lumen-design-core/symbols/shield-check-notification.svg';

<ShieldCheckNotification size={24} />
<img src={bellUrl} alt='' />
```

```tsx after
import { DotIndicator } from '@ledgerhq/lumen-ui-react';
import { ShieldCheck } from '@ledgerhq/lumen-ui-react/symbols';
import bellUrl from '@ledgerhq/lumen-design-core/symbols/bell.svg';
import shieldUrl from '@ledgerhq/lumen-design-core/symbols/shield-check.svg';

<DotIndicator appearance='red' size='md'>
  <ShieldCheck size={24} />
</DotIndicator>
<DotIndicator appearance='red' size='md'>
  <img src={bellUrl} alt='' />
</DotIndicator>
```

## Decide

- `Apex` → `NanoGen5` and `Charon` → `RecoveryKey`: rename, nothing to decide.
  The same for the `apex.svg` / `charon.svg` files.
- `BellNotification` and `ShieldCheckNotification` have no replacement icon.
  Default: the base icon (`Bell`, `ShieldCheck`) wrapped in
  `<DotIndicator appearance='red' size='md'>`. Where the icon is passed as a
  component (`icon` on `IconButton`, `Spot`…), wrap it in a small local
  component that takes the icon's `size` and `className`, as above. If the dot
  only showed a static state, the plain base icon is enough. Confirm with
  design when unsure.
- The two removed SVG files: use `bell.svg` / `shield-check.svg`, and add the
  dot in your own markup.

## Verify

Zero `detect` hits. Typecheck passes. Look at screens that showed these icons,
mainly notification entry points and device or recovery-key illustrations.
