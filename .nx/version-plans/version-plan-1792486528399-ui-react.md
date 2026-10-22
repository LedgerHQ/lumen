---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(DataTable): add `DataTablePagination` and `DataTableShowMore`, and deprecate `paginationMode`. The infinite-scroll loading row now shows whenever `onScrollBottom` is set: delete `paginationMode="infinite-scroll"` and keep `onScrollBottom`. The no-op `'pagination'` value is removed. `DataTable` now renders children at the bottom of its scroll container.
