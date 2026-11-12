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

Every update consumers must act on ships a migration in the same PR. The
upgrade pipeline applies it in every consumer repo, so a wrong migration
breaks their upgrades: derive everything from the diff and the checks, never
from memory.

The format is defined in [libs/migrations/README.md](../../../libs/migrations/README.md).
Read it first. Judgment rules (signal, `detect`, body) are in
[references/authoring.md](references/authoring.md).

Copy this checklist and tick it off:

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
git diff origin/main --name-only -- 'libs/*/src/**'
```

If the fetch fails, say so: the diff may run against a stale `origin/main`.

The libs touched are the second path segment. Read the diff of their public
surface: `index.ts` exports, each component file and its props type
(`types.ts`), default values (destructuring and `cva` `defaultVariants`),
tokens, symbols, `package.json` peers.

If the branch already adds a migration, update that file instead of writing a
new one.

## 2. List the breaks

Two sources, used together.

**The breaking-change check** (mechanical, needs the npm registry):

```bash
npx nx run-many -t build --projects='libs/*'
npx nx run @ledgerhq/lumen-migrations:build
npm run check:breaking-changes
```

Each failing line, such as `removed member @ledgerhq/lumen-ui-react#Button.size`,
is a ref a migration must match. It sees removed exports, props, prop values,
tokens, icons and new peers, not behavior. If the build says the workspace is
out of sync, run `npx nx sync` and build again. If the check can't run at all,
continue from the diff and say so in the report.

**The diff**, for what the check can't see: a changed default, a prop that
still compiles but no longer works, new runtime errors, layout or styling that
renders differently, renamed `data-*` attributes. Each becomes a `changed`
entry with a `silent` or `visual` signal.

A removal with a same-role addition in the diff is a `renamed` with `to`.
Purely additive changes (a new export, optional prop or union value) need no
migration.

**No break from either source?** Skip to step 5 and write only the plans of the
libs changed, then run step 6. Tell the user no migration was needed and why.

## 3. Group them into migrations

One file per update a consumer handles in one go: usually one component or one
feature, across both platforms. Unrelated breaks in one PR get one file each.

The file name is the id: kebab-case, what changed from the consumer's view
(`menu-base-ui`, `media-button-rename`, `card-disabled-context`). It is
permanent, so check `libs/migrations/src/` for a clash and pick it carefully.

## 4. Write each migration

Read two neighbors first: [menu-base-ui.md](../../../libs/migrations/src/menu-base-ui.md)
(many changes) and [card-disabled-context.md](../../../libs/migrations/src/card-disabled-context.md)
(silent, both platforms). Then write the file following
[references/authoring.md](references/authoring.md).

- Frontmatter: one `changes` entry per ref from step 2, in the order a consumer
  should apply them. Never write `pr`: it is only for a late migration of an
  already released PR, which is why the backfilled neighbors carry one.
- Before → after: build the examples from the diff (old and new stories,
  tests, usages), not from invented code.
- Decide: one bullet per choice, each with its default.

**Ask the user instead of guessing** when the diff doesn't settle a choice: a
replacement with several candidates, a default with product or design impact,
or whether a behavior change is intended. Offer the options and your pick.

## 5. Write the version plans

Follow the `release-plan` skill: `patch`, one package per file. Plans already
on the branch count:

```bash
git diff origin/main --name-only -- .nx/version-plans
```

Needed:

- one per lib with a change under `libs/*/src/`;
- one for `@ledgerhq/lumen-migrations` when a migration is added or changed.

Get the timestamp with `node -p 'Date.now()'`. The message is the conventional
commit subject of the change, such as
`feat(migrations): add the menu-base-ui migration`.

## 6. Validate until everything passes

First check the files themselves, and fix until it passes:

```bash
npx nx run @ledgerhq/lumen-migrations:validate
```

It checks the schema, the body sections, and that each source `detect` pattern
matches a `before` example and, unless `expect: review`, no `after` example.

The rest only sees **committed** files: a migration counts for
`check:breaking-changes` once the index dates it from its commit, and the
"Changes since the base" part of `validate` (plans present, ids kept) passes
trivially before. So ask the user before committing the migration and plans,
then run:

```bash
npx nx run @ledgerhq/lumen-migrations:validate
npx nx run @ledgerhq/lumen-migrations:build
npm run check:breaking-changes
```

Fix each error, amend or add a commit, rebuild the index, and run again. Only
stop when all three pass. If the libs changed since step 2, rebuild them too.

## Report

List each migration with its refs and signals, the plans written, the checks
run and their result, and any question still open for the user.
