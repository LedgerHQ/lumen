---
'@ledgerhq/lumen-ui-react': patch
---

refactor(Menu): migrate from Radix UI to Base UI

## Migration guide (Radix → Base UI Menu)

### Dependency

Add the new peer dependency:

```bash
npm install @base-ui/react
```

`@radix-ui/react-dropdown-menu` is no longer used by `@ledgerhq/lumen-ui-react`.

### Removed props (delete from consumer code)

**`Menu`:** `modal`

**`MenuTrigger`:** `asChild`, `children` (use `render` instead)

**`MenuContent`:** `asChild`, `loop`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside`, `avoidCollisions`, `collisionBoundary`, `collisionPadding`, `hideWhenDetached`, `ref`

**`MenuItem` / `MenuCheckboxItem` / `MenuRadioItem` / `MenuSubTrigger`:** `asChild`, `inset`, `onSelect`, `textValue`

**`MenuLabel` / `MenuSeparator` / `MenuGroup` / `MenuRadioGroup`:** `asChild`

**`MenuCheckboxItem`:** `checked="indeterminate"`

### Changed defaults

- `MenuContent.sideOffset`: documented default `0` → `4` (runtime default was already `4` in the previous implementation)
- `MenuContent.sticky`: `'partial' | 'always'` → `boolean` (default `true`)
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

### 4. Controlled open state — optional 2nd callback arg

```tsx
// Before
<Menu open={open} onOpenChange={setOpen}>

// After — still works; eventDetails is available if needed
<Menu open={open} onOpenChange={(open) => setOpen(open)}>
```

### 5. Full before/after example

```tsx
// Before
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup,
} from '@ledgerhq/lumen-ui-react';

<Menu>
  <MenuTrigger asChild>
    <Button appearance="gray">Account</Button>
  </MenuTrigger>
  <MenuContent className="w-208">
    <MenuGroup>
      <MenuLabel>My Account</MenuLabel>
      <MenuItem onSelect={handleProfile}>Profile</MenuItem>
      <MenuItem>Billing</MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
      Show Panel
    </MenuCheckboxItem>
  </MenuContent>
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
  MenuGroup,
} from '@ledgerhq/lumen-ui-react';

<Menu>
  <MenuTrigger render={<Button appearance="gray">Account</Button>} />
  <MenuContent className="w-208">
    <MenuGroup>
      <MenuLabel>My Account</MenuLabel>
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
      <MenuItem>Billing</MenuItem>
    </MenuGroup>
    <MenuSeparator />
    <MenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
      Show Panel
    </MenuCheckboxItem>
  </MenuContent>
</Menu>
```

### AI migration checklist

1. Replace every `<MenuTrigger asChild>` with `<MenuTrigger render={...} />`.
2. Replace plain-text `<MenuTrigger>` with `render={<button type="button">...</button>}`.
3. Rename `onSelect` → `onClick` on menu items.
4. Replace `e.preventDefault()` keep-open pattern with `closeOnClick={false}`.
5. Rename `textValue` → `label` on items.
6. Remove `inset`, `asChild`, `modal`, and all removed `MenuContent` event/collision props.
7. Install `@base-ui/react` peer dependency.
8. Uninstall `@radix-ui/react-dropdown-menu` if it was added only for Menu.
