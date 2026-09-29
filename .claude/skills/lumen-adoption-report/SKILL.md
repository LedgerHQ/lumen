---
name: lumen-adoption-report
description: >-
  Use when asked to check Lumen version adoption across consumer repos,
  generate the Lumen adoption report, or find which repos are behind on a
  Lumen package version, or who owns those repos.
---

# Lumen adoption report

```bash
npx nx run adoption-tool:report            # full markdown table (GitHub/PR/terminal)
npx nx run adoption-tool:report-summary    # Slack-ready bulleted summary instead
npx nx run adoption-tool:owners            # maps each consumer repo to its catalog team / code owners (readable summary)
npx nx run adoption-tool:discover          # diffs data/consumers.json against a fresh code search, never writes it
```

Logic and details live in
[internals/adoption-tool](../../../internals/adoption-tool) — read its
README and source rather than duplicating them here. Use `report` for a full
table, `report-summary` for Slack — present whichever one printed as-is,
don't reformat it yourself. To add a repo `discover` finds, hand-edit
`internals/adoption-tool/data/consumers.json`.
