---
changes:
  - change: changed
    surface: dependency
    ref: 'react-native-reanimated'
    signal: silent # only a peer warning under pnpm, yarn or --legacy-peer-deps
    detect:
      - { pattern: '"react-native-reanimated":\s*"[~^>=\s]*4\.[0-2]\b', in: manifests }
      - { pattern: '"react-native-reanimated":\s*"catalog:', in: manifests, expect: review }
  - change: changed
    surface: dependency
    ref: 'react-native-worklets'
    signal: silent # only a peer warning under pnpm, yarn or --legacy-peer-deps
    detect:
      - { pattern: '"react-native-worklets":\s*"[~^>=\s]*0\.[5-7]\b', in: manifests }
      - { pattern: '"react-native-worklets":\s*"catalog:', in: manifests, expect: review }
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
`react-native-worklets` `^0.8.0`. Upgrade both together in every package
that depends on `@ledgerhq/lumen-ui-rnative`. A `catalog:` hit is resolved in
`pnpm-workspace.yaml`: check the version there, and in any `overrides` or
`resolutions`. Follow Reanimated's upgrade notes for native steps (pods, Babel
plugin). If the app cannot move yet, stop the upgrade and report it rather than
forcing the install.

## Verify

No version-range hits, and every `catalog:` hit resolves to an allowed version.
Install shows no peer warning for either package. The app builds on iOS and
Android, and animated components (Skeleton, Switch, TabBar, SegmentedControl,
Toast, charts) still animate.
