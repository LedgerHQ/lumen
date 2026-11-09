---
changes:
  - change: changed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#Avatar.size'
    signal: visual # each size is one step larger
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

Keep the rendered sizes by moving each usage one step down:

| Avatar before    | px  | after                       |
| ---------------- | --- | --------------------------- |
| `sm`             | 32  | `sm` (40, closest)          |
| `md` or no size  | 40  | `sm`                        |
| `lg`             | 48  | `md`, the default: drop it  |
| `xl`             | 64  | `xl` (72)                   |

Leave `xl` as `xl`: a 64px avatar most likely came from an old 72px `lg`.
Use `lg` (56) only when design asks for the 64px look.

## Verify

Every `Avatar` uses the mapped `size`. Typecheck passes. Screens with
avatars look as before.
