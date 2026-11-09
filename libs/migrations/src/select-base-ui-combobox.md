---
changes:
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Select.items'
    signal: loud
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.children'
    signal: silent # SelectItem children still compile but must move into SelectList
    detect:
      - { pattern: '<SelectContent\b[^>]*>\s*(\{[^}]*)?<Select(Item|Group)\b' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Select.onValueChange'
    signal: loud # receives string | null
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectGroup'
    signal: loud
    detect:
      - { pattern: '\bSelectGroup\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectGroupProps'
    signal: loud
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectLabel'
    signal: loud
    detect:
      - { pattern: '\bSelectLabel\b' }
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectLabelProps'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Select.dir'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectItem.textValue'
    signal: loud
    detect:
      - { pattern: '<SelectItem\b[^>]*\btextValue=' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectSeparator.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.asChild'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.position'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.alignOffset'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.avoidCollisions'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.collisionBoundary'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.collisionPadding'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.sticky'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.hideWhenDetached'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.onCloseAutoFocus'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.onEscapeKeyDown'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.onPointerDownOutside'
    signal: loud
pr: 599
---

## Before → after

```tsx before
const [value, setValue] = useState('');

<Select value={value} onValueChange={setValue}>
  <SelectTrigger label='Network' />
  <SelectContent position='popper'>
    <SelectGroup>
      <SelectLabel>Popular</SelectLabel>
      <SelectItem value='btc' textValue='Bitcoin'>
        <SelectItemText>Bitcoin</SelectItemText>
      </SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectItem value='eth'>
      <SelectItemText>Ethereum</SelectItemText>
    </SelectItem>
  </SelectContent>
</Select>
```

```tsx after
const [value, setValue] = useState<string | null>(null);

const networks = [
  { value: 'btc', label: 'Bitcoin', group: 'Popular' },
  { value: 'eth', label: 'Ethereum' },
];

<Select items={networks} value={value} onValueChange={setValue}>
  <SelectTrigger label='Network' />
  <SelectContent>
    <SelectList
      renderItem={(item) => (
        <SelectItem key={item.value} value={item.value}>
          <SelectItemText>{item.label}</SelectItemText>
        </SelectItem>
      )}
    />
  </SelectContent>
</Select>
```

## Decide

- Build `items` (`{ value, label, group?, disabled?, description? }`) from the
  options the JSX listed, usually the array it already mapped over. `label` is
  the text shown and searched, so use the old `textValue` or item text.
- Move the item JSX into `<SelectList renderItem>`. Keep custom item content
  (icons, `SelectItemContent`/`SelectItemDescription`) inside `renderItem`.
- `SelectGroup` + `SelectLabel` → `group: '<label>'` on each item in that
  group. Separators between groups are automatic: drop those `SelectSeparator`s.
- `value` and `onValueChange` are `string | null`. Initialize state with
  `null` instead of `''`, and handle `null` (cleared) in handlers and code
  that reads the value.
- Drop `dir`, `textValue`, `SelectSeparator asChild` and the Radix-only
  `SelectContent` props. Keep `side`, `sideOffset`, `align`. If a removed
  prop held needed behavior (e.g. `onEscapeKeyDown`), use `onOpenChange` on
  `Select` instead.
- `@radix-ui/react-select` is no longer a peer: remove it if nothing else
  imports it.

## Verify

Zero `detect` hits. Typecheck passes. Open each select: options, groups,
selection, the empty state and keyboard navigation work, and the selected
label shows in the trigger.
