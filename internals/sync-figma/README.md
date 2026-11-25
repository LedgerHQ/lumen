# sync-figma

Dev-only Nx project holding everything that crosses the Figma boundary: it is
the only code that talks to Figma. Never published, so changes here need no
version plan — see `## Internals` in [AGENTS.md](../../AGENTS.md) for the
category's rules.

Driven in CI by [`sync-figma.yml`](../../.github/workflows/sync-figma.yml),
run from the Actions tab with a `kind` (`all`, `tokens` or `symbols`). It runs
`extract --kind=tokens` and/or `--kind=icons`, then `design-build:tokens` /
`:icons`, and opens a PR on the `sync-figma-<kind>` branch with the diff report
as its description. When the build fails, the PR opens as a draft with the
error, so the fix lands on that branch.

| Target                  | Does                                                           | Writes to                                           |
| ----------------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| `extract --kind=tokens` | Figma variables → DTCG, one file per collection × mode         | `internals/design-sources/tokens/figma/`            |
| `extract --kind=icons`  | Icons canvas → one SVG per component, plus `downloadData.json` | `libs/design-core/symbols/icons/` (published as is) |
| `code-syntax`           | Uploads `design-build`'s `code-syntax.json` to Dev Mode        | Figma itself — **mutates the file**, not a dry run  |

Run any of them with `npx nx run sync-figma:<target>` from the workspace root.
Paths live in [`src/config.ts`](src/config.ts). This project only writes
the sources: `internals/design-sources/tokens/figma/`, and the icons, which are
published as exported. Every other output in `libs/*` is built by `design-build`.

## Layout

- `src/client/` — the Figma REST client (auth, retry on rate limits). Every
  call to Figma goes through it.
- `src/extract/` — `tokens.ts` (variables → DTCG, with the type mapping in
  `dtcg.ts`) and `icons.ts` (canvas → SVG).
- `src/write-back/` — uploads the code syntax `design-build` generated (read by
  path, never imported).
- `src/shared/writeSourceFiles.ts` — write + prune, shared by every kind.
- `src/testing/` — recorded API responses. Tests never call the network.

## Gotchas

- **Credentials.** Every Figma target needs `FIGMA_API_TOKEN` plus its file
  keys in the environment; `src/cli.ts` names the missing ones.
- **The export mirrors Figma.** It deletes any `*.tokens.json` (or icon `.svg`)
  that the export no longer produces, such as a removed brand. An empty export
  fails instead of wiping the folder.
- **Unsupported variables fail the export.** A Figma variable with no DTCG
  mapping (see `src/extract/dtcg.ts`) stops the sync instead of being skipped;
  booleans are the only type dropped on purpose.
- **This project only writes sources.** Every token output is built by
  `design-build` from `design-sources`; this project imports their types only.

Icon usage is documented for consumers in Storybook, not here.
