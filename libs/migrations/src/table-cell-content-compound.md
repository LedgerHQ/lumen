---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableCellContent.leadingContent'
    signal: loud
    detect:
      - { pattern: '<TableCellContent\b(?:[^>]|=>)*?\b(leadingContent|title|description|align)=' }
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableCellContent.title'
    signal: silent # a string title is still a valid DOM attribute
    detect:
      - { pattern: '<TableCellContent\b(?:[^>]|=>)*?\btitle=' }
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
  <TableCellContent align='end' title='Bitcoin' description='BTC' leadingContent={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />} />
</TableCell>
```

```tsx after
<TableCell>
  <TableCellItem align='end'>
    <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />
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
  and put the leading element first, before `TableCellContent`. It is no
  longer wrapped in `shrink-0`: keep it fixed-size (icon, `Spot`,
  `CryptoIcon`), or wrap anything else in `<div className='shrink-0'>`.
- Neither set: `TableCellItem` is optional; keep `TableCellContent` alone.
- `title` → `TableCellContentTitle` child, `description` →
  `TableCellContentDescription` child. Skip a child whose prop was absent.
  Never leave `title` as an attribute: it now renders a native tooltip.
- `className`, `ref` and other pass-through props go on `TableCellItem` when
  you add one, since it now holds the old outer row; otherwise they stay on
  `TableCellContent`.

Import the new parts from `@ledgerhq/lumen-ui-react`. `TableCellContentRow`
is new, for a description next to extra content such as a `Tag`; use it only
where the app built that by hand.

## Verify

Zero `detect` hits. Typecheck passes. Tables look as before: leading icons,
titles, descriptions and end-aligned cells in place, and leading elements
don't shrink in narrow cells.
