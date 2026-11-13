---
name: write-migration
description: >-
  Writes the migration file (in `libs/migrations/src/`) and the Nx version
  plans for the current branch's changes to Lumen's public API. Use when a
  branch removes, renames or changes an export, prop, prop value, token, icon
  or peer dependency, changes behavior or rendering consumers rely on, when
  `check:breaking-changes` or the migrations `validate` fails, or when asked to
  write a migration or prepare a breaking change for review.
paths: libs/migrations/src/*.md
---

# Write a migration

The upgrade pipeline applies migrations in every consumer repo unattended, so
derive everything from the diff and the checks, never from memory.

Format: [libs/migrations/README.md](../../../libs/migrations/README.md), read
it first. Judgment rules: [references/authoring.md](references/authoring.md).

```
- [ ] 1. Scope the diff
- [ ] 2. List the breaks
- [ ] 3. Group them into migrations
- [ ] 4. Write each migration
- [ ] 5. Write the version plans
- [ ] 6. Validate until everything passes
```

## 1. Scope the diff

```bash
git fetch origin main
base=$(git merge-base origin/main HEAD)
git diff "$base" -- 'libs/*/src/**' 'libs/*/package.json'
```

Read the public surface: exports, props types, defaults (destructuring and
`cva` `defaultVariants`), tokens, symbols, peers. If the branch already adds a
migration, update it.

## 2. List the breaks

```bash
npx nx run-many -t build --projects='libs/*'
npx nx run @ledgerhq/lumen-migrations:build
npm run check:breaking-changes
```

Each failing line is a ref a migration must match. The check can't see
behavior or rendering, so also read the diff for changed defaults, props that
compile but no longer work, new runtime errors, styling changes and renamed
`data-*` attributes. If the check can't run, use the diff alone and say so.

Additive changes need no migration. With no break, write only the plans
(step 5), validate, and tell the user why.

## 3. Group them into migrations

One file per update a consumer handles in one go, usually one component or
feature across both platforms. The file name is the permanent id: kebab-case,
from the consumer's view (`menu-base-ui`, `card-disabled-context`), not already
in `libs/migrations/src/`.

## 4. Write each migration

Model it on [menu-base-ui.md](../../../libs/migrations/src/menu-base-ui.md)
(many changes) and [card-disabled-context.md](../../../libs/migrations/src/card-disabled-context.md)
(silent, both platforms).

- One `changes` entry per ref, in the order a consumer applies them.
- Never write `pr`: it is only for backfilling an already released PR.
- Build the examples from the diff's stories, tests and usages.

Ask the user, with options and your pick, when the diff doesn't settle a
choice: several candidate replacements, a default with product impact, or
whether a behavior change is intended.

## 5. Write the version plans

Follow the `release-plan` skill, plus one plan for `@ledgerhq/lumen-migrations`.
Count plans the branch already adds, committed or not:

```bash
git diff "$base" --name-only --diff-filter=A -- .nx/version-plans
git ls-files --others --exclude-standard .nx/version-plans
```

## 6. Validate until everything passes

```bash
npx nx run @ledgerhq/lumen-migrations:validate
```

Then the full check, which reads only commits: the index links a migration to
the plans added in the same commit. Ask before committing the migration with
the plans of the packages it breaks, and before squashing if those plans are in
an earlier commit (CI sees one merge commit, so this is local only).

```bash
npx nx run @ledgerhq/lumen-migrations:validate
npx nx run @ledgerhq/lumen-migrations:build
npm run check:breaking-changes
```

Fix, amend, rebuild and rerun until all three pass.

## Report

Each migration with its refs and signals, the plans written, the checks and
their results, and open questions.
