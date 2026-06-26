---
  Sync all Storybook documentation links to the stable permalink scheme and keep
  them consistent across the codebase and Figma. Use when the user asks to sync doc
  links, fix Storybook URLs, check link consistency, update Figma dev-mode links, or
  after Storybook permalinks/story ids change.
name: sync-doc-links
model: claude-opus-4-8[]
description: Sync & fix Storybook doc links across repo JSDoc/docs and Figma dev links
readonly: false
---

# Sync Doc Links

Keep Storybook documentation links consistent everywhere: repo source (JSDoc `@see`,
MDX, README, RULES.md, icon template) and Figma dev-mode links. The stable story
`id`s are the single source of truth.

## Hard rule: dry-run first, then wait for approval

This agent runs in two phases with a mandatory gate between them:

1. **Phase 1 — Dry-run audit (READ-ONLY).** Inspect everything and compute exactly what would change. Make NO edits, NO `--fix`, and NO Figma writes.
2. **Approval gate.** Output a single consolidated dry-run report and STOP. Wait for the developer to explicitly approve (e.g. "apply" / "yes"). 
3. **Phase 2 — Apply.** Only after explicit approval, perform exactly what the report described.

NEVER edit files or write to Figma before the developer accepts the report. If they ask for changes, adjust and re-present the report. Do not commit; leave changes staged for review.

## Canonical scheme

- React docs: `https://ldls.vercel.app/?path=/docs/react-<slug>--docs`
- React Native docs: `https://ldls-react-native.vercel.app/?path=/docs/rnative-<slug>--docs`
- Icon gallery stories: `…/?path=/story/<prefix>-icon--base&args=name:<IconName>` (the `Base` story; `<prefix>` = `react` or `rnative`)
- `<slug>` = the component story's stable meta `id` minus the platform prefix (e.g. `react-amountinput` -> slug `amountinput`). Slugs are lowercase, no separators.
- Platform is decided by file path / library: anything under `libs/ui-rnative*` -> `rnative-` on `ldls-react-native.vercel.app`; otherwise `react-` on `ldls.vercel.app`.

## Source of truth (build this first, every run)

Derive the valid ids and platform availability from the story files — never hardcode:

```bash
# All stable ids (also tells you which slugs exist per platform)
rg --no-filename -o "id:\s*'(react|rnative)-[a-z0-9]+'" libs --glob '*.stories.tsx' | sort -u
```

- `react-<slug>` ids come from `libs/ui-react*/**`; `rnative-<slug>` from `libs/ui-rnative*/**`.
- A slug exists on a platform only if a `*.stories.tsx` defines that `<prefix>-<slug>` id. Build a `slug -> {react, rnative}` map and only ever emit links for platforms that actually have the page. Examples that are single-platform: `menu`, `select`, `dialog`, `popover`, `sidebar`, `pagination`, `table`, `linechart` (React only); `bottomsheet`, `optionlist`, `tabbar` (RN only).

This complements the lint rule `tools/eslint/storybook-stable-story-id.mjs`, which enforces that every component story has a correct `id`.

## NEVER rewrite these (protected, MDX-only docs, not components)

Leave ids starting with `foundations-`, `getting-started-`, or `style-system-` exactly as they are.

## Mapping rules (used to compute canonical targets)

- `core-<slug>` / `primitives-<slug>` / any old-taxonomy id (`action-`, `communication-`, `containment-`, `selection-`, `navigation-`, `layout-`, `media-graphics-`, `input-`, `text-`) -> take the slug (last hyphen segment; overrides: `addressfieldinput->addressinput`, `search->searchinput`) and emit `<prefix>-<slug>`.
- `symbols-interface-icons` -> `<prefix>-icon`; `symbols-crypto-icons` -> `react-cryptoicon`.
- Legacy hosts/prefixes: `lumen-ldls.vercel.app` and `react-native_…` -> canonical host + `rnative-<slug>`.
- Always validate a computed target id against the source-of-truth set. If the target id does not exist, do NOT rewrite — list it under "needs manual review".

---

# Phase 1 — Dry-run audit (READ-ONLY)

Gather everything that WOULD change. Do not write anything in this phase.

### 1a. Consistency (read-only lint — NO `--fix`)

```bash
npx nx run-many -t lint -p @ledgerhq/lumen-ui-react @ledgerhq/lumen-ui-rnative @ledgerhq/lumen-ui-react-visualization
```

Note any story missing/with an incorrect `id` (the `storybook-stable-story-id` rule), and whether it is autofixable.

### 1b. Repo links (grep only)

Find stale links. ripgrep skips dotfiles, so pass `--hidden` to catch `.storybook/`.

```bash
rg --hidden -n '(/docs/(core|primitives)-|symbols-interface-icons|symbols-crypto-icons|lumen-ldls\.vercel\.app|react-native_|/docs/(action|communication|containment|selection|navigation|layout|media-graphics|input|text)-)' libs
```

For each hit, compute the canonical replacement (mapping rules above), preserving query args (`&args=name:...`) and the relative-vs-absolute form. Collect `(file, old -> new)`.

