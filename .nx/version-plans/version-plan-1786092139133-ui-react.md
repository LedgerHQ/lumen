---
'@ledgerhq/lumen-ui-react': patch
---

refactor!: regroup `Components` into `core`, `internal`, and `symbols` subfolders. 

BREAKING CHANGE: `BaseInput` is no longer public (moved to the internal group) and should be replaced by `TextInput`; the `./symbols` and `./*` subpath exports now resolve under the new layout.
