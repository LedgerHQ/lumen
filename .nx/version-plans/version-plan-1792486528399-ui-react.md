---
'@ledgerhq/lumen-ui-react': patch
---

feat(DataTable): add `DataTablePagination` and `DataTableShowMore`, and let `DataTable` render children at the bottom of its scroll container. The infinite-scroll loading row now shows whenever `onScrollBottom` is set. `paginationMode` is deprecated, and its no-op `'pagination'` value is removed.
