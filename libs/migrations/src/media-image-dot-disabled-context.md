---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MediaImage'
    signal: visual # dims to 30% inside a disabled Card, Tile, ListItem or MenuItem
    detect:
      - { pattern: '<MediaImage\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#DotIcon'
    signal: visual
    detect:
      - { pattern: '<DotIcon\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#DotSymbol'
    signal: visual
    detect:
      - { pattern: '<DotSymbol\b', expect: review }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaButton.data-disabled'
    signal: silent # selectors on it compile and stop matching
    detect:
      - { pattern: 'data-\[disabled\]|\[data-disabled\]', expect: review }
pr: 712
---

## Before → after

```tsx before
<ListItem disabled>
  <ListItemLeading>
    <MediaImage src={logo} alt='' className='opacity-30' />
  </ListItemLeading>
</ListItem>
<Tile disabled>
  <DotIcon appearance='success' icon={Check}>{coin}</DotIcon>
  <DotSymbol src={networkLogo} alt=''>{coin}</DotSymbol>
</Tile>
<MediaButton className='data-[disabled]:opacity-50'>Bitcoin</MediaButton>
```

```tsx after
<ListItem disabled>
  <ListItemLeading>
    <MediaImage src={logo} alt='' />
  </ListItemLeading>
</ListItem>
<Tile disabled>
  <DotIcon appearance='success' icon={Check}>{coin}</DotIcon>
  <DotSymbol src={networkLogo} alt=''>{coin}</DotSymbol>
</Tile>
<MediaButton className='disabled:opacity-50'>Bitcoin</MediaButton>
```

## Decide

- `MediaImage`, `DotIcon` and `DotSymbol` now read the disabled context and
  dim to 30% opacity, also when they get `disabled` directly. Inside a
  disabled `Card`, `Tile`, `ListItem` or `MenuItem`, remove any dimming the
  app added by hand (it would now apply twice). Otherwise leave them as is
  (the default).
- `MediaButton` no longer sets `data-disabled`. Replace `data-[disabled]:`
  classes or `[data-disabled]` selectors that target a `MediaButton` with
  `disabled:` / `:disabled`. Leave hits on other elements alone.

## Verify

Every `detect` hit reviewed. Open screens with disabled lists, cards or tiles
that show media images or dot badges: they are dimmed once, not twice.
