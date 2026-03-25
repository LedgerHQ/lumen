---
name: pr-review
description: >-
  Review a local PR branch against origin/main for code quality, consistency, performance,
  type safety, and completeness. Use when the user asks to review a PR, review code changes,
  check a branch, or do a local code review.
---

# PR Review

## Setup

1. Fetch latest origin and determine the diff:

```bash
git fetch origin main
git diff origin/main...HEAD --stat
git diff origin/main...HEAD
git log origin/main...HEAD --oneline
```

2. Read the full diff to understand every changed file. Group changes by category:
   - New files (additions)
   - Modified files
   - Deleted files

3. For each changed file, read the full file (not just the diff) to understand context around the changes.

## Review Process

For each file or logical group of changes, evaluate against the criteria below. Produce findings with a severity score.

### Severity Scale

- **10/10 Critical** -- Bugs, crashes, data loss, security vulnerabilities. Must fix before merge.
- **8-9/10 Major** -- Wrong abstraction, missing error handling, broken accessibility, type unsafety that compiles but fails at runtime.
- **6-7/10 Moderate** -- Performance flaws, code smells, inconsistency with codebase patterns, missing tests for important paths.
- **4-5/10 Minor** -- Naming inconsistencies, suboptimal patterns, missing JSDoc on public API, style deviations.
- **1-3/10 Nit** -- Cosmetic issues, optional improvements, personal preference.

### Review Criteria

#### 1. Correctness and Logic

- Does the code do what it claims?
- Are edge cases handled (null, undefined, empty arrays, error states)?
- Are async operations handled correctly (race conditions, cleanup)?

#### 2. Type Safety

- No `any` types unless explicitly justified.
- No type assertions (`as`) that hide real type mismatches.
- Generic types are used appropriately (not overly broad or overly narrow).
- Return types declared on top-level module functions (except JSX components).

#### 3. Codebase Consistency

Cross-reference with existing patterns in the repo. Look for:

- **Props drilling**: Props must be drilled to the top-level element. Nested refs/classNames use different prop names.
- **cva usage**: Use `cva` at file top when there are variants; inline classNames when few.
- **Shared disabled context**: Components with `disabled` must consume `useDisabledContext`. Compound components providing disabled must use `DisabledProvider`.
- **Design tokens**: No raw Tailwind colors (`text-gray-500`), no raw typography (`font-bold`, `text-sm`). Use project tokens (`text-base`, `body-2-semi-bold`, `bg-muted`, etc.).
- **Size tokens**: No arbitrary values (`w-[108px]`). Use tokens from `primitives.ts`.
- **Tailwind classes**: Never concatenated (`text-${color}`). Always complete strings. Use `cn()` for conditional composition.
- **Naming**: Components use PascalCase, other files use camelCase.
- **Imports**: Check for correct barrel imports, no deep imports into other library internals.
- **Base UI vs Radix**: If using Base UI, data attributes should be `data-[open]`/`data-[closed]` not `data-[state=open]`/`data-[state=closed]`.

#### 4. Performance

- Unnecessary re-renders (missing `useMemo`, `useCallback` where objects/functions are passed as props to memoized children).
- Large inline objects or arrays created on every render.
- Missing `key` props or incorrect key usage in lists.
- Expensive computations not memoized.
- Unnecessary DOM nodes or wrapper elements.

#### 5. Abstraction Quality

- Is the abstraction at the right level? Not too granular, not too monolithic.
- Are responsibilities clearly separated (types, implementation, tests, stories)?
- Is the public API minimal and intentional? No unnecessary props or exports.
- Are internal implementation details properly hidden?

#### 6. API Quality

- Is the public API self-explanatory? Could a consumer misuse a prop because its name or type is ambiguous?
- Are prop names consistent with established conventions in the codebase (e.g., `onOpenChange` not `onToggle`, `appearance` not `variant`)?
- Are boolean props phrased positively (`overlay` not `noOverlay`) and default to the most common use case?
- Could a consumer accidentally pass conflicting props with no warning (e.g., `open` without `onOpenChange`)?
- Are required vs. optional props intuitive? Does the component fail silently when a needed prop is omitted?
- Are `children` render-function signatures and generic payloads typed clearly enough that consumers don't need to read source code?
- Do JSDoc descriptions on public props convey intent, not just type info?

#### 7. Code Clarity

- Can a new developer understand this code without extra context?
- Are complex algorithms or business logic commented (but no trivial comments)?
- Are variable and function names descriptive?
- Is control flow straightforward (no deeply nested ternaries, no obscure patterns)?

#### 8. Error Handling and Robustness

- Are error boundaries or error states considered?
- Are optional/nullable values handled safely?
- Are user-facing error messages helpful?

#### 9. Design Principles (SOLID / Clean Code)

**Single Responsibility**
- Does each file, function, and component do exactly one thing? Flag components that mix data-fetching, state management, and presentation.
- Are hooks doing too much? A hook that manages state *and* derives data *and* subscribes to events should be split.

**Open/Closed**
- Can behavior be extended without modifying existing code? Prefer composition (render props, compound components, slots) over growing switch/if chains.
- Adding a new variant, size, or feature should not require editing unrelated branches in existing code.

**Liskov Substitution**
- Can wrapper components be swapped for the element they extend? If a component spreads `ComponentPropsWithRef<'button'>`, it must actually forward those props and refs faithfully.
- Avoid restricting the contract of an extended type (e.g., omitting `onClick` from a button wrapper without justification).

