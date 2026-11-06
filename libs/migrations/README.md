# @ledgerhq/lumen-migrations

One Markdown file per Lumen update consumers must act on, at `src/<id>.md`.
The automated upgrade pipeline applies them in consumer repos
([ADR 027](https://ledgerhq.atlassian.net/wiki/spaces/DLS/pages/7689666642)).
UI libs don't depend on this package.

## Format

The YAML frontmatter is read by tools, the body by agents.

````md
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
pr: 716 # optional: the PR that shipped the update, when this file lands later
---

## Before → after

```tsx before
<MenuItem onSelect={close}>Close</MenuItem>
```

```tsx after
<MenuItem onClick={close}>Close</MenuItem>
```

## Decide

## Verify
````

A `ref` is an address: `module#Export.member=value`, cut at the surface's
depth. A token is `module#token`, a dependency its package name.

`detect` patterns are regexes. `in: manifests` searches `package.json` files
instead of source. `expect: review` lists hits for a human instead of
requiring zero.

The file name is the id. Packages, title, PR and introduced version come from
the PR that shipped the update and its version plans, never written by hand.
That PR is the one adding the file, unless `pr` names an earlier one. Plans
and tags under the former `@ldls/*` and `@ledgerhq/ldls-*` names count as the
current package.

## Examples

`## Before → after` holds code blocks tagged `before` and `after` (at least one
of each). Agents follow them, and CI checks that each source `detect` pattern
matches a `before` block and, unless `expect: review`, no `after` block.

## Index

`index.json` lists every migration with what git knows about it: `id`,
`title`, `pr`, `commit` and `introduced` (package → first release with the
change), oldest first. It's generated, never committed, and exported as
`@ledgerhq/lumen-migrations/index.json`, typed by `index.d.ts` (a test keeps
it in line with the schema).

- `nx run @ledgerhq/lumen-migrations:build` builds it and warns on anything
  unresolved (dev tarballs, local runs).
- The release publish runs `build-release` after tagging, which fails on
  anything unresolved. A dry run only warns, since it creates no tags.

## Rules

- A PR that makes consumers change their code adds its migration in the same PR.
- Say what changed and how to update, nothing the version plan already says.
- The file name is permanent: never rename or delete a migration.
- Any change to a migration needs a version plan for this package. A new one
  also needs the plan of each Lumen package its refs point into (any package
  for an external dependency change), or a `pr` whose plans have them.
- `npx nx run @ledgerhq/lumen-migrations:validate` checks all of the above.
- A replacement with no 1:1 mapping is a `removed` change; the body explains
  what to use instead.
