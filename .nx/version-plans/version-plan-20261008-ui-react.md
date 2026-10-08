---
'@ledgerhq/lumen-ui-react': patch
---

feat(Table): add horizontalLayout to support horizontal scroll on Table and DataTable

`horizontalLayout` (on `TableRoot` / `DataTableRoot`) defaults to `{ type: 'shrink' }`, which
keeps the current behaviour. With `{ type: 'scroll', minWidth }` the table keeps at least
`minWidth` pixels and the container scrolls horizontally. Without `minWidth`, the table is as
wide as the sum of its column widths (every column then needs a width). It also accepts a
mobile-first object keyed by breakpoint.

```tsx
<TableRoot horizontalLayout={{ type: 'scroll', minWidth: 960 }} aria-label='Assets'>
  <Table>…</Table>
</TableRoot>

<DataTableRoot
  table={table}
  horizontalLayout={{
    base: { type: 'scroll', minWidth: 640 },
    lg: { type: 'shrink' },
  }}
>
  <DataTable aria-label='Assets' />
</DataTableRoot>
```

Also:

- `hideBelow` uses the `Breakpoint` type from `@ledgerhq/lumen-design-core` and now accepts `2xl`.
- When it overflows horizontally, `TableRoot` becomes focusable, and becomes a named region when given an `aria-label`.
- A consumer `onScroll` on `TableRoot` is now called (it was previously dropped).
- `onScrollBottom` no longer fires on horizontal-only scrolls.
- `TableLoadingRow` and the `TableGroupHeaderRow` label stay in view when scrolled horizontally.
