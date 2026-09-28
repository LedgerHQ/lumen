# lumen-adoption

Dev-only Nx project tracking which version of `@ledgerhq/lumen-ui-react`,
`-ui-rnative` and `-design-core` each external consumer repo has adopted.
Never published, so changes here need no version plan — see `## Internals`
in [AGENTS.md](../../AGENTS.md) for the category's rules.

## Why a script instead of a one-off search

GitHub code search (`gh search code`) can *find* new consumer repos, but it's
not deterministic enough to drive a report people track over time: it only
indexes default branches, has a low secondary rate limit, and isn't
guaranteed exhaustive or stable run-to-run. So discovery and reporting are
split:

- **`report`** reads the git-tracked registry (`data/consumers.json` — repo +
  exact package.json path) and resolves each version deterministically via
  the GitHub Contents API and the public npm registry. This is what you run
  regularly.
- **`discover`** re-runs the code search and prints a diff against the
  registry (new repos found / registry repos no longer found). It never
  writes `data/consumers.json` itself — fold real changes in by hand, in a
  reviewable PR.

## Usage

```bash
npx nx run lumen-adoption:report     # writes report.md + report.html, prints the table
npx nx run lumen-adoption:discover   # prints a diff, does not touch data/consumers.json
npx nx run lumen-adoption:test
```

`report.md`/`report.html` are regenerated each run (gitignored) — the
registry in `data/consumers.json` is the only checked-in state.

## Gotchas

- **pnpm catalogs.** A monorepo consumer (e.g. `ledger-live`, `ledger-button`)
  often pins Lumen once in `pnpm-workspace.yaml` under a `catalog:` block, and
  every package.json in the repo just says `"@ledgerhq/lumen-ui-react":
  "catalog:"` — the literal string, not a version. `resolveVersion.ts`
  detects this and reads the pinned version out of `pnpm-workspace.yaml`
  instead. `readYamlScalarPath` only handles the flat, 2-space-indented shape
  actually used in this org today — not general YAML.
- **One package.json path per repo, not every path.** For a catalog-based
  monorepo every hit resolves to the same pinned version, so a single
  representative path is enough. For an explicit-version repo, the chosen
  path should be the one an app actually ships with — verified once when the
  registry was seeded; if a repo's real dependency moved to a different
  package.json, `report` will silently show `not-used` for a package it
  actually still consumes. Re-verify with `discover` if a row looks wrong.
- **Patch-only diffing.** Every Lumen release bumps only `patch` (AGENTS.md),
  so "N behind" is a raw patch-number subtraction. A major/minor mismatch is
  reported as `diverged`, not a nonsense patch count.
- **Auth.** Needs a GitHub token: `GITHUB_TOKEN`/`GH_TOKEN` env var, or falls
  back to `gh auth token` (so a local `gh auth login` is enough to run this
  by hand). No token is needed for the npm registry lookup — Lumen publishes
  to an internal JFrog registry first, but it's mirrored out to public npm.
