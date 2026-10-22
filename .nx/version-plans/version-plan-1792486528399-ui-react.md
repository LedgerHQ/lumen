---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(DataTable): remove `paginationMode`, add `DataTablePagination`, `DataTableShowMore` and `loadingIndicator`. The infinite-scroll loading row now shows whenever `onScrollBottom` is set: delete `paginationMode="infinite-scroll"`, and replace `paginationMode="none"` with `loadingIndicator="none"`. `loadingIndicator` also accepts an element for a custom indicator, and `TableLoadingRow` accepts children to replace its spinner. `DataTable` now renders children at the bottom of its scroll container.
