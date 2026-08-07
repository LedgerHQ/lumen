---
'@ledgerhq/lumen-ui-react': patch
---

refactor!: regroup `Components` into `core`, `internal`, and `symbols` subfolders. `BaseInput` is no longer exported from the package root (moved to the internal group); the `./symbols` and `./*` subpath exports now resolve under the new layout.
