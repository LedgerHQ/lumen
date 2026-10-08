---
'@ledgerhq/lumen-ui-react': patch
---

feat(Table): add horizontalLayout and minWidth to support horizontal scroll on Table and DataTable

`horizontalLayout` (on `TableRoot` / `DataTableRoot`) is `'shrink'` by default, which keeps
the current behaviour. In scroll layout the table keeps at least `minWidth` pixels and the
container scrolls horizontally, with a fade on the edges that hide content. It also accepts
a mobile-first object keyed by breakpoint.

```tsx
<TableRoot horizontalLayout={{ base: 'scroll', md: 'shrink' }} aria-label='Assets'>
  <Table minWidth={960}>…</Table>
</TableRoot>

<DataTableRoot table={table} horizontalLayout='scroll' minWidth={960}>
  <DataTable aria-label='Assets' />
</DataTableRoot>
```

Also:

- When it overflows horizontally, `TableRoot` becomes focusable, and becomes a named region when given an `aria-label`.
- A consumer `onScroll` on `TableRoot` is now called (it was previously dropped).
- `onScrollBottom` no longer fires on horizontal-only scrolls.
- `TableLoadingRow` and the `TableGroupHeaderRow` label stay in view when scrolled horizontally.
