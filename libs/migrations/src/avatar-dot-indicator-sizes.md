---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Avatar.size'
    signal: visual # sm 40→32, md 48→40, lg 72→48; new xl 64
    detect:
      - { pattern: '<Avatar\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Avatar.size'
    signal: visual # sm 40→32, md 48→40, lg 72→48; new xl 64
    detect:
      - { pattern: '<Avatar\b', expect: review }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=md'
    signal: visual # 16px → 14px; the new lg is 16px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=[''"{]*md\b' }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-rnative#DotIndicator.size=md'
    signal: visual # 16px → 14px; the new lg is 16px
    detect:
      - { pattern: '<DotIndicator\b[^>]*\bsize=[''"{]*md\b' }
pr: 668
---

## Before → after

```tsx before
<Avatar src={url} size='sm' />
<Avatar src={url} />
<Avatar src={url} size='lg' />
<DotIndicator size='md' appearance='red' />
```

```tsx after
<Avatar src={url} size='md' />
<Avatar src={url} size='lg' />
<Avatar src={url} size='xl' />
<DotIndicator size='lg' appearance='red' />
```

## Decide

Keep the container sizes by moving each usage one step up, on both platforms:

| Avatar before   | px  | after              |
| --------------- | --- | ------------------ |
| `sm`            | 40  | `md`               |
| `md` or no size | 48  | `lg`               |
| `lg`            | 72  | `xl` (64, closest) |

`DotIndicator` `size='md'` → `size='lg'` (16px). `xs` and `sm` are unchanged.
Apply these mechanically: a later migration adjusts the Avatar sizes again.

The bump keeps only the Avatar container size. The fallback icon (no `src`)
grows one step (16→24, 24→32, 32→40px), and so does the `showNotification`
dot (10→12, 12→14px), except `lg`→`xl`, whose dot stays 16px.

## Verify

Zero `DotIndicator` `detect` hits, and no `DotIndicator` with a non-literal
`size` still resolves to `md`. Every `Avatar` sets the mapped `size`. Avatars
without an image or with `showNotification` still look right.
Typecheck passes.
