# @ledgerhq/lumen-migrations

One Markdown file per Lumen breaking change, at `src/<id>.md`. The automated
upgrade pipeline applies them in consumer repos
([ADR 027](https://ledgerhq.atlassian.net/wiki/spaces/DLS/pages/7689666642)).
UI libs don't depend on this package.

## Format

The YAML frontmatter is read by tools, the body by agents.

```md
---
changes: # applied in order
  - change: required # renamed | removed | required | changed
    surface: dependency # module | export | member | value | token | dependency
    ref: '@base-ui/react'
    signal: loud # loud: the build fails. silent: it compiles. visual: it renders differently
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuItem.onSelect'
    to: '@ledgerhq/lumen-ui-react#MenuItem.onClick'
    signal: silent # onSelect is still a valid DOM prop
    detect: # required unless loud
      - { pattern: '<MenuItem[^>]*\bonSelect=' } # in: source, expect: none
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MenuPortal'
    signal: loud
requires: # optional: stop the upgrade until these are met
  react: '>=18'
codemod: menu-base-ui # optional, once a script exists
---

## Before → after

## Decide

## Verify
```

A `ref` is an address: `module#Export.member=value`, cut at the surface's
depth. A token is `module#token`, a dependency its package name.

`detect` patterns are regexes. `in: manifests` searches `package.json` files
instead of source. `expect: review` lists hits for a human instead of
requiring zero.

The file name is the id. Packages, title, PR and introduced version come from
the commit and its version plans, never written by hand.

## Rules

- A PR that breaks something adds its migration in the same PR.
- Say what broke and how to fix it, nothing the version plan already says.
- A replacement with no 1:1 mapping is a `removed` change; the body explains
  what to use instead.
