# Lumen — Ledger Design System

Canonical, always-on guidance for AI agents (Cursor, Claude Code, GitHub Copilot).
Keep this file lean: universal rules only. Everything task-specific lives as an
on-demand skill in `[.claude/skills/](.claude/skills/)` — see the index below.

## Stack

Cross-platform design system (React + React Native) in an **Nx 22** monorepo, npm.
Libs: `design-core`, `ui-react`, `ui-rnative`, `utils-shared`, `lint-plugin`. Tailwind (design-core preset),
TypeScript strict, Vitest + Testing Library, Storybook + Chromatic, Figma Code Connect.
Dev-only tooling lives outside `libs/` in `internals/` — see `## Internals`.

## Libraries

The canonical map from a path to its platform and conventions. Skills route by
lib rather than re-describing this table; derive the touched libs from a diff
with `git diff origin/main...HEAD --name-only | cut -d/ -f1-2 | sort -u`.

| Lib path            | Package                        | Platform                | Styling                                                  | Tests                                | Docs (stories / mdx / figma)                      |
| ------------------- | ------------------------------ | ----------------------- | -------------------------------------------------------- | ------------------------------------ | ------------------------------------------------- |
| `libs/ui-react`     | `@ledgerhq/lumen-ui-react`     | React web               | Tailwind + `cva` + `cn`                                  | Vitest + RTL, no wrapper             | co-located `.stories.tsx` / `.mdx` / `.figma.tsx` |
| `libs/ui-rnative`   | `@ledgerhq/lumen-ui-rnative`   | React Native            | `useStyleSheet` + themeJS + `lx`                         | Jest + RNTL, `ThemeProvider` wrapper | co-located `.stories.tsx` / `.mdx` / `.figma.tsx` |
| `libs/design-core`  | `@ledgerhq/lumen-design-core`  | Cross-platform tokens   | CSS/Tailwind tokens + JS theme objects (source of truth) | —                                    | —                                                 |
| `libs/utils-shared` | `@ledgerhq/lumen-utils-shared` | Cross-platform TS/React | —                                                        | Vitest                               | —                                                 |
| `libs/lint-plugin`  | `@ledgerhq/lumen-lint-plugin`  | ESLint + oxlint         | — (plain ESM JS + JSDoc, no build to lint)               | Vitest                               | —                                                 |

## Internals

`internals/*` holds Nx projects that are **local/dev-only and never published**.
Litmus test: _would a consumer of `@ledgerhq/lumen-_` ever load this code?\* If
no, it belongs here — codegen, ETL, external-API sync and their input data.

| Path                      | Purpose                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `internals/sync-figma`    | Everything crossing the Figma boundary — tokens, symbols, code-syntax write-back. Targets and usage in its own `README.md` |
| `internals/repo-tools`    | Repo plumbing invoked by path, not imported — CI validators and helpers. See its own `README.md`                           |
| `internals/adoption-tool` | Tracks which Lumen version external consumer repos have adopted, vs. latest. See its own `README.md`                       |

Rules for adding one:

- Folder = the job, named after the workflow that drives it (`sync-figma` ↔
  `.github/workflows/sync-figma.yml`), or after its role when it serves several
  (`repo-tools`). Nx project name = folder name, unscoped.
- `private: true` package.json under the `@lumen/*` scope. Dev dependencies stay
  in the root manifest. Never needs a version plan.
- Tags `["scope:internal", "type:tooling"]` in `project.json` — the tag is what
  the boundary rule matches on when a lib tries to import it.
- Code in `src/`, spreading `sharedConfig` — the dev profile, same as `apps/*`.
  `prodConfig` is for published libs.
- May import `scope:internal` and `scope:shared` only, and nothing under `libs/`
  or `apps/` may import it — see `depConstraints` in `eslint.config.mjs`.
  Filesystem _writes_ into libs are expected; only imports are governed.
- Run `npx nx sync` after adding one.

`internals/repo-tools/src/ci/check-agent-docs/agentDocsDrift.ts` enforces
the table and the first four rules.

