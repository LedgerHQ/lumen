# repo-tools

Dev-only Nx project holding repo plumbing: CI validators and the helpers they
share. Never published, so changes here need no version plan — see
`## Internals` in [AGENTS.md](../../AGENTS.md) for the category's rules.

Unlike `sync-figma`, nothing here is a pipeline with its own Nx targets. These
are scripts **invoked by path** from `package.json` and from workflows, so the
project carries only `lint`, `typecheck` and `test`.

## Layout

| Path | What |
| --- | --- |
| `src/ci/validators/` | Checks that fail CI — one file per invariant |
| `src/ci/` | Workflow helpers that replace inline bash |
| `src/lib/` | Shared helpers (Nx graph access, logging) |

## Validators

| Script | npm script | Runs in |
| --- | --- | --- |
| `agentDocsDrift.mjs` | `npm run check:agent-docs` | `pr.yml` job `agent-drift` |
| `packageExports.mjs` | `npm run check:package-exports` | `pr.yml` job `static-analysis` |

> **`agentDocsDrift.mjs` must stay dependency-free.** Its CI job runs with
> `setup-node` only — no `npm ci`, no Nx — so it may import `node:` builtins and
> sibling files in this project, nothing else. `packageExports.mjs` has no such
> constraint; it uses `publint`.

## Typechecking

These are `.mjs` files checked with `allowJs` + `checkJs` under the workspace's
`strict`, `noImplicitAny` included — so callbacks need a JSDoc type. Run
`npx nx typecheck repo-tools`.

The `typecheck` target is declared in `project.json` rather than inferred. The
`@nx/js/typescript` plugin infers `tsc --build --emitDeclarationOnly`, which
needs a composite project and writes `.d.ts` files — pointless for scripts that
are invoked by path and imported by nothing. `tsc --noEmit` checks them in
place, so there is no `out-tsc` and no root `tsconfig.json` reference.
