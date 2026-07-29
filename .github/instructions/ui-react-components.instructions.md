---
applyTo: "libs/ui-react/**/*.tsx"
---

# Review checklist — React components (`libs/ui-react`)

Review against the conventions in the `react-styling` and
`file-structure` skills (`/.claude/skills/`) and `/AGENTS.md`. Flag when:

- Variant composition or many classnames are inlined instead of using `cva` at
  the top of the file (or `cva` is used where a couple of inline classnames would do).
- Raw Tailwind values are used instead of design-system tokens (e.g.
  `text-gray-500`, `font-bold`, arbitrary sizes like `w-[108px]`).
- Props are not drilled to the top-level element, or a nested `ref`/`className` is
  overloaded onto a top-level prop instead of a distinctly named one.
- File/folder layout diverges from the convention: PascalCase component folder,
  one file per responsibility, public API exposed via `index.ts`.
- A module-level (non-component) function is missing an explicit return type.

Keep review comments scoped to these; detailed rationale lives in the skills.
