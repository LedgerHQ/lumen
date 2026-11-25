# sync-figma

The only code that talks to Figma. Dev-only, never published. How it fits the
pipeline: [docs/design-pipeline.md](../../docs/design-pipeline.md).

| Target                  | Does                                                    | Writes to                                |
| ----------------------- | ------------------------------------------------------- | ---------------------------------------- |
| `extract --kind=tokens` | Figma variables → DTCG, one file per collection × mode  | `internals/design-sources/tokens/figma/` |
| `extract --kind=icons`  | Icons canvas → one SVG per component                    | `libs/design-core/symbols/icons/`        |
| `code-syntax`           | Uploads `design-build`'s `code-syntax.json` to Dev Mode | Figma itself: **mutates the file**       |

Run with `npx nx run sync-figma:<target>`. CI runs `extract` through
`sync-figma.yml`; `code-syntax` is run by hand.

## Layout

- `src/client/` — the Figma REST client (auth, retries). Every call goes
  through it.
- `src/extract/` — variables → DTCG (`tokens.ts`, type mapping in `dtcg.ts`)
  and icons → SVG (`icons.ts`).
- `src/write-back/` — the code syntax upload.
- `src/testing/` — recorded API responses: tests never call the network.

## Rules

- **Credentials:** `FIGMA_API_TOKEN` plus the file keys; `src/cli.ts` names the
  missing ones.
- **The export mirrors Figma:** files the export no longer produces are
  deleted. An empty export fails instead of wiping the folder.
- **Unsupported variables fail the export** rather than being skipped
  (booleans excepted).
- **It only writes sources:** every other output is built by `design-build`.
