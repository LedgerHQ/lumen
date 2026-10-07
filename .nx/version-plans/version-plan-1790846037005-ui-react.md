---
'@ledgerhq/lumen-ui-react': patch
---

BREAKING_CHANGE(tokens): move sizes from 256px upwards to t-shirt names, resizing Dialog, Popover and Menu

The design-core size scale now uses t-shirt names from 256px upwards (`3xs` = 256px … `7xl` = 1280px), drops `400`, `480` and `560`, and `spacing` drops `160` (see the `@ledgerhq/lumen-design-core` notes for the full scale). Pixel-named utilities from 256px upwards (`w-320`, `max-h-560`, …) and `*-160` no longer generate any CSS, and Tailwind drops them silently with no build error.

Components now use the t-shirt sizes, at the nearest larger value where the old one was removed:

- `Dialog`: default width 400px → `md` (448px); `height='fit'` max-height and `height='fixed'` height 560px → `xl` (576px).
- `Popover`: `width='fixed'` 400px → `md` (448px).
- `Menu`: content min-width 160px → 176px.

To migrate:

1. Replace the affected utilities in your own code. Where a value was removed, pick the smaller neighbour if the element must not grow, or the larger one if its content must not be squeezed. Lumen components use the larger value.

   | Before  | Replace with | Or                    |
   | ------- | ------------ | --------------------- |
   | `*-256` | `*-3xs`      |                       |
   | `*-288` | `*-2xs`      |                       |
   | `*-320` | `*-xs`       |                       |
   | `*-400` | `*-sm`       | `*-md` (Lumen)        |
   | `*-480` | `*-md`       | `*-lg` (Lumen)        |
   | `*-560` | `*-lg`       | `*-xl` (Lumen)        |
   | `*-160` | `*-144`      | `*-176` (Lumen)       |

   For example, `w-400` becomes `w-md` and `max-h-560` becomes `max-h-xl`.

2. Replace `@md:`-style container-query variants with arbitrary values such as `@min-[448px]:`, since `@3xs:` … `@7xl:` no longer generate CSS.

3. Check layouts that host a `Dialog`, `Popover` (`width='fixed'`) or `Menu`, because they are now 16–48px larger.
