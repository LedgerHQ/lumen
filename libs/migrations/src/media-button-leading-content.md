---
changes:
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaButton.icon'
    to: '@ledgerhq/lumen-ui-react#MediaButton.leadingContent'
    signal: loud
    detect:
      - { pattern: '<MediaButton\b[^>]*\bicon=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaButton.iconType'
    to: '@ledgerhq/lumen-ui-react#MediaButton.leadingContentShape'
    signal: loud
    detect:
      - { pattern: '<MediaButton\b[^>]*\biconType=' }
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#NavBarCoinCapsule.icon'
    to: '@ledgerhq/lumen-ui-react#NavBarCoinCapsule.leadingContent'
    signal: loud
    detect:
      - { pattern: '<NavBarCoinCapsule\b[^>]*\bicon=' }
pr: 720
---

## Before → after

```tsx before
<MediaButton iconType='rounded' icon={<CryptoIcon ledgerId='bitcoin' size='24px' />}>
  Bitcoin
</MediaButton>
<NavBarCoinCapsule ticker='BTC' icon={<CryptoIcon ledgerId='bitcoin' size='24px' />} />
```

```tsx after
<MediaButton leadingContentShape='rounded' leadingContent={<CryptoIcon ledgerId='bitcoin' size='24px' />}>
  Bitcoin
</MediaButton>
<NavBarCoinCapsule ticker='BTC' leadingContent={<CryptoIcon ledgerId='bitcoin' size='24px' />} />
```

## Decide

Pure renames with the same values: no judgment needed.

## Verify

Zero `detect` hits. Typecheck passes.
