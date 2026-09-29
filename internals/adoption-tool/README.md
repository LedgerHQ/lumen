# adoption-tool

Tracks which version of `@ledgerhq/lumen-ui-react`, `-ui-rnative` and
`-design-core` each external consumer repo has adopted, vs. latest on npm.
Dev-only, no version plan needed — see `## Internals` in
[AGENTS.md](../../AGENTS.md).

## Usage

```bash
npx nx run adoption-tool:report            # prints the full markdown table (--format markdown)
npx nx run adoption-tool:report-summary    # prints the Slack-ready bulleted summary instead (--format summary)
npx nx run adoption-tool:report-json       # prints the machine-readable snapshot instead (--format json)
npx nx run adoption-tool:owners            # prints a readable repo → owners summary; also writes the table to owners.md
npx nx run adoption-tool:discover          # diffs data/consumers.json against a fresh code search — never writes it
npx nx run adoption-tool:test
```

Every `report` target writes all four output files every run — `report.md`,
`report.html`, `report.slack.txt`, `report.json` — `--format` only picks what
gets printed to stdout. Progress logs go to stderr, so stdout can be piped
(`… report-json | jq`). Pass a different value directly if needed:
`npx tsx internals/adoption-tool/src/report.ts --format summary`.

`report.json` is a timestamped snapshot (`generatedAt`, the `latest` versions,
a status `summary` and every row) meant to be archived from CI to chart
adoption over time; the other files are for humans.

Exit code is `1` when a repo could not be read (network, rate limit, revoked
access): the report is still written, with that repo shown as
`unresolved (fetch failed)`, so one bad repo never loses the rest. `owners`
does the same but leaves the repo out, since a failed lookup says nothing
about who owns it.

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
    shared/     GitHub client, HTTP retry, concurrency limiter, logging,
                consumers.json validation
```

## Design notes

`report` only ever reads the git-tracked `data/consumers.json` registry —
never live GitHub search — because search alone isn't deterministic enough to
drive a report people track over time (see the top of `discover.ts` for why).
Fold `discover`'s findings into the registry by hand, in a reviewable PR.

Each entry's `packageJsonPath` is where the dependency is read; in monorepos
where a Lumen package is declared by other workspace package.json files, add a
per-package override under `packageJsonPaths` — always an array, and the worst
status across those files is shown. The registry is validated on load (unknown
keys, misspelled package names, bad paths, duplicate repos all fail loudly),
because a typo would otherwise silently read as `—` (not used).

A package.json that is missing or unparseable shows as `unresolved` with the
path, never `—`, and so does a declared version we can't resolve (the raw spec
is kept in the cell: `unresolved (spec "latest")`). A `catalog:` version is only
resolved from `pnpm-workspace.yaml` after a package.json actually declares the
package, and that file is only fetched then.

Versions are the _declared_ range's lower bound (package.json or catalog), not
the lockfile-installed version — the report footnote says so. Reading lockfiles
would be per-package-manager and much heavier for a coarse signal.

`discover` flags four things: new repos, registry repos it no longer finds,
registry paths it no longer finds (the dependency likely moved), and paths it
finds in a tracked repo that the registry doesn't read (another workspace
started depending on Lumen). Some monorepos have many hits; treat the last
section as a review list, not a to-do list.

All network calls go through `fetchWithRetry` (`lib/shared/http.ts`): a 30s
timeout per attempt and up to 4 attempts with backoff for network errors, 5xx
and rate limits — GitHub signals both its primary and secondary limits with 403
and a `retry-after`/`x-ratelimit-*` header, and a plain 403 is not retried. It
waits at most 2 minutes for a limit to lift, otherwise it fails fast. Repos are
processed `GITHUB_CONCURRENCY` (6) at a time — low on purpose, secondary limits
punish bursts long before the hourly quota runs out.

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
