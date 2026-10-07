---
'@ledgerhq/lumen-ui-rnative': patch
---

BREAKING_CHANGE(tokens): align size and spacing scales with Tailwind

The theme's `sizes` lose `s400`, `s480` and `s560` and gain `s384`, `s448`, `s512`, `s576`, `s672`, `s768`, `s896`, `s1024`, `s1152` and `s1280`. `spacings` lose `s160` (and `-s160`) and gain `s176`, `s192`, `s208` and `s224`. This applies to both `lx` values and `useStyleSheet` / `useTheme` (`t.sizes.*`, `t.spacings.*`).

To migrate, replace each removed token with one of its two neighbours on the new scale. Pick whichever fits your layout: the smaller one if the element must not grow, the larger one if its content must not be squeezed. Lumen components use the larger value.

| Removed | Smaller | Larger (used by Lumen) |
| --- | --- | --- |
| `'s400'`, `t.sizes.s400` | `'s384'`, `t.sizes.s384` | `'s448'`, `t.sizes.s448` |
| `'s480'`, `t.sizes.s480` | `'s448'`, `t.sizes.s448` | `'s512'`, `t.sizes.s512` |
| `'s560'`, `t.sizes.s560` | `'s512'`, `t.sizes.s512` | `'s576'`, `t.sizes.s576` |
| `'s160'` / `'-s160'`, `t.spacings.s160` | `'s144'` / `'-s144'`, `t.spacings.s144` | `'s176'` / `'-s176'`, `t.spacings.s176` |

Removed tokens are type errors in `lx`, so `tsc` lists every usage to update.
