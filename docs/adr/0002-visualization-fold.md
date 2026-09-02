# ADR 0002 — Fold the visualization libs into the UI libs

- **Status:** Accepted
- **Date:** 2026-08-04
- **Ticket:** DLS-1022
- **Reference:** Coinbase CDS, where charts are a component *category* inside
  `cds-web` / `cds-mobile`, not a separate package.

---

## Context

`@ledgerhq/lumen-ui-react-visualization` and `@ledgerhq/lumen-ui-rnative-visualization`
are published as standalone packages, but they were never independent:

- Both **import back into their parent** — 13 statements across 11 files on web,
  34 across 32 files on React Native (`useTheme`, `ThemeProvider`, `Box`, `Text`,
  `useStyleSheet`, `useControllableState`, `ButtonProps`, `FormattedValue`). The
  web package pins `"@ledgerhq/lumen-ui-react": "0.1.56"` exactly.
- `ui-rnative-visualization` already declares
  `implicitDependencies: ["@ledgerhq/lumen-ui-rnative"]`.
- Web chart stories are **already served from the ui-react Storybook**
  (`libs/ui-react/.storybook/main.ts:11-12` globs across the lib boundary).
- The RN equivalent is **commented out** — RN chart stories ship nowhere.
- The two libs are a diverging fork: **6 of 9 files** under `utils/` differ, and
  the test files differ only by `vitest` vs `@jest/globals`.

Charts are a category of the design system, not a product of their own.

## Decision

1. Move both viz trees into their parent lib under `Components/visualization/`.
2. Expose them **only** via a subpath — `@ledgerhq/lumen-ui-react/visualization`
   and `@ledgerhq/lumen-ui-rnative/visualization` — mirroring `./symbols`.
   Charts never enter the main barrel (`src/index.ts`).
3. **Delete both lib folders. Hard cut** — no shim package, no re-export.
   Consumers migrate with a codemod.
4. `d3-scale` and `d3-shape` become **regular `dependencies`** of the UI libs.
   (`d3-array` is dropped — no source file in either tree imports it.)
5. The published packages are retired with `npm deprecate`, not a final release.

### Path baseline

Paths below are written against the **current** on-disk layout, where the tier
split is done but `src/lib/` remains:

```
libs/ui-react/src/lib/Components/{core,internal,symbols}
libs/ui-rnative/src/lib/Components/{animations,core,internal,primitives,symbols}
```

Charts land at `src/lib/Components/visualization/`. **Decided: fold onto the
current layout — the `src/lib` flatten is *not* a prerequisite for DLS-1022.**
Three consequences, all favourable: `libs/ui-react/tailwind.css:16`
`@source "./dist/lib"` needs **no change**; the ui-react
`../src/lib/**/*.mdx` glob **already covers** the new tree; and the fold stops
waiting on a large mechanical PR.

The cost is that these 261 files move a second time when the flatten eventually
happens — pure `git mv`, no logic. When it does, apply this delta everywhere:
`src/lib/Components/` → `src/components/`, `dist/lib/Components/` →
`dist/components/`, and `@source "./dist/lib"` → `@source "./dist"`.

---

## The trap this ADR exists to prevent

**The subpath will typecheck, autocomplete, pass every CI job, publish cleanly —
and 404 at runtime, while emitting zero chart CSS.**

Two tools disagree about what "the build" means:

- `vite-plugin-dts` (`libs/ui-react/vite.config.ts:27-30`, `entryRoot: 'src'`)
  emits a `.d.ts` for **every file in the TypeScript program**.
- Rollup, with `preserveModules: true` and `treeshake: { preset: 'smallest' }`,
  emits `.js` **only for modules reachable from a declared entry** — and
  `build.lib.entry` (`vite.config.ts:51-57`) declares exactly two: `index` and
  `lib/Components/symbols/index`.

This asymmetry is already observable in the checked-in build:

```
libs/ui-react/dist/test-setup.d.ts                     ← exists
libs/ui-react/dist/test-setup.js                       ← does not exist

libs/ui-react/dist/lib/Components/internal/BaseInput/
  BaseInput.js               ← exists (entry-reachable)
  BaseInputSingleLine.d.ts   ← exists
  BaseInputSingleLine.js     ← does NOT exist
  index.d.ts                 ← exists
  index.js                   ← does NOT exist
```

