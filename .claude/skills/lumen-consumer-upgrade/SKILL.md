---
name: lumen-consumer-upgrade
description: >-
  Upgrade a consumer repo to the latest Lumen: audit the gap, bump every
  `@ledgerhq/lumen-*` package, fix each breaking change crossed, migrate to
  `cn` from `@ledgerhq/lumen-design-core/cn`, verify, and open the PR. Run from
  the consumer repo's root, only when asked to upgrade or audit Lumen there.
disable-model-invocation: true
---

# lumen-consumer-upgrade

Run from the **consumer repo's root**. Two phases with a stop between them:
the audit changes nothing, the upgrade starts only once a human has read the
audit.

Two sources, used together. Never infer breaking changes from memory.

- [references/breaking-changes.md](references/breaking-changes.md): the
  curated catalog, with fixes, judgment calls and behavior changes.
- [scripts/lumen-api-diff.mjs](scripts/lumen-api-diff.mjs): the mechanical
  diff between the repo's installed and target versions. It catches what the
  catalog missed (removed exports, icons and tokens), but not behavior.

## 1. Audit (read-only)

1. **Map the repo.** Find every `package.json` that declares a `@ledgerhq/lumen-*`
   package (monorepos: all workspaces, plus pnpm catalogs). Note the package
   manager and the Tailwind major version.
2. **Installed versions.** Read them from the lockfile, not the range in
   `package.json`. Include `lumen-utils-shared`, the retired
   `lumen-ui-react-visualization` / `lumen-ui-rnative-visualization`, and the
   pre-December 2025 names `@ledgerhq/ldls-*` (row `S0`).
3. **Target versions.** `npm view @ledgerhq/<pkg> version` for each. All
   Lumen packages move together: ui-react, ui-rnative and lint-plugin pin
   design-core exactly.
4. **Stop conditions.** Report and stop if the repo is on Tailwind v3 (row
   `S1` is a separate project), or on a package name not in the catalog.
5. **Select catalog rows** whose package was crossed: installed < `since` ≤
   target. Rows marked "next release" apply once that release is out.
6. **Run every selected row's detection.** Record file:line hits. A row with
   zero hits is still listed as "checked, not used". Never skip a row because
   it looks unlikely.
7. **Diff each package** between its installed and target versions:

   ```bash
   node <this skill>/scripts/lumen-api-diff.mjs @ledgerhq/<pkg> <installed> <target>
   ```

   Grep the app for every removed export, `var(--token)` and class pattern it
   prints. A hit already explained by a catalog row is covered. Any other hit
   goes under "Uncatalogued" in the audit: find its release note, then add a
   catalog row (see Rules).
8. **Find local `cn` helpers:** any file importing `tailwind-merge`, `clsx` or
   `classnames`. For each, note whether it uses `extendTailwindMerge` /
   `createTailwindMerge`, and whether the app's Tailwind config or CSS
   restores font sizes (`fontSize`, `--text-*` in `@theme`).
9. **Write the audit** in the format of
   [references/audit-template.md](references/audit-template.md) and **stop**.
   Ask which judgment calls to make and whether to proceed.

## 2. Upgrade

One branch and one PR per repo. Apply in this order. Each step should leave
the repo building.

1. **Setup-level rows (`S*`)**: package renames, the Tailwind entry CSS.
2. **Bump** every Lumen package to the target and reinstall.
3. **Loud rows (🔊)**: run the typecheck and fix every Lumen error using the
   row's fix. The typecheck is the checklist: keep going until it's clean.
4. **Silent rows (🔇)**: these produce no error. Fix every audit hit.
   Removed Tailwind classes generate no CSS and no warning.
5. **Judgment rows (⚖️)**: apply only the choices confirmed after the audit.
   Never pick a size, color or state mapping silently. If unconfirmed, use the
   catalog's default ("Lumen uses …") and list it in the PR.
6. **`cn` migration**:
   - A local helper with **no** tailwind-merge config of its own: replace its
     body with `export { cn } from '@ledgerhq/lumen-design-core/cn';` so call
     sites stay untouched. Delete it only if it has no other exports.
   - A helper **with** its own config, or an app that restores Tailwind font
     sizes: don't swap. Flag it in the PR for the owning team.
   - Remove `clsx`, `tailwind-merge` and `classnames` from the app's
     dependencies only once nothing imports them.
7. **Lint plugin**: if the repo uses `@ledgerhq/lumen-lint-plugin`, bump it
   with the rest. If not, don't add it in this PR: list it as a follow-up.
8. **Visual-only rows (👁)**: no code change. List each affected screen in the
   PR for manual review.

## 3. Verify

- Install, typecheck, lint, test and build all pass. Report any failure that
  also exists on the base branch as pre-existing, without fixing it.
- Grep again for every 🔇 row's detection pattern and every class pattern from
  the diff: zero hits.
- Run the app and open the screens listed under 👁. If you can't run it, say so
  in the PR rather than claiming it was checked.

## 4. PR

Use [references/pr-template.md](references/pr-template.md). Cite catalog row
ids for every change made, so a reviewer can map each diff to its reason.

## Rules

- **Scope:** Lumen upgrade and `cn` only. Hex colors, arbitrary values and
  other findings go under "Follow-ups" in the PR, not in the diff.
- **Lumen gaps:** if a fix needs a token or variant Lumen doesn't have, don't
  hand-roll it. Note it under "Lumen gaps" for the Lumen backlog.
- **No guessing:** if the catalog's fix doesn't fit a call site, leave it,
  explain why in the PR, and ask.
- **Catalog drift:** if the upgrade hits a breaking change missing from the
  catalog, add a row to it in Lumen (`.claude/skills/lumen-consumer-upgrade/`).
