# adoption-tool

Tracks which version of `@ledgerhq/lumen-ui-react`, `-ui-rnative` and
`-design-core` each external consumer repo has adopted, vs. latest on npm.
Dev-only, no version plan needed — see `## Internals` in
[AGENTS.md](../../AGENTS.md).

## Usage

```bash
npx nx run adoption-tool:report            # prints the full markdown table (--format markdown)
npx nx run adoption-tool:report-summary    # prints the Slack-ready bulleted summary instead (--format summary)
npx nx run adoption-tool:owners            # prints a readable repo → owners summary; also writes the table to owners.md
npx nx run adoption-tool:discover          # diffs data/consumers.json against a fresh code search — never writes it
npx nx run adoption-tool:test
```

Both `report` targets write all three output files every run —
`report.md`, `report.html`, `report.slack.txt` — `--format` only picks what
gets printed to stdout. Pass a different value directly if needed:
`npx tsx internals/adoption-tool/src/report.ts --format summary`.

## Layout

Each command is an entry script in `src/` that only orchestrates; its logic
lives in the `src/lib/` folder named after it, and cross-command code in `shared/`.

```
src/
  report.ts  owners.ts  discover.ts   entry scripts, one per Nx target
  config.ts                           packages, thresholds, paths
  lib/
    report/     versions → classify → sort → render (markdown / HTML / Slack)
    owners/     architecture-as-code catalog + CODEOWNERS → repo owners
    discover/   code-search results vs. the registry diff
    shared/     GitHub client, logging, the consumers.json entry type
```

## Design notes

`report` only ever reads the git-tracked `data/consumers.json` registry —
never live GitHub search — because search alone isn't deterministic enough to
drive a report people track over time (see the top of `discover.ts` for why).
Fold `discover`'s findings into the registry by hand, in a reviewable PR.

Each entry's `packageJsonPath` is where the dependency is read; in monorepos
where a Lumen package is declared by a different workspace package.json, add a
per-package override under `packageJsonPaths`. A `catalog:` version is only
resolved from `pnpm-workspace.yaml` after a package.json actually declares the
package, and a declared-but-unresolvable one shows as `unresolved`, not `—`.
`discover` also flags registry paths that code search no longer finds.

`owners` combines two sources because neither is complete alone: the
`LedgerHQ/architecture-as-code` catalog (team ↔ repo links and each team's
`github-teams`) and every consumer's own CODEOWNERS, whose team handles are
matched back to catalog teams. It only reads; nothing is written to
`consumers.json`. Repos with neither source are listed as having no owner.

Needs a GitHub token (`GITHUB_TOKEN`/`GH_TOKEN`, or falls back to
`gh auth token`). No auth needed for npm — Lumen publishes to an internal
JFrog registry first, but it mirrors out to public npm.

Everything else — pnpm catalog resolution, patch-only diffing, sort and
status rules — is documented as comments at the point of use in `src/lib/**`;
read those rather than this file, so there's one place to keep in sync.
