---
name: component-anatomy
description: >-
  Use when creating, naming, or placing a file or folder in libs/*, or when
  modifying or adding a file to an existing component (even when the barrel isn't
  touched) — component vs utility naming, the one-responsibility-per-file layout,
  when a folder needs an `index.ts` barrel (public API only), and the required
  set of files a component needs per lib. Load this before scaffolding or
  restructuring a component so the layout matches the codebase.
paths: libs/*/src/lib/Components/**/*.tsx, libs/**/index.ts
---

# Component & file anatomy

Naming and layout conventions for everything under `libs/*`. Each responsibility
gets its own file. Barrels (`index.ts`) exist to expose a public API and to
re-export several modules from one entry — not on every folder. Which files a
component *needs* depends on the lib — see the table below and the `Libraries`
map in `AGENTS.md`.

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

A barrel is an `index.ts` that `export *` / `export type *` a folder's **public
API**. Use one when consumers should import the folder, not a specific file:

- **Package / layer barrels** (`Components/index.ts`, `core/index.ts`) — the
  published surface.
- **Component folders** (`Button/`, `TextInput/`, `BaseInput/`) — several files
  (impl, types, sub-parts); the barrel is the import target. Import from that
  barrel, never from `.../Button/Button`.
- **A new public component** must also be re-exported from its parent
  `Components` barrel so it ships from the package root.

Do **not** add a barrel for every folder. Skip `index.ts` when the folder is an
internal helper with a single implementation file (plus tests). Import the file
directly (`useMyHook/useMyHook` is the pattern;
`useMyHook/index.ts` is the anti-pattern to avoid repeating). A
one-file folder does not need a barrel just to re-export that file.

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
useControllableState/             # public util — barrel so consumers import the folder
├── useControllableState.ts
├── useControllableState.test.ts
└── index.ts

useBaseInputValue/                # internal helper, one impl file — no barrel
├── useBaseInputValue.ts
└── useBaseInputValue.test.ts
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
| Missing `index.ts` on a public component / package / layer folder | all libs | new public component folder with no barrel | internal helper folder (single impl + tests) |
| Barrel on a single-file internal folder | all libs | new `index.ts` that only re-exports one sibling file | public component folders; folders that re-export several modules |
| Import from a deep path instead of a public component barrel | all libs | `from '.../Button/Button'` when `Button/index.ts` exists | internal helpers that have no barrel |
| New component not re-exported from the parent `Components` barrel | `ui-react`, `ui-rnative` | parent `index.ts` unchanged | — |
| More than one responsibility in a file (impl + types + stories in one file) | all libs | stories/types/tests inlined in the impl file | — |
| Required file missing for the lib (see table) | per lib | absent `.test.tsx` / `.mdx` / `.figma.tsx` where required | files a lib does not use (e.g. `.mdx`/figma in `ui-rnative-visualization`) |
