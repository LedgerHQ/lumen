---
name: dependency-rules
description: >-
  Use when adding, moving, or reclassifying an npm dependency anywhere in the
  monorepo (root, libs/*, apps/*, internals/*) — whether it belongs in
  devDependencies, dependencies, or peerDependencies, whether a Vite/Rollup lib
  build needs it added to `external`, and which semver operator (`^`, `~`, or
  an exact pin) to use for it. Load this before adding a dependency to any
  package.json, or when reviewing one in a PR.
paths: "**/package.json", libs/*/vite.config.ts
---

# Dependency rules

Four folders, four different relationships to "does this ship to consumers":

| Folder | Published to npm? | Has `dependencies`/`peerDependencies`? | devDependencies |
| --- | --- | --- | --- |
| `/` (root) | never | no | The one shared toolchain version for the whole workspace — TypeScript, ESLint, Vitest/Jest, Nx plugins, Storybook. Every package inherits these via npm workspace hoisting; don't re-pin them locally. |
| `libs/*` | **yes** | **yes** — this is the point of the folder | Only tooling truly local to that lib (e.g. `@types/d3-*` in `ui-react-visualization`, needed for its own typecheck and nowhere else) |
| `apps/*` | never | no — nothing consumes an app | Whatever the app needs to build/run (docs site, sandbox app) |
| `internals/*` | never | no | Whatever the tool needs — it never touches a consumer's install |

Only `libs/*` carries the prod/peer distinction below, because it's the only folder whose `package.json` is ever installed by someone else.

## The three dependency kinds

| Kind | Declared in | npm installs it for consumers? | What it's for |
| --- | --- | --- | --- |
| `devDependency` | root (usually) | never — stripped at publish | build/lint/test tooling |
| `dependency` (prod) | `libs/*` | **yes**, automatically | runtime code the lib needs that isn't shared app-wide |
| `peerDependency` | `libs/*` | no — the consumer's own tree must supply it | anything that must be a **single shared instance** across the whole app |

## `dependency` ≠ "safe to bundle"

Being a `dependency` means npm installs it for the consumer — it says nothing about whether the *build tool* also inlines a private copy into `dist`. If both happen, that package's code ships twice: once from the consumer's own `node_modules`, once hidden inside the lib's own bundle.

| Libs | Build tool | How this is handled |
| --- | --- | --- |
| `ui-react`, `ui-react-visualization`, `utils-shared` | Vite/Rollup lib mode | Every `dependency` **and** `peerDependency` must be listed in `rollupOptions.external` — Rollup bundles anything not listed there, silently |
| `ui-rnative`, `ui-rnative-visualization` | `react-native-builder-bob` (transpiles file-by-file, like Babel) | Nothing is ever bundled, so every import stays external by construction — no `external` array to maintain |

**When you add a `dependency` to a Vite-built lib, add it to that lib's `external` array in the same change.** Missing this isn't just a size issue — it's a correctness bug: if the un-externalized package creates a React Context (e.g. `ui-react`'s `ThemeProvider`), the bundled duplicate gets its *own* Context object. A component from another lib calling `useTheme()` then can't see the app's real `<ThemeProvider>` ancestor and throws, even though the app did nothing wrong.

## `peerDependency`: react/react-dom vs internal Lumen packages

Both need to be a single shared instance, but for different reasons — and that changes the version range:

| Peer dep | Why it must be a peer | Version range |
| --- | --- | --- |
| `react`, `react-dom` | two React copies break hooks/context everywhere | normal caret range, e.g. `^18.0.0 \|\| ^19.0.0` |
| another `@ledgerhq/lumen-*` package | the dependent reaches into its exact internals (e.g. `useTheme()` needs the *same* `ThemeProvider` Context reference) | **exact pin, no operator** — e.g. `0.1.26` |

The exact pin on internal packages isn't extra manual upkeep: every release in this repo bumps `patch` regardless of whether the change is breaking (see the `release-plan` skill), so "patch" carries none of the safety guarantee a caret range implies for an ordinary package. `nx.json`'s `release.version.updateDependents: "auto"` keeps every dependent's pinned version current automatically whenever the upstream lib is released — nobody hand-edits it.

## The `^` / `~` / exact table

| Specifier | Range it allows | Use for |
| --- | --- | --- |
| `^1.2.3` | `>=1.2.3 <2.0.0` (minor + patch) | ordinary third-party deps that follow semver |
| `^0.7.1` | `>=0.7.1 <0.8.0` (semver's 0.x carve-out: patch-only) | same — several deps here are still pre-1.0, the caret just narrows itself automatically |
| `~0.81.6` | patch-only, explicit | packages coupled to a native runtime (`react-native`, `expo-*`), where a "minor" bump can break native/bridge compatibility the way a major would elsewhere |
| `0.1.26` | that exact version only | internal `@ledgerhq/lumen-*` packages consumed as peers — see above |
| `>=54.0.0` | unbounded, forever | avoid — this is a bug pattern, not a real choice; bound it (`~54.0.0` or an explicit upper limit) for the same reason as `react-native` |

## Checklist when adding a dependency

1. Root, `apps/*`, or `internals/*`? It's a plain `dependency`/`devDependency` — none of the rest applies.
2. In `libs/*`: does the whole app need to share one instance (React) or does this reach into another Lumen package's internals? → `peerDependency`.
3. Otherwise → `dependency`.
4. If the lib builds with Vite/Rollup, add it to that lib's `vite.config.ts` `external` array in the same change.
5. Pick the version operator from the table above — `^` by default, exact only for internal `@ledgerhq/lumen-*` peers, `~`/bounded for native-runtime packages.
