# @ledgerhq/lumen-migrations

One Markdown file per Lumen breaking change, at `src/<id>.md`. The automated
upgrade pipeline applies them in consumer repos
([ADR 027](https://ledgerhq.atlassian.net/wiki/spaces/DLS/pages/7689666642)).
UI libs don't depend on this package.

## Format

The YAML frontmatter is read by tools, the body by agents.

```md
---
signal: loud # loud: the typecheck finds it. silent: the agent must search
covers: # what was removed
  props: { Spot: [number] }
  values: { Spot.appearance: [check, info, number] }
detect: # old-api must reach zero hits
  - { pattern: 'appearance="(check|info|number)"', match: old-api }
codemod: rename-jsx-prop # optional, once a script exists
---

## Before → after

## Decide

## Verify
```

The file name is the id. Packages, title, PR and introduced version come from
the commit and its version plans, never written by hand.

## Rules

- A PR that breaks something adds its migration in the same PR.
- Say what broke and how to fix it, nothing the version plan already says.
