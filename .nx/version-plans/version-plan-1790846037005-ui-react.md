---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(tokens): align size and spacing scales with Tailwind, resizing Dialog, Popover and Menu

The design-core `size` scale no longer has `400`, `480` and `560`, and `spacing` no longer has `160` (see the `@ledgerhq/lumen-design-core` notes for the full scale). Their Tailwind utilities (`w-400`, `max-h-560`, `min-w-160`, …) no longer generate any CSS, and Tailwind drops them silently with no build error.

Components that used them now use the nearest larger value:

- `Dialog`: default width 400px → 448px; `height='fit'` max-height and `height='fixed'` height 560px → 576px.
- `Popover`: `width='fixed'` 400px → 448px.
- `Menu`: content min-width 160px → 176px.

To migrate:

1. Replace removed utilities in your own code with one of their two neighbours on the new scale. Pick whichever fits your layout: the smaller one if the element must not grow, the larger one if its content must not be squeezed. Lumen components use the larger value.

   | Removed | Smaller | Larger (used by Lumen) |
   | --- | --- | --- |
   | `*-400` | `*-384` | `*-448` |
   | `*-480` | `*-448` | `*-512` |
   | `*-560` | `*-512` | `*-576` |
   | `*-160` | `*-144` | `*-176` |

   For example, `w-400` becomes `w-384` or `w-448`, and `min-w-160` becomes `min-w-144` or `min-w-176`. Find them with:

   ```bash
   grep -rnE "\b[a-z:-]*-(160|400|480|560)\b|--(size|spacing)-(160|400|480|560)\b" src
   ```

2. Check layouts that host a `Dialog`, `Popover` (`width='fixed'`) or `Menu`, because they are now 16–48px larger.

Also adds the new `ArrowBottomLeft`, `Hourglass`, `Repeat` and `Wifi` icons, and updates `Switch`.
