---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(DataTable): remove `paginationMode`, add `DataTablePagination` and `DataTableShowMore`. The infinite-scroll loading row now shows whenever `onScrollBottom` is set: delete `paginationMode` and keep `onScrollBottom`. `DataTable` now renders children at the bottom of its scroll container.
