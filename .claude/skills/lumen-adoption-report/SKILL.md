---
name: lumen-adoption-report
description: >-
  Use when asked to check Lumen version adoption across consumer repos,
  generate the Lumen adoption report, or find which repos are behind on a
  Lumen package version.
---

# Lumen adoption report

Reports which version of `@ledgerhq/lumen-ui-react`, `-ui-rnative` and
`-design-core` each external consumer repo has adopted, versus the latest
published version — one row per repo, 🟢/🟡/🔴 status per package.

The logic lives entirely in `internals/lumen-adoption` (deterministic
TypeScript, not model-driven) — this skill only tells you when and how to run
it. See [internals/lumen-adoption/README.md](../../../internals/lumen-adoption/README.md)
for how it works and its known limitations (pnpm catalogs, one path per repo).

## Generate the report

```bash
npx nx run lumen-adoption:report
```

Reads `internals/lumen-adoption/data/consumers.json`, writes
`internals/lumen-adoption/report.md` and `report.html` (both gitignored,
regenerated each run), and prints the markdown table. Present that table (and
the summary counts above it) to the user — don't re-derive it yourself.

Needs a GitHub token: `GITHUB_TOKEN`/`GH_TOKEN`, or falls back to
`gh auth token` (a local `gh auth login` is enough).

## Add a newly-found consumer repo

```bash
npx nx run lumen-adoption:discover
```

Prints a diff (new repos found by code search / registry repos no longer
found) — it never writes the registry itself. To act on it, hand-edit
`internals/lumen-adoption/data/consumers.json`: add `{ "repo", "packageJsonPath"
}`, picking the package.json path where the repo's real app actually declares
the dependency (not necessarily the first code-search hit — verify with the
GitHub Contents API if a monorepo has several candidates).
