---
changes:
  - change: removed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#DataTableRoot.paginationMode'
    signal: loud
    detect:
      - { pattern: '\bpaginationMode=' }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#DataTableRoot.onScrollBottom'
    signal: visual # the loading row now shows without paginationMode
    detect:
      - { pattern: '<DataTableRoot\b(?:[^>]|=>)*\bonScrollBottom=', expect: review }
pr: 925
---

## Before → after

```tsx before
<DataTableRoot
  table={table}
  paginationMode='infinite-scroll'
  loading={isFetching}
  onScrollBottom={fetchNextPage}
>
  <DataTable />
</DataTableRoot>
<DataTableRoot table={other} paginationMode='none' loading={isLoading} onScrollBottom={load}>
  <DataTable />
</DataTableRoot>
```

```tsx after
<DataTableRoot table={table} loading={isFetching} onScrollBottom={fetchNextPage}>
  <DataTable />
</DataTableRoot>
<DataTableRoot table={other} loadingIndicator='none' loading={isLoading} onScrollBottom={load}>
  <DataTable />
</DataTableRoot>
```

## Decide

The loading row now shows whenever `onScrollBottom` is set and `loading` is
true, and only then.

- `paginationMode='infinite-scroll'`: delete it. If `onScrollBottom` can be
  undefined, the row no longer shows then: to keep it, also add
  `loadingIndicator='none'` and render `<TableLoadingRow />` as a `DataTable`
  child, so it never shows twice.
- `paginationMode='none'`, `'pagination'` or no `paginationMode`, with
  `onScrollBottom` and `loading`: add `loadingIndicator='none'` to keep the
  table without a loading row. Otherwise just delete `paginationMode`.
- `paginationMode={cond ? 'infinite-scroll' : 'none'}`: delete it when `cond`
  is whether `onScrollBottom` is defined. Otherwise replace it with
  `loadingIndicator={cond ? 'spinner' : 'none'}`.

## Verify

Zero `paginationMode` hits. Typecheck passes. Each `DataTable`
shows a loading row only where it did before.
