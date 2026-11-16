# design-build

Dev-only Nx project that turns the design sources into every committed
output. Never published — see `## Internals` in [AGENTS.md](../../AGENTS.md).

```text
design-sources (model) ──► Target.emit(model) ──► writer (prettier, write, prune) ──► libs/*
                                                └► check (compare, write nothing)
```

## Commands

- `npx nx run design-build:tokens` — rebuild every token output.
- `npx nx run design-build:icons` — rebuild the published SVGs and the React
  and React Native symbol components.
- `npx nx run design-build:check` — fail if a committed output differs from
  what the sources build: a hand edit, or a source change without a rebuild.
  CI runs it on every PR (`pr.yml`).
- `cli.ts report --before <copy of design-sources> [--fail-on-removal]`
  — the Markdown diff (added, changed, removed, renamed, per mode) the sync PRs
  carry. A name the outputs stop defining without a source change (CSS
  variable, Tailwind utility, React Native path) is caught by
  `check:breaking-changes`, which requires a migration.
  `design-sources-gate.yml` runs it on every PR that touches the sources,
  against the PR base, and fails on removals and renames unless the PR has
  the `design-sources: approve removals` label; adding the label re-runs it.

## Layout

- `src/core/` — the `Target` contract, the writer and the check. Shared by
  every asset kind.
- `src/icons/` — the SVG, React and React Native symbol targets (svgr with
  each lib's own `icon-template.ts`).
- `src/tokens/` — one target per output, each a plain function of the model
  (`design-sources` already resolves references and modes, so no token engine
  sits in between). `cssLayers.ts` builds the CSS declarations every CSS-shaped
  output serializes, `modes.ts` the mode combinations every target reads,
  `naming.ts` is the one place Figma names become output names, and
  `groups.ts` says where each token group goes.
- `src/config.ts` — every output folder. A target owns its folder (or the
  part `owns` names): files it stops emitting are deleted.

## Adding a token group

Add one row to `GROUPS` in `src/tokens/groups.ts`: the Tailwind namespaces
its variables fill and its React Native theme path. Every output reads that
table, and a token without a row fails the build. Every group reaches the web;
`webOnly` keeps one out of the React Native theme and says why.

## Adding an output

Write a `Target` in `src/tokens/` (`emit(model)` returns files, touches no
disk), add it to `tokenTargets` in `src/config.ts`, and run `tokens`. Nothing
in `src/core/` or `design-sources` changes.

## Code syntax

The `code-syntax` target writes `generated/code-syntax.json`: every Figma
variable that builds to CSS, with the `var(--…)` name the CSS target gives it
(Dev Mode's web syntax) and, when the token is on the React Native theme, its
`t.*` path (iOS and Android). `sync-figma code-syntax` uploads it, so Dev Mode
and the code use the same naming functions (`src/tokens/naming.ts`). A test
proves the CSS names and the Dev Mode names are the same set.

## Rules

- **Generated files are never edited by hand**: fix the source or the target.
  The React Native types (`libs/design-core/src/lib/tokens/types.ts`) are
  hand-written shapes over the generated key sets (`generated/js/keys.ts`).
- **The CSS variables hold every web value**: the Tailwind theme only maps its
  namespaces onto them (`--shadow-md: var(--shadow-md)`), so Tailwind and the
  plain CSS themes can't drift apart.
- **A refactor keeps outputs byte-identical**: run `check` before and after. A
  visible change lands in its own commit with a version plan.
