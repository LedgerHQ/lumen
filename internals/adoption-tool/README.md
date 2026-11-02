# adoption-tool

Shows which version of each Lumen package (`ui-react`, `ui-rnative`,
`design-core`, `lint-plugin`) each consumer repo uses, compared with the latest
on npm. Dev-only and never published.

## Usage

```bash
npx nx run adoption-tool:report           # markdown table
npx nx run adoption-tool:report-summary   # Slack-ready summary
npx nx run adoption-tool:report-json      # JSON snapshot
npx nx run adoption-tool:owners           # which team owns each consumer repo
npx nx run adoption-tool:discover         # find new or moved consumers
npx nx run adoption-tool:test
```

Reports cover **`production` consumers only** by default. Use `--status` to
pick another group:

```bash
npx nx run adoption-tool:report --status internal-tool
npx nx run adoption-tool:report --status all
```

- Every report target writes all four files (`report.md`, `report.html`,
  `report.slack.txt`, `report.json`). The target only picks what gets printed.
- Exit code `1` means some repos couldn't be read. They show as `unresolved`
  and the rest of the report is still written.
- Needs a GitHub token: `GITHUB_TOKEN`, `GH_TOKEN`, or a logged-in `gh`.

## Adoption statuses

| Status        | Meaning                                                  |
| ------------- | -------------------------------------------------------- |
| 🟢 current    | on the latest version                                    |
| 🟡 behind     | 1–4 patches behind                                       |
| 🔴 far behind | 5+ patches behind, or major/minor differs from latest    |
| ⚪ unresolved | missing package.json, unknown version spec, fetch failed |

The version is the lower bound of the range declared in package.json or the
pnpm catalog, not the version installed by the lockfile.

## Registry

The report only reads `data/consumers.json`. It never uses live GitHub search,
because search results change from run to run. You edit the registry by hand,
in a PR.

| Field              | Meaning                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `repo`             | `LedgerHQ/name`                                                                           |
| `status`           | `production` (shipped to users or partners) or `internal-tool` (used inside Ledger)       |
| `priority`         | optional, `P1` (highest) to `P3`, for ordering migration and rollout work                 |
| `packageJsonPath`  | package.json that declares the Lumen dependencies                                         |
| `packageJsonPaths` | optional, per package, for monorepos where several workspaces declare it (worst one wins) |
| `notes`            | optional                                                                                  |

Prototypes, hackathon projects and experiments are not consumers. They go in
`data/ignored-repos.json` with a `reason`, and `discover` stops reporting them.
Both files are validated on load, so a typo fails the run instead of showing
up as wrong data.

To add a repo: run `discover`, then add each new repo to one of the two files.

The tracked packages are listed by hand in `src/config.ts`. Add new published
libs there.

## Architecture

| Command    | Reads                                                                                  | Writes                            |
| ---------- | -------------------------------------------------------------------------------------- | --------------------------------- |
| `report`   | `data/consumers.json`, each repo's package.json or pnpm catalog (GitHub), latest (npm) | `report.{md,html,slack.txt,json}` |
| `discover` | GitHub code search, both registry files                                                | stdout only, never the registry   |
| `owners`   | `LedgerHQ/architecture-as-code` team catalog, each repo's CODEOWNERS                   | `owners.md`                       |

```
src/
  report.ts  owners.ts  discover.ts   entry points, one per Nx target (orchestration only)
  config.ts                           packages, thresholds, file paths
  lib/report|owners|discover/         logic for each command
  lib/shared/                         GitHub client, HTTP retry and rate limits, registry validation
```

Edge cases and design decisions are documented as comments in `src/lib/`.
