---
name: release-plan
description: >-
  Use when generating or editing an Nx version plan in .nx/version-plans/ — the
  bump type must always be `patch`, one package per file, and the message one
  `type(Scope): summary` line.
---

# Release plan bump type

When generating an Nx version plan in `.nx/version-plans/`, the bump type
in the frontmatter MUST always be `patch` — never `minor`, never `major` —
regardless of the nature of the change (new feature, new component, new prop,
breaking change, refactor, fix, etc.).

```markdown
---
'@ledgerhq/lumen-ui-rnative': patch
---

feat(Select): add render prop and SelectButtonTrigger
```

- Do not infer `minor` from `feat(...)` commits.
- Do not infer `major` from breaking changes.

## Message

One line: `type(Scope): summary`. Nx copies it as is into the GitHub Release,
which the `release-notes-slack` skill announces. Nx doesn't parse it: the
format is for readers.

- `type`: `feat`, `fix`, `refactor`, `perf`, `chore` or `docs`.
- `Scope`: the component or area (`Button`, `tokens`, `deps`, `migrations`).
- `summary`: imperative, lowercase first letter, no trailing period, at most
  100 characters. Say what changed, not how to update: that goes in the
  migration (`libs/migrations/README.md`).
- Breaking change: add `!` after the scope, so readers of the release notes
  see it. Not `BREAKING_CHANGE(...)`.

| Good                                                          | Bad                                                      |
| ------------------------------------------------------------- | -------------------------------------------------------- |
| `feat(Button): add the green appearance`                      | `Sync interface icons from Figma` (no type or scope)     |
| `feat(Link)!: rename isExternal to external`                  | `refactor: move cn to design-core` (no scope)            |
| `fix(Dialog): animate the whole DialogContent height`         | `BREAKING_CHANGE(DataTable): remove …` (not a type)      |
| `chore(deps): require react-native-reanimated ^4.3.0 as peer` | `fix(Spot): Use a 16px icon.` (capital, trailing period) |

## One package per file

Each release plan file MUST list a single package in its frontmatter — never
group multiple packages in the same file. If a change affects N packages,
create N separate `version-plan-<timestamp>-<pkg>.md` files, one per package.

```markdown
---
'@ledgerhq/lumen-ui-react': patch
---

feat(Select): add render prop and SelectButtonTrigger
```

```markdown
---
'@ledgerhq/lumen-ui-rnative': patch
---

feat(Select): add render prop and SelectButtonTrigger
```

Do NOT do this:

```markdown
---
'@ledgerhq/lumen-ui-react': patch
'@ledgerhq/lumen-ui-rnative': patch
---
```

## Path → package

Each version-plan file names the package for the paths that changed. This is the
single source for the mapping; other skills link here rather than restating it.

| Path | Package |
| --- | --- |
| `libs/ui-react/` | `@ledgerhq/lumen-ui-react` |
| `libs/ui-rnative/` | `@ledgerhq/lumen-ui-rnative` |
| `libs/design-core/` | `@ledgerhq/lumen-design-core` |
| `libs/utils-shared/` | `@ledgerhq/lumen-utils-shared` |
| `libs/lint-plugin/` | `@ledgerhq/lumen-lint-plugin` |
| `libs/migrations/` | `@ledgerhq/lumen-migrations` |

Filename convention: `version-plan-<timestamp>-<pkg-slug>.md`, where the slug is
the short name (`ui-react`, `ui-rnative`, `utils-shared`, …).

## When a plan is required

Any change to production source under `libs/*/src/` requires a plan. Exemptions
are defined authoritatively in `nx.json` under
`release.versionPlans.ignorePatternsForPlanCheck`: `*.test.*` / `*.spec.*`,
`*.stories.*`, `*.md`, `*.mdx`, `*.figma.@(ts|tsx)`, `tsconfig*.json`, eslint
configs, `jest.config.*`, `test-setup.*`, `*.snap`, `.storybook/**`. A PR
touching only these needs no plan. A lib's `package.json` is not exempt: any
edit to it, devDependencies included, needs a plan.

`internals/*` is outside `release.projects`, so a PR touching only `internals/*`
never needs a plan.
