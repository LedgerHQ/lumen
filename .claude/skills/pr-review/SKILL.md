---
name: pr-review
description: >-
  Review a PR or the current branch for a Lumen design-system change — routes
  each changed file to React (web/Tailwind) or React Native (useStyleSheet)
  guidelines, checks the Nx version plan, and reports a flat, severity-scored
  finding list. Use when the user asks to review a PR, review code changes,
  check a branch, do a local code review, or provides a GitHub PR URL.
disable-model-invocation: false
---

# PR Review

Review a change against Lumen's conventions. The distinctive skill here is
**platform routing**: this is a cross-platform monorepo, so the same finding
category means different things in `libs/ui-react` (Tailwind) versus
`libs/ui-rnative` (`useStyleSheet`). Apply the right rules to the right files
and never leak one platform's rules onto the other.

## Setup

### Local branch

```bash
git fetch origin main
git diff origin/main...HEAD --stat
git diff origin/main...HEAD
git log origin/main...HEAD --oneline
```

### Remote PR (GitHub link)

```bash
gh pr view <PR_NUMBER> --json title,body,baseRefName,headRefName,files
gh pr diff <PR_NUMBER>
```

Then read the full diff. For each changed file, **read the whole file** (not
just the hunk) so findings account for surrounding context. Group changes into
new files, modified files, deleted files.

## Platform routing (do this first)

Derive the touched platforms from the changed paths, then load only the
reference file(s) you need. Reading the wrong platform's rules is the main
failure mode — decide deliberately.

| Path prefix | Platform | Load |
| --- | --- | --- |
| `libs/ui-react/**`, `libs/ui-react-visualization/**` | React web (Tailwind) | `references/react.md` |
| `libs/ui-rnative/**`, `libs/ui-rnative-visualization/**` | React Native (`useStyleSheet`) | `references/rnative.md` |
| `libs/design-core/**` | Token source of truth | token parity (below) |
| `libs/utils-shared/**` | Cross-platform TS/React utilities | shared criteria only, no styling rules |

Rules:

- A single PR often touches **both** platforms (a component usually ships on web
  and native together). When both `ui-react*` and `ui-rnative*` are touched,
  load **both** references and add the **API-parity check**: prop names,
  defaults, and variant vocabulary should match across the two implementations
  unless there's a platform reason not to.
- **Never apply Tailwind rules to an RN file or `useStyleSheet` rules to a web
  file.** The token *vocabulary* is shared (`bg-muted` ↔ `t.colors.bg.muted`),
  the *mechanism* is not.
- **Visualization exceptions** (`libs/ui-react-visualization`,
  `libs/ui-rnative-visualization`): stories live in a `__stories__/` subfolder,
  there is no `.mdx` or `.figma.tsx` coverage, and
  `ui-rnative-visualization` styles with `useTheme()` + inline styles rather
  than `useStyleSheet`/`lx`. Don't flag the absence of docs/code-connect there.
- `libs/design-core/**`: the CSS/Tailwind tokens and the JS theme objects must
  stay in sync (see the `figma-token-sync` skill). If a token is added/changed
  on one side only, flag it under `Consistency`.

The authoritative styling/testing rules live in the platform skills
(`react-styling`, `rnative-styling`, `react-testing`, `rnative-testing`). The
reference files here list only the **review-checkable violations** and point
back to those skills — do not restate them.

## Already enforced — do not review by hand

These are ESLint errors (see `eslint.config.mjs`) and a `Stop` hook runs
`nx affected --target=lint --fix` automatically. Flagging them by hand is noise;
spend findings on things a linter can't catch. Do **not** raise:

- Banned imports (`no-restricted-imports`): `forwardRef`, `TouchableOpacity`,
  `Animated`/`Easing`/`LayoutAnimation`, `ElementRef`, `MutableRefObject`.
- Import hygiene: `import/order`, `import/no-duplicates`, `import/no-cycle`,
  `import/no-default-export`, `import/no-unused-modules`.
