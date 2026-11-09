---
changes:
  - change: changed
    surface: dependency
    ref: 'react-native-reanimated'
    signal: loud # install fails on the peer range
    detect:
      - { pattern: '"react-native-reanimated":\s*"[~^]?4\.[0-2]\.', in: manifests }
  - change: changed
    surface: dependency
    ref: 'react-native-worklets'
    signal: loud # install fails on the peer range
    detect:
      - { pattern: '"react-native-worklets":\s*"[~^>=]*0\.[5-7]\.', in: manifests }
pr: 916
---

## Before → after

```json before
"dependencies": {
  "react-native-reanimated": "4.1.6",
  "react-native-worklets": "0.5.2"
}
```

```json after
"dependencies": {
  "react-native-reanimated": "^4.3.0",
  "react-native-worklets": "^0.8.0"
}
```

## Decide

`@ledgerhq/lumen-ui-rnative` now needs `react-native-reanimated` `^4.3.0` and
`react-native-worklets` `^0.8.0`. Upgrade both together in every package that
depends on `@ledgerhq/lumen-ui-rnative`. Follow Reanimated's upgrade notes for
native steps (pods, Babel plugin). If the app cannot move yet, stop the upgrade
and report it rather than forcing the install.

## Verify

Zero `detect` hits. Install shows no peer warning for either package. The app
builds on iOS and Android, and animated components (Skeleton, Switch, Tabs)
still animate.
