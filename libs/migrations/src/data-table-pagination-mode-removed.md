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
    signal: silent # the loading row now shows without paginationMode
    detect:
      - { pattern: '<DataTableRoot\b[^>]*\bonScrollBottom=', expect: review }
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
true.

- `paginationMode='infinite-scroll'`: delete it.
- `paginationMode='none'`, `'pagination'` or no `paginationMode`, with
  `onScrollBottom` and `loading`: add `loadingIndicator='none'` to keep the
  table without a loading row. Otherwise just delete `paginationMode`.

## Verify

Zero `paginationMode` hits. Typecheck passes. Each table with
`onScrollBottom` shows a loading row only where it did before.
