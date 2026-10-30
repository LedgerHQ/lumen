# repo-tools

Dev-only Nx project holding repo plumbing: CI validators and the helpers they
share. Never published, so changes here need no version plan — see
`## Internals` in [AGENTS.md](../../AGENTS.md) for the category's rules.

Unlike `sync-figma`, nothing here is a pipeline with its own Nx targets. These
are scripts **invoked by path** from `package.json` and from workflows, so the
project carries only `lint`, `typecheck` and `test`.

## Layout

`src/` is grouped by where a script runs. Today everything runs in CI, so it
all sits in `ci/`; a future group (local codegen, release helpers…) gets its own
folder next to it. Inside a group, one folder per use case, named after the npm
script or workflow that runs it. A `check-*` folder is a CI gate.

| Folder | Intent | Entry point | Run by |
| --- | --- | --- | --- |
| `ci/check-agent-docs/` | AGENTS.md, skills and the codebase stay in sync | `agentDocsDrift.mjs` | `npm run check:agent-docs`, `pr.yml` job `agent-drift` |
| `ci/check-package-exports/` | Every advertised export ships in the tarball | `packageExports.mjs` | `npm run check:package-exports`, `pr.yml` job `bundle-checks` |
| `ci/check-package-types/` | Shipped types resolve for bundler and node16 ESM consumers | `packageTypes.mjs` | `npm run check:package-types`, `pr.yml` job `bundle-checks` |
| `ci/check-peer-deps/` | Lib peers accept the versions we test with | `peerDeps.mjs` | `npm run check:peer-deps`, `pr.yml` job `dependency-alignment` |
| `ci/fix-lcov-paths/` | Coverage paths SonarCloud can resolve | `fixLcovPaths.mjs` | `pr.yml` job `unit-testing` |
| `ci/publish-dev-packages/` | Per-PR dev tarballs and their PR comment | `getPublishableProjects.mjs`, `generateTarballs.mjs` | `publish-dev-packages.yml` |
| `shared/` | Which libs exist and publish; packing; console output | `workspaceProjects.mjs`, `pack.mjs`, `logging.mjs` | imported only |

A new script goes in the folder of its use case, or in a new folder named after
its npm script or workflow. Tests sit next to the code as `*.test.mjs`. A
use-case folder imports from `shared/` only, never from another use case.

> **`ci/check-agent-docs/` must stay dependency-free.** Its CI job skips
> `npm ci` and Nx, so it may import `node:` builtins and sibling files in this
> project, nothing else. `ci/check-package-exports/` uses `publint`,
> `ci/check-package-types/` uses `@arethetypeswrong/core`,
> `ci/check-peer-deps/` uses `semver`.

## Dev tarballs dry run

`generateTarballs.mjs` runs locally for a dry run — it patches `libs/*` versions
in place, so revert afterwards:

```bash
PR_NUMBER=999 HEAD_SHA=abcdef1234567890 REPO=LedgerHQ/lumen \
AFFECTED_PROJECTS='@ledgerhq/lumen-utils-shared' \
RUNNER_TEMP=$(mktemp -d) GITHUB_OUTPUT=/dev/null \
node internals/repo-tools/src/ci/publish-dev-packages/generateTarballs.mjs
git checkout -- libs/
```

> `npm pack` must be given an **absolute** path. A bare `libs/foo` is read as a
> GitHub `owner/repo` shorthand and npm tries to clone it.

## Typechecking

These are `.mjs` files checked with `allowJs` + `checkJs` under the workspace's
`strict`, `noImplicitAny` included — so callbacks need a JSDoc type. Run
`npx nx typecheck repo-tools`.

The `typecheck` target is declared in `project.json` rather than inferred. The
`@nx/js/typescript` plugin infers `tsc --build --emitDeclarationOnly`, which
needs a composite project and writes `.d.ts` files — pointless for scripts that
are invoked by path and imported by nothing. `tsc --noEmit` checks them in
place, so there is no `out-tsc` and no root `tsconfig.json` reference.