The published tarball already contains declaration files with no runtime
counterpart. Nobody notices because no export points at them.

Decision 2 deliberately keeps charts out of `src/index.ts`. So if the
`"./visualization"` export key is added **without** a matching Vite entry — two
different files, edited by two different instincts, with no test connecting
them — then after `nx build`:

| | result |
| --- | --- |
| `dist/.../visualization/index.d.ts` | **exists** → `types` resolves, `tsc` green, IDE autocompletes `LineChart` |
| `dist/.../visualization/index.js` | **missing** → `import`/`default` resolve to nothing |
| `nx affected -t build` | exits 0 — rollup was never asked for that entry |
| `nx affected -t test:tree-shaking` | green **and irrelevant** — `main.treeshaking.tsx` imports only the main barrel and `/symbols` |
| Consumer's first import | `ERR_MODULE_NOT_FOUND` — after they ran the codemod and deleted the old package |

**No job in this repo imports a Lumen subpath other than `/symbols`.** There is
no `npm pack` check, no publint, no consumer-install smoke test.

The CSS fails in the same stroke. Tailwind class names exist only in emitted
`.js`; `Legend.d.ts` contains zero `className` strings. So Tailwind scans a
visualization tree of declaration files and emits **not one chart utility** — no
error, no warning. This is precisely the failure mode
`libs/ui-react/tailwind.css:6-9` documents in its own comment.

**The guard (non-negotiable):** run `npm pack --dry-run` on both packages and
install the tarballs into a scratch app that imports one chart. Ninety seconds,
and it surfaces the entire class.

---

## Blocker inventory

Twenty-five blockers, verified by reading files. Grouped by the PR that owns them.

### Build & packaging — these must land together or the subpath is a lie

1. **Add the Vite entry.** `libs/ui-react/vite.config.ts:51-57` — add
   `'lib/Components/visualization/index'`. Without it, rollup emits no chart JS.
2. **Author a new barrel.** The source barrels are `src/index.ts`, which is
   *outside* the moved `src/lib/**` tree. Moving `lib/` alone leaves the new
   folder with no `index.ts` — the exact file both export keys point at. Create
   it and rewrite its specifiers from `./lib/Components` / `./lib/utils` to
   `./Components` / `./utils`.
3. **Explicit `"./visualization"` export key**, as a conditions object with
   `types` first — and **delete the `"./*"` wildcard** at
   `libs/ui-react/package.json:31`. *Decided.* The wildcard resolves to
   `./dist/lib/Components/core/*/index.js`, and **all 52 core components ship
   `index.d.ts` with no `index.js`**: rollup elides pure re-export barrels under
   `treeshake: 'smallest'`, so `Button.js` survives and `Button/index.js` never
   exists. `@ledgerhq/lumen-ui-react/Button` therefore throws
   `ERR_MODULE_NOT_FOUND` in the published package today. It appears in no
   README, no `RULES.md`, nothing consumer-facing, so removing it breaks nothing
   that works — and it is the ADR's own failure mode, already shipping.
4. **RN key must carry the `react-native` condition**, mirroring `./symbols`
   (`libs/ui-rnative/package.json:26-31`). `apps/app-sandbox-rnative/metro.config.js`
   enables package exports, so a `types`/`import`-only key compiles in CI and
   dies in Metro.
5. **Settle d3: externalize *and* declare, or bundle and declare neither.**
   `libs/ui-react/vite.config.ts:69-83` externalizes no d3, so d3 would be both
   installed by the consumer *and* inlined into dist. This is not hypothetical —
   `libs/ui-react-visualization/dist/node_modules/` today vendors **eleven**
   packages: `d3-array`, `d3-color`, `d3-format`, `d3-interpolate`, `d3-path`,
   `d3-scale`, `d3-shape`, `internmap`, plus `class-variance-authority`, `clsx`
   and `tailwind-merge` — the last three **declared as peerDependencies and
   bundled anyway**. These vendored copies **do** ship: `npm pack --dry-run`
   lists 66 `dist/node_modules/**` entries, 332 KB of a 1.2 MB unpacked package,
   and six emitted files import them by relative path
   (`from "../../../node_modules/d3-scale/src/band.js"`). So the published
   package is not broken — it is a **double-ship**: every consumer receives a
   vendored copy alongside the one they install. Add `/^d3-/` and `internmap`
   to `external`; inherit ui-react's list, not the viz one.
