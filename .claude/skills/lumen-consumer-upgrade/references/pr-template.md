# PR template

Title: `chore(deps): upgrade Lumen to <ui-react version>`

```markdown
## Overview

Upgrades Lumen from <installed versions> to <target versions> and moves class
merging to `cn` from `@ledgerhq/lumen-design-core/cn`.

## Changes
| Catalog row | What changed | Files |
|---|---|---|

## Decisions to confirm
<every ⚖️ choice made and its alternative, e.g. "`w-400` → `w-md` (448px); alternative `w-sm` (384px)">

## Visual review
<screens to check, and why (row ids). Say whether you ran the app.>

## Follow-ups (not in this PR)
<out-of-scope findings, Lumen gaps, lint-plugin adoption>

## Testing
- [ ] install, typecheck, lint, test, build
- [ ] no hits left for silent rows: <ids>
- [ ] visual review: <screens>
```
