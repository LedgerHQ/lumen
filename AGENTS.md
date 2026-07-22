# Lumen — Ledger Design System

Canonical, always-on guidance for AI agents (Cursor, Claude Code, GitHub Copilot).
Keep this file lean: universal rules only. Everything task-specific lives as an
on-demand skill in [`.claude/skills/`](.claude/skills/) — see the index below.

## Stack

Cross-platform design system (React + React Native) in an **Nx 21** monorepo, npm.
Libs: `design-core`, `ui-react`, `ui-react-visualization`, `ui-rnative`,
`ui-rnative-visualization`, `utils-shared`. Tailwind (design-core preset),
TypeScript strict, Vitest + Testing Library, Storybook + Chromatic, Figma Code Connect.

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
- **Explicit return types** on module-level functions (helps future readers and
  agents). Exception: components returning JSX.

## Skills index

Skills load their full body on demand (progressive disclosure) when the trigger
matches. They live in `.claude/skills/` — a single tree read by Claude Code
(native), Cursor (compat loader), and Copilot.

| When… | Skill |
| --- | --- |
| deciding where a new file/folder lives, or naming it | `file-structure` |
| building or editing a React component in `libs/ui-react` | `react-component-patterns` |
| creating/updating Figma Code Connect (`*.figma.ts`) | `code-connect` |
| syncing design tokens to React Native JS themes after a Figma sync | `figma-token-sync` |

> **Migration in progress.** The remaining conventions still live in
> `.cursor/rules/` and are being moved into skills: react-native component
> patterns, Tailwind token usage, Storybook stories/docs, testing (react &
> rnative), release-plan, Context7 MCP, disabled-context, figma-to-code. Until then, Cursor
> reads them from `.cursor/rules/`; other tools do not.

## How this is wired (maintainers)

One source, no duplication:

- **`AGENTS.md`** (this file) is the canonical always-on core. Cursor and Copilot
  read it natively; Claude Code reads it via `CLAUDE.md` → `@AGENTS.md`.
- **`.claude/skills/`** is the single skills tree, consumed by all three tools.
- Per-tool files (`CLAUDE.md`, `.github/copilot-instructions.md`,
  `.github/instructions/*`) are thin pointers/wrappers — they must not restate
  content. A CI drift check (to be added) will enforce that.
