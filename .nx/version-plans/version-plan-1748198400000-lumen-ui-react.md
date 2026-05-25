---

## '@ledgerhq/lumen-ui-react': patch

refactor(Menu): migrate from Radix UI to Base UI

## Migration guide (Radix → Base UI Menu)

Use this section when upgrading consumer code. Search the codebase for `Menu`, `MenuTrigger`, `MenuContent`, `MenuPortal`, `asChild`, `onSelect`, `textValue`, and `inset`.

### Quick reference


| Old (Radix)                                          | New (Base UI)                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| `<MenuTrigger asChild><Button /></MenuTrigger>`      | `<MenuTrigger render={<Button />} />`                           |
| `<MenuTrigger>Open</MenuTrigger>`                    | `<MenuTrigger render={<button type="button">Open</button>} />`  |
| `onSelect={(e) => { ... }}` on `MenuItem`            | `onClick={(e) => { ... }}` on `MenuItem`                        |
| `e.preventDefault()` in `onSelect` to keep menu open | `closeOnClick={false}` on the item                              |
| `textValue="..."` on items                           | `label="..."` on items                                          |
| `inset` on `MenuItem`, `MenuLabel`, `MenuSubTrigger` | Removed — use layout/grouping instead                           |
| `asChild` on any Menu part                           | Removed — use `render` on `MenuTrigger` only                    |
| `<MenuPortal><MenuContent /></MenuPortal>`           | `<MenuContent />` (portal is internal)                          |
| `modal` on `Menu`                                    | Removed                                                         |
| `checked="indeterminate"` on `MenuCheckboxItem`      | Removed — `checked` is `boolean` only                           |
| `onOpenChange={(open) => ...}`                       | `onOpenChange={(open, eventDetails) => ...}` (2nd arg optional) |
| `data-[state=open]` / `data-[state=closed]` CSS      | `data-open` / `data-closed`                                     |
| `data-[state=open]` on sub trigger CSS               | `data-popup-open`                                               |
| `focus:` item highlight CSS                          | `data-highlighted:` item highlight CSS                          |


### Removed exports

- `MenuPortal` — no longer exported; `MenuContent` renders its own portal.

### Removed props (delete from consumer code)

`**Menu`:** `modal`

`**MenuTrigger`:** `asChild`, `children` (use `render` instead)

`**MenuContent`:** `asChild`, `loop`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside`, `avoidCollisions`, `collisionBoundary`, `collisionPadding`, `hideWhenDetached`, `ref`

`**MenuItem` / `MenuCheckboxItem` / `MenuRadioItem` / `MenuSubTrigger`:** `asChild`, `inset`, `onSelect`, `textValue`

`**MenuLabel` / `MenuSeparator` / `MenuGroup` / `MenuRadioGroup`:** `asChild`

`**MenuCheckboxItem`:** `checked="indeterminate"`

### Changed defaults

- `MenuContent.sideOffset`: `0` → `4`
- `MenuContent.sticky`: `'partial' \| 'always'` → `boolean` (default `true`)
- `MenuCheckboxItem.closeOnClick`: implicit → defaults to `false` (regular `MenuItem` defaults to `true`)

---

### 1. MenuTrigger — `asChild` → `render` (required)

```tsx
// Before
<MenuTrigger asChild>
  <IconButton icon={MoreVertical} aria-label="Open menu" />
</MenuTrigger>

// After
<MenuTrigger render={<IconButton icon={MoreVertical} aria-label="Open menu" />} />
```

```tsx
// Before — plain text trigger
<MenuTrigger>Open Menu</MenuTrigger>

// After
<MenuTrigger render={<button type="button">Open Menu</button>} />
```

```tsx
// Before — merge trigger props manually
<MenuTrigger asChild>
  <Button appearance="accent">Actions</Button>
</MenuTrigger>

// After — function form when you need to spread trigger props
<MenuTrigger
  render={(props) => (
    <Button {...props} appearance="accent">
      Actions
    </Button>
  )}
/>
```

### 2. MenuItem — `onSelect` → `onClick`, keep-open → `closeOnClick`

```tsx
// Before
<MenuItem onSelect={() => doSomething()}>Action</MenuItem>

// After
<MenuItem onClick={() => doSomething()}>Action</MenuItem>
```

```tsx
// Before — keep menu open after click
<MenuItem
  onSelect={(e) => {
    e.preventDefault();
    toggleOption();
  }}
>
  Toggle
</MenuItem>

// After
<MenuItem closeOnClick={false} onClick={() => toggleOption()}>
  Toggle
</MenuItem>
```

Checkbox items stay open by default (`closeOnClick` defaults to `false`).

### 3. Typeahead label — `textValue` → `label`

```tsx
// Before
<MenuItem textValue="Export as PDF">Export <Badge>New</Badge></MenuItem>

// After
<MenuItem label="Export as PDF">Export <Badge>New</Badge></MenuItem>
```

### 4. MenuPortal — remove wrapper

```tsx
// Before
<MenuPortal>
  <MenuContent>...</MenuContent>
</MenuPortal>

// After
<MenuContent>...</MenuContent>
```

Remove `MenuPortal` from imports.

### 5. Controlled open state — optional 2nd callback arg

```tsx
// Before
<Menu open={open} onOpenChange={setOpen}>

// After — still works; eventDetails is available if needed
<Menu open={open} onOpenChange={(open) => setOpen(open)}>
```

### 6. Full before/after example

```tsx
// Before
import {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuSeparator,
  MenuLabel,
} from '@ledgerhq/lumen-ui-react';

<Menu modal={false}>
  <MenuTrigger asChild>
    <Button>Account</Button>
  </MenuTrigger>
  <MenuPortal>
    <MenuContent sideOffset={4} onPointerDownOutside={handleOutside}>
      <MenuLabel inset>My Account</MenuLabel>
      <MenuSeparator />
      <MenuItem inset onSelect={handleProfile}>Profile</MenuItem>
      <MenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
        Show Panel
      </MenuCheckboxItem>
    </MenuContent>
  </MenuPortal>
</Menu>

// After
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuSeparator,
  MenuLabel,
} from '@ledgerhq/lumen-ui-react';

<Menu>
  <MenuTrigger render={<Button>Account</Button>} />
  <MenuContent sideOffset={4}>
    <MenuLabel>My Account</MenuLabel>
    <MenuSeparator />
    <MenuItem onClick={handleProfile}>Profile</MenuItem>
    <MenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
      Show Panel
    </MenuCheckboxItem>
  </MenuContent>
</Menu>
```

### AI migration checklist

1. Find all `Menu*` imports; remove `MenuPortal`.
2. Replace every `<MenuTrigger asChild>` with `<MenuTrigger render={...} />`.
3. Replace plain-text `<MenuTrigger>` with `render={<button type="button">...</button>}`.
4. Rename `onSelect` → `onClick` on menu items.
5. Replace `e.preventDefault()` keep-open pattern with `closeOnClick={false}`.
6. Rename `textValue` → `label` on items.
7. Remove `inset`, `asChild`, `modal`, and all removed `MenuContent` event/collision props.
8. Remove `<MenuPortal>` wrappers.

