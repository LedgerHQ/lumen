# ADR 0003 — Design pipeline: tokens & symbols from Figma to every platform

- **Status:** Proposed
- **Date:** 2026-11-06
- **Ticket:** DLS-393 (discovery). The epic and its tickets are listed in
  [Plan](#plan).
- **Reference:** the DLS-393 discovery benchmark (Coinbase CDS, Primer,
  Spectrum, MetaMask), and the [DTCG format](https://www.designtokens.org/tr/drafts/format/).

---

## Context

Lumen takes two kinds of assets from Figma: **design tokens** (variables) and
**symbols** (icons). Both go through `internals/sync-figma`, driven by
`.github/workflows/sync-figma.yml`, which opens a PR with the result.

### Tokens today

```mermaid
flowchart TD
  F["Figma variables"] -->|"figma-export"| T["internals/sync-figma/tokens/*.json<br/>(committed)"]
  T -->|"design-tokens-etl<br/>Style Dictionary"| C["design-core/src/lib/themes/css/<br/>*.css + *-css.ts (committed)"]
  C --> P["presets/*.ts + utils/create*Plugin.ts<br/>(hand-written Tailwind)"]
  P --> W["ui-react"]
  J["design-core/src/lib/themes/js/<br/>~4,000 hand-written lines"] --> RN["ui-rnative"]
  J -.->|"breakpoints"| P
  C -.-|"jsThemeSync.test.ts<br/>colors only"| J
```

- **The ETL** (`src/automations/designTokensEtl.ts`, 347 lines) runs Style
  Dictionary 22 times: once for primitives, once per brand × theme (6), and once
  per breakpoint inside the brand loop (15, so the same 5 typography files are
  written 3 times). Transforms, filters, formats and actions are registered
  globally, and the actions are registered after the first builds start.
- **Hard-coded lists.** Brands (`enterprise`, `websites`, `ledger-live`),
  themes and breakpoints (`xs`…`xl`) are constants. The ETL reads only files
  `1.`–`4.`, so `4.breakpoint.2xl.json`, `5.icon.*`, `6.spot.*` and
  `7.motion.Mode1.json` are exported and never built. A new brand or mode in
  Figma is silently ignored.
- **Each output is written twice.** Every `-css.ts` map has a `.css` twin. Only
  the `-css.ts` maps are imported (by the presets, `createPrimitivesPlugin` and
  tests).
- **React Native gets nothing generated.** `themes/js/**` (4,018 lines across
  brands, primitives and typographies) is typed by hand after every Figma sync.
  `jsThemeSync.test.ts` compares only the `bg`, `text`, `border`, `crypto` and
  `discover` color groups; spacing, sizes, radius, typography, shadows and
  motion can drift unnoticed.
- **Motion is not exported.** `tokenFilesFromLocalVariables.ts` supports
  `BOOLEAN`, `COLOR`, `FLOAT` and `STRING`; Figma's motion collection uses
  `TIMING` and `EASING` and is skipped. `7.motion.Mode1.json` is a stale file
  that the prune added in #956 will delete on the next export.

### Values written directly in Tailwind

Some design values never pass through the token files. They are typed into the
Tailwind plugins, and typed again for React Native:

| Value                                                                | Tailwind (web)                                                           | React Native copy                                           | Drift known                         |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------- |
| Shadows (offsets, blur, `rgba(0,0,0,0.10)` / `0.25`)                 | `createShadowPlugin` in `utils/createCustomPlugin.ts`                    | `themes/js/primitives/primitives.shadows.ts`                | `shadow-2xl`: 25% web vs 20% mobile |
| Gradients (angles, stops, radial geometry)                           | `createGradientPlugin` in `utils/createCustomPlugin.ts`                  | `themes/js/primitives/primitive.gradients.ts`               | not checked                         |
| Durations and easings (`300ms ease-in`, `cubic-bezier(0.4,0,0.2,1)`) | `utils/createAnimationsPlugin.ts`, and components                        | `themes/js/primitives/primitives.motion.ts`, and components | 4 components (see ticket 5)         |
| Breakpoints                                                          | `createScreensPlugin` reads them **from the hand-written JS primitives** | `themes/js/primitives/primitives.others.ts`                 | —                                   |

### Symbols today

- `figmaDownloadSvgs.ts` downloads the icon canvas into
  `libs/design-core/symbols/icons/` (clearing it first), then
  `generate-symbols.mts` runs svgr into `ui-react` and `ui-rnative`.
- It shares nothing with the token flow: no shared Figma client, prune, check
  or diff report.
- svgr output is unformatted, so the workflow runs a repo-wide
  `lint --fix`, or about 590 files show formatting noise.
- Nothing validates names, `viewBox` or hard-coded fills.

### DTCG status of the token files

The exported files are **partly** DTCG:

| Compliant                                    | Not compliant                                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `$value`, `$type`, `$description`            | Dimensions are `$type: "number"` with no unit (about 700 entries); the ETL adds `px` (`addPxUnitToNumber`)                                  |
| `{a.b.c}` aliases                            | Font weights and families are `$type: "string"`                                                                                             |
| Figma metadata under `$extensions.com.figma` | `boolean` is not a DTCG type (2 tokens)                                                                                                     |
| One file per mode                            | No `duration`, `cubicBezier`, `shadow`, `gradient` or `typography` composites (typography is flattened, shadows and gradients live in code) |

Colors are hex strings. Whether to move to the DTCG 2025.10 color object
(`{ colorSpace, components, hex }`) is an open question for ticket 2.

---

## Decision

### Three internal projects, by stage, with folders by asset kind

```mermaid
flowchart TD
  subgraph FIG["Figma"]
    FV["Foundations file<br/>variables"]
    FS["Symbols file<br/>icon canvas"]
  end
  subgraph S1["① internals/sync-figma — only code that knows Figma"]
    XT["extract/tokens<br/>variables → DTCG"]
    XI["extract/icons<br/>canvas → SVG + icons.json"]
    WB["write-back/codeSyntax"]
  end
  subgraph SRC["Source files (committed)"]
    TF["design-sources/tokens/figma/*.tokens.json"]
    TC["design-sources/tokens/code/*.tokens.json<br/>hand-written"]
    IS["design-sources/icons/*.svg + icons.json"]
  end
  subgraph S2["② internals/design-sources — normalize + validate, in memory"]
    TM["TokenModel"]
    IM["IconModel"]
  end
  subgraph S3["③ internals/design-build — one pure function per output"]
    OT["tokens: css · tailwind · js · codeSyntax"]
    OI["icons: svg · react · rnative"]
  end
  subgraph OUT["Outputs (committed)"]
    G["design-core/src/lib/generated/{css,tailwind,js}"]
    SY["design-core/symbols/icons + ui-* symbols"]
  end
  FV --> XT --> TF
  FS --> XI --> IS
  TF --> TM
  TC --> TM
  IS --> IM
  TM --> OT --> G
  IM --> OI --> SY
  OT -.->|"code-syntax file"| WB --> FV
```

| Stage | Project                    | Job                                                                                                                         | May import                  | Writes to                                          | Nx targets                                    |
| ----- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------- | --------------------------------------------- |
| ①     | `internals/sync-figma`     | Figma REST client; extract tokens and icons; upload code syntax                                                             | `design-sources` types only | `design-sources/` source files; Figma (write-back) | `extract --kind=tokens\|icons`, `code-syntax` |
| ②     | `internals/design-sources` | Hold the source files; load → merge → validate → resolve aliases → expand brand × theme × breakpoint; svgo + validate icons | nothing internal            | nothing                                            | `validate`, `test`                            |
| ③     | `internals/design-build`   | Turn the model into every output file; write + prune + format; `--check` against git; diff report                           | `design-sources`            | generated folders in `libs/*`                      | `tokens`, `icons`, `check`, `test`            |

Nothing imports ①. The import rules are enforced by Nx tags and
`depConstraints`, like the existing `scope:internal` rule.

### Principles

1. **One direction.** Figma → source files → model → outputs. Only ① talks to
   Figma, ② never writes to disk, ③ never reads raw Figma data.
2. **Projects by stage, folders by asset kind.** The infrastructure (Figma
   client, write + prune, `--check`, diff report) is per stage and shared by
   every kind. Adding Lottie later is one folder per project and one workflow
   job.
3. **Files exist at two points only.** Source files and outputs are committed
   and reviewed. The model lives in memory, so no intermediate artifact can go
   stale.
4. **Every output is a pure function of the model.** Outputs are tested without
   a file system or network; `--check` is "run every output and compare with
   git", so a committed file can't fall behind its generator. It does not prove
   two targets agree, so a parity test keeps comparing the values the CSS and
   JS targets emit for each token.
5. **Parity before change.** Each refactor ticket keeps outputs byte-identical,
   guarded by the snapshots from ticket 1. A visible change always lands in its
   own PR with a version plan.
6. **Code syntax is an output.** ③ emits the names Figma Dev Mode shows (Tailwind
   class, `t.*` path), using the same naming function as the outputs; ① uploads
   the file. Figma and code can't disagree on a name.

### The output contract

```ts
// internals/design-build/src/core/target.ts
export type OutputFile = { path: string; contents: string };

export type Target<Model> = {
  name: string; // 'css', 'react', 'android'…
  outDir: string; // from one config file
  emit(model: Model): OutputFile[]; // pure: no fs, no Figma
};
```

The writer formats with prettier, writes, and prunes files a target no longer
emits. `--check` runs the same targets and fails on any difference with the
working tree.

### Where each kind of value lives

| Kind                                                                              | Examples                                                                                       | Lives in                                                                |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Values designers own in Figma                                                     | colors, spacing, sizes, radius, typography, icon and spot sizes, motion                        | `design-sources/tokens/figma/` (written by ①)                           |
| Values designers own that Figma variables can't hold, or that both platforms need | shadows, gradients, breakpoint min-widths                                                      | `design-sources/tokens/code/` as DTCG `shadow`, `gradient`, `dimension` |
| Mappings from Tailwind class names to variables                                   | `.heading-0 { font-size: var(--font-style-heading-0-size) … }`, theme color keys, spacing keys | generated by ③ into `generated/tailwind/`                               |
| CSS behavior with no design value and no React Native equivalent                  | scrollbar and mask utilities, keyframe shapes, web `zIndex` layers                             | hand-written in `design-core/src/lib/tailwind/plugins/`                 |

The rule: a value goes to `design-sources` if designers own it or more than one
platform needs it. Code that only wires tokens into Tailwind stays in the
plugins. If designers later move shadows or gradients into Figma, only their
source file changes.

### DTCG type mapping (ticket 2)

| Figma                                              | DTCG `$type`                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| `FLOAT` in a size, spacing, radius or border scope | `dimension` with `px` (removes `addPxUnitToNumber`)                   |
| `FLOAT` elsewhere (opacity, z-index, ratios)       | `number`                                                              |
| `STRING` font weight / family                      | `fontWeight` / `fontFamily`                                           |
| `TIMING`                                           | `duration`                                                            |
| `EASING`                                           | `cubicBezier`                                                         |
| `COLOR`                                            | `color` (format: open question)                                       |
| `BOOLEAN`                                          | dropped, or kept under `$extensions.com.figma` if a consumer needs it |

Scopes come from the Figma variable's `scopes` field; the exact mapping is
settled against the recorded API fixture.

### Folder structure

```text
internals/
├─ sync-figma/                 ① exists, slimmed down
│  └─ src/
│     ├─ client/               REST: auth, retry, rate limit, types
│     ├─ extract/
│     │  ├─ tokens.ts          variables → DTCG
│     │  └─ icons.ts           canvas → SVG + manifest
│     ├─ write-back/
│     │  └─ codeSyntax.ts      uploads ③'s code-syntax file
│     ├─ shared/
│     │  └─ writeSourceFiles.ts   write + prune
│     └─ testing/              mock client, recorded responses
├─ design-sources/             ② new
│  ├─ tokens/
│  │  ├─ figma/*.tokens.json   written by ①, never edited
│  │  └─ code/*.tokens.json    hand-written
│  ├─ icons/
│  │  ├─ *.svg                 written by ①, never edited
│  │  └─ icons.json
│  └─ src/
│     ├─ tokens/               load, validate, resolve, modes
│     └─ icons/                svgo, naming, validate
└─ design-build/               ③ new
   └─ src/
      ├─ core/
      │  ├─ target.ts          the output contract
      │  ├─ writer.ts          write + prune + prettier
      │  ├─ check.ts           --check against git
      │  └─ diffReport.ts
      ├─ tokens/
      │  ├─ css.ts  tailwind.ts  js.ts
      │  └─ codeSyntax.ts
      └─ icons/
         └─ svg.ts  react.ts  rnative.ts

libs/design-core/
├─ src/lib/
│  ├─ generated/               written by ③, never edited
│  │  ├─ css/                  today's themes/css
│  │  ├─ tailwind/             theme maps (ticket 5)
│  │  └─ js/                   today's themes/js (ticket 4)
│  └─ tailwind/                hand-written
│     ├─ presets/              today's presets/
│     └─ plugins/              today's utils/create*Plugin.ts
└─ symbols/icons/              published as ./symbols/*, path unchanged
```

Package exports stay `.`, `./cn` and `./symbols/*`, so moving folders under
`src/` is invisible to consumers. The `dist/` restructure (DLS-919) is a
separate change.

### How a sync runs

```mermaid
sequenceDiagram
  participant WF as sync-figma.yml
  participant S1 as ① sync-figma
  participant S3 as ③ design-build (reads ②)
  participant PR as Pull request
  WF->>S1: extract --kind=tokens, --kind=icons
  S1->>S1: write + prune design-sources/
  WF->>S3: tokens, icons
  S3->>S3: validate (②), emit, write + prune + format
  S3->>PR: diff report (added / changed / removed / renamed)
  WF->>PR: bot opens the PR
  Note over PR: review, version plan, merge
```

On every PR, `design-build:check` fails on invalid sources or on any output
that differs from what is committed.

---

## Plan

**Epic:** `[LUMEN] Design pipeline: tokens & symbols`. DLS-393 is its discovery
ticket. All tickets are tech tasks (no platform prefix), labeled `tech_DLS`.

```mermaid
flowchart LR
  T1["1 Safety net"] --> T2["2 Figma boundary"] --> T3["3 Token model + CSS"] --> T4["4 Generated JS theme"] --> T5["5 Tailwind + motion"]
  T3 --> T6["6 Symbols"]
  T4 --> T7["7 Governance"]
  T6 --> T7
```

### 1. Safety net for generated outputs — can start now

Freeze today's outputs so every later ticket can prove it changed nothing, and
give generated code its own folder.

- Snapshot tests: the resolved Tailwind preset (theme and generated utilities)
  per brand, the JS theme per brand and mode, and the generated symbols — path
  and content hash of every published SVG and of the React and React Native
  components and barrels, so a changed path, fill, prop or export fails even
  when no file is renamed.
- Extend `jsThemeSync.test.ts` to spacing, sizes, radius, border width,
  typography, shadows and motion. Fix each drift it finds or file a ticket
  (`shadow-2xl` is known).
- Duplicate `.css` files: confirm only tests read them, point the tests at the
  `-css.ts` maps, then remove them.
- Move-only commit: `themes/css` → `generated/css`, `themes/js` →
  `generated/js`, `presets/` and `utils/create*Plugin.ts` → `tailwind/`. Update
  the paths in `internals/sync-figma/src/config.ts`.

**Done when:** snapshots are committed and CI is green; the built `dist/` is
unchanged; version plan for `@ledgerhq/lumen-design-core`.

### 2. Figma boundary in sync-figma

Make `sync-figma` the only code that talks to Figma, and have it export every
variable as valid DTCG.

- One REST client in `src/client/` (auth, retry on rate limit, typed
  responses), used by tokens, icons and code syntax.
- Record a real `getLocalVariables` response as a fixture first; all tests run
  on recorded responses, with no network.
- The token extractor handles every variable type and applies the
  [DTCG type mapping](#dtcg-type-mapping-ticket-2), including `TIMING` →
  `duration` and `EASING` → `cubicBezier`. Decide the color format.
- Generalize `pruneStaleTokenFiles` (from #956) into `writeSourceFiles`
  (write + prune) for every kind.
- Output location unchanged; ticket 3 moves the files.
- The Style Dictionary ETL still reads these files until ticket 3 replaces it,
  and today it only adds units to bare numbers. Add a small adapter in the ETL
  that turns the new types back into today's CSS values (`dimension` objects to
  `16px`, and so on); ticket 3 deletes it with the ETL.

**Done when:** the export reproduces today's token files with corrected types,
plus the motion collection; running the ETL on them leaves `generated/css`
byte-identical (empty `git diff`); `7.motion.Mode1.json` is pruned; the
workflow and README use the new targets. No version plan (internals only).

**Depends on:** 1.

### 3. Token model and CSS output

Create `design-sources` and `design-build`, and replace the Style Dictionary
ETL with a CSS output that produces the same files.

- `design-sources`: move the token files to `tokens/figma/`, create
  `tokens/code/`. Load, merge, validate (types, references, cycles, naming, the
  same keys in every mode), resolve aliases, expand brand × theme ×
  breakpoint. Errors name the file and the token path.
- Brands and breakpoints come from the files. This builds `2xl`: a visible
  change, shipped in its own PR.
- `design-build` core: the `Target` contract, the writer (write + prune +
  prettier), `--check`, the diff report.
- CSS output, then delete `designTokensEtl.ts` and the `style-dictionary`
  dependency.
- Nx tags and `depConstraints`, `## Internals` rows in `AGENTS.md`,
  `npx nx sync`.

**Done when:** `generated/css` is byte-identical to the ticket 1 snapshot;
`check:agent-docs` passes with the two new projects; validation rules match the
designers' answers on naming and modes.

**Depends on:** 2.

### 4. Generated JS theme

Generate the React Native theme from the model and delete the hand-written
copy.

- Move the values that only exist in code into `tokens/code/`: shadows (DTCG
  `shadow`), gradients (`gradient`) and breakpoint min-widths (`dimension`),
  referencing color tokens. Motion comes from the Figma export (ticket 2);
  reconcile it with `primitives.motion.ts`.
- JS output into `generated/js`, in the exact shape `ui-rnative` reads today
  (for example `ledgerLiveThemes.dark.colors.bg.*`), including the exported
  types.
- `createScreensPlugin` reads the generated breakpoints instead of the
  hand-written JS primitives.
- Delete the hand-written files (about 4,000 lines). Replace
  `jsThemeSync.test.ts` with a parity test in `design-build` that, for every
  token in every brand × theme, compares the value the CSS target emits
  (resolved through its `var()` chain) with the value the JS target emits.
  `--check` alone wouldn't catch two emitters that disagree.
- Retire the `figma-token-sync` skill and its `AGENTS.md` row.

**Done when:** the JS theme snapshot is unchanged (apart from drifts fixed in
ticket 1); the CSS/JS parity test passes for every brand and theme;
`ui-rnative` typecheck and tests pass; version plan for
`@ledgerhq/lumen-design-core`.

**Depends on:** 3.

### 5. Generated Tailwind theme and motion tokens — needs a design decision

Feed the Tailwind preset from generated maps, and move hard-coded values onto
tokens.

- Tailwind output into `generated/tailwind`: theme maps, typography classes,
  shadow and gradient utilities from the model. The presets and plugins read
  them instead of hand-written maps and literals.
- `createAnimationsPlugin` and components use the motion tokens on both
  platforms.
- Design prerequisite: settle the web/RN mismatches — AmountDisplay 600 vs
  700 ms, Toast 300 vs 200, BaseInput label 300 vs 150, SegmentedControl 200/250
  vs 300.

**Done when:** the Tailwind snapshot is unchanged by the switch to generated
maps (a separate commit from the motion change); no hard-coded durations,
shadows or gradients remain in components or plugins; version plans for the
libs touched.

**Depends on:** 4.

### 6. Symbols on the shared pipeline

Move the icon flow onto the three stages, with the same output as today.

- ① `extract/icons`: SVGs plus `icons.json` (name, Figma node id, last
  modified) into `design-sources/icons/`, with write + prune instead of
  clearing the folder.
- ② icon model: svgo, naming, validation (`viewBox`, `currentColor`, no stray
  fills).
- ③ outputs: `svg` (published path unchanged), `react`, `rnative`, reusing the
  existing svgr templates, formatted by the writer.
- Delete `figmaDownloadSvgs.ts`, `generate-symbols.mts` and the workflow's
  `lint --fix` step.

**Done when:** generated symbols are identical to the ticket 1 snapshot; adding
a fake asset kind needs no change to `core/`.

**Depends on:** 3. Can run in parallel with 4 and 5.

### 7. Governance and docs

Make drift impossible to merge, and token or symbol changes easy to review.

- `design-build:check` on every PR.
- Diff report in the sync PR body: added, changed, removed, renamed.
- Removals and renames fail unless explicitly approved (PR label).
- `code-syntax` output from ③, uploaded to Figma by ①.
- READMEs for the three projects; update the `figma-to-code` and
  `component-styling` skills where they describe the old flow.

**Done when:** a hand edit in a generated folder fails CI; Dev Mode names match
the code for every token.

**Depends on:** 4 and 6.

---

## Acceptance criteria (epic)

- One command rebuilds every token and symbol output from committed sources,
  with no network.
- `ui-react` and `ui-rnative` read the same generated values; there is no
  hand-written copy of a design value in `themes/js` or in the Tailwind plugins.
- Every brand, theme and breakpoint present in Figma is built without code
  changes.
- CI fails on invalid sources, stale outputs, hand edits to generated files and
  unapproved removals or renames.
- Consumers see no change until a PR with a version plan says so.

## Consequences

- **Positive:** web and mobile can't drift; a Figma sync PR needs no manual
  follow-up; adding an asset kind or a platform is one folder or one target.
- **Negative:** two more Nx projects to maintain, and our own token engine
  instead of a library. The engine is small (load, validate, resolve, expand),
  and the outputs are plain functions.
- **Generated files stay committed**, so a sync PR is larger, but every token
  change is readable in review and the repo works right after a clone.

## Alternatives considered

| Option                                                    | Why not                                                                                                                                                                                                                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep Style Dictionary v4 and add a JS format              | Its globally registered transform chain is what makes today's ETL hard to follow; it has no built-in modes, so the brand × theme × breakpoint loop stays ours anyway.                                                                                               |
| Terrazzo                                                  | DTCG-only with good lint rules, but its Tailwind plugin targets Tailwind v4 `@theme` (we ship a v3-style preset), and its JS output doesn't match the `ui-rnative` shape. Its parser could later sit inside ②. Either tool can back a future Android or iOS target. |
| Two projects (boundary by folder only)                    | The stage rules would be conventions, not lint errors.                                                                                                                                                                                                              |
| Four projects (separate Figma client)                     | The client has a single caller.                                                                                                                                                                                                                                     |
| Generate outputs at build time instead of committing them | Token changes become invisible in review, and every build depends on the pipeline.                                                                                                                                                                                  |
| Publish the DTCG files                                    | No consumer has asked; every rename would become a breaking change. Adding it later is one more target.                                                                                                                                                             |

## Out of scope

- **Lottie:** a folder slot only. Figma doesn't store Lottie and the repo has
  none; designed once the source is known.
- **Android and iOS outputs:** wait for a real consumer. Ledger Live mobile is
  React Native and gets the JS theme.

## Open questions

- **Designers:** naming and mode rules that ticket 3 validates (asked on the
  DLS-393 decisions page).
- **Design:** the four motion mismatches blocking ticket 5.
- **Engineering:** DTCG color format (hex string or 2025.10 color object);
  whether `boolean` variables have any consumer.