Also find `@see` duplicates (same URL on a `Storybook` and a `Guidelines` line) to dedupe to just `Guidelines`:

```bash
rg --pcre2 --multiline -n 'Storybook\}\n \* @see \{@link [^\n]* Guidelines\}' libs
```

### 1c. Figma diff (read-only — only if `FIGMA_API_TOKEN` is set)

Token needs scopes `file_dev_resources:read` + `file_dev_resources:write`. File key: `FIGMA_COMPONENTS_FILE_KEY` or default `JxaLVMTWirCpU0rsbZ30k7`. Request network permission. If no token, skip Figma and say so in the report.

Note: the Figma MCP `use_figma` runtime does NOT implement `getDevResourcesAsync` ("not yet supported"), and `documentationLinks` is capped at 1. Dev links MUST be read/written via the REST `dev_resources` API. Use `use_figma` (read-only) only to enumerate component nodes/names when REST is insufficient.

- `GET /v1/files/:key/dev_resources` and `GET /v1/files/:key/component_sets` (name + node_id).
- For each Storybook dev link, parse slug + platform (RN if host is `ldls-react-native.vercel.app`, or url has `react-native_`, or name contains "RN"; else React). For component sets with no link, match the set name (normalize: lowercase + strip non-alphanumeric; aliases `tilebuttons->tilebutton`, `dialogsheet->dialog`) to a slug.
- Desired per node: a React link if the slug exists on React, an RN link if it exists on RN. Names `"<Component> React - Storybook"` / `"<Component> RN - Storybook"`.
- Compute the diff vs current: creates / updates / deletes, plus skipped (non-Storybook links and unmatched legacy components like `counter`, `radio`, `slider`, `donut-chart`, `legend`, `snackbar` — never touched). DO NOT call POST/PUT/DELETE in this phase.

---

# Approval gate (REQUIRED — do not skip)

Output one consolidated dry-run report, then STOP and ask the developer to approve before applying:

- Repo links to rewrite: grouped `file: old -> new` (with a total count).
- `@see` dedups: list of files.
- Consistency: lint findings, which are autofixable.
- Figma: `N creates / N updates / N deletes` with a small sample, plus skipped/unmatched.
- Needs manual review: targets whose canonical id does not exist.

If there is nothing to change, say so and stop. Otherwise wait for explicit approval ("apply"/"yes"). Only then proceed to Phase 2. If the developer asks for adjustments, revise and re-present the report.

---

# Phase 2 — Apply (ONLY after explicit approval)

Apply exactly what the approved report described.

### 2a. Repo link rewrites

Use `--hidden` file lists; `xargs` can fail in this sandbox, so prefer a `while read` loop:

```bash
rg --hidden -l '(/docs/core-|symbols-interface-icons|symbols-crypto-icons)' libs/ui-react | while IFS= read -r f; do
  perl -pi -e 's{/docs/core-}{/docs/react-}g; s{symbols-interface-icons}{react-icon}g; s{symbols-crypto-icons}{react-cryptoicon}g' "$f"; done
rg --hidden -l '(/docs/core-|/docs/primitives-|symbols-interface-icons)' libs/ui-rnative | while IFS= read -r f; do
  perl -pi -e 's{/docs/core-}{/docs/rnative-}g; s{/docs/primitives-}{/docs/rnative-}g; s{symbols-interface-icons}{rnative-icon}g' "$f"; done
```

Confirm the SVGR template `libs/ui-react/src/utils/icon-template.ts` points at `react-icon--base`.

### 2b. `@see` dedup

For each duplicate pair, remove the `Storybook` line and keep only the `Guidelines` line.

### 2c. Consistency autofix

```bash
npx nx run-many -t lint -p @ledgerhq/lumen-ui-react @ledgerhq/lumen-ui-rnative @ledgerhq/lumen-ui-react-visualization --fix
```

### 2d. Figma writes

Back up first (`GET /v1/files/:key/dev_resources` saved to disk), then reconcile (idempotent):

- `POST /v1/dev_resources` `{ dev_resources: [{ name, url, file_key, node_id }] }` for missing links.
- `PUT /v1/dev_resources` `{ dev_resources: [{ id, name, url }] }` to rewrite existing links to canonical.
- `DELETE /v1/files/:key/dev_resources/:id` for stale/duplicate Storybook links. GOTCHA: deletion is file-namespaced — `DELETE /v1/dev_resources/:id` returns 404.

---

# Phase 3 — Verify & final report

```bash
rg --hidden -n '(/docs/(core|primitives)-|symbols-interface-icons|symbols-crypto-icons|lumen-ldls\.vercel\.app|react-native_)' libs   # expect none
npx nx run-many -t lint -p @ledgerhq/lumen-ui-react @ledgerhq/lumen-ui-rnative @ledgerhq/lumen-ui-react-visualization
```

For Figma, re-`GET` dev_resources and assert every link uses a canonical host with a `react-`/`rnative-` id.

Output a concise final report: repo links rewritten, `@see` dedups, Figma created/updated/deleted, and anything left for manual review. Remind the developer to rotate any `FIGMA_API_TOKEN` passed via env.
