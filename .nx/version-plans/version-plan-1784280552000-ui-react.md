---
'@ledgerhq/lumen-ui-react': patch
---

feat(Table): replace TableCellContent slot API with TableCellItem compound components

BREAKING CHANGE: `TableCellContent`'s `leadingContent`, `title`, `description`
and `align` props are removed in favor of a compound API (like `Card` /
`ListItem`). New exports: `TableCellItem` (root, accepts `align`),
`TableCellContent` (text column), `TableCellContentTitle`,
`TableCellContentDescription`, `TableCellContentRow` (for richer rows, e.g. a
description next to a `Tag`).

The leading element is now a bare child of `TableCellItem` and must be
fixed-size (icon, `Spot`, crypto-icon).

## Migration

```tsx
// Before
<TableCellContent
  leadingContent={<Spot appearance="icon" icon={Android} />}
  title="Bitcoin"
  description="BTC"
/>

// After
<TableCellItem>
  <Spot appearance="icon" icon={Android} />
  <TableCellContent>
    <TableCellContentTitle>Bitcoin</TableCellContentTitle>
    <TableCellContentDescription>BTC</TableCellContentDescription>
  </TableCellContent>
</TableCellItem>
```

- `leadingContent={<X />}` -> first child of `TableCellItem`
- `title` -> `TableCellContentTitle`
- `description` -> `TableCellContentDescription`
- `align="end"` -> `align="end"` on `TableCellItem`
