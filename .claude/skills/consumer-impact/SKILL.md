---
name: consumer-impact
description: >-
  Use when asked to test a Lumen change against consumer repos before
  releasing it: a breaking or architectural change, a lint-plugin upgrade,
  peer/prod dependency moves, build or packaging changes, or to check how
  consumers use a component, prop or variant. Runs the change (or a usage scan)
  across the production consumers in the adoption registry and outputs a
  shareable HTML report.
---

# Consumer impact

Answers "what breaks, and for whom, if we ship this?" by running the change in
real consumer repos.

## 1. Frame

- **Change under test**: the branch, PR or diff, and which `@ledgerhq/lumen-*`
  packages it touches.
- **Mode**:
  - *Usage scan*: where consumers use a component, prop, variant, token or
    export. Read-only, no install.
  - *Install & check*: install the changed packages in each consumer, then run
    its checks (install, typecheck, lint, build, tests).
- **Repos**: all production consumers by default, or the subset the user names.

## 2. Consumers

The registry is `internals/adoption-tool/data/consumers.json`. Read it, never
copy it, and keep only production repos:

```bash
jq -r '.[] | select(.status == "production") | .repo' internals/adoption-tool/data/consumers.json
```

For each repo, `packageJsonPath` / `packageJsonPaths` say which workspace
declares Lumen, and `notes` flags pnpm catalogs (the version lives in
`pnpm-workspace.yaml`). For owners, run `npx nx run adoption-tool:owners` (see
the `lumen-adoption-report` skill) from a checkout with `node_modules`
installed and `GITHUB_TOKEN` set; it prints nothing otherwise.

Start every run with the manifest scan. It reads each production consumer's
Lumen workspace `package.json` (and pnpm catalog) through the GitHub API, with
no clone, and prints one TSV row per workspace:

```bash
node .claude/skills/consumer-impact/scripts/scan-manifests.mjs '^(@ledgerhq/lumen-|tailwindcss$|tailwind-merge$)'
```

The argument is a regex of the dependency names to report.

## 3. Get the change as installable packages

Pick one:

- **PR with the `publish-dev-package` label**: use the install URLs from the
  PR's "Dev packages published" comment (see `docs/pull-requests.md`). These
  are the easiest to share and reproduce.
- **Local branch**: build and pack the touched libs:
  `npx nx run-many -t build --projects=<packages>`, then `npm pack` in each
  `libs/<lib>/`, and use the `.tgz` paths.

Lumen packages pin each other exactly (e.g. `ui-react` → `design-core`), so
when a change touches several packages, install **all** their tarballs and
force them with the consumer's override mechanism (npm `overrides`, pnpm
`pnpm.overrides`, yarn `resolutions`). Otherwise the consumer pulls the
published sibling and silently tests the old code.

## 4. Run

Use parallel subagents, one per repo, when available.

- **Usage scan** (no clone): start from the manifest scan, then
  `gh search code "<import or symbol>" --repo <repo>` and read the hits with
  `gh api repos/<repo>/contents/<path>`. Clone only when the search is too
  fuzzy. Code search covers default branches only: report counts as a floor.
- **Install & check**: one shallow clone per repo in `tmp/consumer-impact/`
  (gitignored): `gh repo clone <repo> tmp/consumer-impact/<name> -- --depth 1`.
  1. Detect the package manager from the lockfile and install as-is first, to
     get a **baseline** (a check that already fails on `main` is not ours).
  2. Point the Lumen packages at the tarballs (catalog repos: edit the entry in
     `pnpm-workspace.yaml`) with the overrides above, and reinstall.
  3. Run the scripts the consumer actually has in that workspace (typecheck,
     lint, build, test), and record pass/fail plus the first relevant errors.
- Skip a repo that is too heavy or fails at baseline, and say so. Never commit,
  push, or open a PR in a consumer repo; clones are throwaway.

## 5. Report

Copy `assets/report-template.html` whole (title, styles and all) and replace
only what sits between the `REPORT CONTENT` markers: the change, the matrix
(repo × check, baseline vs change), the breakages with error excerpts and
owners, and the suggested fix or migration note per breakage. Delete the
template's example rows and comments. The `<title>` names the change in 2–4
words. Write it to `tmp/consumer-impact/report-<YYYY-MM-DD>-<slug>.html`
(gitignored), never elsewhere in the repo tree.

- **With the Artifact tool (Claude Code)**: publish that file (private until
  shared), reply with the link and a one-paragraph summary.
- **Otherwise**: wrap it in a full HTML document (see the template's header
  comment), and reply with its path and the summary.

Never commit a report or consumer code excerpts: this repo is public and most
consumers are private.