## Commands

- Install: `npm install --legacy-peer-deps`
- Test a lib: `npx nx run @ledgerhq/lumen-ui-react:test` (or `…-ui-rnative:test`)
- Lint all: `npx nx run-many --target=lint --all`
- Typecheck all: `npx nx run-many --target=typecheck --all`
- Build all: `npx nx run-many --target=build --all`
- Storybook: `npx nx run @ledgerhq/lumen-ui-react:serve:storybook`
- Dependency versions: `npm run check:deps` (fix with `npm run fix:deps`) — one
  version per package across every manifest. A second version is allowed only
  through a labeled `versionGroups` entry in `.syncpackrc.json`.

Prefer the Nx MCP server (`nx_workspace`, `nx_generators`, …) for workspace
questions and generators instead of guessing.

## Universal rules

- **The codebase is the source of truth.** Read the file you're touching and one
  neighbor that shows the local convention before writing. Reading beats guessing.
- **Load the matching skill before non-trivial work.** Skills (below) are the
  authoritative conventions; when a skill conflicts with this file, the skill wins.
- **Comments explain intent, not mechanics.** Comment the _why_ (trade-offs,
  gotchas, constraints), never restate the code. Prefer clear names over comments. Comment only when necessary, prevent verbose comment.
- **JSDoc must not restate TypeScript.** Do not list union/literal values in
  JSDoc (e.g. `- \`'plain'\`: …`). Types and JSDoc parsers already surface them.
- **American English** everywhere (code, comments, docs, tests): `color`, `behavior`, `canceled`.
- **Explicit return types** on module-level functions (helps future readers and
  agents). Exception: components returning JSX.
- **Library changes need a version plan.** Any change under `libs/*/src/` requires
  an Nx version plan in `.nx/version-plans/` — bump type always `patch`, one
  package per file (see the `release-plan` skill). `internals/*` is never
  published, so changes there need no plan.

## Skills index

Skills load their full body on demand (progressive disclosure) when the trigger
matches. They live in `.claude/skills/` — a single tree read by Claude Code
(native), Cursor (compat loader), and GitHub Copilot code review (which reads
`AGENTS.md` and the skills tree from the PR head branch). A single
`.github/instructions/*` hook (`applyTo: "**"`) routes Copilot review into the
`pr-review` skill; it restates no rules.

Skills are grouped into three **categories** below. The folders stay flat
(`.claude/skills/<name>/`), because Claude Code and Copilot only discover
direct children; the category lives in this index only. Within Build, a
`component-*` skill is cross-platform and routes internally by lib (web vs
React Native) using the `Libraries` table above. Each skill's `paths`
frontmatter controls auto-attach.

- **Build**: shapes code in `libs/`; most auto-attach through `paths`.
- **Process**: moves work through the pipeline (ticket → PR → review →
  release → announcement); usually writes to GitHub, Jira or Slack.
- **Discovery**: reads outside the repo (consumers, other design systems,
  library docs) and produces knowledge, not code.

### Build

| When…                                                                     | Skill                    |
| ------------------------------------------------------------------------- | ------------------------ |
| designing a component's API, composition, or state model                  | `component-architecture` |
| deciding where a file/folder lives, naming it, or scaffolding a component | `component-anatomy`      |
| building or styling a component (web Tailwind or RN `useStyleSheet`)      | `component-styling`      |
| writing component tests (Vitest or Jest)                                  | `component-testing`      |
| writing or editing Storybook stories (`*.stories.tsx`)                    | `component-stories`      |
| writing or editing Storybook MDX docs (`*.mdx`)                           | `component-mdx`          |
| a component has or owns a `disabled` state                                | `disabled-context`       |
| implementing a component from a Figma link                                | `figma-to-code`          |
| creating/updating Figma Code Connect (`*.figma.tsx`)                      | `code-connect`           |
| syncing design tokens to React Native JS themes after a Figma sync        | `figma-token-sync`       |
| adding, upgrading or moving a dependency, or a failing `check:deps`       | `dependency-management`  |
| running Nx tasks/generators, or asking workspace questions                | `nx`                     |

