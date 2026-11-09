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
- `npx nx run design-build:test` — includes the same check.

## Layout

- `src/core/` — the `Target` contract, the writer and the check. Shared by
  every asset kind.
- `src/icons/` — the SVG, React and React Native symbol targets (svgr with
  each lib's own `icon-template.ts`).
- `src/tokens/` — one target per output, each a plain function of the model
  (`design-sources` already resolves references and modes, so no token engine
  sits in between). `cssLayers.ts` builds the CSS declarations every CSS-shaped
  output serializes, `selections.ts` the mode combinations every target reads,
  and `naming.ts` is the one place Figma names become output names.
- `src/config.ts` — every output folder. A target owns its folder (or the
  part `owns` names): files it stops emitting are deleted.

## Adding an output

Write a `Target` in `src/tokens/` (`emit(model)` returns files, touches no
disk), add it to `tokenTargets` in `src/config.ts`, and run `tokens`. Nothing
in `src/core/` or `design-sources` changes.

## Rules

- **Generated files are never edited by hand**: fix the source or the target.
- **A refactor keeps outputs byte-identical**: run `check` before and after. A
  visible change lands in its own commit with a version plan.
