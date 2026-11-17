---
changes:
  - change: required
    surface: dependency
    ref: 'expo-clipboard'
    signal: loud # the root entry imports it, so Metro fails to bundle without it
    detect:
      - { pattern: '"@ledgerhq/lumen-ui-rnative":', in: manifests, expect: review }
---

## Before → after

```json before
"dependencies": {
  "@ledgerhq/lumen-ui-rnative": "0.1.74",
  "expo": "~57.0.31"
}
```

```json after
"dependencies": {
  "@ledgerhq/lumen-ui-rnative": "0.1.75",
  "expo": "~57.0.31",
  "expo-clipboard": "~57.0.2"
}
```

## Decide

`@ledgerhq/lumen-ui-rnative` now has `expo-clipboard` as a peer dependency,
used by `Clipboard`. The package entry imports it, so every app bundling
`@ledgerhq/lumen-ui-rnative` needs it, whether or not it renders `Clipboard`.

- Add it to every package that depends on `@ledgerhq/lumen-ui-rnative`, with
  the version matching the app's Expo SDK: `npx expo install expo-clipboard`
  picks it. Skip a package that already has a matching version.
- It ships native code. Default: rebuild the native app (`npx expo prebuild`
  or `pod install`, then a new build); Expo Go already includes it.
- A Jest setup that mocks `expo-haptics` likely needs the same for
  `expo-clipboard`.

## Verify

`expo-clipboard` resolves from each package using `@ledgerhq/lumen-ui-rnative`.
Install shows no missing peer warning for it. The app bundles and builds on
iOS and Android, and tests pass.
