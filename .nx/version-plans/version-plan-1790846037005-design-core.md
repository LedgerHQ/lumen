---
'@ledgerhq/lumen-design-core': patch
---

BREAKING_CHANGE(tokens): align the size scale with Tailwind up to 1280px, align the spacing scale with size from 144 to 256, and remove t-shirt container sizes

The `size` scale now matches Tailwind's container widths from 320px upwards, and the `spacing` scale matches `size` between 144 and 256. Both stay pixel-named (`size-448` is 448px).

- `size`: removed `400`, `480`, `560`; added `384`, `448`, `512`, `576`, `672`, `768`, `896`, `1024`, `1152`, `1280`.
- `spacing`: removed `160`; added `176`, `192`, `208`, `224`.

This affects the CSS variables (`--size-*`, `--spacing-*`), every Tailwind utility built on them (`w-*`, `h-*`, `size-*`, `min-*`/`max-*`, `p-*`, `m-*`, `gap-*`, `inset-*`, …), and the JS theme (`sizes.*`, `spacings.*`).

To migrate, replace each removed value with one of its two neighbours on the new scale. Pick whichever fits your layout: the smaller one if the element must not grow, the larger one if its content must not be squeezed. Lumen components use the larger value.

| Removed | Smaller | Larger (used by Lumen) |
| --- | --- | --- |
| `*-400`, `--size-400`, `sizes.s400` | `*-384`, `--size-384`, `sizes.s384` | `*-448`, `--size-448`, `sizes.s448` |
| `*-480`, `--size-480`, `sizes.s480` | `*-448`, `--size-448`, `sizes.s448` | `*-512`, `--size-512`, `sizes.s512` |
| `*-560`, `--size-560`, `sizes.s560` | `*-512`, `--size-512`, `sizes.s512` | `*-576`, `--size-576`, `sizes.s576` |
| `*-160`, `--spacing-160`, `spacings.s160` | `*-144`, `--spacing-144`, `spacings.s144` | `*-176`, `--spacing-176`, `spacings.s176` |

`w-160`, `h-160`, `size-160` and `min-*`/`max-*-160` used to resolve through `--spacing-160` and are removed as well. Use `*-144` or `*-176`.

Tailwind drops unknown classes silently, so a stale `w-400` produces no CSS and no build error. Find every usage with:

```bash
grep -rnE "\b[a-z:-]*-(160|400|480|560)\b|--(size|spacing)-(160|400|480|560)\b|\bs(160|400|480|560)\b" src
```

The preset also clears Tailwind's `--container-*` scale, so the pixel-named `size` scale is the only way to size elements. Every utility built on that scale no longer generates CSS: `w-*`, `min-w-*`, `max-w-*`, `basis-*` and `columns-*` with `3xs` … `7xl` (for example `max-w-md` or `w-3xl`), and the `@3xs:` … `@7xl:` container-query variants. Replace each t-shirt size with its pixel equivalent. The values are identical, so nothing changes visually:

| Removed | Replace with |
| --- | --- |
| `*-3xs` | `*-256` |
| `*-2xs` | `*-288` |
| `*-xs` | `*-320` |
| `*-sm` | `*-384` |
| `*-md` | `*-448` |
| `*-lg` | `*-512` |
| `*-xl` | `*-576` |
| `*-2xl` | `*-672` |
| `*-3xl` | `*-768` |
| `*-4xl` | `*-896` |
| `*-5xl` | `*-1024` |
| `*-6xl` | `*-1152` |
| `*-7xl` | `*-1280` |

For example, `max-w-md` becomes `max-w-448` and `lg:w-3xl` becomes `lg:w-768`. Find them with:

```bash
grep -rnE "\b[a-z0-9:-]*(w|min-w|max-w|basis|columns)-(3xs|2xs|xs|sm|md|lg|xl|[2-7]xl)\b" src
```

For container queries, use arbitrary values such as `@min-[448px]:`.

Also syncs new symbols from Figma: `ArrowBottomLeft`, `Hourglass`, `Repeat` and `Wifi`, plus an updated `Switch`.
