---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(Tile): replace `centered` with `horizontalAlignment` and `verticalAlignment`

The `centered` prop is removed. Replace `centered` with `verticalAlignment='center'`.

`Tile` now accepts `horizontalAlignment` (`'start' | 'center'`, default `'center'`) and `verticalAlignment` (`'start' | 'center'`, default `'start'`). Tiles without these props render as before.
