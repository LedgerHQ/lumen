---
changes:
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-react/symbols#Apex'
    to: '@ledgerhq/lumen-ui-react/symbols#NanoGen5'
    signal: loud
    detect:
      - { pattern: 'import\s*(type\s*)?\{[^}]*\bApex\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-react/symbols[''"]' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react/symbols#Charon'
    signal: loud
    detect:
      - { pattern: 'import\s*(type\s*)?\{[^}]*\bCharon\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-react/symbols[''"]' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react/symbols#BellNotification'
    signal: loud
    detect:
      - { pattern: 'import\s*(type\s*)?\{[^}]*\bBellNotification\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-react/symbols[''"]' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react/symbols#ShieldCheckNotification'
    signal: loud
    detect:
      - { pattern: 'import\s*(type\s*)?\{[^}]*\bShieldCheckNotification\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-react/symbols[''"]' }
  - change: renamed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative/symbols#Apex'
    to: '@ledgerhq/lumen-ui-rnative/symbols#NanoGen5'
    signal: loud
    detect:
      - { pattern: 'import\s*(type\s*)?\{[^}]*\bApex\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-rnative/symbols[''"]' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative/symbols#Charon'
    signal: loud
    detect:
      - { pattern: 'import\s*(type\s*)?\{[^}]*\bCharon\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-rnative/symbols[''"]' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative/symbols#BellNotification'
    signal: loud
    detect:
      - { pattern: 'import\s*(type\s*)?\{[^}]*\bBellNotification\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-rnative/symbols[''"]' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative/symbols#ShieldCheckNotification'
    signal: loud
    detect:
      - { pattern: 'import\s*(type\s*)?\{[^}]*\bShieldCheckNotification\b[^}]*\}\s*from\s*[''"]@ledgerhq/lumen-ui-rnative/symbols[''"]' }
  - change: renamed
    surface: module
    ref: '@ledgerhq/lumen-design-core/symbols/apex.svg'
    to: '@ledgerhq/lumen-design-core/symbols/nano-gen5.svg'
    signal: loud
    detect:
      - { pattern: 'lumen-design-core/symbols/apex\.svg' }
  - change: removed
    surface: module
    ref: '@ledgerhq/lumen-design-core/symbols/charon.svg'
    signal: loud
    detect:
      - { pattern: 'lumen-design-core/symbols/charon\.svg' }
  - change: removed
    surface: module
    ref: '@ledgerhq/lumen-design-core/symbols/bell-notification.svg'
    signal: loud
    detect:
      - { pattern: 'lumen-design-core/symbols/bell-notification\.svg' }
  - change: removed
    surface: module
    ref: '@ledgerhq/lumen-design-core/symbols/shield-check-notification.svg'
    signal: loud
    detect:
      - { pattern: 'lumen-design-core/symbols/shield-check-notification\.svg' }
pr: 913
---

## Before → after

Web:

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

<DotIndicator appearance='base' size='md'>
  <ShieldCheck size={24} />
</DotIndicator>
<DotIndicator appearance='red' size='md'>
  <img src={bellUrl} alt='' />
</DotIndicator>
```

React Native: same changes; type the wrapper with the icon's own props.

```tsx before
import { Apex, BellNotification, Charon, ShieldCheckNotification } from '@ledgerhq/lumen-ui-rnative/symbols';

<IconButton icon={BellNotification} accessibilityLabel='Notifications' />
```

```tsx after
import type { ComponentProps } from 'react';
import { DotIndicator } from '@ledgerhq/lumen-ui-rnative';
import { Bell } from '@ledgerhq/lumen-ui-rnative/symbols';

const BellWithDot = (props: ComponentProps<typeof Bell>) => (
  <DotIndicator appearance='red' size='md'>
    <Bell {...props} />
  </DotIndicator>
);

<IconButton icon={BellWithDot} accessibilityLabel='Notifications' />
```

## Decide

- `Apex` → `NanoGen5` (and `apex.svg` → `nano-gen5.svg`): same glyph, nothing
  to decide.
- `Charon` (and `charon.svg`) is gone. `RecoveryKey` / `recovery-key.svg` is
  the design replacement, but a different glyph. Default: use it; check the
  screen still reads right.
- `BellNotification` and `ShieldCheckNotification` have no replacement icon.
  Default: the base icon (`Bell`, `ShieldCheck`) wrapped in a `DotIndicator`
  with `size='md'`. The bell's dot was red: `appearance='red'`. The shield's
  dot was purple, which `DotIndicator` doesn't offer: use `appearance='base'`
  and confirm with design. Where the icon is passed as a component (`icon` on
  `IconButton`, `Spot`…), wrap it in a small local component that forwards
  the icon props, as above. If the dot only showed a static state, the plain
  base icon is enough.
- The two removed SVG files: use `bell.svg` / `shield-check.svg`, and add the
  dot in your own markup.

## Verify

Zero `detect` hits. Typecheck passes. Look at screens that showed these icons:
notification entry points, device and recovery-key illustrations. `Ar`,
`Range`, `Share` and `WalletInput` were redrawn in the same release; glance at
them too.
