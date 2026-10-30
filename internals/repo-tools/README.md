# repo-tools

Dev-only Nx project holding repo plumbing: CI validators and the helpers they
share. Never published, so changes here need no version plan — see
`## Internals` in [AGENTS.md](../../AGENTS.md) for the category's rules.

Unlike `sync-figma`, nothing here is a pipeline with its own Nx targets. These
are scripts **invoked by path** (`node <file>.ts`) from `package.json` and from
workflows, so the project carries only `lint`, `typecheck` and `test`.

## Layout

`src/` is grouped by where a script runs. Today everything runs in CI, so it
all sits in `ci/`; a future group (local codegen, release helpers…) gets its own
folder next to it. Inside a group, one folder per use case, named after the npm
script or workflow that runs it. A `check-*` folder is a CI gate.

| Folder | Intent | Entry point | Run by |
| --- | --- | --- | --- |
| `ci/check-agent-docs/` | AGENTS.md, skills and the codebase stay in sync | `agentDocsDrift.ts` | `npm run check:agent-docs`, `pr.yml` job `agent-drift` |
| `ci/check-package-exports/` | Every advertised export ships in the tarball | `packageExports.ts` | `npm run check:package-exports`, `pr.yml` job `bundle-checks` |
| `ci/check-peer-deps/` | Lib peers accept the versions we test with | `peerDeps.ts` | `npm run check:peer-deps`, `pr.yml` job `dependency-alignment` |
| `ci/fix-lcov-paths/` | Coverage paths SonarCloud can resolve | `fixLcovPaths.ts` | `pr.yml` job `unit-testing` |
| `ci/publish-dev-packages/` | Per-PR dev tarballs and their PR comment | `getPublishableProjects.ts`, `generateTarballs.ts` | `publish-dev-packages.yml` |
| `ci/rn-081-compat/` | ui-rnative still type-checks and passes its tests on Ledger Wallet Mobile's RN 0.81 stack (temporary, until LWM is on RN 0.86) | `pinRn081Stack.ts` | `pr.yml` job `rn-081-compat` |
| `shared/` | Which libs exist and publish; console output | `workspaceProjects.ts`, `logging.ts` | imported only |

A new script goes in the folder of its use case, or in a new folder named after
its npm script or workflow. Tests sit next to the code as `*.test.ts`. A
use-case folder imports from `shared/` only, never from another use case.

> **`ci/check-agent-docs/` must stay dependency-free.** Its CI job skips
> `npm ci` and Nx, so it may import `node:` builtins and sibling files in this
> project, nothing else. `ci/check-package-exports/` uses `publint`,
> `ci/check-peer-deps/` uses `semver`.

## Dev tarballs dry run

`generateTarballs.ts` runs locally for a dry run — it patches `libs/*` versions
in place, so revert afterwards:

```bash
PR_NUMBER=999 HEAD_SHA=abcdef1234567890 REPO=LedgerHQ/lumen \
AFFECTED_PROJECTS='@ledgerhq/lumen-utils-shared' \
RUNNER_TEMP=$(mktemp -d) GITHUB_OUTPUT=/dev/null \
node internals/repo-tools/src/ci/publish-dev-packages/generateTarballs.ts
git checkout -- libs/
```

> `npm pack` must be given an **absolute** path. A bare `libs/foo` is read as a
> GitHub `owner/repo` shorthand and npm tries to clone it.

## Typechecking

These are `.ts` files run as-is by Node's built-in type stripping (on by
default since Node 22.18; the version comes from `.mise.toml`), so no loader,
build step or install sits between `node` and the script. That is what keeps
`ci/check-agent-docs/` runnable in a job that skips `npm ci`.

Stripping only deletes types, so the code must be valid JavaScript once they are
gone. `tsconfig.json` enforces it:

- `erasableSyntaxOnly` — no `enum`, `namespace` or parameter properties.
- `verbatimModuleSyntax` — type-only imports use `import type`, or Node keeps
  them and fails at runtime.
- `allowImportingTsExtensions` + `module: nodenext` — relative imports name the
  `.ts` file, exactly what Node resolves.

Run `npx nx typecheck repo-tools`.

The `typecheck` target is declared in `project.json` rather than inferred. The
`@nx/js/typescript` plugin infers `tsc --build --emitDeclarationOnly`, which
needs a composite project and writes `.d.ts` files — pointless for scripts that
are invoked by path and imported by nothing. `tsc --noEmit` checks them in
place, so there is no `out-tsc` and no root `tsconfig.json` reference.
