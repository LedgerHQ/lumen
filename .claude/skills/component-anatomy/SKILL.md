---
name: component-anatomy
description: >-
  Use when creating, naming, or placing a file or folder in libs/*, or when
  modifying or adding a file to an existing component (even when the barrel isn't
  touched) — component vs utility naming, the one-responsibility-per-file layout
  with a barrel, and the required set of files a component needs per lib. Load
  this before scaffolding or restructuring a component so the layout matches the
  codebase.
paths: libs/*/src/lib/Components/**/*.tsx, libs/**/index.ts
---

# Component & file anatomy

Naming and layout conventions for everything under `libs/*`. Each responsibility
gets its own file; the folder's public API is exposed through an `index.ts`
barrel. Which files a component *needs* depends on the lib — see the table below
and the `Libraries` map in `AGENTS.md`.

## Naming

- **Components** live in a **PascalCase** folder, one file per responsibility.
- **Utilities & hooks** live in a **camelCase** folder, split by responsibility.
- Everything that is not a component is camelCase.

## One responsibility per file

Split implementation, types, tests, stories, docs and Code Connect into separate
files rather than one large module. This keeps diffs small and lets each skill
(`component-styling`, `component-testing`, `component-stories`, `component-mdx`,
`code-connect`) attach to the file it owns.

## Barrel & re-export

- Every folder exposes its public API through `index.ts` (`export *` and
  `export type *`). Import from the barrel, never from deep paths.
- A new component must also be re-exported from its parent `Components` barrel so
  it ships from the package root.

## Component folder layout

```
ComponentName/
├── ComponentName.tsx          # implementation
├── types.ts                   # prop types with JSDoc
├── ComponentName.test.tsx     # tests
├── ComponentName.stories.tsx  # Storybook stories
├── ComponentName.mdx          # Storybook docs
├── ComponentName.figma.tsx    # Figma Code Connect
└── index.ts                   # barrel exposing the public API
```

## Utility / hook folder layout

```
useControllableState/
├── useControllableState.ts       # implementation
├── useControllableState.test.ts  # tests
└── index.ts                      # barrel exposing the public API
```

## Required files per lib

Not every lib ships the full set. A component addition is complete when it has
the files marked required for its lib — do not add (or flag as missing) files a
lib does not use.

| Lib | impl `.tsx` | `types.ts` | `.test.tsx` | stories | `.mdx` | `.figma.tsx` |
| --- | --- | --- | --- | --- | --- | --- |
| `ui-react` | required | required | required | co-located `.stories.tsx` | required | if in Figma |
| `ui-rnative` | required | required | required | co-located `.stories.tsx` (id prefix `rnative-*`) | required | if in Figma |
| `ui-react-visualization` | required | required | required | in `__stories__/` | required | none |
| `ui-rnative-visualization` | required | required | required | flat `.stories.tsx` | none | none |
| `design-core` | n/a (tokens, no components) | — | — | — | — | — |
| `utils-shared` | camelCase util files | co-located or inline | required | — | — | — |

Notes:

- **Stories naming** — `Base` (not `Default`/`Primary`), `{Property}Showcase`,
  `With{Feature}`; see `component-stories`. In `ui-rnative` the `Base` render is
  usually explicit (`render: (args) => <Component {...args} />`).
- **Docs** — the two-tab Overview / Implementation structure lives in
  `component-mdx`.
- **Disabled state** — any component with a `disabled` state must consume the
  shared disabled context; see `disabled-context`.

## Review checks

Rules verifiable from a diff. Everything above is authoring guidance.

| Check | Applies to | Detect | Skip |
| --- | --- | --- | --- |
| Component folder/file not PascalCase, or utility not camelCase | all libs | folder/file casing vs kind | — |
| Missing `index.ts` barrel, or import from a deep path instead of the barrel | all libs | new folder with no `index.ts`; `from '.../ComponentName/ComponentName'` | — |
| New component not re-exported from the parent `Components` barrel | `ui-react`, `ui-rnative` | parent `index.ts` unchanged | — |
| More than one responsibility in a file (impl + types + stories in one file) | all libs | stories/types/tests inlined in the impl file | — |
| Required file missing for the lib (see table) | per lib | absent `.test.tsx` / `.mdx` / `.figma.tsx` where required | files a lib does not use (e.g. `.mdx`/figma in `ui-rnative-visualization`) |
