---
name: lumen-adoption-report
description: >-
  Use when asked to check Lumen version adoption across consumer repos,
  generate the Lumen adoption report, or find which repos are behind on a
  Lumen package version.
---

# Lumen adoption report

```bash
npx nx run lumen-adoption:report     # prints the table; also writes report.md/report.html
npx nx run lumen-adoption:discover   # diffs data/consumers.json against a fresh code search, never writes it
```

Logic and details live in
[internals/lumen-adoption](../../../internals/lumen-adoption) — read its
README and source rather than duplicating them here. Present the printed
table to the user as-is; don't re-derive it. To add a repo `discover` finds,
hand-edit `internals/lumen-adoption/data/consumers.json`.
