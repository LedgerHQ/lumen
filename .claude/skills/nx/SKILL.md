---
name: nx
description: Nx workspace commands and guidelines for running tasks, generators, and using Nx MCP tools
---

# Nx

This is an **Nx 22.5.3** monorepo using **npm**. Prefer the **Nx MCP server** over
guessing about the workspace — it reflects the live project graph and config.

## Use the MCP server first

- `nx_workspace` — understand the project graph / architecture, and surface
  project-graph or config errors, before answering workspace questions.
- `nx_project_details` — inspect a single project's targets and config.
- `nx_docs` — fetch up-to-date Nx docs for any configuration/best-practice
  question instead of assuming.
- `nx_visualize_graph` — show task/project dependencies.
- `nx_current_running_tasks_details` / `nx_current_running_task_output` — inspect
  tasks already running in the user's terminals; rerun with `nx run <taskId>` so
  it executes in the same Nx context. Don't offer to rerun a `continuous` task.

## Generators

When scaffolding, drive it through the MCP flow rather than hand-writing files:
`nx_generators` to list, `nx_generator_schema` for options, then
`nx_open_generate_ui` and read back `nx_read_generator_log`. Keep options minimal;
use `nx_available_plugins` if no generator fits.

## Commands

- Run anything with `nx run <project>[:target]`; targets live in each project's
  `project.json` (or are inferred from config).
- The canonical common commands (test / lint / typecheck / build / storybook) and
  the package↔lib mapping live in the `Commands` and `Libraries` sections of
  `AGENTS.md` — not duplicated here.
