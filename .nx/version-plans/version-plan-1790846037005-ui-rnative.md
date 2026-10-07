---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(tokens): move sizes from 256px upwards to t-shirt names

From 256px upwards, the theme's `sizes` use `s`-prefixed t-shirt keys: `s3Xs` (256), `s2Xs` (288), `sXs` (320), `sSm` (384), `sMd` (448), `sLg` (512), `sXl` (576), `s2Xl` (672), `s3Xl` (768), `s4Xl` (896), `s5Xl` (1024), `s6Xl` (1152) and `s7Xl` (1280). `s256`, `s288`, `s320`, `s400`, `s480` and `s560` are gone. `spacings` lose `s160` (and `-s160`) and gain `s176`, `s192`, `s208` and `s224`. This applies to both `lx` values (`lx={{ width: 'sMd' }}`) and `useStyleSheet` / `useTheme` (`t.sizes.sMd`).

To migrate, rename the moved sizes and replace each removed token with one of its two neighbours on the new scale. Pick the smaller one if the element must not grow, the larger one if its content must not be squeezed. Lumen components use the larger value.

| Before                                  | Replace with                            | Or                                      |
| --------------------------------------- | --------------------------------------- | --------------------------------------- |
| `'s256'`, `t.sizes.s256`                | `'s3Xs'`, `t.sizes.s3Xs`                |                                         |
| `'s288'`, `t.sizes.s288`                | `'s2Xs'`, `t.sizes.s2Xs`                |                                         |
| `'s320'`, `t.sizes.s320`                | `'sXs'`, `t.sizes.sXs`                  |                                         |
| `'s400'`, `t.sizes.s400`                | `'sSm'`, `t.sizes.sSm`                  | `'sMd'`, `t.sizes.sMd` (Lumen)          |
| `'s480'`, `t.sizes.s480`                | `'sMd'`, `t.sizes.sMd`                  | `'sLg'`, `t.sizes.sLg` (Lumen)          |
| `'s560'`, `t.sizes.s560`                | `'sLg'`, `t.sizes.sLg`                  | `'sXl'`, `t.sizes.sXl` (Lumen)          |
| `'s160'` / `'-s160'`, `t.spacings.s160` | `'s144'` / `'-s144'`, `t.spacings.s144` | `'s176'` / `'-s176'`, `t.spacings.s176` |

Removed tokens are type errors in `lx`, so `tsc` lists every usage to update.