- Type style: `type` over `interface` (`consistent-type-definitions`),
  `import type` (`consistent-type-imports`), `T[]` over `Array<T>`
  (`array-type`).
- Dead/unused code (`no-unused-vars`), `eqeqeq`, `no-negated-condition`,
  `default-param-last`, `no-console`, and all formatting (prettier).
- Accessibility lint (`jsx-a11y` strict) and module boundaries
  (`@nx/enforce-module-boundaries` scope tags).
- Unknown/invalid Tailwind classnames (`eslint-plugin-better-tailwindcss`).

Caveat: a **valid** Tailwind class that should be a design token
(`text-gray-500`, `font-bold`, `w-[108px]`) lints clean — that stays a **manual**
check, see `references/react.md`.

## Findings vs severity — independent

- **Number of findings is unbounded.** 0 is a valid, good result. Never pad to a
  number, never cap at one.
- **Severity (`X/10`)** rates a single finding's importance. It has nothing to do
  with how many findings there are.

## No hallucinated findings

Only report issues you can point to at a concrete `file:line`. If the code is
correct and follows conventions, report **zero findings** and recommend
approval. Never invent, pad, or raise speculative "could maybe" issues. Do not
flag style that already matches the codebase.

## Severity scale

- **10/10 Critical** — bugs, crashes, data loss, security. Must fix before merge.
- **8-9/10 Major** — wrong abstraction, missing error handling, type unsafety
  that compiles but fails at runtime, missing version plan.
- **6-7/10 Moderate** — performance flaws, inconsistency with codebase patterns,
  missing tests for important paths, wrong version-plan bump type.
- **4-5/10 Minor** — naming inconsistencies, suboptimal patterns, missing JSDoc
  on public API.
- **1-3/10 Nit** — cosmetic, optional, preference.

## Shared review criteria (both platforms)

Apply these regardless of platform; platform specifics are in the references.

### Correctness

- Does the code do what it claims? Are edge cases handled (null, undefined,
  empty arrays, error/loading states)?
- Async: race conditions, cleanup on unmount, no unhandled rejections.
- Nullable/optional values handled safely; user-facing error messages helpful.
- Comments explain **intent** (the *why*), never restate the code — flag
  comments that just narrate mechanics, and complex logic left uncommented.

### Type safety

- No `any` (lint only warns) or `as` assertions that hide a real mismatch.
- Explicit return types on module-level functions (except JSX components).
- Generics not overly broad or narrow.

### Performance

- Unnecessary re-renders: unstable objects/functions passed to memoized children.
- Large inline objects/arrays created every render; expensive work not memoized.
- List `key` correctness.

### Abstraction & API quality

- Right level of abstraction; responsibilities separated across files
  (impl / types / tests / stories / docs).
- Public API is minimal and self-explanatory. Prop names follow established
  conventions (`onOpenChange` not `onToggle`, `appearance` not `variant`).
- Boolean props phrased positively (`overlay` not `noOverlay`), sensible
  defaults. No silent failure when a needed prop is omitted.
- Public prop types carry JSDoc that conveys intent, not just the type.
- A hook that manages state **and** derives data **and** subscribes to events is
  doing too much — flag it to be split.
