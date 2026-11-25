# design-build

Builds every committed output from the design sources, and checks they are up
to date. Dev-only, never published. Processes (sync, new token, new group):
[docs/design-pipeline.md](../../docs/design-pipeline.md).

```text
design-sources (model) ──► Target.emit(model) ──► writer (prettier, write, prune) ──► libs/*
                                                └► check (compare, write nothing)
```

## Commands

- `npx nx run design-build:tokens` / `:icons` — rebuild the outputs.
- `npx nx run design-build:check` — validate the sources and fail if a
  committed output differs from what they build. CI runs it on every PR.
- `cli.ts report --before <copy of design-sources>` — the Markdown diff the
  sync PR carries.

## Layout

- `src/core/` — the `Target` contract, the writer and the check.
- `src/tokens/` — one target per output, plain functions of the model, plus:
  `groups.ts` (which outputs read each token group), `modes.ts` (the mode
  combinations), `cssLayers.ts` (the CSS declarations), `naming.ts` (Figma
  names → output names).
- `src/icons/` — the React and React Native symbol targets (svgr).
- `src/config.ts` — every output folder. A target owns its folder: files it
  stops emitting are deleted.

A new output is a `Target` in `src/tokens/`, added to `tokenTargets`.

## Rules

- **Generated files are never edited by hand.** `types.ts` in design-core is
  hand-written, over the generated key sets (`generated/js/keys.ts`).
- **The CSS variables hold every web value:** Tailwind only maps its
  namespaces onto them, so the two can't drift.
- **A refactor keeps outputs byte-identical:** run `check` before and after.
