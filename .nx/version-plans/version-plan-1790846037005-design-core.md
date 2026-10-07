---
'@ledgerhq/lumen-design-core': patch
---

BREAKING_CHANGE(tokens): extend the size scale to 1280px with t-shirt names and align the spacing scale with size from 144 to 256

From 256px upwards, `size` tokens now follow Tailwind's container scale and use its t-shirt names. They are defined by Lumen, so `w-md` resolves to `var(--size-md)` instead of Tailwind's default `28rem`. Below 256px, sizes stay pixel-named (`size-224` is 224px).

| Token | `3xs` | `2xs` | `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl` | `4xl` | `5xl` | `6xl` | `7xl` |
| ----- | ----- | ----- | ---- | ---- | ---- | ---- | ---- | ----- | ----- | ----- | ----- | ----- | ----- |
| px    | 256   | 288   | 320  | 384  | 448  | 512  | 576  | 672   | 768   | 896   | 1024  | 1152  | 1280  |

- `size`: `256`, `288` and `320` are renamed to `3xs`, `2xs` and `xs`; `400`, `480` and `560` are removed; `sm`, `md`, `lg`, `xl` and `2xl` to `7xl` are added.
- `spacing`: `160` is removed; `176`, `192`, `208` and `224` are added.

This affects the CSS variables (`--size-*`, `--spacing-*`), every Tailwind utility built on them (`w-*`, `h-*`, `size-*`, `min-*`/`max-*`, `basis-*`, `p-*`, `m-*`, `gap-*`, `inset-*`, …) and the JS theme (`sizes.*`, `spacings.*`). Tailwind drops unknown classes silently, so a stale `w-400` produces no CSS and no build error.

To migrate, rename the moved sizes and replace each removed value with one of its two neighbours on the new scale. Pick the smaller one if the element must not grow, the larger one if its content must not be squeezed. Lumen components use the larger value.

| Before                                    | Replace with                              | Or                            |
| ----------------------------------------- | ----------------------------------------- | ----------------------------- |
| `*-256`, `--size-256`, `sizes.s256`       | `*-3xs`, `--size-3xs`, `sizes.s3Xs`       |                               |
| `*-288`, `--size-288`, `sizes.s288`       | `*-2xs`, `--size-2xs`, `sizes.s2Xs`       |                               |
| `*-320`, `--size-320`, `sizes.s320`       | `*-xs`, `--size-xs`, `sizes.sXs`          |                               |
| `*-400`, `--size-400`, `sizes.s400`       | `*-sm` (384px)                            | `*-md` (448px, used by Lumen) |
| `*-480`, `--size-480`, `sizes.s480`       | `*-md` (448px)                            | `*-lg` (512px, used by Lumen) |
| `*-560`, `--size-560`, `sizes.s560`       | `*-lg` (512px)                            | `*-xl` (576px, used by Lumen) |
| `*-160`, `--spacing-160`, `spacings.s160` | `*-144`, `--spacing-144`, `spacings.s144` | `*-176` (used by Lumen)       |

`w-160`, `h-160`, `size-160` and `min-*`/`max-*-160` used to resolve through `--spacing-160` and are removed as well. Use `*-144` or `*-176`.

Tailwind's own t-shirt utilities (`w-md`, `max-w-3xl`, …) keep their pixel values but no longer scale with the root font size, since they now come from Lumen's pixel tokens. The `@3xs:` … `@7xl:` container-query variants no longer generate CSS; use arbitrary values such as `@min-[448px]:` instead.

Also adds the `border-decorative-*` colors (orange, green, blue, purple, red, yellow, turquoise, pink) from Figma, as Tailwind utilities and as `border.decorative*` in the JS theme.
