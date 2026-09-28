# lumen-adoption

Tracks which version of `@ledgerhq/lumen-ui-react`, `-ui-rnative` and
`-design-core` each external consumer repo has adopted, vs. latest on npm.
Dev-only, no version plan needed — see `## Internals` in
[AGENTS.md](../../AGENTS.md).

## Usage

```bash
npx nx run lumen-adoption:report     # writes report.md + report.html + report.slack.txt, prints the table
npx nx run lumen-adoption:discover   # diffs data/consumers.json against a fresh code search — never writes it
npx nx run lumen-adoption:test
```

`report.slack.txt` is pre-formatted for pasting into Slack (a bulleted list
grouped by severity, non-green rows only) — see `renderSlackReport` for why a
table doesn't work there.

## Design notes

`report` only ever reads the git-tracked `data/consumers.json` registry —
never live GitHub search — because search alone isn't deterministic enough to
drive a report people track over time (see the top of `discover.ts` for why).
Fold `discover`'s findings into the registry by hand, in a reviewable PR.

Needs a GitHub token (`GITHUB_TOKEN`/`GH_TOKEN`, or falls back to
`gh auth token`). No auth needed for npm — Lumen publishes to an internal
JFrog registry first, but it mirrors out to public npm.

Everything else — pnpm catalog resolution, patch-only diffing, sort and
status rules — is documented as comments at the point of use in `src/lib/*.ts`;
read those rather than this file, so there's one place to keep in sync.
