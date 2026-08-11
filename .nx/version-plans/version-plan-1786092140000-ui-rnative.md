---
'@ledgerhq/lumen-ui-rnative': patch
---

refactor!: regroup `Components` into `core`, `internal`, `primitives`, `animations`, and `symbols` subfolders. `Icon` is no longer exported from the package root (moved to the internal group); the `Animations` export is now folded into the `Components` barrel and the `./symbols` subpath export resolves under the new layout.

BREAKING CHANGE: `BaseInput` is no longer public (moved to the internal group) and should be replaced by `TextInput`.
