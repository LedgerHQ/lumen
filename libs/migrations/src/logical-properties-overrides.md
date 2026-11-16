---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#ContentBanner.className'
    signal: visual
    detect:
      - { pattern: '<ContentBanner\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Divider.className'
    signal: visual
    detect:
      - { pattern: '<Divider\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaButton.className'
    signal: visual
    detect:
      - { pattern: '<MediaButton\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaCard.className'
    signal: visual
    detect:
      - { pattern: '<MediaCard\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MediaTag.className'
    signal: visual
    detect:
      - { pattern: '<MediaTag\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#NavBarCoinCapsule.className'
    signal: visual
    detect:
      - { pattern: '<NavBarCoinCapsule\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#NavBarTrailing.className'
    signal: visual
    detect:
      - { pattern: '<NavBarTrailing\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SubheaderCount.className'
    signal: visual
    detect:
      - { pattern: '<SubheaderCount\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#SubheaderShowMore.className'
    signal: visual
    detect:
      - { pattern: '<SubheaderShowMore\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableActionBarTrailing.className'
    signal: visual
    detect:
      - { pattern: '<TableActionBarTrailing\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#TableCell.className'
    signal: visual
    detect:
      - { pattern: '<TableCell\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Toast.className'
    signal: visual
    detect:
      - { pattern: '<Toast\b(?:[^>]|=>)*?\bclassName=(?:[^>]|=>)*?[\s''"{:]-?(?:[mp][lr]|left|right|border-[lr]|rounded-[tb]?[lr]|text-(?:left|right))\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#ContentBanner.style'
    signal: visual
    detect:
      - { pattern: '<ContentBanner\b(?:[^>]|=>)*?\bstyle=(?:[^>]|=>)*?\b(?:(?:margin|padding|border)(?:Left|Right)\w*|border(?:Top|Bottom)(?:Left|Right)Radius|left|right)\s*:', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Divider.lx'
    signal: visual
    detect:
      - { pattern: '<Divider\b(?:[^>]|=>)*?\blx=(?:[^>]|=>)*?\b(?:(?:margin|padding|border)(?:Left|Right)\w*|border(?:Top|Bottom)(?:Left|Right)Radius|left|right)\s*:', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Toast.style'
    signal: visual
    detect:
      - { pattern: '<Toast\b(?:[^>]|=>)*?\bstyle=(?:[^>]|=>)*?\b(?:(?:margin|padding|border)(?:Left|Right)\w*|border(?:Top|Bottom)(?:Left|Right)Radius|left|right)\s*:', expect: review }
---

## Before → after

```tsx before
<ContentBanner className='pr-24' onClose={close}>{content}</ContentBanner>
<Divider orientation='vertical' className='border-l-2' />
<MediaButton className='pl-24' leadingContent={<Spot />}>Wallet</MediaButton>
<MediaCard className='text-right' imageUrl={url} />
<MediaTag className='pr-12' leadingContent={icon}>NFT</MediaTag>
<NavBarCoinCapsule className='pr-16' ticker='BTC' />
<NavBarTrailing className='ml-0'>{actions}</NavBarTrailing>
<SubheaderCount className='pl-4' value={3} />
<SubheaderShowMore className='-ml-4' />
<TableActionBarTrailing className='ml-0'>{actions}</TableActionBarTrailing>
<TableCell className='first:rounded-l-lg'>{name}</TableCell>
<Toast className='pl-24' title='Saved' />
```

```tsx after
<ContentBanner className='pe-24' onClose={close}>{content}</ContentBanner>
<Divider orientation='vertical' className='border-s-2' />
<MediaButton className='ps-24' leadingContent={<Spot />}>Wallet</MediaButton>
<MediaCard className='text-end' imageUrl={url} />
<MediaTag className='pe-12' leadingContent={icon}>NFT</MediaTag>
<NavBarCoinCapsule className='pe-16' ticker='BTC' />
<NavBarTrailing className='ms-0'>{actions}</NavBarTrailing>
<SubheaderCount className='ps-4' value={3} />
<SubheaderShowMore className='-ms-4' />
<TableActionBarTrailing className='ms-0'>{actions}</TableActionBarTrailing>
<TableCell className='first:rounded-s-lg'>{name}</TableCell>
<Toast className='ps-24' title='Saved' />
```

React Native:

```tsx before
<ContentBanner style={{ paddingRight: 24 }} onClose={close}>{content}</ContentBanner>
<Divider orientation='vertical' lx={{ borderLeftWidth: 's2' }} />
<Toast style={{ paddingLeft: 24 }} title='Saved' />
```

```tsx after
<ContentBanner style={{ paddingEnd: 24 }} onClose={close}>{content}</ContentBanner>
<Divider orientation='vertical' lx={{ borderStartWidth: 's2' }} />
<Toast style={{ paddingStart: 24 }} title='Saved' />
```

## Decide

These components now set their inline spacing, insets, borders, radii and
text alignment with start/end (`ms-*`, `pe-*`, `end-*`, `border-s`,
`rounded-s-*`, `text-start`; `marginStart`, `paddingEnd`,
`borderStartWidth` on React Native) instead of left/right, so they mirror in
right-to-left locales. An override on the physical side no longer replaces
the component's value:

- Web: `cn` doesn't merge `ml-4` with `ms-4`, since they differ in RTL.
  Both stay: in LTR the later rule in the stylesheet wins, in RTL the
  element gets both sides.
- React Native: a start/end key wins over left/right, so `paddingLeft` on
  top of `paddingStart` is ignored in both directions.

For each hit, rewrite the physical class or key to its start/end form
(`ml` → `ms`, `pr` → `pe`, `left-*` → `start-*`, `border-l` →
`border-s`, `rounded-l-*` → `rounded-s-*`, `text-left` → `text-start`;
`marginLeft` → `marginStart`, `paddingRight` → `paddingEnd`,
`borderTopLeftRadius` → `borderTopStartRadius`). This is the default.
Keep a physical side only when it must not mirror, and then also cancel the
component's own logical value.

`detect` only sees inline `className`, `style` and `lx` values. Also check
React Native styles passed from a `StyleSheet` or a variable to these
components.

## Verify

Every `detect` hit reviewed. Open the screens using these components in LTR
and, if the app supports it, in an RTL locale: each override applies on the
intended side.
