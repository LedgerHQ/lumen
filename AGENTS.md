# Lumen — Ledger Design System

Canonical, always-on guidance for AI agents (Cursor, Claude Code, GitHub Copilot).
Keep this file lean: universal rules only. Everything task-specific lives as an
on-demand skill in [`.claude/skills/`](.claude/skills/) — see the index below.

## Stack

Cross-platform design system (React + React Native) in an **Nx 22** monorepo, npm.
Libs: `design-core`, `ui-react`, `ui-react-visualization`, `ui-rnative`,
`ui-rnative-visualization`, `utils-shared`. Tailwind (design-core preset),
TypeScript strict, Vitest + Testing Library, Storybook + Chromatic, Figma Code Connect.

## Libraries

The canonical map from a path to its platform and conventions. Skills route by
lib rather than re-describing this table; derive the touched libs from a diff
with `git diff origin/main...HEAD --name-only | cut -d/ -f1-2 | sort -u`.

| Lib path | Package | Platform | Styling | Tests | Docs (stories / mdx / figma) |
| --- | --- | --- | --- | --- | --- |
| `libs/ui-react` | `@ledgerhq/lumen-ui-react` | React web | Tailwind + `cva` + `cn` | Vitest + RTL, no wrapper | co-located `.stories.tsx` / `.mdx` / `.figma.tsx` |
| `libs/ui-react-visualization` | `@ledgerhq/lumen-ui-react-visualization` | React web | Tailwind | Vitest + RTL | `__stories__/` / `.mdx` / **no** figma |
| `libs/ui-rnative` | `@ledgerhq/lumen-ui-rnative` | React Native | `useStyleSheet` + themeJS + `lx` | Jest + RNTL, `ThemeProvider` wrapper | co-located `.stories.tsx` / `.mdx` / `.figma.tsx` |
| `libs/ui-rnative-visualization` | `@ledgerhq/lumen-ui-rnative-visualization` | React Native | `useTheme()` + inline styles | Jest + RNTL, `ThemeProvider` wrapper | flat `.stories.tsx` / **no** mdx / **no** figma |
| `libs/design-core` | `@ledgerhq/lumen-design-core` | Cross-platform tokens | CSS/Tailwind tokens + JS theme objects (source of truth) | — | — |
| `libs/utils-shared` | `@ledgerhq/lumen-utils-shared` | Cross-platform TS/React | — | Vitest | — |

## Commands

- Install: `npm install --legacy-peer-deps`
- Test a lib: `npx nx run @ledgerhq/lumen-ui-react:test` (or `…-ui-rnative:test`)
- Lint all: `npx nx run-many --target=lint --all`
- Typecheck all: `npx nx run-many --target=typecheck --all`
- Build all: `npx nx run-many --target=build --all`
- Storybook: `npx nx run @ledgerhq/lumen-ui-react:serve:storybook`

Prefer the Nx MCP server (`nx_workspace`, `nx_generators`, …) for workspace
questions and generators instead of guessing.

## Universal rules

- **The codebase is the source of truth.** Read the file you're touching and one
  neighbour that shows the local convention before writing. Reading beats guessing.
- **Load the matching skill before non-trivial work.** Skills (below) are the
  authoritative conventions; when a skill conflicts with this file, the skill wins.
- **Comments explain intent, not mechanics.** Comment the *why* (trade-offs,
  gotchas, constraints), never restate the code. Prefer clear names over comments.
- **JSDoc must not restate TypeScript.** Do not list union/literal values in
  JSDoc (e.g. `- \`'plain'\`: …`). Types and JSDoc parsers already surface them.
- **Explicit return types** on module-level functions (helps future readers and
  agents). Exception: components returning JSX.
- **Library changes need a version plan.** Any change under `libs/*/src/` requires
  an Nx version plan in `.nx/version-plans/` — bump type always `patch`, one
  package per file (see the `release-plan` skill).

## Skills index

Skills load their full body on demand (progressive disclosure) when the trigger
matches. They live in `.claude/skills/` — a single tree read by Claude Code
(native) and Cursor (compat loader). Copilot does not read this tree; it relies
on `AGENTS.md` plus the `.github/instructions/*` restatements.

Skills are grouped by **topic**, not by platform: a `component-*` skill is
cross-platform and routes internally by lib (web vs React Native) using the
`Libraries` table above. Unprefixed skills are workflow / meta. Each skill's
`paths` frontmatter controls auto-attach.

| When… | Skill |
| --- | --- |
| designing a component's API, composition, or state model | `component-architecture` |
| deciding where a file/folder lives, naming it, or scaffolding a component | `component-anatomy` |
| building or styling a component (web Tailwind or RN `useStyleSheet`) | `component-styling` |
| writing component tests (Vitest or Jest) | `component-testing` |
| implementing a component from a Figma link | `figma-to-code` |
| creating/updating Figma Code Connect (`*.figma.tsx`) | `code-connect` |
| syncing design tokens to React Native JS themes after a Figma sync | `figma-token-sync` |
| writing or editing Storybook stories (`*.stories.tsx`) | `component-stories` |
| writing or editing Storybook MDX docs (`*.mdx`) | `component-mdx` |
| generating an Nx version plan (`.nx/version-plans/`) | `release-plan` |
| a component has or owns a `disabled` state | `disabled-context` |
| researching an external library/framework | `context7` |
| opening a PR from the current branch (manual — run `/open-pr`) | `open-pr` |
| reviewing a PR, a branch, or code changes | `pr-review` |
| running Nx tasks/generators, or asking workspace questions | `nx` |


## How this is wired (maintainers)

One source, no duplication:

- **`AGENTS.md`** (this file) is the canonical always-on core. Cursor and Copilot
  read it natively; Claude Code reads it via `CLAUDE.md` → `@AGENTS.md`.
- **`.claude/skills/`** is the single skills tree, consumed by Claude Code and
  Cursor. Copilot has no skills mechanism, so per-skill review guidance is
  restated under `.github/instructions/*`. **`.claude/agents/`** (subagents) is
  shared by Claude Code and Cursor.
- **Internal vs published skills.** `.claude/skills/` is the **internal** tree —
  skills for people *building* Lumen (maintainers). A future top-level `skills/`
  tree will hold **published**, consumer-facing skills for people *using* Lumen
  in their apps — versioned, with `evals/` and a `## Performance` section per
  README, following the [CDS](https://github.com/coinbase/cds) layout. Nothing is
  published yet; the boundary is reserved. Name internal skills for the
  maintainer task (`component-styling`, `component-anatomy`), leaving
  consumer-facing names (e.g. `lumen-code`) free for the published tree.
- Per-tool files (`CLAUDE.md`, `.github/copilot-instructions.md`,
  `.github/instructions/*`) are thin pointers/wrappers — they must not restate
  content. The `scripts/check-agent-docs.mjs` drift check (run in CI via
  `npm run check:agent-docs`) enforces the mechanical invariants: the AGENTS.md
  index and the skill folders stay in bijection, inter-skill references resolve,
  cited repo paths exist, and no skill hardcodes a stale tool version.
- **MCP servers are the one exception to "no duplication":** each tool hardcodes
  its own project-scoped path (Claude Code → `.mcp.json`, Cursor →
  `.cursor/mcp.json`), so these files are kept in parallel and synced by hand —
  edit both when adding or changing a server (not CI-enforced). The only expected
  difference is the `type` field: Claude states it explicitly; Cursor infers it
  from `url`.
