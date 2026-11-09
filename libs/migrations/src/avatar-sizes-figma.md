---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Avatar.size'
    signal: visual # each size is one step larger
    detect:
      - { pattern: '<Avatar\b', expect: review }
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-rnative#Avatar.size'
    signal: visual
    detect:
      - { pattern: '<Avatar\b', expect: review }
pr: 682
---

## Before → after

```tsx before
<Avatar src={url} size='md' />
<Avatar src={url} size='lg' />
<Avatar src={url} size='xl' />
```

```tsx after
<Avatar src={url} size='sm' />
<Avatar src={url} />
<Avatar src={url} size='xl' />
```

## Decide

Keep the rendered sizes by moving each usage one step down, on both
platforms:

| Avatar before   | px  | after                      |
| --------------- | --- | -------------------------- |
| `sm`            | 32  | `sm` (40, closest)         |
| `md` or no size | 40  | `sm`                       |
| `lg`            | 48  | `md`, the default: drop it |
| `xl`            | 64  | `xl` (72)                  |

Leave `xl` as `xl`: a 64px avatar most likely came from an old 72px `lg`.
Use `lg` (56) only when design asks for the 64px look.

Stepping down keeps the outer size, but the fallback icon (`md` 24 → `sm` 16,
`lg` 32 → `md` 24) and the notification dot shrink one step. Accept it.

## Verify

Every `Avatar` uses the mapped `size`. Typecheck passes. Remapped avatars keep
their outer size; only fallback icons and notification dots may be smaller.
