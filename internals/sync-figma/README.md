# sync-figma

Dev-only Nx project holding everything that crosses the Figma boundary. It is
**never published** — it has no `package.json` and is not an npm workspace, so
changes here need no version plan.

Driven in CI by [`.github/workflows/sync-figma.yml`](../../.github/workflows/sync-figma.yml),
which runs the targets below and opens a PR with the result.

## Pipelines

| Pipeline | Targets | Writes to |
| --- | --- | --- |
| Design tokens | `figma-export` → `design-tokens-etl` | `internals/sync-figma/tokens/` → `libs/design-core/src/lib/themes/css/` |
| SVG symbols | `figma-download-svgs` → `generate-symbols-react` / `-react-native` | `libs/design-core/symbols/icons/` → `libs/ui-{react,rnative}/src/lib/Components/symbols/` |
| Write-back | `code-syntax` | Figma itself (updates variable code syntax) |

Every target runs from the workspace root. All paths live in
[`src/config.ts`](src/config.ts) — that file is the single place where this
project's coupling to `libs/*` is declared, so keep new paths there rather than
hardcoding them in a pipeline.

## Running it

```bash
# 1. Pull design tokens out of Figma, then transform them to CSS custom properties
npx nx run sync-figma:figma-export
npx nx run sync-figma:design-tokens-etl

# 2. Pull the SVGs, then generate the icon components for both platforms
npx nx run sync-figma:figma-download-svgs
npx nx run sync-figma:generate-symbols-react
npx nx run sync-figma:generate-symbols-react-native

# 3. Push code syntax back to Figma (manual, not run by CI)
npx nx run sync-figma:code-syntax
```

All three are offline and idempotent, but they differ in whether they format
their own output — which matters when you use "empty `git diff`" as your safety
check after touching this project:

- `design-tokens-etl` runs prettier itself, so it must produce an **empty diff**
  on its own.
- The two `generate-symbols-*` targets emit raw svgr output (one-line JSX,
  double quotes, no trailing newline). Formatting is a separate step, which is
  why `sync-figma.yml` follows them with `nx run-many --target=lint --fix`. Run
  that before diffing, or you will see ~590 files of pure formatting noise:

  ```bash
  npx nx run sync-figma:generate-symbols-react
  npx nx run sync-figma:generate-symbols-react-native
  npx nx run-many --target=lint --fix \
    --projects=@ledgerhq/lumen-ui-react,@ledgerhq/lumen-ui-rnative
  git diff -- libs/ui-react/src/lib/Components/symbols \
               libs/ui-rnative/src/lib/Components/symbols
  ```

`figma-export`, `figma-download-svgs` and `code-syntax` call the Figma REST API
and need credentials in the repo-root `.env` (or the environment):

| Variable | Used by |
| --- | --- |
| `FIGMA_API_TOKEN` | all three |
| `FIGMA_FOUNDATIONS_FILE_KEY` | `figma-export`, `code-syntax` |
| `FIGMA_SYMBOLS_FILE_KEY`, `FIGMA_ICONS_CANVAS` | `figma-download-svgs` |

Note that `figma-download-svgs` clears `libs/design-core/symbols/icons/` before
writing, and `code-syntax` **mutates the Figma file** — neither is a dry run.

## Checks

```bash
npx nx typecheck sync-figma
npx nx test sync-figma
npx nx lint sync-figma
```

After regenerating symbols, the generated components are ordinary lib source and
do need a version plan for `@ledgerhq/lumen-ui-react` / `-ui-rnative`; see the
`release-plan` skill.

## Using the generated icons

Icons are consumed from the UI packages, not from here. Prefer named imports so
the bundler can tree-shake:

```tsx
import { ArrowUp, Home } from '@ledgerhq/lumen-ui-react/symbols';

<Home size={24} className="text-base" />;
```

Avoid `import * as Icons` and default imports — the first bundles every icon,
the second is not supported.

Icons render with `currentColor`, so they inherit `text-*` utilities:

```tsx
<Home className="text-base hover:text-base-hover active:text-base-pressed" />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number \| string` | `"24px"` | Icon size in pixels or CSS units |
| `className` | `string` | - | CSS class (React only) |

## Troubleshooting

- **Icons not showing** — check the SVG has a proper `viewBox` and uses
  `currentColor`.
- **Module not found** — regenerate the components and confirm the import name
  matches the generated component name (Figma names are converted to kebab-case
  on download, then to PascalCase on generation).
- **Missing icons** — run `figma-download-svgs` before the generate targets.
- **The ETL produced a diff you did not expect** — the CSS files under
  `libs/design-core/src/lib/themes/css/` are generated; fix the tokens or the
  ETL, never the output.
