---
applyTo: "**"
---

# Review routing — all files

For every changed file, follow the **`pr-review`** skill
(`/.claude/skills/pr-review/SKILL.md`): derive the touched libs, map each to its
platform via the `Libraries` table in `/AGENTS.md`, then apply the owning topic
skill's `## Review checks` (`component-architecture`, `component-styling`,
`component-testing`, `component-anatomy`, `component-stories`, `component-mdx`,
`code-connect`, `release-plan`).

This file is a deterministic hook only — it restates no rules. The skills are the
single source of truth; when this pointer and a skill disagree, the skill wins.
