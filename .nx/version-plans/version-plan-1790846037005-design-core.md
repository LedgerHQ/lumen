---
'@ledgerhq/lumen-design-core': patch
---

BREAKING_CHANGE(tokens): align the size scale with Tailwind up to 1280px and the spacing scale with size from 144 to 256

The `size` scale now matches Tailwind's container widths from 320px upwards, and the `spacing` scale matches `size` between 144 and 256. Both stay pixel-named (`size-448` is 448px).

- `size`: removed `400`, `480`, `560`; added `384`, `448`, `512`, `576`, `672`, `768`, `896`, `1024`, `1152`, `1280`.
- `spacing`: removed `160`; added `176`, `192`, `208`, `224`.

This affects the CSS variables (`--size-*`, `--spacing-*`), every Tailwind utility built on them (`w-*`, `h-*`, `size-*`, `min-*`/`max-*`, `p-*`, `m-*`, `gap-*`, `inset-*`, …), and the JS theme (`sizes.*`, `spacings.*`).

To migrate, replace each removed value with one of its two neighbours on the new scale. Pick whichever fits your layout: the smaller one if the element must not grow, the larger one if its content must not be squeezed. Lumen components use the larger value.

| Removed                                   | Smaller                                   | Larger (used by Lumen)                    |
| ----------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| `*-400`, `--size-400`, `sizes.s400`       | `*-384`, `--size-384`, `sizes.s384`       | `*-448`, `--size-448`, `sizes.s448`       |
| `*-480`, `--size-480`, `sizes.s480`       | `*-448`, `--size-448`, `sizes.s448`       | `*-512`, `--size-512`, `sizes.s512`       |
| `*-560`, `--size-560`, `sizes.s560`       | `*-512`, `--size-512`, `sizes.s512`       | `*-576`, `--size-576`, `sizes.s576`       |
| `*-160`, `--spacing-160`, `spacings.s160` | `*-144`, `--spacing-144`, `spacings.s144` | `*-176`, `--spacing-176`, `spacings.s176` |

`w-160`, `h-160`, `size-160` and `min-*`/`max-*-160` used to resolve through `--spacing-160` and are removed as well. Use `*-144` or `*-176`.
