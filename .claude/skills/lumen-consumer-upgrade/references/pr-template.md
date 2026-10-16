# PR template

Title: `chore(deps): upgrade Lumen to <ui-react version>`

```markdown
## Overview

Upgrades Lumen from <installed versions> to <target versions>.

## Changes
| Catalog row | What changed | Files |
|---|---|---|

## Decisions to confirm
<every ⚖️ choice made and its alternative, e.g. "`w-400` → `w-md` (448px); alternative `w-sm` (384px)">

## Visual review
<screens to check, and why (row ids). Say whether you ran the app.>

## Follow-ups (not in this PR)
<out-of-scope findings, Lumen packages to adopt, Lumen gaps>

## Testing
- [ ] install, typecheck, lint, test, build
- [ ] old-API patterns have zero hits: <ids>
- [ ] call-site hits reviewed against their fix: <ids>
- [ ] visual review: <screens>
```
