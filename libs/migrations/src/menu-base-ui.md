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
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuCheckboxItem.closeOnClick'
    signal: silent # checkbox items now keep the menu open
    detect:
      - { pattern: '<MenuCheckboxItem\b', expect: review }
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
<Menu modal={false}>
  <MenuTrigger asChild>
    <IconButton icon={MoreVertical} aria-label='Actions' />
  </MenuTrigger>
  <MenuPortal>
    <MenuContent collisionPadding={8} onCloseAutoFocus={(e) => e.preventDefault()}>
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
    </MenuContent>
  </MenuPortal>
</Menu>
```

```tsx after
<Menu>
  <MenuTrigger render={<IconButton icon={MoreVertical} aria-label='Actions' />} />
  <MenuContent>
    <MenuItem onClick={rename}>Rename</MenuItem>
    <MenuItem label='Export' closeOnClick={false} onClick={exportFile}>
      Export <Tag label='New' />
    </MenuItem>
    <MenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
      Pin
    </MenuCheckboxItem>
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
- `MenuCheckboxItem` now keeps the menu open on click. Pass `closeOnClick`
  where the menu must close after toggling; otherwise keep the new behavior
  (the default).
- `checked='indeterminate'` is gone: pass a boolean.
- Drop `MenuPortal` (content portals itself), `modal`, `inset`, `asChild` and
  the Radix positioning and event props on `MenuContent` / `MenuSubContent`.
  `MenuSubContent` takes only `className` and `children`. If a removed handler
  held needed behavior (e.g. `onEscapeKeyDown`), use `onOpenChange` on `Menu`.
- `MenuContent` `sticky='partial' | 'always'` → `sticky` (boolean, default
  `true`).
- Styles keyed on Radix `data-state` attributes (e.g. `data-[state=open]:` on
  the trigger element) no longer match. Use `data-popup-open` instead.
- `PopoverTrigger` must always get `render`.
- `@radix-ui/react-dropdown-menu` is no longer used by Lumen: remove it if
  nothing else imports it.

## Verify

Zero `detect` hits, and every `MenuCheckboxItem` hit reviewed. Typecheck
passes. Open each menu: it opens from its trigger, items run their action,
items meant to keep the menu open do, and keyboard navigation works.
