# sync-figma

Dev-only Nx project holding everything that crosses the Figma boundary. Never
published, so changes here need no version plan — see `## Internals` in
[AGENTS.md](../../AGENTS.md) for the category's rules.

Driven in CI by [`sync-figma.yml`](../../.github/workflows/sync-figma.yml),
which runs these targets and opens a PR with the result.

| Pipeline | Targets | Writes to |
| --- | --- | --- |
| Design tokens | `figma-export` → `design-tokens-etl` | `tokens/` → `libs/design-core/src/lib/themes/css/` |
| SVG symbols | `figma-download-svgs` → `generate-symbols-react` / `-react-native` | `libs/design-core/symbols/icons/` → `libs/ui-{react,rnative}/src/lib/Components/symbols/` |
| Write-back | `code-syntax` | Figma itself — **mutates the file**, not a dry run |

Run any of them with `npx nx run sync-figma:<target>` from the workspace root.
Paths live in [`src/config.ts`](src/config.ts) — the single place this project's
coupling to `libs/*` is declared, so add new ones there.

## Gotchas

- **Credentials.** `figma-export`, `figma-download-svgs` and `code-syntax` need
  `FIGMA_API_TOKEN` plus the file keys in the repo-root `.env`; see the `env:`
  blocks in `sync-figma.yml` for which target needs which.
- **`figma-download-svgs` clears** `libs/design-core/symbols/icons/` first.
- **Only the ETL formats its own output.** It runs prettier, so it must produce
  an empty `git diff`. The `generate-symbols-*` targets emit raw svgr output, so
  run `nx run-many --target=lint --fix` before diffing or you will see ~590
  files of formatting noise — that is why the workflow does the same.
- **Regenerated symbols are ordinary lib source** and do need a version plan for
  `@ledgerhq/lumen-ui-react` / `-ui-rnative`; see the `release-plan` skill.
- **The CSS under `libs/design-core/src/lib/themes/css/` is generated** — fix the
  tokens or the ETL, never the output.

Icon usage is documented for consumers in Storybook, not here.