6. **Rewrite all self-imports to relative** — 13 statements / 11 files on web
   (2 of them `@ledgerhq/lumen-ui-react/symbols`, needing a different target),
   34 statements / 32 files on RN. **Exclude `Point/types.ts:63`** — it is a
   JSDoc `@example`, where the package specifier stays correct. Add the package
   name to `external` as a tripwire: a leftover self-import otherwise inlines a
   *second copy* of the library, producing duplicate `ThemeProvider` and disabled-context
   instances, so charts silently ignore host theme and disabled state. Bob does
   not catch this on RN at all — it would publish a package that imports itself.
7. **`libs/ui-react/tsconfig.lib.json`: exclude `**/__stories__/**`** (and the
   RN twin), or story fixtures ship to consumers. There is **no `.npmignore`
   anywhere in the repo** — packaging is governed solely by `files` arrays, and
   `libs/ui-rnative/package.json` ships all of `src`.

### The inner `Components/` segment — dissolved

*Decided: option B.*

Inside each viz lib the tree is `src/lib/{config.ts, utils/, Components/}`. That
inner `Components/` is **dissolved** — chart folders move up one level, giving
`Components/visualization/LineChart/`, consistent with `Components/core/Button/`.

**155 imports cross that boundary** — 78 on web, 77 on RN — and each loses
exactly one `../`:

| specifier | web | RN | becomes |
| --- | --- | --- | --- |
| `'../../config'` | 24 | 22 | `'../config'` |
| `'../../../config'` | 13 | 14 | `'../../config'` |
| `'../../utils/…'` | 28 | 28 | `'../utils/…'` |
| `'../../../utils/…'` | 13 | 13 | `'../../utils/…'` |

**Do not touch `'../utils'`** (3 occurrences, RN only, under
`Components/CartesianChart/RevealAnimation/`). Those resolve to the
component-local `CartesianChart/utils.ts`, not the shared `lib/utils/` — a naive
textual `sed` on `../utils` would silently repoint them. Every viz component
folder has its own `utils.ts`, so the rewrite must be **resolution-aware**: strip
one `../` only where the specifier resolves into `src/lib/`. A miss is a loud
`tsc` error, never silent.

### Types & peers

8. **`@types/d3-scale` / `@types/d3-shape` must be real `dependencies`**, not
   dev — `utils/types.ts:1` re-exports d3-scale types into the public barrel.
9. **Add `react-native-gesture-handler` and `react-native-worklets` to
   `libs/ui-rnative` peerDependencies** with a `peerDependenciesMeta` optional
   block. `.npmrc:1` sets `legacy-peer-deps=true`, so there is zero local signal.
