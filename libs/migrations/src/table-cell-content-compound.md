---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableCellContent.leadingContent'
    signal: loud
    detect:
      - { pattern: '<TableCellContent\b[^>]*\b(leadingContent|title|description|align)=' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableCellContent.title'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableCellContent.description'
    signal: loud
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableCellContent.align'
    signal: loud
  - change: required
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableCellContent.children'
    signal: loud
pr: 803
---

## Before → after

```tsx before
<TableCell>
  <TableCellContent
    align='end'
    leadingContent={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />}
    title='Bitcoin'
    description='BTC'
  />
</TableCell>
```

```tsx after
<TableCell>
  <TableCellItem align='end'>
    <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />
    <TableCellContent>
      <TableCellContentTitle>Bitcoin</TableCellContentTitle>
      <TableCellContentDescription>BTC</TableCellContentDescription>
    </TableCellContent>
  </TableCellItem>
</TableCell>
```

## Decide

`TableCellContent` is now the text column only. Rewrite each props call:

- `leadingContent` or `align` set: wrap in `TableCellItem`, move `align` to it,
  and put the leading element first, before `TableCellContent`.
- Neither set: `TableCellItem` is optional; keep `TableCellContent` alone.
- `title` → `TableCellContentTitle` child, `description` →
  `TableCellContentDescription` child. Skip a child whose prop was absent.
- `className` stays on the element that had it. Default: on `TableCellItem`
  when you add one, since it now holds the old outer layout.

Import the new parts from `@ledgerhq/lumen-ui-react`. `TableCellContentRow`
is new, for a description next to extra content such as a `Tag`; use it only
where the app built that by hand.

## Verify

Zero `detect` hits. Typecheck passes. Tables look as before: leading icons,
titles, descriptions and end-aligned cells in place.
