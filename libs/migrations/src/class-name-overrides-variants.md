---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Banner.className'
    signal: visual
    detect:
      - { pattern: '<Banner\b(?:[^>]|=>)*?\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#CardButton.className'
    signal: visual
    detect:
      - { pattern: '<CardButton\b(?:[^>]|=>)*?\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react/Icon#Icon.className'
    signal: visual
    detect:
      - { pattern: '<Icon\b(?:[^>]|=>)*?\bclassName=', expect: review }
      - { pattern: 'lumen-ui-react/symbols[''"]', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#InteractiveIcon.className'
    signal: visual
    detect:
      - { pattern: '<InteractiveIcon\b(?:[^>]|=>)*?\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Link.className'
    signal: visual
    detect:
      - { pattern: '<Link\b(?:[^>]|=>)*?\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Spot.className'
    signal: visual
    detect:
      - { pattern: '<Spot\b(?:[^>]|=>)*?\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Switch.className'
    signal: visual
    detect:
      - { pattern: '<Switch\b(?:[^>]|=>)*?\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Tag.className'
    signal: visual
    detect:
      - { pattern: '<Tag\b(?:[^>]|=>)*?\bclassName=', expect: review }
pr: 638
---

## Before → after

```tsx before
import { Close, Settings, Wallet } from '@ledgerhq/lumen-ui-react/symbols';

<Banner className='p-0' title='Backup' />
<Tag className='rounded-full' label='New' />
<Icon className='block' viewBox='0 0 24 24'>…</Icon>
<Settings className='hidden md:block' />
<InteractiveIcon className='text-error' iconType='stroked' icon={Close} aria-label='Close' />
<Spot className='bg-muted' appearance='icon' icon={Wallet} />
<Link appearance='accent' className='text-muted' href='/help'>Help</Link>
<CardButton className='w-1/2' title='Buy' />
<Switch className='mx-8' />
```

```tsx after
import { Close, Settings, Wallet } from '@ledgerhq/lumen-ui-react/symbols';

<Banner title='Backup' />
<Tag label='New' />
<Icon viewBox='0 0 24 24'>…</Icon>
<Settings className='md:block' />
<InteractiveIcon iconType='stroked' icon={Close} aria-label='Close' />
<Spot appearance='icon' icon={Wallet} />
<Link appearance='accent' href='/help'>Help</Link>
<CardButton title='Buy' />
<Switch className='mx-8' />
```

## Decide

On these components, and on every symbol (they render `Icon`), `className`
now comes after the component's own classes. When tailwind-merge sees a
`className` class and a component class as conflicting (same property, same
variant prefix), the `className` one now wins; before, it was dropped.

For each hit, find the `className` classes that conflict with a class the
component emits for the props used: padding, width, height, max-width,
`size-*`, `shrink`, text color, background, radius, display. If the screen
looked right before, that class had no effect: remove it (the default). Keep
it only if the new look is what was intended.

Leave the rest: classes with no conflicting component class (margin,
position, a color on a `Link` with no `appearance`) applied before and still
do. So does a text color where the component's own is `text-base`:
tailwind-merge reads `text-base` as a font size. Size classes on `Icon`,
symbols and `Spot` are unaffected too: their `icon-*` and `spot-*` size
utilities are unknown to tailwind-merge, so nothing was dropped.

## Verify

Review every `detect` hit; for symbol imports, check each symbol with a
`className`. Open the screens using them: each component looks as it did, or
as intended.
