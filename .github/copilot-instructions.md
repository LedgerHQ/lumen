# GitHub Copilot instructions

This repository's conventions are defined once in **[`/AGENTS.md`](../AGENTS.md)**
(always-on core) and in **[`/.claude/skills/`](../.claude/skills/)** (on-demand
skills). Copilot reads `AGENTS.md` natively; treat it and the relevant skill as the
source of truth. Do not duplicate that content here.

For code generation and chat: follow `AGENTS.md` and load the skill whose trigger
matches the task (see the skills index in `AGENTS.md`).

For **code review**: path-specific review guidance lives in
[`.github/instructions/`](instructions/) (`*.instructions.md`, scoped via `applyTo`).
