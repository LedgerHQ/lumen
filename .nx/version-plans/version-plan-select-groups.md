---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING CHANGE(Select): migrate from `@radix-ui/react-select` to `@base-ui/react/combobox` with data-driven API

### What changed

**Breaking**

- Migrated underlying library from `@radix-ui/react-select` to `@base-ui/react/combobox`.
- `items` prop is now **mandatory** on `Select`. The component is now data-driven: items are declared as a flat array and rendered via a render function on `SelectList`.
- `SelectList` is now a required wrapper inside `SelectContent`. It accepts a `renderItem` prop `(item) => ReactNode` to render each item.
- `value` type changed from `string` to `string | null`. `onValueChange` now receives `string | null` (`null` when selection is cleared).
- `SelectGroup` and `SelectLabel` are no longer exported. Grouping is now automatic via the `group` field on items.
- `SelectItem.children` changed from `ReactElement<SelectItemTextProps> | readonly ReactElement[]` to `ReactNode`.
- `SelectItem.textValue` prop removed (labels are derived from the `items` array).
- `SelectItemText` now renders a `<span>` instead of a `<div>`.
- `SelectContentProps` removed Radix-specific props: `asChild`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `position`, `avoidCollisions`, `collisionBoundary`, `collisionPadding`, `sticky`, `hideWhenDetached`.
- `SelectContentProps.sideOffset` default changed from `0` to `8`.
- `SelectContentProps.alignOffset` removed.
- `SelectSeparatorProps.asChild` removed.
- `SelectProps.dir` removed.

**New features**

- `filter` prop: custom filter function for search. When `SelectSearch` is present, a default case-insensitive label filter is applied automatically. Pass a custom function to override, or `null` to disable.
- `filteredItems` + `onInputValueChange` props: external/async search support.
- `SelectSearch` component: built-in search input rendered above the list.
- `SelectEmptyState` component: displayed when no items match.
- `SelectTriggerButton` preset: button-style trigger with icon support.
- `render` prop on `SelectTrigger`: custom trigger rendering with `selectedValue` and `selectedContent`.
- `group` field on items: automatic grouping with headers, separators, and per-group filtering.

### Migration

```diff
- import * as Select from '@radix-ui/react-select';
+ import {
+   Select,
+   SelectTrigger,
+   SelectContent,
+   SelectList,
+   SelectItem,
+   SelectItemText,
+ } from '@ledgerhq/lumen-ui-react';

- const [value, setValue] = useState('');
+ const [value, setValue] = useState<string | null>(null);

+ const options = [
+   { value: 'opt1', label: 'Option 1' },
+   { value: 'opt2', label: 'Option 2' },
+ ];

- <Select.Root value={value} onValueChange={setValue}>
-   <Select.Trigger>
-     <Select.Value placeholder="Pick one" />
-   </Select.Trigger>
-   <Select.Content>
-     <Select.Item value="opt1">
-       <Select.ItemText>Option 1</Select.ItemText>
-     </Select.Item>
-     <Select.Item value="opt2">
-       <Select.ItemText>Option 2</Select.ItemText>
-     </Select.Item>
-   </Select.Content>
- </Select.Root>
+ <Select items={options} value={value} onValueChange={setValue}>
+   <SelectTrigger label='Pick one' />
+   <SelectContent>
+     <SelectList
+       renderItem={(item) => (
+         <SelectItem key={item.value} value={item.value}>
+           <SelectItemText>{item.label}</SelectItemText>
+         </SelectItem>
+       )}
+     />
+   </SelectContent>
+ </Select>
```

**Grouped items** — replace manual `SelectGroup` / `SelectLabel` with the `group` field:

```diff
- <SelectGroup>
-   <SelectLabel>Fruits</SelectLabel>
-   {fruits.map((item) => (
-     <SelectItem key={item.value} value={item.value}>
-       <SelectItemText>{item.label}</SelectItemText>
-     </SelectItem>
-   ))}
- </SelectGroup>
- <SelectSeparator />
- <SelectGroup>
-   <SelectLabel>Vegetables</SelectLabel>
-   ...
- </SelectGroup>
+ const items = [
+   { value: 'apple', label: 'Apple', group: 'Fruits' },
+   { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
+ ];
+ // Same render function — grouping is automatic
```
