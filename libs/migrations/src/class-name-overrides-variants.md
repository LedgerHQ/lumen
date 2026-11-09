---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Banner.className'
    signal: visual
    detect:
      - { pattern: '<Banner\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#CardButton.className'
    signal: visual
    detect:
      - { pattern: '<CardButton\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Icon.className'
    signal: visual # also every symbol from @ledgerhq/lumen-ui-react/symbols
    detect:
      - { pattern: '<Icon\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#InteractiveIcon.className'
    signal: visual
    detect:
      - { pattern: '<InteractiveIcon\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Link.className'
    signal: visual
    detect:
      - { pattern: '<Link\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Spot.className'
    signal: visual
    detect:
      - { pattern: '<Spot\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Switch.className'
    signal: visual
    detect:
      - { pattern: '<Switch\b[^>]*\bclassName=', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Tag.className'
    signal: visual
    detect:
      - { pattern: '<Tag\b[^>]*\bclassName=', expect: review }
pr: 638
---

## Before → after

```tsx before
<Banner className='p-0' title='Backup' />
<Tag className='rounded-full' label='New' />
<Icon className='block' viewBox='0 0 24 24'>…</Icon>
<InteractiveIcon className='text-error' iconType='stroked' icon={Close} aria-label='Close' />
<Spot className='bg-muted' appearance='icon' icon={Wallet} />
<Link className='text-muted' href='/help'>Help</Link>
<Switch className='mx-8' />
<CardButton className='w-full' title='Buy' />
```

```tsx after
<Banner title='Backup' />
<Tag label='New' />
<Icon viewBox='0 0 24 24'>…</Icon>
<InteractiveIcon iconType='stroked' icon={Close} aria-label='Close' />
<Spot appearance='icon' icon={Wallet} />
<Link href='/help'>Help</Link>
<Switch className='mx-8' />
<CardButton className='w-full' title='Buy' />
```

## Decide

On these components, and on every symbol (they render `Icon`), a `className`
class now wins over the component's own class for the same property. Before,
the component's class won and the override did nothing.

For each hit, look at the classes that set what the component already sets
(padding, size, color, background, radius, display). If the screen looked
right before, that class had no effect: remove it (the default). Keep it only
if the new look is what was intended. Layout classes (margin, width,
position) are unaffected: leave them.

## Verify

Review every `detect` hit, and symbols with a `className` that sets size,
color or display. Open the screens using them: each component looks as it
did, or as intended.
