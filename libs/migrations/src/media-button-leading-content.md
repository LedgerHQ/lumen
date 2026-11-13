---
changes:
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaButton.icon'
    to: '@ledgerhq/lumen-ui-react#MediaButton.leadingContent'
    signal: loud
    detect:
      - { pattern: '<MediaButton\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\bicon=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaButton.iconType'
    to: '@ledgerhq/lumen-ui-react#MediaButton.leadingContentShape'
    signal: loud
    detect:
      - { pattern: '<MediaButton\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\biconType=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#NavBarCoinCapsule.icon'
    to: '@ledgerhq/lumen-ui-react#NavBarCoinCapsule.leadingContent'
    signal: loud
    detect:
      - { pattern: '<NavBarCoinCapsule\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\bicon=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#MediaButton.icon'
    to: '@ledgerhq/lumen-ui-rnative#MediaButton.leadingContent'
    signal: loud
    detect:
      - { pattern: '<MediaButton\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\bicon=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#MediaButton.iconType'
    to: '@ledgerhq/lumen-ui-rnative#MediaButton.leadingContentShape'
    signal: loud
    detect:
      - { pattern: '<MediaButton\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\biconType=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#NavBarCoinCapsule.icon'
    to: '@ledgerhq/lumen-ui-rnative#NavBarCoinCapsule.leadingContent'
    signal: loud
    detect:
      - { pattern: '<NavBarCoinCapsule\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*\bicon=' }
pr: 720
---

## Before → after

Same on React and React Native.

```tsx before
<MediaButton icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />} iconType='rounded'>
  Bitcoin
</MediaButton>
<NavBarCoinCapsule ticker='BTC' icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />} />
```

```tsx after
<MediaButton leadingContent={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />} leadingContentShape='rounded'>
  Bitcoin
</MediaButton>
<NavBarCoinCapsule ticker='BTC' leadingContent={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />} />
```

## Decide

Pure renames with the same values. Also rename `icon`/`iconType` keys in
objects spread into these components: MediaButton's props are optional, so a
loosely typed spread compiles and silently drops the icon.

## Verify

Zero `detect` hits. Typecheck passes. Objects spread into these components
have no `icon` or `iconType` key left.
