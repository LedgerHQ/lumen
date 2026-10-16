# DLS ticket templates

Markdown bodies for the Atlassian MCP. Keep every section short; delete one
that doesn't apply rather than writing "N/A".

## Bug

```markdown
## Context
Who hit it, where (consumer app + screen), link to the consumer ticket.

## Steps to reproduce
1.

## Expected
## Actual
Screenshot or video if visual.

## Environment
- Platform: web / iOS / Android
- Lumen package + version:
- Consumer app + version:

## Links
Figma, Storybook story, Slack thread.
```

## Task

```markdown
## Context
Why this is needed, and for whom (consumer team, design request).

## Scope
- What changes (component, props, tokens, docs).
- Out of scope:

## Acceptance criteria
- [ ]

## Links
Figma, consumer ticket, ADR, related DLS tickets.
```

## Epic

```markdown
## Goal
The project scope in 2–3 lines, and who it serves.

## Scope
One line per component or change, as in the spreadsheet tab.

## Links
Spreadsheet tab, Figma file, parent initiative.
```
