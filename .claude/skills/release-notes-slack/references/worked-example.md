# Worked examples

Three real Lumen releases, end to end. The third is the one to study: it broke
two packages while still shipping as an ordinary patch bump, which is what a
breaking change looks like here.

PR numbers arrive in one of two shapes depending on how the page was copied —
bare `(#823)` from the rendered Releases page, or `([#823](…/pull/823))` from the
raw release body. Both produce the same output, since the repo is always
`LedgerHQ/lumen` and the URL can be reconstructed from the number.

---

## Example 1 — six-package GitHub dump

The common case: one coordinated bump across the whole monorepo, with the same
handful of PRs echoed in every package block.

### Input

```
@ledgerhq/lumen-ui-react@0.1.54
lumen-release-bot released this 2 hours ago · 3 commits to main since this release
 @ledgerhq/lumen-ui-react@0.1.54  92756d3
0.1.54 (2026-08-19)
🩹 Fixes
feat(LineChart,DonutChart): create util for tweaking contrast unsafe colors (#823)
chore(lint): prefer Record over index signatures for typescript-eslint stylistic (#835)
fix(DataTable): type context with RowData instead of any (#835)
feat(Card): add appearance prop to CardFooter (#836)
feat(symbols): add new icons from Figma (#837)
fix(Trend): omit minus sign from negative values (#838)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-utils-shared to 0.1.11
Updated @ledgerhq/lumen-design-core to 0.1.26
❤️ Thank You
Abla Ammami @aammami-ledger
Cursor @cursoragent
Miguel Mano @aquelemiguel
Simon Bruneaud
Simon.b @gamegee
Assets 2
Loading

@ledgerhq/lumen-ui-rnative@0.1.58
0.1.58 (2026-08-19)
🩹 Fixes
chore(lint): prefer Record over index signatures for typescript-eslint stylistic (#835)
feat(Card): add appearance prop to CardFooter (#836)
feat(symbols): add new icons from Figma (#837)
fix(Trend): omit minus sign from negative values (#838)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-utils-shared to 0.1.11
Updated @ledgerhq/lumen-design-core to 0.1.26
❤️ Thank You
Abla Ammami @aammami-ledger
Cursor @cursoragent
Simon.b @gamegee
Assets 2
Loading

@ledgerhq/lumen-design-core@0.1.26
0.1.26 (2026-08-19)
🩹 Fixes
feat(LineChart,DonutChart): create util for tweaking contrast unsafe colors (#823)
chore(lint): prefer Record over index signatures for typescript-eslint stylistic (#835)
feat(symbols): add new icons from Figma (#837)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-utils-shared to 0.1.11
❤️ Thank You
Abla Ammami @aammami-ledger
Cursor @cursoragent
Miguel Mano @aquelemiguel
Simon Bruneaud
Simon.b @gamegee
Assets 2
Loading

@ledgerhq/lumen-utils-shared@0.1.11
0.1.11 (2026-08-19)
🩹 Fixes
chore(lint): prefer Record over index signatures for typescript-eslint stylistic (#835)
❤️ Thank You
Simon.b @gamegee
Assets 2
Loading

@ledgerhq/lumen-ui-react-visualization@0.1.34
0.1.34 (2026-08-19)
🩹 Fixes
feat(LineChart,DonutChart): create util for tweaking contrast unsafe colors (#823)
refactor(DonutChart): extract contrast-safe series colors into useContrastSafeSeries (#823)
fix(DonutChart): draw near-zero segments at a minimum arc instead of letting them vanish, and label a share too small to round as `<0.1%` (#831)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-utils-shared to 0.1.11
Updated @ledgerhq/lumen-design-core to 0.1.26
Updated @ledgerhq/lumen-ui-react to 0.1.54
❤️ Thank You
Abla Ammami @aammami-ledger
Miguel Mano @aquelemiguel
Simon Bruneaud
Assets 2
Loading

@ledgerhq/lumen-ui-rnative-visualization@0.1.35
0.1.35 (2026-08-19)
🩹 Fixes
feat(LineChart,DonutChart): create util for tweaking contrast unsafe colors (#823)
refactor(DonutChart): extract contrast-safe series colors into useContrastSafeSeries (#823)
fix(DonutChart): draw near-zero segments at a minimum arc instead of letting them vanish, and label a share too small to round as `<0.1%` (#831)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-utils-shared to 0.1.11
Updated @ledgerhq/lumen-design-core to 0.1.26
Updated @ledgerhq/lumen-ui-rnative to 0.1.58
❤️ Thank You
Abla Ammami @aammami-ledger
Miguel Mano @aquelemiguel
Simon Bruneaud
Assets 2
Loading
```

### Output

