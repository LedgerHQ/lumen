---
name: figma-to-code
description: >-
  Use when implementing or updating a component from a Figma link — how to turn
  the Figma design variables into code tokens, on both platforms: Tailwind
  classnames for libs/ui-react and themeJS (`t.*`) paths for libs/ui-rnative. For
  the full token catalogues and styling mechanics, see component-styling.
---

# Figma → code

Use the Figma MCP server to read the design. This skill covers only the
**variable → token derivation** — the part that is specific to extracting from
Figma. For the full token lists, `cva`, `useStyleSheet` and the rest, see
`component-styling`.

Route by the lib you're implementing in (see the `Libraries` table in
`AGENTS.md`): web → the Tailwind mapping; React Native → the themeJS mapping.

## React web (`libs/ui-react`) — Figma variable → Tailwind class

Combine the Tailwind prefix for the CSS property with the **unique part** of the
token name (the segment after the last hyphen of the CSS variable).

| Figma shows | Prefix | Write | Not |
| --- | --- | --- | --- |
| `background-color: var(--background-base)` | `bg-` | `bg-base` | `bg-background-base` |
| `color: var(--text-on-accent)` | `text-` | `text-on-accent` | `text-text-on-accent` |
| `border-color: var(--border-muted)` | `border-` | `border-muted` | `border-border-muted` |
| `padding: var(--spacing-4)` | `p-` | `p-4` | `p-spacing-4` |
| `border-radius: var(--radius-lg)` | `rounded-` | `rounded-lg` | `rounded-radius-lg` |
| `border-width: var(--border-width)` | `border` | `border` | `border-width` |
| `border-width: var(--border-width-active)` | `border` | `border-2` | `border-width-active` |

- **Typography**: Figma shows a style-name comment like `/* body/3 */`. No prefix
  — replace `/` with `-`: `body-3`.
- **Drop shadow**: Figma shows `/* box-shadow/sm */`. Prefix `shadow-`, take the
  unique part after the last `-`: `shadow-sm`. Values: `shadow-sm`…`shadow-2xl`.

## React Native (`libs/ui-rnative`) — Figma variable → themeJS path

There are no classnames on RN. The same Figma variable maps to a path on the
`t` object inside `useStyleSheet((t) => …)` (same token vocabulary as web, JS
object shape — see `component-styling/references/rnative.md`).

| Figma shows | themeJS path |
| --- | --- |
| `var(--background-base)` | `t.colors.bg.base` |
| `var(--text-on-accent)` | `t.colors.text.onAccent` |
| `var(--border-muted)` | `t.colors.border.muted` |
| `var(--spacing-4)` | `t.spacings.s4` |
| `var(--radius-lg)` | `t.borderRadius.lg` |
| typography `/* body/3 */` | `t.typographies.body3` |

- **Colours** are nested under a category key (`bg` / `text` / `border`), and
  kebab segments become camelCase keys (`on-accent` → `onAccent`).
- **Spacings and sizes are `s`-prefixed by pixel value**: `--spacing-4` →
  `t.spacings.s4`, `--spacing-16` → `t.spacings.s16`; sizes likewise
  (`t.sizes.s112`, plus `t.sizes.full` for `100%`).
- **Border radius keys are named**, not pixel values: `none`, `xs`, `sm`, `md`,
  `lg`, `xl`, `2xl`, `full` (so `t.borderRadius['2xl']`).
- **Typography keys are camelCase**: `body/3` → `t.typographies.body3`,
  `body/2-semi-bold` → `t.typographies.body2SemiBold`.
- Source of truth for the key sets:
  `libs/design-core/src/lib/themes/js/primitives/primitives.others.ts` (spacings,
  sizes, borderRadius) and the per-brand `theme.*.ts` colour objects. Confirm a
  key there rather than inventing one.

## When a Figma size has no token (both platforms)

1. **Use the closest available token** (e.g. `112` for Figma's 108, `96` for 90).
2. **Document the deviation** in a code comment.
3. **Consider requesting the token** be added if it's needed often.

```tsx
// ✅ Web — closest token, documented
<Tile className='w-112' size='md' /> // 112px (closest to Figma's 108px)
```
