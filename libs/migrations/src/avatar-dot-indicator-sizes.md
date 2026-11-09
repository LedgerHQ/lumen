---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Avatar.size'
    signal: visual # every size is one step smaller; lg 72px is gone
    detect:
      - { pattern: '<Avatar\b', expect: review }
  - change: changed
    surface: value
    ref: '@ledgerhq/lumen-ui-react#DotIndicator.size=md'
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

Keep the rendered sizes by moving each usage one step up:

| Avatar before    | px  | after              |
| ---------------- | --- | ------------------ |
| `sm`             | 40  | `md`               |
| `md` or no size  | 48  | `lg`               |
| `lg`             | 72  | `xl` (64, closest) |

`DotIndicator` `size='md'` → `size='lg'` (16px). `xs` and `sm` are unchanged.
Apply these mechanically: a later migration adjusts the Avatar sizes again.

## Verify

Zero `DotIndicator` `detect` hits. Every `Avatar` sets the mapped `size`.
Typecheck passes.
