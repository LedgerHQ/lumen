---
name: release-plan
description: >-
  Use when generating or editing an Nx version plan in .nx/version-plans/ — the
  bump type must always be `patch`, one package per file.
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

Filename convention: `version-plan-<timestamp>-<pkg-slug>.md`, where the slug is
the short name (`ui-react`, `ui-rnative`, `utils-shared`, …).

## When a plan is required

Any change to production source under `libs/*/src/` requires a plan. Exemptions
are defined authoritatively in `nx.json` under
`release.versionPlans.ignorePatternsForPlanCheck`: `*.test.*` / `*.spec.*`,
`*.stories.*`, `*.md`, `*.mdx`, `*.figma.@(ts|tsx)`, `tsconfig*.json`, eslint
configs, `jest.config.*`, `test-setup.*`, `*.snap`, `.storybook/**`. A PR
touching only these needs no plan.

`internals/*` is outside `release.projects`, so a PR touching only `internals/*`
never needs a plan.
