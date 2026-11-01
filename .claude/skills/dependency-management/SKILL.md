---
name: dependency-management
description: >-
  Use when adding, removing, upgrading or moving an npm dependency in any
  package.json of the workspace, or when `check:deps`, `check:peer-deps` or
  `@nx/dependency-checks` fails — where a package belongs (root
  devDependencies, a lib's dependencies, or a peer), which range to write, how
  to allow a second version, and when a version plan is needed.
paths: package.json, libs/*/package.json, apps/*/package.json, internals/*/package.json, .syncpackrc.json
---

# Dependency management

One version per package across every manifest. The rules are enforced by
`.syncpackrc.json` (`npm run check:deps`), the peer validator
(`npm run check:peer-deps`) and `@nx/dependency-checks` in each lib's
`eslint.config.mjs`. This skill says where a package goes and what to run.

## Where a package goes

| The package is… | Declare it in | Range |
| --- | --- | --- |
| Build, test, lint or type tooling | root `devDependencies` | match the neighbors; the lockfile pins the version |
| Imported by a published lib's shipped code | that lib's `dependencies` only | `^` (enforced), so consumers can dedupe |
| Provided once by the consumer app (React, React Native, Radix, `@ledgerhq/lumen-design-core`) | the lib's `peerDependencies` **and** root `devDependencies` | peer: a range with an upper bound; root: the version we test with |
| Used only by a sandbox app | that app's `package.json` | the same specifier as everywhere else |
| Used only by an `internals/*` project | root `devDependencies` (see `## Internals` in `AGENTS.md`) | as tooling |

- `@ledgerhq/lumen-*` versions between libs are written by `nx release`. Never
  edit them by hand. Sandbox apps use `*`.
- A types-only package (`@types/*`) goes in a lib's `dependencies` only when the
  emitted `.d.ts` imports it; list it in that lib's `ignoredDependencies` for
  `@nx/dependency-checks`, with a comment saying why.

## Adding or upgrading

1. Install where it belongs: `npm install -D <pkg>@<version>` at the root, or
   `npm install <pkg>@<version> -w libs/<lib>`. `.npmrc` already sets
   `legacy-peer-deps`.
2. Upgrade a family in one step. The families are the `dependencyGroups` in
   `.syncpackrc.json` (nx, Storybook web, Storybook on-device, react,
   react-native, vitest, tailwind, svgr). Nx goes through `nx migrate` (see the
   `nx` skill).
3. `npm run fix:deps` aligns the other manifests and refreshes the lockfile.
4. `npm run check:deps && npm run check:peer-deps`, then lint the touched libs.
5. Any edit to a `libs/*/package.json` needs a version plan (see the
   `release-plan` skill).

Changing a lib's `dependencies` or `peerDependencies` reaches consumers. Widening
a peer range is safe; raising its floor or adding an upper bound can break a
consumer, so it ships in a planned release, not a dependency chore.

## Allowing an exception

Never loosen a rule for everyone. Each exception names its package and says why:

- **A second version**: a `versionGroups` entry at the top of `.syncpackrc.json`
  (the first matching group wins) with a `label` giving the reason.
- **A package that must not come back**: a `versionGroups` entry with
  `isBanned: true` and a `label`.
- **A peer with no upper bound**: a `{ name, reason }` entry in
  `unboundedPeerExceptions` in
  `internals/repo-tools/src/ci/check-peer-deps/peerDeps.ts`. The check fails once
  the range is bounded, so remove the entry then.

## When a check fails

| Message | Fix |
| --- | --- |
| `check:deps`: `DiffersToHighestOrLowestSemver`, `SemverRangeMismatch` | `npm run fix:deps` |
| `check:deps`: `IsBanned` | remove the package; its `label` names the replacement |
| `check:peer-deps`: not in the root devDependencies | add it to the root at the version you test with |
| `check:peer-deps`: installed … is outside peer … | move the root version into the range; widening the peer is a lib change |
| `check:peer-deps`: has no upper bound | bound the range, or add an explained exception |
| `@nx/dependency-checks`: missing / not used | declare what the shipped code imports; remove what it doesn't |

## Review checks

Rules verifiable from a diff.

| Check | Applies to | Detect | Skip |
| --- | --- | --- | --- |
| Tooling in a published lib's `dependencies` | libs | test, build or lint package under `dependencies` | — |
| Peer without its root devDependency | libs | new `peerDependencies` key absent from root `devDependencies` | `@ledgerhq/lumen-*` |
| Peer narrowed in a dependency chore | libs | peer floor raised or upper bound added, PR not framed as a release change | — |
| Unexplained exception | `.syncpackrc.json`, `peerDeps.ts` | new `versionGroups` entry without a `label`, or exception without a comment | — |
| Lib manifest change without a version plan | libs | `libs/*/package.json` changed, no matching `.nx/version-plans/` file | — |
| Lockfile not refreshed | all | `package.json` dependency changed, `package-lock.json` untouched | — |
