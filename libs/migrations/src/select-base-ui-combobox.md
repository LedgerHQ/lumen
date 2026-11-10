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
      - { pattern: '<SelectContent\b[^>]*>(?:(?!</SelectContent>|<SelectList\b)[\s\S])*?<Select(Item|Group|Label|Separator)\b' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Select.onValueChange'
    signal: loud # receives string | null
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectTriggerRenderProps.selectedValue'
    signal: silent # null instead of '' when nothing is selected
    detect:
      - { pattern: 'selectedValue\s*[!=]==?\s*(''''|"")' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SelectContent.sideOffset'
    signal: visual # the extra 8px translate is gone: explicit values sit 8px closer
    detect:
      - { pattern: '<SelectContent\b[^>]*\bsideOffset=', expect: review }
  - change: changed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#SelectItemText'
    signal: visual # no longer text-muted
    detect:
      - { pattern: '<SelectItemText\b', expect: review }
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
  <SelectContent position='popper' sideOffset={4}>
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
</Select>;
```

```tsx after
const [value, setValue] = useState<string | null>(null);

const networks = [
  { value: 'btc', label: 'Bitcoin', group: 'Popular' },
  { value: 'eth', label: 'Ethereum' },
];

<Select items={networks} value={value} onValueChange={setValue}>
  <SelectTrigger label='Network' />
  <SelectContent sideOffset={12}>
    <SelectList
      renderItem={(item) => (
        <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
          <SelectItemText>{item.label}</SelectItemText>
        </SelectItem>
      )}
    />
  </SelectContent>
</Select>;
```

```tsx before
<SelectTrigger render={({ selectedValue, selectedContent }) => <button type='button'>{selectedValue === '' ? 'Network' : selectedContent}</button>} />
```

```tsx after
<SelectTrigger render={({ selectedValue, selectedContent }) => <button type='button'>{selectedValue === null ? 'Network' : selectedContent}</button>} />
```

## Decide

- Build `items` (`{ value, label, group?, disabled?, description? }`) from the
  options the JSX listed, usually the array it already mapped over. `label` is
  the text shown and searched, so use the old `textValue` or item text.
- Move the item JSX into `<SelectList renderItem>`, with custom content
  (icons, extra elements). An item's `disabled` and `description` do nothing
  on their own: pass `disabled={item.disabled}` to `SelectItem`, and render
  `item.description` yourself (e.g. with the new `SelectItemContent`/`SelectItemDescription`).
- `SelectGroup` + `SelectLabel` → `group: '<label>'` on each item in that
  group. Separators between groups are automatic: drop those `SelectSeparator`s.
  Groups render in first-occurrence order, and all ungrouped items render
  together where the first one sits: order `items` accordingly.
- `value` and `onValueChange` are `string | null`. Initialize state with
  `null` instead of `''`, and handle `null` (cleared) in handlers and code
  that reads the value. A `SelectTrigger render` function gets
  `selectedValue: null`, not `''`, when nothing is selected.
- Drop `dir`, `textValue`, `SelectSeparator asChild` and the Radix-only
  `SelectContent` props. Keep `side`, `sideOffset`, `align`. `onOpenChange`
  on `Select` only observes open/close. To prevent a close (old
  `preventDefault` in `onEscapeKeyDown`/`onPointerDownOutside`), control
  `open` and ignore `false`, with no per-cause handling. `onCloseAutoFocus`
  has no replacement.
- Visual: the default gap is unchanged, but an explicit `sideOffset` no
  longer gets an extra 8px: add 8 to keep the gap. The content background is
  `bg-surface` (was `bg-muted`), item text is no longer muted, the check sits
  in the item's flow, and the scroll buttons are gone.
- `@radix-ui/react-select` is no longer a peer: remove it if nothing else
  imports it.

## Verify

Zero non-review `detect` hits; review hits are checked visually. Typecheck
passes. Open each select: options, groups,
selection, the empty state and keyboard navigation work, and the selected
label shows in the trigger.
