---
changes:
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--background-avatar-*'
    to: '@ledgerhq/lumen-design-core#--background-decorative-*'
    signal: visual # an unknown CSS variable resolves to no color
    detect:
      - { pattern: '--(color-)?background-avatar-' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#--color-light-avatar-*'
    to: '@ledgerhq/lumen-design-core#--color-light-decorative-*'
    signal: visual # also --color-dark-avatar-*
    detect:
      - { pattern: '--color-(light|dark)-avatar-' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#bg-avatar-*'
    to: '@ledgerhq/lumen-design-core#bg-decorative-*'
    signal: visual # Tailwind drops unknown classes
    detect:
      - { pattern: '\bbg-avatar-' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.avatar*'
    to: '@ledgerhq/lumen-design-core#ledgerLiveThemes.light.colors.bg.decorative*'
    signal: loud # also dark, and enterpriseThemes / websitesThemes
    detect:
      - { pattern: '\bbg\.avatar[A-Z]' }
  - change: renamed
    surface: token
    ref: '@ledgerhq/lumen-design-core#primitiveColorTokens.light.avatar'
    to: '@ledgerhq/lumen-design-core#primitiveColorTokens.light.decorative'
    signal: loud
    detect:
      - { pattern: 'primitiveColorTokens\.(light|dark)\.avatar\b' }
pr: 816
---

## Before → after

```css before
.badge {
  background: var(--background-avatar-blue);
  border-color: var(--color-light-avatar-pink);
}
```

```css after
.badge {
  background: var(--background-decorative-blue);
  border-color: var(--color-light-decorative-pink);
}
```

```tsx before
<span className='bg-avatar-green' />;
const purple = ledgerLiveThemes.light.colors.bg.avatarPurple;
const palette = primitiveColorTokens.light.avatar;
```

```tsx after
<span className='bg-decorative-green' />;
const purple = ledgerLiveThemes.light.colors.bg.decorativePurple;
const palette = primitiveColorTokens.light.decorative;
```

## Decide

Every avatar color token is renamed `avatar` → `decorative`, for all eight
colors (blue, green, orange, pink, purple, red, turquoise, yellow), all brands,
light and dark. Values are unchanged. Rename mechanically:

- CSS: `--background-avatar-*`, `--color-background-avatar-*`,
  `--color-light-avatar-*`, `--color-dark-avatar-*`.
- Tailwind: `bg-avatar-*` → `bg-decorative-*`.
- JS themes (`ledgerLiveThemes`, `enterpriseThemes`, `websitesThemes`,
  `colors.bg`): `avatarBlue` → `decorativeBlue`, and so on.
- `primitiveColorTokens.{light,dark}.avatar` → `.decorative`.

No judgment call: there's no other mapping.

## Verify

Zero `detect` hits. Typecheck passes. Screens using these colors (avatar
fallbacks, decorative badges) still show them.
