---
changes:
  - change: required
    surface: dependency
    ref: 'lottie-react-native'
    signal: loud # the root entry imports it, so Metro fails to bundle without it
    detect:
      - { pattern: '"@ledgerhq/lumen-ui-rnative":', in: manifests, expect: review }
---

## Before → after

```json before
"dependencies": {
  "@ledgerhq/lumen-ui-rnative": "0.1.74"
}
```

```json after
"dependencies": {
  "@ledgerhq/lumen-ui-rnative": "0.1.75",
  "lottie-react-native": "^7.3.8"
}
```

## Decide

- `@ledgerhq/lumen-ui-rnative` now has `lottie-react-native` as a peer
  dependency for `LottieView`, and imports it from its root entry, so every
  app bundles it even without rendering a Lottie. Add it to every app that
  depends on `@ledgerhq/lumen-ui-rnative`, with the range the installed
  version declares in its `peerDependencies`. Skip an app that already has a
  matching version.
- It is a native module: rebuild the app (`pod install` on iOS, or a new Expo
  dev client / prebuild). An app on Expo Go needs a version Expo Go ships.
- Only to play `.lottie` files (such as `@ledgerhq/lumen-symbols/lotties/*`):
  add `lottie` to Metro's `resolver.assetExts`. Default: skip until the app
  uses one.

## Verify

`lottie-react-native` resolves from each app using
`@ledgerhq/lumen-ui-rnative`. Install shows no missing peer warning for it. The
app bundles and launches on iOS and Android.