10. **Reanimated range: `^4.1.0`** (ui-rnative's, the narrower of the two).
    The viz package's `>=4.0.0` is discarded. *Decided.*

### Test infrastructure

11. **Union `transformIncludePatterns` into `libs/ui-rnative/jest.config.ts:3-12`**
    — add `@react-native/js-polyfills`, `react-native-gesture-handler`,
    `react-native-worklets`, `d3-.*`, `internmap`. d3-scale and d3-shape are pure
    ESM; without this the folded chart tests fail loudly.
12. **Merge three missing `jest.mock` blocks** (`react-native-svg`,
    `react-native-gesture-handler`, `react-native-worklets`) plus
    `useReducedMotion` into `libs/ui-rnative/jest.setup.ts`. The two setups
    **disagree** on `useAnimatedStyle`: ui-rnative evaluates the callback, viz
    returns `{}`. Chart assertions were written against the non-evaluating
    variant and must be re-checked, not assumed.

### Project graph

13. Delete four project references: `tsconfig.json:10,16`,
    `apps/app-sandbox-rnative/tsconfig.json:9`, `tsconfig.app.json:27`.
14. `apps/app-sandbox-rnative/package.json:17` plus three import sites
    (`LineCharts.tsx:9`, `DonutCharts.tsx:12`, `Legends.tsx:8`).
15. Regenerate `package-lock.json`; verify no `extraneous` stub survives.

### Storybook

16. **Web: relocate `StoryDecorator.tsx`** from the deleted
    `libs/ui-react-visualization/.storybook/` into `libs/ui-react/.storybook/`
    and re-depth its **8** imports (two different depths). It stays because it
    adds `p-32` padding the global `withStorybookProviders` decorator does not —
    dropping it would produce 8 gratuitous Chromatic diffs.
    **RN: delete `StoryDecorator.tsx` outright.** *Decided.* Remove the import
    and unwrap the JSX in all 4 stories (12 sites). `libs/ui-rnative/.storybook/preview.tsx:64-66`
    already applies `withProvidersDecorator` with a `brand` global, whereas the
    viz decorator hardcodes `ledgerLiveThemes` — dropping it un-pins RN charts
    from ledger-live and puts them on the brand switcher. The 4 stories have
    never been snapshotted, so there is no baseline to disturb; do give them a
    visual check.
17. `libs/ui-react/.storybook/main.ts:9` → `../src/**/*.mdx`; delete `:11-12`.
    There are **8** web chart MDX pages (not 6), and **0** RN ones.
18. `libs/ui-rnative/.storybook/main.ts:9-10` — the existing `../src/lib/**`
    glob **already matches** the relocated chart stories, so no widening is
    needed; just delete the dead comment at `:11`. Note this means the 4 RN
    chart stories are enabled **whether or not anyone decides to** — excluding
    them would require writing a negated glob on purpose.
19. **Delete `libs/ui-rnative/.storybook/main.ts:38-50`** — a self-alias mapping
    `@ledgerhq/lumen-ui-rnative` to `../src/index.ts` plus an
    `optimizeDeps.exclude`. Once charts live inside that lib, any surviving
    self-import becomes a genuine cycle in the Storybook Vite graph. Web has no
    such alias — which is why `chromatic.yml:37-40` pre-builds ui-react. The two
    platforms are asymmetric here.
20. Re-depth the 3 cross-boundary `DocTable` imports.
21. **Label the fold PR `chromatic`.** `chromatic.yml:21-24` only runs on push to
    `main` or on a PR carrying that label — otherwise the first run happens on
    the merge commit, after review is closed.

### Story IDs — RN charts get `rnative-*` ids

*Decided: enable the RN chart stories and give them explicit ids.*

All **8** web chart stories already set an explicit `id:` (`react-xaxis`,
`react-donutchart`, …), so their permalinks are path-independent and survive the
move untouched. The **4 RN chart stories set none** — left alone they would enter
Storybook as title-derived `visualization-linechart--*`, violating the
platform-prefix contract at `.claude/agents/sync-doc-links.md:44` and producing
nothing the doc-link agent can map.

Add `id: 'rnative-linechart'`, `'rnative-point'`, `'rnative-referenceline'`,
`'rnative-scrubber'` in the same PR. RN charts thereby get visual coverage for
the first time — they currently ship nowhere.

### Docs, tooling, agent guidance

22. `sonar-project.properties:6` (blocker); `pr.yml:123,127,139,140` (no-op cleanup).
23. **`.vscode/settings.json:17-18`** — `eslint.workingDirectories` pointing at
    deleted folders. Silent: contributors get different in-editor lint results
    from CI.
24. **The agent-drift set, as one atomic edit.** `scripts/check-agent-docs-drift.mjs`
    enforces the AGENTS.md Libraries table ↔ filesystem bijection, but it is
    *partial*: deleting the libs and fixing only AGENTS.md still fails on
    `component-styling` and `component-testing`; fixing those turns CI **green
    while `release-plan/SKILL.md:65,67` still documents the deleted packages**.
    Full set: `AGENTS.md:10-11,24,26` · `component-styling/SKILL.md:8,25,26,63`
    (`:63` is an unprefixed Review-check exemption the drift script cannot see —
    left stale, the RN charts' deliberate geometry constants start getting
    flagged as token violations) · `component-testing/SKILL.md:8,30,44` ·
    `release-plan/SKILL.md:65,67,72` · `component-anatomy/SKILL.md:10,89,90,116` ·
    `code-connect/SKILL.md:25,143` · `component-mdx/SKILL.md:105` ·
    `pr-review/SKILL.md:74,167` · `component-styling/references/react.md:1,117`
    and `rnative.md:1,84-87` · `.claude/agents/sync-doc-links.md:69,141,158` ·
    `CONTRIBUTING.md:27-31` · `.github/ISSUE_TEMPLATE/bug_report.yml:19-20`.
25. **Consumer-facing docs — the only items that reach users.**
    `SetupTailwind.mdx:77-81` (delete) and `:83-88` (an orphaned "legacy path"
    paragraph whose code block was already removed, now reading as if it
    describes the viz import) · `libs/ui-react/ai-rules/RULES.md:29` · **add**
    the `/visualization` entry point to both `ai-rules/RULES.md` files. Both
    `ai-rules` directories ship inside the published tarballs.

### Verified clean — no action needed

CODEOWNERS · `.claude/hooks/lint-fix.sh` (uses `nx affected`, self-adapting) ·
`.editorconfig` · `.prettierignore` · `vercel.json` · `.mcp.json` / `.cursor/mcp.json` ·
**i18n** (zero translation hits in either viz tree; no locale merge) · **RN native
build** (`react-native.config.js` is 7 lines; no Podfile or gradle edit) · **Figma
Code Connect** (no `.figma.tsx` in either viz tree). The two Storybook Vercel
deploys are configured in the dashboard, not in-repo — worth one line in the PR
description, nothing to decommission.

---

## PR sequence

| PR | Content |
| --- | --- |
| **1** | ui-react: move + barrel + Vite entry + export key + `external` + self-import rewrite + `tsconfig.lib.json` excludes + delete the lib + `AGENTS.md` row + Storybook globs + `tailwind.config.ts` globs. **Label `chromatic`.** |
| **2** | ui-rnative: same, plus jest config/setup union, peer deps, sandbox app (3 imports + package.json + 2 tsconfigs), Storybook self-alias removal, RN story ids. **Label `chromatic`.** |
| **3** | Pack-and-install smoke test + subpath tree-shaking fixture (see acceptance) |
| **4** | Codemod in `migrator` |
| **5** | Docs, skills, agent guidance, `.vscode`, sonar, issue template |
| **6** | `npm deprecate` both packages; coordinate the ledger-live bump |

`npm deprecate` operates on already-published versions and needs no source, so
deleting first is correct — do **not** try to publish a final release from a
deleted project.

Nx release (`nx.json:155-158`, `projects: ["libs/*"]`) self-adapts on folder
deletion. Only ui-react and ui-rnative need a `patch` version plan.

## Acceptance criteria

1. `npm pack --dry-run` on both packages, tarballs installed into a scratch app
   that imports one chart — **resolves and renders**.
2. `dist/.../visualization/index.js` exists and is non-trivial after a build.
3. A second tree-shaking fixture imports the subpath and asserts: it resolves,
   `d3-` appears in *that* bundle, and `d3-` and `visualization/` appear in
   **neither** the main-barrel bundle nor its CSS.
4. `verify-bundle.mjs` extended to read the emitted `index-*.css` and require a
   chart-only utility to be present when charts are imported.
5. No `dist/node_modules/` directory in either published package.
6. Public API unchanged apart from the specifier — **including the chart-math
   utils**, which `src/index.ts` re-exports today via `export * from './lib/utils'`.
7. `npm run check:agent-docs` passes **and** a manual grep for the old package
   names returns only historical transcripts.
8. Web chart stories keep their Chromatic baselines; RN chart stories have
   `rnative-*` ids.

## Consequences

**Accepted costs.** The hard cut breaks any consumer who upgrades ui-react
without running the codemod — mitigated by the codemod and `npm deprecate`, not
eliminated. d3 becomes install weight for every consumer, including those who
never import a chart; criterion 3 proves it is not *bundle* weight.

**Deferred, deliberately.** The chart math stays forked — `ticks.ts`,
`scales.ts`, `types.ts` still exist twice after the fold, now inside two libs
rather than two packages. `__stories__/` stays inconsistent with the co-located
convention. These are follow-up tickets, not part of DLS-1022.

## Alternatives considered

**Shim package** — keep the old names as thin re-exports. Rejected: two
published surfaces for one implementation, indefinitely, and no migration
pressure. Revisit only if ledger-live coordination proves impossible.

**Keep the viz libs and extract a shared `visualization-core`** — fixes the
fork but not the "charts are a separate product" framing, and leaves the peer
dependency, the pinned version, and the split Storybook in place.