### Process

| When…                                                                  | Skill                 |
| ---------------------------------------------------------------------- | --------------------- |
| creating DLS Jira tickets (bug, task, epic from the scope spreadsheet) | `jira-ticket`         |
| opening a PR from the current branch (manual — run `/open-pr`)         | `open-pr`             |
| reviewing a PR, a branch, or code changes                              | `pr-review`           |
| generating an Nx version plan (`.nx/version-plans/`)                   | `release-plan`        |
| announcing a shipped release in Slack from a GitHub Releases dump      | `release-notes-slack` |

### Discovery

| When…                                                                                            | Skill                    |
| ------------------------------------------------------------------------------------------------ | ------------------------ |
| comparing how other design systems handle a component, name, token or pattern (shareable report) | `ds-discovery`           |
| testing a breaking/architectural change or a usage scan across consumer repos (shareable report) | `consumer-impact`        |
| checking Lumen version adoption across consumer repos                                            | `lumen-adoption-report`  |
| researching an external library/framework                                                        | `context7`               |
| upgrading a consumer repo to the latest Lumen (manual — run `/lumen-consumer-upgrade`)           | `lumen-consumer-upgrade` |

## How this is wired (maintainers)

One source, no duplication:

- `AGENTS.md` (this file) is the canonical always-on core. Cursor and Copilot
  read it natively; Claude Code reads it via `CLAUDE.md` → `@AGENTS.md`.
- `.claude/skills/` is the single skills tree, consumed by Claude Code,
  Cursor, and GitHub Copilot code review (it reads the skills tree and `AGENTS.md`
  from the PR head branch). A single `.github/instructions/*` file
  (`applyTo: "**"`) is a thin, ruleless hook that routes Copilot review into the
  `pr-review` skill — no per-skill restatements. `.claude/agents/` (subagents)
  is shared by Claude Code and Cursor.
- **Internal vs published skills.** `.claude/skills/` is the **internal** tree —
  skills for people _building_ Lumen (maintainers). A future top-level `skills/`
  tree will hold **published**, consumer-facing skills for people _using_ Lumen
  in their apps — versioned, with `evals/` and a `## Performance` section per
  README, following the [CDS](https://github.com/coinbase/cds) layout. Nothing is
  published yet; the boundary is reserved. Name internal skills for the
  maintainer task (`component-styling`, `component-anatomy`), leaving
  consumer-facing names (e.g. `lumen-code`) free for the published tree.
- Per-tool files (`CLAUDE.md`, `.github/copilot-instructions.md`,
  `.github/instructions/*`) are thin pointers/wrappers — they must not restate
  content. The `internals/repo-tools/src/ci/check-agent-docs/agentDocsDrift.ts`
  drift check (run in CI as the
  `agent-drift` job via `npm run check:agent-docs`) enforces the mechanical
  invariants: the AGENTS.md index and the skill folders stay in bijection,
  inter-skill references resolve, cited repo paths exist, no skill hardcodes a
  stale tool version, every skill's `paths:` globs still match at least one file,
  the Libraries table matches the libs on disk (path + package name), every
  `internals/*` project matches the Internals table and its four rules, and
  `.mcp.json` and `.cursor/mcp.json` stay in parity.
- **MCP servers are the one exception to "no duplication":** each tool hardcodes
  its own project-scoped path (Claude Code → `.mcp.json`, Cursor →
  `.cursor/mcp.json`), so these files are kept in parallel and synced by hand —
  edit both when adding or changing a server. Expected differences: the `type`
  field (Claude states it explicitly; Cursor infers it from `url`) and OAuth
  settings (`oauth` for Claude, `auth` for Cursor). A server that needs a
  per-person OAuth client secret lives only in `.cursor/mcp.json`; Claude Code
  users add it once at user scope, because Claude Code stores the secret only at
  `claude mcp add` time and a `.mcp.json` entry would shadow theirs. Setup steps:
  `docs/mcp-servers.md`.