```
**Lumen — New Releases** · 2026-08-19

**Packages updated**
- `@ledgerhq/lumen-design-core@0.1.26`
- `@ledgerhq/lumen-ui-react@0.1.54`
- `@ledgerhq/lumen-ui-react-visualization@0.1.34`
- `@ledgerhq/lumen-ui-rnative@0.1.58`
- `@ledgerhq/lumen-ui-rnative-visualization@0.1.35`
- `@ledgerhq/lumen-utils-shared@0.1.11`

**Changes**
- Contrast-safe colors for LineChart and DonutChart ([#823](https://github.com/LedgerHQ/lumen/pull/823))
- Near-zero DonutChart segments drawn at a minimum arc, sub-0.1% shares labelled `<0.1%` ([#831](https://github.com/LedgerHQ/lumen/pull/831))
- `Record` over index signatures across the codebase ([#835](https://github.com/LedgerHQ/lumen/pull/835))
- DataTable context typed with `RowData` instead of `any` ([#835](https://github.com/LedgerHQ/lumen/pull/835))
- `appearance` prop on CardFooter ([#836](https://github.com/LedgerHQ/lumen/pull/836))
- New icons from Figma ([#837](https://github.com/LedgerHQ/lumen/pull/837))
- Minus sign omitted from negative Trend values ([#838](https://github.com/LedgerHQ/lumen/pull/838))

**Breaking changes**
None.
```

### Why it came out that way

- **19 raw change lines collapsed to 7.** #835 alone appears in four package
  blocks and #823 in four; each is stated once.
- **#823 appears twice inside a single block** (the `feat` and its follow-up
  `refactor`) in both visualization packages. That is one change to a reader, so
  it is one bullet.
- **#835 stayed as two bullets.** The lint rule and the DataTable typing landed
  in the same PR but are unrelated to a consumer, so sharing a PR number is not a
  reason to merge them. Dedupe on the change, not the number.
- **Package order was re-sorted alphabetically**, not left in the order the dump
  happened to list them.
- **`ui-react` sorts before `ui-react-visualization`, which sorts before
  `ui-rnative`** — compare the full package string, so `react` < `rnative`.
- **Everything was filed under `🩹 Fixes`** by the release bot even though four
  of the six subjects are `feat` or `chore`. The section header carries no
  information; the subject does.
- **Summaries are noun phrases.** "create util for tweaking contrast unsafe
  colors" became "Contrast-safe colors for LineChart and DonutChart" — what
  changed for a consumer, not how it was implemented.
- **All six bumps are patches** with no `!` subjects and no removed exports, so
  Breaking changes is `None.`

---

## Example 2 — two-package shorthand

Same template, hand-written input, no PR numbers anywhere.

### Input

```
Lumen release 14/08

* Link renders as Text with onPress so links flow inline without affecting line height
* MediaBanner keeps a fixed height whatever the description line count
* BaseButton moved to internal components, Button/IconButton/MediaButton types derived from it
* new standalone display-only Legend component in visualization

Package version update:
@ledgerhq/lumen-ui-rnative@0.1.57
@ledgerhq/lumen-ui-react-visualization@0.1.33
```

### Output

```
**Lumen — New Releases** · 2026-08-14

**Packages updated**
- `@ledgerhq/lumen-ui-react-visualization@0.1.33`
- `@ledgerhq/lumen-ui-rnative@0.1.57`

**Changes**
- Inline `Link` rendering via Text + onPress
- Fixed `MediaBanner` height regardless of description length
- `BaseButton` moved to internal components
- Standalone display-only `Legend` component

**Breaking changes**
None.
```

### Why it came out that way

- **No PR numbers in the source, so no links.** Don't invent them and don't drop
  the bullet.
- **With no PR numbers to sort by, source order is kept** — the ascending-PR rule
  exists to make output reproducible, and source order does the same job here.
- **The two packages were swapped** into alphabetical order.
- **`14/08` became `2026-08-14`.** The header date format stays consistent no
  matter how the input wrote it.

---

## Example 3 — a breaking release that still bumped as a patch

Every version here is an ordinary patch. The only thing marking this as breaking
is the `!` on `refactor!:` and the indented `BREAKING CHANGE:` block underneath.

### Input

