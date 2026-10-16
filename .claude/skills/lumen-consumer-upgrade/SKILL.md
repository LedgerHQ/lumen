---
name: lumen-consumer-upgrade
description: >-
  Upgrade a consumer repo to the latest Lumen: audit the gap, bump every
  `@ledgerhq/lumen-*` package, apply each migration crossed, verify, and open
  the PR. Run from the consumer repo's root, only when asked to upgrade or
  audit Lumen there.
disable-model-invocation: true
---

# lumen-consumer-upgrade

Run from the **consumer repo's root**. Two phases with a stop between them:
the audit changes nothing, and the upgrade starts only once a human has read
the audit.

What changed between two versions comes from two sources, used together.
Never infer it from memory.

- [references/breaking-changes.md](references/breaking-changes.md): the
  catalog. Every migration, with its versions, detection, fix and kind.
- [scripts/lumen-api-diff.mjs](scripts/lumen-api-diff.mjs): the mechanical
  diff between two published versions. It catches removals the catalog
  missed (exports, files, tokens), but not behavior.

## 1. Audit (read-only)

1. **Map the repo.** Find every `package.json` that declares a Lumen package
   (monorepos: all workspaces, plus pnpm catalogs). Include retired and
   renamed packages listed in the catalog's Setup section. Note the package
   manager.
2. **Installed versions** come from the lockfile, not the ranges in
   `package.json`.
3. **Target versions:** `npm view @ledgerhq/<pkg> version` for each. Packages
   that pin each other as peers (check their `peerDependencies`) move
   together.
4. **Select rows** with the catalog's "Which rows apply" rule. List skipped
   ids in one line. If a selected row's fix says **Stop**, report it and
   stop.
5. **Run each selected row's detection.** Record `file:line` hits. A row with
   no hits is listed as "checked, not used". Never skip a row because it looks
   unlikely.
6. **Diff each package** between its installed and target versions:

   ```bash
   node <this skill>/scripts/lumen-api-diff.mjs @ledgerhq/<pkg> <installed> <target>
   ```

   Grep the app for every removed export, file, `var(--token)` and class
   pattern. A hit no row explains goes under "Uncatalogued".
7. **Write the audit** with
   [references/audit-template.md](references/audit-template.md), then
   **stop**: ask for the judgment calls and whether to proceed.

## 2. Upgrade

One branch and one PR per repo. Apply in this order. Each step leaves the repo
building.

1. **Setup rows** first: they change packages or build setup that later steps
   depend on.
2. **Bump** every Lumen package to its target and reinstall.
3. **🔊 Loud rows:** fix every Lumen typecheck error with its row's fix. The
   typecheck is the checklist: keep going until it's clean.
4. **🔇 Silent rows:** fix every audit hit. These produce no error.
5. **⚖️ Judgment rows:** apply only confirmed choices. Never pick a size, color
   or behavior silently. If unconfirmed, use the row's default and list it in
   the PR.
6. **♻️ Replacement rows:** Lumen now provides something the app built
   itself. For each local version the detection found:
   - If it does nothing beyond Lumen's (the row says what to check), point it
     at Lumen's export so call sites stay untouched. Delete it only when
     nothing else lives in that file.
   - If it adds behavior of its own, keep it and flag it in the PR for the
     owning team.
   - Remove dependencies the local version needed only once nothing imports
     them.

   ♻️ steps inside other rows' fixes follow the same rule, applied with their
   row.
7. **👁 Visual rows:** no code change. List each affected screen in the PR.

Bump packages the repo already uses. Don't add new Lumen packages in this PR:
list them as follow-ups.

## 3. Verify

- Install, typecheck, lint, test and build pass. A failure that also exists on
  the base branch is reported as pre-existing, not fixed.
- Re-run every applied row's detection and every pattern from the diff.
  - Patterns matching the **old** API (a removed name, value, class, token or
    file): zero hits.
  - Patterns matching **call sites** (`<Avatar\b`…) still match after a
    correct fix: check each hit against the fix and list it as reviewed.
- Open the screens listed under 👁 in the running app. If you can't run it,
  say so in the PR.

## 4. PR

Use [references/pr-template.md](references/pr-template.md). Cite the row id
behind every change.

## Rules

- **Scope:** the upgrade only. Other findings go under "Follow-ups", not in
  the diff.
- **Lumen gaps:** if a fix needs something Lumen doesn't have, don't
  hand-roll it. List it under "Lumen gaps".
- **No guessing:** if a row's fix doesn't fit a call site, leave it, explain
  why in the PR, and ask.
- **The published code wins** over release notes and catalog text when they
  disagree. Check the `dist` of both versions.
- **Catalog drift:** never edit the catalog during an audit or upgrade. Once
  the PR is open, turn each "Uncatalogued" finding into a row in a separate
  Lumen PR.
