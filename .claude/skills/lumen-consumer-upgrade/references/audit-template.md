# Audit template

Fill in every section, even when empty ("none"). Keep it factual: hits with
`file:line`, no fixes yet.

```markdown
# Lumen audit: <repo>

## Versions
| Package | Installed (lockfile) | Target | Releases behind |
|---|---|---|---|

Tailwind: <version> · Package manager: <npm|pnpm|yarn> · Workspaces: <paths>

## Blockers
<rows whose fix says Stop, Lumen packages the catalog doesn't know, anything else that stops the upgrade. "None" otherwise.>

## Breaking changes crossed
| Row | Hits | Where (file:line, first 5) | Effort |
|---|---|---|---|
<every selected catalog row, hits = 0 included>

Skipped (already past their version): <ids>

## Uncatalogued (from the API diff)
<removed exports, tokens or classes the app uses that no catalog row explains: name, file:line, package version range>

## Judgment calls needed
<one bullet per ⚖️ hit: the call site, the options, the catalog default>

## Replacements (♻️)
| Row | Local version (file) | Safe to replace? (the row's check) | Plan |
|---|---|---|---|

## Visual review list
<screens or components hit by 👁 rows>

## Out of scope (follow-ups)
<findings outside the upgrade, Lumen packages to adopt, Lumen gaps…>
```
