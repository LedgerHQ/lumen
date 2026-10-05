---
name: dependency-rules
description: >-
  Use when adding, moving or reclassifying an npm dependency in any package.json
  of the monorepo (root, libs/*, apps/*, internals/*): whether it belongs in
  dependencies, peerDependencies or devDependencies, whether a Vite lib build
  must list it in `external`, and which semver operator to use. Also use when
  reviewing a PR that touches a manifest.
paths: "**/package.json, libs/*/vite.config.ts"
---

# Dependency rules

## Where each manifest stands

| Manifest | Published? | `dependencies` / `peerDependencies` | `devDependencies` |
| --- | --- | --- | --- |
| root | never | none: nothing consumes the workspace root | the one shared toolchain (TypeScript, ESLint, Vitest/Jest, Nx, Storybook, `@types/react`…). Libs and apps inherit it through workspace hoisting, so don't re-pin it locally |
| `libs/*` | **yes** | **yes**: the only place the prod/peer split matters | tooling local to one lib only |
| `apps/*` | never | follow the platform convention (`app-sandbox-rnative` keeps its Expo runtime packages in `dependencies`); the split is inert because nobody installs an app | what the app needs to build |
| `internals/*` | never | none | none: tooling dependencies stay in the root manifest (see `AGENTS.md`) |

## Choosing the kind (libs only)

One test sits behind all three: *if a second copy of this package loaded at runtime, would it break, or only cost bytes?*

| Kind | Pick it when | Examples here |
| --- | --- | --- |
| `peerDependency` | the consumer's runtime must own the single instance: React and anything with a context or hook registry; **native modules** (autolinking builds one native binary, a nested JS copy can't match it); a tool the consumer runs that loads your code; another Lumen package whose internals you reach into | `react`, `react-dom`, `react-native`, `react-native-reanimated`, `react-native-svg`, `react-native-safe-area-context`, `expo-haptics`, `@gorhom/bottom-sheet`, `@ledgerhq/lumen-design-core` |
| `dependency` | an implementation detail the consumer never touches, **or** a package whose types the public `.d.ts` re-export | Radix UI, Base UI, `class-variance-authority`, `i18next`, `d3-*`, `@types/d3-*` (the public barrel re-exports d3-scale types, see `docs/adr/0002-visualization-fold.md`) |
| `devDependency` | build, lint, test or docs tooling that never reaches an emitted file | Storybook, Vitest, `@types/react` (owned by the root) |

Mark a peer `optional` in `peerDependenciesMeta` when a feature works without it, as `ui-rnative` does for `react-native-gesture-handler` and `react-native-worklets`.

A peer is a promise the consumer has to keep, and `.npmrc` sets `legacy-peer-deps=true`, so a wrong peer gives **no signal in this repo**. Check a manifest change from a clean consumer install, for example with the `publish-dev-package` PR label (`docs/pull-requests.md`).

## A `dependency` is not "safe to bundle"

A `dependency` makes npm install the package; it says nothing about whether the build also copies it into `dist/`. When both happen the code ships twice.

| Lib | Build | What keeps a dependency out of `dist/` |
| --- | --- | --- |
| `ui-react`, `utils-shared` | Vite / Rollup lib mode | every `dependency` **and** `peerDependency` must be listed in `build.rollupOptions.external`, in the same change |
| `ui-rnative` | `react-native-builder-bob` (Babel, file by file) | nothing to maintain: it never bundles, every import stays as written |
| `design-core` | `tsc` | nothing to maintain, same reason |

Rollup's `external` matches exact strings. A package imported through subpaths (`@base-ui/react/popover`) needs a regex such as `/^@base-ui\/react(\/|$)/`. A missing entry fails silently, so after changing dependencies build the lib and check that `dist/` holds no `node_modules/` and no copied workspace package.

The mirror rule for the lib that isn't bundled: nothing bundles an import for the consumer, so a package missing from the manifest works in the monorepo (hoisting) and breaks in the app. Declare everything you import.

## Internal `@ledgerhq/lumen-*` packages

Pin them exactly, with no operator, whether they are a `dependency` (`utils-shared`) or a `peerDependency` (`design-core`). Every release is a `patch` (see the `release-plan` skill), so a caret range would promise a compatibility a patch bump doesn't give. `release.version.updateDependents: "auto"` in `nx.json` rewrites the pins on release; nobody edits them by hand.

## Version operators

| Specifier | Allows | Use for |
| --- | --- | --- |
| `^1.2.3` | `>=1.2.3 <2.0.0` | ordinary third-party packages. Keep the floor as low as you have tested: a high floor makes consumers with an older lockfile install a nested second copy |
| `^0.7.1` | `>=0.7.1 <0.8.0` (0.x carve-out) | the same, caret narrows itself below 1.0 |
| `~0.81.6` | patch only | packages coupled to a native runtime (`react-native`, `expo-*`) |
| `0.1.30` | that version only | internal `@ledgerhq/lumen-*` packages |
| `>=54.0.0` | every future major | avoid for new entries; a few older `ui-rnative` peers still use it |

## Checklist when adding a dependency

1. Root, `apps/*` or `internals/*`? Then there is no prod/peer question: use the table at the top.
2. In `libs/*`: run the break-or-bytes test and pick peer, dependency or dev.
3. Vite-built lib: add it to `external` in the same change.
4. Pick the operator from the table.
5. Verify from a clean consumer install; peers aren't enforced in this repo.
6. Add a version plan: a manifest change alters the published package (`release-plan` skill).

## Review checks

Rules verifiable from a diff.

| Check | Applies to | Detect | Skip |
| --- | --- | --- | --- |
| React, native module or other singleton declared as a `dependency` | `libs/*/package.json` | `react*`, `react-native*`, `expo-*`, `@gorhom/*` under `dependencies` | — |
| New dependency or peer missing from the Vite `external` list | `libs/ui-react`, `libs/utils-shared` | added to the manifest but not to `rollupOptions.external` | `ui-rnative`, `design-core` (not bundled) |
| Subpath-imported package listed as a plain string in `external` | `vite.config.ts` | `'@scope/pkg'` while the source imports `'@scope/pkg/…'` | — |
| Import not declared in the manifest | `libs/*/src` | bare import with no `dependencies` / `peerDependencies` entry | tests, stories, `*.figma.tsx` |
| Internal Lumen package with a range operator | `libs/*/package.json` | `^` or `~` on `@ledgerhq/lumen-*` | — |
| Manifest change without a version plan | `libs/*/package.json` | no `.nx/version-plans/` file for the package | — |