**Interface Segregation**
- Are prop types bloated? Components should not accept large prop objects where only a subset is used per use case. Prefer separate compound components or config objects.
- Avoid "god" context objects that force all consumers to depend on values they don't need.

**Dependency Inversion**
- Do components depend on abstractions (context, props, callbacks) rather than concrete implementations?
- Avoid hard-coded internal dependencies that make testing or reuse impossible (e.g., importing a specific API client inside a UI component).

**General Clean Code**
- Functions should be short and do one thing. Flag functions longer than ~40 lines or with more than 3 levels of nesting.
- No dead code (unused variables, unreachable branches, commented-out blocks).
- DRY: Flag duplicated logic that should be extracted into a shared utility or hook.
- Prefer declarative patterns over imperative (e.g., `.map`/`.filter` over manual `for` loops with push, `cn()` over manual string concatenation).
- Guard clauses over nested `if/else` pyramids (early return).
- Magic numbers and strings should be named constants.

---

## Component Addition Checklist

When the PR adds a new component, verify every item. Mark each as pass/fail in the review output.

```
Component Completeness:
- [ ] /ComponentName/ComponentName.tsx    -- Implementation exists
- [ ] /ComponentName/types.ts             -- Types in separate file with JSDoc
- [ ] /ComponentName/ComponentName.test.tsx -- Tests exist with meaningful coverage
- [ ] /ComponentName/ComponentName.stories.tsx -- Storybook stories exist
        - [ ] Has `Base` story (not `Default` or `Primary`)
        - [ ] Has `{Property}Showcase` stories for key variants
        - [ ] Parameters include layout: 'centered', backgrounds: { default: 'light' }
- [ ] /ComponentName/ComponentName.mdx    -- Documentation with Overview + Implementation tabs
- [ ] /ComponentName/ComponentName.figma  -- Figma code-connect file (if applicable)
- [ ] /ComponentName/index.ts             -- Barrel file exports component and types
- [ ] Parent index.ts                     -- Component exported from Components/index.ts
- [ ] Types exported                      -- `export type *` from barrel
- [ ] Component exported                  -- `export *` from barrel
```

### Types File Quality

- All public prop types have JSDoc descriptions.
- Types use the project's type aliases (e.g., `PopoverSide`, `PopoverAlign`) not inline unions when reused.
- No `React.FC` pattern (use plain function components).
- `ComponentPropsWithRef<'element'>` used for HTML element extension.

### Test Quality

- Tests cover: rendering, user interaction (open/close), controlled state, callbacks, disabled states.
- Uses `vitest` and `@testing-library/react` (not Jest for ui-react).
- Targets elements via `data-testid` or text content.
- No snapshot tests unless explicitly justified.

### Stories Quality

- Stories named per convention: `Base`, `{Property}Showcase`, `With{Feature}`.
- Each story demonstrates a single concept clearly.
- Interactive stories (checkbox, radio, controlled) use React state in render function.

---

## Output

If the review is short (fewer than ~15 findings), output directly in chat.
If it is long, write the full review to a temp file at `.cursor/tmp/pr-review-[branch-name].md` and tell the user the path.

### Format

The review is a **flat, scored list** -- one item per finding, sorted by severity (highest first). No nested headings per file; each item is self-contained.

```markdown
# PR Review: [branch-name]

## Summary
[1-3 sentence overview of the PR's purpose and scope]

**Files changed**: X | **Added**: +X | **Removed**: -X

## Component Checklist (if new component)

[Fill in the checklist from the "Component Addition Checklist" section above, marking each item pass/fail]

## Findings

| # | Severity | Category | File | Finding |
|---|----------|----------|------|---------|
| 1 | 9/10 | Type Safety | `types.ts` | Uses `any` for payload type |
| 2 | 7/10 | Consistency | `Menu.tsx` | Raw Tailwind color `text-gray-500` instead of `text-muted` |
| 3 | ... | ... | ... | ... |

### Details

**1. [Finding title]** -- 9/10 Type Safety -- `types.ts:42`
[Description of the issue in 1-3 sentences]
> **Fix**: [Concrete code suggestion or action]

**2. [Finding title]** -- 7/10 Consistency -- `Menu.tsx:26`
[Description]
> **Fix**: [Suggestion]

...

## Verdict

| Severity | Count |
|----------|-------|
| Critical (10) | X |
| Major (8-9) | X |
| Moderate (6-7) | X |
| Minor (4-5) | X |
| Nit (1-3) | X |

**Recommendation**: [Approve | Approve with comments | Request changes]
```

### Key rules for output

- Each finding has exactly one severity score, one category, and one file reference.
- Categories are strictly: `Correctness`, `Type Safety`, `Consistency`, `Performance`, `Abstraction`, `API Quality`, `Clarity`, `Robustness`, `Design Principles`.
- Include line numbers when possible (`file.tsx:42`).
- The summary table comes first for a quick scan; the details section follows for depth.
- If there are zero findings, say so explicitly and recommend approval.

## Tips

- Always read the full file, not just the diff hunk, to catch issues with surrounding context.
- Compare with similar existing components in the codebase for pattern alignment.
- Check that the PR doesn't accidentally remove or break existing exports.
- Verify that new dependencies are added to the correct `package.json` (peer vs dev).
