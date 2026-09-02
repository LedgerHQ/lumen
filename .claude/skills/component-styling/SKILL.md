---
name: component-styling
description: >-
  Use when building or styling a component in libs/ui-react or libs/ui-rnative
  (and their visualization libs) — the cross-platform styling principles, plus
  routing to the platform mechanics: Tailwind + cva + cn on web, useStyleSheet +
  themeJS + lx on React Native. Load this before writing component styles.
paths: libs/ui-react/**/*.tsx, libs/ui-react/**/*.ts, libs/ui-rnative/**/*.tsx, libs/ui-rnative/**/*.ts, libs/ui-rnative-visualization/**/*.tsx
---

# Component styling

Lumen ships the same components on web and React Native. The *vocabulary* of
design tokens is shared across both (`bg-muted` ↔ `t.colors.bg.muted`); the
*mechanism* is not. This skill states the principles that hold on both platforms,
then routes you to the platform mechanics.

## Route by lib

Derive the touched lib from the path (see the `Libraries` table in `AGENTS.md`),
then read the matching reference:

| Lib | Read |
| --- | --- |
| `libs/ui-react` | `references/react.md` (Tailwind + cva + cn) |
| `libs/ui-rnative`, `libs/ui-rnative-visualization` | `references/rnative.md` (`useStyleSheet` + themeJS + `lx`) |

**Never apply one platform's mechanics to the other lib.** A className on an RN
file or a `useStyleSheet` call on a web file is always wrong.

## Shared principles (both platforms)

These hold regardless of mechanism — the references show how each realises them.

- **Design tokens, never raw values.** Colours, typography, spacing and sizes
  come from the design system, not from raw Tailwind palette classes / arbitrary
  sizes (web) or hardcoded literals (RN). The token catalogues live in
  `references/*`.
- **Props-drill to the top-level element.** Behaviour must never be hidden. When
  a prop legitimately targets a *nested* element (a nested `ref`, `className`,
  or `style`), give it a distinct name (`contentClassName`, `inputStyle`) rather
  than overloading the top-level prop.
- **Compose variants declaratively.** Appearance / size / state maps are declared
  once at the top of the styling layer (`cva` on web, `Record<Variant, value>`
  inside `useStyleSheet` on RN), never assembled ad hoc in the render body.
- **Never build a style value by concatenation.** ``text-${color}`` and its RN
  equivalents are wrong — use complete token strings and a merge helper (`cn` on
  web, `StyleSheet.flatten` on RN).

## Review checks

Rules verifiable from a diff. Lint already covers unknown/invalid Tailwind
classnames, banned imports and formatting — see the "already enforced" list in
`pr-review`; don't raise those here.

| Check | Applies to | Detect | Skip |
| --- | --- | --- | --- |
| Raw Tailwind value instead of a token | react | `text-gray-`, `bg-blue-`, `font-bold`, `text-sm`, `w-[`, `h-[` | `.mdx` doc-table markup |
| Dynamic classname built by concatenation | react | `` className={`...${ ` `` | — |
| Classnames in a bare string variable instead of `cn()` / `cva()` | react | `const … = 'flex …'` outside a `cn(` / `cva(` call | strings inlined in `className` |
| `cva` skipped where variants/many classes exist (or forced for 1–2 classes) | react | inline variant branching in JSX | — |
| `data-[state=…]` on a Base UI primitive (or `data-[open]` on a Radix one) | react | import source vs attribute form | — |
| Hardcoded colour/spacing/size literal instead of a `t.*` token | rnative | numeric or `'#…'` inside `useStyleSheet` | geometry constants in `ui-rnative-visualization` |
| Large stylesheet inlined in the component body instead of a `useXStyles` hook | rnative | `useStyleSheet` call inline in the component | small one-off styles |
| Consumer `style`/`lx` merged before internal styles (consumer can't win) | rnative | `flatten([style, styles.root])` (reversed order) | — |
| Nested override overloads the top-level prop instead of a distinct name | both | one `className`/`style` prop feeding an inner element | — |
