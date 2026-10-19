---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(Tile): replace `centered` with `horizontalAlignment` and `verticalAlignment`

The `centered` prop is removed. Replace `centered` with `verticalAlignment='center'`.

`Tile` now accepts `horizontalAlignment` (`'start' | 'center'`, default `'center'`) and `verticalAlignment` (`'start' | 'center'`, default `'start'`). Tiles without these props render as before.

`TileContextValue` now holds `horizontalAlignment` instead of `disabled`. The disabled state is still provided by the shared disabled context.
