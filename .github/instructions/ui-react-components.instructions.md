---
applyTo: "libs/ui-react/**/*.tsx"
---

# Review checklist — React components (`libs/ui-react`)

Review against the conventions in the `react-component-patterns` and
`file-structure` skills (`/.claude/skills/`) and `/AGENTS.md`. Flag when:

- Variant composition or many classnames are inlined instead of using `cva` at
  the top of the file (or `cva` is used where a couple of inline classnames would do).
- Props are not drilled to the top-level element, or a nested `ref`/`className` is
  overloaded onto a top-level prop instead of a distinctly named one.
- File/folder layout diverges from the convention: PascalCase component folder,
  one file per responsibility, public API exposed via `index.ts`.
- A module-level (non-component) function is missing an explicit return type.

Keep review comments scoped to these; detailed rationale lives in the skills.
