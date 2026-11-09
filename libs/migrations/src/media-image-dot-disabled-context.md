---
changes:
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MediaImage'
    signal: visual # dims to 30% when disabled, also through the disabled context
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
    signal: silent # selectors and assertions on it compile and stop matching
    detect:
      - { pattern: 'data-disabled\b|data-\[disabled\]|dataset\.disabled', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#MediaImage'
    signal: visual # dims to 30% when disabled, also through the disabled context
    detect:
      - { pattern: '<MediaImage\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#DotIcon'
    signal: visual
    detect:
      - { pattern: '<DotIcon\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-rnative#DotSymbol'
    signal: visual
    detect:
      - { pattern: '<DotSymbol\b', expect: review }
pr: 712
---

## Before → after

```tsx before
<ListItem disabled>
  <ListItemLeading>
    <div className='opacity-30'>
      <MediaImage src={logo} alt='' />
    </div>
  </ListItemLeading>
</ListItem>
<Tile disabled>
  <DotIcon appearance='success' icon={Check}>
    <MediaImage src={logo} alt='' className='opacity-30' />
  </DotIcon>
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
  <DotIcon appearance='success' icon={Check}>
    <MediaImage src={logo} alt='' />
  </DotIcon>
</Tile>
<MediaButton className='disabled:opacity-50'>Bitcoin</MediaButton>
```

React Native:

```tsx before
<Tile disabled>
  <View style={{ opacity: 0.3 }}>
    <MediaImage src={logo} alt='' />
  </View>
  <DotSymbol src={networkLogo} alt=''>
    <MediaImage src={logo} alt='' style={{ opacity: 0.3 }} />
  </DotSymbol>
</Tile>
```

```tsx after
<Tile disabled>
  <MediaImage src={logo} alt='' />
  <DotSymbol src={networkLogo} alt=''>
    <MediaImage src={logo} alt='' />
  </DotSymbol>
</Tile>
```

## Decide

- `MediaImage`, `DotIcon` and `DotSymbol` now dim to 30% opacity when
  `disabled` is set or a Lumen container provides the disabled context
  (`Card`, `Tile`, `ListItem`, the `Menu` items; on React Native also
  `OptionList` and the inputs). Inside such a container, remove the dimming
  the app added by hand:
  - on an element wrapping them: it now stacks with Lumen's;
  - on the component itself (`className`, `style`, `lx`): redundant, and a
    different value overrides Lumen's 30%.
- `DotIcon` and `DotSymbol` reset the context for their children, so the
  child no longer reads the container as disabled and only the root dims.
  Remove dimming on the child, and don't pass `disabled` to both: it stacks.
- Elsewhere, leave them as is (the default).
- Web `MediaButton` no longer sets `data-disabled`. On a `MediaButton`, replace
  `data-disabled:` / `data-[disabled]:` classes and `[data-disabled]`
  selectors with `disabled:` / `:disabled`, and test assertions on the
  attribute with `toBeDisabled()`. With `asChild` on a non-button element,
  `:disabled` and `toBeDisabled()` never match: use the `disabled` attribute
  it still receives (`[disabled]`, `toHaveAttribute('disabled')`). Leave
  hits on other elements alone.

## Verify

Every `detect` hit reviewed. Open screens with disabled lists, cards or tiles
that show media images or dot badges: they are dimmed once, not twice. On
React Native, these components now always set `accessibilityState.disabled`:
update snapshots that include them.
