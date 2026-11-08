# sync-figma

Dev-only Nx project holding everything that crosses the Figma boundary: it is
the only code that talks to Figma. Never published, so changes here need no
version plan — see `## Internals` in [AGENTS.md](../../AGENTS.md) for the
category's rules.

Driven in CI by three workflows, each runnable from the Actions tab:

| Workflow | Runs | Opens |
| --- | --- | --- |
| [`sync-figma-tokens.yml`](../../.github/workflows/sync-figma-tokens.yml) | `extract --kind=tokens`, then the token build | a tokens PR (`sync-figma-tokens` branch) |
| [`sync-figma-symbols.yml`](../../.github/workflows/sync-figma-symbols.yml) | `extract --kind=icons`, then the symbol generators | a symbols PR (`sync-figma-symbols` branch) |
| [`sync-figma-all.yml`](../../.github/workflows/sync-figma-all.yml) | both, as reusable workflows | one combined PR (`sync-figma` branch) |

| Target | Does | Writes to |
| --- | --- | --- |
| `extract --kind=tokens` | Figma variables → DTCG, one file per collection × mode | `tokens/` |
| `extract --kind=icons` | Icons canvas → one SVG per component | `libs/design-core/symbols/icons/` |
| `code-syntax` | Sets Dev Mode code syntax on variables | Figma itself — **mutates the file**, not a dry run |
| `design-tokens-etl` | `tokens/` → CSS token maps (Style Dictionary) | `libs/design-core/src/lib/generated/css/` |
| `generate-symbols-react` / `-react-native` | SVGs → symbol components | `libs/ui-{react,rnative}/src/lib/Components/symbols/` |

Run any of them with `npx nx run sync-figma:<target>` from the workspace root.
Paths live in [`src/config.ts`](src/config.ts) — the single place this project's
coupling to `libs/*` is declared, so add new ones there.

## Layout

- `src/client/` — the Figma REST client (auth, retry on rate limits). Every
  call to Figma goes through it.
- `src/extract/` — `tokens.ts` (variables → DTCG, with the type mapping in
  `dtcg.ts`) and `icons.ts` (canvas → SVG).
- `src/write-back/` — code syntax upload.
- `src/shared/writeSourceFiles.ts` — write + prune, shared by every kind.
- `src/testing/` — recorded API responses. Tests never call the network.

## Gotchas

- **Credentials.** Every Figma target needs `FIGMA_API_TOKEN` plus its file
  keys in the environment; `src/cli.ts` names the missing ones.
- **The export mirrors Figma.** It deletes any `tokens/*.json` (or icon `.svg`)
  that the export no longer produces, such as a removed brand. An empty export
  fails instead of wiping the folder.
- **Unsupported variables fail the export.** A Figma variable with no DTCG
  mapping (see `src/extract/dtcg.ts`) stops the sync instead of being skipped;
  booleans are the only type dropped on purpose.
- **Only the ETL formats its own output.** It runs prettier, so it must produce
  an empty `git diff`. The `generate-symbols-*` targets emit raw svgr output, so
  run `nx run-many --target=lint --fix` before diffing or you will see ~590
  files of formatting noise — that is why the workflow does the same.
- **Regenerated symbols are ordinary lib source** and do need a version plan for
  `@ledgerhq/lumen-ui-react` / `-ui-rnative`; see the `release-plan` skill.
- **The CSS under `libs/design-core/src/lib/generated/css/` is generated** — fix the
  tokens or the ETL, never the output.

Icon usage is documented for consumers in Storybook, not here.
