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
<Tailwind v3, unknown package name, anything that stops the upgrade. "None" otherwise.>

## Breaking changes crossed
| Row | Hits | Where (file:line, first 5) | Effort |
|---|---|---|---|
<every selected catalog row, hits = 0 included>

## Uncatalogued (from the API diff)
<removed exports, tokens or classes the app uses that no catalog row explains: name, file:line, package version range>

## Judgment calls needed
<one bullet per ⚖️ hit: the call site, the options, the catalog default>

## cn
- Local helpers: <files, and whether each has its own tailwind-merge config>
- App restores Tailwind font sizes: <yes/no, where>
- Plan: <re-export / keep and flag>

## Visual review list
<screens or components hit by 👁 rows>

## Out of scope (follow-ups)
<hex colors, arbitrary values, lint-plugin adoption, Lumen gaps…>
```
