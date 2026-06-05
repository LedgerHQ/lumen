---
'@ledgerhq/lumen-ui-react-visualization': patch
---

refactor: adapt overflow_buffer from 50 to 25px
docs: add Storybook stories and MDX guides for the chart components

Add progressive stories and `.mdx` documentation for `LineChart` and its
sub-components (`XAxis`, `YAxis`, `Point`, `ReferenceLine`, `Scrubber`), backed
by shared story fixtures and consistent dimensions. Documentation only — no
runtime/component changes.
