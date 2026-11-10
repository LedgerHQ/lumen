---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuTrigger.asChild'
    signal: loud
    detect:
      - { pattern: '<MenuTrigger\b[^>]*\basChild' }
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuTrigger.render'
    signal: loud # children are no longer accepted
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuItem.onSelect'
    to: '@ledgerhq/lumen-ui-react#MenuItem.onClick'
    signal: silent # onSelect is still a valid DOM prop but no longer runs on activation
    detect:
      - { pattern: '<Menu(Item|CheckboxItem|RadioItem|SubTrigger)\b[^>]*\bonSelect=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuItem.textValue'
    to: '@ledgerhq/lumen-ui-react#MenuItem.label'
    signal: loud
    detect:
      - { pattern: '<Menu(Item|CheckboxItem|RadioItem|SubTrigger)\b[^>]*\btextValue=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuCheckboxItem.textValue'
    to: '@ledgerhq/lumen-ui-react#MenuCheckboxItem.label'
    signal: loud
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuRadioItem.textValue'
    to: '@ledgerhq/lumen-ui-react#MenuRadioItem.label'
    signal: loud
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubTrigger.textValue'
    to: '@ledgerhq/lumen-ui-react#MenuSubTrigger.label'
    signal: loud
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuCheckboxItem.closeOnClick'
    signal: silent # checkbox items now keep the menu open
    detect:
      - { pattern: '<MenuCheckboxItem\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuRadioItem.closeOnClick'
    signal: silent # radio items now keep the menu open
    detect:
      - { pattern: '<MenuRadioItem\b', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MenuLabel'
    signal: silent # throws at runtime outside a MenuGroup
    detect:
      - { pattern: '<MenuLabel\b', expect: review }
  - change: removed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#MenuCheckboxItem.checked=indeterminate'
    signal: loud
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MenuPortal'
    signal: loud
    detect:
      - { pattern: '\bMenuPortal\b' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Menu.modal'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuItem.inset'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuItem.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuCheckboxItem.inset'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuCheckboxItem.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuRadioItem.inset'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuRadioItem.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubTrigger.inset'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubTrigger.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuLabel.inset'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuLabel.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSeparator.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuGroup.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuRadioGroup.asChild'
    signal: loud
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MenuContent'
    signal: silent # data-* and aria-* still typecheck but are dropped
    detect:
      - { pattern: '<Menu(Sub)?Content\b[^>]*\b(data|aria)-', expect: review }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.ref'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.ref'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.loop'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.onCloseAutoFocus'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.onEscapeKeyDown'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.onPointerDownOutside'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.onFocusOutside'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.onInteractOutside'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.avoidCollisions'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.collisionBoundary'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.collisionPadding'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.hideWhenDetached'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.loop'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.alignOffset'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.avoidCollisions'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.collisionBoundary'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.collisionPadding'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.sticky'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuSubContent.hideWhenDetached'
    signal: loud
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuContent.sticky'
    signal: loud # 'partial' | 'always' → boolean
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-react#PopoverTrigger.render'
    signal: loud
pr: 702
---

## Before → after

```tsx before
<Menu>
  <MenuTrigger asChild>
    <IconButton icon={MoreVertical} aria-label='Actions' />
  </MenuTrigger>
  <MenuPortal>
    <MenuContent collisionPadding={8} data-testid='actions-menu'>
      <MenuItem onSelect={rename}>Rename</MenuItem>
      <MenuItem
        textValue='Export'
        onSelect={(e) => {
          e.preventDefault();
          exportFile();
        }}
      >
        Export <Tag label='New' />
      </MenuItem>
      <MenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
        Pin
      </MenuCheckboxItem>
      <MenuLabel>Sort</MenuLabel>
      <MenuRadioGroup value={sort} onValueChange={setSort}>
        <MenuRadioItem value='name'>By name</MenuRadioItem>
        <MenuRadioItem value='date'>By date</MenuRadioItem>
      </MenuRadioGroup>
    </MenuContent>
  </MenuPortal>
</Menu>
```

```tsx after
<Menu>
  <MenuTrigger render={<IconButton icon={MoreVertical} aria-label='Actions' />} />
  <MenuContent>
    <MenuGroup data-testid='actions-menu'>
      <MenuItem onClick={rename}>Rename</MenuItem>
      <MenuItem label='Export' closeOnClick={false} onClick={exportFile}>
        Export <Tag label='New' />
      </MenuItem>
      <MenuCheckboxItem checked={pinned} onCheckedChange={setPinned} closeOnClick>
        Pin
      </MenuCheckboxItem>
      <MenuGroup>
        <MenuLabel>Sort</MenuLabel>
        <MenuRadioGroup value={sort} onValueChange={setSort}>
          <MenuRadioItem value='name' closeOnClick>
            By name
          </MenuRadioItem>
          <MenuRadioItem value='date' closeOnClick>
            By date
          </MenuRadioItem>
        </MenuRadioGroup>
      </MenuGroup>
    </MenuGroup>
  </MenuContent>
</Menu>
```

## Decide

- `MenuTrigger`: move the `asChild` child into `render`. A plain-text trigger
  becomes `render={<button type='button'>Text</button>}`. When the child needs
  the trigger props merged by hand, use the function form
  `render={(props) => <Button {...props} />}`.
- Menu items: rename every `onSelect` to `onClick`. An `onSelect` that called
  `e.preventDefault()` to keep the menu open becomes `closeOnClick={false}`
  with the `preventDefault` call removed. `textValue` → `label`.
- `MenuCheckboxItem` and `MenuRadioItem` now keep the menu open on click. Pass
  `closeOnClick` where the menu must close after a choice; otherwise keep the
  new behavior (the default).
- `checked='indeterminate'` is gone: pass a boolean.
- `MenuLabel` now throws outside a `MenuGroup`: wrap it with the items it
  labels in a `MenuGroup`.
- Drop `MenuPortal` (content portals itself), `inset`, `asChild` and the Radix
  positioning and event props on `MenuContent` / `MenuSubContent`.
- `MenuContent` accepts only `className`, `children`, `side`, `sideOffset`,
  `align`, `alignOffset` and `sticky`; `MenuSubContent` only `className` and
  `children`. Neither takes `ref`, `style`, `id` or handlers, and `data-*` /
  `aria-*` still compile but are dropped. Move test ids and labels to a
  `MenuGroup` around the items, an item, or the trigger.
- `Menu` is always modal now. `modal={false}` has no replacement: drop it and
  flag the call site for review.
- `onEscapeKeyDown` / `onInteractOutside` logic moves to `onOpenChange` on
  `Menu`: check `eventDetails.reason`, and call `eventDetails.cancel()` to keep
  it open. Preventing focus return on close (`onCloseAutoFocus`) has no
  replacement.
- `MenuContent` `sticky='partial' | 'always'` → `sticky` (boolean, default
  `true`).
- Styles keyed on Radix `data-state` no longer match: `data-[state=open]` on
  the trigger or sub-trigger → `data-popup-open`, on content →
  `data-open` / `data-closed`; `data-[state=checked]` on items → `data-checked`.
- A `z-*` class on `MenuContent` no longer lifts the menu: `z-menu` now sits on
  the positioning wrapper.
- `PopoverTrigger` must always get `render`. One without it becomes
  `render={<button type='button' />}`.
- `@radix-ui/react-dropdown-menu` is no longer used by Lumen: remove it if
  nothing else imports it.

## Verify

Zero `detect` hits, and every `MenuCheckboxItem`, `MenuRadioItem`,
`MenuLabel` and `MenuContent` / `MenuSubContent` hit reviewed. Typecheck passes. Open each
menu: it opens from its trigger, items run their action, items meant to keep
the menu open do, and keyboard navigation works.
