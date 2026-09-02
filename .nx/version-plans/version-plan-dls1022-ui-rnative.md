---
'@ledgerhq/lumen-ui-rnative': patch
---

Charts are now part of `@ledgerhq/lumen-ui-rnative`, exposed at the
`@ledgerhq/lumen-ui-rnative/visualization` subpath instead of the separate
`@ledgerhq/lumen-ui-rnative-visualization` package. Import the chart components
from the subpath.

`react-native-gesture-handler` and `react-native-worklets` are now optional peer
dependencies — install them if you use charts.
