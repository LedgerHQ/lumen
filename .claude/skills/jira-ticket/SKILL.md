---
name: jira-ticket
description: >-
  Use when creating or drafting DLS (Lumen team) Jira tickets: a bug, a task,
  or an epic broken down from a tab of the Lumen scope spreadsheet. Holds the
  DLS project conventions (title prefix, issue types, epics, labels) and the
  ticket templates. Also the source of truth for finding the current sprint's
  tickets.
---

# Jira ticket (DLS)

Project `DLS`, board 3464:
https://ledgerhq.atlassian.net/jira/software/c/projects/DLS/boards/3464/backlog.
Use the Atlassian MCP.

## Title

`<prefix> <Component>: <what>`, e.g. `[M][D] Table: add show-more row`.

| Prefix | Scope |
|---|---|
| `[D]` | Desktop/web: `libs/ui-react` |
| `[M]` | Mobile: `libs/ui-rnative` |
| `[M][D]` | Both platforms |
| none | Tech task or other (tokens, tooling, CI, docs) |

The prefix order is always `[M][D]`, with no colon. Epics use `[LUMEN] <name>`.

## Type, epic, labels

- **Type**: `Bug` for something broken, `Task` for everything else, `Epic`
  for a project scope.
- **Epic** (parent): the project epic if there is one. Otherwise the current
  PI bucket: Bug → `[LUMEN] Run <PI>`, no prefix → `[LUMEN] Tech tasks <PI>`,
  `[D]`/`[M]` → `[LUMEN] functional tasks <PI>`. Bucket epics for
  several PIs stay open at once, so status doesn't tell the current one: take
  the PI of the bucket epics that the last two weeks' tickets were filed under
  (`project = DLS AND created >= -14d`, read their parent), and show it in the
  draft so the user confirms it.
- **Labels**: `tech_DLS`, plus `LUMEN_TO_REFINE` unless the ticket is ready
  to be picked up.
- **Epics** also set Dream Team (`customfield_10332`) = Lumen Team.
- Leave sprint and priority empty unless the user gives them. Assign the
  ticket to the user when they'll work on it: the `open-pr` lookup below only
  finds tickets assigned to them.

## Body

Use the template for the type in [references/templates.md](references/templates.md).
Fill what you know, delete the sections that don't apply, and never invent
repro steps or acceptance criteria. Ask instead.

## From the scope spreadsheet

One bottom tab = one project scope. Ask for the sheet link and tab if they
aren't given; read it with the Google Sheets or Drive MCP. Create one Epic for
the tab, then go through its rows (one row = one component).

Column positions vary between tabs, so find them by header name. The dev
columns that matter are **Lumen - React** (`[D]`) and **Lumen - React Native**
(`[M]`); **Lumen - Figma** is design work and never makes a dev ticket. Each
cell holds a status:

Only cells marked **To Create** get a ticket (`<Component>: create`). Every
other status (Available, Update Needed, Out of Scope, To Discuss, Ticket
Created) gets none; list To Discuss rows in the draft as open questions.

When both dev columns are To Create, create one `[M][D]` task, or split it into
`[D]` and `[M]` tasks when the platforms ship separately. Put the Comment
column and any Figma or Jira design-ticket link in the task's Context.

Once the tickets exist, write back to the sheet with the Google Sheets MCP
(`update_values`): set each cell that produced a ticket to **Ticket Created**,
and put the ticket key in the tab's Ticket column when it has one. Re-read each
cell first and only change it if it still says To Create. Without write access,
skip this step.

## Create

Creating tickets is visible to the whole team: show the drafts (title, type,
epic, labels, body) and create only after the user confirms. For a
spreadsheet breakdown, confirm the whole list once. Reply with the keys and
links.

## Current sprint lookup

For "which ticket is this?" (used by the `open-pr` skill):
`project = DLS AND sprint in openSprints() AND assignee = currentUser() ORDER BY updated DESC`.
