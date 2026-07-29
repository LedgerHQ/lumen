@AGENTS.md

## Claude Code specifics

The shared conventions above are imported from `AGENTS.md` (single source of
truth). Only Claude-Code-specific notes belong here:

- Skills live in `.claude/skills/` and load on demand — the index is in `AGENTS.md`.
- Use the **Explore** subagent for broad codebase searches rather than long
  Grep/Glob chains; run independent subagents in parallel.
- Use subagents for research and MCP data fetching (Jira, Figma, Nx) to keep the
  main context window for the actual change.