- Logic duplicated across components that belongs in `libs/utils-shared`.
- A wrapper that spreads `ComponentPropsWithRef<'el'>` must actually forward
  those props and `ref` faithfully (don't silently drop `onClick` etc.).

### Docs vs implementation consistency

- `.stories.tsx` and `.mdx` must reflect the current API — no references to
  removed/renamed props, default values match the implementation, interactive
  examples still work. (Not applicable to visualization libs.)

## Version plan check

Any change to production source under `libs/*/src/` requires an Nx version plan
in `.nx/version-plans/`.

```bash
git diff origin/main...HEAD --name-only -- .nx/version-plans/
```

- Exemptions are defined authoritatively in `nx.json` under
  `release.versionPlans.ignorePatternsForPlanCheck`: `*.test.*`/`*.spec.*`,
  `*.stories.*`, `*.md`, `*.mdx`, `*.figma.@(ts|tsx)`, `tsconfig*.json`,
  eslint configs, `jest.config.*`, `test-setup.*`, `*.snap`, `.storybook/**`.
  A PR touching only these needs no version plan.
- If production code changed and no version plan exists → **Major (8/10)**,
  category `Release`.
- **Bump type is always `patch`.** This is a hard convention while the library
  is in alpha — do not apply Semver, do not suggest `minor` for `feat(...)` or
  `major` for breaking changes. Anything other than `patch` → **Moderate
  (6/10)**, `Release`, recommend `patch`.
- **One package per file.** Each version-plan file lists exactly one package in
  its frontmatter. A change affecting N packages needs N files. A file grouping
  multiple packages → **Moderate (6/10)**, `Release`.
- Verify the plan references the correct package for the paths changed:

  | Path | Package |
  | --- | --- |
  | `libs/ui-react/` | `@ledgerhq/lumen-ui-react` |
  | `libs/ui-react-visualization/` | `@ledgerhq/lumen-ui-react-visualization` |
  | `libs/ui-rnative/` | `@ledgerhq/lumen-ui-rnative` |
  | `libs/ui-rnative-visualization/` | `@ledgerhq/lumen-ui-rnative-visualization` |
  | `libs/design-core/` | `@ledgerhq/lumen-design-core` |
  | `libs/utils-shared/` | `@ledgerhq/lumen-utils-shared` |

  Filename convention: `version-plan-<timestamp>-<pkg-slug>.md` (slug is the
  short name, e.g. `ui-react`, `ui-rnative-visualization`).

## Output

If the review is short (fewer than ~15 findings), return it directly. If long,
write it to `tmp/pr-review-[branch-name].md` and report the path (`tmp` is
gitignored).

The review is a **flat, scored list** — one item per finding, sorted by severity
(highest first). No per-file nesting; each item is self-contained.

```markdown
# PR Review: [branch-name]

## Summary

[1-3 sentence overview of the PR's purpose and scope]

**Platforms touched**: React web / React Native / both / design-core / utils-shared
**Files changed**: X | **Added**: +X | **Removed**: -X

## Component Checklist (if a new component was added)

[Fill in the platform-appropriate checklist from the reference file, marking
each item pass/fail]

## Findings

| # | Severity | Category | Finding | Location |
|---|----------|----------|---------|----------|
| 1 | 9/10 | Type Safety | Uses `any` for payload type | `libs/ui-react/src/lib/Components/core/Menu/types.ts:28` |
| 2 | 7/10 | Consistency | Raw Tailwind color `text-gray-500` instead of `text-muted` | `libs/ui-react/src/lib/Components/core/Menu/Menu.tsx:26` |

### Details

**1. [Finding title]** — 9/10 Type Safety — `libs/ui-react/src/lib/Components/core/Menu/types.ts:28`
[1-3 sentence description]
> **Fix**: [concrete suggestion]
```

### Key rules for output

- Each finding has exactly one severity, one category, one `file:line` location.
  Use a range (`:42-50`) when it spans lines. The location in the table must
  match the location in the details entry.
- Categories: `Correctness`, `Type Safety`, `Consistency`, `Performance`,
  `Abstraction`, `API Quality`, `Docs Consistency`, `Release`, `Parity`.
- The summary table comes first for scanning; details follow for depth.
- **Zero findings is a valid result** — say so explicitly and recommend approval.

## Tips

- Always read the full file, not just the diff hunk.
- Compare against a similar existing component in the **same** library for
  pattern alignment.
- Check the PR doesn't accidentally remove or break existing barrel exports.
- Verify new dependencies land in the correct `package.json` (peer vs dev).