```
@ledgerhq/lumen-ui-rnative@0.1.56
0.1.56 (2026-08-13)
🩹 Fixes
refactor!: regroup `Components` into `core`, `internal`, `primitives`, `animations`, and `symbols` subfolders. `Icon` is no longer exported from the package root (moved to the internal group); the `Animations` export is now folded into the `Components` barrel and the `./symbols` subpath export resolves under the new layout. (#825)
  BREAKING CHANGE: `BaseInput` is no longer public (moved to the internal group) and should be replaced by `TextInput`.
feat(BaseInput): add `readOnly` prop (aligns with React) and document read-only AddressInput/TextInput stories (#830)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-design-core to 0.1.25
❤️ Thank You
Cursor @cursoragent
Simon.b @gamegee
Assets 2
Loading

@ledgerhq/lumen-ui-react@0.1.53
0.1.53 (2026-08-13)
🩹 Fixes
refactor!: regroup `Components` into `core`, `internal`, and `symbols` subfolders. (#825)
  BREAKING CHANGE: `BaseInput` is no longer public (moved to the internal group) and should be replaced by `TextInput`; `BaseButton` (and `BaseButtonProps`) is no longer public (moved to the internal group) and should be replaced by `Button`, `IconButton`, or `MediaButton`; the `./symbols` and `./*` subpath exports now resolve under the new layout.
feat(BaseInput): hide the clear button when readOnly; add read-only AddressInput/TextInput stories (#830)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-design-core to 0.1.25
❤️ Thank You
Cursor @cursoragent
Simon.b @gamegee
Assets 2
Loading

@ledgerhq/lumen-ui-rnative-visualization@0.1.33
0.1.33 (2026-08-13)
🩹 Fixes
feat(DonutChart): add reveal animation (#820)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-design-core to 0.1.25
Updated @ledgerhq/lumen-ui-rnative to 0.1.56
❤️ Thank You
Miguel Mano @aquelemiguel
Assets 2
Loading

@ledgerhq/lumen-ui-react-visualization@0.1.32
0.1.32 (2026-08-13)
🩹 Fixes
feat(DonutChart): add reveal animation (#820)
🧱 Updated Dependencies
Updated @ledgerhq/lumen-design-core to 0.1.25
Updated @ledgerhq/lumen-ui-react to 0.1.53
❤️ Thank You
Miguel Mano @aquelemiguel
Assets 2
Loading

@ledgerhq/lumen-design-core@0.1.25
0.1.25 (2026-08-13)
🩹 Fixes
fix(generate-symbols): keep hand-maintained files under the symbols output by cleaning only generated SVG subdirs, and emit lowercase symbol directories to match the Components/symbols layout (#825)
❤️ Thank You
Simon.b @gamegee
Assets 2
Loading
```

### Output

```
**Lumen — New Releases** · 2026-08-13

**Packages updated**
- `@ledgerhq/lumen-design-core@0.1.25`
- `@ledgerhq/lumen-ui-react@0.1.53`
- `@ledgerhq/lumen-ui-react-visualization@0.1.32`
- `@ledgerhq/lumen-ui-rnative@0.1.56`
- `@ledgerhq/lumen-ui-rnative-visualization@0.1.33`

**Changes**
- Reveal animation on DonutChart ([#820](https://github.com/LedgerHQ/lumen/pull/820))
- Symbols generator keeps hand-maintained files and emits lowercase directories ([#825](https://github.com/LedgerHQ/lumen/pull/825))
- Read-only support on TextInput and AddressInput ([#830](https://github.com/LedgerHQ/lumen/pull/830))

**Breaking changes**
- `@ledgerhq/lumen-ui-react@0.1.53` — `Components` regrouped into `core` / `internal` / `symbols`; `BaseInput` → `TextInput`, `BaseButton` → `Button` / `IconButton` / `MediaButton` ([#825](https://github.com/LedgerHQ/lumen/pull/825))
- `@ledgerhq/lumen-ui-rnative@0.1.56` — `Components` regrouped into `core` / `internal` / `primitives` / `animations` / `symbols`; `BaseInput` → `TextInput`, `Icon` no longer exported from the package root ([#825](https://github.com/LedgerHQ/lumen/pull/825))

Full changelog: https://github.com/LedgerHQ/lumen/releases
```

### Why it came out that way

- **The versions say nothing.** `0.1.52 → 0.1.53` is what a breaking change
  looks like in this repo. The `!` and the `BREAKING CHANGE:` block are the whole
  signal.
- **#825 produced both a Breaking entry and a Changes entry.** The refactor broke
  the two component packages; the `generate-symbols` fix rode along in the same
  PR and is unrelated. One PR, two different things, so two places.
- **The two breaking bullets were kept separate** rather than merged into one
  "#825 restructured the packages" line, because the details genuinely differ —
  `ui-react` also moved `BaseButton`, `ui-rnative` also moved `Icon`.
- **Each breaking bullet says what to migrate to.** `BaseInput` → `TextInput` is
  the part a reader acts on; "moved to the internal group" is trivia.
- **The breaking refactor is absent from Changes**, even though it is also the
  single largest change in the release.
- **#830 collapsed to one line** even though react and rnative describe it
  differently ("hide the clear button when readOnly" vs "add `readOnly` prop") —
  one feature, landing on both platforms.
- **The `Full changelog:` line only appears here**, when something breaks and a
  reader may need the detail. A clean release ends at `None.`
