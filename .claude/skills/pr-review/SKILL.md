---
name: pr-review
description: >-
  Review a PR or the current branch for a Lumen design-system change — routes
  each changed file to React (web/Tailwind) or React Native (useStyleSheet)
  guidelines, checks the Nx version plan, and reports a flat, severity-scored
  finding list. Use when the user asks to review a PR, review code changes,
  check a branch, do a local code review, or provides a GitHub PR URL.
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

Derive the touched libs from the changed paths (`git diff origin/main...HEAD
--name-only | cut -d/ -f1-2 | sort -u`), map each to its platform via the
`Libraries` table in `AGENTS.md`, then apply the matching topic skill's
`## Review checks`. Applying the wrong platform's rules is the main failure mode
— decide deliberately.

The concrete, diff-verifiable violations for each topic live in that topic
skill's `## Review checks` table — this skill does **not** restate them:

| Topic | Skill (see its `## Review checks`) |
| --- | --- |
| API design & composition (props, compound, controlled state, parity) | `component-architecture` |
| Styling (Tailwind vs `useStyleSheet`) | `component-styling` |
| Tests (Vitest vs Jest) | `component-testing` |
| File/folder layout & required files | `component-anatomy` |
| Stories | `component-stories` |
| MDX docs | `component-mdx` |
| Code Connect | `code-connect` |
| Version plan | `release-plan` (scored below) |

Rules:

- A single PR often touches **both** platforms (a component usually ships on web
  and native together). When both `ui-react*` and `ui-rnative*` are touched,
  apply **both** the web and RN review checks and add the **API-parity check**:
  prop names, defaults, and variant vocabulary should match across the two
  implementations unless there's a platform reason not to (`Parity`).
- **Never apply Tailwind rules to an RN file or `useStyleSheet` rules to a web
  file.** The token *vocabulary* is shared (`bg-muted` ↔ `t.colors.bg.muted`),
  the *mechanism* is not.
- **Visualization / lib exceptions** are described once in the `Libraries` table
  and in each skill's Review checks (e.g. RN charts under
  `Components/visualization/` use `useTheme()` + flat stories, no `.mdx`/figma).
  Don't flag files a lib does not use.
- `libs/design-core/**`: the CSS/Tailwind tokens and the JS theme objects must
  stay in sync (see the `figma-token-sync` skill). If a token is added/changed
  on one side only, flag it under `Consistency`.
- `libs/utils-shared/**`: cross-platform TS/React — apply the shared criteria
  below, no styling rules.

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
check, see `component-styling`'s Review checks.

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

The rules — prop naming, positive booleans, minimal public API, `Base*Props`
layering, compound composition, controlled/uncontrolled state, cross-platform
parity, memoization — are owned by the `component-architecture` skill. Apply its
`## Review checks` table here (routed above); this skill does not restate them.

### Docs vs implementation consistency

- `.stories.tsx` and `.mdx` must reflect the current API — no references to
  removed/renamed props, default values match the implementation, interactive
  examples still work. (Not applicable to visualization libs.)

## Version plan check

The version-plan **rules** (when a plan is required, the exemption list, the
path→package mapping, filename convention, always-`patch`, one-package-per-file)
live in the `release-plan` skill — the single source. Load it if you need the
detail. Here, just verify and score:

```bash
git diff origin/main...HEAD --name-only -- .nx/version-plans/
```

- Production code under `libs/*/src/` changed but **no plan exists** → **Major
  (8/10)**, category `Release`. (A PR touching only exempt files needs no plan.)
- Bump type is **not** `patch` → **Moderate (6/10)**, `Release`, recommend
  `patch`.
- A single file **groups multiple packages** (should be one file per package) →
  **Moderate (6/10)**, `Release`.
- Plan names the **wrong package** for the changed paths (see the mapping in
  `release-plan`) → **Moderate (6/10)**, `Release`.

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

[Fill in the required-files checklist from `component-anatomy` for the component's
lib, marking each item pass/fail]

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
